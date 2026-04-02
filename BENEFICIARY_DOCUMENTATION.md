# BENEFICIARY DOCUMENTATION STANDARD
**Platform:** Child First Platform
**Version:** 1.0 | **Date:** 2026-04-02
**Standard:** Genesis Elite Humanitarian & Fund-Me Build Standard v2.0

> Children are not users of this platform. They are its sole purpose. Every rule in this document exists to protect them.

---

## SECTION 1 — CORE PRINCIPLES

### 1.1 — Dignity First
No child's inclusion in this platform may compromise their dignity, privacy, or safety. A child is never a marketing asset.

### 1.2 — Data Minimization
Collect only the minimum information required to: (a) verify genuine need, (b) ensure funds reach the child, and (c) report aggregate impact. Collecting more than what is necessary is a policy violation.

### 1.3 — Purpose Limitation
Data collected about a child beneficiary may only be used for the purpose it was collected: verifying eligibility and tracking that aid was delivered. It may not be used for: marketing, fundraising appeals, media partnerships, research publications, or any other purpose.

### 1.4 — Guardian Control
Children cannot consent to anything on this platform. All data submission, consent, and authorization must come from a legal guardian or authorized representative. Guardian consent is required before any child data is stored.

---

## SECTION 2 — WHAT DATA MAY BE COLLECTED

### 2.1 — Permitted Beneficiary Fields

| Field | Purpose | Stored Where | Public? |
|---|---|---|---|
| Internal case ID (UUID) | Link records | Encrypted beneficiary store | Never |
| Age range (not exact DOB) | Verify minor status | Encrypted beneficiary store | Never |
| Geographic region (city/region, not address) | Verify geographic scope of campaign | Encrypted beneficiary store | Never (only aggregate stats public) |
| Documented need type (food, shelter, clothing, etc.) | Match to campaign scope | Encrypted beneficiary store | Never (only category counts public) |
| Guardian consent record | Compliance proof | Encrypted beneficiary store | Never |
| Aid delivery confirmation | Impact tracking | Encrypted beneficiary store | Never (aggregated only) |

### 2.2 — Prohibited Fields

The following MUST NEVER be collected or stored:
- Child's full name
- Child's exact date of birth
- Child's photo (identifiable)
- Child's school name
- Child's home address or GPS coordinates
- Parent/guardian full name (unless required for payment and stored separately in a non-linked system)
- Any biometric data
- Any medical diagnosis beyond general "food insecure" or equivalent need classification

---

## SECTION 3 — GUARDIAN CONSENT PROCESS

### 3.1 — Consent Requirements

Before any child record is created, the submitting Campaign Operator must obtain and document:
1. Written or digitally-signed consent from the child's legal guardian
2. Guardian's acknowledgment that their child is a beneficiary (not a named/photographed subject)
3. Guardian's acknowledgment of the data minimization policy
4. Guardian's right to request data deletion at any time

### 3.2 — Consent Documentation Requirements

The consent record must include:
- Date of consent
- Method of consent (written/digital/witnessed verbal)
- Guardian relationship to child (parent, legal guardian, authorized care worker)
- Organization through which consent was obtained (if via a partner organization)
- A consent ID that links to the beneficiary record

Consent ID and beneficiary record are stored separately such that compromising beneficiary records alone does not reveal consent documentation with guardian identity.

### 3.3 — Consent via Partner Organization

If consent is obtained through a partner NGO or food bank:
- Partner organization must have a signed Data Processing Agreement with the platform
- Partner organization takes responsibility for the consent process
- Platform must audit partner consent practices annually

### 3.4 — Withdrawal of Consent

If a guardian withdraws consent:
- All records for that child must be purged within 30 days
- Aggregate impact statistics that include that child are NOT retracted (cannot un-aggregate)
- Any disbursements already made on behalf of that child are not reversed

---

## SECTION 4 — DATA HANDLING AND STORAGE

### 4.1 — Encryption Requirements

- All beneficiary records must be encrypted at rest using AES-256 or equivalent
- Field-level encryption for any field that could enable re-identification
- Encryption keys must be managed separately from the data store
- Key rotation schedule: minimum annually

### 4.2 — Access Control

- Beneficiary records are accessible only to the Child Privacy Officer (CPO)
- Campaign Operators cannot view the raw records they submitted after initial submission
- Platform Admins have no access to beneficiary records
- The Platform Owner may access records only in documented emergencies, always logged

### 4.3 — No Cross-System Contamination

- Beneficiary data must not flow into: analytics pipelines, marketing systems, email marketing platforms, CRM systems, or any third-party tool
- If a third-party identity verification service is used, the minimum necessary data is passed and the result (verified/not verified) is stored, not the underlying data

### 4.4 — Data Purge Schedule

| Record Type | Retention Period | Purge Trigger |
|---|---|---|
| Active beneficiary record | Duration of associated campaign + 1 year | Campaign close + 1 year |
| Consent record | Duration of beneficiary record + 3 years (legal compliance) | As above + 3 years |
| Aid delivery confirmation | 5 years (audit purposes) | 5 years from delivery date |
| Impact aggregates | Indefinite (no PII, anonymized) | Never (these are public interest records) |

Annual purge audit: CPO must review and confirm purge schedule compliance each year, documented.

---

## SECTION 5 — PARTNER ORGANIZATION REQUIREMENTS

Any organization submitting beneficiary records on behalf of children must:

1. Be a registered legal entity (NGO, nonprofit, government program, or accredited social service)
2. Sign a Data Processing Agreement before receiving API access
3. Pass an initial vetting review by the Platform Admin
4. Undergo annual re-vetting
5. Agree to allow platform auditors to verify a sample of submitted beneficiary records (not the records themselves — the process of collection)
6. Report any data breaches involving beneficiary data to the CPO within 24 hours

---

## SECTION 6 — CHILD PROTECTION PROHIBITIONS

These are **absolute prohibitions** with no exceptions:

| Prohibited Action | Why |
|---|---|
| Publishing a child's name + photo together | Re-identification risk; dignity violation |
| Using a child's image in paid advertising | Exploitation of vulnerability |
| Sharing beneficiary records with government entities not in the aid chain | Child safety risk in some jurisdictions |
| Retaining beneficiary records after purge date | Legal and trust violation |
| Using beneficiary counts or stories in fundraising without removing all identifying details | Privacy violation even when "well-intentioned" |
| Creating platform accounts for children | Children are never users |
| Contacting children or families for testimonials or marketing | Exploitation of aid relationship |

---

## SECTION 7 — INCIDENT RESPONSE FOR BENEFICIARY DATA

### 7.1 — If a Breach is Suspected

1. Immediately suspend access to the affected data store
2. Notify Child Privacy Officer within 1 hour
3. Notify Platform Owner within 2 hours
4. CPO initiates breach assessment
5. If breach is confirmed and children could be at risk from exposure: notify partner organizations within 24 hours so they can take protective action with families
6. Regulatory notification as required per jurisdiction (typically 72 hours for GDPR)

### 7.2 — What NOT to Do

- Do not publish details of the breach before affected families have been notified
- Do not attempt to minimize or conceal the scope
- Do not destroy breach evidence (legal protection of audit trail)

---

*This document governs all beneficiary data handling before, during, and after platform launch. Deviations require CPO review and documented exception. No technical implementation of beneficiary record handling may proceed without this standard being signed off by legal counsel.*
