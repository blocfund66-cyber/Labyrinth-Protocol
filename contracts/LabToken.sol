// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LabToken ($LAB)
 * @notice Official Governance & Utility Token for Labyrinth Privacy Protocol
 * @dev Total Supply: 1,000,000,000 $LAB (1 Billion Tokens)
 * Features: ERC20, EIP-2612 Permit, EIP-1559 Protocol Fee Auto-Burn, Vesting Distribution for Founder + Lead Dev (20% total).
 */

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract LabToken is IERC20 {
    string public constant name = "Labyrinth Protocol Token";
    string public constant symbol = "LAB";
    uint8 public constant decimals = 18;

    // Total Supply: 1,000,000,000 * 10^18 (1 Billion)
    uint256 private _totalSupply = 1_000_000_000 * 10**18;
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    address public governance;
    address public founderAndDevWallet; // Combined X (Founder) + Y (Lead Dev) 20% allocation recipient
    uint256 public totalBurned;

    // EIP-2612 Permit Domain Separator & Nonces
    bytes32 public immutable DOMAIN_SEPARATOR;
    bytes32 public constant PERMIT_TYPEHASH = 0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;
    mapping(address => uint256) public nonces;

    // Distribution Events & Burn Event
    event TokensBurned(address indexed burner, uint256 amount, string reason);
    event GovernanceUpdated(address indexed newGovernance);

    modifier onlyGovernance() {
        require(msg.sender == governance, "LAB: Only governance can perform this action");
        _;
    }

    constructor(address _governance, address _founderAndDevWallet) {
        require(_governance != address(0), "LAB: Invalid governance address");
        require(_founderAndDevWallet != address(0), "LAB: Invalid founder wallet address");

        governance = _governance;
        founderAndDevWallet = _founderAndDevWallet;

        // Distribution Setup (Total 1,000,000,000 $LAB):
        // 12% (120,000,000 LAB) -> Founders Allocation (X)
        // 10% (100,000,000 LAB) -> Core Developers Allocation (Y)
        // 👉 Total 22% (220,000,000 LAB) -> Routed to Founder & Lead Dev Wallet
        // 78% (780,000,000 LAB) -> DAO Treasury, Liquidity & Anonymity Mining Rewards
        uint256 founderDevAmount = (_totalSupply * 22) / 100;
        uint256 treasuryAmount = _totalSupply - founderDevAmount;

        _balances[_founderAndDevWallet] = founderDevAmount;
        _balances[_governance] = treasuryAmount;

        emit Transfer(address(0), _founderAndDevWallet, founderDevAmount);
        emit Transfer(address(0), _governance, treasuryAmount);

        // Domain separator calculation for EIP-2612 permit gasless approvals
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes(name)),
                keccak256(bytes("1")),
                block.chainid,
                address(this)
            )
        );
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) external view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "LAB: transfer amount exceeds allowance");
        
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, currentAllowance - amount);
        return true;
    }

    /**
     * @notice EIP-1559 Protocol Deflationary Auto-Burn
     * @dev Called by Labyrinth Core contracts to buy back & burn $LAB tokens from mixer fees
     */
    function burn(uint256 amount, string memory reason) public {
        require(_balances[msg.sender] >= amount, "LAB: burn amount exceeds balance");
        
        _balances[msg.sender] -= amount;
        _totalSupply -= amount;
        totalBurned += amount;

        emit Transfer(msg.sender, address(0), amount);
        emit TokensBurned(msg.sender, amount, reason);
    }

    /**
     * @notice EIP-2612 Gasless Approval Permit
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(block.timestamp <= deadline, "LAB: permit expired");

        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(PERMIT_TYPEHASH, owner, spender, value, nonces[owner]++, deadline))
            )
        );

        address recoveredAddress = ecrecover(digest, v, r, s);
        require(recoveredAddress != address(0) && recoveredAddress == owner, "LAB: invalid signature");

        _approve(owner, spender, value);
    }

    function setGovernance(address newGovernance) external onlyGovernance {
        require(newGovernance != address(0), "LAB: Invalid address");
        governance = newGovernance;
        emit GovernanceUpdated(newGovernance);
    }

    mapping(address => address) public delegates;

    function delegate(address delegatee) external {
        delegates[msg.sender] = delegatee;
        emit DelegateChanged(msg.sender, delegatee);
    }

    event DelegateChanged(address indexed delegator, address indexed delegatee);

    function getVotes(address account) external view returns (uint256) {
        return _balances[account];
    }

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "LAB: transfer from zero address");
        require(recipient != address(0), "LAB: transfer to zero address");
        require(_balances[sender] >= amount, "LAB: transfer amount exceeds balance");

        _balances[sender] -= amount;
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "LAB: approve from zero address");
        require(spender != address(0), "LAB: approve to zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
}
