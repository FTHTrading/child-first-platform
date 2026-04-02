# PROOF REQUIREMENTS
**Platform:** Child First Platform
**Version:** 1.0 | **Date:** 2026-04-02

---

## PURPOSE

Every material claim this platform makes — about impact, identity, fund use, and compliance — must be provable. This document defines the standard of evidence required before a claim may be published, acted upon, or used in any public communication.

---

## SECTION 1 — IDENTITY PROOF REQUIREMENTS

### 1.1 — Campaign Operator Identity

**Claim being proven:** This campaign is operated by a real, identifiable legal entity.

**Required Evidence:**
- [ ] Government-issued photo ID of the authorized representative (individual identity)
- [ ] Legal entity registration documents (articles of incorporation, business registration, or equivalent)
- [ ] Active registered address that matches registration documents
- [ ] Proof of organizational bank account in the entity's name (voided check or bank letter)
- [ ] Signed Campaign Operator Agreement by the authorized representative

**Standard:** KYC (Know Your Customer) — same standard applied to financial account opening. Platform cannot apply a lesser standard.

**What ID verification CANNOT prove:**
- That the operator has genuine intent (history and audit reveal this over time)
- That the organization's programs operate as described (this is what Verifiers assess)

---

### 1.2 — Beneficiary Verification (Guardian/Organization)

**Claim being proven:** Children exist who are experiencing the type of need the campaign describes.

**Required Evidence (submitted by Campaign Operator, reviewed by CPO):**
- [ ] Consent documentation from guardian (per BENEFICIARY_DOCUMENTATION.md)
- [ ] Referral from a recognized partner organization (NGO, food bank, social services) OR
- [ ] Documentation from a recognized program (school meal program enrollment, SNAP/EBT enrollment equivalent, etc.)

**What beneficiary verification CANNOT prove:**
- Exact number of children (counts are self-reported and spot-checked, not census-verified)
- That specific children will receive specific amounts (this is tracked at the disbursement level)

---

### 1.3 — Verifier Independence

**Claim being proven:** The verifier has no conflict of interest with the campaign they are verifying.

**Required Evidence:**
- [ ] Signed verifier independence declaration with specific conflicts disclosed
- [ ] Platform Admin review of disclosed relationships
- [ ] No financial relationship (employment, ownership, grant recipient) with the Campaign Operator in the past 2 years

---

## SECTION 2 — IMPACT CLAIM PROOF REQUIREMENTS

### 2.1 — Meals / Food Delivered

**Claim tier — "Claimed"** (operator self-reports, no verification required):
- Campaign Operator submits an impact report stating X meals were delivered

**Claim tier — "Verified":**

| Verification Method | Evidence Required |
|---|---|
| Direct procurement | Vendor invoices + delivery receipts + signed acceptance by distribution site |
| Partner organization delivery | Partner organization's own impact report + platform spot-check of 10% of sites |
| Third-party distribution audit | Signed audit report from an independent food distribution verifier |

**What satisfies "meals delivered":**
- Specific count is supported by invoices or receipts matching the claimed amount
- Distribution location exists and can be independently confirmed
- Time period of delivery matches the report period

**What does NOT satisfy:**
- Claimed count with no supporting documentation
- "We usually deliver X per week" extrapolation without evidence for the specific period
- Photos of food without distribution records

---

### 2.2 — Children Reached

**Claim tier — "Claimed":** Operator reports a head count.

**Claim tier — "Verified":**

| Verification Method | Evidence Required |
|---|---|
| Program enrollment records | Anonymized enrollment count from the distribution site (school, shelter, food pantry) |
| Third-party census | Independent organization's count for the same site/period |
| Meal service attendance records | Anonymized attendance log for each service date |

**Important:** "Children reached" counts never include identifiable names or photos. Counts are verified against distribution records, not against individual child records held by the platform.

---

### 2.3 — Funds Used for Stated Purpose

**Claim tier — "Claimed":** Operator states funds were used for food/supplies.

**Claim tier — "Verified":**

| Verification Method | Evidence Required |
|---|---|
| Vendor invoices | Invoices from food suppliers or vendors showing quantities and costs |
| Bank statements | Bank statements of beneficiary organization showing payments to vendors (redacted for non-relevant items) |
| Third-party accounting | External audit of campaign funds by an independent accountant |

**Required for ALL disbursements (not just verified tier):**
- Invoice or purchase order documenting what was bought
- Delivery receipt or inventory acceptance record
- Total cost that matches or is less than the disbursement amount

---

## SECTION 3 — OPERATOR CLAIM PROOF REQUIREMENTS

### 3.1 — Claims About the Organization

If a Campaign Operator page includes claims such as "10 years of experience," "500,000 children served," or "operating in 12 countries," each claim must be evidenced:

| Claim Type | Evidence Required |
|---|---|
| Years operating | Legal entity registration date on documents |
| Historical children served | Published annual reports, third-party audit, or equivalent |
| Geographic presence | Registration, office documentation, or partner agreements in named jurisdictions |
| Awards or certifications | Official documentation from the awarding body |

Unverified organizational claims must be marked with a "Claimed" qualifier or removed.

---

## SECTION 4 — PLATFORM CLAIMS PROOF REQUIREMENTS

### 4.1 — Platform-Level Impact Numbers

Any statistic published by the platform itself (e.g., "Over 50,000 children fed through our platform") must:
- Be sourced from aggregated, verified campaign impact reports
- Differentiate "Claimed" totals from "Verified" totals if both are cited
- Be updated whenever underlying data changes
- Be traceable: clicking the number takes the donor to the contributing campaigns

### 4.2 — Tax-Deductibility Claims

**Evidence required before making this claim:**
- Signed legal opinion from qualified tax attorney confirming deductibility status
- IRS determination letter (or equivalent in the operating jurisdiction), or application submitted with date referenced
- Legal counsel review of all public tax-related language before publication

### 4.3 — Security and Compliance Claims

If the platform claims PCI compliance, SOC 2, GDPR compliance, or any other certification:
- Active certificate or attestation document from the certifying body
- Renewal date tracked and published
- Claim removed or updated immediately if certification lapses

---

## SECTION 5 — EVIDENCE STORAGE REQUIREMENTS

All evidence submitted to support any claim must be:

- Stored in the platform's document management system (not in campaign operator's own storage)
- Linked to the specific campaign, disbursement, and impact report it supports
- Retained for the audit retention period (5 years minimum)
- Not modifiable after submission (new evidence is added; old evidence is not replaced)
- Accessible to auditors during review periods

---

## SECTION 6 — CLAIM STATES AND DISPLAYED LABELS

| State | Meaning | Platform Display |
|---|---|---|
| **Draft** | Submitted, pending review | Not public |
| **Claimed** | Operator self-reported, no independent verification | "Claimed by operator" label |
| **Under Review** | Verifier is actively reviewing | "Impact under review" label |
| **Verified** | Independent verifier confirmed with evidence | Green "Verified" badge with verifier name and date |
| **Disputed** | Claim challenged; investigation underway | "Impact disputed — under investigation" label |
| **Retracted** | Claim found to be false; removed | Removed from public view; noted in audit trail |

Platform marketing and fundraising communications may only use "Verified" claims. "Claimed" numbers may not be used in donor acquisition messaging.

---

*Impact can only be as strong as the evidence behind it. Every claim without evidence is a liability — to donors, to the children we serve, and to the platform's continued operation.*
