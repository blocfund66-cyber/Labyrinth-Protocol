# 🌀 Labyrinth Protocol V1

> **Next-Generation Omnichain Zero-Knowledge Privacy Crypto Mixer & DeFi Yield Engine**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-emerald.svg)](https://soliditylang.org/)
[![Cryptography](https://img.shields.io/badge/Cryptography-Poseidon%20%2F%20Groth16-violet.svg)]()
[![React](https://img.shields.io/badge/Frontend-React%2018-cyan.svg)](https://reactjs.org/)

---

## 📌 Overview

**Labyrinth Protocol** is an advanced, zero-knowledge omnichain crypto privacy mixer designed to sever on-chain links between deposit and withdrawal addresses while maximizing capital efficiency.

Inspired by the battle-tested cryptographic architecture of **Tornado Cash**, Labyrinth incorporates fixed-denomination anonymity pools built on 20-depth binary Merkle trees and Poseidon hash commitments (`commitment = Poseidon(nullifier, secret)`).

### 🌟 Key Innovations

1. **Earn While Mixing (+4.8% APY)**: Deposited funds are automatically staked into Aave v3 and Lido vaults while sitting in anonymity pools, generating passive yield.
2. **Proof of Innocence (PoI)**: Opt-in ZK compliance certificates proving funds do not originate from sanctioned wallets (OFAC / Chainalysis) without revealing private identity to CEXs.
3. **Gasless Relayer Network**: Withdraw funds anonymously to a fresh recipient wallet address without needing initial native gas funds on the destination chain.
4. **EIP-1559 $LAB Auto-Burn**: Protocol mixer fees dynamically buy back and burn $LAB tokens to enforce a deflationary token economy.
5. **Multilingual UI (i18n)**: Full 100% translation coverage for English 🇬🇧, French 🇫🇷, Chinese 🇨🇳, Japanese 🇯🇵, Russian 🇷🇺, and Arabic 🇸🇦 (with native RTL support).

---

## 📊 Tokenomics ($LAB)

- **Total Supply**: `1,000,000,000 $LAB` (1 Billion Tokens)
- **Founders Allocation (X)**: `12%` (120,000,000 $LAB)
- **Lead Dev Team Allocation (Y)**: `10%` (100,000,000 $LAB)
- **👉 Combined Founders + Dev Allocation**: `22%` (220,000,000 $LAB)
- **DAO Treasury & Anonymity Mining**: `78%` (780,000,000 $LAB)

---

## 🛠️ Architecture & Smart Contracts

- **`LabToken.sol`**: ERC-20 token with EIP-2612 permit gasless approvals and EIP-1559 fee auto-burn.
- **`LabyrinthCore.sol`**: Core Zero-Knowledge privacy pool managing Poseidon Merkle trees (depth 20), nullifiers, relayer withdrawals, and Proof of Innocence verification.
- **`LabyrinthGovernance.sol`**: Staking & Real Yield revenue share contract (80% to stakers, 20% to founder/dev wallet).
- **`LabyrinthRelayer.sol`**: Automated decentralized relayer registry.

---

## 🚀 Quickstart & Installation

```bash
# Clone the repository
git clone https://github.com/<YOUR_GITHUB_USERNAME>/Labyrinth-Protocol.git

# Enter project directory
cd Labyrinth-Protocol

# Install dependencies
npm install

# Start local dev server
npm run dev

# Run Smart Contract Backend Test Suite
npx hardhat test
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
