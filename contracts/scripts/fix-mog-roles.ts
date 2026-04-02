/**
 * fix-mog-roles.ts
 *
 * Completes the role grants that failed during deploy-mog-continue.ts.
 * The "replacement transaction underpriced" error crashed the script after
 * MOGToken + partial FaithBadge MINTER_ROLE grants succeeded.
 *
 * Remaining:
 *   1. FaithBadge MINTER_ROLE -> MissionFactory
 *   2. Timelock  PROPOSER_ROLE -> MOGGovernor
 *   3. Timelock  ADMIN_ROLE renounce (deployer steps back)
 *
 * Usage:
 *   cd child-first-platform/contracts
 *   npx hardhat run scripts/fix-mog-roles.ts --network polygon
 */

import { ethers, network } from "hardhat";

const ADDRS = {
  MOGToken:       "0x1Bb149A1e5d858081dc2EAb714069194521Ef0C5",
  FaithBadge:     "0xeE4dFE543f948bb4fa316c361cfa5B5433215BdF",
  PrayerWall:     "0x79110B6cC743c3000829457a0201077aAca82d08",
  TithingVault:   "0xD4A6382cFA89b8Aa82D5c23eC3280FA6082f64EF",
  MOGRegistry:    "0xD8544885f6dbA51834dE5F8D93935a1e6Aa30A4F",
  MOGTimelock:    "0xA937444bD799Ab6a16BFF9c3e9048473BB31959B",
  MOGGovernor:    "0xca9E53610B50509D44923C78cf51AE3caC844D92",
  MissionFactory: "0x617C11FaBe683D2047Ade9E7CbD2150dD176867E",
};

// EIP-1559 gas — generous to avoid underpriced errors
const GAS_OPTS = {
  maxFeePerGas:         ethers.parseUnits("300", "gwei"),
  maxPriorityFeePerGas: ethers.parseUnits("80",  "gwei"),
};

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  const nonce = await ethers.provider.getTransactionCount(deployer.address);

  console.log("=".repeat(60));
  console.log("  MOG Ecosystem — Role Fix");
  console.log("=".repeat(60));
  console.log(`  Network   : ${network.name}`);
  console.log(`  Deployer  : ${deployer.address}`);
  console.log(`  Nonce     : ${nonce}`);
  console.log(`  Balance   : ${ethers.formatEther(balance)} POL`);
  console.log("-".repeat(60));

  // ── 1. FaithBadge MINTER_ROLE -> MissionFactory ──────────────────────────
  const faithBadge = await ethers.getContractAt("FaithBadge", ADDRS.FaithBadge);
  const MINTER_ROLE = await faithBadge.MINTER_ROLE();

  const alreadyHas = await faithBadge.hasRole(MINTER_ROLE, ADDRS.MissionFactory);
  if (alreadyHas) {
    console.log("  [SKIP] FaithBadge MINTER_ROLE -> MissionFactory (already set)");
  } else {
    console.log("  [1/3] Granting FaithBadge MINTER_ROLE -> MissionFactory...");
    const tx1 = await faithBadge.grantRole(MINTER_ROLE, ADDRS.MissionFactory, GAS_OPTS);
    console.log(`         tx: ${tx1.hash}`);
    await tx1.wait();
    console.log("         Done.");
  }

  // ── 2. Timelock PROPOSER_ROLE -> MOGGovernor ─────────────────────────────
  const mogTimelock = await ethers.getContractAt("MOGTimelock", ADDRS.MOGTimelock);
  const PROPOSER_ROLE = ethers.id("PROPOSER_ROLE");

  const govHasProposer = await mogTimelock.hasRole(PROPOSER_ROLE, ADDRS.MOGGovernor);
  if (govHasProposer) {
    console.log("  [SKIP] Timelock PROPOSER_ROLE -> MOGGovernor (already set)");
  } else {
    console.log("  [2/3] Granting Timelock PROPOSER_ROLE -> MOGGovernor...");
    const tx2 = await mogTimelock.grantRole(PROPOSER_ROLE, ADDRS.MOGGovernor, GAS_OPTS);
    console.log(`         tx: ${tx2.hash}`);
    await tx2.wait();
    console.log("         Done.");
  }

  // ── 3. Renounce deployer's Timelock ADMIN_ROLE ───────────────────────────
  const DEFAULT_ADMIN = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const deployerIsAdmin = await mogTimelock.hasRole(DEFAULT_ADMIN, deployer.address);
  if (!deployerIsAdmin) {
    console.log("  [SKIP] Deployer already renounced ADMIN_ROLE on Timelock");
  } else {
    console.log("  [3/3] Renouncing deployer ADMIN_ROLE on Timelock...");
    const tx3 = await mogTimelock.renounceRole(DEFAULT_ADMIN, deployer.address, GAS_OPTS);
    console.log(`         tx: ${tx3.hash}`);
    await tx3.wait();
    console.log("         Done. Deployer no longer has Timelock admin.");
  }

  // ── Verification ─────────────────────────────────────────────────────────
  console.log("\n  Verifying final state...");
  const ok1 = await faithBadge.hasRole(MINTER_ROLE, ADDRS.MissionFactory);
  const ok2 = await mogTimelock.hasRole(PROPOSER_ROLE, ADDRS.MOGGovernor);
  const ok3 = !(await mogTimelock.hasRole(DEFAULT_ADMIN, deployer.address));

  console.log(`  FaithBadge MINTER -> MissionFactory : ${ok1 ? "OK" : "FAIL"}`);
  console.log(`  Timelock PROPOSER -> MOGGovernor    : ${ok2 ? "OK" : "FAIL"}`);
  console.log(`  Deployer admin renounced            : ${ok3 ? "OK" : "FAIL"}`);

  const postBal = await ethers.provider.getBalance(deployer.address);
  console.log(`\n  POL remaining: ${ethers.formatEther(postBal)}`);

  if (ok1 && ok2 && ok3) {
    console.log("\n" + "=".repeat(60));
    console.log("  ALL ROLES CONFIGURED — MOG ECOSYSTEM FULLY DEPLOYED");
    console.log("=".repeat(60));
  } else {
    console.error("\n  [ERROR] Some role grants failed. Check above.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
