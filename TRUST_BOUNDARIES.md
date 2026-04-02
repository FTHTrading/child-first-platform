# TRUST BOUNDARIES
**Platform:** Child First Platform
**Version:** 1.0 | **Date:** 2026-04-02

---

## PURPOSE

This document defines which actors and systems are trusted, at what level, and what verification is required to establish that trust. Every integration, user role, and data source operates within these boundaries. Trust is never assumed — it is granted, scoped, and revocable.

---

## SECTION 1 — TRUST LEVELS

| Level | Name | Definition |
|---|---|---|
| **L0** | Untrusted | No trust extended. Input is never executed, stored as-is, or acted upon. Must be sanitized before any use. |
| **L1** | Public | Read-only access to published data. No identity required. Cannot modify anything. |
| **L2** | Authenticated | Confirmed email + MFA. May perform scoped actions. Cannot touch money or child data. |
| **L3** | Verified Operator | L2 + completed identity verification + signed operator agreement. May submit campaigns and impact reports. |
| **L4** | Privileged Internal** | Platform Admin/Finance Officer. Full platform access except direct fund approval and beneficiary data. |
| **L5** | Custodial** | Platform Owner + Finance Officer jointly. Required for fund movements. |
| **L6** | Governance** | Independent Director. Required co-authority on emergency actions and high-value disbursements. |

---

## SECTION 2 — ACTOR TRUST MAP

| Actor | Trust Level | Trust Basis | What They Can Do |
|---|---|---|---|
| Anonymous visitor | L1 | None | View public campaign pages, public impact reports |
| Registered donor | L2 | Email verified + MFA | Donate, view receipts, submit disputes, manage own account |
| Campaign Operator | L3 | Identity check + agreement | Create campaigns, submit reports, request disbursements |
| Verifier | L3 | Identity check + independence check + agreement | Verify impact claims on unaffiliated campaigns |
| Platform Admin | L4 | Staff/contractor, internal auth | Approve campaigns, moderate content, manage operators |
| Finance Officer | L4 | Internal auth + role assignment | Initiate disbursements, reconcile accounts |
| Child Privacy Officer | L4 (specialized) | Internal auth + CPO designation | Access + control of beneficiary data only |
| Platform Owner | L5 (partial) | Owner identity + MFA | All L4 actions; co-signs fund movements; emergency freeze |
| Independent Director | L6 | External governance appointment | Co-signs high-value disbursements; emergency resolution |
| Partner Organizations | L3 (scoped) | Agreement + vetting | Submit beneficiary records via API only |
| Third-party Verifiers | L3 (scoped) | Agreement + independence check | Submit verified impact results via API |
| Payment Processor (Stripe) | L2 (inbound) | Webhook signatures required | Sends payment events to platform via signed webhook |
| Audit Firm | L4 (read-only, time-limited) | Engagement letter + scoped read credentials | Read all fund records; no write access |
| External API integrations | L1 by default | Each integration assessed individually; minimum necessary access | As specifically defined in integration agreement |

---

## SECTION 3 — DATA TRUST BOUNDARIES

### 3.1 — What the Platform Trusts

| Data Source | Trust Level | Reason |
|---|---|---|
| Internal database (read by platform) | L4 | Platform controls writes; integrity enforced by app layer |
| Stripe payment events (signed webhook) | L2 | Cryptographic signature verified on every event |
| Campaign Operator-submitted data | L3 | Treated as user-submitted; never executed, sanitized, moderated |
| Partner organization beneficiary records | L3 | Partner is a verified entity but data is not blindly trusted; reviewed by CPO |
| Impact reports from operators | L3 | Content, not authority — claims require independent verification to be marked "Verified" |
| Donor-provided contact info | L2 | Used for communication only; not trusted for identity |
| Third-party identity verification results | L3 | Trusted to a defined scope only (identity confirmed / not confirmed) |

### 3.2 — What the Platform NEVER Trusts

| Source | Why |
|---|---|
| User-supplied HTML/Markdown in campaign descriptions | XSS/injection risk — sanitized and rendered in sandboxed viewer only |
| Uploaded files (images, documents) | Malware risk — scanned and re-processed before storage or serving |
| Webhook payloads without valid signature | Spoofing risk — unsigned webhooks rejected without processing |
| API requests without valid authentication token | No anonymous writes to any platform endpoint |
| Operator self-reported impact numbers (without evidence) | Fraud risk — displayed as "Claimed" not "Verified" |
| Any inbound email-based instruction | Social engineering risk — no action taken on email alone |

---

## SECTION 4 — SYSTEM TRUST BOUNDARIES

### 4.1 — Internal Service Boundaries

| Service | Trusts | Does Not Trust |
|---|---|---|
| API Server | Database (read/write via ORM), Stripe (signed webhooks), Redis (cache, non-authoritative) | Direct database requests bypassing ORM |
| Database | Only the API server (connection-restricted) | Direct inbound connections from internet or admin workstations without VPN |
| Admin Panel | API Server (authenticated requests) | Direct database access |
| Beneficiary Data Store | Child Privacy Officer (via scoped credentials) | API Server (no beneficiary data in main app database) |
| Audit Log Store | System writes (append-only) | No human write access; no delete access for any role |
| Payment Processor Integration | Stripe (inbound webhooks with signature, outbound API) | No other payment data flows |

### 4.2 — Network Boundaries

- All inter-service communication is internal/VPC-only; no service is publicly accessible except the API server
- Database, Redis, beneficiary data store: no public inbound network access
- Admin panel: accessible only over VPN or whitelisted IP range (not public internet)
- Payment processor communication: outbound HTTPS only; inbound via webhook with signature

---

## SECTION 5 — TRUST ESTABLISHMENT PROCESS

### 5.1 — Elevating an Actor's Trust Level

| Elevation | Process Required |
|---|---|
| L1 → L2 (donor account) | Email verification + MFA setup |
| L2 → L3 (campaign operator) | Identity verification (KYC-grade), signed operator agreement, platform admin approval |
| L3 → L3 verifier | Separate application + independence check + platform admin approval |
| Any → L4 | Internal staff/contractor agreement + role assignment by Platform Owner only |
| Any → L5 | Reserved for Platform Owner only; cannot be elevated |
| Any → L6 | Reserved for Independent Director only; cannot be elevated by platform |

### 5.2 — Trust Revocation

Any trust level may be revoked. Revocation is effective immediately. The revoked actor:
- Loses all platform access within one session expiry (immediate for admin roles via session invalidation)
- May not create a new account to circumvent revocation
- Revocation is logged, with reason, in the audit trail
- Disputes of revocation addressed by Platform Owner + Independent Director

---

## SECTION 6 — THIRD-PARTY INTEGRATION TRUST

Before any new third-party service is integrated:
1. **Purpose limitation check:** Does the integration require access to child data? If yes, escalate to CPO and legal review before proceeding.
2. **Minimum necessary access:** API credentials scoped to only the operations required. No master keys passed to third parties.
3. **Data processing agreement:** Any third-party receiving user or beneficiary data must have a signed DPA reviewed by legal counsel.
4. **Revocability:** All integrations must be revocable independently — no single integration failure should take down the platform.
5. **Audit:** Third-party access is logged. Annually reviewed for whether the integration is still necessary.

---

*Trust boundaries must be updated whenever a new actor, integration, or data source is introduced. An undocumented trust relationship is an uncontrolled risk.*
