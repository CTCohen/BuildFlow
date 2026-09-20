---
title: Micro
purpose: Documentation for MICRO.md
status: draft
owner: c.t.cohen
updated: '2026-09-18'
tier_scope: all
phase: operational
---

# Design System: Micro Tier

> Rebuilt 2026-09-18 from System 04, System 05 and the business model. Micro is built **after** the SMB design system (Tyler's sequence). Status: planned, not yet built.

## Philosophy
"We pick the best defaults." Micro customers are solo contractors who want a credible site fast. One great fixed design; they edit text and images, not layout.

## Template (6-8 components)
Hero · services grid · single service page (description, price signal, CTA) · testimonials (2-3) · contact form · footer with NAP and hours · mobile call bar. Reuse the SMB components in a reduced set; do not fork them.

## Fixed decisions
- **Styling profile:** Professional Service (default). No slider customization.
- **Identity:** `existing-identity` if a logo exists (Discovery Agent extracts colors), otherwise `generated-identity`.
- **Density and typography:** one comfortable density and one proven type pairing.
- **Editable in the dashboard:** business name, service text, contact info, hours, logo and gallery images. Hero, layout, colors and fonts are locked (RECONCILIATION_LOG D18).
- **No CRM connector** at launch: email lead alerts and CSV export (D21).

## QA
Same spec gates as SMB (demo Lighthouse at least 80, accessibility at least 90, axe zero must-fix; live at least 90), plus the existing schema, placeholder, required-content, link and form checks.

## Build steps
1. Micro flag in the client data (`tier: micro`, `styleProfile`). 2. Reduced component set behind the tier flag. 3. Copy from the reusable copy pool. 4. Discovery Agent identity. 5. QA loop. 6. Smoke test each vertical with 2-3 profiles.

## Open items
Confirm the single-service-page vs services-grid layout, and whether Micro gets 2 or 3 fixed hero options. Measure Micro CAC and churn after launch.

---

## Superseded Micro stub (2026-09-12)

# Design System — Micro Tier

**Stub: Simple, fast design system for solopreneurs and just-starting contractors.**

---

## Philosophy

"We pick the best defaults." Micro customers don't have time for design decisions. We give them one great option and get them live fast.

---

## Design Decisions (To Be Built)

### Hero Style
- [ ] Pick 1 hero style that works for most trades (recommend: `full-bleed` or `split`)
- [ ] No customization (fixed)

### Typography
- [ ] Pick 1 font pairing that's professional and readable
- [ ] No customization (fixed)

### Brand Colors
- [ ] If they have a logo: extract primary + accent (from logo)
- [ ] If no logo: generate simple brand (blue primary, gray accent)
- [ ] All other colors auto-derived from primary + accent

### Layout
- [ ] Fixed density (`comfortable`)
- [ ] No customization

### Conditional Features
- [ ] Simplified feature detection (basic vs featured, not full trade-signal suite)
- [ ] No conditional complexity

---

## Build Process

**Timeline:** 3–4 days

1. Intake: Collect name, phone, 2–3 services, contact photo (or none)
2. Build: Apply defaults, extract/generate brand, render site
3. QA: Basic checks (no placeholders, links work, form submits)
4. Launch: Go live, send login instructions (if Managed Growth)

---

## QA Gate (Simplified)

- ✅ No placeholder text
- ✅ Name, phone, services present
- ✅ Build compiles
- ✅ Links work
- ✅ Contact form submits

(Simplified vs. SMB/Mid-market. No Lighthouse, no layout-sanity checks.)

---

## Known Trade-Offs

- **Pro:** Fast (3–4 days), predictable, cheap to build
- **Con:** No customization, may feel "templated" to some customers

---

## Future Work

- [ ] A/B test which hero style converts best
- [ ] Determine if we need 2–3 fixed options or just 1
- [ ] Validate QA checks (are 5 checks enough, or too many?)
- [ ] Measure customer satisfaction (does "templated" affect NPS?)

---

**Status:** STUB (ready to build when Phase 2 launches Micro tier)  
**Owner:** Claude (implementation), Tyler (UX decisions)
