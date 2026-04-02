# DISASTER RECOVERY PLAN
**Platform:** Child First Platform
**Version:** 1.0 | **Date:** 2026-04-02
**Owner:** Platform Owner + Engineering Lead
**Review:** Annually + after every disaster event or significant infrastructure change

> This platform manages donated funds designated for children. Downtime means delayed disbursements and eroded donor trust. Every system has to have a documented recovery path before it goes live.

---

## SECTION 1 — OBJECTIVES

### 1.1 — Recovery Targets

| System | RTO | RPO | Tier |
|---|---|---|---|
| Donor payment acceptance | 4 hours | 1 hour | Critical |
| Campaign public pages (read-only) | 2 hours | 4 hours | Critical |
| Fund disbursement processing | 8 hours | 1 hour | Critical |
| Campaign management (operator dashboard) | 24 hours | 4 hours | High |
| Impact reporting and evidence storage | 48 hours | 24 hours | High |
| Admin management console | 24 hours | 4 hours | High |
| Audit logs | 1 hour (restore accepted) | 0 hours (no loss permitted) | Critical |

**Definitions:**
- **RTO (Recovery Time Objective):** Maximum acceptable downtime measured from incident declaration
- **RPO (Recovery Point Objective):** Maximum acceptable data loss measured backward from the failure point

---

## SECTION 2 — BACKUP SCHEDULE AND STANDARDS

### 2.1 — Database Backups

| Backup Type | Frequency | Retention | Storage Location |
|---|---|---|---|
| Continuous WAL/transaction logs | Real-time streaming | 7 days | Separate region from primary |
| Full database snapshot | Daily (off-peak hours) | 30 days | Separate region + offline copy |
| Monthly archive | Monthly (end of month) | 7 years | Cold storage (regulatory retention) |

**Requirements:**
- Backups are encrypted at rest (AES-256 or equivalent)
- Backups are encrypted in transit (TLS 1.2+)
- Backup encryption keys are stored separately from the backup files
- Backup storage is in a different cloud region than primary application hosting

### 2.2 — File and Media Backups

| Asset | Frequency | Retention |
|---|---|---|
| Campaign media (images, documents) | Daily | 30 days rolling + permanent for audit-relevant items |
| Application code | Git-backed (continuous) | Full history |
| Configuration files and secrets | Versioned; encrypted | Permanent (minimum 7 years) |
| Audit logs | Real-time export to separate store | 7 years minimum |

### 2.3 — Backup Verification

- Daily backups must be verified automatically (checksum comparison)
- A restore test must be performed **monthly** — restore to isolated test environment and confirm database integrity
- Results of restore tests must be logged and retained
- If any backup fails verification, it is treated as an incident and the Engineering Lead is notified

---

## SECTION 3 — SYSTEM RECOVERY PROCEDURES

### 3.1 — Database Primary Failure

**Symptoms:** Primary database unreachable; application errors on all database-dependent routes

**Response:**
1. Engineering Lead declares incident (within 15 minutes of alert)
2. Confirm primary failure is not a network issue (ping test from separate origin)
3. Promote read replica to primary if replica lag is acceptable (< RPO)
4. Update application database connection string to point to new primary
5. Restart application services
6. Validate: confirm donation flow, confirm operator login, confirm admin login
7. Notify Platform Owner
8. Investigate and document root cause

**If no replica is available:**
1. Initiate restore from most recent backup
2. Calculate data loss window; document
3. Notify Platform Owner with data loss estimate
4. Complete restore; follow validation checklist above
5. If data loss involves financial transactions, follow INCIDENT_RESPONSE_PLAN.md P1-C (Wrong Disbursement / Missing Transaction) procedure

### 3.2 — Application Server Failure

**Symptoms:** 5xx errors on all routes; payments not processing; no response from health endpoint

**Response:**
1. Confirm scope: single instance vs. all instances
2. If single instance: reroute traffic to remaining instances; scale up replacement; investigate failed instance
3. If all instances: redeploy from last-known-good artifact to new infrastructure
4. Validate deployment: run smoke test suite (health → authentication → campaign load → payment simulation → disbursement check)
5. Notify Platform Owner if downtime > 30 minutes

### 3.3 — Payment Processor (Stripe) Degradation or Outage

**This is not within platform control but requires a response plan.**

**If Stripe is degraded but not down:**
- Monitor Stripe status page (https://status.stripe.com)
- Display a "Payments may be delayed" banner to donors
- Do not disable donations unless Stripe declares full outage

**If Stripe is fully down:**
- Display maintenance message on checkout page: "Donations are temporarily paused while we address a payment system issue. Your generosity is appreciated — please check back shortly."
- Do not attempt workaround payment methods (no ad-hoc PayPal or bank transfer for donations — this creates AML risk)
- Resume payment acceptance when Stripe declares full resolution
- Check for any transactions in ambiguous state (submitted but not confirmed) immediately after restoration
- Reconcile all pending transactions before declaring normal operations

### 3.4 — Content Delivery Network (CDN) or Hosting Failure

**If CDN is unavailable:**
- Campaign pages may be slow but functional if origin is still up
- Confirm origin health independently
- If CDN provider has an incident, monitor their status page
- If extended outage (> 4 hours), activate backup CDN endpoint or serve directly from origin with rate limiting enabled

**If hosting provider (cloud infrastructure) has a regional outage:**
1. Confirm outage is regional: check provider status page
2. If region-wide: initiate failover to pre-configured alternate region (see Section 7)
3. Update DNS to point to alternate region (TTL must be set to 60 seconds for all critical records)
4. Notify Platform Owner

---

## SECTION 4 — CRITICAL DATA PROTECTION

### 4.1 — Audit Log Integrity

Audit logs must never be lost. This is a legal and regulatory requirement.

- Audit logs are replicated to a write-once store in real-time
- Log store is in a separate account or infrastructure tenant from the application
- Application service accounts have append-only access to the log store (cannot delete or modify)
- Monthly integrity check: hash verification of archived logs

### 4.2 — Financial Transaction Records

Financial transaction records (donations, disbursements, fees, refunds) are:
- Written to the primary database plus a separately-hosted immutable ledger
- Backed up daily per Section 2.1
- Retained for 7 years minimum

If ANY financial transaction record is found to be inconsistent with payment processor records:
- Treat as P0 incident
- Freeze all disbursements
- Follow INCIDENT_RESPONSE_PLAN.md

### 4.3 — Beneficiary and Donor PII

PII (donor identity records, beneficiary records) must never be stored only in one place.

- PII is encrypted before storage
- Encryption keys are held in a dedicated key management system (KMS), not alongside the data
- Backup copies of encrypted PII are held in a separate region
- KMS key backup is held offline (hardware security module or encrypted offline key backup)

---

## SECTION 5 — KEY PERSON CONTINUITY

This platform is initially operated by a small team. Key person dependency is a real risk.

### 5.1 — Critical Access Inventory

| Function | Primary Person | Backup Person | Access Details |
|---|---|---|---|
| Cloud infrastructure admin | Engineering Lead | Platform Owner | Documented in access control register |
| Domain registrar | Platform Owner | Engineering Lead | [Platform Owner: document credentials location] |
| Payment processor (Stripe) | Platform Owner | Finance Officer | [document account recovery path] |
| Database root credentials | Engineering Lead | Platform Owner | Held in encrypted vault |
| Encryption key access (KMS) | Engineering Lead | Platform Owner | Dual-auth required |
| Cloudflare IP | Platform Owner | Engineering Lead | [document account recovery path] |

### 5.2 — Credentials Escrow

- All production credentials are stored in a password manager or secrets vault with minimum 2 authorized users
- A printed, encrypted, and physically secured emergency credential set is maintained and reviewed quarterly
- In the event that the sole holder of a critical credential is incapacitated: [LEGAL COUNSEL must define successor access path in accordance with platform's governance documents]

### 5.3 — Engineering Lead Departure

If the Engineering Lead departs unexpectedly:
1. Platform Owner immediately inventories all live system access the Engineering Lead held
2. Audit logs reviewed for any unusual activity in the 30 days prior
3. All shared credentials are rotated
4. Engineering Lead's personal accounts are removed from all infrastructure
5. A new Engineering Lead is identified within 30 days; handover documentation is required

---

## SECTION 6 — INFRASTRUCTURE DOCUMENTATION REQUIREMENTS

Before launch, the following documentation must exist and be kept current:

- [ ] Architecture diagram (all services, databases, CDN, DNS, payment flows)
- [ ] Network diagram with security group / firewall rules documented
- [ ] Runbook for each critical system component (start, stop, restart, failover)
- [ ] Incident declaration checklist (who declares, how to declare, who is notified)
- [ ] DNS records inventory (all records, TTLs, registrar access)
- [ ] Service account and API key inventory (what they can access; what they cannot)
- [ ] Infrastructure-as-code (preferred) or script-based provisioning for all environments

This documentation is stored in the same repository as application code, in a `/docs/ops/` directory, and backed up with the same frequency as application code.

---

## SECTION 7 — GEOGRAPHIC FAILOVER

**Active Region:** [Define primary cloud region — e.g., us-east-1]
**Failover Region:** [Define backup region — e.g., us-west-2]

**Conditions for triggering regional failover:**
- Primary region hosting provider declares a regional outage
- Primary region is experiencing > 4 hour downtime with no estimated recovery
- Engineering Lead judges that the probability of rapid recovery is low

**Failover pre-requisites (must be true before failover is viable):**
- Database replica is running and current in the failover region
- Application is deployable to failover region from current artifact store
- DNS TTLs are set to 60 seconds or less on all critical records
- Failover has been tested in the last 90 days (see Section 8)

---

## SECTION 8 — TESTING SCHEDULE

| Test | Frequency | Responsible | Pass Criteria |
|---|---|---|---|
| Backup restore test | Monthly | Engineering Lead | Database restored to isolated environment; full integrity confirmed in < 4 hours |
| Application deployment from scratch | Quarterly | Engineering Lead | Full stack deployed from code to working state in < 2 hours using documented runbook |
| Regional failover simulation | Semi-annually | Engineering Lead + Platform Owner | Platform operational in failover region within RTO (8 hours) |
| Key person access audit | Quarterly | Platform Owner | All critical access has 2+ authorized holders; no single points of failure |
| Incident response tabletop drill | Quarterly | All operators | See INCIDENT_RESPONSE_PLAN.md — all roles understand their responsibilities |

**Test results are documented and retained. Failed tests are treated as P1 incidents.**

---

## SECTION 9 — COMMUNICATION DURING OUTAGE

### 9.1 — Internal Communication

Engineering Lead and Platform Owner communicate by phone during any P0/P1 infrastructure incident. Do not rely on systems that may themselves be affected.

A secondary communication channel (Signal, WhatsApp, or equivalent) should be pre-established outside the platform's own infrastructure.

### 9.2 — Donor and Operator Communication

For outages > 30 minutes:
- Status message on the site's main page (if the site is accessible)
- Email to all Campaign Operators explaining the outage and expected resolution time
- Donors waiting on donation confirmation receive email assurance if payment was captured before the outage

For outages > 4 hours:
- Email to all registered donors explaining the outage
- Social media acknowledgment (if maintained)
- If payment processor is involved: status update on each known-captured-but-unconfirmed transaction

**Communication tone:** Factual, accountable, no false timelines. Silence during a long outage is worse than a short honest update.

---

*This plan is reviewed annually, after every disaster event, after every failed test, and whenever infrastructure changes significantly.*
