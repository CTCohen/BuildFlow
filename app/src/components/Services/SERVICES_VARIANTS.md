---
title: Services_Variants
purpose: Documentation for SERVICES_VARIANTS.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

# Services Grid Variants

Five layout variants for the Services section, each optimized for different content volumes, business types, and visual priorities.

## Quick Reference

| Variant | Grid Layout | Features | Best For |
|---------|-------------|----------|----------|
| `grid-2col-feature-gallery` | 2:1 featured + compact | Gallery visual, featured service | 5-8 services, visual business |
| `grid-3col-cards-with-testimonials` | 3-column | Testimonial per card | Any count, testimonial-heavy |
| `grid-2col-compact` | Dense 2-column | Minimal, inline icons | 10+ services, quick scan |
| `grid-3col-large-cards` | Premium 3-column | Gradient headers, tall cards | 3-6 services, premium positioning |
| `grid-list-with-sidebar` | Vertical + sidebar nav | Interactive, deep content | 4-8 services, detailed descriptions |

---

## 1. grid-2col-feature-gallery.astro

**Gallery-style layout with featured service prominently displayed**

### Structure
```
┌─────────────────────────────────┬──────────────────┐
│                                 │  Service A       │
│   Featured Service (Large)      │  Service B       │
│   - Aspect video placeholder    │  Service C       │
│   - Full description            │  Service D       │
│   - Rich typography             │  Service E       │
│                                 │                  │
└─────────────────────────────────┴──────────────────┘
```

### Layout Specs
- **Desktop (lg):** 2:1 featured (col-span-2) + compact cards (1 col)
- **Tablet (md):** Stacked horizontally
- **Mobile:** Single column, featured full-width
- **Gap:** 8px (md:8px lg:8px)
- **Card heights:** Featured auto; compact equal

### Features
- **Gallery Image Placeholder:** Gradient background with SVG icon
- **Icon + Title + Blurb** in both featured and compact cards
- **Hover Effects:** Shadow, icon scale (featured)
- **Responsive Text:** Heading scales with viewport
- **Reveal Animation:** Staggered 60ms delay per item

### Testimonials
- **Not included** (design focused on visual hierarchy)

### Use Cases
- Photography/contracting services (HVAC, roofing, landscaping)
- 5-8 services ideal
- Premium first impression desired
- Visual portfolio emphasis

### CSS Classes & Styling
- Brand-colored icons (12% opacity background)
- `card` class with reveal animation
- Gradient backgrounds on featured image area
- Hover states with shadow transitions

---

## 2. grid-3col-cards-with-testimonials.astro

**Three-column card grid with testimonials paired to each service**

### Structure
```
┌──────────────────┬──────────────────┬──────────────────┐
│ Service A        │ Service B        │ Service C        │
│ Blurb            │ Blurb            │ Blurb            │
│ ─────────────    │ ─────────────    │ ─────────────    │
│ ★★★★★           │ ★★★★★           │ ★★★★★           │
│ "Quote..."       │ "Quote..."       │ "Quote..."       │
│ — Author, Loc    │ — Author, Loc    │ — Author, Loc    │
└──────────────────┴──────────────────┴──────────────────┘
```

### Layout Specs
- **Desktop (lg):** 3 columns
- **Tablet (sm-md):** 2 columns
- **Mobile:** 1 column
- **Gap:** 6px (24px between cards)
- **Card height:** Dynamic, flexbox container
- **Min-height:** Full card (service + testimonial)

### Features
- **Service Section:** Icon, name, blurb (clickable)
- **Divider:** Thin line separating service from testimonial
- **Testimonial Section:** Stars (5-star fixed), quote, attribution
- **Icon Styling:** 11x11px, brand colored
- **Quote Size:** Small (xs), italic, readable in constrained space
- **CTA Link:** "View details →" at bottom

### Testimonials
- **Cycling:** Reviews cycle through services if fewer reviews than services
- **Layout:** Below divider, isolated
- **Star Rating:** Brand-accent color, 13x13px
- **Attribution:** Author + optional location, small text

### Responsive Behavior
- **lg (1024px+):** 3 columns
- **sm/md (640-1024px):** 2 columns
- **xs (<640px):** 1 column, full-width cards
- **Flexbox:** Cards stretch to equal height within row
- **Text Clipping:** Service blurb 2-line max on mobile

### Use Cases
- Any service business
- 4-12 services (testimonial-heavy pitch)
- High social proof priority
- Review database available

### CSS Classes & Styling
- `reveal` class with 60ms stagger
- Brand accent color for stars
- Semi-transparent text for soft colors
- Hover shadow lift

---

## 3. grid-2col-compact.astro

**Dense two-column layout for extensive service lists**

### Structure
```
┌────────────────────────┬────────────────────────┐
│ ▶ Service A            │ ▶ Service B            │
│   Brief description    │   Brief description    │
├────────────────────────┼────────────────────────┤
│ ▶ Service C            │ ▶ Service D            │
│   Brief description    │   Brief description    │
├────────────────────────┼────────────────────────┤
│ ▶ Service E            │ ▶ Service F            │
│   Brief description    │   Brief description    │
└────────────────────────┴────────────────────────┘
```

### Layout Specs
- **Desktop (lg):** 2 columns (strict)
- **Tablet (sm-md):** 2 columns
- **Mobile:** 1 column
- **Gap:** 3px (12px, compact)
- **Card padding:** p-5 (20px)
- **Card height:** Auto (compact, minimal)

### Features
- **Inline Layout:** Icon + name/blurb horizontally
- **Icon:** 10x10px, rounded-lg, left-aligned with 3px gap
- **Content:** Flex column, squeezed (name 1-line, blurb 2-line)
- **Arrow Indicator:** Hidden by default, appears on hover
- **Hover Effects:** 
  - Card shadow increases (md → lg)
  - Arrow fades in/out (opacity transition)
  - All transitions in 200ms

### Testimonials
- **Not included** (space optimized)

### Responsive Behavior
- **lg (1024px+):** 2 columns (grid-cols-2)
- **sm/md (640-1024px):** 2 columns (grid-cols-2)
- **xs (<640px):** 1 column (grid-cols-1)
- **Line Clamping:** Service name 1-line, blurb 2-line
- **Icon:** Never shrinks (flex-shrink-0)

### Use Cases
- Plumbers, electricians, HVAC (many quick services)
- 10-20 services
- Quick-scan, minimal cognitive load
- High information density

### CSS Classes & Styling
- `card` with minimal padding
- Brand color for arrow and name hover
- Smooth opacity transitions on arrow
- Scale transform on icon hover

---

## 4. grid-3col-large-cards.astro

**Spacious, premium three-column layout for curated service lists**

### Structure
```
┌──────────────────────────────────────────┐
│                                          │
│   [Gradient Header]                     │
│   Icon in center (white/brand)          │
│                                          │
│   Service Title (2xl font)               │
│   Service blurb (lg)                     │
│   Optional description (sm)              │
│                                          │
│   Learn more →                           │
│                                          │
│                                          │
│ ═══════════════════════════════════     │
│ [Accent bar, hover: thicker]            │
└──────────────────────────────────────────┘
```

### Layout Specs
- **Desktop (lg):** 3 columns
- **Tablet (sm-md):** 2 columns
- **Mobile:** 1 column
- **Gap:** 8px (32px)
- **Card height:** Dynamic (content-driven, tall)
- **Header height:** 32px (h-32)

### Features
- **Gradient Header:** Blend of brand + brand-accent
- **Icon Area:** Centered 16x16px icon in white/translucent box
- **Gradient Background:** Subtle opacity animation on hover
- **Typography:**
  - Title: 2xl, bold
  - Blurb: Text + brand-ink
  - Description: Optional sm text
- **CTA:** "Learn more" + arrow, brand color
- **Bottom Accent Bar:** Gradient, hover expands (h-1 → h-2)
- **Reveal Animation:** 60ms stagger

### Testimonials
- **Not included** (card space reserved for descriptions)

### Hover Effects
- Shadow elevates (shadow-lg → shadow-xl)
- Icon scale up within box
- Gradient opacity increases
- Accent bar grows taller
- Smooth transitions (200-300ms)

### Use Cases
- Premium, boutique services (specialized HVAC, custom painting)
- 3-6 high-value services
- Enterprise/upscale positioning
- Detailed service descriptions desired
- Strong visual branding priority

### CSS Classes & Styling
- Gradient backgrounds (brand → brand-accent)
- White/translucent icon box
- `card` class with overflow-hidden
- Hover shadow elevation
- Accent gradient bar (bg-gradient-to-r)

---

## 5. grid-list-with-sidebar.astro

**Vertical list with interactive sidebar navigation and testimonials**

### Structure
```
┌──────────────────┬─────────────────────────────────────┐
│ Service A (nav)  │ Service A (detail)                  │
│ Service B (nav)  │ Icon | Title | Blurb                │
│ Service C (nav)  │ Full Description                    │
│ Service D (nav)  │ ─────────────────────────────────    │
│ Service E (nav)  │ ★★★★★ "Quote..." — Author, Loc     │
│                  │ [Get a quote button]                │
│ (Sticky, top:24) │                                     │
│                  │ [Next Service Area Below]           │
│                  │ Service B (detail) ...              │
│                  │                                     │
└──────────────────┴─────────────────────────────────────┘
```

### Layout Specs
- **Desktop (md+):** 4-column grid (1 col nav + 3 col content)
- **Tablet (md-1):** Single column, nav above content
- **Mobile:** Single column, nav collapses
- **Sidebar Position:** Sticky (top: 6rem / 24px)
- **Gap:** 8px (32px between nav and content)
- **Content width:** 3 columns (md:col-span-3)

### Features
- **Sidebar Navigation:**
  - Service name links
  - Rounded pills (rounded-lg)
  - Active state: brand background + brand-ink text
  - Inactive state: soft text color
  - Hover: surface-2 background
  - Space-y-2 (gap between items)

- **Detail Cards:**
  - Flex header (icon + content)
  - Icon: 14x14px, rounded-xl, brand colored
  - Title: 2xl, bold
  - Blurb: lg text, soft color
  - Divider: 1px border after content
  - Testimonial area (see below)
  - CTA button: Brand background, full pill

- **Responsive Typography:**
  - Title: 2xl (desktop), xl (tablet), lg (mobile)
  - Blurb: lg (desktop), base (mobile)
  - Nav: sm font, smaller on mobile

### Testimonials
- **Layout:** Below divider (pt-8, border-t)
- **Label:** "Customer review" / "Cliente verificado" (uppercase sm)
- **Stars:** 5-star fixed, brand-accent
- **Quote:** lg, italic
- **Attribution:** sm text, author + location
- **Space:** Generous (mt-8 pt-8)

### Responsive Behavior
- **md (768px+):** 4-col grid, sticky sidebar
- **sm-md (640-768px):** 2-col grid (nav compressed), sidebar not sticky
- **xs (<640px):** Single column, nav wraps, content full-width

### Interactive Behavior
- **JavaScript Enabled:**
  - Click nav item: smooth scroll to service
  - Intersection observer: highlights nav item as user scrolls
  - Active state updates dynamically
  - Scroll target: scroll-mt-32 (128px offset for header)

- **Fallback (no JS):**
  - Links work via anchor (#service-slug)
  - Styles still apply correctly
  - No smooth scroll

### Use Cases
- Detailed service marketing (HVAC with troubleshooting, plumbing with process)
- 4-8 services (deep content)
- Interactive content priority
- Full desktop experience (sticky nav)
- High conversion funnel (detailed CTAs)

### CSS Classes & Styling
- `service-nav-link` class with data-service-index
- `service-card` class for JS observation
- Sticky positioning with top offset
- Smooth color transitions
- Box shadow on active nav items
- Brand-colored icons and buttons

### JavaScript (Inline)
- DOM query selectors for nav + cards
- Event listeners on nav links
- Intersection observer (0.3 threshold)
- Manual updateActive() function
- TypeScript hints in script tag

---

## Implementation Notes

### Responsive Breakpoints
- **xs:** < 640px (mobile)
- **sm:** 640-768px (small tablet)
- **md:** 768-1024px (tablet)
- **lg:** 1024px+ (desktop)

### Styling Patterns
All variants use:
- `--brand` (primary color)
- `--brand-accent` (secondary/highlight)
- `--brand-ink` (text on brand)
- `--color-ink` (default text)
- `--color-ink-soft` (secondary text)
- `--color-surface-2` (hover backgrounds)
- `--color-line` (borders)

### Animation
All variants include:
- `reveal` keyframe animation (opacity + translateY)
- Staggered delays (40-60ms per item)
- Smooth transitions on hover (200-300ms)
- Optional rotate/scale on icons

### Accessibility
- Proper heading hierarchy (h2 for section, h3/h4 for items)
- `aria-hidden="true"` on decorative SVGs
- `aria-label` on image placeholders (feature gallery)
- Semantic `<figure>` + `<figcaption>` for testimonials
- Link focus styles inherited from base theme
- Color contrast meets WCAG AA on all text

### Performance
- No external images (SVG only)
- CSS variables for theming
- Single animation class (no duplicate keyframes)
- Minimal JavaScript (sidebar only, optional)
- Scoped styles per component

---

## Configuration

In `client.json` or brand config, set:
```json
{
  "brand": {
    "servicesLayout": "grid-3col-cards-with-testimonials"
  }
}
```

Available keys:
- `grid-2col-feature-gallery`
- `grid-3col-cards-with-testimonials`
- `grid-2col-compact`
- `grid-3col-large-cards`
- `grid-list-with-sidebar`

Fallback: `grid-3col` (legacy variant)

---

## Troubleshooting

| Issue | Variant | Fix |
|-------|---------|-----|
| Testimonials overlap card | compact | Not included by design |
| Sidebar not sticky | sidebar | Check md breakpoint (768px+) |
| Icons misaligned | any | Ensure `flex-shrink-0` class |
| Reveal animation jerky | any | Check GPU acceleration in browser |
| Text overflow cards | mobile | Line clamping (line-clamp-2) applied |

---

## Version Notes

- **Created:** 2026-09-09
- **Astro Compatibility:** 4.x+
- **Tailwind:** 3.x+
- **Browser Support:** All modern browsers (ES2020+)
