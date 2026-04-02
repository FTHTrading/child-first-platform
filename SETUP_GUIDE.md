# Child First Platform — Setup Guide

> **Goal:** Deploy smart contracts to Polygon, fund your deployer wallet, and launch the website.

---

## Prerequisites

| Tool        | Version | Install                              |
|-------------|---------|--------------------------------------|
| Node.js     | ≥ 20    | https://nodejs.org                   |
| pnpm        | ≥ 9     | `npm install -g pnpm`                |
| PostgreSQL  | ≥ 14    | https://www.postgresql.org/download  |

---

## Step 1 — Generate Your Deployer Wallet

This wallet will deploy the smart contracts. You will fund it with MATIC for gas.

```bash
cd contracts
pnpm install
pnpm generate-wallet
```

**Output:**
```
═══════════════════════════════════════════════════════════════
  NEW DEPLOYER WALLET — Child First Platform
═══════════════════════════════════════════════════════════════

  ► ADDRESS TO FUND WITH MATIC (safe to share publicly):
    0xAbCd...1234

  ► PRIVATE KEY (never share — store in .env only):
    0xdeadbeef...

  ► MNEMONIC (store encrypted, offline backup):
    word word word word ...
═══════════════════════════════════════════════════════════════
```

> **Security:** The script writes `.env` automatically. The `.env` file is in `.gitignore` and will never be committed. Store your mnemonic offline.

---

## Step 2 — Fund the Deployer Wallet

### Testnet (Polygon Amoy — FREE for testing)

1. Go to https://faucet.polygon.technology
2. Paste the address from Step 1
3. Request MATIC (up to 0.5 MATIC free per day)

### Mainnet (Polygon — for public launch)

Send **20–50 MATIC** to your deployer address to cover:
- CampaignFactory deployment: ~0.5 MATIC
- DonationReceipt (NFT) deployment: ~1 MATIC (auto-deployed by factory)
- Creating first campaigns: ~0.1 MATIC each
- Buffer for gas fluctuations

---

## Step 3 — Compile & Test Contracts

```bash
cd contracts         # if not already there
pnpm compile         # compiles all Solidity contracts + generates TypeChain types
pnpm test            # runs 31 automated tests — all must pass
```

Expected output:
```
  31 passing (1s)
```

---

## Step 4 — Deploy to Testnet (Polygon Amoy)

```bash
cd contracts
pnpm deploy:testnet
```

Output:
```
═══════════════════════════════════════════════════════════════
  CampaignFactory  : 0xFactory...
  DonationReceipt  : 0xReceipt...
  Addresses saved → deployments/amoy.json
```

Copy these two addresses — you'll need them in the next step.

### Deploy to Mainnet (when ready)

```bash
pnpm deploy:mainnet
```

---

## Step 5 — Configure the Web App

```bash
cd ../web
pnpm install
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Get a free WalletConnect project ID at https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Paste addresses from Step 4
NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDRESS=0xFactory...
NEXT_PUBLIC_DONATION_RECEIPT_ADDRESS=0xReceipt...

# 80002 = Amoy testnet | 137 = Polygon mainnet
NEXT_PUBLIC_CHAIN_ID=80002

# Your PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/childfirst?schema=public"
```

---

## Step 6 — Set Up the Database

```bash
cd web
pnpm prisma:push       # create tables in PostgreSQL (dev)
# or for production:
pnpm prisma:migrate    # create a named migration
```

Then seed your first campaign:
```bash
# Use POST /api/campaigns with your platform admin wallet in future,
# or manually insert via Prisma Studio:
pnpm prisma:studio
```

---

## Step 7 — Launch the Site

```bash
cd web
pnpm dev
```

Open http://localhost:3000

---

## Step 8 — Create Your First Campaign

Once deployed and the site is running, create a campaign via the API:

```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "camp-001-food-atlanta",
    "title": "Food Security for 100 Children — Atlanta",
    "description": "Provide daily nutritious meals for 100 children in underserved communities for 3 months.",
    "goalAmount": "10",
    "deadline": "2025-03-01T00:00:00Z",
    "location": "Atlanta, GA",
    "organizationName": "Community Care Foundation",
    "contractAddress": "0xCampaignAddress..."
  }'
```

Then create the corresponding on-chain campaign from your deployer wallet (see Hardhat console or a simple script).

---

## Production Deployment Checklist

- [ ] Contracts verified on Polygonscan (`pnpm verify --network polygon ...`)
- [ ] WalletConnect project ID set
- [ ] `NEXT_PUBLIC_CHAIN_ID=137` (mainnet)
- [ ] PostgreSQL provisioned (Railway, Supabase, Neon, or self-hosted)
- [ ] Domain configured (e.g. childfirst.org)
- [ ] HTTPS enabled
- [ ] `.env.local` never committed to git
- [ ] Admin multi-sig wallet configured as factory owner (Gnosis Safe recommended)

---

## Architecture Summary

```
contracts/
├── contracts/
│   ├── CampaignFactory.sol    ← Ownable factory + registry
│   ├── Campaign.sol           ← Per-campaign donation + milestone
│   └── DonationReceipt.sol    ← Soulbound ERC-721 NFT receipts
├── scripts/
│   ├── deploy.ts              ← Deploy to any network
│   └── generate-wallet.ts     ← Generate deployer wallet
└── test/
    └── ChildFirst.test.ts     ← 31 automated tests (100% passing)

web/
├── src/app/                   ← Next.js 14 App Router pages + API routes
├── src/components/            ← React components (DonateModal, MilestoneTracker, ...)
├── src/lib/                   ← wagmi config, contract ABIs + addresses
├── src/types/                 ← Shared TypeScript types
└── prisma/schema.prisma       ← PostgreSQL schema (Campaign, Donation, Milestone, Operator)
```

---

## Contract Security Features

| Feature                   | Implementation                                |
|---------------------------|-----------------------------------------------|
| Reentrancy protection     | `ReentrancyGuard` on all state-changing calls  |
| CEI pattern               | State updated before external `.call()` in disbursements |
| Dual-signature disburse   | Both `OPERATOR_ROLE` + `DIRECTOR_ROLE` must approve |
| Emergency pause           | Director or Admin can pause donations          |
| Soulbound NFT receipts    | `_update()` override blocks post-mint transfers |
| No untracked ETH          | `receive()` and `fallback()` both revert       |
| Access control            | OpenZeppelin `AccessControl` + `Ownable`       |

---

## Getting Help

- Polygon Amoy faucet: https://faucet.polygon.technology
- WalletConnect project: https://cloud.walletconnect.com
- OpenZeppelin docs: https://docs.openzeppelin.com/contracts/5.x
- Hardhat docs: https://hardhat.org/docs
