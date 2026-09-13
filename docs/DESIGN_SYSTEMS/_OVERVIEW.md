---
title: _Overview
purpose: Documentation for _OVERVIEW.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

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
