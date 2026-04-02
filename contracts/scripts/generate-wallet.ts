/**
 * generate-wallet.ts
 *
 * Generates a fresh Ethereum/Polygon wallet for deployment.
 * Run this ONCE, copy the address, fund it with MATIC, then deploy.
 *
 * Usage:  cd contracts && pnpm generate-wallet
 *
 * SECURITY: Never commit the .env file. Never share your private key.
 */

import { ethers } from "ethers";
import fs   from "fs";
import path from "path";

function main() {
  const wallet = ethers.Wallet.createRandom();

  const sep = "═".repeat(62);
  console.log("\n" + sep);
  console.log("  NEW DEPLOYER WALLET — Child First Platform");
  console.log(sep);
  console.log("");
  console.log("  ► ADDRESS TO FUND WITH MATIC (safe to share publicly):");
  console.log("    " + wallet.address);
  console.log("");
  console.log("  ► PRIVATE KEY (never share — store in .env only):  ");
  console.log("    " + wallet.privateKey);
  console.log("");
  console.log("  ► MNEMONIC (store encrypted, offline backup):       ");
  console.log("    " + wallet.mnemonic?.phrase);
  console.log("");
  console.log(sep);
  console.log("  HOW TO USE:");
  console.log("  1. Send POL/MATIC to the address above (Polygon Mainnet).");
  console.log("  2. The private key is being saved to contracts/.env automatically.");
  console.log("  3. Once funded, run:  pnpm deploy:mainnet");
  console.log(sep + "\n");

  // Write .env only if it doesn't already exist
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    console.log("  [SKIP] .env already exists — NOT overwriting.");
    console.log("  Manually add the values above to your .env file.\n");
    return;
  }

  const envContent = [
    "# Child First Platform — Deployer Wallet",
    `# Generated: ${new Date().toISOString()}`,
    "# NEVER commit this file. It is listed in .gitignore.",
    "",
    `DEPLOYER_PRIVATE_KEY=${wallet.privateKey}`,
    `DEPLOYER_ADDRESS=${wallet.address}`,
    "",
    "# ── Network RPC URLs (free public endpoints — swap for Alchemy/Infura in production) ──",
    "POLYGON_MAINNET_RPC=https://polygon-rpc.com",
    "",
    "# ── Polygonscan API key (optional — only needed for contract verification) ──",
    "POLYGONSCAN_API_KEY=",
    "",
    "# ── Gas reporter (set true to see gas costs in tests) ──",
    "REPORT_GAS=false",
  ].join("\n");

  fs.writeFileSync(envPath, envContent, { encoding: "utf8" });
  console.log("  [OK] .env written to: " + envPath);
  console.log("  Fund the wallet above, then run:  pnpm deploy:mainnet\n");
}

main();
