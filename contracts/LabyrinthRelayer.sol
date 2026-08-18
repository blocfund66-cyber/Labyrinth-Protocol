// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LabyrinthRelayer
 * @notice Decentralized Automated Relayer Registry for Labyrinth V1
 * @dev Manages registered automated relayer nodes, stake requirements, and gasless withdrawal dispatching.
 *
 * ─── AUDIT FIX LOG ────────────────────────────────────────────────────────────
 * [FIX #5] MEDIUM: `minRelayerStake` (10,000 $LAB) is now ENFORCED in registerRelayer().
 *          Any address calling registerRelayer() must hold at least `minRelayerStake`
 *          $LAB tokens in their wallet. Previously, the variable was declared but
 *          never checked, allowing anyone to register as a relayer node without stake.
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * ⚠️  DEPLOYMENT STATUS: NOT DEPLOYED ON ANY BLOCKCHAIN NETWORK.
 *     This contract is in local development and audit phase only.
 */

interface IERC20Token {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract LabyrinthRelayer {

    address public governance;
    address public labToken; // [FIX #5] $LAB token address for stake verification

    /// @notice Minimum $LAB token balance required to register as a relayer node.
    uint256 public minRelayerStake = 10_000 * 1e18; // 10,000 $LAB

    struct RelayerNode {
        address relayerAddress;
        string  endpointUrl;
        uint256 feeBps;
        uint256 totalTxProcessed;
        bool    isActive;
    }

    mapping(address => RelayerNode) public relayers;
    address[] public relayerList;
    mapping(address => uint256) public relayerStakes;

    // ─── Events ───────────────────────────────────────────────────────────────
    event RelayerRegistered(address indexed relayer, string endpointUrl, uint256 feeBps);
    event RelayerStatusChanged(address indexed relayer, bool isActive);
    event MinStakeUpdated(uint256 newMinStake);
    event RelayerStaked(address indexed relayer, uint256 amount);
    event RelayerUnstaked(address indexed relayer, uint256 amount);
    event RelayerSlashed(address indexed relayer, uint256 amount);

    // ─── Modifiers ────────────────────────────────────────────────────────────
    modifier onlyGovernance() {
        require(msg.sender == governance, "LabyrinthRelayer: Only governance");
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor(address _governance, address _labToken) {
        require(_governance != address(0), "LabyrinthRelayer: Invalid governance");
        require(_labToken   != address(0), "LabyrinthRelayer: Invalid LAB token");
        governance = _governance;
        labToken   = _labToken;
    }

    // ─── Core Relayer Functions ───────────────────────────────────────────────

    /**
     * @notice Register (or update) the caller as an active relayer node.
     * @dev [FIX #5] The caller MUST hold at least `minRelayerStake` $LAB tokens.
     * @param _endpointUrl  Public HTTPS endpoint URL of the relayer node.
     * @param _feeBps       Relayer fee in basis points (max 200 bps = 2%).
     */
    function registerRelayer(string memory _endpointUrl, uint256 _feeBps) external {
        require(_feeBps <= 200, "LabyrinthRelayer: Fee cannot exceed 2%");

        if (!relayers[msg.sender].isActive) {
            // [FIX M3] Lock tokens in the contract instead of just checking balance
            require(
                IERC20Token(labToken).transferFrom(msg.sender, address(this), minRelayerStake),
                "LabyrinthRelayer: Stake transfer failed - approve contract first"
            );
            relayerStakes[msg.sender] = minRelayerStake;

            relayers[msg.sender] = RelayerNode({
                relayerAddress: msg.sender,
                endpointUrl: _endpointUrl,
                feeBps: _feeBps,
                totalTxProcessed: 0,
                isActive: true
            });
            relayerList.push(msg.sender);
            emit RelayerStaked(msg.sender, minRelayerStake);
        } else {
            relayers[msg.sender].endpointUrl = _endpointUrl;
            relayers[msg.sender].feeBps = _feeBps;
        }

        emit RelayerRegistered(msg.sender, _endpointUrl, _feeBps);
    }

    function unstakeRelayer() external {
        require(relayers[msg.sender].isActive, "LabyrinthRelayer: Not an active relayer");
        uint256 stakedAmount = relayerStakes[msg.sender];
        
        relayers[msg.sender].isActive = false;
        relayerStakes[msg.sender] = 0;
        
        if (stakedAmount > 0) {
            IERC20Token(labToken).transfer(msg.sender, stakedAmount);
        }
        
        emit RelayerUnstaked(msg.sender, stakedAmount);
        emit RelayerStatusChanged(msg.sender, false);
    }

    function slashRelayer(address _relayer, uint256 _amount) external onlyGovernance {
        require(relayerStakes[_relayer] >= _amount, "LabyrinthRelayer: Insufficient stake to slash");
        relayerStakes[_relayer] -= _amount;
        // Slashed tokens go to governance treasury
        IERC20Token(labToken).transfer(governance, _amount);
        emit RelayerSlashed(_relayer, _amount);
    }

    /**
     * @notice Deactivate a relayer node. Only callable by governance.
     * @param _relayer Address of the relayer to deactivate.
     */
    function deactivateRelayer(address _relayer) external onlyGovernance {
        require(relayers[_relayer].isActive, "LabyrinthRelayer: Not an active relayer");
        relayers[_relayer].isActive = false;
        
        uint256 stakedAmount = relayerStakes[_relayer];
        if (stakedAmount > 0) {
            relayerStakes[_relayer] = 0;
            IERC20Token(labToken).transfer(_relayer, stakedAmount);
            emit RelayerUnstaked(_relayer, stakedAmount);
        }
        
        emit RelayerStatusChanged(_relayer, false);
    }

    /**
     * @notice Record a processed transaction for a relayer (increments counter).
     * @dev Only active relayers are updated. Can be called by the core protocol.
     */
    function recordTransaction(address _relayer) external onlyGovernance {
        if (relayers[_relayer].isActive) {
            relayers[_relayer].totalTxProcessed++;
        }
    }

    /**
     * @notice Return the list of all registered relayer addresses (active + inactive).
     */
    function getActiveRelayers() external view returns (address[] memory) {
        return relayerList;
    }

    // ─── Governance Functions ─────────────────────────────────────────────────

    /**
     * @notice Update the minimum $LAB stake required for relayer registration.
     * @param _newMinStake New threshold in $LAB (18-decimal).
     */
    function setMinRelayerStake(uint256 _newMinStake) external onlyGovernance {
        minRelayerStake = _newMinStake;
        emit MinStakeUpdated(_newMinStake);
    }
}
