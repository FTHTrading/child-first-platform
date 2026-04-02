# ASSET AND VALUE FLOW
**Platform:** Child First Platform
**Version:** 1.0 | **Date:** 2026-04-02

---

## PURPOSE

This document traces every path that money, value, and benefits take through the platform — from a donor's wallet to a child receiving aid. Every node in this flow is accountable, auditable, and documented.

---

## SECTION 1 — COMPLETE VALUE FLOW DIAGRAM

```
[DONOR]
    │
    │  Pays via Stripe (card / bank transfer)
    │  Pre-donation: fee disclosed, campaign status shown
    ▼
[PAYMENT PROCESSOR — STRIPE]
    │
    │  Processes payment, deducts Stripe processing fee (~2.9% + $0.30)
    │  Sends signed webhook to platform API
    │  Holds balance, pays out to Donor Trust Account within 5 business days
    ▼
[DONOR TRUST ACCOUNT — Bank Account A]
    │  Holds ALL incoming donations
    │  Dual-sig: Platform Owner + Finance Officer
    │
    ├──► PLATFORM FEE EXTRACTION
    │       │  Finance Officer initiates at disbursement time (not deposit)
    │       │  Transferred to: Operational Account — Bank Account C
    │       │  Logged, receipt generated
    │       ▼
    │    [OPERATIONAL ACCOUNT — Bank Account C]
    │       Used only for: staff, infrastructure, legal, compliance costs
    │
    ├──► CAMPAIGN ALLOCATION
    │       │  Finance Officer allocates to specific campaign escrow
    │       │  Transfer to: Campaign Escrow — Bank Account B
    │       │  Matches donation record → campaign_id linkage
    │       ▼
    │    [CAMPAIGN ESCROW — Bank Account B]
    │       Holds funds for active campaigns
    │       Dual-sig: Platform Owner + Finance Officer
    │       No operator has access or view
    │
    └──► RESERVE ACCOUNT — Bank Account D
            Minimum 10% of total donations held
            For: refunds, dispute resolutions, emergency coverage
            Dual-sig: Platform Owner + Independent Director

[CAMPAIGN ESCROW]
    │
    │  Campaign Operator achieves milestone
    │  Submits disbursement request + documentation
    │
    ▼
[DISBURSEMENT REVIEW PROCESS]
    │
    │  Campaign Auditor verifies milestone documentation ──► REJECT / REQUEST CLARIFICATION
    │  Finance Officer reviews completeness
    │  Thresholded approvals: Owner + Auditor (small), + Director (large)
    │
    ▼
[TRANSFER TO BENEFICIARY ORGANIZATION]
    │
    │  Wire transfer to pre-verified organization bank account
    │  Transfer amount = allocated donation minus platform fee
    │  Logged with: date, amount, campaign, milestone, authorizing parties
    │
    ▼
[BENEFICIARY ORGANIZATION]
    │
    │  Receives funds
    │  Uses funds per stated campaign purpose (food, supplies, etc.)
    │  Submits impact report + evidence to platform
    │
    ▼
[IMPACT VERIFICATION]
    │
    │  Verifier reviews evidence
    │  Marks claim as Verified or leaves as Claimed
    │  Donor can view result on campaign page
    │
    ▼
[CHILD RECEIVES AID]
    │
    │  Food, basic necessities, or other defined support delivered
    │  Documented (anonymized) by campaign operator
    │  Reported as aggregate impact (not individual children)
    │
    ▼
[PUBLIC TRANSPARENCY REPORT]
    Total donations → total disbursements → verified impact
    Published on platform within 24 hours of each significant fund movement
```

---

## SECTION 2 — VALUE FLOW BY ACTOR

### 2.1 — Donor Flow

| Step | What Happens | Timing |
|---|---|---|
| Donor visits campaign page | Sees fee disclosure, campaign status, operator identity | Before donation |
| Donor submits payment | Stripe processes; donation record created in platform | Instant |
| Donor receives receipt | Email sent with full breakdown | < 24 hours |
| Funds held in trust | Donor can track campaign progress | Ongoing |
| Milestone achieved | Donor sees impact report on campaign page | After verification |
| Refund (if requested) | Processed from Campaign Escrow or Reserve Account | ≤ 30-day window |

### 2.2 — Campaign Operator Flow

| Step | What Happens |
|---|---|
| Campaign created + approved | Campaign goes live; operators cannot see escrow balance in real time |
| Donors contribute | Funds accumulate in Campaign Escrow (not operator-visible) |
| Milestone achieved | Operator submits milestone documentation + disbursement request |
| Auditor review | Operator receives approval or request for clarification |
| Disbursement | Funds transferred to operator's verified organization bank account |
| Impact report | Operator submits evidence; verifier reviews |

### 2.3 — Platform Flow

| Step | What Happens |
|---|---|
| Donation received | Platform records donation, links to campaign, allocates to escrow |
| Platform fee extracted | At disbursement time, fee transferred to operational account |
| Disbursement authorized | Multi-party authorization; transfer executed |
| Audit trail updated | Every step logged |
| Public report updated | Dashboard reflects new totals within 24 hours |

---

## SECTION 3 — PLATFORM FEE ACCOUNTING

### 3.1 — Fee Calculation

```
Gross Donation Amount (what donor pays):     $100.00
  Less: Stripe processing fee (~2.9% + $0.30): ($3.20)
  Net amount received by platform:           $96.80
  Less: Platform fee (e.g., 5%):             ($4.84)
  Net amount available for campaign:         $91.96
```

This breakdown must be shown to the donor during checkout.

### 3.2 — Fee-Cover Option

If the donor selects "I'll cover the fee":
```
Donor pays: $100.00 + platform fee equivalent = ~$105.26
  Stripe processing fee: ($3.35)
  Platform fee: ($5.26)
  Net to campaign: $100.00 — full stated amount
```

### 3.3 — Fee Revenue Usage

Platform fee revenue flows exclusively to the Operational Account. Permitted uses:
- Software infrastructure (hosting, SaaS tools)
- Staff compensation (Finance Officer, CPO, Admin, engineering)
- Legal and compliance costs
- Auditor fees
- Payment processing fees not covered by Stripe spread

Prohibited uses of operational account funds:
- Distribution to equity holders
- Personal expenses of Platform Owner or staff
- Campaign-related expenses that belong in the campaign escrow

---

## SECTION 4 — PROHIBITED VALUE FLOWS

These fund movements are explicitly prohibited and constitute a policy violation if they occur:

| Prohibited Flow | Reason |
|---|---|
| Donor Trust Account → Operational Account (except via fee extraction at disbursement) | Commingling |
| Campaign Escrow → Platform Owner personal account | Fund diversion |
| Stripe balance → Campaign Operator directly | Bypasses escrow and controls |
| Undocumented cash payments to beneficiary organizations | Unauditable; fraud risk |
| Platform fee > disclosed percentage | Misrepresentation |
| Funds moved between campaigns without donor notification | Donor intent violation |
| Advance disbursement before milestone confirmed | Control bypass |

---

## SECTION 5 — DIGITAL ASSET FLOW (IF IMPLEMENTED)

If cryptocurrency donations are accepted in a future phase:

```
[DONOR sends crypto]
    │
    ▼
[MULTI-SIG HOT WALLET — 2-of-3 keyholders]
    │  Convert to stablecoin or fiat equivalent: automated
    │  Move to cold storage if above hot wallet limit
    ▼
[COLD STORAGE MULTI-SIG — 2-of-3]
    │  Treated as equivalent to Donor Trust Account
    │  Same custody rules apply (dual-sig, audit, segregation)
    ▼
[All downstream flows mirror fiat flows above]
```

Digital asset flows require additional controls:
- All wallet addresses are public and linked from transparency report
- No privacy coins accepted
- All on-chain transfers logged with transaction hash and purpose comment

---

## SECTION 6 — AUDITABLE CHECKPOINTS

Each of the following is an auditable checkpoint that must appear in the audit trail:

1. Donation received (amount, source, campaign, timestamp)
2. Donation allocated to campaign escrow (amount, campaign, timestamp)
3. Disbursement request submitted (amount, campaign, milestone, requester)
4. Disbursement approved (authorizers, timestamp, documentation reference)
5. Transfer executed (amount, destination, bank reference, timestamp)
6. Platform fee extracted (amount, date, operational account credited)
7. Impact report submitted (campaign, reporter, evidence references)
8. Impact claim verified or disputed (verifier, decision, timestamp)
9. Refund processed (donor, amount, reason, timestamp)
10. Reserve account balance reconciliation (monthly)

---

*This document is the authoritative record of intended value flows. Any value movement not described here requires explicit policy approval before implementation. Implementation must reflect this flow precisely.*
