const fs = require('fs');
const path = require('path');

async function main() {
  console.log("==================================================");
  console.log("🚀 Deploying Labyrinth Protocol Web3 Smart Contracts");
  console.log("==================================================");

  // Mock addresses for local deployment & testing
  const [deployer] = await ethers.getSigners();
  const founderAndDevWallet = deployer.address; // Receiver of 22% (220M $LAB) Founder (X=12%) + Dev (Y=10%)
  const governanceAddress = deployer.address;

  console.log("Deployer Account:", deployer.address);
  console.log("Founder & Dev Wallet (22% Allocation):", founderAndDevWallet);

  // 1. Deploy LabToken ($LAB - 1 Billion Total Supply)
  console.log("\n1. Deploying $LAB Token Contract...");
  const LabToken = await ethers.getContractFactory("LabToken");
  const labToken = await LabToken.deploy(governanceAddress, founderAndDevWallet);
  await labToken.waitForDeployment();
  const labTokenAddr = await labToken.getAddress();
  console.log("✅ LabToken deployed to:", labTokenAddr);

  // Verify Total Supply & 22% Allocation
  const totalSupply = await labToken.totalSupply();
  const founderBalance = await labToken.balanceOf(founderAndDevWallet);
  console.log("   Total Supply:", ethers.formatEther(totalSupply), "$LAB");
  console.log("   Founder & Dev Wallet Balance (22%):", ethers.formatEther(founderBalance), "$LAB");

  // 2. Deploy LabyrinthCore (Tornado Cash Privacy Pool Architecture)
  console.log("\n2. Deploying LabyrinthCore Privacy Pool (Denomination: 1.0 ETH)...");
  const denomination = ethers.parseEther("1.0");
  const verifierAddr = ethers.ZeroAddress; // Mock verifier for testing
  const LabyrinthCore = await ethers.getContractFactory("LabyrinthCore");
  const labyrinthCore = await LabyrinthCore.deploy(denomination, verifierAddr, labTokenAddr, governanceAddress);
  await labyrinthCore.waitForDeployment();
  const coreAddr = await labyrinthCore.getAddress();
  console.log("✅ LabyrinthCore Privacy Pool deployed to:", coreAddr);

  // 3. Deploy LabyrinthGovernance (Real Yield Staking)
  console.log("\n3. Deploying LabyrinthGovernance Staking Contract...");
  const LabyrinthGovernance = await ethers.getContractFactory("LabyrinthGovernance");
  const governance = await LabyrinthGovernance.deploy(labTokenAddr, founderAndDevWallet);
  await governance.waitForDeployment();
  const govAddr = await governance.getAddress();
  console.log("✅ LabyrinthGovernance Staking deployed to:", govAddr);

  // 4. Save Deployment Manifest to src/web3/deployments.json
  const deploymentData = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    timestamp: new Date().toISOString(),
    contracts: {
      LabToken: labTokenAddr,
      LabyrinthCore: coreAddr,
      LabyrinthGovernance: govAddr,
      FounderAndDevWallet: founderAndDevWallet,
      GovernanceAddress: governanceAddress
    },
    tokenomics: {
      totalSupply: "1000000000",
      founderDevAllocationBps: 2200,
      founderDevBalance: ethers.formatEther(founderBalance)
    }
  };

  const outputDir = path.join(__dirname, "../src/web3");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "deployments.json");
  fs.writeFileSync(outputPath, JSON.stringify(deploymentData, null, 2));
  console.log("\n📄 Deployment Manifest saved to:", outputPath);
  console.log("==================================================");
  console.log("🎉 Labyrinth Backend Smart Contracts Deployed Successfully!");
  console.log("==================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
