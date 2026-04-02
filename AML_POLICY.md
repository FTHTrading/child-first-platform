# ANTI-MONEY LAUNDERING (AML) POLICY
**Platform:** Child First Platform
**Version:** 1.0 | **Date:** 2026-04-02
**Enforced by:** Platform Owner + Finance Officer + Platform Compliance Officer

> This platform accepts donor funds and disburses them to beneficiaries. That flow of money — even for charitable purposes — can be exploited by bad actors. These controls exist to protect children and protect the platform.

---

## SECTION 1 — REGULATORY CONTEXT

This policy is written in compliance with or preparation for:
- **Bank Secrecy Act (BSA)** — US federal AML law applicable to financial service providers
- **FinCEN requirements** — including Suspicious Activity Report (SAR) filing standards
- **FATF Recommendations** — Financial Action Task Force international standards for charitable organizations
- **OFAC Sanctions Lists** — no transactions may involve Specially Designated Nationals (SDN) or sanctioned jurisdictions
- **State charitable solicitation laws** — each state in which the platform is registered to solicit may have additional AML or financial oversight requirements

**Important:** Before the platform accepts any donations, legal counsel must confirm whether the platform is classified as a Money Services Business (MSB) under FinCEN rules. If so, MSB registration is required before accepting funds. [STATUS: PENDING LEGAL REVIEW — blocking to launch]

---

## SECTION 2 — PROHIBITED TRANSACTIONS (ABSOLUTE)

The following transactions will never be processed:

| Category | Description |
|---|---|
| OFAC Sanctioned Parties | Any transaction where the donor or beneficiary appears on the OFAC SDN list or operates from a sanctions-restricted jurisdiction |
| Anonymous high-value donations | Donations above $500 from unverified accounts with no KYC |
| Structuring | Series of transactions clearly designed to stay below reporting thresholds |
| Shell organization donations | Donations from organizations that cannot be identified or verified |
| Jurisdictions of concern | Transactions originating from FATF-designated high-risk jurisdictions [list reviewed quarterly] |

---

## SECTION 3 — KNOW YOUR CUSTOMER (KYC) REQUIREMENTS

### 3.1 — Individual Donors

| Donation Size | KYC Required |
|---|---|
| < $100 | Email verification only |
| $100 – $999 | Email verified + name + country |
| $1,000 – $4,999 | Full name + address + date of birth |
| $5,000 – $9,999 | Identity document (government ID) required |
| $10,000+ | Enhanced due diligence (Section 3.3) |

### 3.2 — Organizational Donors

Any donation from an organization (business, foundation, trust) requires:
- Organization legal name
- EIN or equivalent registration number
- Authorized representative identity (name + contact)
- Certification that funds do not originate from a sanctioned source

Donations from anonymous organizational sources are prohibited regardless of amount.

### 3.3 — Enhanced Due Diligence (EDD)

EDD is triggered for:
- Individual donations of $10,000+
- Any recurring donor whose cumulative 12-month total exceeds $25,000
- Donors identified as Politically Exposed Persons (PEPs) (see Section 4)
- Any donor that automated screening flags as unusual

EDD process:
1. Account is automatically placed in `pending_edd` state
2. Finance Officer reviews within 48 hours
3. Additional documentation may be requested
4. If EDD cannot be resolved in 5 business days, funds are held and SAR reviewed
5. If EDD fails: refund issued, account banned, SAR filed if warranted

---

## SECTION 4 — POLITICALLY EXPOSED PERSONS (PEPs)

A PEP is a person who holds or has recently held a prominent public function — heads of state, senior government officials, senior executives of state-owned enterprises, senior political party officials.

**Donations from PEPs:**
- Not prohibited
- Require Enhanced Due Diligence (Section 3.3)
- Require documented source of funds declaration
- Require Platform Owner sign-off (cannot be delegated)

**PEP screening:**
- Manual screening against World-Check or equivalent database
- Automated transaction monitoring flags large donations for review
- Screening must occur before donation is accepted into the operational fund

---

## SECTION 5 — TRANSACTION MONITORING

### 5.1 — Automated Monitoring Triggers

The payment processor (Stripe) and the platform's own transaction ledger must be configured to flag:

| Pattern | Trigger Threshold | Action |
|---|---|---|
| Single large cash equivalent donation | > $5,000 | Auto-flag; Finance Officer review |
| Structuring pattern | 3+ transactions in 24 hours from same account totaling > $5,000 | Auto-flag; review |
| Velocity anomaly | Donation count from single account > 10 in 24 hours | Auto-flag; review |
| Geographic mismatch | Donor country inconsistent with IP origin | Manual review flag |
| New account + high value | Account < 7 days old + donation > $2,500 | Auto-flag; review |
| Rapid refund request | Donation followed by refund request within 1 hour | Flag for fraud review |
| PEP-adjacent | Any account sharing name/address/IP with a known PEP | Escalate to Finance Officer |

### 5.2 — Human Review Process

When a flag is triggered:
1. Transaction is held in `pending_review` state
2. Finance Officer is notified by email within 1 hour (automated alert)
3. Finance Officer reviews within 4 business hours
4. Decision options: approve, request additional information, reject + refund, SAR referral

### 5.3 — No Real-Time Penalties on Donors

Legitimate donors who trigger a flag receive only a neutral message ("Your donation is being processed — you will receive confirmation within 24 hours"). They are not told they are under AML review. This prevents tipping off money launderers and prevents unnecessary donor alarm.

---

## SECTION 6 — SUSPICIOUS ACTIVITY REPORTS (SARs)

### 6.1 — When to File

A SAR must be reviewed for filing when:
- A transaction involves funds that the platform has reason to believe are related to criminal activity
- A donor has structured transactions to evade reporting thresholds
- A donor's identity cannot be verified after Enhanced Due Diligence
- EDD reveals that a donor is associated with a sanctioned entity or individual
- A Campaign Operator has been found to have fabricated beneficiaries or laundered program funds

**Note:** Threshold SAR filings (Currency Transaction Reports — CTRs) apply to cash transactions of $10,000+. Because this is a digital-only platform, physical CTR requirements may not apply directly, but any equivalent digital cash-to-charity vehicle of $10,000+ should be reviewed by legal counsel.

### 6.2 — Who Files

The Platform Owner or appointed Compliance Officer is responsible for filing.

SAR filing must not be delegated to volunteers or unverified staff.

### 6.3 — SAR Timeline

- SAR must be filed with FinCEN within **30 days** of the date the suspicious activity is identified
- If no suspect has been identified yet, **60 days** from the date of detection
- Records supporting the SAR must be retained for **5 years**

### 6.4 — Tipping Off Prohibition

Once a SAR is filed or under consideration, the subject of the SAR must NOT be informed. This is a federal legal requirement under 31 U.S.C. § 5318(g)(2).

---

## SECTION 7 — DISBURSEMENT AML CONTROLS

Funds leaving the platform to partners or beneficiaries face equal scrutiny.

### 7.1 — Recipient Verification

Before any disbursement:
- Recipient organization must have completed full Operator verification (see OPERATOR_MODEL.md)
- Recipient organization must provide EIN/tax ID or equivalent
- Recipient must pass OFAC SDN screening
- All disbursements go to pre-verified bank accounts or payment rails only
- No disbursements to anonymous accounts, cryptocurrency wallets, or unverified remittance services

### 7.2 — Disbursement Monitoring

| Pattern | Flag |
|---|---|
| First disbursement to a new organization > $10,000 | Finance Officer + Platform Owner review |
| Disbursement request within 24 hours of large donation | Hold; verify source cleaned |
| Recipient bank account changes | 5-business-day hold; re-verify recipient |
| Disbursement to jurisdiction with FATF concerns | Enhanced review; legal counsel consult |

### 7.3 — Disbursement Documentation

Every disbursement must have:
- Matched campaign purpose
- Verified recipient identity
- Bank transfer record
- Confirmation of receipt (for disbursements > $1,000)
- Retained for minimum 5 years

---

## SECTION 8 — RECORD RETENTION

| Record Type | Retention Period |
|---|---|
| Donor KYC documentation | 5 years from last transaction |
| Transaction records | 5 years from transaction date |
| SAR filings and supporting documentation | 5 years from filing date |
| EDD records | 5 years from completion |
| OFAC screening results | 5 years from screening date |
| Disbursement records | 5 years from disbursement date |

Records must be stored in a format that is retrievable for regulatory examination within 3 business days of a request.

---

## SECTION 9 — AML TRAINING REQUIREMENTS

All persons with financial authority on this platform must complete:

1. **BSA/AML Fundamentals** — before exercising any financial function; annually renewable
2. **OFAC Sanctions Compliance** — identification of sanctioned parties and jurisdictions
3. **Charitable Organization AML Risks** — FATF guidance on NPO abuse; annual
4. **Red Flag Recognition** — structuring, layering, integration patterns specific to donation platforms
5. **SAR Filing Procedure** — Finance Officer and Platform Owner only; before first SAR-eligible event

Training records must be retained for minimum 3 years.

---

## SECTION 10 — POLICY REVIEW

This policy is reviewed:
- Annually by the Finance Officer and Platform Owner
- Whenever a SAR is filed
- Whenever FinCEN, OFAC, or FATF guidance changes materially
- Whenever the platform expands to accept funds from new jurisdictions
- After any AML-related incident

Changes must be documented with version history.

---

**[LEGAL STATUS: This policy reflects the intent and controls framework. Final version must be reviewed and approved by qualified legal counsel with BSA/AML expertise before the platform accepts any donations. Do not launch without that review.]**
