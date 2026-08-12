// Labyrinth Web3 Front-End Integration Layer
// Inspired by Tornado Cash Client-Side Cryptographic Note Generator & Relayer Interop

import { ethers } from 'ethers';
import deployments from './deployments.json';

// Default Fallback Contracts Manifest
export const CONTRACT_ADDRESSES = deployments.contracts || {
  LabToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  LabyrinthCore: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  LabyrinthGovernance: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  FounderAndDevWallet: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
};

/**
 * Tornado Cash Inspired Client-Side Cryptographic Note Generator
 * Format: labyrinth-v1-[chain]-[token]-[amount]-[secretHex]
 */
export function generateSecretNote(chain, token, amount) {
  const randomBytes1 = crypto.getRandomValues(new Uint8Array(16));
  const randomBytes2 = crypto.getRandomValues(new Uint8Array(16));
  
  const nullifierHex = Array.from(randomBytes1).map(b => b.toString(16).padStart(2, '0')).join('');
  const secretHex = Array.from(randomBytes2).map(b => b.toString(16).padStart(2, '0')).join('');
  
  const notePayload = `${nullifierHex}${secretHex}`;
  const note = `labyrinth-v1-${chain.toLowerCase()}-${token.toLowerCase()}-${amount}-${notePayload}`;

  const commitment = ethers.solidityPackedKeccak256(["string"], [notePayload]);
  const nullifierHash = ethers.solidityPackedKeccak256(["string"], [nullifierHex]);

  return {
    note,
    nullifierHex,
    secretHex,
    commitment,
    nullifierHash
  };
}

/**
 * Parse secret note to extract nullifier and commitment
 */
export function parseSecretNote(noteString) {
  try {
    const parts = noteString.trim().split('-');
    if (parts.length < 5 || parts[0] !== 'labyrinth' || parts[1] !== 'v1') {
      throw new Error("Invalid Labyrinth Note format");
    }

    const chain = parts[2];
    const token = parts[3];
    const amount = parts[4];
    const payload = parts[5];

    const nullifierHex = payload.substring(0, 32);
    const secretHex = payload.substring(32);

    const commitment = ethers.solidityPackedKeccak256(["string"], [payload]);
    const nullifierHash = ethers.solidityPackedKeccak256(["string"], [nullifierHex]);

    return {
      valid: true,
      chain,
      token,
      amount,
      nullifierHex,
      secretHex,
      commitment,
      nullifierHash
    };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

/**
 * Web3 Provider Helper
 */
export async function getWeb3Provider() {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return { provider, signer, address: await signer.getAddress() };
  }
  return null;
}
