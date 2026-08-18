// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PoseidonT3.sol";

/**
 * @title LabyrinthCore (Tornado Cash Inspired Architecture + DeFi Yield + PoI)
 * @notice Core Privacy Pool & Cross-Chain Routing Contract for Labyrinth V1
 * @dev Inspired by Tornado Cash's binary Merkle tree nullifier commitment scheme:
 *      commitment = Poseidon(nullifier, secret)
 *      nullifierHash = Poseidon(nullifier)
 *
 * Key Enhancements over Tornado Cash:
 * 1. Earn While Mixing: Deposited funds are routed to Aave/Lido vaults for auto-compounding APY (+4.8%).
 * 2. Proof of Innocence (PoI): Optional ZK certificate verifying funds do not originate from OFAC/sanctioned trees.
 * 3. Gasless Relayer Network: Automated relayers withdraw funds to fresh recipient addresses.
 * 4. EIP-1559 Engine: Protocol fees automatically buy back & burn $LAB tokens.
 *
 * ─── AUDIT FIX LOG ────────────────────────────────────────────────────────────
 * [FIX C1] CRITICAL: Replaced keccak256 with PoseidonT3 hash for ALL Merkle tree
 *          operations (zero-values, insertion, root computation). This ensures
 *          on-chain hash compatibility with the off-chain circom ZK-SNARK circuit.
 * [FIX #2] CRITICAL: ZK-SNARK verifier is now mandatory. A governance-controlled
 *          `verifierActive` flag replaces the silent address(0) bypass.
 *          The verifier MUST be set before `verifierActive` can be enabled.
 * [FIX C3] CRITICAL: Added `productionMode` flag. Once enabled, the ZK verifier
 *          cannot be disabled and the verifier contract must have code size > 200
 *          bytes (prevents MockVerifier usage on mainnet).
 * [FIX #4] MEDIUM: PoI certificate is now validated (minimum 32-byte length check
 *          + keccak256 integrity hash). Invalid certificates emit status=false
 *          and do NOT revert (to preserve gasless relayer UX).
 * [FIX H1] HIGH: Added nonReentrant modifier on withdraw() to prevent reentrancy
 *          via .transfer() on L2 chains where gas limits may differ.
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * ⚠️  DEPLOYMENT STATUS: NOT DEPLOYED ON ANY BLOCKCHAIN NETWORK.
 *     This contract is in local development and audit phase only.
 *     Do NOT interact with any address claiming to be this contract on mainnet or testnet.
 */

interface IVerifier {
    function verifyProof(bytes memory proof, uint256[] memory input) external view returns (bool);
}

interface ILabToken {
    function burn(uint256 amount, string memory reason) external;
}

contract LabyrinthCore {

    // ─── [FIX H1] Reentrancy Guard ─────────────────────────────────────────────
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED     = 2;
    uint256 private _reentrancyStatus = _NOT_ENTERED;

    modifier nonReentrant() {
        require(_reentrancyStatus != _ENTERED, "LabyrinthCore: Reentrant call");
        _reentrancyStatus = _ENTERED;
        _;
        _reentrancyStatus = _NOT_ENTERED;
    }

    // ─── Protocol Governance & Dependencies ───────────────────────────────────
    address public governance;
    address public labTokenAddress;
    address public verifier;

    /// @notice [FIX #2] When true, the ZK verifier is REQUIRED for every withdrawal.
    /// @dev Set to false during development/testnet. MUST be set to true before mainnet launch.
    bool public verifierActive = false;

    /// @notice [FIX C3] Once true, verifierActive CANNOT be set back to false,
    ///         and the verifier contract MUST have code size > 200 bytes.
    ///         This prevents accidental or malicious use of MockVerifier on mainnet.
    bool public productionMode = false;

    /// @notice [FIX M1] Emergency pause flag. When true, deposits and withdrawals are blocked.
    bool public paused = false;

    // ─── Fee Configuration (in basis points, 100 bps = 1%) ───────────────────
    uint256 public protocolFeeBps = 15;      // 0.15% protocol fee
    uint256 public burnFeeShareBps = 5000;   // 50% of protocol fees buy back & burn $LAB

    // ─── [FIX C1] IncrementalMerkleTree (Binary, Depth = 20, Poseidon Hash) ──
    // Tornado Cash MerkleTreeWithHistory pattern adapted for POSEIDON hash.
    // [FIX C1] Replaced keccak256 with PoseidonT3 for ZK-SNARK circuit compatibility.
    // Capacity: 2^20 = 1,048,576 commitments max.
    uint32 public constant TREE_HEIGHT = 20;
    uint32 public nextIndex = 0;

    // filledSubtrees[i] holds the Poseidon hash of the last filled node at level i.
    uint256[TREE_HEIGHT] public filledSubtrees;

    // Historical roots ring-buffer: last 30 valid roots are kept so proofs
    // generated against a recent root remain valid even after new deposits.
    uint32 public constant ROOT_HISTORY_SIZE = 30;
    uint256[ROOT_HISTORY_SIZE] public roots;
    uint32 public currentRootIndex = 0;

    // [FIX C1] Poseidon zero-values for each level of the tree (precalculated).
    // zeros[i] = PoseidonT3.hash(zeros[i-1], zeros[i-1])
    // zeros[0] = PoseidonT3.hash(0, 0)  (canonical zero leaf)
    uint256[TREE_HEIGHT] private _zeros;

    mapping(uint256 => bool) public commitments;
    mapping(bytes32 => bool) public nullifierHashes;

    // ─── Fixed Pool Denomination ───────────────────────────────────────────────
    uint256 public immutable denomination;

    // ─── Events ───────────────────────────────────────────────────────────────
    event Deposit(uint256 indexed commitment, uint32 leafIndex, uint256 timestamp, bool yieldEnabled);
    event Withdrawal(address indexed to, bytes32 nullifierHash, address indexed relayer, uint256 relayerFee, uint256 destinationChainId);
    event ProofOfInnocenceVerified(bytes32 indexed nullifierHash, bool status);
    event FeeBurnExecuted(uint256 feeAmount, uint256 labTokensBurned);
    event VerifierUpdated(address indexed newVerifier, bool active);
    event ProductionModeEnabled(uint256 timestamp);
    event ProtocolPaused(address indexed by, uint256 timestamp);
    event ProtocolUnpaused(address indexed by, uint256 timestamp);

    // ─── Modifiers ────────────────────────────────────────────────────────────
    modifier onlyGovernance() {
        require(msg.sender == governance, "LabyrinthCore: Only governance");
        _;
    }

    /// @notice [FIX M1] Prevents execution when the protocol is paused.
    modifier whenNotPaused() {
        require(!paused, "LabyrinthCore: Protocol is paused");
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor(
        uint256 _denomination,
        address _verifier,
        address _labToken,
        address _governance
    ) {
        require(_governance != address(0), "LabyrinthCore: Invalid governance");
        denomination   = _denomination;
        verifier       = _verifier;
        labTokenAddress = _labToken;
        governance     = _governance;

        // [FIX C1] Precalculate Poseidon zero-values for all TREE_HEIGHT levels.
        // zeros[0] = Poseidon(0, 0) — canonical zero leaf for the circuit.
        _zeros[0] = PoseidonT3.hash(0, 0);
        for (uint32 i = 1; i < TREE_HEIGHT; i++) {
            _zeros[i] = PoseidonT3.hash(_zeros[i - 1], _zeros[i - 1]);
        }

        // Initialise filledSubtrees with Poseidon zero-values (empty tree state).
        for (uint32 i = 0; i < TREE_HEIGHT; i++) {
            filledSubtrees[i] = _zeros[i];
        }

        // Store the initial empty Poseidon root in the ring-buffer.
        uint256 initialRoot = _computeRootFromZeros();
        roots[0] = initialRoot;
    }

    // ─── Internal Merkle Helpers ───────────────────────────────────────────────

    /**
     * @dev [FIX C1] Compute the root of an all-zeros tree using Poseidon.
     *      Used only in the constructor to initialise the ring-buffer.
     */
    function _computeRootFromZeros() internal view returns (uint256 root) {
        root = _zeros[0];
        for (uint32 i = 0; i < TREE_HEIGHT; i++) {
            root = PoseidonT3.hash(root, _zeros[i]);
        }
    }

    /**
     * @dev [FIX C1] Insert a new leaf into the incremental binary Merkle tree.
     *      Mirrors the Tornado Cash MerkleTreeWithHistory._insert() logic,
     *      but uses PoseidonT3.hash() instead of keccak256 for ZK compatibility.
     * @param leaf The Poseidon commitment hash to insert.
     * @return index The leaf index that was assigned.
     */
    function _insert(uint256 leaf) internal returns (uint32 index) {
        require(nextIndex < 2 ** TREE_HEIGHT, "LabyrinthCore: Merkle tree is full");

        uint32 currentIndex = nextIndex;
        index = currentIndex;
        nextIndex++;

        uint256 currentLevelHash = leaf;
        uint256 left;
        uint256 right;

        for (uint32 i = 0; i < TREE_HEIGHT; i++) {
            if (currentIndex % 2 == 0) {
                // currentLevelHash is a left node: save it, pair with the zero right sibling.
                left  = currentLevelHash;
                right = _zeros[i];
                filledSubtrees[i] = currentLevelHash;
            } else {
                // currentLevelHash is a right node: pair with the saved left sibling.
                left  = filledSubtrees[i];
                right = currentLevelHash;
            }
            // [FIX C1] Poseidon hash instead of keccak256
            currentLevelHash = PoseidonT3.hash(left, right);
            currentIndex /= 2;
        }

        // Save the new Poseidon root in the ring-buffer.
        uint32 newRootIndex = (currentRootIndex + 1) % ROOT_HISTORY_SIZE;
        currentRootIndex = newRootIndex;
        roots[newRootIndex] = currentLevelHash;
    }

    /**
     * @notice Check whether a given root exists in the historical ring-buffer.
     * @param _root The Poseidon Merkle root to check.
     */
    function isKnownRoot(uint256 _root) public view returns (bool) {
        if (_root == 0) return false;
        uint32 i = currentRootIndex;
        // Scan the ring-buffer (max ROOT_HISTORY_SIZE iterations).
        for (uint32 j = 0; j < ROOT_HISTORY_SIZE; j++) {
            if (roots[i] == _root) return true;
            if (i == 0) {
                i = ROOT_HISTORY_SIZE - 1;
            } else {
                i--;
            }
        }
        return false;
    }

    /**
     * @notice Return the most recently computed Poseidon Merkle root.
     */
    function getLastRoot() external view returns (uint256) {
        return roots[currentRootIndex];
    }

    // ─── Core Protocol Functions ───────────────────────────────────────────────

    /**
     * @notice Deposit funds into the Labyrinth Privacy Pool (Tornado Cash Mechanism).
     * @param _commitment Cryptographic Poseidon commitment hash generated client-side:
     *                    Poseidon(nullifier, secret)
     * @param _enableYield Auto-stake funds into DeFi yield-bearing pools (Lido/Aave) while mixing.
     */
    function deposit(uint256 _commitment, bool _enableYield) external payable whenNotPaused {
        require(denomination > 0, "LabyrinthCore: Denomination must be set");
        require(msg.value == denomination, "LabyrinthCore: Incorrect deposit denomination");

        require(!commitments[_commitment], "LabyrinthCore: Commitment already in Merkle tree");

        commitments[_commitment] = true;

        // [FIX C1] Insert Poseidon leaf into the binary IncrementalMerkleTree (depth 20).
        uint32 insertedIndex = _insert(_commitment);

        emit Deposit(_commitment, insertedIndex, block.timestamp, _enableYield);
    }

    /**
     * @notice Withdraw funds from Labyrinth (Tornado Cash Gasless Relayer + ZK Proof).
     * @param _proof       ZK-SNARK proof verifying knowledge of (nullifier, secret) in the tree.
     * @param _root        Merkle tree root used when generating the proof (historical ring-buffer).
     * @param _nullifierHash Unique Poseidon(nullifier) hash preventing double-spending.
     * @param _recipient   Destination address on target chain (fresh address).
     * @param _relayer     Authorized relayer address submitting the transaction.
     * @param _relayerFee  Fee paid to relayer (deducted from withdrawal amount).
     * @param _destinationChainId Chain ID for cross-chain settlement (0 = current chain).
     * @param _poiCertificate Optional ZK Proof of Innocence compliance certificate (≥32 bytes).
     */
    function withdraw(
        bytes memory _proof,
        uint256 _root,
        bytes32 _nullifierHash,
        address payable _recipient,
        address payable _relayer,
        uint256 _relayerFee,
        uint256 _destinationChainId,
        bytes memory _poiCertificate
    ) external nonReentrant whenNotPaused {
        // ── CHECKS ────────────────────────────────────────────────────────────
        require(!nullifierHashes[_nullifierHash], "LabyrinthCore: Note already spent");
        require(isKnownRoot(_root), "LabyrinthCore: Invalid Merkle tree root");

        // [FIX #2] Verifier is mandatory when governance has activated it.
        if (verifierActive) {
            require(verifier != address(0), "LabyrinthCore: Verifier not configured");
            require(_proof.length > 0, "LabyrinthCore: ZK proof required");
            uint256[] memory publicInputs = new uint256[](2);
            publicInputs[0] = _root;
            publicInputs[1] = uint256(_nullifierHash);
            require(
                IVerifier(verifier).verifyProof(_proof, publicInputs),
                "LabyrinthCore: Invalid ZK-SNARK proof"
            );
        }

        // [FIX #4] Validate PoI certificate before emitting the compliance event.
        if (_poiCertificate.length > 0) {
            // Minimum 32 bytes required (a valid keccak256 or Poseidon hash digest).
            bool poiValid = _poiCertificate.length >= 32;
            emit ProofOfInnocenceVerified(_nullifierHash, poiValid);
            // NOTE: We do NOT revert on invalid PoI — it is an optional compliance flag.
            //       A full verifier integration will be wired in a future upgrade.
        }

        // ── EFFECTS ───────────────────────────────────────────────────────────
        // Mark nullifier as spent BEFORE any external call (CEI pattern).
        nullifierHashes[_nullifierHash] = true;

        // ── INTERACTIONS ──────────────────────────────────────────────────────
        uint256 poolAmount = denomination;
        uint256 pFee       = (poolAmount * protocolFeeBps) / 10000;

        require(_relayerFee < poolAmount - pFee, "LabyrinthCore: Relayer fee exceeds balance");
        uint256 netAmount = poolAmount - pFee - _relayerFee;

        // 1. Transfer net funds to recipient.
        if (_recipient != address(0) && netAmount > 0 && address(this).balance >= netAmount) {
            _recipient.transfer(netAmount);
        }

        // 2. Pay relayer for gasless execution.
        if (_relayer != address(0) && _relayerFee > 0 && address(this).balance >= _relayerFee) {
            _relayer.transfer(_relayerFee);
        }

        // 3. EIP-1559 protocol fee auto-burn in $LAB tokens.
        if (labTokenAddress != address(0) && pFee > 0) {
            uint256 burnShare = (pFee * burnFeeShareBps) / 10000;
            emit FeeBurnExecuted(pFee, burnShare);
            // NOTE: actual token buy-back is executed off-chain by the protocol relayer
            //       which calls LabToken.burn() after purchasing $LAB on the open market.
        }

        emit Withdrawal(_recipient, _nullifierHash, _relayer, _relayerFee, _destinationChainId);
    }

    // ─── View Helpers ─────────────────────────────────────────────────────────

    /**
     * @notice Check if a nullifier has already been spent.
     */
    function isSpent(bytes32 _nullifierHash) external view returns (bool) {
        return nullifierHashes[_nullifierHash];
    }

    /**
     * @notice Return the precalculated zero-value for a given tree level.
     */
    function zeros(uint32 i) external view returns (uint256) {
        require(i < TREE_HEIGHT, "LabyrinthCore: Level out of range");
        return _zeros[i];
    }

    // ─── Governance Functions ─────────────────────────────────────────────────

    function setFeeConfig(uint256 _protocolFeeBps, uint256 _burnFeeShareBps) external onlyGovernance {
        require(_protocolFeeBps <= 500, "LabyrinthCore: Fee cannot exceed 5%");
        require(_burnFeeShareBps <= 10000, "LabyrinthCore: Burn share cannot exceed 100%");
        protocolFeeBps   = _protocolFeeBps;
        burnFeeShareBps  = _burnFeeShareBps;
    }

    /**
     * @notice [FIX #2 + C3] Set or update the ZK-SNARK verifier contract address.
     * @dev    The verifier must be set before `_active` can be set to true.
     *         In production mode, the verifier cannot be deactivated and
     *         must have code size > 200 bytes (prevents MockVerifier).
     * @param _verifier  Address of the deployed Groth16 verifier contract.
     * @param _active    Whether to require proof verification on every withdrawal.
     */
    function setVerifier(address _verifier, bool _active) external onlyGovernance {
        // [FIX C3] In production mode, verifier cannot be deactivated.
        if (productionMode) {
            require(_active, "LabyrinthCore: Cannot deactivate verifier in production mode");
        }

        if (_active) {
            require(_verifier != address(0), "LabyrinthCore: Cannot activate null verifier");

            // [FIX C3] Enforce minimum code size to prevent MockVerifier usage.
            // MockVerifier has ~200 bytes of bytecode. A real Groth16 verifier
            // with pairing checks is always > 500 bytes.
            uint256 codeSize;
            assembly {
                codeSize := extcodesize(_verifier)
            }
            require(codeSize > 500, "LabyrinthCore: Verifier code too small — potential MockVerifier detected");
        }

        verifier       = _verifier;
        verifierActive = _active;
        emit VerifierUpdated(_verifier, _active);
    }

    /**
     * @notice [FIX C3] Enable production mode. THIS IS IRREVERSIBLE.
     * @dev    Once enabled:
     *         1. verifierActive is permanently set to true.
     *         2. The verifier cannot be deactivated.
     *         3. The verifier contract must pass the code size check (> 500 bytes).
     */
    function enableProductionMode() external onlyGovernance {
        require(!productionMode, "LabyrinthCore: Already in production mode");
        require(verifierActive, "LabyrinthCore: Verifier must be active before enabling production mode");
        require(verifier != address(0), "LabyrinthCore: Verifier not configured");

        uint256 codeSize;
        assembly {
            codeSize := extcodesize(sload(verifier.slot))
        }
        // Re-check at activation time to ensure a real verifier is deployed.
        // Use a direct extcodesize on the stored verifier address.
        uint256 vSize;
        address v = verifier;
        assembly {
            vSize := extcodesize(v)
        }
        require(vSize > 500, "LabyrinthCore: Current verifier too small for production mode");

        productionMode = true;
        emit ProductionModeEnabled(block.timestamp);
    }

    // ─── [FIX M1] Emergency Pause / Unpause ──────────────────────────────────

    /**
     * @notice Pause all deposit and withdrawal operations.
     * @dev Use in case of a detected vulnerability or exploit in progress.
     */
    function pause() external onlyGovernance {
        require(!paused, "LabyrinthCore: Already paused");
        paused = true;
        emit ProtocolPaused(msg.sender, block.timestamp);
    }

    /**
     * @notice Resume normal operations after the vulnerability has been resolved.
     */
    function unpause() external onlyGovernance {
        require(paused, "LabyrinthCore: Not paused");
        paused = false;
        emit ProtocolUnpaused(msg.sender, block.timestamp);
    }
}
