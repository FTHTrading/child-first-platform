<div align="center">

<!-- BADGES -->
![Status](https://img.shields.io/badge/Status-Phase_0_Complete-22c55e?style=for-the-badge&logo=checkmarx&logoColor=white)
![Network](https://img.shields.io/badge/Network-Polygon_Mainnet-8247e5?style=for-the-badge&logo=polygon&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14.2.5-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary_Genesis_Elite-c9a84c?style=for-the-badge)

![Tests](https://img.shields.io/badge/Tests-31%2F31_Passing-22c55e?style=flat-square&logo=jest&logoColor=white)
![Contracts](https://img.shields.io/badge/Contracts-Deployed_%26_Verified-8247e5?style=flat-square&logo=ethereum)
![Deployed](https://img.shields.io/badge/Frontend-Live_on_Netlify-00c7b7?style=flat-square&logo=netlify)
![Worker](https://img.shields.io/badge/mensofgod.com-Live_Cloudflare_Worker-f38020?style=flat-square&logo=cloudflare)
![Build](https://img.shields.io/badge/Build_Standard-Genesis_Elite_v2.0-c9a84c?style=flat-square)

# ✝ Child First Platform × Men of God
### Genesis Elite Humanitarian & Fund-Me Build Standard v2.0

**A transparent, accountable, on-chain donation platform connecting men of God with children who lack food and basic necessities.**  
Every dollar is traceable. Every claim is provable. Every child record is protected.

[childfirst.mensofgod.com](https://childfirst.mensofgod.com) · [mensofgod.com](https://mensofgod.com) · [Polygonscan](https://polygonscan.com/address/0x7868D0D5aD5DB9a462093D06cAE2e8c7D3Cbf386)

</div>

---

## Table of Contents

| # | Section |
|---|---------|
| 1 | [System Overview](#-system-overview) |
| 2 | [Live Deployments](#-live-deployments) |
| 3 | [Architecture](#-architecture) |
| 4 | [Smart Contracts](#-smart-contracts) |
| 5 | [Quick Start — All Systems](#-quick-start--all-systems) |
| 6 | [Prerequisites](#-prerequisites) |
| 7 | [Monorepo Setup (Cold Clone)](#-monorepo-setup-cold-clone) |
| 8 | [Contracts — Compile / Test / Deploy / Verify](#-contracts--compile--test--deploy--verify) |
| 9 | [Web App — Dev / Build / Database](#-web-app--dev--build--database) |
| 10 | [Environment Variables](#-environment-variables) |
| 11 | [Cloudflare Workers — mensofgod.com](#-cloudflare-workers--mensofgodcom) |
| 12 | [Component Library](#-component-library) |
| 13 | [Deployment Pipeline](#-deployment-pipeline) |
| 14 | [Scripts Reference](#-scripts-reference) |
| 15 | [Readiness & Proof Registry](#-readiness--proof-registry) |
| 16 | [Governance Documents Index](#-governance-documents-index) |
| 17 | [Launch Blocker Gates](#-launch-blocker-gates) |
| 18 | [Security & Threat Model Summary](#-security--threat-model-summary) |
| 19 | [Contributing](#-contributing) |

---

## 🏗 System Overview

This is not a donation widget. This is an **institutional-grade humanitarian platform** built from constitutional first principles under the **Genesis Elite Build Standard**.

```
┌─────────────────────────────────────────────────────────────────┐
│                     GENESIS ELITE ECOSYSTEM                      │
│                                                                   │
│  mensofgod.com          childfirst.mensofgod.com                 │
│  ┌───────────────┐      ┌─────────────────────────────────┐     │
│  │ Cloudflare    │      │ Next.js 14 Web App (Netlify)     │     │
│  │ Worker        │─────▶│ wagmi v2 · RainbowKit · Prisma  │     │
│  │ (mog-home)    │      │ Tailwind · Drizzle ORM          │     │
│  └───────────────┘      └──────────────┬────────────────── ┘     │
│                                        │ wagmi / viem             │
│                         ┌──────────────▼──────────────┐          │
│                         │   Polygon Mainnet (137)       │         │
│                         │                               │         │
│                         │  CampaignFactory (Ownable)   │         │
│                         │  Campaign (per-child vault)  │         │
│                         │  DonationReceipt (ERC-721 ♦ )│         │
│                         │  Soulbound NFT Certificates   │         │
│                         └───────────────────────────────┘         │
│                                                                   │
│  PostgreSQL (Prisma/Drizzle)  ·  Neon DB (Netlify Edge)          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Live Deployments

| System | URL | Platform | Status |
|--------|-----|----------|--------|
| **Child First Web App** | [childfirst.mensofgod.com](https://childfirst.mensofgod.com) | Netlify | ![Live](https://img.shields.io/badge/-LIVE-22c55e?style=flat-square) |
| **Men of God Home** | [mensofgod.com](https://mensofgod.com) | Cloudflare Worker | ![Live](https://img.shields.io/badge/-LIVE-22c55e?style=flat-square) |
| **CampaignFactory** | [Polygonscan ↗](https://polygonscan.com/address/0x7868D0D5aD5DB9a462093D06cAE2e8c7D3Cbf386) | Polygon Mainnet | ![Verified](https://img.shields.io/badge/-VERIFIED-8247e5?style=flat-square) |
| **DonationReceipt NFT** | [Polygonscan ↗](https://polygonscan.com/address/0x2Bd17aD3abE1783B2006B47A9d415457178C2422) | Polygon Mainnet | ![Verified](https://img.shields.io/badge/-VERIFIED-8247e5?style=flat-square) |

---

## 🏛 Architecture

### Monorepo Structure

```
child-first-platform/
├── contracts/                   # Hardhat + TypeScript smart contract workspace
│   ├── contracts/
│   │   ├── CampaignFactory.sol  # Factory + campaign registry (Ownable)
│   │   ├── Campaign.sol         # Per-child donation vault, dual-sig disbursal
│   │   └── DonationReceipt.sol  # Soulbound ERC-721 NFT certificates
│   ├── scripts/
│   │   ├── deploy.ts            # Deployment script (local / testnet / mainnet)
│   │   └── generate-wallet.ts   # Wallet generation utility
│   ├── test/
│   │   └── ChildFirst.test.ts   # 31 passing tests
│   ├── deployments/polygon/     # Deployment artifacts
│   ├── hardhat.config.ts
│   └── package.json
│
├── web/                         # Next.js 14 App Router workspace
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Homepage: GenesisJourney + ComifyStory + CTA
│   │   │   ├── layout.tsx       # Root layout: metadata, favicon, footer
│   │   │   ├── about/           # Mission, team, values
│   │   │   ├── transparency/    # On-chain audit trail
│   │   │   ├── tokenomics/      # Token & funding model
│   │   │   ├── whitepaper/      # Full whitepaper
│   │   │   ├── governance/      # DAO governance
│   │   │   ├── certificates/    # NFT tiers + OpenSea links
│   │   │   └── admin/           # Admin dashboard
│   │   └── components/
│   │       ├── GenesisJourney.tsx    # 6-step IoT animated tracker
│   │       ├── CertificateCard.tsx   # NFT donation cert display
│   │       ├── ComifyStory.tsx       # 6-panel SVG comic strip
│   │       ├── DonateModal.tsx       # Enhanced modal with cert + journey
│   │       └── Navigation.tsx        # Nav with logo + Certificates link
│   ├── public/
│   │   ├── logo.svg             # Shield SVG — blue gradient, gold star
│   │   └── favicon.svg          # 32×32 circle favicon
│   ├── prisma/schema.prisma     # PostgreSQL ORM schema
│   ├── drizzle.config.ts        # Drizzle ORM config
│   ├── netlify.toml             # Netlify deploy config
│   └── package.json
│
├── readiness/                   # Genesis Elite Readiness Registry
│   ├── contracts.registry.json  # Deployed contract addresses + chain info
│   ├── system.config.json       # System-wide configuration snapshot
│   ├── proofs.registry.json     # On-chain proof registry
│   ├── readiness.checklist.json # Pre-launch checklist state
│   ├── control-map.json         # Privilege control map
│   └── disclosures.md           # Public disclosures
│
├── [25 Governance Docs].md      # Constitutional + operational layer
├── pnpm-workspace.yaml          # pnpm monorepo workspace config
├── package.json                 # Root scripts (see Scripts Reference)
└── README.md                    # This file
```

### mog-guide (mensofgod.com — separate directory)

```
C:\Users\Kevan\mog-guide\       (or your local equivalent)
├── home.html                   # Main site HTML
├── home-worker.js              # Cloudflare Worker (embeds HTML as base64)
├── wrangler.toml               # Worker deployment config
├── guide.html                  # Guide page
├── intake.html                 # Intake page
└── audio-worker.js             # Audio worker
```

---

## 🔷 Smart Contracts

### Deployed Addresses — Polygon Mainnet (Chain 137)

| Contract | Address | Polygonscan | Verified |
|----------|---------|-------------|---------|
| **CampaignFactory** | `0x7868D0D5aD5DB9a462093D06cAE2e8c7D3Cbf386` | [View ↗](https://polygonscan.com/address/0x7868D0D5aD5DB9a462093D06cAE2e8c7D3Cbf386) | ✅ |
| **DonationReceipt (ERC-721)** | `0x2Bd17aD3abE1783B2006B47A9d415457178C2422` | [View ↗](https://polygonscan.com/address/0x2Bd17aD3abE1783B2006B47A9d415457178C2422) | ✅ |
| **Campaign** | `Deployed per child campaign` | Per-campaign | — |

### Contract Roles

| Contract | Role | Key Details |
|----------|------|-------------|
| `CampaignFactory` | Factory + registry | Ownable · immutable · no proxy · no upgrade |
| `Campaign` | Per-child donation vault | `OPERATOR_ROLE` + `DIRECTOR_ROLE` required for milestone disbursal |
| `DonationReceipt` | Soulbound ERC-721 NFT | Symbol: `CFDR` · on-chain SVG metadata · non-transferable |

### NFT Certificate

- **Standard**: ERC-721 (soulbound — non-transferable)
- **Metadata**: On-chain, base64-encoded SVG
- **Minting**: Auto-minted per donation, `MINTER_ROLE` granted to each Campaign
- **Tradeable**: No (soulbound)
- **Compiler**: Solidity `0.8.24`, `viaIR`, optimizer 200 runs, `evmVersion: cancun`

---

## ⚡ Quick Start — All Systems

```bash
# 1. Clone
git clone https://github.com/FTHTrading/child-first-platform.git
cd child-first-platform

# 2. Install all workspaces
pnpm install:all

# 3. Contracts — compile + test
pnpm contracts:compile
pnpm contracts:test        # Expect: 31 passing

# 4. Web app — development
cp web/.env.local.example web/.env.local
# (edit web/.env.local with your values — see Environment Variables section)
pnpm web:dev               # http://localhost:3000

# 5. mensofgod.com — Cloudflare Worker (from mog-guide directory)
cd /path/to/mog-guide
npx wrangler deploy        # Requires CLOUDFLARE_API_TOKEN env var
```

---

## 🛠 Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | ≥ 20.x | [nodejs.org](https://nodejs.org) |
| **pnpm** | ≥ 9.x | `npm install -g pnpm` |
| **Wrangler** | ≥ 4.x | `npm install -g wrangler` (or `npx wrangler`) |
| **Git** | any | [git-scm.com](https://git-scm.com) |

Optional (for contract deployment):

| Tool | Purpose |
|------|---------|
| **MATIC** on Polygon | Gas fees for deployment + transactions |
| **Polygonscan API key** | Source verification (`POLYGONSCAN_API_KEY` in `contracts/.env`) |

---

## 📦 Monorepo Setup (Cold Clone)

```bash
# Clone the repository
git clone https://github.com/FTHTrading/child-first-platform.git
cd child-first-platform

# Install all workspace dependencies in one shot
pnpm install:all

# — OR — install each workspace manually
cd contracts && pnpm install
cd ../web && pnpm install
```

### Workspace Layout

```
pnpm-workspace.yaml
  packages:
    - 'contracts'    # Hardhat workspace
    - 'web'          # Next.js workspace
```

---

## 🧪 Contracts — Compile / Test / Deploy / Verify

### Setup

```bash
cd contracts
cp .env.example .env
# Fill in: PRIVATE_KEY, POLYGON_RPC_URL, POLYGONSCAN_API_KEY
```

`contracts/.env` variables:

```env
PRIVATE_KEY=0x...                          # Deployer wallet private key
POLYGON_RPC_URL=https://polygon-rpc.com    # Or polygon.meowrpc.com
POLYGONSCAN_API_KEY=...                    # For source verification
```

### Compile

```bash
pnpm contracts:compile
# Artifacts → contracts/artifacts/
# TypeChain types → contracts/typechain-types/
```

### Test

```bash
pnpm contracts:test
# 31 tests across CampaignFactory, Campaign, DonationReceipt
# Expected: 31 passing
```

### Local Development Node

```bash
pnpm contracts:node
# Starts Hardhat Network on http://127.0.0.1:8545/
# Chain ID: 31337
```

### Deploy

```bash
# Local (Hardhat Network — must have node running)
pnpm contracts:deploy:local

# Testnet (Mumbai or Amoy — add RPC to hardhat.config.ts)
pnpm contracts:deploy:testnet

# Mainnet (Polygon — IRREVERSIBLE, ensure wallet is funded)
pnpm contracts:deploy:mainnet
```

> ⚠️  **Mainnet deployment is permanent.** Fund deployer wallet `0xd580E0273d8946aF73fc7f444f108282e7dd950B` with MATIC before running.

### Verify on Polygonscan

```bash
cd contracts
npx hardhat verify --network polygon \
  0x7868D0D5aD5DB9a462093D06cAE2e8c7D3Cbf386    # CampaignFactory

npx hardhat verify --network polygon \
  0x2Bd17aD3abE1783B2006B47A9d415457178C2422    # DonationReceipt
```

### Generate a New Deployer Wallet

```bash
pnpm contracts:wallet
# Outputs: address + mnemonic — store securely
```

---

## 🌐 Web App — Dev / Build / Database

### Setup

```bash
cd web
cp .env.local.example .env.local
# Fill in required values (see Environment Variables section)
```

### Development

```bash
pnpm web:dev
# → http://localhost:3000
```

### Production Build

```bash
pnpm web:build
pnpm web:start
# → http://localhost:3000 (production mode)
```

### Database — Prisma

```bash
# Run migrations
pnpm web:db:migrate

# Open Prisma Studio (visual DB browser)
pnpm web:db:studio
# → http://localhost:5555
```

### App Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage: GenesisJourney tracker, ComifyStory, CTA |
| `/about` | Mission, team, values |
| `/transparency` | On-chain audit trail |
| `/tokenomics` | Token and funding model |
| `/whitepaper` | Full technical whitepaper |
| `/governance` | DAO governance docs |
| `/certificates` | NFT tiers, OpenSea links, FAQ |
| `/admin` | Admin dashboard (protected) |

---

## 🔐 Environment Variables

### `web/.env.local`

```env
# Database
DATABASE_URL="postgresql://..."          # PostgreSQL connection string
DIRECT_URL="postgresql://..."            # Direct URL (bypasses PgBouncer)

# Blockchain
NEXT_PUBLIC_ALCHEMY_ID=...              # Alchemy API key (optional, for RPC)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=... # WalletConnect Cloud project ID

# Contract Addresses (Polygon Mainnet)
NEXT_PUBLIC_CAMPAIGN_FACTORY=0x7868D0D5aD5DB9a462093D06cAE2e8c7D3Cbf386
NEXT_PUBLIC_DONATION_RECEIPT=0x2Bd17aD3abE1783B2006B47A9d415457178C2422
NEXT_PUBLIC_CHAIN_ID=137
```

### `contracts/.env`

```env
PRIVATE_KEY=0x...
POLYGON_RPC_URL=https://polygon-rpc.com
POLYGONSCAN_API_KEY=...
```

> 🚫 **Never commit `.env` or `.env.local` files.** Both are in `.gitignore`.

---

## ☁ Cloudflare Workers — mensofgod.com

The `mensofgod.com` home site runs as a **Cloudflare Worker** serving HTML embedded as a base64 string.

### Directory (separate from monorepo)

```
mog-guide/
├── home.html          # Source HTML — EDIT THIS for content changes
├── home-worker.js     # CF Worker — embeds home.html as base64 (auto-generated)
└── wrangler.toml      # Wrangler deployment config
```

### wrangler.toml

```toml
name                = "mog-home"
main                = "home-worker.js"
compatibility_date  = "2026-04-02"
workers_dev         = false
preview_urls        = false

routes = [
  { pattern = "mensofgod.com/",     zone_name = "mensofgod.com" },
  { pattern = "www.mensofgod.com/", zone_name = "mensofgod.com" }
]
```

### Deploy

```bash
cd mog-guide

# Login (first time only)
npx wrangler login

# Deploy
npx wrangler deploy
```

### Update Content (home.html changes)

> ⚠️ **Critical:** The worker embeds HTML as base64. Editing `home.html` alone does NOT update the live site. You must re-encode:

```powershell
# PowerShell — re-encode HTML into worker
$html   = [System.IO.File]::ReadAllBytes("home.html")
$b64    = [System.Convert]::ToBase64String($html)
$worker = "export default { fetch() { const html = atob('$b64'); return new Response(html, { headers: {'Content-Type':'text/html;charset=UTF-8'} }); } };"
Set-Content -Path "home-worker.js" -Value $worker -Encoding UTF8
npx wrangler deploy
```

### Cloudflare Account

| Field | Value |
|-------|-------|
| Account | `kevanbtc@gmail.com` |
| Account ID | `07bcc4a189ef176261b818409c95891f` |
| Worker name | `mog-home` |
| Zone | `mensofgod.com` |
| Latest Version | `233cbecb-70e1-49d4-b3a1-f7953ac4b660` |

---

## 🎨 Component Library

### `GenesisJourney.tsx`
**6-step animated IoT tracker** showing the full donation pipeline from Genesis → Child.

| Step | Label |
|------|-------|
| 1 | Donor submits |
| 2 | Smart contract locks funds |
| 3 | Campaign review |
| 4 | Field verification |
| 5 | Disbursement authorized |
| 6 | Child impact confirmed |

```tsx
import { GenesisJourney } from '@/components/GenesisJourney';
<GenesisJourney />
```

---

### `CertificateCard.tsx`
**NFT donation certificate display** — renders soulbound ERC-721 metadata with tier badge and donor info.

```tsx
import { CertificateCard } from '@/components/CertificateCard';
<CertificateCard tokenId={42} donorAddress="0x..." tier="Gold" />
```

---

### `ComifyStory.tsx`
**6-panel SVG comic strip** — visual narrative of a child's journey from need to provision.

```tsx
import { ComifyStory } from '@/components/ComifyStory';
<ComifyStory />
```

---

### `DonateModal.tsx`
**Enhanced donation modal** — full flow with wallet connect, amount input, success screen with certificate preview + journey tracker.

```tsx
import { DonateModal } from '@/components/DonateModal';
<DonateModal campaignId="..." onClose={() => {}} />
```

---

### `Navigation.tsx`
**Top navigation** — responsive, includes logo, page links, and wallet connect button.

```tsx
import { Navigation } from '@/components/Navigation';
<Navigation />
```

---

## 🚀 Deployment Pipeline

### Web App → Netlify (Auto-Deploy)

```
git push origin master
  └─▶ Netlify webhook triggered
       └─▶ pnpm build (Next.js)
            └─▶ Deployed to childfirst.mensofgod.com
```

**Netlify Site ID**: `d406a256-e59d-40cd-aa39-0d67d9792150`  
**netlify.toml** controls build command and publish directory.

```toml
[build]
  command = "pnpm build"
  publish = ".next"
```

### Contracts → Polygon Mainnet (Manual)

```
pnpm contracts:deploy:mainnet
  └─▶ scripts/deploy.ts runs via Hardhat
       └─▶ CampaignFactory deployed
            └─▶ DonationReceipt deployed
                 └─▶ Addresses written to deployments/polygon/
                      └─▶ npx hardhat verify (Polygonscan)
```

### mensofgod.com → Cloudflare Worker (Manual)

```
Edit home.html
  └─▶ Re-encode as base64 → rebuild home-worker.js
       └─▶ npx wrangler deploy
            └─▶ Routes: mensofgod.com/ + www.mensofgod.com/
```

---

## 📋 Scripts Reference

Run from the repo root (`child-first-platform/`):

| Script | Command | Description |
|--------|---------|-------------|
| **Install all** | `pnpm install:all` | Install all workspace deps |
| **Web dev** | `pnpm web:dev` | Start Next.js dev server |
| **Web build** | `pnpm web:build` | Production build |
| **Web start** | `pnpm web:start` | Start production server |
| **DB migrate** | `pnpm web:db:migrate` | Run Prisma migrations |
| **DB studio** | `pnpm web:db:studio` | Open Prisma Studio |
| **Contracts compile** | `pnpm contracts:compile` | Compile Solidity |
| **Contracts test** | `pnpm contracts:test` | Run 31 tests |
| **Contracts node** | `pnpm contracts:node` | Hardhat local node |
| **Deploy local** | `pnpm contracts:deploy:local` | Deploy to Hardhat |
| **Deploy testnet** | `pnpm contracts:deploy:testnet` | Deploy to testnet |
| **Deploy mainnet** | `pnpm contracts:deploy:mainnet` | Deploy to Polygon ⚠️ |
| **Generate wallet** | `pnpm contracts:wallet` | Create new wallet |

---

## 📊 Readiness & Proof Registry

All readiness artifacts live in `readiness/`:

| File | Purpose |
|------|---------|
| `contracts.registry.json` | Deployed contract addresses, chain IDs, verification status |
| `system.config.json` | System-wide configuration snapshot |
| `proofs.registry.json` | On-chain proof claims + evidence hashes |
| `readiness.checklist.json` | Pre-launch gate checklist state |
| `control-map.json` | Full privilege control map (who can do what) |
| `disclosures.md` | Public disclosures document |

---

## 📋 Governance Documents Index

All 25 governance documents form the **Constitutional + Operational Layer** of the platform under the **Genesis Elite Build Standard**.

### Constitutional Layer

| Document | Purpose |
|----------|---------|
| [SYSTEM_CONSTITUTION.md](./SYSTEM_CONSTITUTION.md) | Foundational purpose, scope, trust assumptions |
| [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md) | Non-negotiable engineering and ethical principles |
| [THREAT_MODEL.md](./THREAT_MODEL.md) | All threat surfaces, actors, and mitigations |
| [TRUST_BOUNDARIES.md](./TRUST_BOUNDARIES.md) | What the system trusts and what it does not |
| [FAILURE_MODES.md](./FAILURE_MODES.md) | Every critical failure scenario with response plan |
| [OPERATOR_MODEL.md](./OPERATOR_MODEL.md) | Who runs this, how, and on what authority — full training curriculum |
| [CONTROL_AND_PERMISSIONS_MAP.md](./CONTROL_AND_PERMISSIONS_MAP.md) | Every privileged action and who can take it |
| [ASSET_AND_VALUE_FLOW.md](./ASSET_AND_VALUE_FLOW.md) | Every dollar path from donor to child |
| [PROOF_REQUIREMENTS.md](./PROOF_REQUIREMENTS.md) | What must be proven before any public claim |
| [LAUNCH_BLOCKERS.md](./LAUNCH_BLOCKERS.md) | Hard gates blocking any public launch (12 categories, 75+ blockers) |
| [FUND_CUSTODY_AND_CONTROL.md](./FUND_CUSTODY_AND_CONTROL.md) | Fund custody structure and disbursement controls |
| [BENEFICIARY_DOCUMENTATION.md](./BENEFICIARY_DOCUMENTATION.md) | Child vetting, privacy, and protection protocols |
| [IMPACT_CLAIMS_PROOF_MAP.md](./IMPACT_CLAIMS_PROOF_MAP.md) | Every impact claim mapped to an evidence requirement |
| [DONOR_RIGHTS_AND_DISCLOSURES.md](./DONOR_RIGHTS_AND_DISCLOSURES.md) | Donor protections, refund policy, fee disclosure |
| [CAMPAIGN_END_STATE_RULES.md](./CAMPAIGN_END_STATE_RULES.md) | What happens at every campaign terminal state |
| [LEGAL_AND_TAX_STATUS.md](./LEGAL_AND_TAX_STATUS.md) | Legal entity, jurisdiction, compliance obligations |
| [GENESIS_RULES.md](./GENESIS_RULES.md) | The gate: what blocks progress at each phase |

### Operational Readiness Layer

| Document | Purpose |
|----------|---------|
| [INCIDENT_RESPONSE_PLAN.md](./INCIDENT_RESPONSE_PLAN.md) | P0/P1/P2/P3 response procedures; contact tree; drill schedule |
| [CONTENT_MODERATION_POLICY.md](./CONTENT_MODERATION_POLICY.md) | Image pipeline; prohibited content; CSAM protocol; moderator standards |
| [AML_POLICY.md](./AML_POLICY.md) | Anti-money laundering; KYC tiers; SAR filing; OFAC screening |
| [DISASTER_RECOVERY_PLAN.md](./DISASTER_RECOVERY_PLAN.md) | RTO/RPO targets; backup schedule; recovery procedures; failover |
| [ACCESSIBILITY_STANDARDS.md](./ACCESSIBILITY_STANDARDS.md) | WCAG 2.1 AA mandates; critical flow testing; launch gate |
| [VENDOR_DUE_DILIGENCE.md](./VENDOR_DUE_DILIGENCE.md) | Tier 1/2/3 vendor classification; DPA requirements; vendor register |
| [WHISTLEBLOWER_POLICY.md](./WHISTLEBLOWER_POLICY.md) | Independent reporting channel; non-retaliation; external escalation |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | System setup guide for operators |

---

## 🚦 Launch Blocker Gates

**All 12 categories must fully clear before any public campaign or donation is accepted.**

| Gate | Category | Blockers |
|------|----------|----------|
| A | Legal + Governance | 14 |
| B | Financial Controls + AML | 16 |
| C | Child Protection + Content Moderation | 16 |
| D | Smart Contract Security | 8 |
| E | Platform Security | 10 |
| F | Operational Readiness | 8 |
| G | Accessibility | 6 |
| H | Privacy + Data Protection | 6 |
| I | KYC / Compliance | 8 |
| J | Infrastructure | 5 |
| K | Incident Response | 4 |
| L | Governance Ratification | 4 |
| **TOTAL** | | **75+** |

See [LAUNCH_BLOCKERS.md](./LAUNCH_BLOCKERS.md) for the full gate-by-gate checklist.

---

## 🔐 Security & Threat Model Summary

Key security properties enforced by design:

| Property | Enforcement |
|----------|------------|
| **No rug-pull** | Campaign funds locked in per-child contract; dual-sig disbursal required |
| **Soulbound receipts** | NFT certificates non-transferable; prevents receipt trading / forgery |
| **No admin withdrawal** | Campaign contracts have no owner-drain function |
| **On-chain audit trail** | Every donation + disbursement emits events; fully queryable |
| **Child privacy** | No PII in on-chain data; off-chain records follow GDPR/COPPA protocols |
| **AML / KYC** | Tiered KYC gates per [AML_POLICY.md](./AML_POLICY.md) |
| **CSAM zero-tolerance** | Image pipeline with hash-blocklist per [CONTENT_MODERATION_POLICY.md](./CONTENT_MODERATION_POLICY.md) |
| **Incident response** | P0 response < 15 min per [INCIDENT_RESPONSE_PLAN.md](./INCIDENT_RESPONSE_PLAN.md) |

See the full threat model: [THREAT_MODEL.md](./THREAT_MODEL.md)

---

## 🤝 Contributing

This project operates under the **Genesis Elite Humanitarian Build Standard v2.0**. All contributions must:

1. Pass all 31 contract tests (`pnpm contracts:test`)
2. Maintain WCAG 2.1 AA accessibility compliance
3. Not reduce governance document coverage
4. Be reviewed against [GENESIS_RULES.md](./GENESIS_RULES.md) phase gates
5. Never expose PII, treasury keys, or deployment credentials

---

<div align="center">

**Built with purpose. Deployed with integrity. For the children.**

*Child First Platform — A Men of God Initiative*  
*Genesis Elite Humanitarian Build Standard v2.0*

[![Polygon](https://img.shields.io/badge/Polygon-Mainnet-8247e5?style=flat-square&logo=polygon)](https://polygon.technology)
[![Netlify](https://img.shields.io/badge/Deployed-Netlify-00c7b7?style=flat-square&logo=netlify)](https://childfirst.mensofgod.com)
[![Cloudflare](https://img.shields.io/badge/Worker-Cloudflare-f38020?style=flat-square&logo=cloudflare)](https://mensofgod.com)

</div>
**Status:** Phase 0 — Enhancement pass complete | Ready for Phase 1 gating review
**Standard:** Genesis Elite — Humanitarian & Fund-Me Build Standard v2.0

---

## What This Is

A transparent, accountable, verifiable platform that connects donors with children who lack food and basic necessities. Every dollar is traceable. Every claim is provable. Every child record is protected.

This is not a donation widget. This is an institutional-grade humanitarian platform built from constitutional first principles.

---

## Phase 0 Documents — Foundation (Constitutional Layer)

| Document | Status | Purpose |
|---|---|---|
| SYSTEM_CONSTITUTION.md | COMPLETE | Foundational purpose, scope, trust assumptions |
| DESIGN_PRINCIPLES.md | COMPLETE | Non-negotiable engineering and ethical principles |
| THREAT_MODEL.md | COMPLETE | All threat surfaces, actors, mitigations |
| TRUST_BOUNDARIES.md | COMPLETE | What the system trusts and what it does not |
| FAILURE_MODES.md | COMPLETE | Every critical failure scenario with response |
| OPERATOR_MODEL.md | COMPLETE v1.1 | Who runs this, how, and on what authority — full training curriculum |
| CONTROL_AND_PERMISSIONS_MAP.md | COMPLETE | Every privileged action and who can take it |
| ASSET_AND_VALUE_FLOW.md | COMPLETE | Every dollar path from donor to child |
| PROOF_REQUIREMENTS.md | COMPLETE | What must be proven before any public claim |
| LAUNCH_BLOCKERS.md | COMPLETE v1.1 | Hard gates (12 categories, 75+ blockers) blocking any public launch |
| FUND_CUSTODY_AND_CONTROL.md | COMPLETE | Fund custody structure and disbursement controls |
| BENEFICIARY_DOCUMENTATION.md | COMPLETE | Child vetting, privacy, and protection protocols |
| IMPACT_CLAIMS_PROOF_MAP.md | COMPLETE | Every impact claim mapped to evidence requirement |
| DONOR_RIGHTS_AND_DISCLOSURES.md | COMPLETE | Donor protections, refund policy, fee disclosure |
| CAMPAIGN_END_STATE_RULES.md | COMPLETE | What happens at every campaign terminal state |
| LEGAL_AND_TAX_STATUS.md | COMPLETE | Legal entity, jurisdiction, compliance obligations |
| GENESIS_RULES.md | COMPLETE | The gate: what blocks progress at each phase |

## Phase 0 Documents — Enhancement Layer (Operational Readiness)

| Document | Status | Purpose |
|---|---|---|
| INCIDENT_RESPONSE_PLAN.md | COMPLETE | P0/P1/P2/P3 response procedures; contact tree; drill schedule |
| CONTENT_MODERATION_POLICY.md | COMPLETE | Image pipeline; prohibited content; CSAM protocol; moderator standards |
| AML_POLICY.md | COMPLETE | Anti-money laundering; KYC tiers; SAR filing; OFAC screening |
| DISASTER_RECOVERY_PLAN.md | COMPLETE | RTO/RPO targets; backup schedule; recovery procedures; failover |
| ACCESSIBILITY_STANDARDS.md | COMPLETE | WCAG 2.1 AA mandates; critical flow testing requirements; launch gate |
| VENDOR_DUE_DILIGENCE.md | COMPLETE | Tier 1/2/3 vendor classification; DPA requirements; vendor register |
| WHISTLEBLOWER_POLICY.md | COMPLETE | Independent reporting channel; non-retaliation; external escalation |

---

## Launch Blocker Gates (Summary)

**12 categories of launch blockers. ALL must clear before any public campaign or donation.**

| Gate | Category | # Blockers |
|---|---|---|
| 1 | Legal + Governance (A + L) | 14 |
| 2 | Financial Controls + AML (B + I) | 16 |
| 3 | Child Protection + Content Moderation (C + H) | 16 |
| 4 | Security + Disaster Recovery (D + G) | 16 |
| 5 | Operations + Vendor Controls (E + K) | 13 |
| 6 | Content Disclosures + Accessibility (F + J) | 11 |

---

## Build Order

Phase 0 → Phase 1 (Discovery) → Phase 2 (Architecture) → Phase 3 (Engineering) → Phase 4 (Build) → Phase 5 (Verification) → Phase 6 (Public Trust) → Phase 7 (Operator Readiness) → Phase 8 (Final Review)

**No code until Phase 0 is signed off. No launch until all 6 blocker gates clear.**

---

## Core Commitments

1. Every child record is treated as sensitive data — no exceptions
2. Every dollar is traceable from receipt to use — no exceptions
3. Every impact claim has evidence — no exceptions
4. Every donor has recourse — no exceptions
5. Platform operators cannot access donor funds unilaterally — no exceptions

---

*Working title: Child First Platform. Rename before public launch.*
