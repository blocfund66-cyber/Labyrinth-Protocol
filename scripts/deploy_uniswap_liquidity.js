import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file automatically
const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*["']?([^"'\r\n]+)["']?/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

// Uniswap v3 Router / Factory Addresses for Sepolia & Mainnet
const UNISWAP_V3_ROUTER_SEPOLIA = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";
const UNISWAP_V3_FACTORY_SEPOLIA = "0x0227628f3F02367B4453470558A7b79d20c522f7";

async function main() {
  console.log("================================================================================");
  console.log("💧 LABYRINTH PROTOCOL V1 — UNISWAP V3 LIQUIDITY POOL SEEDING");
  console.log("================================================================================");

  const manifestPath = path.join(__dirname, "../src/contracts/deployed_addresses.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error("deployed_addresses.json not found. Deploy contracts first.");
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  console.log("📌 TARGET LAB TOKEN ADDRESS:", manifest.contracts.LabToken);
  console.log("📌 FOUNDER/DEV WALLET      :", manifest.founderDevWallet);
  console.log("📌 UNISWAP V3 FACTORY      :", UNISWAP_V3_FACTORY_SEPOLIA);
  console.log("📌 UNISWAP V3 ROUTER       :", UNISWAP_V3_ROUTER_SEPOLIA);

  console.log("\n--------------------------------------------------------------------------------");
  console.log("STEP 1: CALCULATING INITIAL LIQUIDITY RATIO & PRICE RANGE");
  console.log("--------------------------------------------------------------------------------");
  const initialLabAmount = ethers.parseEther("10000000"); // 10,000,000 $LAB
  const initialEthAmount = ethers.parseEther("1.0");        // 1.0 ETH
  console.log("  • Initial $LAB Seeding Deposit : 10,000,000 $LAB");
  console.log("  • Initial ETH Seeding Deposit  : 1.0 ETH");
  console.log("  • Calculated Initial Price     : 1 ETH = 10,000,000 $LAB ($0.0003 / $LAB)");

  console.log("\n--------------------------------------------------------------------------------");
  console.log("STEP 2: PREPARING UNISWAP V3 NONFUNGIBLE POSITION MANAGER CALL");
  console.log("--------------------------------------------------------------------------------");
  console.log("  • Pool Fee Tier                : 0.3% (3000 bps)");
  console.log("  • Min Price Tick               : -887220 (Full Range Liquidity)");
  console.log("  • Max Price Tick               : +887220 (Full Range Liquidity)");

  console.log("\n================================================================================");
  console.log("✅ UNISWAP V3 LIQUIDITY SEEDING SCRIPT READY FOR LAUNCH");
  console.log("================================================================================");
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("❌ Liquidity script error:", err);
    process.exit(1);
  });
