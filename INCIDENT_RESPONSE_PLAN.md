# INCIDENT RESPONSE PLAN
**Platform:** Child First Platform
**Version:** 1.0 | **Date:** 2026-04-02
**Classification:** Internal Operational Document

> This is the plan you execute DURING an incident — not a policy document. Every section has a name, a number, and a decision. Print this. Know it before you need it.

---

## SECTION 1 — CONTACT TREE

Complete this before launch. Keep a printed copy offline.

```
INCIDENT CHAIN OF COMMAND
──────────────────────────────────────────────────────
Role                  | Name         | Phone | Email
──────────────────────────────────────────────────────
Platform Owner        | [NAME]       | [PH]  | [EMAIL]
Independent Director  | [NAME]       | [PH]  | [EMAIL]
Child Privacy Officer | [NAME]       | [PH]  | [EMAIL]
Finance Officer       | [NAME]       | [PH]  | [EMAIL]
Legal Counsel         | [NAME/FIRM]  | [PH]  | [EMAIL]
Campaign Auditor      | [NAME]       | [PH]  | [EMAIL]
Engineering Lead      | [NAME]       | [PH]  | [EMAIL]
Stripe Support        | N/A          | 1-888-963-8955 | support.stripe.com
Bank (Primary)        | [BANK/REP]   | [PH]  | [EMAIL]
Cyber Insurance       | [INSURER]    | [PH]  | [POLICY #]
──────────────────────────────────────────────────────
```

**Notification cascades by severity — see Section 3.**

---

## SECTION 2 — INCIDENT SEVERITY TIERS

| Tier | Name | Definition | Examples |
|---|---|---|---|
| **P0** | CRITICAL | Active harm to children, active fund theft, data breach in progress | Beneficiary data exfiltration live; admin account actively being used by attacker; funds being moved by unauthorized party |
| **P1** | HIGH | Confirmed security breach, confirmed fraud, major fund error | Admin account was compromised (contained); confirmed campaign fraud; Stripe account frozen; wrong disbursement executed |
| **P2** | ELEVATED | Credible threat, regulatory contact, significant operational failure | Donation processing down > 1 hour; credible fraud allegation; state AG inquiry; verified operator complaint about fund discrepancy |
| **P3** | STANDARD | Operational issues, policy violations, minor errors | Content moderation failure caught and corrected; operator identity expired; minor reconciliation discrepancy |

---

## SECTION 3 — NOTIFICATION REQUIREMENTS BY TIER

| Who to Notify | P0 | P1 | P2 | P3 |
|---|---|---|---|---|
| Platform Owner | Immediate | < 1 hour | < 4 hours | < 24 hours |
| Independent Director | Immediate | < 1 hour | < 24 hours | Weekly summary |
| Child Privacy Officer | Immediate (if child data involved) | < 2 hours (if child data involved) | As relevant | As relevant |
| Finance Officer | Immediate (if fund involved) | < 1 hour (if fund involved) | < 4 hours | As relevant |
| Legal Counsel | Immediate | < 2 hours | < 24 hours | As relevant |
| Engineering Lead | Immediate | < 1 hour | < 2 hours | < 8 hours |
| Affected donors | < 48 hours | < 48 hours | < 72 hours | Not required |
| Regulators (GDPR 72hr) | If EU data involved | If EU data involved | N/A | N/A |
| Law enforcement | If criminal theft/exploitation | If criminal activity confirmed | N/A | N/A |

---

## SECTION 4 — P0 RESPONSE PROCEDURES

### P0-A: Beneficiary Data Breach

**First 15 minutes:**
1. Engineering Lead: isolate the beneficiary data store from all network access (kill the database connection, not the server — preserve state)
2. Platform Owner: call Child Privacy Officer now (phone, not email)
3. Platform Owner: call Legal Counsel now
4. DO NOT attempt to remediate before preserving forensic state

**First hour:**
5. CPO leads incident — Platform Owner supports
6. Engineering Lead: take full snapshot of affected systems for forensics
7. CPO: identify what records were in scope (which campaigns, which partner orgs)
8. Legal Counsel: advise on notification obligations
9. DO NOT post publicly yet

**Within 24 hours:**
10. CPO contacts affected partner organizations (phone first, then email documented)
11. Partner orgs assess whether families need to be warned (child safety assessment)
12. Platform Owner + Independent Director notified of scope assessment
13. Platform's public status page updated: "Maintenance in progress" (no specifics until legal review)

**Within 72 hours:**
14. If EU donors' data was also accessed: GDPR notification to supervisory authority
15. If breach resulted in or is likely to result in a child's physical, social, or psychological harm: law enforcement referral
16. Decision on whether to notify affected donors: Legal Counsel + CPO + Platform Owner

**Recovery gate:** Beneficiary data store may not come back online until:
- [ ] Forensic review complete
- [ ] Attack vector identified and patched
- [ ] Independent security review of remediation
- [ ] CPO sign-off
- [ ] Legal Counsel sign-off

---

### P0-B: Active Fund Theft / Unauthorized Transfer

**First 15 minutes:**
1. Finance Officer: call the bank NOW — request wire recall (most banks have a 24–48 hour recall window — every minute counts)
2. Finance Officer: activate Emergency Freeze — halt ALL disbursements
3. Platform Owner: notified and co-confirms freeze
4. Engineering Lead: preserve audit logs — do not let any log rotation run

**First hour:**
5. Bank: formal written follow-up on recall request; get ticket number
6. Legal Counsel: phone call — advise on law enforcement obligations
7. Independent Director: notified
8. Finance Officer: document exactly what moved, when, to what account, and what authorizations were present

**If theft confirmed:**
9. File a police report (local)
10. If amount exceeds $10,000: FBI financial crimes (IC3.gov)
11. Notify cyber insurance carrier with full documentation
12. Donors notified within 48 hours — honest disclosure of what happened and what recovery steps are underway

**Recovery gate:** Disbursements may only resume when:
- [ ] Attack vector identified and closed
- [ ] All pending disbursements audited and re-verified
- [ ] Independent Director co-signs lift of Emergency Freeze
- [ ] Legal Counsel confirms no regulatory hold required

---

### P0-C: Admin Account / Platform Compromise

**First 15 minutes:**
1. Engineering Lead: invalidate ALL active sessions for all privileged accounts (not just the compromised one)
2. Engineering Lead: rotate all application secrets (JWT signing keys, API keys)
3. Finance Officer: activate Emergency Freeze

**First hour:**
4. Engineering Lead: review audit logs for every action taken by the compromised account in the last 48 hours
5. Platform Owner: account for what privileged access the compromised account had
6. Legal Counsel: advise on notification obligations
7. Engineering Lead: force MFA re-enrollment for all admin accounts before they can log back in

---

## SECTION 5 — P1 RESPONSE PROCEDURES

### P1-A: Confirmed Campaign Fraud

1. Admin: suspend the campaign immediately
2. Admin: deactivate the Campaign Operator's account
3. Finance Officer: freeze all escrow funds associated with the campaign
4. Finance Officer: document the total raised and total disbursed before detection
5. Platform Owner + Independent Director: initiate clawback proceedings if funds were disbursed
6. Legal Counsel: assess whether law enforcement referral is appropriate
7. Affected donors notified within 48 hours — factual, non-defamatory disclosure
8. Post-mortem: how did this operator pass verification? What process change prevents recurrence?

---

### P1-B: Payment Processor (Stripe) Frozen

1. Platform Owner: log in to Stripe Dashboard — identify reason
2. Platform Owner: call Stripe support immediately (1-888-963-8955)
3. Platform Owner: activate backup payment processor if pre-configured
4. If backup not available: Platform status updated → "Donations temporarily paused while we resolve a payment processing issue"
5. Campaign Operators emailed with context
6. Finance Officer: confirm what transactions were in-flight and may be delayed
7. Timeline: if not resolved in 24 hours, Platform Owner contacts legal counsel re: impact on compliance

---

### P1-C: Disbursement to Wrong Account

1. Finance Officer: call the bank IMMEDIATELY — request wire recall
2. Finance Officer: document the correct vs. incorrect destination
3. Finance Officer: activate halt on all pending disbursements until scope is understood
4. If the wire went to an account that was fraudulently substituted: treat as P0-B
5. If the wire was an honest operational error (typo): bank recall + correctional transfer + full audit trail

---

## SECTION 6 — COMMUNICATION TEMPLATES

### For Donors — Major Incident (P0/P1)

```
Subject: Important Update About [Platform Name]

We are writing to inform you of an issue that affected [Platform Name] on [DATE].

What happened:
[One factual paragraph — no speculation, no minimizing]

What was affected:
[Specific scope — what data, what campaigns, what time period]

What we are doing:
[Concrete actions already taken]

What you should do:
[Specific action if any is required from them]

If you have questions:
[Direct contact: name, email, phone]

We hold ourselves to the highest standard of transparency and accountability.
We are sorry this happened and we are committed to making it right.

[PLATFORM OWNER NAME]
[TITLE]
[DATE]
```

### For Partner Organizations — Child Data Incident

```
Subject: Urgent — Data Security Notice for [ORG NAME]

We are contacting you urgently regarding a security incident that may involve
beneficiary records submitted through the Child First Platform.

[FACTUAL SCOPE PARAGRAPH]

We are asking you to:
1. Review whether any families you work with may be at risk from this exposure
2. Take protective action per your own child safeguarding protocols where warranted
3. Contact us immediately if you have questions: [CONTACT]

We are cooperating fully with legal counsel and, where required, regulators.
We will provide updates as they become available.

[CPO NAME]
Child Privacy Officer
[DATE]
```

---

## SECTION 7 — POST-INCIDENT REQUIREMENTS

Every P0 and P1 incident requires:

1. **Written timeline** — minute-by-minute log of when things happened and what decisions were made (reconstructed from audit logs, call records, and team notes)
2. **Root cause analysis** — what was the actual cause? Not the symptom.
3. **Five Whys** — for every root cause, ask why 5 times to get to the systemic issue
4. **Action items** — specific, owned, time-bound changes that prevent recurrence
5. **Document update** — which THREAT_MODEL, FAILURE_MODES, or LAUNCH_BLOCKERS items need updating?
6. **Publish what you can** — if the incident is public knowledge, a brief factual post-mortem demonstrates accountability

Post-incident review must be completed within 14 days of incident resolution. Results reviewed by Platform Owner + Independent Director.

---

## SECTION 8 — QUARTERLY INCIDENT DRILLS

Before launch and quarterly thereafter, the team runs at least one tabletop exercise covering:
- One P0 scenario (simulated, no real systems affected)
- Confirm contact tree is current
- Confirm each team member knows their first 3 steps
- Confirm Emergency Freeze works and all authorized parties can execute it
- Document the drill, note any gaps found

---

*This document is only useful if it is read, practiced, and kept current. An incident is not the time to find out the contact tree is outdated.*
