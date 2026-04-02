# CONTROL AND PERMISSIONS MAP
**Platform:** Child First Platform
**Version:** 1.0 | **Date:** 2026-04-02
**Standard:** Genesis Elite Humanitarian & Fund-Me Build Standard v2.0

> Every privileged action on this platform is mapped here. If an action is not listed, it is prohibited by default.

---

## SECTION 1 — ROLE DEFINITIONS

| Role | Description |
|---|---|
| **Platform Owner** | Founding operator. Highest system access. Cannot act alone on fund movements. |
| **Platform Admin** | Staff or contractor with elevated management access. Cannot access fund disbursement unilaterally. |
| **Finance Officer** | Responsible for financial operations. Initiates (but does not complete) disbursements. |
| **Independent Director** | External governance role. Required co-signer for emergency actions. No day-to-day access. |
| **Campaign Auditor** | Reviews and approves disbursement milestone documentation. Independent of campaign operators. |
| **Campaign Operator** | Creates and manages fundraising campaigns. Cannot touch funds directly. |
| **Verifier** | Independently confirms impact claims and field reports. Cannot be affiliated with campaigns they verify. |
| **Donor** | Contributes funds. Read access to public campaign data and their own donation history. |
| **Child Privacy Officer** | Controls access to and deletion of beneficiary data. Overrides other roles on privacy matters. |
| **System** | Automated platform processes. Scoped to specific automated actions only. |

---

## SECTION 2 — PERMISSIONS TABLE

### 2.1 — Campaign Management

| Action | Platform Owner | Platform Admin | Finance Officer | Campaign Operator | Notes |
|---|---|---|---|---|---|
| Create draft campaign | YES | NO | NO | YES | Operator creates, admin/owner approves |
| Submit campaign for review | YES | NO | NO | YES | |
| Approve campaign (make live) | YES | YES | NO | NO | Two-step: Admin reviews → Owner approves |
| Reject campaign with reason | YES | YES | NO | NO | |
| Pause live campaign | YES | YES | NO | YES | Operator can pause own campaigns |
| Close campaign | YES | YES | NO | YES | |
| Permanently delete campaign record | YES | NO | NO | NO | Audit log preserved regardless |
| Edit campaign description (live) | YES | YES | NO | YES | Changes go through moderation |
| Edit campaign goal amount (live) | YES | NO | NO | NO | Goal changes require Owner approval |
| View all campaigns (including draft) | YES | YES | YES | NO | Operators see own only |

---

### 2.2 — Fund Operations

| Action | Platform Owner | Finance Officer | Campaign Auditor | Independent Director | Notes |
|---|---|---|---|---|---|
| Submit disbursement request | NO | YES | NO | NO | Finance Officer initiates, never approves own requests |
| Approve disbursement (under $10k) | YES (co-sign) | NO | YES (verify milestone) | NO | Dual: Owner + Auditor |
| Approve disbursement ($10k–$49k) | YES (co-sign) | NO | YES (verify milestone) | YES (co-sign) | Triple required |
| Approve disbursement ($50k+) | YES (co-sign) | NO | YES | YES (co-sign) | + legal review |
| Initiate emergency freeze | YES | NO | NO | YES | Either can freeze; both required to unfreeze |
| Lift emergency freeze | YES + YES | — | — | YES + YES | Both required |
| View all fund account balances | YES | YES | NO | YES | Read-only for Auditor and Director |
| Configure platform fee % | YES only | NO | NO | NO | Changes logged, Donor-facing disclosure required |
| Process donor refund | YES | YES | NO | NO | |
| Initiate clawback from operator | YES + YES | NO | NO | YES + YES | Both required |

---

### 2.3 — User and Account Management

| Action | Platform Owner | Platform Admin | Notes |
|---|---|---|---|
| Create new Platform Admin account | YES only | NO | No self-provisioning |
| Create new Finance Officer account | YES only | NO | |
| Create new Campaign Auditor account | YES only | NO | |
| Create new Verifier account | YES | YES | |
| Deactivate any account | YES | YES | Deactivation logged and alerted |
| Reset MFA for privileged account | YES only | NO | No chain-of-privilege attacks |
| View all user accounts | YES | YES | |
| Approve Campaign Operator registration | YES | YES | |
| Ban Campaign Operator | YES | YES | Must document reason |
| View Donor PII | YES | YES | Access logged |
| Export Donor list | YES only | NO | Logged, restricted |

---

### 2.4 — Beneficiary (Child) Data

| Action | Platform Owner | Child Privacy Officer | Campaign Operator | Platform Admin | Notes |
|---|---|---|---|---|---|
| Submit beneficiary record | NO | NO | YES (own campaigns only) | NO | Operators submit, CPO controls |
| Review/approve beneficiary record | NO | YES | NO | NO | CPO is the gate |
| View beneficiary PII | YES (logged) | YES | NO | NO | No operator access to full child PII |
| Export beneficiary records | NO | YES (logged, restricted) | NO | NO | CPO must document reason |
| Anonymize beneficiary record | NO | YES | NO | NO | |
| Delete beneficiary record | NO | YES | NO | NO | Purge schedule enforced by CPO |
| Associate child photo with campaign | NO | NO | NO | NO | **PROHIBITED** — see Child Protection Rules |
| Associate anonymized impact image | YES | YES | YES (moderated) | YES | Must pass moderation |

---

### 2.5 — Impact Claims and Verification

| Action | Campaign Operator | Verifier | Platform Admin | Notes |
|---|---|---|---|---|
| Submit impact report | YES | NO | NO | |
| Attach evidence to impact report | YES | YES | NO | |
| Approve/reject impact report | NO | YES | YES | Verifier cannot verify own org's claims |
| Mark claim as "Verified" | NO | YES | YES | Badge displayed publicly |
| Mark claim as "Disputed" | NO | YES | YES | |
| Remove disputed claim from public view | NO | NO | YES | |
| Delete impact report | YES (own, unverified) | NO | YES (any) | |

---

### 2.6 — Content and Media

| Action | Campaign Operator | Platform Admin | Platform Owner | Notes |
|---|---|---|---|---|
| Upload campaign media | YES | NO | NO | Queued for moderation |
| Approve media for public display | NO | YES | YES | Moderation gate |
| Remove any live media | NO | YES | YES | |
| Report media as violating | YES (others) | — | — | Any role can report |
| Override moderation decision | NO | NO | YES only | Logged |

---

### 2.7 — System Configuration

| Action | Platform Owner | Platform Admin | Notes |
|---|---|---|---|
| Modify platform fee schedule | YES only | NO | Requires disclosure update |
| Modify content policy | YES only | NO | |
| Configure payment processor | YES only | NO | |
| Modify MFA requirements | YES only | NO | Downgrading is a SECURITY BLOCK |
| Configure external API credentials | YES only | NO | |
| Deploy code to production | YES | YES (CI/CD with review) | Requires approval process |
| Access production database directly | YES (logged) | NO | All direct DB access logged |
| Modify audit log | PROHIBITED | PROHIBITED | Audit log is append-only by system |

---

## SECTION 3 — ACCESS CONTROL RULES

### 3.1 — Least Privilege by Default
Every new account starts with zero permissions. Permissions are explicitly granted against this map and no other.

### 3.2 — Separation of Duties (Required, Not Aspirational)
- The person who initiates a disbursement (Finance Officer) CANNOT be the same as the person who approves it.
- The person who submits an impact report (Campaign Operator) CANNOT be the Verifier who approves it.
- The person who approves a campaign (Admin) CANNOT be the Campaign Operator for the same campaign.
- The Child Privacy Officer CANNOT be a Campaign Operator.

### 3.3 — Privilege Escalation is Prohibited
No role may grant itself or another account permissions beyond what this map defines. Any attempt to do so is a SECURITY EVENT logged and alerted.

### 3.4 — All Privileged Access is Logged
Every action in the FUND OPERATIONS and BENEFICIARY DATA sections creates an immutable audit log entry including: actor, action, timestamp, IP address, reason code (where required).

### 3.5 — Session Controls
- Admin, Finance Officer, Campaign Auditor: session expires after 2 hours of inactivity
- MFA required on every session start for all elevated roles
- Admin actions require re-authentication after session gaps > 30 minutes

### 3.6 — Emergency Access ("Break Glass")
Documented in a sealed procedure accessible only to Platform Owner and Independent Director.
Break-glass use must be reported to Independent Director within 24 hours.

---

## SECTION 4 — PROHIBITED ACTIONS (REGARDLESS OF ROLE)

These actions are prohibited for ALL roles, including Platform Owner:

1. Modifying or deleting entries in the audit log
2. Accessing beneficiary (child) data without a logged, documented reason
3. Moving funds from the Donor Trust Account to the Operational Account for any reason other than platform fee extraction
4. Representing unverified impact claims as "Verified"
5. Sharing Campaign Operator credentials with another person
6. Using platform infrastructure for personal financial transactions
7. Accessing donor payment card data (platform must not store this)
8. Publicly identifying a child beneficiary by name, image, or location

---

*Any action not listed in this document is DENIED by default. This map must be updated before any new privileged feature is shipped.*
