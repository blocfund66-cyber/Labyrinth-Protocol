import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getArtifact(contractName) {
  const artifactPath = path.join(
    __dirname,
    `../artifacts/contracts/${contractName}.sol/${contractName}.json`
  );
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Artifact not found for ${contractName} at ${artifactPath}. Please run 'npx hardhat compile' first.`);
  }
  return JSON.parse(fs.readFileSync(artifactPath, "utf8"));
}

async function main() {
  console.log("================================================================================");
  console.log("🌀 LABYRINTH PROTOCOL V1 — SEPOLIA TESTNET AUTOMATED DEPLOYMENT");
  console.log("================================================================================");

  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org";
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  let deployer;
  const privateKey = process.env.PRIVATE_KEY;
  
  if (privateKey && privateKey.startsWith("0x") && privateKey.length === 66) {
    deployer = new ethers.Wallet(privateKey, provider);
  } else {
    // Generate a temporary wallet for dry-run simulation
    deployer = ethers.Wallet.createRandom(provider);
    console.warn("⚠️ PRIVATE_KEY not found in environment. Using generated test wallet for simulation.");
  }

  console.log("📌 DEPLOYMENT ACCOUNT INFORMATION:");
  console.log("  • Target RPC URL    :", rpcUrl);
  console.log("  • Deployer Address  :", deployer.address);

  const founderDevWallet = process.env.FOUNDER_DEV_WALLET || deployer.address;
  console.log("  • Founder/Dev Wallet:", founderDevWallet);

  let balance = 0n;
  try {
    balance = await provider.getBalance(deployer.address);
    console.log("  • Account Balance   :", ethers.formatEther(balance), "ETH");
  } catch (err) {
    console.warn("  • Account Balance   : 0 ETH (RPC Offline or Unreachable)");
  }

  if (balance === 0n && privateKey) {
    console.warn("\n⚠️ WARNING: Deployer balance is 0 ETH on Sepolia. Please fund this wallet via a Sepolia faucet before running live deployment.");
  }

  // 1. Deploy LabToken
  console.log("\n--------------------------------------------------------------------------------");
  console.log("STEP 1: PREPARING $LAB TOKEN DEPLOYMENT (`LabToken.sol`)");
  console.log("--------------------------------------------------------------------------------");
  const labTokenArt = getArtifact("LabToken");
  console.log("  • Contract bytecode size:", labTokenArt.bytecode.length / 2, "bytes");

  // 2. Deploy LabyrinthGovernance
  console.log("\n--------------------------------------------------------------------------------");
  console.log("STEP 2: PREPARING GOVERNANCE DEPLOYMENT (`LabyrinthGovernance.sol`)");
  console.log("--------------------------------------------------------------------------------");
  const govArt = getArtifact("LabyrinthGovernance");
  console.log("  • Contract bytecode size:", govArt.bytecode.length / 2, "bytes");

  // 3. Deploy MockVerifier
  console.log("\n--------------------------------------------------------------------------------");
  console.log("STEP 3: PREPARING ZK VERIFIER DEPLOYMENT (`MockVerifier.sol`)");
  console.log("--------------------------------------------------------------------------------");
  const verifierArt = getArtifact("MockVerifier");
  console.log("  • Contract bytecode size:", verifierArt.bytecode.length / 2, "bytes");

  // 4. Deploy LabyrinthCore
  console.log("\n--------------------------------------------------------------------------------");
  console.log("STEP 4: PREPARING CORE PRIVACY POOL DEPLOYMENT (`LabyrinthCore.sol`)");
  console.log("--------------------------------------------------------------------------------");
  const coreArt = getArtifact("LabyrinthCore");
  console.log("  • Contract bytecode size:", coreArt.bytecode.length / 2, "bytes");

  // 5. Deploy LabyrinthRelayer
  console.log("\n--------------------------------------------------------------------------------");
  console.log("STEP 5: PREPARING RELAYER REGISTRY DEPLOYMENT (`LabyrinthRelayer.sol`)");
  console.log("--------------------------------------------------------------------------------");
  const relayerArt = getArtifact("LabyrinthRelayer");
  console.log("  • Contract bytecode size:", relayerArt.bytecode.length / 2, "bytes");

  // If private key is configured with balance > 0, perform real on-chain deployment
  if (privateKey && balance > 0n) {
    console.log("\n🚀 LIVE DEPLOYMENT IN PROGRESS ON SEPOLIA TESTNET...");
    
    // 1. LabToken
    const labTokenFactory = new ethers.ContractFactory(labTokenArt.abi, labTokenArt.bytecode, deployer);
    const labToken = await labTokenFactory.deploy(deployer.address, founderDevWallet);
    await labToken.waitForDeployment();
    const labTokenAddress = await labToken.getAddress();
    console.log("  ✅ LabToken Deployed at:", labTokenAddress);

    // 2. LabyrinthGovernance
    const govFactory = new ethers.ContractFactory(govArt.abi, govArt.bytecode, deployer);
    const governance = await govFactory.deploy(labTokenAddress, founderDevWallet);
    await governance.waitForDeployment();
    const governanceAddress = await governance.getAddress();
    console.log("  ✅ LabyrinthGovernance Deployed at:", governanceAddress);

    // Transfer LAB governance
    const txSetGov = await labToken.setGovernance(governanceAddress);
    await txSetGov.wait();
    console.log("  • LabToken governance transferred to LabyrinthGovernance.");

    // 3. MockVerifier
    const verifierFactory = new ethers.ContractFactory(verifierArt.abi, verifierArt.bytecode, deployer);
    const verifier = await verifierFactory.deploy();
    await verifier.waitForDeployment();
    const verifierAddress = await verifier.getAddress();
    console.log("  ✅ MockVerifier Deployed at:", verifierAddress);

    // 4. LabyrinthCore
    const poolDenomination = ethers.parseEther("0.1");
    const coreFactory = new ethers.ContractFactory(coreArt.abi, coreArt.bytecode, deployer);
    const core = await coreFactory.deploy(poolDenomination, verifierAddress, labTokenAddress, deployer.address);
    await core.waitForDeployment();
    const coreAddress = await core.getAddress();
    console.log("  ✅ LabyrinthCore Deployed at:", coreAddress);

    const txVer = await core.setVerifier(verifierAddress, true);
    await txVer.wait();

    // 5. LabyrinthRelayer
    const relayerFactory = new ethers.ContractFactory(relayerArt.abi, relayerArt.bytecode, deployer);
    const relayer = await relayerFactory.deploy(deployer.address, labTokenAddress);
    await relayer.waitForDeployment();
    const relayerAddress = await relayer.getAddress();
    console.log("  ✅ LabyrinthRelayer Deployed at:", relayerAddress);

    // Save manifest
    const manifest = {
      network: "sepolia",
      chainId: 11155111,
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      founderDevWallet: founderDevWallet,
      contracts: {
        LabToken: labTokenAddress,
        LabyrinthGovernance: governanceAddress,
        MockVerifier: verifierAddress,
        LabyrinthCore: coreAddress,
        LabyrinthRelayer: relayerAddress
      }
    };

    const outputPath = path.join(__dirname, "../src/contracts/deployed_addresses.json");
    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
    console.log("\n📁 Live deployment manifest saved to:", outputPath);
  } else {
    console.log("\n================================================================================");
    console.log("💡 DEPLOYMENT SCRIPT VALIDATED IN SIMULATION MODE");
    console.log("================================================================================");
    console.log("To execute live deployment on Sepolia:");
    console.log("1. Copy `.env.example` to `.env`");
    console.log("2. Set SEPOLIA_RPC_URL and PRIVATE_KEY (funded with SepoliaETH)");
    console.log("3. Run: `node scripts/deploy_sepolia.js` or `npm run deploy:sepolia`\n");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script error:", error);
    process.exit(1);
  });
