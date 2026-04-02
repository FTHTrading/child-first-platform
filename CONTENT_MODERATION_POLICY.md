# CONTENT MODERATION POLICY
**Platform:** Child First Platform
**Version:** 1.0 | **Date:** 2026-04-02
**Enforced by:** Platform Admin + Moderation Queue

> Every piece of content uploaded to this platform is reviewed before it reaches a donor or the public. This is not optional efficiency work — it is non-negotiable child protection.

---

## SECTION 1 — SCOPE

This policy applies to all user-generated content submitted to the platform including:
- Campaign descriptions and updates
- Campaign media (images, video thumbnails, documents)
- Impact reports and evidence documentation
- Profile content submitted by Campaign Operators and Verifiers
- Comments or messages (if implemented)

Content submitted by Platform Admins or Platform Owner is still logged but is not subject to moderation queue review.

---

## SECTION 2 — MODERATION QUEUE ARCHITECTURE

### 2.1 — No Content is Published Without Review

All uploaded content enters a **Moderation Queue** before becoming visible to any external user. There is no direct-to-public path. This applies at the API layer — a Campaign Operator cannot bypass the moderation queue even with direct API access.

### 2.2 — Moderation Queue States

| State | Meaning |
|---|---|
| `pending_review` | Uploaded; not yet visible externally |
| `approved` | Reviewed by moderator; visible publicly |
| `rejected` | Violates policy; operator notified with reason |
| `escalated` | Requires senior review; remains hidden |
| `removed` | Was live; reported and removed; logged |

### 2.3 — Review SLA by Content Type

| Content Type | SLA | Notes |
|---|---|---|
| Campaign description (new campaign) | 48 hours | Part of full campaign review |
| Media upload (image/video) | 4 hours | Automated pre-screening + human review |
| Impact reports | 24 hours | Verifier review separate from moderation |
| Campaign updates | 8 hours | Shorter — operator already verified |
| Reported live content | 1 hour | Content flagged by any user; immediate review priority |
| Child-safety concern flagged | 15 minutes | Highest priority — any content with child safety flag |

---

## SECTION 3 — PROHIBITED CONTENT (ABSOLUTE — NO EXCEPTIONS)

The following content is prohibited and will be permanently removed with no appeal path for the category violation:

### 3.1 — Child Exploitation and Dignity Violations
- Any image that identifies a specific child by face, name, or location combination
- Any image of a child in a state of undress
- Any image that is posed to elicit pity in a way that dehumanizes the child (also called "poverty porn")
- Any content that names, identifies, or shows the location of a specific beneficiary child
- Any use of a child's image in paid advertising without documented guardian consent
- Any sexualized depiction of a minor — **this is immediate law enforcement referral**

### 3.2 — Financial Fraud Risk Content
- Campaign pages claiming verified impact before any verification has occurred
- Platform fee disclosures that differ from the platform's actual fee
- Claims of 501(c)(3) status or tax-deductibility that are not confirmed
- Fabricated testimonials or impact statistics
- Campaign pages for organizations that have not completed operator verification

### 3.3 — Illegal Content
- Content promoting illegal activity in any jurisdiction where the platform operates
- Fundraising for causes that violate applicable law
- Know-Your-Customer evasion language ("donate anonymously for legal reasons")

### 3.4 — Dangerous Misinformation
- False medical claims about child nutrition, illness, or treatment needs that contradict established medical consensus
- False emergency claims designed to create artificial urgency for fraudulent fundraising

---

## SECTION 4 — POLICY VIOLATIONS (REVIEWABLE WITH OPERATOR REMEDIATION)

The following content is a policy violation but may be corrected with operator submission of revised content:

### 4.1 — Unverified Organizational Claims
- Claims of impact history not supported by documentation
- Geographic claims not supported by evidence
- Awards, certifications, or affiliations not documented

**Moderator action:** Reject with specific request for documentation. Content may be resubmitted with evidence.

### 4.2 — Dignity-Adjacent Content (Borderline Poverty Imagery)
- Imagery that, while not explicitly exploitative, may compromise the dignity of depicted people
- Imagery collected in contexts where subjects may not have had a meaningful ability to refuse

**Moderator action:** Escalate to senior moderator. Consult content policy standard (Section 6). Operator may be asked to use alternative imagery.

### 4.3 — Missing Required Disclosures
- Campaign pages missing fund use disclosure
- Campaign pages missing operator identity attribution
- Campaign pages missing estimated deliverable or milestone structure

**Moderator action:** Reject with specific list of missing elements. Standard campaign template references included.

### 4.4 — Unclear or Misleading Content
- Impact claims stated as "We will feed children" without realistic basis or budget
- Campaign goals with no explanation of how the amount maps to the described impact
- Urgency language that is unsubstantiated

**Moderator action:** Reject with request for clarification. If operator cannot substantiate, content remains rejected.

---

## SECTION 5 — IMAGE MODERATION STANDARDS

### 5.1 — Pre-Processing (Automated)

All uploaded images go through automated pre-screening before human review:
1. **File type validation** — only permitted file types (JPEG, PNG, WebP, PDF for documents)
2. **File size limits** — maximum 10MB per image; PDFs maximum 25MB
3. **Malware scan** — all uploads scanned before storage
4. **CSAM hash check** — all images checked against NCMEC PhotoDNA or equivalent hash database — **immediate law enforcement referral if matched**
5. **Face detection flag** — images containing detectable minor faces are automatically escalated to human review with a "minor face detected" flag

### 5.2 — Human Review Checklist for Images

For every image that reaches human review, the moderator checks:
- [ ] Does the image identify a specific child? (face visible + location/name?) → REJECT
- [ ] Does the image depict exploitation, suffering, or undress? → REJECT
- [ ] Does the image depict dignity-violating "poverty porn"? → ESCALATE for senior review
- [ ] Is the image's content consistent with the campaign's stated purpose?
- [ ] Has the campaign operator documented consent for any adults depicted?
- [ ] Does the image contain any text claiming unverified facts?

### 5.3 — What Replacement Images Look Like (Approved Standard)

When operators are asked to replace images, provide these as guidance:
- **Preferred:** Images of food being prepared or distributed where beneficiaries are not identifiable
- **Preferred:** Images of hands receiving food, without faces
- **Preferred:** Images of empty bowls, community kitchens, supply stockpiles — impact represented without exposing individuals
- **Preferred:** Illustrations or infographics that represent the program without photography of beneficiaries
- **Avoid:** Any image taken in conditions where the subject had no real ability to consent

---

## SECTION 6 — "POVERTY PORN" STANDARD

This deserves its own section because it is the most common dignity violation in humanitarian fundraising.

**Definition:** Content that depicts suffering, poverty, or vulnerability primarily to trigger donor emotion, without regard for the dignity of the person depicted.

**Common examples:**
- Close-up photographs of visibly malnourished or ill children
- Images specifically posed to highlight visible distress
- Before/after depictions that emphasize suffering in the "before"
- Descriptions that reduce a child to their need ("a starving child with nothing")

**The test:** Does this content treat the person depicted as a human being with dignity, or as a means to an end (donations)?

**Industry standard:** The [Ethical Storytelling framework](https://www.ethicalstorytelling.com/) and the Istanbul Principles for CSO Development Effectiveness provide guidance. Moderators should be trained on this framework.

**Platform standard:** The platform will actively select against poverty-porn imagery even where operators argue it "works." We choose dignity over conversion rates.

---

## SECTION 7 — MODERATOR TRAINING AND QUALIFICATIONS

Every person performing content moderation on this platform must complete:

1. **Child safeguarding awareness training** — before first moderation session; renewable annually
2. **Platform content policy training** — full review of this document; pass a written assessment
3. **Ethical storytelling training** — the dignity standard in Section 6
4. **CSAM protocol training** — how to respond if CSAM is encountered (legal reporting requirements; moderator support resources)
5. **Trauma-informed moderation** — moderators who review distressing content need structured support

**Moderator wellness:** Any moderator who reviews potentially distressing content must have:
- Regular check-ins with their direct supervisor
- Access to an Employee Assistance Program or equivalent counseling resource
- The ability to pause and hand off a queue item without penalty

---

## SECTION 8 — APPEALS AND ESCALATION

### 8.1 — Operator Appeal Rights

If content is rejected, the Campaign Operator receives:
- Specific reason for rejection (citing section of this policy)
- What evidence or change would allow resubmission
- Resubmission path
- Escalation path to Platform Admin if they believe the rejection was incorrect

### 8.2 — Escalation to Platform Owner

If a Campaign Operator disagrees with a moderation decision after the Platform Admin review:
- Written appeal submitted to Platform Owner
- Platform Owner reviews within 72 hours
- Platform Owner's decision is final
- The Platform Owner cannot override decisions related to child-identifiable content (Section 3.1) — those decisions are final

### 8.3 — Escalation for Ambiguous Children's Content

If a moderator is uncertain about whether content crosses the dignity threshold (Section 3.1 or Section 6):
- Content remains in `escalated` state (not published)
- Senior moderator or Child Privacy Officer reviews
- Error on the side of not publishing

---

## SECTION 9 — MANDATORY REPORTING (CSAM)

If any moderator encounters what appears to be child sexual abuse material (CSAM) at any point:

1. **Do NOT** copy, forward, save, or distribute the image
2. **Do NOT** attempt to contact the uploader
3. **Immediately** report to the Platform Owner
4. **Platform Owner immediately** reports to:
   - National Center for Missing & Exploited Children (NCMEC) CyberTipline: www.missingkids.org/gethelpnow/cybertipline or 1-800-843-5678
   - FBI Internet Crime Complaint Center: www.ic3.gov
   - Local law enforcement
5. Preserve the upload metadata (IP, timestamp, account ID) without preserving the image itself
6. The Campaign Operator account is immediately banned pending investigation
7. Moderator is provided victim services resources — this is a serious trauma exposure

This is law and cannot be waived under any circumstances.

---

## SECTION 10 — LIVE CONTENT REPORTING

Any user of the platform may report live content as violating this policy.

**Report path:** "Report this content" link on every campaign page and every media item.

**Required response times:**
- Report received: automated acknowledgment
- Child safety concerns: human review within 15 minutes
- All other reports: human review within 4 hours

**Reporter result notification:** Reporter receives notification of action taken (content removed / content kept with explanation)

---

*This policy must be reviewed and updated whenever the platform adds new content types, expands to new geographies, or when a significant content-related incident occurs.*
