# FUND CUSTODY AND CONTROL
**Platform:** Child First Platform
**Version:** 1.0 | **Date:** 2026-04-02
**Standard:** Genesis Elite Humanitarian & Fund-Me Build Standard v2.0

> **ABSOLUTE RULE:** No single person — not even the platform founder — may unilaterally access, move, or release donor funds without a second authorized signature.

---

## SECTION 1 — FUND SEGREGATION ARCHITECTURE

### 1.1 — Required Account Structure

The platform MUST maintain these separately titled accounts:

| Account | Purpose | Access Level |
|---|---|---|
| **Donor Trust Account** | Holds all incoming donor contributions | Platform Owner + Finance Officer (dual-sig) |
| **Campaign Escrow Account** | Holds funds allocated to active campaigns | Platform Owner + Campaign Auditor (dual-sig) |
| **Operational Account** | Platform operating expenses only | Platform Owner unilateral (strictly capped) |
| **Reserve Account** | Minimum 10% of all-time donations held as reserve for refunds/disputes | Platform Owner + Independent Director (dual-sig) |
| **Emergency Freeze Account** | Zero-balance holding during platform freeze events | Read-only except during declared emergency |

### 1.2 — Segregation Rules

1. Donor funds MUST NEVER commingle with operational funds.
2. Platform fees are extracted at the point of disbursement, not at the point of donation.
3. The operational account receives only: (a) extracted platform fees, (b) documented grants.
4. No operational expense may be paid from the donor trust account, even temporarily.
5. All accounts must be titled to reflect their restricted purpose (e.g., "Child First Platform — Donor Trust Account").

---

## SECTION 2 — CUSTODY REQUIREMENTS

### 2.1 — Fiat Custody

- Donor Trust Account and Campaign Escrow must be held at an FDIC-insured institution (US) or equivalent jurisdiction-appropriate insured institution.
- Bank must be notified in writing that the account is held in trust for third-party beneficiaries (creates stronger legal protections).
- Account statements are due to independent auditor monthly.
- Wire transfer authority requires dual authorization.

### 2.2 — Digital Asset Custody (if applicable)

If the platform accepts cryptocurrency donations:
- Funds must be held in a multi-signature wallet requiring ≥ 2-of-3 keyholders
- No single keyholder may be a full-time employee under the same supervision chain
- Hardware wallets required for all private keys
- At least one keyholder must be geographically independent of the platform's primary operator
- Daily hot wallet limit: no more than the equivalent of 1 week's projected disbursements
- All on-chain transactions are public and must be linked from the platform's transparency report

### 2.3 — Stripe / Payment Processor Custody

- Payouts from Stripe to bank account: maximum delay of 5 business days from donation
- Stripe account cannot be used as a long-term holding account
- Stripe account credentials held by Platform Owner only; shared with Finance Officer under break-glass procedure

---

## SECTION 3 — DISBURSEMENT AUTHORIZATION CHAIN

### 3.1 — Standard Disbursement Process

```
Campaign Operator submits disbursement request
    └── Includes: milestone documentation, invoice, delivery confirmation
         └── Platform Finance Officer reviews for completeness
              └── Campaign Auditor independently verifies milestone
                   └── Finance Officer initiates bank transfer
                        └── Platform Owner co-signs (dual-sig required)
                             └── Transfer executed
                                  └── Logged with full audit trail
```

### 3.2 — Disbursement Authorization Thresholds

| Amount | Required Authorizers | Review Window |
|---|---|---|
| $0 – $999 | Finance Officer + Platform Owner | 48 hours |
| $1,000 – $9,999 | Finance Officer + Platform Owner + Campaign Auditor | 72 hours |
| $10,000 – $49,999 | Finance Officer + Platform Owner + Campaign Auditor + Independent Director | 5 business days |
| $50,000+ | All above + documented legal review of disbursement legality | 10 business days |

### 3.3 — Emergency Micro-Disbursement Path

For urgent situations (child in immediate need, documented emergency):
- Maximum: $500 per event
- Authorization: Finance Officer + Platform Owner (same as standard, no reduction)
- Documentation requirement is NOT waived — documentation may be submitted retrospectively within 72 hours
- Retrospective documentation failure triggers a review and potential clawback

### 3.4 — Prohibited Disbursement Conditions

The following BLOCK any disbursement regardless of authorization:
1. Campaign has an open fraud or verification dispute
2. Campaign operator identity verification is expired or incomplete
3. Disbursement destination bank account was added or changed within the past 7 days
4. Platform is under an emergency freeze event
5. The disbursement destination does not match the documented beneficiary organization

---

## SECTION 4 — AUDIT REQUIREMENTS

### 4.1 — Internal Audit (Monthly)

Every calendar month:
- [ ] Reconcile donor trust account balance against platform donation records
- [ ] Reconcile campaign escrow balances against campaign allocation records
- [ ] Verify no operational expenses were paid from restricted accounts
- [ ] Review all disbursements against authorization records
- [ ] Verify platform fee extraction amounts match fee schedule
- [ ] Report any discrepancies to Platform Owner and Independent Director immediately

### 4.2 — Independent Financial Audit (Annual)

- Full independent audit of all accounts annually
- Auditor must have no financial relationship with Platform Owner or any campaign operator
- Audit report published publicly within 30 days of completion
- Audit scope includes: (a) fund flow verification, (b) donor trust account integrity, (c) disbursement authorization compliance, (d) reserve adequacy

### 4.3 — Real-Time Transparency Reporting

The platform must publish a public dashboard showing:
- Total donations received (all-time and by campaign)
- Total disbursements made (all-time and by campaign)
- Platform fees collected
- Number of active campaigns
- Last audit date and link to report

This dashboard must update within 24 hours of any significant fund movement.

---

## SECTION 5 — EMERGENCY FREEZE PROCEDURES

### 5.1 — Freeze Triggers

Any of the following activates Emergency Freeze:
1. Independent auditor reports material discrepancy
2. Credible fraud allegation involving fund custody
3. Platform Owner account compromise confirmed
4. Regulatory inquiry or court order received
5. Platform Owner declaration of emergency

### 5.2 — Emergency Freeze Actions

When Emergency Freeze is activated:
1. All pending disbursements halted immediately
2. Payment processor inbound donations suspended
3. Independent Director notified within 1 hour
4. Donors notified on platform within 24 hours
5. Full fund reconciliation completed before freeze is lifted

### 5.3 — Freeze Lift Authorization

Emergency Freeze cannot be lifted by Platform Owner alone. Required:
- Platform Owner + Independent Director + documented resolution of trigger event

---

## SECTION 6 — PLATFORM FEE STRUCTURE

### 6.1 — Fee Rules

- Platform fee percentage must be disclosed to donors BEFORE they complete a donation (pre-transaction disclosure, not in fine print)
- Fee structure must be documented and version-controlled
- Fee changes require 30-day advance notice to existing donors and campaign operators
- Voluntary 100% pass-through option: donors may choose to cover the fee so 100% of their stated donation reaches the campaign

### 6.2 — Maximum Fee Guidance

This is not a regulatory limit but a platform integrity standard:
- Suggested maximum: 8% of donation amount for platform operations
- Any fee above 5% requires disclosure of how the fee is used
- 0% platform fee campaigns must be clearly marked and their operational funding source disclosed

---

## SECTION 7 — REFUND AND CLAWBACK POLICY

### 7.1 — Donor Refund Policy

- Donations may be refunded within 30 days if campaign has not disbursed funds
- Refund requests documented in audit trail
- Disputed donations held pending resolution, not disbursed

### 7.2 — Campaign Clawback

- Funds may be reclaimed from a campaign operator if: (a) fraud is confirmed, (b) milestone documentation is found to be falsified, (c) legal order requires return
- Clawback authority reserved to Platform Owner + Independent Director jointly
- All clawback events are publicly disclosed in the transparency report

---

*This document is enforced as a LAUNCH BLOCKER. The platform cannot accept donor funds until every section of this document has a corresponding implementation and the implementation has been reviewed by a qualified attorney.*
