# BuildFlow: Complete Design System Inventory

## Overview

Every frontend design category mapped to what we have defined, what's in the system, and what needs rules.

---

## 1. LAYOUT & TEMPLATES

### Category Overview
Page-level structure, component grids, spacing, responsive behavior.

**What We've Defined:**
- ✅ Hero template variants (minimal-cta, image-showcase, elegant-minimal, trust-dominant, geographic-map, personal-story, time-sensitive, standard)
- ✅ Services grid layouts (2col-feature-gallery, 3col-cards-with-testimonials, 2col-compact, 3col-large, 2col-highlight-first, 3col-standard)
- ✅ Testimonials layouts (wall-grid, carousel-featured, contextual-near-services, urgent-guarantee, grid-3col)
- ✅ Mobile stack order rules (cta-first, gallery-first, reviews-prominent, standard)

**What's Missing:**
- [ ] Contact form layout variants
- [ ] Footer layout variants
- [ ] Navigation layout (sticky vs static, sidebar vs top)
- [ ] Breadcrumb positioning rules
- [ ] Social proof widget layouts
- [ ] FAQ accordion vs expanded variants
- [ ] Gallery/carousel layout types
- [ ] Pricing/service card configurations
- [ ] Team section layouts
- [ ] Blog/content listing templates

---

## 2. COLOR SYSTEM

### Category Overview
Primary colors, accent colors, semantic colors, backgrounds, text colors, dark mode.

**What We've Defined:**
- ✅ Primary brand color by vertical (plumbing blue, HVAC blue, roofing purple, landscaping emerald, electrical sky-blue, cleaning teal)
- ✅ Accent color assignments (brand-accent, red, orange, yellow, green, blue, purple)
- ✅ Color modifiers (darker for premium, more saturated for established)
- ✅ Dark mode palette strategies (sophisticated, full, high-contrast)
- ✅ Dark mode colors (background, surface, text, accent, border, shadow)
- ✅ Badge color schemes (gold, silver, copper, holographic)

**What's Missing:**
- [ ] Background color layers (primary, secondary, tertiary)
- [ ] Text color variants (primary, secondary, tertiary, disabled)
- [ ] Semantic colors (success green, error red, warning yellow, info blue)
- [ ] Link colors (default, visited, hover)
- [ ] Input field colors (focused, error, disabled, filled)
- [ ] Border colors (default, subtle, strong)
- [ ] Hover state color shifts
- [ ] Skeleton/loading colors
- [ ] Overlay colors (modals, dropdowns)
- [ ] Icon colors by context
- [ ] Gradient color pairs
- [ ] Badge/tag background colors (by type, by status)
- [ ] Chart/data visualization colors
- [ ] Product-specific colors (if multi-product)

---

## 3. TYPOGRAPHY

### Category Overview
Font families, sizes, weights, line heights, letter spacing, text transforms.

**What We've Defined:**
- ✅ Heading font families (serif-elegant, sans-modern, sans-bold, sans-humanist, sans-geometric)
- ✅ Heading size scales (elegant 2.2rem/1.8rem/1.4rem, bold 3.2rem/2.4rem/1.8rem, standard, personal)
- ✅ Body font selection (readable-serif, modern-sans, mobile-optimized, standard-sans)
- ✅ Font weight hints (serif 400, sans 500-600, bold 700)

**What's Missing:**
- [ ] Font sizes for all heading levels (h1-h6)
- [ ] Font sizes for body copy (regular, large, small)
- [ ] Font sizes for labels, captions, overlines
- [ ] Line heights for each font size
- [ ] Letter spacing rules
- [ ] Text transform variants (uppercase, lowercase, capitalize)
- [ ] Font smoothing settings
- [ ] OpenType feature flags
- [ ] Paragraph line height vs heading line height
- [ ] Link text decoration (underline, none, hover-only)
- [ ] Quote styling (font-style, color, sizing)
- [ ] Code/monospace font family and sizing
- [ ] Font fallback stacks
- [ ] Responsive font sizing (base + breakpoints)
- [ ] Emphasis/strong styling
- [ ] Blockquote styling
- [ ] Text truncation rules (single line vs multi-line)

---

## 4. SPACING & RHYTHM

### Category Overview
Padding, margins, gaps, gutters, aspect ratios.

**What We've Defined:**
- ✅ Layout density (spacious 7rem/3rem, comfortable 5.5rem/2rem, compact 4rem/1.5rem)
- ✅ Component gaps (spacious 3rem, comfortable 2rem, compact 1.5rem)
- ✅ Card padding (spacious 2.5rem, comfortable 2rem, compact 1.5rem)

**What's Missing:**
- [ ] Spacing scale (0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 2.5rem, 3rem, etc.)
- [ ] Section padding (top, bottom, left, right)
- [ ] Component padding (all sides)
- [ ] Margin reset for elements
- [ ] Spacing between rows vs columns
- [ ] Responsive spacing adjustments (mobile, tablet, desktop)
- [ ] Grid gap sizes (by density)
- [ ] Flex gap sizes
- [ ] Aspect ratios (16:9, 4:3, 1:1, 9:16, etc.)
- [ ] Max-width constraints (max 1280px, max 960px, etc.)
- [ ] Gutters (side margins)
- [ ] Vertical rhythm multiplier
- [ ] Stacking context spacing
- [ ] Negative margin patterns
- [ ] Whitespace hierarchy

---

## 5. BUTTONS & CALLS-TO-ACTION

### Category Overview
Button styles, sizes, states, placement, icon usage, loading/disabled states.

**What We've Defined:**
- ✅ Primary CTA button variants (call-large-sticky, call-prominent, call-with-icon, aggressive-color, subtle-elegant, secondary-style-ok, standard-primary)
- ✅ Button grouping strategies (call-and-gallery, call-and-review, single-primary-only, primary-secondary)
- ✅ Secondary button style (ghost-outline, text-only, secondary-red, outline-standard)
- ✅ CTA placement strategies (fixed-bottom-mobile, hero-center, sticky)
- ✅ Mobile button behavior (sticky-bottom, auto-dial, touch-friendly, standard-responsive)

**What's Missing:**
- [ ] Button sizes (xsmall 28px, small 32px, medium 40px, large 48px, xlarge 56px)
- [ ] Button styles (solid, outline, ghost, text-only, gradient, glow)
- [ ] Button border radius (square, slightly-rounded, pill-shaped)
- [ ] Button states (default, hover, active, focus, disabled, loading)
- [ ] Button loading states (spinner, dots, skeleton)
- [ ] Button disabled styling (opacity, cursor, color)
- [ ] Icon + text button layout
- [ ] Icon-only buttons (sizing)
- [ ] Button groups (horizontal, vertical, segmented)
- [ ] Button hover animations (lift, glow, color-shift, ripple)
- [ ] Button focus styling (outline, glow, ring)
- [ ] FAB (Floating Action Button) styling
- [ ] Call-to-action text variants by vertical
- [ ] Button text case (Title Case, lowercase, UPPERCASE)

---

## 6. SHADOWS & DEPTH

### Category Overview
Box shadows, text shadows, elevation levels, layering.

**What We've Defined:**
- ✅ Card elevation depth (refined, none-border-only, bold, medium-lift, standard)
- ✅ Shadow levels (none, refined, standard, medium-lift, bold)
- ✅ Hover shadow behavior (hover-shadow-lift-subtle, hover-shadow-lift-prominent, hover-shadow-lift-standard)
- ✅ Dark mode shadow handling (shadows don't read well, use border-only)

**What's Missing:**
- [ ] Shadow values for each level (px, blur, spread, color)
- [ ] Inset shadow patterns
- [ ] Multiple shadow stacking
- [ ] Text shadow patterns (for text on images)
- [ ] Shadow color by context (brand color, black, themed)
- [ ] Blur values per elevation
- [ ] Spread radius per elevation
- [ ] Elevation z-index mapping
- [ ] Shadow opacity variations
- [ ] Transition timing for shadow changes
- [ ] Dark mode shadow colors

---

## 7. GRADIENTS

### Category Overview
Background gradients, text gradients, directional choices, color stops.

**What We've Defined:**
- ✅ Hero background gradients (subtle-diagonal, dynamic-red-orange, none-photo-only, brand-accent, personal-warmth, brand-subtle)
- ✅ CTA button gradients (red-to-orange, no-gradient-solid-color, warm-personal, no-gradient-solid-brand, brand-to-accent)
- ✅ Gradient definitions with specific values
- ✅ Mobile/dark mode gradient removal

**What's Missing:**
- [ ] Gradient angle/direction rules (0deg, 45deg, 90deg, 135deg, 180deg, to bottom, to right)
- [ ] Gradient color stops (2-3-4 stop gradients)
- [ ] Text gradients (when to apply)
- [ ] Animated gradients (if applicable)
- [ ] Gradient opacity variants
- [ ] Overlay gradients on images
- [ ] Gradient transitions between elements
- [ ] Gradient for different component types (cards, sections, buttons)
- [ ] Accessibility (sufficient contrast with text)
- [ ] Print-friendly gradient alternatives

---

## 8. BORDERS & DIVIDERS

### Category Overview
Border styles, colors, radius, thickness, divider patterns.

**What We've Defined:**
- ✅ Border usage in light/dark mode (subtle lines only)
- ✅ Border color implications (rgba(255,255,255,0.1) in dark mode)

**What's Missing:**
- [ ] Border thickness (1px, 2px, 4px, etc.)
- [ ] Border style (solid, dashed, dotted)
- [ ] Border radius values (sm 4px, md 8px, lg 12px, xl 16px, full 9999px)
- [ ] Border color by context (default, accent, error, success)
- [ ] Border hover effects
- [ ] Divider line styles (solid, dashed, dotted, gradient)
- [ ] Divider thickness and spacing
- [ ] Divider colors by context
- [ ] Top/bottom/left/right border variants
- [ ] Focus ring styling
- [ ] Input border styling (default, focused, error)
- [ ] Card border styling (subtle vs prominent)

---

## 9. FORMS & INPUTS

### Category Overview
Input field styling, validation states, form layouts, fieldset styling.

**What We've Defined:**
- ✅ Form validation states (minimal, robust)
- ✅ Form focus patterns (underline, borderGlow, backgroundTint)
- ✅ Form validation feedback (error icon, success icon, messages)
- ✅ Form field containers
- ✅ Multi-step form progress indicators
- ✅ Mobile form behavior (touch-friendly inputs)

**What's Missing:**
- [ ] Input field styles (outline, filled, standard)
- [ ] Input sizes (small, medium, large)
- [ ] Input states (default, focused, filled, disabled, error, success)
- [ ] Textarea sizing and styling
- [ ] Select/dropdown styling
- [ ] Checkbox styling and sizing
- [ ] Radio button styling
- [ ] Toggle switch styling
- [ ] Range slider styling
- [ ] Date picker styling
- [ ] Search input styling
- [ ] Autocomplete styling
- [ ] File upload styling
- [ ] Form label styling (positioning, required indicator)
- [ ] Helper text styling
- [ ] Error message styling and positioning
- [ ] Placeholder text styling
- [ ] Input icon positioning (left vs right)
- [ ] Form section separators
- [ ] Form button grouping
- [ ] Multi-step form navigation

---

## 10. CARDS & MODULES

### Category Overview
Card layouts, content grouping, card variants, module styling.

**What We've Defined:**
- ✅ Service card layouts (image-top-text-bottom, large-spacious, icon-text-minimal, with-testimonial-inline, standard-icon-text)
- ✅ Testimonial card styles (refined-card, bold-quote, context-near-feature, personal-story)
- ✅ Card elevation and shadows (refined, none-border-only, bold, medium-lift, standard)
- ✅ Card hover behavior (lift, color-shift, scale)

**What's Missing:**
- [ ] Card padding standardization
- [ ] Card border styling
- [ ] Card header styling
- [ ] Card footer styling
- [ ] Clickable card states
- [ ] Card with image positioning (top, left, right, background)
- [ ] Compact vs expanded card variants
- [ ] Card grid layout (1col, 2col, 3col, 4col, responsive)
- [ ] Feature card styling (larger, more prominent)
- [ ] Card overlay patterns (on hover, on image)
- [ ] Card badge/tag positioning
- [ ] Product card specific styling
- [ ] List item card styling

---

## 11. NAVIGATION

### Category Overview
Menu styling, navigation structure, sticky behavior, mobile navigation.

**What We've Defined:**
- ✅ Sticky mobile CTA bar positioning and styling
- ✅ Mobile-only display handling

**What's Missing:**
- [ ] Header/navbar background color (solid vs transparent)
- [ ] Header/navbar height
- [ ] Logo sizing in navbar
- [ ] Navigation menu items styling (text, icons, spacing)
- [ ] Active menu item indication
- [ ] Menu item hover states
- [ ] Submenu/dropdown styling
- [ ] Mobile hamburger menu styling
- [ ] Mobile menu animation
- [ ] Breadcrumb styling (color, separators, icons)
- [ ] Tab navigation styling (underline, pill, segmented)
- [ ] Sticky navigation behavior
- [ ] Scrolling navigation effects (hide, color-change)
- [ ] Accessibility (keyboard navigation, focus states)

---

## 12. MODALS & OVERLAYS

### Category Overview
Modal styling, backdrop, close buttons, content area.

**What We've Defined:**
- ✅ Z-index hierarchy (CTA at 40, modals above)

**What's Missing:**
- [ ] Modal background color
- [ ] Modal border styling
- [ ] Modal shadow
- [ ] Modal border radius
- [ ] Modal backdrop color and opacity
- [ ] Modal animation (slide, fade, zoom)
- [ ] Modal close button styling
- [ ] Modal header and footer styling
- [ ] Modal width constraints (max-width)
- [ ] Modal responsive behavior (mobile vs desktop)
- [ ] Alert dialog styling
- [ ] Tooltip styling
- [ ] Popover styling

---

## 13. ANIMATIONS & TRANSITIONS

### Category Overview
Transition timing, easing, animations, micro-interactions, motion effects.

**What We've Defined:**
- ✅ Animation durations (fast 0.15s, normal 0.25s, slow 0.4s)
- ✅ Animation easing (cubic-bezier(0.16, 1, 0.3, 1))
- ✅ Micro-interactions (button hover lift, form focus glow, ripple)
- ✅ Reveal animations (fade-up, fade-in, scale-in)
- ✅ Animation intensity profiles (subtle, disabled, gentle, standard)
- ✅ Hover effect animations (lift, glow, color-shift, ripple)
- ✅ Scroll reveal patterns (fade-up, scale-in with stagger)
- ✅ 3D tilt effect
- ✅ Specular highlight animation (3s shine shift)
- ✅ Respect prefers-reduced-motion

**What's Missing:**
- [ ] Page transition animations
- [ ] Loading state animations
- [ ] Success/error state animations
- [ ] Skeleton loading patterns
- [ ] Accordion open/close animations
- [ ] Modal entrance/exit animations
- [ ] Dropdown menu animations
- [ ] Toast notification animations
- [ ] Image reveal animations
- [ ] Counter animations (number increment)
- [ ] Progress bar animations
- [ ] Pulse animations
- [ ] Bounce animations
- [ ] Slide animations
- [ ] Swipe/gesture animations
- [ ] Parallax scrolling rules

---

## 14. IMAGES & MEDIA

### Category Overview
Image sizing, aspect ratios, lazy loading, placeholders, image treatments.

**What We've Defined:**
- ✅ Photo styles (professional-retouched, raw-authentic, personal-candid, high-quality-stock, professional-standard)
- ✅ Icon set styles (minimal-line, emoji-warmth, bold-solid, none-photo-only)
- ✅ Before-after slider image ratio (16:9)
- ✅ Video testimonial aspect ratio (16:9)
- ✅ Avatar sizing (implicit in testimonial components)

**What's Missing:**
- [ ] Image lazy loading strategy
- [ ] Image placeholder type (solid color, blur, gradient)
- [ ] Image format selection (JPEG vs WebP vs AVIF)
- [ ] Responsive image sizing (srcset, sizes attribute)
- [ ] Image compression strategy
- [ ] Image border styling
- [ ] Image shadow styling
- [ ] Image hover effects (zoom, overlay, brightness)
- [ ] Image aspect ratio constraints
- [ ] Image max-width constraints
- [ ] Logo sizing (navbar, hero, footer)
- [ ] Hero image overlay filters
- [ ] Gallery image grid layout
- [ ] Video poster images
- [ ] Favicon styling

---

## 15. BADGES & LABELS

### Category Overview
Badge styles, tag styles, status indicators, labels.

**What We've Defined:**
- ✅ Foil seal badge (gold, silver, copper, holographic)
- ✅ 3D tilt badge styling
- ✅ Specular highlight badge styling
- ✅ Trust velocity badges (review count, ratings, years, certifications)
- ✅ Badge placement rules (hero, guarantee section, form, testimonials)

**What's Missing:**
- [ ] Status badge styles (active, inactive, pending, completed)
- [ ] Importance badge colors (critical, warning, info, success)
- [ ] Dismissible badge styling
- [ ] Badge sizing (small, medium, large)
- [ ] Badge text capitalization
- [ ] Badge icon positioning
- [ ] Award/achievement badge styles
- [ ] Certification badge styling
- [ ] Recommendation badges
- [ ] "New" or "Featured" badge styling
- [ ] Quantity/count badges
- [ ] Inline vs standalone badges
- [ ] Badge animation (pulse, bounce)
- [ ] Badge hover states

---

## 16. LISTS & TABLES

### Category Overview
List styling, list item spacing, table styling, cell styling.

**What We've Defined:**
- ✅ Process timeline step styling (numbers, lines, content)

**What's Missing:**
- [ ] Ordered/unordered list styling
- [ ] List marker styling (bullets, numbers, icons)
- [ ] List item spacing
- [ ] Nested list indentation
- [ ] Checklist styling
- [ ] Table header styling (background, text, weight)
- [ ] Table cell padding
- [ ] Table row hover effects
- [ ] Table alternating row colors (striping)
- [ ] Table border styling (full grid, minimal, outline)
- [ ] Responsive table behavior (horizontal scroll vs card layout)
- [ ] Sticky table header
- [ ] Table sorting indicators

---

## 17. TYPOGRAPHY TREATMENTS

### Category Overview
Quote blocks, code blocks, emphasis, text effects.

**What We've Defined:**
- ✅ Quote styling (in testimonials)
- ✅ Accent pulse animation

**What's Missing:**
- [ ] Blockquote styling (border-left, background, styling)
- [ ] Pull quote styling
- [ ] Code block styling (background, text color, font)
- [ ] Inline code styling
- [ ] Syntax highlighting (if applicable)
- [ ] Emphasis styling (bold, italic, strong)
- [ ] Strikethrough styling
- [ ] Superscript/subscript styling
- [ ] Small text styling (for captions, footnotes)
- [ ] Text truncation (ellipsis)
- [ ] Text highlighting/markers
- [ ] Link styling (color, underline, hover)
- [ ] Visited link styling
- [ ] Underline styling (text-decoration, border-bottom)

---

## 18. BACKGROUNDS & PATTERNS

### Category Overview
Background colors, patterns, textures, effects.

**What We've Defined:**
- ✅ Decorative patterns (dots, lines, grid, waves) as SVG data URIs
- ✅ Background gradients (hero, cards, sections)
- ✅ Dark mode backgrounds

**What's Missing:**
- [ ] Solid background colors (primary, secondary, tertiary, white, gray)
- [ ] Textured backgrounds (if applicable)
- [ ] Background images (sizing, positioning, repeat)
- [ ] Background opacity/transparency
- [ ] Background blend modes
- [ ] Noise/grain overlay patterns
- [ ] Diagonal stripe patterns
- [ ] Dot/grid patterns
- [ ] Section background alternation
- [ ] Subtle background tints (brand-light backgrounds)
- [ ] Animated background patterns

---

## 19. FOCUS & ACCESSIBILITY

### Category Overview
Focus indicators, keyboard navigation, screen reader indicators.

**What We've Defined:**
- ✅ Form focus patterns (glow, border change, background tint)
- ✅ WCAG 2.1 AA compliance requirements
- ✅ Respect prefers-reduced-motion

**What's Missing:**
- [ ] Focus indicator styling (outline, ring, glow)
- [ ] Focus indicator color (brand color, high contrast)
- [ ] Tab order management
- [ ] Skip to content link styling
- [ ] Screen reader text visibility
- [ ] ARIA label colors/styling
- [ ] High contrast mode styling
- [ ] Large text zoom handling
- [ ] Color contrast ratios (WCAG AA, AAA)
- [ ] Keyboard shortcut styling
- [ ] Disabled state styling (opacity, cursor, color)

---

## 20. RESPONSIVE BREAKPOINTS

### Category Overview
Mobile, tablet, desktop sizing and behavior.

**What We've Defined:**
- ✅ Mobile breakpoint (< 768px)
- ✅ Tablet breakpoint (768-1023px)
- ✅ Desktop breakpoint (1024px+)
- ✅ Mobile-specific behavior (stack order, button styles, animations disabled)
- ✅ Responsive font sizing

**What's Missing:**
- [ ] Specific pixel breakpoints (320px, 480px, 768px, 1024px, 1280px, 1536px)
- [ ] Container queries (if using modern CSS)
- [ ] Picture/srcset breakpoints for images
- [ ] Component visibility rules (hide on mobile, show on desktop)
- [ ] Column count rules (1col mobile, 2col tablet, 3col desktop)
- [ ] Spacing adjustments per breakpoint
- [ ] Font size adjustments per breakpoint
- [ ] Navigation changes per breakpoint
- [ ] Layout direction (single column mobile, grid desktop)

---

## 21. ICONS & ICONOGRAPHY

### Category Overview
Icon families, sizing, colors, positioning, usage patterns.

**What We've Defined:**
- ✅ Icon variants by category (emergency, seasonal, premium, portfolio)
- ✅ Icon styling options (minimal-line, emoji-warmth, bold-solid)
- ✅ Icon sizing (32px-40px general, 4rem play button, etc.)
- ✅ Icon positioning (left of text, right of text, standalone)

**What's Missing:**
- [ ] Icon size scale (16px, 20px, 24px, 32px, 40px, 48px, 64px)
- [ ] Icon color options (primary, accent, secondary, white, gray)
- [ ] Icon animation (hover, spin, pulse)
- [ ] Icon alignment (center, top, baseline)
- [ ] Disabled icon styling
- [ ] Loading spinner styling
- [ ] Checkmark/validation icons
- [ ] Error/warning icons
- [ ] Info icons
- [ ] Navigation icons
- [ ] Action icons (edit, delete, save, share)
- [ ] Social media icons
- [ ] Icon library (Feather, Font Awesome, Material, custom SVG)

---

## 22. FOOTER

### Category Overview
Footer layout, content organization, styling.

**What We've Defined:**
- ✅ Footer trust stack (license, badges, certifications)

**What's Missing:**
- [ ] Footer background color
- [ ] Footer text color (lighter, muted)
- [ ] Footer link styling
- [ ] Footer sections/columns
- [ ] Footer logo sizing
- [ ] Footer copyright text
- [ ] Footer contact info styling
- [ ] Footer social media links
- [ ] Footer newsletter signup
- [ ] Footer navigation links
- [ ] Footer divider styling (top border, line)
- [ ] Sticky footer behavior
- [ ] Footer responsive layout (1col mobile, 4col desktop)

---

## Summary Statistics

**Total Design Categories:** 22

**Rules/Decisions Defined:** ~150+
- ✅ Strongly Defined (clear IF/THEN rules): ~60
- 🟡 Partially Defined (general guidance): ~50
- ❌ Missing (needs IF/THEN rules): ~40+

**Coverage:** ~60% complete for conversion-focused service sites

**High Priority Gaps:**
1. Form styling (14 missing rules)
2. Navigation (12 missing rules)
3. Responsive behavior (9 missing rules)
4. Borders & dividers (11 missing rules)
5. Icon/imagery sizing scale (12 missing rules)

---

## Next Steps to Complete System

1. **Add form variant rules** — Input states, validation, fieldset layouts
2. **Define responsive breakpoint rules** — When each component changes per screen size
3. **Standardize spacing scale** — Use consistent 0.5rem increments
4. **Create border & divider rules** — When to use which thickness/style
5. **Icon & image sizing scale** — Complete sizing matrices for all components
6. **Navigation structure** — Header/navbar variants by business type
7. **Accessibility rules** — Focus states, contrast requirements, keyboard navigation
8. **Animation timing** — Complete motion guidelines
9. **Badge styling completeness** — All badge types and states
10. **Footer template variants** — Different footer layouts by business type

This would bring the system to **~220+ total rules**, covering 90%+ of frontend design decisions for service businesses.

