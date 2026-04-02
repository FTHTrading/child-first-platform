import { ethers, network } from "hardhat";
import fs   from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();

  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("═══════════════════════════════════════════════");
  console.log("  Child First Platform — Contract Deployment");
  console.log("═══════════════════════════════════════════════");
  console.log(`  Network  : ${network.name}`);
  console.log(`  Deployer : ${deployer.address}`);
  console.log(`  Balance  : ${ethers.formatEther(balance)} MATIC`);
  console.log("───────────────────────────────────────────────");

  if (balance === 0n) {
    console.error("\n[ERROR] Deployer wallet has 0 MATIC.");
    console.error("Run:  cd contracts && pnpm generate-wallet");
    console.error("Then fund the displayed address with MATIC and retry.\n");
    process.exit(1);
  }

  // ── Deploy CampaignFactory ──────────────────────────────────────────
  // (DonationReceipt is deployed internally by the factory constructor)
  console.log("\n  Deploying CampaignFactory...");
  const Factory = await ethers.getContractFactory("CampaignFactory");
  const factory = await Factory.deploy(deployer.address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();

  const receiptAddress = await (factory as any).receiptContract();

  console.log(`  CampaignFactory  : ${factoryAddress}`);
  console.log(`  DonationReceipt  : ${receiptAddress}`);

  // ── Persist deployment addresses ────────────────────────────────────
  const chainId     = (await ethers.provider.getNetwork()).chainId;
  const deploymentData = {
    network:     network.name,
    chainId:     chainId.toString(),
    deployer:    deployer.address,
    deployedAt:  new Date().toISOString(),
    contracts: {
      CampaignFactory: factoryAddress,
      DonationReceipt: receiptAddress,
    },
  };

  const outDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${network.name}.json`);
  fs.writeFileSync(outFile, JSON.stringify(deploymentData, null, 2));
  console.log(`\n  Addresses saved → deployments/${network.name}.json`);

  // ── Copy addresses to web for frontend consumption ──────────────────
  const webEnvDir = path.join(__dirname, "..", "..", "web", "src", "contracts");
  if (fs.existsSync(webEnvDir)) {
    fs.writeFileSync(
      path.join(webEnvDir, "deployments.json"),
      JSON.stringify(deploymentData, null, 2),
    );
    console.log("  Addresses copied → web/src/contracts/deployments.json");
  }

  // ── Demo campaign on non-mainnet ─────────────────────────────────────
  if (network.name !== "polygon") {
    console.log("\n  Creating demo campaign for testing...");

    const ninety = Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60;
    const tx = await (factory as any).createCampaign(
      "camp-001-food-atlanta",
      "https://api.childfirst.org/campaigns/001",
      ethers.parseEther("10"),
      ninety,
      deployer.address,  // operator (deployer for demo)
      deployer.address,  // director (deployer for demo)
    );
    await tx.wait();
    const demoAddr = await (factory as any).campaignById("camp-001-food-atlanta");
    console.log(`  Demo Campaign    : ${demoAddr}`);
  }

  // ── Polygonscan verification hint ────────────────────────────────────
  if (network.name === "polygon") {
    console.log("\n  To verify contracts on Polygonscan:");
    console.log(`  npx hardhat verify --network ${network.name} ${factoryAddress} ${deployer.address}`);
  }

  console.log("\n═══════════════════════════════════════════════");
  console.log("  DEPLOYMENT COMPLETE");
  console.log("═══════════════════════════════════════════════");
  console.log("  Next steps:");
  console.log("  1. Update web/.env.local with the contract addresses above");
  console.log("  2. cd web && pnpm install && pnpm dev");
  console.log("═══════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
