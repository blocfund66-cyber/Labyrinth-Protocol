// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockVerifier
 * @notice Testnet ZK-SNARK Groth16 Verifier Contract for Labyrinth V1
 * @dev Implements the IVerifier interface expected by LabyrinthCore.
 *      Used on Sepolia testnet to validate ZK proof submissions.
 */
contract MockVerifier {
    event ProofVerified(bytes32 indexed root, bytes32 indexed nullifierHash, bool result);

    /**
     * @notice Verify a Groth16 ZK-SNARK proof.
     * @param proof Encoded ZK-SNARK proof bytes.
     * @param input Public inputs array: [0] = Merkle root, [1] = nullifierHash.
     * @return Always returns true if proof is non-empty and input array has length 2.
     */
    function verifyProof(bytes memory proof, uint256[] memory input) external returns (bool) {
        require(input.length >= 2, "MockVerifier: Invalid public inputs length");
        require(proof.length > 0, "MockVerifier: Empty proof");

        bytes32 root = bytes32(input[0]);
        bytes32 nullifierHash = bytes32(input[1]);

        emit ProofVerified(root, nullifierHash, true);
        return true;
    }
}
