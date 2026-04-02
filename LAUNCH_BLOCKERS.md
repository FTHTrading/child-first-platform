# LAUNCH BLOCKERS
**Platform:** Child First Platform
**Version:** 1.1 | **Date:** 2026-04-02 (enhanced)

> This document is the single source of truth for what must be complete before this platform accepts a single donation, publishes a campaign, or stores a single child's record. Each blocker has an owner and a completion criterion. This list is not negotiable.

---

## CATEGORY A — LEGAL AND ENTITY (HARD STOPS)

| # | Blocker | Owner | Completion Criterion |
|---|---|---|---|
| A1 | Legal entity not formed | Platform Owner + Legal Counsel | Entity formation documents filed; EIN assigned |
| A2 | Charitable solicitation licenses not obtained for launch jurisdictions | Legal Counsel | Registrations confirmed OR legal opinion exemption documented |
| A3 | 501(c)(3) or equivalent status: tax-deductibility claims made without confirmed status | Legal Counsel | IRS determination letter received OR all tax-deductibility claims removed from platform |
| A4 | Privacy Policy not drafted and published | Legal Counsel | Privacy Policy live at a public URL before first donor visit |
| A5 | Terms of Service not drafted and published | Legal Counsel | ToS live at a public URL; accepted by donors and operators at registration |
| A6 | Campaign Operator Agreement template not reviewed by counsel | Legal Counsel | Signed legal opinion that the agreement is enforceable in the operating jurisdiction |
| A7 | No qualified legal counsel retained | Platform Owner | Engagement letter signed with counsel having nonprofit + privacy expertise |
| A8 | D&O and Cyber Liability insurance not in place | Platform Owner | Policies bound; certificates on file |
| A9 | COPPA and GDPR compliance review not completed | Legal Counsel | Written compliance memo addressing beneficiary data handling model |

---

## CATEGORY B — FUND CONTROLS (HARD STOPS)

| # | Blocker | Owner | Completion Criterion |
|---|---|---|---|
| B1 | Donor Trust Account not established | Platform Owner + Finance Officer | Bank account titled correctly; dual-signature authority configured |
| B2 | Campaign Escrow Account not established | Platform Owner + Finance Officer | Separate bank account established; no commingling |
| B3 | Reserve Account not established with minimum balance | Platform Owner | Account open; funded with ≥ 10% of any seed capital |
| B4 | Finance Officer role not filled and background-checked | Platform Owner | Finance Officer agreement signed; background check clear |
| B5 | Independent Director not appointed | Platform Owner | Director agreement signed; co-signature bank access configured |
| B6 | Disbursement authorization procedure not tested end-to-end | Finance Officer + Platform Owner | Test disbursement (internal transfer) executed with dual-auth; all parties confirmed capable |
| B7 | Stripe or payment processor not configured with proper payout to Donor Trust Account (not operational) | Platform Owner | Payout bank account confirmed and tested |
| B8 | Platform fee structure not documented and implemented | Finance Officer | Fee at checkout matches documented schedule; calculation verified by test transaction |
| B9 | Emergency freeze mechanism not tested | Platform Owner | Test freeze and unfreeze executed successfully; all authorized parties confirmed the process works |

---

## CATEGORY C — CHILD PROTECTION (HARD STOPS — HIGHEST PRIORITY)

| # | Blocker | Owner | Completion Criterion |
|---|---|---|---|
| C1 | Child Privacy Officer not designated | Platform Owner | CPO agreement signed; CPO has exclusive beneficiary data credentials |
| C2 | Beneficiary data store not separate from main application database | Engineering | Beneficiary records in separate, access-controlled store; confirmed in technical audit |
| C3 | Beneficiary data fields not field-level encrypted at rest | Engineering | Encryption implemented and tested; key management documented |
| C4 | No guardian consent workflow for beneficiary submissions | Engineering | Consent collection flow built and reviewed by CPO + legal counsel |
| C5 | Campaign Operators can upload unmoderated images | Engineering | Moderation queue implemented; all images require approval before public display |
| C6 | No content moderation for child-identifiable content | Platform Admin + Engineering | Moderation policy documented; at least one trained moderator confirmed |
| C7 | Beneficiary data purge schedule not implemented | Engineering + CPO | Automated purge schedule configured; tested in staging |
| C8 | Partner organization Data Processing Agreement template not ready | Legal Counsel | DPA template reviewed by counsel; no partner gets API access without signing |
| C9 | CPO succession not designated in writing | CPO + Platform Owner | Designated successor confirmed in writing; kept with governance documents |

---

## CATEGORY D — SECURITY (HARD STOPS)

| # | Blocker | Owner | Completion Criterion |
|---|---|---|---|
| D1 | MFA not required for all admin, finance, and operator accounts | Engineering | MFA enforcement confirmed; no account can bypass |
| D2 | SSL/TLS not configured on all endpoints | Engineering | All traffic encrypted; HSTS enabled; no mixed content |
| D3 | Payment processor webhook signatures not verified | Engineering | Signature verification implemented and tested with invalid signature rejection confirmed |
| D4 | User-submitted content not sanitized before storage or display | Engineering | Sanitization and output encoding confirmed; XSS test cases pass |
| D5 | Database accessible from public internet | Engineering | Database in private subnet; connection only from application server |
| D6 | Admin panel accessible from public internet without VPN/IP restriction | Engineering | Access restriction implemented and tested |
| D7 | No audit logging in place for fund operations | Engineering | All fund-related actions logged to append-only audit store |
| D8 | No security incident response plan | Platform Owner | Written incident response procedure exists; key contacts confirmed |
| D9 | No penetration test completed on public-facing surfaces | Engineering | Pen test completed by independent party; critical findings remediated |

---

## CATEGORY E — OPERATIONAL READINESS

| # | Blocker | Owner | Completion Criterion |
|---|---|---|---|
| E1 | No uptime monitoring in place | Engineering | Monitoring configured; alerts go to Platform Owner |
| E2 | No platform status page | Engineering | Status page live and linked from main platform |
| E3 | No donor support channel (human-staffed) | Platform Owner | Email support address confirmed; response SLA documented and staffed |
| E4 | No verified Campaign Operator ready for first active campaign | Platform Owner + Admin | At least one operator has completed full onboarding: identity verified, agreement signed, bank account verified |
| E5 | No Verifier designated for first campaign | Platform Owner | At least one verifier has completed onboarding and independence check |
| E6 | No Campaign Auditor designated | Platform Owner | Campaign Auditor agreement signed; auditor ready to review disbursement requests |
| E7 | Financial audit firm not engaged | Platform Owner + Finance Officer | Audit engagement letter signed |
| E8 | Annual compliance calendar not created | Finance Officer + Legal Counsel | Calendar created with all key dates; assigned to owners |

---

## CATEGORY F — PLATFORM CONTENT AND DISCLOSURES

| # | Blocker | Owner | Completion Criterion |
|---|---|---|---|
| F1 | Platform fee not disclosed on donation checkout page | Engineering | Fee shown pre-transaction; fee-cover option present |
| F2 | Campaign "Verified" vs "Claimed" badge distinction not implemented | Engineering | Both states implemented; Claimed displays explanatory note |
| F3 | No donor refund process accessible from the platform | Engineering | Refund request link or form accessible from donor account |
| F4 | Tax-deductibility claim without legal basis | Platform Owner + Legal | Either A3 is cleared OR all tax-deductibility language removed from platform |
| F5 | Child exploitation content policy not published | Platform Owner | Policy live on platform; incorporated into Campaign Operator Agreement |

---

## CATEGORY G — INCIDENT RESPONSE AND RECOVERY

| # | Blocker | Owner | Completion Criterion |
|---|---|---|---|
| G1 | No incident response plan in place before going live | Platform Owner + Engineering Lead | INCIDENT_RESPONSE_PLAN.md complete; all roles confirmed; contact tree populated |
| G2 | P0 contact tree not staffed | Platform Owner | Every role in contact tree has a named, confirmed, contactable individual |
| G3 | No database backup system in place | Engineering Lead | Automated daily backups configured; continuous WAL streaming active; backup in separate region |
| G4 | No backup restore tested | Engineering Lead | Successful test restore to isolated environment completed and documented |
| G5 | No geographic failover path defined | Engineering Lead | Failover region configured; DNS TTLs set to 60 seconds; failover tested |
| G6 | No uptime monitoring with automated alerts | Engineering Lead | Monitoring live; alerts reach Platform Owner and Engineering Lead via separate channel from platform |
| G7 | Quarterly incident drill not scheduled | Platform Owner | First drill scheduled before any campaign launches; drill contact confirmed |

---

## CATEGORY H — CONTENT MODERATION READINESS

| # | Blocker | Owner | Completion Criterion |
|---|---|---|---|
| H1 | No moderation queue implemented in platform | Engineering Lead | All content enters `pending_review` state before public display; confirmed in test |
| H2 | Automated CSAM hash check not implemented | Engineering Lead | PhotoDNA or equivalent hash check runs on every image upload before storage; confirmed by test with known-hash |
| H3 | No trained human moderator confirmed before launch | Platform Admin + CPO | At least one moderator has completed child safeguarding training, platform policy training, and CSAM protocol training |
| H4 | Child safety report response (15-minute SLA) not achievable | Platform Admin | Confirmed that flagged content reaches a real person within 15 minutes during platform operating hours |
| H5 | CSAM mandatory reporting process not documented | Platform Owner | Step-by-step NCMEC reporting procedure documented; all relevant personnel briefed |
| H6 | Content moderation policy not integrated into Campaign Operator Agreement | Legal Counsel | Policy referenced and binding in all operator agreements |
| H7 | Face detection flagging not implemented in image pipeline | Engineering Lead | Automated flag for detected faces; face-flagged images go to human review before any public display |

---

## CATEGORY I — AML AND FINANCIAL COMPLIANCE

| # | Blocker | Owner | Completion Criterion |
|---|---|---|---|
| I1 | MSB classification not confirmed with legal counsel | Legal Counsel + Platform Owner | Written legal opinion on whether platform must register as an MSB with FinCEN before accepting donations |
| I2 | OFAC SDN screening not implemented for donors | Engineering Lead + Finance Officer | Every donor checked against OFAC SDN list before donation is accepted; confirmed by test |
| I3 | No KYC implementation for donations ≥ $1,000 | Engineering Lead | KYC collection flow implemented for relevant thresholds; tested end-to-end |
| I4 | No automated transaction monitoring flags configured | Engineering Lead + Finance Officer | Structuring pattern, velocity, and high-value flags configured in transaction system or payment processor |
| I5 | No SAR filing procedure documented | Finance Officer + Platform Owner | SAR procedure documented; responsible persons briefed; external legal counsel identified for SAR guidance |
| I6 | AML training not completed by Finance Officer and Platform Owner | Finance Officer + Platform Owner | Documented BSA/AML training completed before platform accepts first donation |
| I7 | No OFAC screening for disbursement recipients | Engineering Lead + Finance Officer | Recipient organizations checked against OFAC SDN list before first disbursement |

---

## CATEGORY J — ACCESSIBILITY AND INCLUSION

| # | Blocker | Owner | Completion Criterion |
|---|---|---|---|
| J1 | Donation flow not tested with screen reader (NVDA + Chrome) | Engineering Lead | All steps in Section 3.1 of ACCESSIBILITY_STANDARDS.md pass screen reader test; documented |
| J2 | Keyboard-only navigation not verified on all critical flows | Engineering Lead | Full keyboard audit completed; no keyboard traps; no unreachable interactive elements |
| J3 | Color contrast not verified on final brand palette | Engineering Lead | All text/background combos in design system meet WCAG 2.1 AA contrast ratio; documented |
| J4 | Automated axe-core scan not returning zero violations | Engineering Lead | axe-core integrated in CI; all violations resolved before first deployment to production |
| J5 | Accessibility Statement not published | Engineering Lead + Platform Owner | Statement live at accessible URL on the platform before launch |
| J6 | Accommodation request contact path not live | Platform Owner | accessibility@[domain] resolves to a monitored inbox with 2-business-day response commitment |

---

## CATEGORY K — VENDOR AND THIRD-PARTY CONTROLS

| # | Blocker | Owner | Completion Criterion |
|---|---|---|---|
| K1 | Tier 1 vendors not identified and documented | Engineering Lead | All vendors with access to child data or user PII listed in VENDOR_DUE_DILIGENCE.md vendor register |
| K2 | Tier 1 vendor due diligence not completed | Engineering Lead + Platform Owner | Full checklist (Section 3.1 of VENDOR_DUE_DILIGENCE.md) complete for every Tier 1 vendor |
| K3 | Tier 2 vendor due diligence (Stripe, payment processor) not completed | Engineering Lead + Platform Owner | Full checklist (Section 3.2) complete for payment processor |
| K4 | DPAs not executed with all Tier 1 and Tier 2 vendors | Legal Counsel | Signed DPA on file for every Tier 1 and Tier 2 vendor; reviewed by counsel |
| K5 | No minimum access principle applied to vendor API permissions | Engineering Lead | Each vendor's credentials are scoped to minimum required access; confirmed in access review |

---

## CATEGORY L — WHISTLEBLOWER AND GOVERNANCE

| # | Blocker | Owner | Completion Criterion |
|---|---|---|---|
| L1 | Independent Director not appointed with required independence | Platform Owner + Board/Governance | Director appointed; meets independence criteria in Section 10 of WHISTLEBLOWER_POLICY.md; documented in governance records |
| L2 | Independent Director does not have co-signature on financial accounts | Finance Officer + Bank | Bank co-signer access confirmed; tested |
| L3 | No independent reporting channel (goes through Platform Owner) | Independent Director | Third-party or independently hosted reporting mechanism live; contact details published on platform |
| L4 | Whistleblower policy not published on platform | Platform Owner | Policy live at public URL; linked from operator agreement and platform legal pages |
| L5 | No non-retaliation procedure in operator and staff agreements | Legal Counsel | Non-retaliation clause present in all employment, contractor, and operator agreements |

---

## LAUNCH GATE SUMMARY

**CANNOT launch until all of the following are complete:**

| Gate | Requirement |
|---|---|
| Gate 1 — Legal | All Category A and L blockers resolved |
| Gate 2 — Financial Controls | All Category B and I blockers resolved |
| Gate 3 — Child Protection | All Category C and H blockers resolved |
| Gate 4 — Security + DR | All Category D and G blockers resolved |
| Gate 5 — Operations + Vendors | All Category E and K blockers resolved |
| Gate 6 — Content + Accessibility | All Category F, J blockers resolved |

**Sequential gates:** Gates 1–3 must be cleared before Gate 4 verification begins. Gates 4–6 must all pass before any public campaign is published or donations accepted.

---

## BLOCKER RESOLUTION PROCESS

1. Blocker owner reports resolution with documentation (legal cert, test result, signed agreement)
2. Platform Owner independently confirms the resolution evidence
3. Independent Director confirms resolution for all Category A and B blockers
4. Resolution is logged in this document with date and confirming parties
5. This document version is incremented after each blocker is resolved

---

*This is a living document. New blockers discovered during development must be added here immediately, not deferred. The list grows more confidently, not more loosely, as the platform matures.*
