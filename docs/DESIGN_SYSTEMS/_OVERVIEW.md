---
title: _Overview
purpose: Documentation for _OVERVIEW.md
status: draft
owner: c.t.cohen
updated: '2026-09-18'
tier_scope: all
phase: operational
---

# Design Systems — Micro and SMB (Mid-Market deferred)

> Updated 2026-09-18 from System 04 and System 05. The existing SMB design system is the base (Tyler's ruling); Micro templates come next; Mid-Market is paused ~12 months.
> Spec: `design/SPEC-04-design-quality.md`.

## What all tiers share
- **Logo-first branch point:** `existing-identity` (extract colors from the client's logo; the Design Discovery Agent crawls their current site for brand, tone and layout) or `generated-identity` (we invent one).
- **One template warehouse:** per-vertical wireframes (plumbing, HVAC, electrical, roofing), locked layout, 10 styling profiles as swappable design-token sets, a constrained set of hero/services/testimonial variants chosen by the Design Agent.
- **Accessibility baseline in every template:** 4.5:1 contrast, 44x44 px targets, keyboard navigation, ARIA, skip links, `lang="en"`.
- **Same agent, four call sites:** demo generation, post-payment build, photo-intake auto-build, customer-edit regeneration. No forked implementations.

## How tiers differ
| Aspect | Micro | SMB | Mid-Market (paused) |
|---|---|---|---|
| Components | 6-8, fixed | 10-12 | 15+ |
| Styling profile | Default (Professional Service) | Any of 10 | Any of 10 |
| Customization | None (text and image edits in the dashboard) | Color, font, spacing, radius sliders | Custom sections, layout |
| Layout | Locked | Locked | Restructurable |
| QA | Same spec gates | Same spec gates | Enhanced (deferred) |

## Styling profiles (System 04 §6)
Professional Service (default) · Modern Minimalist · Cutting-Edge Tech · Established Authority · Energetic & Bold · Eco-Conscious · Luxury Premium · Community-Focused · Modern Industrial · Transparent & Honest.
The existing 30 themes in `app/src/data/themes-30.json` are curated into these 10; the existing 5 hero styles, 4 service layouts and 3 testimonial styles stay as vertical-keyed variants chosen by the Design Agent (not customer-facing).

## See also
[`MICRO.md`](MICRO.md) · [`SMB.md`](SMB.md) · [`MID_MARKET.md`](MID_MARKET.md) (deferred) · [`../DELIVERY_MODEL.md`](../DELIVERY_MODEL.md)

---

## Superseded design-systems overview (2026-09-12)

# Design Systems — Three Tiers

**How the design system scales across Micro, SMB, and Mid-market.**

---

## Design System Architecture

All three tiers share:
- ✅ **Logo-first branch point** (`existing-identity` vs `generated-identity`)
- ✅ **Conditional features** (emergency-focused, portfolio-heavy, seasonal, etc.)
- ✅ **Core components** (header, services, reviews, contact)

What **differs** per tier:

| Aspect | Micro | SMB | Mid-market |
|--------|-------|-----|-----------|
| **Hero styles available** | 1 (fixed) | 5 (choose one) | Unlimited (build custom) |
| **Typography options** | 1 pairing | 3 pairings | Custom fonts upload |
| **Brand colors** | Auto-derived | Primary + accent | Full color picker |
| **Density** | Fixed | 3 options | Unlimited |
| **Custom CSS** | None | None | Full override |
| **Component builder** | None | None | Available |

---

## Tier Breakdown

### MICRO Design System
See: [MICRO.md](MICRO.md)

**Approach:** "We pick the best defaults."
- Fixed hero style (one proven design)
- Fixed typography (one pairing that always works)
- Auto-generated brand (if no logo) or extracted (if logo provided)
- Simple, fast to build

**Design goal:** Perfect for solopreneurs. No decisions, just results.

---

### SMB Design System ← PHASE 1 (FULLY BUILT)
See: [SMB.md](SMB.md)

**Approach:** "You choose your aesthetic, we handle the rest."
- 5 hero styles (design curated by us)
- 3 typography pairings (tested combos)
- Brand extraction from logo (or generated)
- Conditional features per business type
- Self-service dashboard edits

**Design goal:** Professional branding without custom engineering.

---

### MID-MARKET Design System
See: [MID_MARKET.md](MID_MARKET.md)

**Approach:** "Full white-label customization."
- Unlimited hero styles (component builder)
- Custom typography (upload any fonts)
- Full color palette customization
- Custom CSS override
- Pixel-level control via dashboard

**Design goal:** Enterprise-grade control and branding.

---

## How They Share Code

**Single codebase with tier flags:**

```typescript
// Client config
{
  tier: "micro" | "smb" | "mid-market",
  design: {
    heroStyle: "photo-left" | "full-bleed" | ... // tiered options
    fonts: "grotesk-serif" | "humanist" | ... // tiered options
    colors: { primary, accent } | { full palette } // tiered
  }
}
```

**Build time:** Filter components & options per tier, same template engine.

---

## See Also

- **MICRO tier design:** [MICRO.md](MICRO.md) (stub)
- **SMB tier design:** [SMB.md](SMB.md) (fully built — see this for implementation)
- **MID-MARKET tier design:** [MID_MARKET.md](MID_MARKET.md) (stub)
- **Delivery model:** [../DELIVERY_MODEL.md](../DELIVERY_MODEL.md)

---

**Last updated:** 2026-09-12
