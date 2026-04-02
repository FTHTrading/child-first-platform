# VENDOR DUE DILIGENCE
**Platform:** Child First Platform
**Version:** 1.0 | **Date:** 2026-04-02
**Owner:** Platform Owner + Engineering Lead
**Review:** Before onboarding any new vendor; annually for all active vendors

> This platform handles child-related data and donor financial data. Every vendor with access to any part of that data is a potential attack surface, a potential liability, and an implicit trust extension. We do not onboard vendors we have not checked.

---

## SECTION 1 — VENDOR TIER CLASSIFICATION

Every vendor is classified into one of three tiers based on the data they can access.

| Tier | Access Level | Examples | Due Diligence Level |
|---|---|---|---|
| **Tier 1** | Handles child/beneficiary data or authenticated user PII directly | Database hosting, application server hosting, identity/auth provider | Maximum diligence required |
| **Tier 2** | Handles donor financial data or payment processing | Payment processor (Stripe), fraud monitoring, KYC provider | Maximum diligence required |
| **Tier 3** | Handles operational data but not child, donor-identity, or payment data | Analytics (aggregated/anonymous), CDN, email delivery (campaign-level, not donor-level), DNS provider | Standard diligence required |
| **Tier 4** | No access to platform data; operational tools only | Design tools, project management, external communication tools | Minimal diligence |

**If a vendor's tier is unclear: assign the higher tier.**

---

## SECTION 2 — CURRENT VENDOR REGISTER

This register must be kept current. No vendor may be used without being listed here.

| Vendor | Tier | Purpose | Data Accessed | Review Date | Status |
|---|---|---|---|---|---|
| [Cloud Hosting Provider] | 1 | Application and database hosting | All application data | [DATE] | [PENDING — pre-launch] |
| [Database Provider] | 1 | Managed PostgreSQL | All donor, operator, beneficiary records | [DATE] | [PENDING] |
| Stripe | 2 | Payment processing | Donor payment data, identity (limited) | [DATE] | [PENDING] |
| [KYC/Identity Provider] | 2 | Donor identity verification | Donor PII, government ID documents | [DATE] | [PENDING] |
| [Email Delivery Service] | 3 | Transactional email (receipts, notifications) | Donor email + donation confirmation content | [DATE] | [PENDING] |
| [CDN Provider] | 3 | Content delivery | Campaign media (no PII) | [DATE] | [PENDING] |
| [Analytics Platform] | 3 | Aggregated usage analytics | Anonymized usage data only | [DATE] | [PENDING] |

**[NOTE: All vendor selections are pending. This register must be completed and all vendors reviewed before launch.]**

---

## SECTION 3 — DUE DILIGENCE CHECKLIST BY TIER

### 3.1 — Tier 1 Vendors (Child Data / PII)

Before onboarding a Tier 1 vendor, complete all of the following:

**Security and Compliance Review:**
- [ ] Vendor holds current SOC 2 Type II or equivalent independent security audit
- [ ] Vendor holds ISO 27001 certification or equivalent (preferred for cloud infrastructure)
- [ ] Vendor encryption at rest standard: AES-256 or equivalent
- [ ] Vendor encryption in transit: TLS 1.2 minimum (TLS 1.3 preferred)
- [ ] Vendor has penetration testing performed annually; most recent report reviewed
- [ ] Vendor has a published data breach notification process with commitment to notify within 72 hours
- [ ] Vendor has a published Security Incident Response contact

**Data Protection Review:**
- [ ] Data Processing Agreement (DPA) executed before any data is shared
- [ ] DPA specifies: data may be used only for purposes specified; no sale or secondary use of data
- [ ] DPA includes EU Standard Contractual Clauses (SCCs) if vendor processes data of EU residents
- [ ] Vendor confirms data is stored only in jurisdictions acceptable to platform (define before launch: US-only, or specify allowed regions)
- [ ] Vendor confirms they will delete all platform data within 30 days of contract termination, and will provide written confirmation of deletion

**Subprocessor Review:**
- [ ] Vendor provides list of subprocessors with access to platform data
- [ ] Platform Owner has reviewed and approved subprocessor list
- [ ] DPA requires vendor to notify platform before adding new subprocessors
- [ ] Platform retains right to object to new subprocessors within 14 days

**Child Protection Specific:**
- [ ] Vendor is informed in writing that the platform handles data related to child beneficiaries
- [ ] Vendor's own child data handling policies have been reviewed
- [ ] Vendor has no known history of child data breaches

**Legal Review:**
- [ ] Contract reviewed by legal counsel before signing
- [ ] Limitation of liability clause reviewed (does it cover our risk exposure?)
- [ ] Indemnity clause reviewed
- [ ] Termination rights reviewed (can we exit if vendor has a security incident?)

### 3.2 — Tier 2 Vendors (Donor Financial Data / Payment)

Same requirements as Tier 1, PLUS:

- [ ] Vendor is PCI-DSS Level 1 compliant (for payment processors)
- [ ] Vendor has documented anti-fraud and AML screening where applicable
- [ ] Vendor reconciliation API/data export is available and tested
- [ ] Vendor refund and dispute resolution process is documented and approved

### 3.3 — Tier 3 Vendors (Operational Data, No PII)

For Tier 3 vendors:
- [ ] Confirm the specific data that will flow to the vendor — verify no PII is included
- [ ] Read vendor privacy policy; confirm no data sale provision
- [ ] If vendor changes data practices: platform receives notice, platform can opt out
- [ ] DPA is executed if vendor may receive any data that could be traced to an individual
- [ ] Vendor confirmation that aggregated/anonymized data meets platform's definition of anonymization

### 3.4 — Tier 4 Vendors (Operational Tools Only)

- [ ] Confirm no platform data is entered into the vendor's system
- [ ] Confirm no API integration that could inadvertently share data

---

## SECTION 4 — DATA PROCESSING AGREEMENTS

A Data Processing Agreement is required for all Tier 1, Tier 2, and Tier 3 vendors. The DPA must address:

1. **Purpose limitation:** Data may only be processed for the specific purpose defined
2. **Data minimization:** Vendor receives only the data necessary for its function
3. **Storage limitation:** Data is not retained beyond its needed lifecycle
4. **Data subject rights:** Vendor must support the platform in responding to donor data deletion requests within 30 days
5. **Security measures:** Vendor must implement and maintain appropriate technical and organizational security measures
6. **Breach notification:** Vendor must notify the platform within 72 hours of a confirmed or suspected breach
7. **Subprocessors:** Vendor must disclose and manage subprocessors; platform retains right to object
8. **Audit rights:** Platform has the right to request audit evidence (or a SOC 2 report) no more than once per year
9. **Return or deletion:** Upon contract termination, vendor deletes all platform data and provides written confirmation

---

## SECTION 5 — VENDOR ONBOARDING PROCESS

1. Engineering Lead identifies vendor need; nominates vendor with proposed tier classification
2. Platform Owner approves classification and authorizes due diligence
3. Engineering Lead completes checklist (Section 3) and documents findings
4. For Tier 1 and Tier 2: legal counsel reviews contract and DPA before execution
5. Platform Owner signs off on vendor onboarding
6. Vendor is added to the Vendor Register (Section 2)
7. Engineering Lead configures access controls: vendor receives minimum required access only
8. Next scheduled annual review date is recorded

---

## SECTION 6 — VENDOR ANNUAL REVIEW

Every vendor in the register is reviewed annually. The review includes:

- [ ] Confirm vendor still holds required certifications (SOC 2, PCI-DSS, etc.)
- [ ] Review any security incidents vendor disclosed in the past year
- [ ] Confirm DPA is still current; update if needed
- [ ] Confirm vendor's subprocessor list has not changed without notice
- [ ] Confirm access permissions granted to vendor are still appropriate (minimum necessary)
- [ ] Confirm data flows to vendor remain as originally documented (no scope creep)

**If any review item fails:** Escalate to Platform Owner. If the vendor cannot resolve within 60 days, begin offboarding.

---

## SECTION 7 — VENDOR OFFBOARDING

When a vendor relationship ends:

1. Platform Owner notification and approval of offboarding
2. Engineering Lead disables API keys, removes access credentials, removes webhooks
3. Service configuration updated to remove vendor integration
4. Written request to vendor to delete all platform data (per DPA)
5. Vendor provides written confirmation of data deletion within 30 days
6. Written confirmation is retained for 5 years
7. Vendor register updated to "offboarded" status with date
8. Audit log entry made

**For Tier 1/2 vendors:** If a vendor refuses to confirm data deletion, treat as a data security incident and consult legal counsel.

---

## SECTION 8 — CRITICAL VENDOR CONTACT INFORMATION

For each active Tier 1 and Tier 2 vendor, maintain on file:
- Primary account manager contact
- Security incident response contact (the after-hours breach notification path)
- Billing and contract contact
- Vendor status page URL

This information must be accessible to the Platform Owner without logging into the vendor's own platform (in case the vendor's platform is the one experiencing an incident).

---

## SECTION 9 — LAUNCH GATE

**The platform does not go to production until:**
- [ ] All intended Tier 1 and Tier 2 vendors are identified
- [ ] Full due diligence is documented for each
- [ ] DPAs are executed for each
- [ ] Legal counsel has reviewed Tier 1 and Tier 2 contracts
- [ ] Vendor Register is complete and up to date
