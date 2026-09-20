---
title: Variant Pools
purpose: Documentation for VARIANT-POOLS.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

> **Updated 2026-09-18 (spec reconciliation):** these variant pools are Design Agent choices keyed by vertical and profile, not customer-facing options. The customer chooses one of 10 styling profiles (`app/src/data/styleProfiles.json`); layout structure stays locked per the spec. Micro uses a reduced component set; Mid-Market variants are deferred.


# Variant Pools — Logo-First Design System

**Purpose:** 8+ variants per category ensure diverse, non-homogeneous site output.

**Phase 1 target:** 3 hero variants (MVP)
**Phase 2 target:** 8 hero variants (scale to 500 businesses with <5% duplication)

---

## Hero Variants (Primary Visual Focus)

### Pool A: Bold Energy (3 variants)

**1. Hero-Emergency-Bold**
- Full-bleed hero image
- Bold red accent color (danger/urgency)
- Large white typography
- CTA button: Bright red with white text
- Best for: HVAC, emergency services, urgent repair
- Mood: Bold, energetic, action-oriented

**2. Hero-Reliability-Bold**
- Split hero (image left, text right)
- Dark blue accent (trust/stability)
- Strong sans-serif typography
- CTA: Dark button with blue accent
- Best for: Plumbing, structural, reliability-focused
- Mood: Solid, dependable, professional

**3. Hero-Power-Bold**
- Full-bleed dark background
- Electric yellow/orange accent
- Minimal text (let image speak)
- CTA: High-contrast button
- Best for: Electrical, power tools, high-energy services
- Mood: Powerful, technical, modern

---

### Pool B: Refined Elegance (3 variants)

**4. Hero-Comfort-Refined**
- Minimal text approach
- Soft color palette (warm neutrals)
- Serif typography (elegant)
- CTA: Subtle, refined button
- Best for: HVAC (comfort), luxury services
- Mood: Comfortable, elegant, sophisticated

**5. Hero-Nature-Refined**
- Image-focused hero
- Earth-tone accent (green/brown)
- Minimal overlays
- CTA: Organic button style
- Best for: Landscaping, outdoor services, garden
- Mood: Natural, peaceful, professional

**6. Hero-Expertise-Refined**
- Centered content
- Professional color scheme (navy/gray)
- Small, precise typography
- CTA: Professional button
- Best for: Consulting, specialized trades, expertise-driven
- Mood: Expert, trustworthy, refined

---

### Pool C: Vibrant Energy (2 variants)

**7. Hero-Fresh-Playful**
- Gradient background
- Bright, playful colors
- Rounded typography
- CTA: Playful, rounded button
- Best for: Cleaning, junk removal, fresh services
- Mood: Energetic, fun, approachable

**8. Hero-Solution-Playful**
- Animated accent elements (CSS animation)
- Bright colors, positive tone
- Friendly typography
- CTA: Warm, welcoming button
- Best for: Problem-solving services (pest control, repairs)
- Mood: Solution-focused, positive, friendly

---

## Services Section Variants (How We Do It)

### Pool A: Grid Layout (2 variants)

**1. Services-Grid-3-Column**
- 3 services per row
- Icon + title + description
- Hover: Slight shadow/color shift
- Best for: 6-9 services
- Density: Compact

**2. Services-Grid-2-Column**
- 2 services per row
- Larger cards, more breathing room
- Icon + title + description + details
- Best for: 4-6 key services
- Density: Spacious

---

### Pool B: Alternate Layouts (2 variants)

**3. Services-Tabs**
- Tabbed interface (click to switch)
- One service shown at a time
- Large description, image support
- Best for: 5-8 complex services
- Interaction: Engagement-focused

**4. Services-Accordion**
- Expandable/collapsible cards
- Full description hidden until clicked
- CTA button per service
- Best for: 4-6 services with details
- Interaction: Progressive disclosure

---

## Testimonials Section Variants

### Pool A: Quote-Focused (2 variants)

**1. Testimonials-Large-Quote**
- Large quote text (primary focus)
- Customer name + business below
- Optional: Customer photo
- Layout: Full-width centered
- Mood: Quote is the hero

**2. Testimonials-Side-by-Side**
- Photo left, quote right
- Side-by-side grid (2-3 columns)
- Name + title below
- Layout: Compact, scannable
- Mood: Personal connection

---

### Pool B: Context-Rich (2 variants)

**3. Testimonials-Before-After**
- Customer situation (before)
- Our solution
- Result/testimonial (after)
- Photo + name
- Layout: Narrative-focused
- Mood: Proof of impact

**4. Testimonials-Star-Rating**
- Star rating prominent (5 stars)
- Quote below
- Name + business + date
- Photo optional
- Layout: Trust-signal focused
- Mood: Social proof, ratings

---

## Color Scheme Variants

### Scheme A: Warm & Welcoming
- Primary: Orange/Red (#FF6B35)
- Secondary: Warm Gray (#F5E6D3)
- Accent: Deep brown (#5A3A2A)
- Text: Dark charcoal (#2C2C2C)
- Use for: Service-oriented, approachable businesses

### Scheme B: Cool & Professional
- Primary: Navy Blue (#1E3A5F)
- Secondary: Light gray (#E8EEF5)
- Accent: Steel blue (#4A90A4)
- Text: Dark blue-gray (#3A4A5C)
- Use for: Professional, authority-focused businesses

### Scheme C: Vibrant & Modern
- Primary: Bright teal (#00D9FF)
- Secondary: Light cream (#FFF8F0)
- Accent: Vibrant orange (#FF6F00)
- Text: Dark charcoal (#1A1A1A)
- Use for: Modern, energetic, tech-forward businesses

### Scheme D: Earthy & Trustworthy
- Primary: Forest green (#2D5016)
- Secondary: Soft sage (#E8F0E3)
- Accent: Earth brown (#8B6F47)
- Text: Dark green-gray (#3A4A3C)
- Use for: Outdoor, nature, trustworthy businesses

---

## Variant Selection Algorithm

```
Input: Logo mood (bold, refined, playful, professional, vibrant)
       Business type (HVAC, plumbing, electrical, cleaning, etc.)
       
Step 1: Map mood → Hero pool
  bold → Pool A (emergency, reliability, power)
  refined → Pool B (comfort, nature, expertise)
  playful → Pool C (fresh, solution)
  
Step 2: Map business type → Specific variant within pool
  HVAC bold → Hero-Emergency-Bold (if urgent positioning)
  HVAC refined → Hero-Comfort-Refined (if comfort positioning)
  
Step 3: Seed selection via business name hash
  hash(businessName) % numVariants = selected variant
  Ensures: Same business always gets same variant
           Different businesses likely get different variants
  
Step 4: Select color scheme
  Logo primary color → match to nearest color scheme
  Validate WCAG AA contrast
  
Step 5: Select services layout
  If 4-6 services → use compact grid or accordion
  If 6-9 services → use 3-column grid
  
Step 6: Select testimonials layout
  If 1-2 testimonials → use large quote
  If 3+ testimonials → use side-by-side
  
Output: Complete variant selection
  Hero: Hero-Emergency-Bold
  Services: Services-Grid-3-Column
  Testimonials: Testimonials-Side-by-Side
  Colors: Scheme A (warm)
```

---

## Phase 1 Deliverables

### Must-Have (MVP)
- [ ] 3 hero variants designed + coded
- [ ] 2 services layouts designed + coded
- [ ] 2 testimonials layouts designed + coded
- [ ] 4 color schemes defined
- [ ] Selection algorithm implemented
- [ ] Test on 3 sample businesses

### Nice-to-Have (Phase 2)
- [ ] Expand to 8 hero variants
- [ ] Expand to 5 services variants
- [ ] Add animation/hover states
- [ ] Logo color extraction (Claude Vision)
- [ ] A/B test variants (which convert better)

---

## Implementation Status

**Planned for this week:**
1. Design 3 hero variants (Figma or design tool)
2. Code variants in Astro components
3. Implement selection algorithm
4. Test on 3 sample businesses
5. Validate WCAG AA contrast

**Estimated effort:** 4-6 hours design + code

---

## Success Criteria

✓ 3 hero variants live
✓ Services & testimonials variants working
✓ <10% site duplication on test cohort
✓ Color schemes WCAG AA compliant
✓ Selection algorithm deterministic + diverse
✓ Customer satisfaction with variant selection (NPS ≥70)

---

## Next: Component Implementation

Create Astro components for each variant:
- `components/heroes/HeroEmergencyBold.astro`
- `components/heroes/HeroRefinedComfort.astro`
- `components/services/ServicesGrid.astro`
- `components/testimonials/TestimonialsQuote.astro`

Then wire them together with selection algorithm.
