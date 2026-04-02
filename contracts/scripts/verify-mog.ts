/**
 * verify-mog.ts
 * Verifies all 8 MOG contracts on Polygonscan.
 */

import { run } from "hardhat";
import { ethers } from "ethers";

const DEPLOYER  = "0xd580E0273d8946aF73fc7f444f108282e7dd950B";
const TIMELOCK_DELAY = 2 * 24 * 60 * 60; // 172800

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

async function verify(name: string, address: string, args: unknown[]) {
  process.stdout.write(`  Verifying ${name}...`);
  try {
    await run("verify:verify", { address, constructorArguments: args });
    console.log(" done");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("Already Verified") || msg.includes("already verified")) {
      console.log(" already verified");
    } else if (msg.includes("does not have bytecode")) {
      console.log(` SKIP (${msg.slice(0, 60)})`);
    } else {
      console.log(` WARN: ${msg.slice(0, 100)}`);
    }
  }
}

async function main() {
  console.log("Verifying MOG contracts on Polygonscan...\n");

  await verify("MOGToken",      ADDRS.MOGToken,      [DEPLOYER]);
  await verify("FaithBadge",    ADDRS.FaithBadge,    [DEPLOYER]);
  await verify("PrayerWall",    ADDRS.PrayerWall,    [DEPLOYER]);
  await verify("TithingVault",  ADDRS.TithingVault,  [DEPLOYER, ADDRS.MOGToken, ADDRS.FaithBadge]);
  await verify("MOGRegistry",   ADDRS.MOGRegistry,   [DEPLOYER, ADDRS.MOGToken, ADDRS.FaithBadge]);
  await verify("MOGTimelock",   ADDRS.MOGTimelock,   [TIMELOCK_DELAY, [], [ethers.ZeroAddress], DEPLOYER]);
  await verify("MOGGovernor",   ADDRS.MOGGovernor,   [ADDRS.MOGToken, ADDRS.MOGTimelock]);
  await verify("MissionFactory",ADDRS.MissionFactory,[DEPLOYER, ADDRS.MOGRegistry, ADDRS.FaithBadge]);

  console.log("\nVerification complete.");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
