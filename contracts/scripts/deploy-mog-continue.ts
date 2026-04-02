/**
 * deploy-mog-continue.ts
 *
 * Resumes the MOG ecosystem deployment from PrayerWall (nonce 3).
 * MOGToken and FaithBadge are already on-chain; their addresses are hardcoded.
 */

import { ethers, network, run } from "hardhat";
import fs   from "fs";
import path from "path";

// Already deployed (nonces 1 & 2 from deployer)
const DEPLOYED_MOG_TOKEN   = "0x1Bb149A1e5d858081dc2EAb714069194521Ef0C5";
const DEPLOYED_FAITH_BADGE = "0xeE4dFE543f948bb4fa316c361cfa5B5433215BdF";

// Two-day timelock delay for DAO governance
const TIMELOCK_DELAY = 2 * 24 * 60 * 60; // 172800 seconds

// Gas overrides — explicit EIP-1559 params to avoid slow eth_gasPrice estimation
const GAS_OPTS = {
  maxFeePerGas:         ethers.parseUnits("250", "gwei"),
  maxPriorityFeePerGas: ethers.parseUnits("60",  "gwei"),
};

async function verify(address: string, constructorArguments: unknown[]) {
  try {
    await run("verify:verify", { address, constructorArguments });
    console.log(`  Verified: ${address}`);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Already Verified") || msg.includes("already verified")) {
      console.log(`  Already verified: ${address}`);
    } else {
      console.warn(`  Verify failed (${address}): ${msg}`);
    }
  }
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  const nonce   = await ethers.provider.getTransactionCount(deployer.address);

  console.log("=".repeat(60));
  console.log("  MOG Ecosystem - Continuation Deployment");
  console.log("=".repeat(60));
  console.log(`  Network  : ${network.name}`);
  console.log(`  Deployer : ${deployer.address}`);
  console.log(`  Nonce    : ${nonce}  (expecting 3)`);
  console.log(`  Balance  : ${ethers.formatEther(balance)} POL`);
  console.log("-".repeat(60));
  console.log(`  MOGToken   (existing): ${DEPLOYED_MOG_TOKEN}`);
  console.log(`  FaithBadge (existing): ${DEPLOYED_FAITH_BADGE}`);
  console.log("-".repeat(60));

  if (balance === 0n) {
    console.error("[ERROR] Deployer wallet has 0 POL.  Aborting.");
    process.exit(1);
  }

  if (nonce !== 3) {
    console.warn(`[WARN] Expected nonce 3, got ${nonce}.  Proceeding anyway…`);
  }

  // Reference already-deployed contracts (read-only handles for role grants)
  const mogToken   = await ethers.getContractAt("MOGToken",   DEPLOYED_MOG_TOKEN);
  const faithBadge = await ethers.getContractAt("FaithBadge", DEPLOYED_FAITH_BADGE);

  const deployed: Record<string, string> = {
    MOGToken:   DEPLOYED_MOG_TOKEN,
    FaithBadge: DEPLOYED_FAITH_BADGE,
  };

  // ── 3. PrayerWall ────────────────────────────────────────────────────────────
  console.log("\n  [3/8] Deploying PrayerWall...");
  const PrayerWall = await ethers.getContractFactory("PrayerWall");
  const prayerWall = await PrayerWall.deploy(deployer.address, GAS_OPTS);
  await prayerWall.waitForDeployment();
  deployed.PrayerWall = await prayerWall.getAddress();
  console.log(`        PrayerWall deployed: ${deployed.PrayerWall}`);

  // ── 4. TithingVault ──────────────────────────────────────────────────────────
  console.log("\n  [4/8] Deploying TithingVault...");
  const TithingVault = await ethers.getContractFactory("TithingVault");
  const tithingVault = await TithingVault.deploy(
    deployer.address,
    deployed.MOGToken,
    deployed.FaithBadge,
    GAS_OPTS,
  );
  await tithingVault.waitForDeployment();
  deployed.TithingVault = await tithingVault.getAddress();
  console.log(`        TithingVault deployed: ${deployed.TithingVault}`);

  // ── 5. MOGRegistry ───────────────────────────────────────────────────────────
  console.log("\n  [5/8] Deploying MOGRegistry...");
  const MOGRegistry = await ethers.getContractFactory("MOGRegistry");
  const mogRegistry = await MOGRegistry.deploy(
    deployer.address,
    deployed.MOGToken,
    deployed.FaithBadge,
    GAS_OPTS,
  );
  await mogRegistry.waitForDeployment();
  deployed.MOGRegistry = await mogRegistry.getAddress();
  console.log(`        MOGRegistry deployed: ${deployed.MOGRegistry}`);

  // ── 6. MOGTimelock ───────────────────────────────────────────────────────────
  console.log("\n  [6/8] Deploying MOGTimelock (2-day delay)...");
  const MOGTimelock = await ethers.getContractFactory("MOGTimelock");
  const mogTimelock = await MOGTimelock.deploy(
    TIMELOCK_DELAY,
    [],                    // proposers — set after governor deployed
    [ethers.ZeroAddress],  // executors — anyone can execute
    deployer.address,      // admin (revoked after governor setup)
    GAS_OPTS,
  );
  await mogTimelock.waitForDeployment();
  deployed.MOGTimelock = await mogTimelock.getAddress();
  console.log(`        MOGTimelock deployed: ${deployed.MOGTimelock}`);

  // ── 7. MOGGovernor ───────────────────────────────────────────────────────────
  console.log("\n  [7/8] Deploying MOGGovernor...");
  const MOGGovernor = await ethers.getContractFactory("MOGGovernor");
  const mogGovernor = await MOGGovernor.deploy(
    deployed.MOGToken,
    deployed.MOGTimelock,
    GAS_OPTS,
  );
  await mogGovernor.waitForDeployment();
  deployed.MOGGovernor = await mogGovernor.getAddress();
  console.log(`        MOGGovernor deployed: ${deployed.MOGGovernor}`);

  // ── 8. MissionFactory ────────────────────────────────────────────────────────
  console.log("\n  [8/8] Deploying MissionFactory...");
  const MissionFactory = await ethers.getContractFactory("MissionFactory");
  const missionFactory = await MissionFactory.deploy(
    deployer.address,
    deployed.MOGRegistry,
    deployed.FaithBadge,
    GAS_OPTS,
  );
  await missionFactory.waitForDeployment();
  deployed.MissionFactory = await missionFactory.getAddress();
  console.log(`        MissionFactory deployed: ${deployed.MissionFactory}`);

  // ── Post-deployment Role Setup ───────────────────────────────────────────────
  console.log("\n  Setting up roles and permissions...");

  const MINTER_ROLE   = await mogToken.MINTER_ROLE();
  const PROPOSER_ROLE = ethers.id("PROPOSER_ROLE");
  const ADMIN_ROLE    = ethers.id("TIMELOCK_ADMIN_ROLE");

  // MOGToken minter grants
  await (await mogToken.grantRole(MINTER_ROLE, deployed.MOGRegistry,   GAS_OPTS)).wait();
  console.log("  + MOGToken MINTER_ROLE -> MOGRegistry");
  await (await mogToken.grantRole(MINTER_ROLE, deployed.TithingVault,  GAS_OPTS)).wait();
  console.log("  + MOGToken MINTER_ROLE -> TithingVault");

  // FaithBadge minter grants
  await (await faithBadge.grantRole(MINTER_ROLE, deployed.MOGRegistry,    GAS_OPTS)).wait();
  console.log("  + FaithBadge MINTER_ROLE -> MOGRegistry");
  await (await faithBadge.grantRole(MINTER_ROLE, deployed.TithingVault,   GAS_OPTS)).wait();
  console.log("  + FaithBadge MINTER_ROLE -> TithingVault");
  await (await faithBadge.grantRole(MINTER_ROLE, deployed.MissionFactory, GAS_OPTS)).wait();
  console.log("  + FaithBadge MINTER_ROLE -> MissionFactory");

  // Timelock governance setup
  await (await mogTimelock.grantRole(PROPOSER_ROLE, deployed.MOGGovernor, GAS_OPTS)).wait();
  console.log("  + Timelock PROPOSER_ROLE -> MOGGovernor");

  // Renounce deployer's timelock admin role for decentralisation
  await (await mogTimelock.renounceRole(ADMIN_ROLE, deployer.address, GAS_OPTS)).wait();
  console.log("  + Timelock ADMIN_ROLE renounced by deployer");

  // ── Save deployment manifest ─────────────────────────────────────────────────
  const outDir = path.join(__dirname, "..", "deployments", "polygon");
  fs.mkdirSync(outDir, { recursive: true });

  const manifest = {
    network:   "polygon",
    chainId:   137,
    deployer:  deployer.address,
    timestamp: new Date().toISOString(),
    contracts: deployed,
  };

  const outPath = path.join(outDir, "mog-ecosystem.json");
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
  console.log(`\n  Manifest saved: ${outPath}`);

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log("\n" + "=".repeat(60));
  console.log("  DEPLOYMENT COMPLETE");
  console.log("=".repeat(60));
  for (const [name, addr] of Object.entries(deployed)) {
    console.log(`  ${name.padEnd(20)} ${addr}`);
  }

  const postBalance = await ethers.provider.getBalance(deployer.address);
  const spent = balance - postBalance;
  console.log(`\n  POL spent : ${ethers.formatEther(spent)}`);
  console.log(`  Remaining : ${ethers.formatEther(postBalance)}`);
  console.log("=".repeat(60));

  // ── Polygonscan Verification ─────────────────────────────────────────────────
  if (network.name === "polygon") {
    console.log("\n  Verifying all 8 contracts on Polygonscan...");
    await verify(deployed.MOGToken,      [deployer.address]);
    await verify(deployed.FaithBadge,    [deployer.address]);
    await verify(deployed.PrayerWall,    [deployer.address]);
    await verify(deployed.TithingVault,  [deployer.address, deployed.MOGToken, deployed.FaithBadge]);
    await verify(deployed.MOGRegistry,   [deployer.address, deployed.MOGToken, deployed.FaithBadge]);
    await verify(deployed.MOGTimelock,   [TIMELOCK_DELAY, [], [ethers.ZeroAddress], deployer.address]);
    await verify(deployed.MOGGovernor,   [deployed.MOGToken, deployed.MOGTimelock]);
    await verify(deployed.MissionFactory,[deployer.address, deployed.MOGRegistry, deployed.FaithBadge]);
    console.log("\n  Verification complete.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
