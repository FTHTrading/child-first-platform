# GENESIS_RULES.md
# Child First Platform — Repository Genesis Rules
**Version:** 1.0 | **Date:** 2026-04-02
**Standard:** Genesis Elite Humanitarian & Fund-Me Build Standard v2.0

---

## ABSOLUTE PRE-IMPLEMENTATION GATES

Nothing in this repository may be built, committed to production, or deployed until every item in the appropriate phase is cleared.

---

## GATE 1 — PRE-IMPLEMENTATION (PHASE 0 COMPLETE)

- [ ] SYSTEM_CONSTITUTION.md — exists and Platform Owner has reviewed and accepted
- [ ] THREAT_MODEL.md — all CRITICAL and HIGH severity threats have a documented mitigation
- [ ] CONTROL_AND_PERMISSIONS_MAP.md — all privileged actions documented; no undocumented permissions exist
- [ ] FUND_CUSTODY_AND_CONTROL.md — fund segregation architecture is defined; no commingling path exists in the design
- [ ] BENEFICIARY_DOCUMENTATION.md — data model reviewed by Child Privacy Officer
- [ ] IMPACT_CLAIMS_PROOF_MAP.md — all campaign impact types have defined evidence requirements
- [ ] DONOR_RIGHTS_AND_DISCLOSURES.md — all pre-transaction disclosures identified
- [ ] CAMPAIGN_END_STATE_RULES.md — all campaign lifecycle end states documented
- [ ] DESIGN_PRINCIPLES.md — team has read and acknowledged
- [ ] TRUST_BOUNDARIES.md — all actor trust levels mapped
- [ ] FAILURE_MODES.md — P0 and P1 failure modes have detection + response documented
- [ ] OPERATOR_MODEL.md — all required roles have onboarding requirements; succession documented
- [ ] ASSET_AND_VALUE_FLOW.md — complete fund flow from donor to child aid is diagrammed
- [ ] PROOF_REQUIREMENTS.md — identity, impact, and compliance proof standards are set
- [ ] LEGAL_AND_TAX_STATUS.md — all [PENDING] fields are filled in by legal counsel
- [ ] LAUNCH_BLOCKERS.md — Gate 1 items are cleared

---

## GATE 2 — PRE-CODE (PHASE 1 COMPLETE)

- [ ] Legal entity formed — EIN assigned
- [ ] Legal counsel retained with nonprofit + privacy expertise
- [ ] Charitable solicitation registration confirmed for all launch jurisdictions (or exemption documented)
- [ ] All Category A (Legal) and Category C (Child Protection) launch blockers in LAUNCH_BLOCKERS.md are cleared
- [ ] Child Privacy Officer designated in writing
- [ ] Beneficiary data store design — SEPARATE from main application database — approved by CPO
- [ ] Financial account structure confirmed — Donor Trust, Campaign Escrow, Operational, Reserve accounts established
- [ ] Independent Director agreement signed

---

## GATE 3 — PRE-BUILD (ARCHITECTURE APPROVED)

- [ ] System architecture document written; no component violates DESIGN_PRINCIPLES.md or TRUST_BOUNDARIES.md
- [ ] Database schema reviewed for child data compliance — no beneficiary PII in main schema
- [ ] Authentication model documented: MFA required for all privileged roles; session management defined
- [ ] Fund flow implementation design reviewed against ASSET_AND_VALUE_FLOW.md
- [ ] All Category B (Fund Controls) and D (Security) launch blockers in LAUNCH_BLOCKERS.md have implementation plans
- [ ] External integrations identified; data sharing review completed for each

---

## GATE 4 — PRE-PRODUCTION (READY FOR LAUNCH)

- [ ] All launch blockers in LAUNCH_BLOCKERS.md across all categories are resolved and documented
- [ ] Penetration test completed; critical and high findings remediated
- [ ] End-to-end fund flow tested: donation → escrow → disbursement request → multi-auth approval → transfer
- [ ] Emergency freeze mechanism tested end-to-end
- [ ] Guardian consent workflow tested with CPO sign-off
- [ ] Campaign content moderation queue tested; child-identifiable content detection in place
- [ ] Pre-transaction fee disclosure verified on live checkout
- [ ] All security controls from Category D blockers confirmed in production environment
- [ ] Legal disclaimers and compliance disclosures live at published URLs
- [ ] Support channel staffed and tested
- [ ] Audit logging confirmed for all Category B fund operations and beneficiary data access

---

## HUMANITARIAN PLATFORM — ADDITIONAL BLOCKED CONDITIONS

The following conditions BLOCK deployment regardless of other gate status:

1. **No legal entity** — Platform may not hold or disburse donor funds without a formed legal entity
2. **No fund custody segregation** — Donor funds in any account that also holds operational funds = hard stop
3. **No independent director** — Platform may not accept donations above $1,000 without co-governance authority in place
4. **No Child Privacy Officer** — Beneficiary data may not be collected or stored
5. **Identifiable child content in any public-facing view** — Absolute stop; must be resolved and audited before relaunch
6. **Tax-deductibility claimed without legal basis** — Hard public fraud risk; remove claim or obtain legal basis
7. **No guardian consent mechanism** — Beneficiary records may not be submitted or stored
8. **Unmoderated image upload to campaign pages** — No campaign may be live without moderation in place
9. **Single-signature fund control** — No single person may move donor funds; always dual-signature minimum
10. **No audit trail for fund movements** — No financial operation proceeds without an append-only audit log

---

## ONGOING DEVELOPMENT RULES

1. Any new feature that touches fund flow requires review against ASSET_AND_VALUE_FLOW.md and FUND_CUSTODY_AND_CONTROL.md
2. Any new feature that touches child or beneficiary data requires CPO review before merging
3. Any new user role or permission requires update to CONTROL_AND_PERMISSIONS_MAP.md before implementation
4. Any new trust relationship (API, integration, third party) requires update to TRUST_BOUNDARIES.md
5. No silent failures in fund operations — all failed fund movement attempts must be logged and alerted
6. Test environments must never use real child data — synthetic data only
7. Impact claim states must be enforced at the API level, not just the UI
8. Security vulnerabilities discovered in code review are blockers, not backlog items
9. Audit log is append-only — no code path may delete or modify audit log entries
10. This file is authoritative — conflicts between this file and code behavior are code bugs, not rule gaps

---

*This file is read-only for all roles. Updates require Platform Owner + CPO + Independent Director approval and version increment.*
