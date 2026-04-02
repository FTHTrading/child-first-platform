/**
 * setup-mog-roles.ts
 *
 * Completes the MOG role setup.
 * Already done (nonce 9): MOGToken MINTER_ROLE -> MOGRegistry
 *
 * Remaining:
 *  - MOGToken   MINTER_ROLE -> TithingVault
 *  - FaithBadge MINTER_ROLE -> MOGRegistry
 *  - FaithBadge MINTER_ROLE -> TithingVault
 *  - FaithBadge MINTER_ROLE -> MissionFactory
 *  - MOGTimelock PROPOSER_ROLE -> MOGGovernor
 *  - MOGTimelock ADMIN_ROLE renounced by deployer
 */

import { ethers, network } from "hardhat";
import fs   from "fs";
import path from "path";

// All 8 deployed contracts
const ADDRS = {
  MOGToken:      "0x1Bb149A1e5d858081dc2EAb714069194521Ef0C5",
  FaithBadge:    "0xeE4dFE543f948bb4fa316c361cfa5B5433215BdF",
  PrayerWall:    "0x79110B6cC743c3000829457a0201077aAca82d08",
  TithingVault:  "0xD4A6382cFA89b8Aa82D5c23eC3280FA6082f64EF",
  MOGRegistry:   "0xD8544885f6dbA51834dE5F8D93935a1e6Aa30A4F",
  MOGTimelock:   "0xA937444bD799Ab6a16BFF9c3e9048473BB31959B",
  MOGGovernor:   "0xca9E53610B50509D44923C78cf51AE3caC844D92",
  MissionFactory:"0x617C11FaBe683D2047Ade9E7CbD2150dD176867E",
};

// Generous gas settings well above current ~130 gwei base fee
const GAS_OPTS = {
  maxFeePerGas:         ethers.parseUnits("500", "gwei"),
  maxPriorityFeePerGas: ethers.parseUnits("80",  "gwei"),
};

async function grant(contract: any, role: string, grantee: string, label: string) {
  console.log(`  Granting: ${label}...`);
  const tx = await contract.grantRole(role, grantee, GAS_OPTS);
  const receipt = await tx.wait();
  console.log(`  + ${label}  (block ${receipt.blockNumber})`);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  const nonce   = await ethers.provider.getTransactionCount(deployer.address);

  console.log("=".repeat(60));
  console.log("  MOG Ecosystem - Role Setup");
  console.log("=".repeat(60));
  console.log(`  Network  : ${network.name}`);
  console.log(`  Deployer : ${deployer.address}`);
  console.log(`  Nonce    : ${nonce}  (expecting 10)`);
  console.log(`  Balance  : ${ethers.formatEther(balance)} POL`);
  console.log("-".repeat(60));

  const mogToken    = await ethers.getContractAt("MOGToken",    ADDRS.MOGToken);
  const faithBadge  = await ethers.getContractAt("FaithBadge",  ADDRS.FaithBadge);
  const mogTimelock = await ethers.getContractAt("MOGTimelock", ADDRS.MOGTimelock);

  const MINTER_ROLE   = await mogToken.MINTER_ROLE();
  const PROPOSER_ROLE = ethers.id("PROPOSER_ROLE");
  const ADMIN_ROLE    = ethers.id("TIMELOCK_ADMIN_ROLE");

  // ── Remaining role grants ────────────────────────────────────────────────────
  // (MOGToken MINTER_ROLE -> MOGRegistry was already done at nonce 9)

  await grant(mogToken,    MINTER_ROLE,   ADDRS.TithingVault,   "MOGToken   MINTER_ROLE -> TithingVault");
  await grant(faithBadge,  MINTER_ROLE,   ADDRS.MOGRegistry,    "FaithBadge MINTER_ROLE -> MOGRegistry");
  await grant(faithBadge,  MINTER_ROLE,   ADDRS.TithingVault,   "FaithBadge MINTER_ROLE -> TithingVault");
  await grant(faithBadge,  MINTER_ROLE,   ADDRS.MissionFactory, "FaithBadge MINTER_ROLE -> MissionFactory");
  await grant(mogTimelock, PROPOSER_ROLE, ADDRS.MOGGovernor,    "Timelock    PROPOSER_ROLE -> MOGGovernor");

  // Renounce deployer's admin role (decentralise governance)
  console.log("  Renouncing Timelock ADMIN_ROLE by deployer...");
  const tx = await mogTimelock.renounceRole(ADMIN_ROLE, deployer.address, GAS_OPTS);
  const receipt = await tx.wait();
  console.log(`  + Timelock ADMIN_ROLE renounced  (block ${receipt.blockNumber})`);

  // ── Save final manifest ──────────────────────────────────────────────────────
  const outDir = path.join(__dirname, "..", "deployments", "polygon");
  fs.mkdirSync(outDir, { recursive: true });

  const manifest = {
    network:   "polygon",
    chainId:   137,
    deployer:  deployer.address,
    timestamp: new Date().toISOString(),
    contracts: ADDRS,
    roles: {
      "MOGToken.MINTER_ROLE":    ["MOGRegistry", "TithingVault"],
      "FaithBadge.MINTER_ROLE":  ["MOGRegistry", "TithingVault", "MissionFactory"],
      "MOGTimelock.PROPOSER_ROLE": ["MOGGovernor"],
      "MOGTimelock.ADMIN_ROLE":  "renounced",
    },
  };

  const outPath = path.join(outDir, "mog-ecosystem.json");
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
  console.log(`\n  Manifest saved: ${outPath}`);

  // ── Final summary ─────────────────────────────────────────────────────────────
  const postBalance = await ethers.provider.getBalance(deployer.address);
  const spent = balance - postBalance;

  console.log("\n" + "=".repeat(60));
  console.log("  ROLE SETUP COMPLETE");
  console.log("=".repeat(60));
  for (const [name, addr] of Object.entries(ADDRS)) {
    console.log(`  ${name.padEnd(20)} ${addr}`);
  }
  console.log(`\n  POL spent : ${ethers.formatEther(spent)}`);
  console.log(`  Remaining : ${ethers.formatEther(postBalance)}`);
  console.log("=".repeat(60));
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
