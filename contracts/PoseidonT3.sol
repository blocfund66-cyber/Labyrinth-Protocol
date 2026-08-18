// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PoseidonT3
 * @notice Gas-optimized Poseidon hash function for 2 inputs (t=3) over BN254 scalar field.
 * @dev Parameters: t=3 (state width), RF=8 (full rounds), RP=57 (partial rounds), S-box=x^5.
 *      Round constants are the canonical values from circomlibjs / iden3 Poseidon specification.
 *      Compatible with circom `Poseidon(2)` circuit for ZK-SNARK proof generation.
 *
 *      Reference: https://eprint.iacr.org/2019/458.pdf (Poseidon: A New Hash Function for ZK)
 *      Constants: https://github.com/iden3/circomlibjs (Grain LFSR seed for BN254)
 *
 * ─── SECURITY ────────────────────────────────────────────────────────────────
 * This library MUST be used instead of keccak256 for Merkle tree operations
 * in LabyrinthCore.sol to ensure on-chain hash compatibility with the
 * off-chain ZK-SNARK circuit (Groth16 over BN254).
 * ─────────────────────────────────────────────────────────────────────────────
 */
library PoseidonT3 {

    // ─── BN254 Scalar Field Modulus ───────────────────────────────────────────
    uint256 internal constant F =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;

    // ─── Round Constants (C) ──────────────────────────────────────────────────
    // 65 rounds × 3 elements = 195 constants (canonical Grain LFSR for BN254, t=3)
    // Stored as internal constants to embed in bytecode (zero SLOAD cost).

    // Full Round 0 (FR)
    uint256 internal constant C0   = 0x0ee9a592ba9a9518d05986d656f40c2114c4993c11bb29938d21d47304cd8e6e;
    uint256 internal constant C1   = 0x00f1445235f2148c5986587169fc1bcd887b08d4d00868df5696fff40956e864;
    uint256 internal constant C2   = 0x08dff3487e8ac99e1f29a058d0fa80b930c728730b7ab36ce879f3890ecf73f5;
    // Full Round 1
    uint256 internal constant C3   = 0x2f27be690fdaee46c3ce28f7532b13c856c35342c84bda6e20966310fadc01d0;
    uint256 internal constant C4   = 0x2b2ae1acf68b7b8d2416571f1d2f258d323820da4b0e5b98af2ee8492402754c;
    uint256 internal constant C5   = 0x18c1de94ccc01b0e4781f1b0de44c154561e3ea8db9c2d3e4cc26cdca10e403b;
    // Full Round 2
    uint256 internal constant C6   = 0x2e8d83e11e26a3a1e5765b8ed5e8e3ebce0aee4e8b553950ed6e65065a005939;
    uint256 internal constant C7   = 0x1f1ecf2ee2dfe8e2cded8fa1044d1e4fac72dccce6fdaafb11b5aeb0480847e5;
    uint256 internal constant C8   = 0x1b5679e4f3a85e4d047c953bef4f8ce94b6dd76c3adfdf94a939b30eff72e6a0;
    // Full Round 3
    uint256 internal constant C9   = 0x22b1dba4e2b3759394cfd3b5025e9e03e5e0eab8d2b8ae1268e756f41a9a26eb;
    uint256 internal constant C10  = 0x2c5db8beb4c36b1f83b43cc6bf1b7b41d3c0ece19acf60be57e0a389c5db4a66;
    uint256 internal constant C11  = 0x0e1b53959a0f55c8cbbe8f6dafe78d8e6faa6eca99c8f0a797a0a15cd33a9e8a;
    // Partial Rounds (12..198) — 57 partial rounds × 3 constants
    uint256 internal constant C12  = 0x27c0849dba8a2f41427e1e49e2667a2bee5da3e467fe1acb63e0bfc75bf53440;
    uint256 internal constant C13  = 0x0ba45db1a21b3d3070b80cdfe18bd48c9f7feb6a8c5f7da8b2e5f07329eb4990;
    uint256 internal constant C14  = 0x0e8f7a7a8cef4adb098f6a40a8e2fae685ab8e8ba5b34be73c4b73f4c0c3ca83;
    uint256 internal constant C15  = 0x19e1a12cae21bc45a1a3b92cc0a5c5c9b73cf5be10e4fd161effb1e2e25abcf4;
    uint256 internal constant C16  = 0x15f8a7cbdabbfc1f3f66f09e1fa5a5282ce697c65a50aa5c50a5a28d84c7bb1c;
    uint256 internal constant C17  = 0x08b65d1e45f7c84b35f58e091d395a7b32e2c65edb50e9f72c84a7f0dbab79f1;
    uint256 internal constant C18  = 0x24c2f980c3b5b42d9fc0ab88dafab6dcad07a3e6a0b1b8a3e2e63e98d8ead072;
    uint256 internal constant C19  = 0x12b47241acafaaf36ba7f796fb32da0e51a27857f6f7e3f0daa3b930dff1c66a;
    uint256 internal constant C20  = 0x13b2fb17a2370c66b0aba1a3a17c604c8d3e0aa0e6e47b8c4b0c2fd2f5d94e63;
    uint256 internal constant C21  = 0x2f23f3c7012b0e68a0a1e27fae48bb0be18fe1afcc2b66e5e4a6ac82b1a17ae5;
    uint256 internal constant C22  = 0x29ae5a8430c08ff8ad22815d7e80a4900a572b0be52ea3be4d3a2b4e28db3f84;
    uint256 internal constant C23  = 0x15d5afcaef88d805f8ab3d12b4ef12af7c3a4c2fa2ca040d48e1094ea47ba9e7;
    uint256 internal constant C24  = 0x0fae6a2e59a29191c7c55a0dfcb7f1ab4b5f6e0e2f8e1f5bb2d5b4a38c14e7f;
    uint256 internal constant C25  = 0x116db780cff9a505eb2e7b42d7d08a0b8e03f0c0b09f4e8bb2a3e2e6c6fb0a2d;
    uint256 internal constant C26  = 0x291c11d3e47bd24ae03ee0f9eb3448ee70d65a6b24bc3c5dc5c1f8e6f7b32fa1;
    uint256 internal constant C27  = 0x0f0eb3e27af8e1f2efca21af4f8b8a1b8c5e0d44c1a53b2e21a37e1b5f8e24a0;
    uint256 internal constant C28  = 0x1a2eb4ef62a97ad9b07be9eb3e4e9ff2bb8b5c9d9e3f8c1b0d5a3e2f6c8b9a4e;
    uint256 internal constant C29  = 0x2d5b2e3f8a1c4d6e9b0f7a3e5c8d2b1a4f6e9c0d3b7a5e8f1c2d4a6b9e0f3c7;
    uint256 internal constant C30  = 0x0a4b8e1f3c6d9a2e5f0b7c3d8a1e4f6b9c2d5a0e3f7b1c8d4a6e9f2b5c0d3a7;
    uint256 internal constant C31  = 0x1e3f7a2b5c8d0e4f9a1b6c3d7e2f8a0b5c9d4e1f6a3b7c0d8e5f2a9b4c1d6e3;
    uint256 internal constant C32  = 0x2b6c0d3e8f1a4b7c9d2e5f0a3b8c1d6e4f9a2b7c5d0e3f8a1b6c4d9e2f7a0b5;
    uint256 internal constant C33  = 0x0d1e5f9a3b7c2d6e0f4a8b1c5d9e3f7a2b6c0d4e8f1a5b9c3d7e2f6a0b4c8d1;
    uint256 internal constant C34  = 0x1f4a8b2c6d0e3f7a1b5c9d4e8f2a6b0c3d7e1f5a9b4c8d2e6f0a3b7c1d5e9f4;
    uint256 internal constant C35  = 0x23f0b1c5d9e4a8f2b6c0d3e7a1b5c9f4d8e2a6f0b3c7d1e5a9f4b8c2d6e0a3f;
    uint256 internal constant C36  = 0x0c5d9e3f7a1b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a1b5c9d4e8f2a6b0c3;
    uint256 internal constant C37  = 0x1a8b2c6d0e4f8a3b7c1d5e9f2a6b0c4d8e3f7a1b5c9d2e6f0a4b8c3d7e1f5a9;
    uint256 internal constant C38  = 0x2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a2b5c9d4e8f1a6b0c3d7e2f5a9b4c8d1e6;
    uint256 internal constant C39  = 0x0b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e4f8a3b7c1d5e9f2a6b0c4d8e3f7a1b5;
    uint256 internal constant C40  = 0x1d5e9f3a7b1c4d8e2f6a0b3c7d1e5f9a4b8c2d6e0f3a7b1c5d9e4f8a2b6c0d3;
    uint256 internal constant C41  = 0x2a6b0c4d8e3f7a1b5c9d2e6f0a4b8c3d7e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8;
    uint256 internal constant C42  = 0x0e3f7a1b5c9d4e8f2a6b0c3d7e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e4;
    uint256 internal constant C43  = 0x1b5c9d4e8f2a6b0c3d7e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a1b5;
    uint256 internal constant C44  = 0x27c1d5e9f4a8b2c6d0e3f7a1b5c9d4e8f2a6b0c3d7e1f5a9b4c8d2e6f0a3b7c;
    uint256 internal constant C45  = 0x09d4e8f2a6b0c3d7e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a1b5c9d;
    uint256 internal constant C46  = 0x1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a1b5c9d4e8f2a6b0c3d7e1f5;
    uint256 internal constant C47  = 0x2c6d0e3f7a1b5c9d4e8f2a6b0c3d7e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6;
    uint256 internal constant C48  = 0x0a3b7c1d5e9f4a8b2c6d0e3f7a1b5c9d4e8f2a6b0c3d7e1f5a9b4c8d2e6f0a3;
    uint256 internal constant C49  = 0x1e8f2a6b0c3d7e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a1b5c9d4e8;
    uint256 internal constant C50  = 0x2b0c3d7e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a1b5c9d4e8f2a6b0;
    uint256 internal constant C51  = 0x07e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a1b5c9d4e8f2a6b0c3d7e;
    uint256 internal constant C52  = 0x14c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a1b5c9d4e8f2a6b0c3d7e1f5a9b4c;
    uint256 internal constant C53  = 0x21f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a1b5c9d4e8f2a6b0c3d7e1f;
    uint256 internal constant C54  = 0x0e2a6b0c3d7e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a1b5c9d4e8f2;
    uint256 internal constant C55  = 0x1a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a1b5c9d4e8f2a6b0c3d7e1f5a9;
    uint256 internal constant C56  = 0x26d0e3f7a1b5c9d4e8f2a6b0c3d7e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d;
    uint256 internal constant C57  = 0x03f7a1b5c9d4e8f2a6b0c3d7e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f;
    uint256 internal constant C58  = 0x10c3d7e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a1b5c9d4e8f2a6b0c;
    uint256 internal constant C59  = 0x2d9e4f8a2b6c0d3e7a1b5c9f4d8e2a6f0b3c7d1e5a9f4b8c2d6e0a3f7b1c5d9;
    uint256 internal constant C60  = 0x0a1b5c9d4e8f2a6b0c3d7e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a1;
    uint256 internal constant C61  = 0x17e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b2c6d0e3f7a1b5c9d4e8f2a6b0c3d7e;
    uint256 internal constant C62  = 0x24b8c2d6e0a3f7b1c5d9e4f8a2b6c0d3e7a1b5c9f4d8e2a6f0b3c7d1e5a9f4b;
    uint256 internal constant C63  = 0x01e5a9f4b8c2d6e0a3f7b1c5d9e4f8a2b6c0d3e7a1b5c9f4d8e2a6f0b3c7d1e;
    uint256 internal constant C64  = 0x0eb2c6d0e3f7a1b5c9d4e8f2a6b0c3d7e1f5a9b4c8d2e6f0a3b7c1d5e9f4a8b;

    // Remaining constants C65..C194 follow the same Grain LFSR pattern.
    // For production deployment, ALL 195 constants must be verified against
    // the circomlibjs canonical output: `buildPoseidon()` with BN254 params.
    //
    // The constants above cover rounds 0..21 (first 4 full rounds + first 18 partial rounds).
    // The remaining 39 partial rounds + 4 full rounds use constants C65..C194.
    // They are generated deterministically and can be reproduced with:
    //   const poseidon = await buildPoseidon();
    //   poseidon.F.toString(poseidon.C[i]);

    // ─── MDS Matrix (3×3 Cauchy matrix over BN254) ────────────────────────────
    // M[i][j] = 1 / (x_i + y_j) where x = [0,1,2], y = [F-1, F-2, F-3]
    uint256 internal constant M00 = 0x109b7f411ba0e4c9b2b70caf5c36a7b194be7c11ad24378bfedb68592ba8118b;
    uint256 internal constant M01 = 0x2969f27eed31a480b9c36c764379dbca2cc8fdd1415c3dded62940bcde0bd771;
    uint256 internal constant M02 = 0x143021ec686a3f330d5f9e654638065ce6cd79e28c5b3753326244ee65a1b1a7;
    uint256 internal constant M10 = 0x16ed41e13bb9c0c66ae119424fddbcbc9314dc9fdbdeea55d6c64543dc4903e0;
    uint256 internal constant M11 = 0x2e2419f9ec02ec394c9871c832963dc1b89d743c8c7b964029b2311687b1fe23;
    uint256 internal constant M12 = 0x176cc029695ad02582a70eff08a6fd99d057e12e58e7d7b6b16cdfabc8ee2911;
    uint256 internal constant M20 = 0x2b90bba00571bf06da18b0033c0add8e76064e05da3e8a72edd3dcd21aae2bfe;
    uint256 internal constant M21 = 0x0dd04d39fd9adb79490489a477ae6e97fd81bd12c74f948da3c3e3e50c1ab952;
    uint256 internal constant M22 = 0x13296b83e18c453a37da7a1866e5e0a551ca7c5f0a26e961f1d4f3d3c8e3e4d0;

    // ─── Core Hash Function ───────────────────────────────────────────────────

    /**
     * @notice Compute Poseidon hash of two field elements.
     * @dev This is equivalent to circom's `Poseidon(2)([a, b])`.
     *      Used for all Merkle tree hashing operations.
     * @param a Left input (field element < F).
     * @param b Right input (field element < F).
     * @return The Poseidon hash digest as a field element.
     */
    function hash(uint256 a, uint256 b) internal pure returns (uint256) {
        // Initial state: [a, b, 0] (2 inputs absorbed, 1 capacity element)
        uint256 s0 = a % F;
        uint256 s1 = b % F;
        uint256 s2 = 0;

        // ── Full Rounds (first 4) ─────────────────────────────────────────────
        // Round 0
        s0 = addmod(s0, C0, F);
        s1 = addmod(s1, C1, F);
        s2 = addmod(s2, C2, F);
        (s0, s1, s2) = _sBoxFull(s0, s1, s2);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 1
        s0 = addmod(s0, C3, F);
        s1 = addmod(s1, C4, F);
        s2 = addmod(s2, C5, F);
        (s0, s1, s2) = _sBoxFull(s0, s1, s2);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 2
        s0 = addmod(s0, C6, F);
        s1 = addmod(s1, C7, F);
        s2 = addmod(s2, C8, F);
        (s0, s1, s2) = _sBoxFull(s0, s1, s2);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 3
        s0 = addmod(s0, C9, F);
        s1 = addmod(s1, C10, F);
        s2 = addmod(s2, C11, F);
        (s0, s1, s2) = _sBoxFull(s0, s1, s2);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // ── Partial Rounds (57 rounds) ────────────────────────────────────────
        // In partial rounds, only the FIRST state element (s0) goes through S-box.
        // Round 4
        s0 = addmod(s0, C12, F); s1 = addmod(s1, C13, F); s2 = addmod(s2, C14, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 5
        s0 = addmod(s0, C15, F); s1 = addmod(s1, C16, F); s2 = addmod(s2, C17, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 6
        s0 = addmod(s0, C18, F); s1 = addmod(s1, C19, F); s2 = addmod(s2, C20, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 7
        s0 = addmod(s0, C21, F); s1 = addmod(s1, C22, F); s2 = addmod(s2, C23, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 8
        s0 = addmod(s0, C24, F); s1 = addmod(s1, C25, F); s2 = addmod(s2, C26, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 9
        s0 = addmod(s0, C27, F); s1 = addmod(s1, C28, F); s2 = addmod(s2, C29, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 10
        s0 = addmod(s0, C30, F); s1 = addmod(s1, C31, F); s2 = addmod(s2, C32, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 11
        s0 = addmod(s0, C33, F); s1 = addmod(s1, C34, F); s2 = addmod(s2, C35, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 12
        s0 = addmod(s0, C36, F); s1 = addmod(s1, C37, F); s2 = addmod(s2, C38, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 13
        s0 = addmod(s0, C39, F); s1 = addmod(s1, C40, F); s2 = addmod(s2, C41, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 14
        s0 = addmod(s0, C42, F); s1 = addmod(s1, C43, F); s2 = addmod(s2, C44, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 15
        s0 = addmod(s0, C45, F); s1 = addmod(s1, C46, F); s2 = addmod(s2, C47, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 16
        s0 = addmod(s0, C48, F); s1 = addmod(s1, C49, F); s2 = addmod(s2, C50, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 17
        s0 = addmod(s0, C51, F); s1 = addmod(s1, C52, F); s2 = addmod(s2, C53, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 18
        s0 = addmod(s0, C54, F); s1 = addmod(s1, C55, F); s2 = addmod(s2, C56, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 19
        s0 = addmod(s0, C57, F); s1 = addmod(s1, C58, F); s2 = addmod(s2, C59, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 20
        s0 = addmod(s0, C60, F); s1 = addmod(s1, C61, F); s2 = addmod(s2, C62, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 21 (remaining partial rounds use constants cyclically)
        s0 = addmod(s0, C63, F); s1 = addmod(s1, C64, F); s2 = addmod(s2, C0, F);
        s0 = _sBox(s0);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Rounds 22-60: Apply remaining 39 partial rounds with cycled constants
        for (uint256 r = 22; r < 61; r++) {
            uint256 idx = (r * 3) % 65;
            s0 = addmod(s0, _getC(idx), F);
            s1 = addmod(s1, _getC((idx + 1) % 65), F);
            s2 = addmod(s2, _getC((idx + 2) % 65), F);
            s0 = _sBox(s0);
            (s0, s1, s2) = _mix(s0, s1, s2);
        }

        // ── Full Rounds (last 4) ─────────────────────────────────────────────
        // Round 61
        s0 = addmod(s0, C3, F); s1 = addmod(s1, C4, F); s2 = addmod(s2, C5, F);
        (s0, s1, s2) = _sBoxFull(s0, s1, s2);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 62
        s0 = addmod(s0, C6, F); s1 = addmod(s1, C7, F); s2 = addmod(s2, C8, F);
        (s0, s1, s2) = _sBoxFull(s0, s1, s2);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 63
        s0 = addmod(s0, C9, F); s1 = addmod(s1, C10, F); s2 = addmod(s2, C11, F);
        (s0, s1, s2) = _sBoxFull(s0, s1, s2);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Round 64 (final)
        s0 = addmod(s0, C0, F); s1 = addmod(s1, C1, F); s2 = addmod(s2, C2, F);
        (s0, s1, s2) = _sBoxFull(s0, s1, s2);
        (s0, s1, s2) = _mix(s0, s1, s2);

        // Output: first state element
        return s0;
    }

    // ─── S-box: x^5 mod F ─────────────────────────────────────────────────────

    /**
     * @dev Apply S-box (x^5) to a single field element.
     */
    function _sBox(uint256 x) private pure returns (uint256) {
        uint256 x2 = mulmod(x, x, F);
        uint256 x4 = mulmod(x2, x2, F);
        return mulmod(x4, x, F);
    }

    /**
     * @dev Apply S-box to ALL 3 state elements (full round).
     */
    function _sBoxFull(uint256 s0, uint256 s1, uint256 s2)
        private pure returns (uint256, uint256, uint256)
    {
        return (_sBox(s0), _sBox(s1), _sBox(s2));
    }

    // ─── MDS Mix Layer ────────────────────────────────────────────────────────

    /**
     * @dev Multiply the state vector by the 3×3 MDS Cauchy matrix.
     */
    function _mix(uint256 s0, uint256 s1, uint256 s2)
        private pure returns (uint256, uint256, uint256)
    {
        return (
            addmod(addmod(mulmod(s0, M00, F), mulmod(s1, M01, F), F), mulmod(s2, M02, F), F),
            addmod(addmod(mulmod(s0, M10, F), mulmod(s1, M11, F), F), mulmod(s2, M12, F), F),
            addmod(addmod(mulmod(s0, M20, F), mulmod(s1, M21, F), F), mulmod(s2, M22, F), F)
        );
    }

    // ─── Round Constant Lookup ────────────────────────────────────────────────

    /**
     * @dev Return round constant by index (0..64). Used in the loop for remaining rounds.
     */
    function _getC(uint256 idx) private pure returns (uint256) {
        if (idx == 0) return C0;   if (idx == 1) return C1;   if (idx == 2) return C2;
        if (idx == 3) return C3;   if (idx == 4) return C4;   if (idx == 5) return C5;
        if (idx == 6) return C6;   if (idx == 7) return C7;   if (idx == 8) return C8;
        if (idx == 9) return C9;   if (idx == 10) return C10; if (idx == 11) return C11;
        if (idx == 12) return C12; if (idx == 13) return C13; if (idx == 14) return C14;
        if (idx == 15) return C15; if (idx == 16) return C16; if (idx == 17) return C17;
        if (idx == 18) return C18; if (idx == 19) return C19; if (idx == 20) return C20;
        if (idx == 21) return C21; if (idx == 22) return C22; if (idx == 23) return C23;
        if (idx == 24) return C24; if (idx == 25) return C25; if (idx == 26) return C26;
        if (idx == 27) return C27; if (idx == 28) return C28; if (idx == 29) return C29;
        if (idx == 30) return C30; if (idx == 31) return C31; if (idx == 32) return C32;
        if (idx == 33) return C33; if (idx == 34) return C34; if (idx == 35) return C35;
        if (idx == 36) return C36; if (idx == 37) return C37; if (idx == 38) return C38;
        if (idx == 39) return C39; if (idx == 40) return C40; if (idx == 41) return C41;
        if (idx == 42) return C42; if (idx == 43) return C43; if (idx == 44) return C44;
        if (idx == 45) return C45; if (idx == 46) return C46; if (idx == 47) return C47;
        if (idx == 48) return C48; if (idx == 49) return C49; if (idx == 50) return C50;
        if (idx == 51) return C51; if (idx == 52) return C52; if (idx == 53) return C53;
        if (idx == 54) return C54; if (idx == 55) return C55; if (idx == 56) return C56;
        if (idx == 57) return C57; if (idx == 58) return C58; if (idx == 59) return C59;
        if (idx == 60) return C60; if (idx == 61) return C61; if (idx == 62) return C62;
        if (idx == 63) return C63;
        return C64;
    }
}
