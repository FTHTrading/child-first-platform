# CAMPAIGN END-STATE RULES
**Platform:** Child First Platform
**Version:** 1.0 | **Date:** 2026-04-02

---

## PURPOSE

Every campaign on this platform must have a defined end state. Campaigns do not run indefinitely. Funds do not sit unclaimed. Children are not used as perpetual fundraising props. This document defines every possible campaign lifecycle end state and the exact procedures for each.

---

## SECTION 1 — CAMPAIGN LIFECYCLE STATES

```
[DRAFT] → [PENDING REVIEW] → [ACTIVE] → [FUNDED / CLOSED / FAILED / SUSPENDED]
                                │
                    Can also enter SUSPENDED from ACTIVE
```

| State | Meaning | Fund Status |
|---|---|---|
| Draft | Created, not submitted | No funds collected |
| Pending Review | Submitted, awaiting Admin approval | No funds collected |
| Active | Approved and visible to donors | Accepting donations |
| Funded | Reached its goal | Accepting additional donations up to overfunding limit |
| Closed | End date reached or manually closed | Donations halted; disbursement begins |
| Failed | Did not reach minimum threshold by close date | Refund process triggered |
| Suspended | Paused by Admin pending investigation | Donations halted; funds frozen |
| Terminated | Operator agreement violation; campaign removed | Funds returned or redirected per governance |

---

## SECTION 2 — CAMPAIGN CLOSE (NORMAL END)

### 2.1 — Trigger Conditions

A campaign enters "Closed" state when:
- The campaign end date is reached, OR
- The Campaign Operator requests close with Platform Admin approval, OR
- The funding goal is reached AND no extension was authorized

### 2.2 — Immediate Close Actions (Automated)

Within 1 hour of close trigger:
- [ ] Donations halted — payment processor stops accepting new payments for this campaign
- [ ] Campaign page updated: "This campaign has closed. Thank you for your support."
- [ ] All donors receive automated notification: "Campaign [X] has closed. Funds raised: $[Y]."

### 2.3 — Post-Close Disbursement Window

| Day | Action |
|---|---|
| Day 1–3 | Finance Officer reviews final balance; verifies all donations cleared from Stripe |
| Day 3–5 | Campaign Operator submits final milestone documentation and disbursement request |
| Day 5–10 | Campaign Auditor + authorized approvers review and approve disbursement |
| Day 10–14 | Final disbursement transferred to beneficiary organization |
| Day 14–30 | Impact report submitted by Campaign Operator |
| Day 30–60 | Verifier completes verification; report published |
| Day 60 | Campaign record archived; beneficiary records enter retention period |

### 2.4 — Undisbursed Funds at Close

If a campaign closes with funds collected but no valid disbursement request received within 30 days:
- Finance Officer notifies Campaign Operator
- Operator given 30-day extension to submit disbursement request
- If no request at 60 days post-close: funds held in Reserve Account pending disposition
- Platform Owner + Independent Director determine disposition: refund to donors, redirect to another verified campaign (with donor notification), or designate to a reserve fund for children's aid

---

## SECTION 3 — CAMPAIGN FAILURE (DID NOT REACH MINIMUM THRESHOLD)

### 3.1 — Trigger Conditions

A campaign enters "Failed" state if it closes without reaching the minimum funding threshold defined at campaign creation.

### 3.2 — What Happens to the Funds

Option A — **All-or-Nothing Campaign** (default for new campaigns):
- All collected donations are refunded to donors in full
- Platform fee is NOT extracted (no fee on failed campaigns — platform eats processing cost)
- Refunds processed within 5 business days of close

Option B — **Keep-What-You-Raise Campaign** (must be explicitly marked at creation, disclosed to donors):
- Funds are disbursed to Campaign Operator against documented milestones achievable at the raised amount
- Operator must confirm in writing they can execute a scaled-down version of the program
- Platform fee IS extracted on keep-what-you-raise campaigns

### 3.3 — Donor Notification

Within 24 hours of campaign entering "Failed" state:
- All donors notified of the outcome
- Refund timeline communicated
- Option provided to redirect donation to a different campaign (with new confirmation required)

---

## SECTION 4 — CAMPAIGN SUSPENSION

### 4.1 — Trigger Conditions

A campaign is suspended when:
- A credible fraud allegation is submitted and has not been resolved
- The Campaign Operator's identity verification has lapsed
- An audit finding requires investigation
- The Platform Owner or Admin determines a suspension is necessary pending review

### 4.2 — During Suspension

- Donations HALTED
- Existing campaign funds FROZEN — no disbursements
- Campaign page updated: "This campaign is temporarily unavailable while we complete a review."
- Campaign Operator notified of the reason and expected timeline
- Donors who donated in the 30 days prior to suspension notified

### 4.3 — Resolution

| Outcome | Action |
|---|---|
| No violation found | Campaign restored to previous state; donors notified; normal close timeline resumes |
| Violation confirmed — minor | Operator given remediation plan; campaign may resume after compliance |
| Violation confirmed — serious | Campaign terminated (see Section 5) |

### 4.4 — Maximum Suspension Duration

30 days without resolution triggers a mandatory escalation to Independent Director. If no resolution by day 60, campaign is terminated and donor refunds are processed.

---

## SECTION 5 — CAMPAIGN TERMINATION

### 5.1 — Trigger Conditions

A campaign is terminated when:
- Fraud is confirmed in the campaign operations
- Campaign Operator is found to have violated the Campaign Operator Agreement
- Legal order requires termination
- Campaign Operator voluntarily withdraws and disbursement is not possible

### 5.2 — Termination Fund Disposition

Terminated campaigns follow this priority order for fund disbursement:
1. Verified milestones completed before termination: funds disbursed to confirmed beneficiary organizations for those milestones only
2. Remaining collected but undisbursed funds: returned to donors (refund from Campaign Escrow)
3. If full refund is not possible (funds partially disbursed to fraudulent operator): Platform Owner + Independent Director invoke Reserve Account to make donors whole
4. Clawback proceedings against the operator initiated in parallel

### 5.3 — Public Disclosure

Within 48 hours of termination:
- Campaign page updated: "This campaign has been terminated. All eligible donations are being refunded."
- Affected donors emailed directly with explanation and refund timeline
- If fraud was confirmed: brief factual disclosure statement published (without defamatory detail pending legal review)

---

## SECTION 6 — CAMPAIGN OVERFUNDING RULES

If a campaign reaches 100% of its goal and continues to accept donations:

1. Campaign Operator must request authorization for overfunding from Platform Admin before goal is reached (if they anticipate it)
2. Authorized overfunding campaigns may collect up to 150% of original goal
3. Overfunds must be applied to expanded scope of the same program — not redistributed to other campaigns without donor consent
4. Donor notification: when a campaign is overfunded, donors are informed of the expanded scope
5. If authorized overfunding limit is reached: donations halted automatically

---

## SECTION 7 — RECURRING DONOR RULES AT CAMPAIGN CLOSE

If donors have active recurring donations to a campaign that closes:
1. Recurring donations are automatically cancelled at campaign close
2. Donors receive notice 5 days before the close date
3. Donors retain the option to redirect their recurring donation to another active campaign
4. No automatic fund redirection without explicit donor re-authorization

---

## SECTION 8 — POST-CAMPAIGN RECORD RETENTION

| Record Type | Retention from Campaign Close |
|---|---|
| Donation records | 7 years (tax compliance) |
| Disbursement records | 7 years (audit compliance) |
| Impact reports and evidence | 5 years |
| Beneficiary records | Per BENEFICIARY_DOCUMENTATION.md retention schedule |
| Suspension/termination records | 10 years (legal protection) |
| Campaign page (archived, read-only) | Indefinite (donor and public reference) |

---

*Every campaign must have its end-state procedures configured before it goes live. "We'll figure it out when we get there" is not acceptable for fund disposition or donor communication.*
