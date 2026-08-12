# 🌀 Labyrinth Protocol V1

> **Next-Generation Omnichain Zero-Knowledge Privacy Crypto Mixer & DeFi Yield Engine**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-emerald.svg)](https://soliditylang.org/)
[![Cryptography](https://img.shields.io/badge/Cryptography-Poseidon%20%2F%20Groth16-violet.svg)]()
[![React](https://img.shields.io/badge/Frontend-React%2018-cyan.svg)](https://reactjs.org/)
[![Audit](https://img.shields.io/badge/Audit-Internal%20V1%20Passed-green.svg)]()

---

> [!CAUTION]
> ## ⚠️ DEPLOYMENT STATUS — NOT LIVE ON ANY BLOCKCHAIN NETWORK
>
> **Labyrinth Protocol V1 is currently in active development and local audit phase.**
>
> - ❌ **NOT deployed** on Ethereum Mainnet
> - ❌ **NOT deployed** on any EVM Testnet (Sepolia, Holesky, Mumbai, etc.)
> - ❌ **NOT deployed** on any Layer 2 (Arbitrum, Optimism, Base, Polygon, etc.)
> - ❌ **No $LAB token exists** on any chain at this time
>
> **Any address claiming to be the official Labyrinth Protocol contract is a SCAM.**  
> The official deployment announcement will be made exclusively via the GitHub repository and official social channels.

---

## 📌 Overview

**Labyrinth Protocol** is an advanced, zero-knowledge omnichain crypto privacy mixer designed to sever on-chain links between deposit and withdrawal addresses while maximizing capital efficiency.

Inspired by the battle-tested cryptographic architecture of **Tornado Cash**, Labyrinth incorporates fixed-denomination anonymity pools built on **20-depth binary IncrementalMerkle trees** and Poseidon hash commitments (`commitment = Poseidon(nullifier, secret)`).

### 🌟 Key Innovations

1. **Earn While Mixing (+4.8% APY)**: Deposited funds are automatically staked into Aave v3 and Lido vaults while sitting in anonymity pools, generating passive yield.
2. **Proof of Innocence (PoI)**: Opt-in ZK compliance certificates proving funds do not originate from sanctioned wallets (OFAC / Chainalysis) without revealing private identity to CEXs.
3. **Gasless Relayer Network**: Withdraw funds anonymously to a fresh recipient wallet address without needing initial native gas funds on the destination chain.
4. **EIP-1559 $LAB Auto-Burn**: Protocol mixer fees dynamically buy back and burn $LAB tokens to enforce a deflationary token economy.
5. **Multilingual UI (i18n)**: Full 100% translation coverage for English 🇬🇧, French 🇫🇷, Chinese 🇨🇳, Japanese 🇯🇵, Russian 🇷🇺, and Arabic 🇸🇦 (with native RTL support).

---

## 🛡️ Internal Audit Status (V1 — 2026-08-12)

An internal security audit was conducted covering all Solidity contracts, the frontend DAO gate, and the i18n layer. All identified findings have been resolved:

| Finding | Severity | Contract | Status |
|---------|----------|----------|--------|
| Binary IncrementalMerkleTree (depth 20) | 🔴 Critical | `LabyrinthCore.sol` | ✅ Fixed |
| ZK Verifier mandatory enforcement | 🔴 Critical | `LabyrinthCore.sol` | ✅ Fixed |
| Reentrancy in stake/unstake (CEI pattern) | 🔴 Critical | `LabyrinthGovernance.sol` | ✅ Fixed |
| PoI Certificate validation | 🟡 Medium | `LabyrinthCore.sol` | ✅ Fixed |
| minRelayerStake enforcement | 🟡 Medium | `LabyrinthRelayer.sol` | ✅ Fixed |
| DAO mock $LAB balance flagged | 🟡 Medium | `DAOGovernance.jsx` | ✅ Fixed |

> A third-party audit (CertiK / Trail of Bits) is planned before mainnet deployment.

---

## 📊 Tokenomics ($LAB)

- **Total Supply**: `1,000,000,000 $LAB` (1 Billion Tokens)
- **Founders Allocation (X)**: `12%` (120,000,000 $LAB)
- **Lead Dev Team Allocation (Y)**: `10%` (100,000,000 $LAB)
- **👉 Combined Founders + Dev Allocation**: `22%` (220,000,000 $LAB)
- **DAO Treasury & Anonymity Mining**: `78%` (780,000,000 $LAB)

---

## 🛠️ Architecture & Smart Contracts

| Contract | Description |
|----------|-------------|
| `LabToken.sol` | ERC-20 token with EIP-2612 permit & EIP-1559 fee auto-burn |
| `LabyrinthCore.sol` | Core ZK privacy pool — **real IncrementalMerkleTree (depth 20)**, nullifiers, relayer withdrawals, PoI verification |
| `LabyrinthGovernance.sol` | Staking & Real Yield (80% stakers / 20% founder) — **reentrancy-safe (CEI + nonReentrant)** |
| `LabyrinthRelayer.sol` | Decentralized relayer registry — **10,000 $LAB stake enforced** |

---

## 🚀 Quickstart & Installation

```bash
# Clone the repository
git clone https://github.com/blocfund66-cyber/Labyrinth-Protocol.git

# Enter project directory
cd Labyrinth-Protocol

# Install dependencies
npm install

# Start local dev server (UI demo — no blockchain connection required)
npm run dev

# Run standalone cryptographic audit script
node scripts/simulate_standalone.js
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
