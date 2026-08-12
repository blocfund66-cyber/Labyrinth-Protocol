const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Labyrinth Protocol Backend & Smart Contracts Test Suite", function () {
  let labToken, labyrinthCore, labyrinthGov;
  let owner, founderDevWallet, recipient, relayer, user1;
  const denomination = ethers.parseEther("1.0");

  beforeEach(async function () {
    [owner, founderDevWallet, recipient, relayer, user1] = await ethers.getSigners();

    // 1. Deploy LabToken ($LAB - 1B Total Supply)
    const LabToken = await ethers.getContractFactory("LabToken");
    labToken = await LabToken.deploy(owner.address, founderDevWallet.address);
    await labToken.waitForDeployment();

    // 2. Deploy LabyrinthCore (Tornado Cash Architecture)
    const LabyrinthCore = await ethers.getContractFactory("LabyrinthCore");
    labyrinthCore = await LabyrinthCore.deploy(
      denomination,
      ethers.ZeroAddress,
      await labToken.getAddress(),
      owner.address
    );
    await labyrinthCore.waitForDeployment();

    // 3. Deploy LabyrinthGovernance (Staking & Revenue Share)
    const LabyrinthGovernance = await ethers.getContractFactory("LabyrinthGovernance");
    labyrinthGov = await LabyrinthGovernance.deploy(
      await labToken.getAddress(),
      founderDevWallet.address
    );
    await labyrinthGov.waitForDeployment();
  });

  describe("1. $LAB Tokenomics & 22% Allocation Verification", function () {
    it("Should mint exactly 1,000,000,000 $LAB initial total supply", async function () {
      const totalSupply = await labToken.totalSupply();
      expect(totalSupply).to.equal(ethers.parseEther("1000000000"));
    });

    it("Should allocate exactly 22% (220,000,000 $LAB) to Founder & Dev Wallet", async function () {
      const founderBalance = await labToken.balanceOf(founderDevWallet.address);
      const expected22Percent = ethers.parseEther("220000000");
      expect(founderBalance).to.equal(expected22Percent);
    });

    it("Should execute EIP-1559 controlled protocol fee burn", async function () {
      const burnAmount = ethers.parseEther("500");
      await labToken.transfer(user1.address, burnAmount);
      
      await labToken.connect(user1).burn(burnAmount, "EIP-1559 Protocol Fee Burn Test");
      
      const totalBurned = await labToken.totalBurned();
      expect(totalBurned).to.equal(burnAmount);
    });
  });

  describe("2. Tornado Cash Inspired Privacy Pool (LabyrinthCore)", function () {
    it("Should allow valid deposit and insert commitment into Merkle tree", async function () {
      const secret = ethers.id("labyrinth-secret-key-1");
      const nullifier = ethers.id("labyrinth-nullifier-1");
      const commitment = ethers.solidityPackedKeccak256(["bytes32", "bytes32"], [nullifier, secret]);

      const tx = await labyrinthCore.connect(user1).deposit(commitment, true, { value: denomination });
      await expect(tx).to.emit(labyrinthCore, "Deposit");

      const exists = await labyrinthCore.commitments(commitment);
      expect(exists).to.be.true;
    });

    it("Should execute gasless withdrawal via Relayer & prevent double-spending", async function () {
      const nullifier = ethers.id("labyrinth-nullifier-2");
      const nullifierHash = ethers.solidityPackedKeccak256(["bytes32"], [nullifier]);
      const root = await labyrinthCore.currentRoot();
      const relayerFee = ethers.parseEther("0.05");

      // Execute Withdrawal
      await expect(
        labyrinthCore.withdraw(
          "0x",
          root,
          nullifierHash,
          recipient.address,
          relayer.address,
          relayerFee,
          0,
          "0x"
        )
      ).to.emit(labyrinthCore, "Withdrawal");

      // Verify nullifier marked as spent
      const isSpent = await labyrinthCore.isSpent(nullifierHash);
      expect(isSpent).to.be.true;

      // Attempt double-spend (Must Revert)
      await expect(
        labyrinthCore.withdraw(
          "0x",
          root,
          nullifierHash,
          recipient.address,
          relayer.address,
          relayerFee,
          0,
          "0x"
        )
      ).to.be.revertedWith("LabyrinthCore: Note already spent (Double-spend prevented)");
    });
  });

  describe("3. Real Yield Governance Staking & 80/20 Distribution", function () {
    it("Should distribute yield: 80% to stakers and 20% to Founder & Dev Wallet", async function () {
      const stakeAmount = ethers.parseEther("1000");
      await labToken.transfer(user1.address, stakeAmount);
      await labToken.connect(user1).approve(await labyrinthGov.getAddress(), stakeAmount);
      await labyrinthGov.connect(user1).stake(stakeAmount);

      const founderDevBalanceBefore = await ethers.provider.getBalance(founderDevWallet.address);
      const yieldProvided = ethers.parseEther("10.0");

      // Distribute yield
      await labyrinthGov.distributeYield({ value: yieldProvided });

      const founderDevBalanceAfter = await ethers.provider.getBalance(founderDevWallet.address);
      const founderReceived = founderDevBalanceAfter - founderDevBalanceBefore;

      // Expected 20% of 10 ETH = 2 ETH
      expect(founderReceived).to.equal(ethers.parseEther("2.0"));
    });
  });
});
