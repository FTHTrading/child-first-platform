# ACCESSIBILITY STANDARDS
**Platform:** Child First Platform
**Version:** 1.0 | **Date:** 2026-04-02
**Standard:** WCAG 2.1 Level AA (minimum) — targeting WCAG 2.2 AA
**Owner:** Engineering Lead + Platform Owner

> A donor who uses a screen reader deserves to give to a child. A parent of a beneficiary who is blind deserves to check on a campaign. Accessibility is not a feature — it is a condition of launch.

---

## SECTION 1 — MANDATE AND SCOPE

### 1.1 — Minimum Standard

This platform meets **WCAG 2.1 Level AA** as the minimum standard before launch. No feature that blocks AA compliance may be shipped to production.

**Target standard:** WCAG 2.2 Level AA — any WCAG 2.2 additions over WCAG 2.1 AA are addressed within 90 days of launch.

### 1.2 — Scope

These standards apply to:
- All public-facing pages (campaign listing, campaign detail, donation flow, homepage)
- All authenticated user interfaces (Campaign Operator dashboard, Admin console)
- All emails sent to donors and operators (plain-text fallback required for all HTML emails)
- All PDF documents published to donors (accessibility tags required)
- Any mobile app interfaces
- Any Chrome extension interfaces

---

## SECTION 2 — WCAG PRINCIPLES APPLIED

WCAG is organized around four principles. Requirements for each follow.

### 2.1 — Perceivable

**Text alternatives (WCAG 1.1)**
- Every image has meaningful alt text or is marked as decorative (`alt=""`)
- Campaign images depicting people require descriptive alt text that does not identify individuals by name
- Icons that convey information (e.g., a status icon) have text alternatives
- Logos have text alternatives

**Captions and audio descriptions (WCAG 1.2)**
- Any video on the platform has synchronized captions (auto-generated captions must be reviewed for accuracy before publication)
- Any audio-only content has a text transcript
- If video has information not conveyed in the audio track (visual-only information), an audio description track or descriptive text alternative is provided

**Adaptable content (WCAG 1.3)**
- Page structure uses semantic HTML: `<main>`, `<nav>`, `<article>`, `<section>`, `<header>`, `<footer>`
- Heading hierarchy is logical and nested correctly (h1 → h2 → h3; no skipping levels)
- Forms use `<label>` elements explicitly linked to inputs by `for`/`id` or `aria-label`
- Required fields are marked programmatically (not only by color)
- Error messages are associated with their input fields via `aria-describedby`
- Reading order in DOM matches expected visual reading order
- Content does not rely on shape, color, or screen position as the only way to convey information ("click the red button" fails this)

**Color and contrast (WCAG 1.4)**
- Normal text: minimum color contrast ratio of **4.5:1**
- Large text (18pt or 14pt bold): minimum contrast ratio of **3:1**
- UI components (buttons, form fields, focus indicators): minimum contrast ratio of **3:1**
- This platform does not use color as the only means of conveying information
- Text is resizable up to 200% without loss of content or function
- No horizontal scrolling required at 320px viewport width
- Text spacing adjustable (line height, letter spacing, word spacing) without content loss

### 2.2 — Operable

**Keyboard navigation (WCAG 2.1)**
- All functionality is accessible via keyboard alone
- No keyboard traps (if a component receives focus, the user can navigate away with keyboard)
- Keyboard navigation order matches logical reading order
- Tab order through the donation form is: amount → frequency → payment method → card inputs → submit
- Modal dialogs trap focus inside the dialog while open; return focus to trigger element on close

**Focus indicators (WCAG 2.4)**
- Every interactive element has a clearly visible focus indicator
- Focus indicator must meet the 3:1 contrast ratio requirement against adjacent colors
- The `:focus-visible` CSS pseudo-class is used; `:focus` outline is never set to `outline: none` without an alternative

**Skip navigation (WCAG 2.4.1)**
- Every page that has repeated navigation has a "Skip to main content" link as the first focusable element
- The skip link becomes visible on focus (may be visually hidden when not focused)

**Timing (WCAG 2.2)**
- If any operation has a time limit, the user must be able to turn off, adjust, or extend it
- Session timeouts show a warning with at least 20 seconds to extend before auto-logout
- The donation flow has no time limit; a partially filled form is never auto-cleared

**Animations and motion (WCAG 2.3)**
- No content flashes more than 3 times per second
- The `prefers-reduced-motion` CSS media query is respected — all animations are disabled or made instantaneous for users who set this preference

### 2.3 — Understandable

**Language (WCAG 3.1)**
- The `lang` attribute is set correctly on the `<html>` element
- When content switches language within a page (e.g., a campaign in Spanish), the inline `lang` attribute is used on the relevant element

**Consistent navigation (WCAG 3.2)**
- Navigation components appear in the same order on every page
- UI components with the same function use consistent labels and behaviors
- Context changes (page navigation, form submissions) only happen on user action — no auto-redirects or auto-submits on focus

**Input assistance — errors (WCAG 3.3)**
- Input errors are described in text, not just by color
- Error messages identify the specific field that has the error
- Error messages describe the cause of the error (not just "invalid")
- On donation form: error messages must appear in-line above the field and in a summary above the form for screen reader efficiency
- Submission of consequential actions (donations, disbursements) requires a confirmation step

**Labels and instructions (WCAG 3.3.2)**
- All form fields have programmatically determinable labels
- Fields requiring specific formats include format instructions (e.g., "MM/DD/YYYY" for date fields)
- Required fields are labeled as required

### 2.4 — Robust

**Compatible markup (WCAG 4.1)**
- HTML validates (no unclosed tags, no duplicate attributes, no duplicate IDs)
- Custom UI components expose correct ARIA roles, states, and properties
- ARIA usage follows the ARIA specification — do not use ARIA to override HTML semantics inappropriately
- Status messages (success alerts, error alerts) are announced to assistive technology via `aria-live` regions

---

## SECTION 3 — CRITICAL USER FLOWS — DETAILED REQUIREMENTS

These flows must be fully accessible before launch. Each must pass functional testing with a screen reader.

### 3.1 — Donation Flow

The donation flow is the most critical accessibility path.

| Step | Requirement |
|---|---|
| Campaign page loads | Screen reader announces campaign title as page heading; donation CTA button is reachable by Tab |
| Amount selection | Radio group or input is labeled; selected amount is announced; custom amount input has visible label |
| Frequency selection | Radio group labeled "Donation frequency"; one-time vs. recurring clearly distinguished |
| Payment information | Stripe Elements iframes expose internal labels; card number, expiry, CVV each labeled |
| Review step | Summary of donation amount, destination, and fees is readable by screen reader before confirm |
| Confirmation | Success state announced via `aria-live`; confirmation number visible and focusable |
| Error states | Specific errors announced; focus moved to first error; summary error at top of form |

### 3.2 — Campaign Operator Submission Flow

| Step | Requirement |
|---|---|
| Campaign creation form | All fields labeled; rich text editor has accessible toolbar |
| Image upload | Upload control labeled; file type and size requirements in visible text adjacent to control |
| Preview | Preview is keyboard navigable; preview/edit toggle uses `aria-pressed` |
| Submit for review | Confirmation step; warning if required fields are incomplete reaches keyboard users |

### 3.3 — Admin Review Flow

Admin console accessibility is required but may be addressed within 90 days of launch if volunteer moderators use assistive technology.

---

## SECTION 4 — TESTING REQUIREMENTS

### 4.1 — Automated Testing

Automated testing is required but is not sufficient alone. Automated tools catch approximately 30-40% of WCAG issues.

**Minimum required tools:**
- **axe-core** or **axe DevTools** — integrated into CI pipeline; no new axe violations on merge to main
- **Lighthouse accessibility audit** — score of 95+ required before any release
- HTML validation (W3C validator or htmlhint in CI)

### 4.2 — Manual Testing — Screen Readers

Before launch, every critical flow (Section 3) must be tested manually with:
- **NVDA + Chrome** (Windows)
- **VoiceOver + Safari** (macOS)

When testing with screen readers, the tester must navigate using keyboard only (no mouse).

**Test protocol:** For each flow in Section 3:
1. Navigate the flow using keyboard only, no screen reader
2. Repeat the same flow using screen reader + keyboard only
3. Document any step where the screen reader announcement is missing, incorrect, or confusing
4. All P0 issues (blocking a flow entirely) must be resolved before launch
5. P1 issues (degraded experience but flow completable) must be resolved within 30 days post-launch

### 4.3 — Color Contrast Verification

- Use the WebAIM Contrast Checker or Colour Contrast Analyser on finalised brand colors
- All text/background combinations in design system must be pre-verified before development begins
- Re-verify on each new design component

### 4.4 — Keyboard Navigation Audit

Before launch, a designated tester must navigate every page using Tab, Shift+Tab, Enter, Space, and arrow keys only, and document:
- Any interactive element that is unreachable
- Any keyboard trap
- Any illogical tab order
- Any missing skip link

### 4.5 — Ongoing Testing

Post-launch:
- Automated accessibility testing runs in CI on every pull request
- Full manual screen reader test of all critical flows: quarterly
- Full keyboard navigation audit: annually
- If a donor or user reports an accessibility issue, it is treated as a P1 incident with 30-day resolution target

---

## SECTION 5 — THIRD-PARTY COMPONENTS AND EMBEDS

This platform uses third-party components (e.g., Stripe Elements, analytics scripts). These components may have accessibility limitations outside the platform's direct control.

**Requirements:**
- Any third-party payment component must be evaluated for WCAG AA compliance before deployment
- If a third-party component is not keyboard accessible: do not deploy it
- Third-party script embeds (analytics, chat) must not interfere with keyboard navigation or screen reader announcements
- Vendor accessibility statements must be reviewed as part of VENDOR_DUE_DILIGENCE.md process

---

## SECTION 6 — ACCOMMODATION REQUESTS

Until a formal accessibility support process is built:
- A contact email address (accessibility@[platform domain]) is published on the platform footer
- Anyone who encounters an accessibility barrier and contacts us receives a human response within 2 business days
- A workaround is offered (e.g., assisted donation via phone or email) while the technical fix is completed
- Accommodation requests are tracked and feed into the next development sprint

---

## SECTION 7 — DOCUMENTATION AND ACCESSIBILITY STATEMENT

Before launch, the platform publishes an **Accessibility Statement** that:
- States conformance level (WCAG 2.1 AA)
- Lists any known exceptions or limitations with remediation timeline
- Provides the contact path for reporting accessibility issues
- States the date of last accessibility test

The statement is updated after each significant test or audit.

---

## SECTION 8 — LAUNCH GATE

**Accessibility is a launch blocker. The platform does not go live until:**
- [ ] All critical flows (Section 3) pass manual screen reader testing
- [ ] All critical flows pass keyboard-only navigation testing
- [ ] Color contrast checked on all final design system tokens
- [ ] Automated axe-core scan returns zero violations
- [ ] Accessibility Statement is published
- [ ] Accommodation request contact path is live
