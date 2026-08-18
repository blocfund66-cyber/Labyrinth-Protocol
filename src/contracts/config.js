// Labyrinth Protocol V1 — Central Web3 & Multi-Chain Smart Contract Configuration
// Automatically reads Sepolia contract addresses from deployed_addresses.json

import deployedAddresses from './deployed_addresses.json';

export const SEPOLIA_CHAIN_ID = 11155111;
export const HARDHAT_CHAIN_ID = 31337;

// [FIX M4] Centralized RPC endpoints — replace with Alchemy/Infura keys for production
// Usage: import { RPC_ENDPOINTS } from '../contracts/config';
//        new ethers.JsonRpcProvider(RPC_ENDPOINTS.sepolia);
export const RPC_ENDPOINTS = {
  sepolia: import.meta.env.VITE_RPC_SEPOLIA || 'https://ethereum-sepolia-rpc.publicnode.com',
  base:    import.meta.env.VITE_RPC_BASE    || 'https://mainnet.base.org',
  mainnet: import.meta.env.VITE_RPC_MAINNET || 'https://ethereum-rpc.publicnode.com',
};

// Live Sepolia & Multi-Chain Deployed Addresses
export const CONTRACT_ADDRESSES = {
  base: {
    LabToken: '0xA578a06f60a7D2e79817128A88a0E3eCc5bb4c8B',
    LabyrinthGovernance: '0x0C30AE652AcD707F58F4384AB0E0aD087Ab667bd',
    MockVerifier: '0xA578a06f60a7D2e79817128A88a0E3eCc5bb4c8B',
    LabyrinthCore: '0xd7D96196a13aEF68048d46F8eD176d3740878a37',
    LabyrinthRelayer: '0x991396A68619897e6641C40026139982B71ac991'
  },
  sepolia: deployedAddresses.contracts || {
    LabToken: '0xA578a06f60a7D2e79817128A88a0E3eCc5bb4c8B',
    LabyrinthGovernance: '0x0C30AE652AcD707F58F4384AB0E0aD087Ab667bd',
    LabyrinthGovernor: '0x0000000000000000000000000000000000000000',
    MockVerifier: '0xa1B3296a1Ad8615B1a65D6d0dB2543Ad1Cf8Ea37',
    LabyrinthCore: '0xd7D96196a13aEF68048d46F8eD176d3740878a37',
    LabyrinthRelayer: '0x991396A68619897e6641C40026139982B71ac991'
  }
};

// 5 Ultra-Low Fee L2 / EVM Networks Configuration Parameters (< $0.05 per tx)
export const LOW_FEE_CHAINS = {
  arbitrum: {
    chainId: "0xa4b1", // 42161
    chainName: "Arbitrum One",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"],
    avgFee: "< $0.02"
  },
  base: {
    chainId: "0x2105", // 8453
    chainName: "Base L2",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org"],
    avgFee: "< $0.01"
  },
  optimism: {
    chainId: "0xa", // 10
    chainName: "OP Mainnet (Optimism)",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.optimism.io"],
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
    avgFee: "< $0.03"
  },
  polygon: {
    chainId: "0x89", // 137
    chainName: "Polygon Mainnet (POL)",
    nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
    avgFee: "< $0.01"
  },
  bsc: {
    chainId: "0x38", // 56
    chainName: "BNB Smart Chain (BSC)",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
    avgFee: "< $0.05"
  },
  solana: {
    chainId: "solana-mainnet",
    chainName: "Solana Network",
    nativeCurrency: { name: "Solana", symbol: "SOL", decimals: 9 },
    rpcUrls: ["https://api.mainnet-beta.solana.com"],
    blockExplorerUrls: ["https://solscan.io"],
    avgFee: "< $0.001"
  },
  avalanche: {
    chainId: "0xa86a", // 43114
    chainName: "Avalanche C-Chain",
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io"],
    avgFee: "< $0.03"
  }
};

// Helper: 1-Click MetaMask Network Switcher
export const switchNetworkInMetaMask = async (chainKey) => {
  const chainConfig = LOW_FEE_CHAINS[chainKey];
  if (!chainConfig || typeof window === 'undefined' || !window.ethereum) return false;

  try {
    // Attempt network switch
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainConfig.chainId }],
    });
    return true;
  } catch (switchError) {
    // If network is not added to MetaMask yet (Error Code 4902), add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [chainConfig],
        });
        return true;
      } catch (addError) {
        console.error("Could not add network to MetaMask:", addError);
        return false;
      }
    }
    console.error("Could not switch network in MetaMask:", switchError);
    return false;
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
  "function isKnownRoot(uint256 _root) view returns (bool)",
  "function getLastRoot() view returns (uint256)",
  "function verifierActive() view returns (bool)",
  "function productionMode() view returns (bool)",
  "function deposit(uint256 _commitment, bool _enableYield) payable",
  "function withdraw(bytes _proof, uint256 _root, bytes32 _nullifierHash, address payable _recipient, address payable _relayer, uint256 _relayerFee, uint256 _destinationChainId, bytes _poiCertificate)",
  "event Deposit(uint256 indexed commitment, uint32 leafIndex, uint256 timestamp, bool yieldEnabled)",
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

export const LABYRINTH_GOVERNOR_ABI = [
  "function proposalCount() view returns (uint256)",
  "function quorum() view returns (uint256)",
  "function votingDelay() view returns (uint256)",
  "function votingPeriod() view returns (uint256)",
  "function proposalThreshold() view returns (uint256)",
  "function TIMELOCK_DELAY() view returns (uint256)",
  "function getVotes(address account) view returns (uint256)",
  "function state(uint256 proposalId) view returns (uint8)",
  "function propose(string description) returns (uint256)",
  "function castVote(uint256 proposalId, uint8 support)",
  "function queue(uint256 proposalId)",
  "function execute(uint256 proposalId)",
  "function cancel(uint256 proposalId)",
  "event ProposalCreated(uint256 indexed proposalId, address proposer, string description, uint256 startBlock, uint256 endBlock)",
  "event VoteCast(address indexed voter, uint256 indexed proposalId, uint8 support, uint256 weight)",
  "event ProposalQueued(uint256 indexed proposalId, uint256 eta)",
  "event ProposalExecuted(uint256 indexed proposalId)"
];
