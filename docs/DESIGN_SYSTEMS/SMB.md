---
title: Smb
purpose: Documentation for SMB.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

# Design System — SMB Tier

**Fully built. Professional design system for established contractors and small businesses.**

---

## Philosophy

"You choose your aesthetic, we handle the rest." SMB customers want professional branding without custom engineering. We curate design options and let them pick.

---

## Current Implementation

### Hero Styles (5 Options)
1. `photo-left` — Photo on left, text on right
2. `full-bleed` — Photo fills viewport, text overlay
3. `split` — 50/50 photo and color block
4. `accent-bar` — Text-focused with accent color bar
5. `minimal` — Clean, simple, text-forward

**Selection logic:**
- Extracted brand mood (if logo exists) → suggest style
- Business type (emergency vs leisurely) → suggest style
- Otherwise: curate top 2–3, let them pick

### Typography (3 Pairings)
1. `grotesk-serif` — Modern sans + classic serif (professional)
2. `humanist` — Humanist sans + serif (warm, approachable)
3. `classic` — Traditional serif pair (timeless)

**Selection logic:**
- Logo analysis (if exists) → suggest pairing
- Business positioning (luxury vs friendly) → suggest pairing
- Otherwise: show all 3

### Brand Colors
- **Primary:** Extracted from logo (if exists) OR generated
- **Accent:** Extracted or complementary to primary
- All other UI colors auto-derived (shades, tints, grayscale)

**Logo extraction:**
- If logo provided: analyze primary color + mood
- Extract hex values, validate contrast
- If no logo: generate based on business type

### Density (3 Options)
1. `compact` — Tight spacing, dense content
2. `comfortable` — Standard spacing (default)
3. `spacious` — Airy, generous spacing

### Conditional Features
Based on business signals:
- **Emergency-focused** (HVAC, plumbing, electrical) → Add emergency CTA, highlight 24/7
- **Portfolio-heavy** (roofing, deck-building) → Add before/after gallery
- **Seasonal** (landscaping, snow removal) → Add seasonal messaging
- **Project-based** (roofing, deck-building) → Add project timeline
- **Multi-location** (chains, multi-branch) → Add location switcher
- **Solo operator** (1-person shop) → Add owner story/bio

---

## Build Process

**Timeline:** 5–7 days

1. **Intake:** Collect business info, logo (if exists), photos, services, tone (professional vs friendly)
2. **Brand extraction:** If logo, extract colors + mood; if not, generate brand
3. **Design decisions:** Pick hero style, font pairing, density based on business type
4. **Build:** Render site with chosen design + conditional features
5. **QA:** Full QA gate (schema, placeholders, content, links, Lighthouse, layout sanity, build)
6. **Preview:** Send to customer, collect feedback
7. **Launch:** Go live or request edits

---

## QA Gate (Full)

- ✅ Schema validation
- ✅ No placeholder text
- ✅ Required content present (name, phone, services, reviews, areas)
- ✅ Internal links valid
- ✅ Lighthouse 90+ (perf, a11y, SEO)
- ✅ Layout sanity (responsive, no text overflow)
- ✅ Build compiles
- ⏳ LLM rubric (visual quality — deferred to Phase 2)
- ⏳ Form submission test (deferred to Phase 2)

---

## Self-Service Dashboard (Managed Growth)

Customers can edit via dashboard:
- [ ] Business hours
- [ ] Service descriptions
- [ ] Photos (upload new, reorder)
- [ ] Testimonials (add/edit reviews)
- [ ] Service areas
- [ ] Contact methods (phone, email, form)

What they **cannot** change:
- Design (hero style, fonts, colors)
- Layout
- Logo / brand identity

---

## Known Trade-Offs

- **Pro:** Professional branding without custom work, flexible design options
- **Con:** Still somewhat templated (vs. truly custom Mid-market), no pixel-level control

---

## See Also

- **Implementation detail:** [../../app/src/lib/conditional-features.ts](../../app/src/lib/conditional-features.ts)
- **Client config schema:** [../../app/src/data/schema.mjs](../../app/src/data/schema.mjs)
- **Test client (example):** [../../app/src/data/clients/bright-spark-electric.json](../../app/src/data/clients/bright-spark-electric.json)

---

**Status:** FULLY BUILT (launching Phase 1)  
**Owner:** Claude (implementation), Chase (UX validation)  
**Last updated:** 2026-09-12
