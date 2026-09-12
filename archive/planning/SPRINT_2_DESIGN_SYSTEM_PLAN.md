# Sprint 2: Design System Hardening Plan

**Outcome of Sprint 1 (Workflow):** Complete design system pipeline executed. Identified critical shortcomings in variant pool sizing and accessibility. This sprint fixes them.

---

## ⚠️ CRITICAL BLOCKER: Variant Pool Under-Sizing

### The Problem

**Old Plan promised:** 30+ distinct visual themes, diversity score >0.8  
**Workflow discovered:** 26.21% of generated sites share identical variant combinations

**Root Cause:** Two design categories have insufficient variants for their market demand:

| Category | Current Pool | Sites Demanding It | Ratio | Result |
|----------|--------------|-------------------|-------|--------|
| Portfolio-Visual Hero | 3 variants | 87 sites | 29:1 | 26% duplicates |
| Standard-Professional Color | 2 variants | 70 sites | 35:1 | Multiple sites get same color |

When 87 sites are distributed across only 3 portfolio hero variants using deterministic seeding, inevitably 26%+ will collide on the same variant.

### Why This Matters

For BuildFlow's core value prop — **"unique websites on your doorstep"** — homogeneous output is a deal-breaker:
- ❌ Customers see visually similar sites (defeats differentiation)
- ❌ Portfolio-visual category (our most popular layout) becomes synonymous with "template"
- ❌ Standard-professional color (fallback for unmapped verticals) makes generic-looking sites
- ❌ Cannot ship to production until variant pools match actual usage patterns

### The Solution: Pre-Production Variant Expansion

**Tier 1 is NOT optional.** Before any other work, we must:

1. **Expand portfolio-visual hero:** 3 → 8 variants (carousel, masonry, collage, stacked, overlay, sidebar, featured-grid, image-left)
2. **Expand standard-professional color:** 2 → 5 variants (add teal, forest-green, indigo, slate alternatives)
3. **Re-test with 150+ sites:** Confirm duplicate rate drops to <5%

**Estimated outcome:** Unique variant combos increase from 61 → 140+

**Timeline:** 3–4 days (Tier 1 only; can parallel with Tier 3, but cannot skip)

**Go/No-Go:** If we don't fix this, we cannot ship production sites. All other work is downstream.

---

## Status Summary

| Component | Status | Issue | Priority |
|-----------|--------|-------|----------|
| Homogenization Risk | 🚨 CRITICAL | 26.21% of sites share identical variant combinations | Tier 1 |
| Accessibility | ⚠️ HIGH | 86% vs 95% target; contrast + motion support gaps | Tier 3 |
| Performance | ⚠️ HIGH | Lighthouse score unknown; needs optimization | Tier 3 |
| Spec Quality | ❓ UNCERTAIN | Phase 2–3 outputs not audited for production readiness | Tier 2 |

---

## Tier 1: Fix Homogenization (Core Value Prop)

**Goal:** Reduce duplicate site variants from 26% to <5%. Restore design diversity.

### 1.1 Expand Variant Pools

**Hero Variants: portfolio-visual (3 → 8)**

Current: `portfolio-visual-image-left.astro` (only 3 variants competing for 87 sites)

Expand to:
- `portfolio-visual-image-left.astro` (existing)
- `portfolio-carousel-full-bleed.astro` — swipeable carousel, full-width, minimal text overlay
- `portfolio-masonry-grid.astro` — Pinterest-style layout, 3-4 columns, hover zoom
- `portfolio-collage.astro` — asymmetric collage, organic layout, magazine aesthetic
- `portfolio-stacked-process.astro` — vertical stack: before → process → after per project
- `portfolio-grid-overlay.astro` — grid with text overlay positioned bottom-right, semi-transparent
- `portfolio-sidebar-nav.astro` — featured project large left, project list sidebar right
- `portfolio-featured-grid.astro` — one large feature (top 50%), 4 smaller grid below

**Color Variants: standard-professional (2 → 5)**

Current: 2 variants competing for 70 sites (too few)

Expand to:
- `standard-professional-blue.astro` (existing)
- `standard-professional-teal.astro` — modern, tech-forward, teal primary + slate neutral
- `standard-professional-forest-green.astro` — earthy, established, forest green + charcoal
- `standard-professional-indigo.astro` — sophisticated, indigo primary + warm gray neutral
- `standard-professional-slate.astro` — minimal, slate primary + off-white, typography-first

**Expected Outcome:** Unique variant combinations increase from 61 to 140+; duplicates drop <5%

**Effort:** 2–3 days

**Owner:** Component builder (create 5 new hero specs + 3 new color token configs)

**Definition of Done:**
- [ ] 5 new portfolio hero variants specified (structure, layout, responsive behavior)
- [ ] 3 new color token configs defined (hex values, light/dark modes, contrast verified)
- [ ] Re-run 145-site stress test; confirm duplicate rate <5%

---

### 1.2 Add Sub-Categorization to Variant Selection

**Goal:** Prevent "standard-professional" from being one-size-fits-all. Layer business attributes into pool selection.

**Current Problem:**
- Portfolio-visual category: doesn't differentiate between premium consulting firm vs. budget freelancer
- Standard-professional color: all businesses get same 2 colors regardless of positioning

**Solution:** Three-level selection logic:

```
STEP 1: Category (current) → decide_hero_category(business)
  Output: "portfolio-visual"

STEP 2: NEW - Positioning Filter → filter_by_positioning(category, business.premiumPositioning)
  If premiumPositioning && category = "portfolio-visual"
    → prefer: elegant-minimal, stacked-process, featured-grid (refined)
  Else if category = "portfolio-visual"
    → prefer: carousel, masonry, collage (energetic)

STEP 3: Seeded Selection (current) → select_variant(filtered_pool, seed)
  Output: specific variant file
```

**Changes to Decision Engine (Phase 3):**
- Enhance each `decideXxxCategory()` function with optional `positioningFilter()` call
- Update `selectVariant()` to accept filtered pool, not full pool
- Test matrix: 8 categories × 2 positioning levels = 16 decision paths to verify

**Effort:** 1 day

**Owner:** Engine builder (update TypeScript decision functions)

**Definition of Done:**
- [ ] All 8 decision functions enhanced with positioning-aware filtering
- [ ] Test: premium plumber sees premium portfolio variants; budget plumber sees energetic variants
- [ ] Test: premium HVAC sees refined color; standard HVAC sees vibrant color
- [ ] No regression in non-portfolio categories (hero-emergency, hero-trust, etc.)

---

### Tier 1 Success Criteria

✅ Variant pools expanded (portfolio 3→8, color 2→5)
✅ Sub-categorization wired into decision engine
✅ Re-test confirms <5% duplicate rate across 150+ sites
✅ Diversity score improves from unknown to 0.85+

**Tier 1 Timeline:** 3–4 days
**Blockers:** None (independent work)

---

## Tier 2: Verify Specs Quality (De-Risk)

**Goal:** Audit Phase 2–3 outputs before implementation. Catch gaps early.

### 2.1 Audit Phase 2 Component Specifications

**Components to Audit (20 variants across 4 types):**

1. **Hero Variants (5)** — Read `/app/src/components/Hero/<variant>.astro` specs
   - [ ] Emergency-mobile-minimal-accent-bar: CTA size, accent positioning, mobile layout
   - [ ] Emergency-mobile-call-bold: Headline size, urgency badge placement, sticky mobile behavior
   - [ ] Premium-established-elegant-minimal: Typography hierarchy, whitespace, serif font loading
   - [ ] Trust-dominant-stats-prominent: Review count display, star rating sizing, logo bar responsive
   - [ ] Portfolio-visual-image-left: Image aspect ratio, text area sizing, overlay handling
   
   **Audit Checklist:**
   - [ ] Astro component structure (props defined, TypeScript types)
   - [ ] Responsive breakpoints specified (mobile 375px, tablet 768px, desktop)
   - [ ] Color token slots identified (primary, accent, text, background)
   - [ ] Image handling (lazy-load, srcset, aspect ratio locked)
   - [ ] Accessibility (ARIA labels, semantic HTML, focus states)

2. **Services Grid Variants (5)** — Read specs
   - [ ] grid-2col-feature-gallery: Featured service sizing, companion card layout
   - [ ] grid-3col-cards-with-testimonials: Card structure, testimonial nesting, spacing
   - [ ] grid-2col-compact: Density target, field size constraints
   - [ ] grid-3col-large-cards: Spacious padding targets, hover effects
   - [ ] grid-list-with-sidebar: Nav width, list item height, scroll behavior

   **Audit Checklist:**
   - [ ] Grid definitions (CSS Grid or Flexbox, column sizing, gap)
   - [ ] Card component structure (contained or global styles?)
   - [ ] Testimonial integration (is it a nested component or inline?)
   - [ ] Mobile collapse behavior (at what breakpoint does grid become single-column?)

3. **Testimonial Variants (5)** — Read specs
   - [ ] testimonial-wall-grid: Grid sizing, card width, hover animation
   - [ ] testimonial-carousel-featured: Featured size, slide width, nav buttons
   - [ ] testimonial-refined-card: Border/accent position, padding, line-height
   - [ ] testimonial-bold-quote: Quote size, attribution styling, star rating color
   - [ ] testimonial-contextual-inline: Size constraint, placement context (next to service?)

   **Audit Checklist:**
   - [ ] Star rating display (size, color, filled vs. empty)
   - [ ] Author photo (size, border-radius, placeholder if missing)
   - [ ] Author name & title styling (font size, weight, color)
   - [ ] Quote text styling (line height, max-width, ellipsis handling)

4. **Color Token Configs (5)** — Read design token definitions
   - [ ] emergency-red-orange: Primary, accent, dark mode variants, badge colors
   - [ ] premium-deep-refined: Semantic colors (success, warning, error), contrast ratios
   - [ ] trust-blue-accent: Light/dark mode variants, link colors, hover states
   - [ ] visual-vibrant-green: Saturation levels, border colors, shadow depth
   - [ ] standard-professional-blue: Neutral palette (50%, 100%, 200%, ... 900%), contrast audit

   **Audit Checklist:**
   - [ ] WCAG AA contrast ratios verified for all text-on-color combinations
   - [ ] Dark mode variants specified (not just color invert)
   - [ ] Semantic color mapping (primary, success, warning, error, info)
   - [ ] Usage guide (when to use each token, component examples)

**Effort:** 1 day (thorough reading + spot-checks)

**Owner:** Code reviewer (read specs, verify production readiness)

**Deliverable:** Audit report with PASS/FAIL per component + list of gaps

---

### 2.2 Verify Phase 3 Decision Engine Logic

**Functions to Verify (16 total):**

**Decision Functions (8):**
1. `decideHeroCategory(business)` → hero category name
2. `decideColorCategory(business)` → color scheme name
3. `decideSpacingCategory(business)` → compact | comfortable | spacious
4. `decideAnimationCategory(business)` → conservative | standard | playful
5. `decideFormStrategy(business)` → contact | quote | booking
6. `decideTestimonialCategory(business)` → wall-grid | carousel | refined | inline
7. `decideServicesCategory(business)` → grid-2col | grid-3col | list-sidebar
8. `decideDarkModeStrategy(business)` → true | false

**Verification Matrix:**

| Business Profile | Hero Expected | Color Expected | Spacing Expected | Notes |
|------------------|---------------|----------------|------------------|-------|
| Emergency plumber (5yr, high reviews) | emergency-mobile | trust-blue | compact | Risk reversal messaging |
| Premium consultant (10yr, portfolio) | portfolio-visual | premium-deep | spacious | Editorial restraint |
| Solopreneur landscaper (2yr, budget) | trust-dominant | standard-prof | comfortable | Social proof focus |
| HVAC multi-location (20yr, emergency) | emergency-mobile | emergency-red | compact | Authority + urgency |
| Creative agency (8yr, portfolio, premium) | portfolio-carousel | premium-deep | spacious | Process-focused |

**Test Scenarios (16 profiles across 8 conditional features):**
- [ ] `emergencyFocused=true` → hero-emergency triggered
- [ ] `portfolioHeavy=true` → hero-portfolio + portfolioCarousel variant
- [ ] `seasonal=true` → spacing increases (seasonal peak visibility)
- [ ] `projectBased=true` → services-grid becomes list-sidebar (project-centric view)
- [ ] `premiumPositioning=true` → color-premium + spacious spacing + refined testimonials
- [ ] `multiLocation=true` → services-grid highlights geographic area selection
- [ ] `soloOperator=true` → hero-trust-dominant (trust > scale) + compact spacing
- [ ] `healthSafety=true` → guarantees section appears + compliance badges visible

**Audit Checklist:**
- [ ] All 8 functions have complete decision logic (if/else branches)
- [ ] No missing edge cases (e.g., portfolio-heavy + emergency-focused = what?)
- [ ] Default fallbacks defined (if no conditional features match)
- [ ] Seed-based variant selection in place (same business ID always gets same variant)

**Effort:** 1 day (logic review + test scenario walkthrough)

**Owner:** Engine reviewer (verify decision tree completeness)

**Deliverable:** Logic audit report + test results matrix

---

### Tier 2 Success Criteria

✅ Phase 2 specs audited; gaps documented (if any)
✅ Phase 3 decision engine logic verified across 16 test profiles
✅ PASS/FAIL on component production readiness (go/no-go for Phase 2 implementation)
✅ Go/no-go on decision engine completeness (go/no-go for Phase 3 wiring)

**Tier 2 Timeline:** 2 days
**Blockers:** Tier 1 should complete first (component expansion needs auditing too)

---

## Tier 3: Performance & Accessibility (Polish)

**Goal:** Achieve 95% WCAG AA compliance + Lighthouse 85+

### 3.1 Fix WCAG AA Compliance

**Current:** 86% (target: 95%)

**Issues Identified:**
- Visual-vibrant palette has insufficient contrast (teal on light bg, coral on dark bg)
- Missing `prefers-reduced-motion` support (animations play regardless of OS setting)
- Dark mode contrast not verified across all variants

**Fixes:**

1. **Color Contrast Adjustment** (1 day)
   - Darken visual-vibrant teal: #1AB5A3 → #0a7fbe (WCAG AA on all backgrounds)
   - Darken visual-vibrant coral: #FF6B6B → #d63046
   - Verify: Run axe-core on all 145+ variants
   - Target: 100% WCAG AA compliance on text-on-color

2. **Prefers-Reduced-Motion Support** (1 day)
   - Add to Astro base layout: `@media (prefers-reduced-motion: reduce)`
   - Disable all CSS animations (fade, slide, scale, etc.)
   - Disable JS animations (carousel autoplay, scroll-triggered effects)
   - Test: Set OS "Reduce motion" setting, verify zero animations

3. **Dark Mode Contrast Audit** (1 day)
   - Test each color variant in dark mode
   - Verify text-on-background contrast ≥ 4.5:1 (WCAG AA)
   - Adjust dark mode color inversions if needed

**Effort:** 2 days

**Owner:** A11y specialist (color adjustments + axe-core audit)

**Definition of Done:**
- [ ] axe-core audit: 0 accessibility violations on all 145+ variants
- [ ] WCAG AA compliance: 100% (up from 86%)
- [ ] prefers-reduced-motion: verified across all animations
- [ ] Dark mode contrast: ≥4.5:1 on all text-on-bg

---

### 3.2 Optimize Lighthouse Performance

**Current:** Unknown (Phase 4 didn't measure; we know it's suboptimal)

**Targets:**
- FCP (First Contentful Paint): <1000ms
- CLS (Cumulative Layout Shift): <0.05
- Lighthouse Overall: ≥85

**Optimizations:**

1. **Image Optimization** (1 day)
   - Convert all JPG/PNG to AVIF (primary) + WebP (fallback)
   - Lazy-load portfolio grids + carousels (IntersectionObserver)
   - Add placeholder sizing: aspect-ratio CSS to prevent CLS on image load
   - Responsive images: srcset for mobile/tablet/desktop

2. **Font & CSS Optimization** (1 day)
   - System font stack for body (fallback to -apple-system, etc.)
   - Preload critical fonts (serif headline fonts if used)
   - Defer dark mode CSS (load after critical path)
   - Minify global CSS, remove unused Tailwind classes

3. **JavaScript Optimization** (1 day)
   - Defer non-critical JS (analytics, third-party scripts)
   - Code-split carousel/accordion JS (load only if component visible)
   - Remove polyfills if browser support allows

**Effort:** 2–3 days

**Owner:** Performance engineer (image conversion, bundle analysis)

**Definition of Done:**
- [ ] Lighthouse score ≥85 on desktop
- [ ] FCP <1000ms on 4G throttled
- [ ] CLS <0.05 (no layout shifts)
- [ ] AVIF/WebP images deployed
- [ ] preload/defer/async optimized

---

### Tier 3 Success Criteria

✅ WCAG AA: 100% compliance (0 violations on all variants)
✅ Lighthouse: ≥85 score
✅ Performance: FCP <1000ms, CLS <0.05
✅ A11y: prefers-reduced-motion supported

**Tier 3 Timeline:** 4–5 days
**Blockers:** None (can run in parallel with Tier 1–2, but polish-level priority)

---

## Sprint Timeline

### Week 1: Tiers 1–2a
| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon–Wed | Expand variant pools (portfolio 3→8, color 2→5) | Component Builder | ⏳ |
| Thu–Fri | Add sub-categorization to decision engine | Engine Builder | ⏳ |
| Fri (parallel) | Audit Phase 2 component specs | Code Reviewer | ⏳ |

### Week 2: Tiers 2b–3
| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mon–Tue | Verify Phase 3 decision engine logic | Engine Reviewer | ⏳ |
| Tue–Thu | Fix WCAG AA compliance + prefers-reduced-motion | A11y Specialist | ⏳ |
| Wed–Fri | Optimize Lighthouse performance | Performance Engineer | ⏳ |

**Total Duration:** ~9 days (realistic with parallel work: 7–8 days wall-clock)

---

## Success Metrics (End of Sprint)

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Variant Duplication Rate | 26.21% | <5% | ⏳ |
| Unique Variant Combos | 61 | 140+ | ⏳ |
| WCAG AA Compliance | 86% | 100% | ⏳ |
| Lighthouse Score | Unknown | ≥85 | ⏳ |
| FCP (First Contentful Paint) | Unknown | <1000ms | ⏳ |
| CLS (Cumulative Layout Shift) | Unknown | <0.05 | ⏳ |
| Decision Engine Test Pass Rate | Unknown | 100% (16/16 profiles) | ⏳ |
| Component Specs QA | Unknown | PASS (all 20 variants) | ⏳ |

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Variant expansion breaks responsive layout | HIGH | Audit responsive breakpoints during Tier 2.1 |
| Sub-categorization logic too complex | MEDIUM | Keep filtering logic simple (2–3 if/else branches); test thoroughly |
| Performance optimization misses targets | MEDIUM | Measure Lighthouse before/after each optimization; iterate |
| WCAG AA color changes affect brand identity | MEDIUM | Run by design team; document rationale (accessibility > brand preference) |

---

## Go/No-Go Decisions

**After Tier 1:** 
- ✅ GO if variant pools expanded + duplicate rate <5%
- ❌ NO-GO if complexity balloons or homogenization persists

**After Tier 2:**
- ✅ GO if Phase 2–3 specs audit passes (production-ready)
- ❌ NO-GO if critical gaps found; defer implementation until fixed

**After Tier 3:**
- ✅ GO if all metrics met (Lighthouse 85+, WCAG AA 100%)
- ⚠️ PARTIAL-GO if minor gaps remain; document exceptions

---

## Deliverables

1. **Expanded variant pool specs** (8 portfolio heroes, 5 color tokens)
2. **Sub-categorization logic** (TypeScript decision engine updates)
3. **Component audit report** (PASS/FAIL on 20 variants + gaps)
4. **Engine verification report** (logic completeness + test matrix)
5. **A11y audit results** (axe-core 0 violations, WCAG AA 100%)
6. **Performance audit results** (Lighthouse ≥85, FCP <1000ms, CLS <0.05)
7. **Sprint retrospective** (what worked, what didn't, next sprint focus)

---

## Related Documents

- `UNIFIED_DESIGN_SYSTEM_ARCHITECTURE.md` — System blueprint
- `DESIGN_FEATURE_MAPPING.md` — Feature IF/THEN rules
- `BADGE_GUARANTEE_SYSTEM.md` — Advanced badge features
- Workflow Output: `/private/tmp/claude-501/.../tasks/wpotrwutz.output` — Phase 1–4 detailed results

---

**Next Step:** Confirm priorities (Tier 1→2→3 sequential or parallel). Then assign owners and kick off Week 1.
