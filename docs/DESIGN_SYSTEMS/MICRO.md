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
**Owner:** Claude (implementation), Chase (UX decisions)
