// Labyrinth Protocol V1 — Central Web3 & Smart Contract Configuration
// Automatically reads Sepolia contract addresses from deployed_addresses.json

import deployedAddresses from './deployed_addresses.json';

export const SEPOLIA_CHAIN_ID = 11155111;
export const HARDHAT_CHAIN_ID = 31337;

export const CONTRACT_ADDRESSES = {
  sepolia: deployedAddresses.contracts || {
    LabToken: '0x0000000000000000000000000000000000000000',
    LabyrinthGovernance: '0x0000000000000000000000000000000000000000',
    MockVerifier: '0x0000000000000000000000000000000000000000',
    LabyrinthCore: '0x0000000000000000000000000000000000000000',
    LabyrinthRelayer: '0x0000000000000000000000000000000000000000'
  }
};

// Simplified Contract ABIs for Ethers.js / Viem integration
export const LAB_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address recipient, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)"
];

export const LABYRINTH_CORE_ABI = [
  "function denomination() view returns (uint256)",
  "function currentRootIndex() view returns (uint32)",
  "function isSpent(bytes32 _nullifierHash) view returns (bool)",
  "function isKnownRoot(bytes32 _root) view returns (bool)",
  "function deposit(bytes32 _commitment, bool _enableYield) payable",
  "function withdraw(bytes _proof, bytes32 _root, bytes32 _nullifierHash, address payable _recipient, address payable _relayer, uint256 _relayerFee, uint256 _destinationChainId, bytes _poiCertificate)",
  "event Deposit(bytes32 indexed commitment, uint32 leafIndex, uint256 timestamp, bool yieldEnabled)",
  "event Withdrawal(address indexed to, bytes32 nullifierHash, address indexed relayer, uint256 relayerFee, uint256 destinationChainId)"
];

export const LABYRINTH_GOVERNANCE_ABI = [
  "function totalStaked() view returns (uint256)",
  "function stakes(address) view returns (uint256 amount, uint256 startTime, uint256 rewardDebt)",
  "function pendingYield(address user) view returns (uint256)",
  "function stake(uint256 amount)",
  "function unstake(uint256 amount)",
  "function claimYield()",
  "event Staked(address indexed user, uint256 amount)",
  "event Unstaked(address indexed user, uint256 amount)",
  "event YieldClaimed(address indexed user, uint256 reward)"
];

export const LABYRINTH_RELAYER_ABI = [
  "function minRelayerStake() view returns (uint256)",
  "function registerRelayer(string _endpointUrl, uint256 _feeBps)",
  "function getActiveRelayers() view returns (address[])"
];
