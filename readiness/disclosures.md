# Child First Platform — Risk & Control Disclosures

**System:** Child First Platform  
**Version:** 1.0.0  
**Published:** 2026-04-02  
**Network:** Polygon (Mainnet) / Polygon Amoy (Testnet)  
**Website:** https://childfirst.mensofgod.com

---

## What This Platform Is

Child First Platform is a transparent, on-chain charitable fundraising system. Donors connect a wallet and send MATIC (Polygon's native currency) to specific campaigns. Each donation results in a soulbound NFT receipt minted to the donor's wallet. Milestone disbursements require dual approval from two independent roles before any funds move.

---

## What You Are Donating

- You are sending **MATIC** (Polygon native token) to a specific Campaign smart contract.
- MATIC is a cryptocurrency. Its value in USD or other currencies fluctuates based on market conditions.
- You are not purchasing a security, equity, share, or financial instrument.
- The NFT receipt you receive is a **donation acknowledgment** only — it has no monetary value and is non-transferable.

---

## Smart Contract Risks

### Risk: Smart contract bugs
Smart contracts are code. Despite 31 automated tests and best-effort security review, bugs may exist. A bug could result in loss of donated funds.

**Mitigation planned:** Third-party audit before any campaign holds significant funds.

### Risk: No contract upgradeability
Contracts cannot be upgraded. If a critical bug is discovered, funds in affected campaigns cannot be migrated via contract logic alone — a manual process would be required.

**Mitigation:** Campaigns are individual contracts. A bad campaign does not affect others. Factory owner can pause campaigns.

### Risk: Gas costs
Donating requires paying Polygon gas fees (typically < $0.01 USD). Users must have MATIC in their wallet beyond the donation amount.

---

## Centralization Risks

### Risk: Factory owner is a single key (at launch)
The CampaignFactory contract is initially owned by a single deployer wallet. If that key is compromised, an attacker could deploy malicious campaigns.

**Disclosed:** Yes. Ownership transfer to a Gnosis Safe multi-sig wallet is planned before public campaign launch.

### Risk: Campaign ADMIN_ROLE
Each campaign has an admin role. The admin can grant/revoke Operator and Director roles and can pause the campaign.

**What admin CANNOT do:** Withdraw funds directly, bypass dual-sig milestone approval, transfer soulbound NFTs.

---

## What Admin Cannot Do

The platform has been deliberately designed to limit admin power:

- **Admin CANNOT withdraw donor funds.** There is no admin withdrawal function.
- **Admin CANNOT bypass dual-sig milestone approval.** Both OPERATOR and DIRECTOR roles must approve.
- **Admin CANNOT revoke or transfer donor NFT receipts.** Soulbound receipts are permanent.
- **Admin CANNOT upgrade contracts.** No proxy or upgrade pattern exists.
- **Admin CANNOT silently change milestone recipients.** All milestone data is on-chain and public.

---

## NFT Receipt Disclosures

- Donation receipts are **soulbound ERC-721 tokens** minted to the donor's wallet address.
- They are **non-transferable** and serve as an immutable record of the donation.
- They have **no monetary value** and cannot be sold or traded.
- Metadata (image + attributes) is stored entirely **on-chain**. No IPFS or external server is required.
- The receipt text shows: donation amount (MATIC), campaign ID, and receipt number.

---

## No Fiat Conversion

This platform does not convert MATIC to fiat currency. All donations and disbursements occur in MATIC on the Polygon blockchain.

---

## Audit Status

**As of 2026-04-02: PENDING**  
An independent smart contract audit has not yet been completed. Users should treat this platform as unaudited until an audit report is published.

Audit will be commissioned from a reputable EVM security firm before any large-scale fundraising campaigns are launched.

---

## Regulatory

This platform is not regulated by any financial authority. It does not collect KYC/AML information from donors. Use of this platform for financial crime, tax evasion, or money laundering is prohibited. Operators of individual campaigns are responsible for compliance with laws applicable to their jurisdiction.

---

## Tax

Charitable donations made through this platform may or may not be tax-deductible depending on your jurisdiction and the legal status of the recipient organization. The platform does not provide tax advice. Consult a qualified tax professional.

---

## Contact

Questions: kevan@unykorn.org  
Security disclosures: kevan@unykorn.org (subject: SECURITY — Child First Platform)

---

*This disclosure document is part of the genesis readiness layer and is updated as the platform evolves. Always check the latest version at the platform website or the repository.*
