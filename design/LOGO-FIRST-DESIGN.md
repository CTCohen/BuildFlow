---
title: Logo First Design
purpose: Documentation for LOGO-FIRST-DESIGN.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

> **Updated 2026-09-18 (spec reconciliation):** logo-first is the design branch point the spec's **Design Discovery Agent** feeds (System 04 section 5): it crawls the prospect's site, extracts logo, colors, fonts, tone and layout into a brand profile, and the Design Agent preserves it (`existing-identity`) or invents an identity (`generated-identity`). It is built pre-launch in a minimal form. Customer-facing choice is limited to the 10 styling profiles.


# Logo-First Design System

**Competitive Advantage:** Fornax designs around YOUR logo, not around templates.

Most web design agencies use a template-first approach: pick a template, inject your colors, done. This results in homogeneous websites that feel generic.

Fornax uses a **logo-first approach**: analyze your logo → extract brand identity → select template variants that complement your brand.

---

## How It Works

### 1. Logo Analysis
When you submit your logo, we:
- Extract dominant colors (primary, secondary, accent)
- Classify mood: bold, refined, playful, professional, vibrant
- Classify style: modern, classic, hand-drawn, minimalist, ornate
- Validate WCAG AA contrast for accessibility
- Return confidence score (≥80% = use, <80% = manual review)

### 2. Mood + Business Type Mapping
We cross-reference your logo mood with your business type to select the best variant:

**Bold logos:**
- HVAC/Emergency services → bold hero with red/urgent accents
- Plumbing → reliability-focused hero with strong typography
- Electrical → high-contrast power theme

**Refined logos:**
- Luxury/Premium services → minimal, elegant hero with whitespace
- Landscaping → nature-focused imagery with subtle branding

**Playful logos:**
- Cleaning services → bright, energetic hero with vibrant colors
- Junk removal → solution-focused hero with optimistic tone

**Professional logos:**
- Consulting → serif typography, authoritative design
- Accounting → corporate colors, trust signals

### 3. Component Variant Selection
Based on logo mood, we select variants for:
- **Hero section** (5-8 options per mood)
- **Services section** (4-5 layout options)
- **Testimonials** (3-4 arrangement options)
- **CTA buttons** (style matches logo energy)
- **Color palette** (light & dark modes auto-generated)

### 4. Deterministic + Diverse
**Deterministic:** Same business type + logo mood always gets same variant (reproducible)
**Diverse:** Different businesses don't all look identical (each logo is unique)

**How?** Seeded selection via business name hash:
```
hash(businessName) % numVariants = selected variant
// Example: "Phoenix HVAC Pro" hash % 8 variants = variant #3
// Same business always gets variant #3
// Different businesses likely get different variants
```

---

## Variant Pool Requirements

**Current pools (insufficient):**
- Hero: 3 variants (87 Phase 1 sites → 26% duplication)
- Services: 2 variants (70 sites → high duplication)
- Testimonials: 2 variants (low diversity)

**Target pools (Phase 2):**
- Hero: 8 variants per mood (5 moods = 40 total)
- Services: 5 variants per business type (6 types = 30 total)
- Testimonials: 4 variants (general)

This expansion ensures <5% site duplication even at 500 businesses.

---

## Design Decision Tree

```
START: Customer submits logo + business type

1. ANALYZE LOGO
   ├─ Extract colors → primary, secondary, accent
   ├─ Classify mood → bold|refined|playful|professional|vibrant
   ├─ Validate WCAG AA → pass/fail
   └─ Confidence ≥80%? → YES: auto-select | NO: manual review

2. MAP TO VARIANT
   ├─ Look up: mood + business type
   ├─ Return: hero variant, color scheme, component styles
   └─ Hash business name for deterministic selection

3. RENDER SITE
   ├─ Generate color tokens (light + dark)
   ├─ Apply component variants
   ├─ Inject business content
   └─ Build + QA

4. LAUNCH
   └─ Customer site live with logo-aligned design
```

---

## Philosophy

**Why logo-first matters:**
1. **Brand authenticity** — Site reflects customer's actual brand, not a generic template
2. **Faster customer approval** — Design feels personal, reduces revision requests
3. **Competitive differentiation** — "We design around YOUR brand" is a strong sales angle
4. **Better SEO** — Unique design signals authenticity to Google
5. **Memorable results** — Customers remember their site because it's *theirs*

**Customer perception:**
- Template-first: "They built me a website using their template"
- Logo-first: "They built me a website around MY brand"

---

## Implementation Roadmap

**Phase 1:** Logo analyzer (MVP) + mood/business mapping rules
**Phase 2:** Expand variant pools (3→8 heroes, 2→5 services)
**Phase 3:** Refine rules based on customer satisfaction
**Phase 4:** Add logo-to-color extraction (Claude Vision API)
**Phase 5:** Machine learning for variant selection (if data available)

---

## Success Criteria

✓ Logo analyzer working (confidence ≥80% on test set)
✓ Variant pools expanded to target sizes
✓ <5% site duplication at 500 businesses
✓ Customer satisfaction with design (NPS ≥70)
✓ Sales message validated: "Design around YOUR brand"

---

## Design System Files

- `logo-analyzer.ts` — Color extraction + mood classification
- `logo-to-variant.ts` — Decision rules (mood + type → variant)
- `color-tokens.ts` — CSS variable generation
- `variant-pools/` — Hero, services, testimonials variants
- `tests/` — Test logo analysis against real customer logos

---

**Core principle:** Every site should feel like it was designed *for* that business, not *from* a template.
