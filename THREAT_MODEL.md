# THREAT MODEL
**Platform:** Child First Platform
**Version:** 1.0 | **Date:** 2026-04-02
**Standard:** STRIDE + Humanitarian-Specific Threat Categories

---

## OVERVIEW

This platform handles donated money, vulnerable child data, and public trust. It will be targeted by:
- Bad actors seeking to steal or divert funds
- Fraudsters fabricating beneficiaries or campaigns
- Attackers seeking child data
- Nation-state actors targeting financial infrastructure
- Platform insiders abusing elevated access
- Adversarial media and critics looking for reputational failures

Every threat below has a severity rating, likelihood rating, and mitigation status.

---

## THREAT CATEGORY 1 — FUND DIVERSION

### T1.1 — Fraudulent Campaign Creation
**Description:** A bad actor creates a realistic-looking campaign for nonexistent children, collects donations, and withdraws funds before detection.
**Severity:** CRITICAL | **Likelihood:** HIGH (common attack on donation platforms)
**Mitigations:**
- Campaign operators must complete verified identity check before activation
- Campaigns do not go live until reviewed and approved by admin
- Disbursement is not immediate — funds held in escrow pending verification milestone
- Campaign operators cannot withdraw; only designated beneficiary organizations can receive disbursements
- First disbursement requires field verification event

---

### T1.2 — Insider Fund Diversion
**Description:** A platform administrator or finance operator withdraws donor funds for personal use.
**Severity:** CRITICAL | **Likelihood:** MEDIUM
**Mitigations:**
- No single admin has unilateral disbursement authority over donor funds
- All disbursements above threshold require multi-party authorization
- All fund movements are logged with actor identity and reason
- Bank/custodian accounts require dual signatories
- Regular independent financial audit (quarterly minimum)
- Separation of duties: disbursement initiator cannot also be approver

---

### T1.3 — Campaign Operator Misuse of Funds
**Description:** A legitimate verified campaign operator receives funds and uses them for purposes other than stated.
**Severity:** HIGH | **Likelihood:** MEDIUM
**Mitigations:**
- Milestone-based disbursement: funds released against verified deliverables, not upfront
- Disbursement requests require documentation (invoices, delivery receipts)
- Random post-disbursement audits
- Operators must agree to audit access rights before receiving funds
- Clawback mechanism documented and legally enforceable in operating jurisdiction

---

### T1.4 — Payment Processor Compromise
**Description:** Platform's payment processor is compromised or freezes funds.
**Severity:** HIGH | **Likelihood:** LOW
**Mitigations:**
- Use tier-1 payment processor (Stripe or equivalent) with PCI DSS compliance
- Do not hold donor card data at application layer
- Maintain processor relationship documentation
- Documented failover to backup processor
- Donor funds in transit are insured where available

---

## THREAT CATEGORY 2 — CHILD DATA EXPOSURE

### T2.1 — Unauthorized Access to Beneficiary Records
**Description:** Database breach exposes child names, locations, photos, or family information.
**Severity:** CRITICAL | **Likelihood:** MEDIUM
**Mitigations:**
- Beneficiary records stored in a separate, access-controlled data store
- All beneficiary PII encrypted at rest with field-level encryption
- Beneficiary data never stored in application logs
- Access to beneficiary records requires elevated, logged authorization
- Data minimization: collect only what is necessary for verification
- No beneficiary records in analytics or reporting systems — only anonymized aggregates

---

### T2.2 — Identifiable Child Content in Public-Facing Systems
**Description:** A campaign operator uploads a photo or detail that identifies a specific child. It becomes indexed, shared, and cannot be removed.
**Severity:** CRITICAL | **Likelihood:** HIGH (human error)
**Mitigations:**
- All uploaded media goes through moderation before public display
- Automated PII detection on image uploads (face blurring on minor faces)
- Campaign operators are contractually prohibited from posting identifiable child content
- Child content policy is enforced at the API layer, not just UI
- Takedown pipeline runs within 1 hour of report for child content

---

### T2.3 — Beneficiary Data Shared with Third Parties
**Description:** A campaign operator shares child data with a marketing company, data broker, or foreign government.
**Severity:** CRITICAL | **Likelihood:** LOW-MEDIUM
**Mitigations:**
- Third-party data sharing is explicitly prohibited in campaign operator agreement
- Any third party with system access must sign a data protection agreement reviewed by legal counsel
- Data egress logging: all exports of beneficiary data are logged and reviewed
- Campaign operators cannot directly download beneficiary data in bulk

---

## THREAT CATEGORY 3 — FRAUDULENT CLAIMS AND MISREPRESENTATION

### T3.1 — Inflated or Fabricated Impact Numbers
**Description:** A campaign claims to have fed 1,000 children when it fed 100, or cannot substantiate any count.
**Severity:** HIGH | **Likelihood:** HIGH without controls
**Mitigations:**
- All impact claims on public pages must link to a source (photo, receipt, field report, third-party verification)
- Platform badges: "Claimed" vs "Verified" impact shown differently to donors
- Third-party verification required for campaigns above funding threshold
- Impact report templates standardize what counts as evidence
- Platform auditor spot-checks a percentage of claims quarterly

---

### T3.2 — Fake Verifier Accounts
**Description:** A campaign operator creates fake "verifier" accounts to self-verify their own impact claims.
**Severity:** HIGH | **Likelihood:** MEDIUM
**Mitigations:**
- Verifiers must be approved separately from campaign operators
- Verifiers cannot verify campaigns they are affiliated with
- Relationship checks are part of verifier onboarding
- Verification accounts require independent identity verification

---

### T3.3 — Platform Represents False Tax-Deductibility
**Description:** Platform claims donations are tax-deductible when legal basis has not been established.
**Severity:** HIGH | **Likelihood:** HIGH without legal review
**Mitigations:**
- Tax-deductibility claims are gated on legal review and documented 501(c)(3) or equivalent approval
- LAUNCH BLOCKER: do not claim tax-deductibility until legal basis is confirmed
- All tax-related claims reviewed by qualified legal counsel before publication

---

## THREAT CATEGORY 4 — ACCOUNT AND ACCESS COMPROMISE

### T4.1 — Admin Account Takeover
**Description:** An attacker phishes or brute-forces an admin account and gains access to disbursement controls.
**Severity:** CRITICAL | **Likelihood:** MEDIUM
**Mitigations:**
- All admin accounts require hardware MFA (FIDO2/YubiKey class)
- Admin sessions have short expiry and require re-authentication for privileged actions
- New admin accounts require dual approval
- Admin account creation/deletion is logged and alerted to platform owner
- Anomalous admin activity triggers automatic session freeze and alert

---

### T4.2 — Campaign Operator Account Compromise
**Description:** An attacker takes over a campaign operator account and submits fraudulent disbursement requests.
**Severity:** HIGH | **Likelihood:** MEDIUM
**Mitigations:**
- Campaign operators require MFA
- Disbursement requests from newly-changed accounts are held for 48-hour review
- Unusual activity (new bank account, large disbursement request) triggers enhanced review
- Operators cannot change bank details and submit disbursement requests in same session

---

### T4.3 — Donor Account Abuse
**Description:** Fraudulent donations used for money laundering through the platform.
**Severity:** HIGH | **Likelihood:** LOW-MEDIUM
**Mitigations:**
- AML screening on large donations above threshold
- Unusual donation patterns flagged for review
- Guest donations limited in amount; registered accounts required for recurring high-volume donations
- Payment processor fraud detection is a primary control layer

---

## THREAT CATEGORY 5 — LEGAL AND REGULATORY

### T5.1 — Fundraising Without Required License
**Description:** Platform solicits donations in a jurisdiction that requires a charity solicitation license, without having obtained one.
**Severity:** HIGH | **Likelihood:** HIGH without deliberate compliance program
**Mitigations:**
- LAUNCH BLOCKER: legal counsel reviews jurisdictional fundraising requirements before launch
- Geo-gating of donation flows until licensure is confirmed per jurisdiction
- Fundraising compliance calendar maintained and reviewed quarterly

---

### T5.2 — COPPA Violation (Child Online Privacy)
**Description:** Platform collects or processes data from children under 13 without parental consent, violating COPPA.
**Severity:** CRITICAL | **Likelihood:** MEDIUM
**Mitigations:**
- Children are beneficiaries, not users — they do not have accounts or log in
- All beneficiary data collected through campaign operators, not directly from children
- Campaign operators are responsible for obtaining guardian consent for any child data submitted
- Platform data model reviewed by legal counsel for COPPA compliance before launch

---

### T5.3 — GDPR / Data Privacy Regulatory Action
**Description:** Platform processes EU donor or beneficiary data without compliant data infrastructure.
**Severity:** HIGH | **Likelihood:** MEDIUM if EU donors are accepted
**Mitigations:**
- Data privacy compliance review before accepting donations from EU residents
- Privacy policy reviewed by qualified counsel
- Data processing agreements in place with all sub-processors
- Right to access/delete flows implemented for donors

---

## THREAT CATEGORY 6 — REPUTATIONAL

### T6.1 — Public Exposure of Misused Funds
**Description:** Journalist or whistleblower publishes evidence that platform funds were misused.
**Severity:** CRITICAL (existential) | **Likelihood:** LOW with proper controls
**Mitigations:**
- Radical transparency is the primary defense: public fund flow reporting preempts attack surface
- Independent audit reports published proactively
- Whistleblower reporting channel that goes to independent board member, not CEO
- Incident response plan covers public disclosure requirements

---

### T6.2 — Exploitation Imagery in Campaign Content
**Description:** A campaign operator posts exploitative or dignity-violating images of children to drive donations.
**Severity:** HIGH | **Likelihood:** MEDIUM (common in humanitarian sector without controls)
**Mitigations:**
- Content policy explicitly defines exploitation imagery as prohibited
- Moderation pipeline reviews all uploaded media before public display
- Dignity standards defined in operator agreement
- Platform has documented process for removing violating content within 1 hour

---

## THREAT SUMMARY TABLE

| ID | Threat | Severity | Likelihood | Primary Control |
|---|---|---|---|---|
| T1.1 | Fraudulent campaign | CRITICAL | HIGH | Operator verification + escrow |
| T1.2 | Insider fund diversion | CRITICAL | MEDIUM | Multi-auth + audit |
| T1.3 | Operator misuse | HIGH | MEDIUM | Milestone disbursement |
| T1.4 | Payment processor failure | HIGH | LOW | Tier-1 processor + failover |
| T2.1 | Child data breach | CRITICAL | MEDIUM | Encryption + access controls |
| T2.2 | Identifiable child content | CRITICAL | HIGH | Moderation + auto-blur |
| T2.3 | Third-party data sharing | CRITICAL | LOW-MEDIUM | Contractual + logging |
| T3.1 | Fake impact numbers | HIGH | HIGH | Verified vs Claimed badges |
| T3.2 | Self-verification | HIGH | MEDIUM | Verifier independence check |
| T3.3 | False tax-deductibility | HIGH | HIGH | Legal gate |
| T4.1 | Admin account takeover | CRITICAL | MEDIUM | Hardware MFA + short sessions |
| T4.2 | Operator account takeover | HIGH | MEDIUM | MFA + change holds |
| T4.3 | Money laundering | HIGH | LOW-MEDIUM | AML screening |
| T5.1 | Unlicensed fundraising | HIGH | HIGH | Legal gate before launch |
| T5.2 | COPPA violation | CRITICAL | MEDIUM | No child accounts + legal review |
| T5.3 | GDPR violation | HIGH | MEDIUM | Privacy compliance review |
| T6.1 | Public fund misuse exposure | CRITICAL | LOW | Radical transparency |
| T6.2 | Exploitation imagery | HIGH | MEDIUM | Content moderation policy |

---

*Threat model must be reviewed and updated when adding new features, new geographies, or new payment methods.*
