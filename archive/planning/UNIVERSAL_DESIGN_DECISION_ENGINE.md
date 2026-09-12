# BuildFlow: Universal Design Decision Engine

## Overview

Every design and UX decision—templates, colors, buttons, gradients, shadows, dark mode, typography, spacing, animations—is mapped to business characteristics via clear IF/THEN rules.

**Core Principle:** Given business data, an AI agent can deterministically decide every visual and functional element.

---

## Business Data Profile (Input)

```typescript
interface BusinessDataProfile {
  // Identity
  vertical: 'plumbing' | 'hvac' | 'roofing' | 'landscaping' | 'electrical' | 'handyman' | 'cleaning' | etc;
  businessName: string;
  phone: string;
  
  // Social Proof & Credibility
  reviewCount: number; // 0-10,000+
  averageRating: number; // 1.0-5.0
  yearsInBusiness: number; // 0-100+
  teamSize: number; // 1-500+
  
  // Service Characteristics
  type: 'service'; // BuildFlow specific
  emergencyFocused: boolean; // Plumbing, HVAC, Electrical
  portfolioHeavy: boolean; // Landscaping, Roofing, Renovation
  seasonal: boolean; // Landscaping, snow removal, pressure washing
  projectBased: boolean; // Custom builds (kitchens, decks)
  multiLocation: boolean; // Multiple service areas
  soloOperator: boolean; // Solo vs team
  
  // Market Position
  premiumPositioning: boolean; // Luxury vs value
  pricePoint: 'budget' | 'mid-market' | 'premium' | 'luxury';
  averageProjectValue: number; // In dollars
  
  // Proof Points
  certifications: string[]; // ['EPA', 'BBB', 'Licensed', 'Insured']
  awards: string[];
  portfolio: Array<{ photo, description }>;
  testimonials: number; // Count of customer reviews
  guaranteeType?: '30-day-money-back' | '2-year-warranty' | 'lifetime';
  
  // Market Data
  mobileTrafficEstimate: number; // 0-100% (percent of searches on mobile)
  competitorCount: number; // Estimated competitors in area
  seasonalityFactor: number; // 0-1 (1 = highly seasonal)
  
  // Positioning Flags (derived)
  emergencyService: boolean; // emergencyFocused || ['plumbing', 'hvac', 'electrical']
  trustMature: boolean; // yearsInBusiness >= 3
  trustedEstablished: boolean; // yearsInBusiness >= 10
  highSocialProof: boolean; // reviewCount >= 500
  veryHighSocialProof: boolean; // reviewCount >= 1000
  visualTrade: boolean; // portfolioHeavy || ['landscaping', 'roofing', 'renovation']
}
```

---

## Decision Categories

Every design decision falls into one of these categories:

1. **Page Templates** — Layout structure (hero type, service grid, footer style)
2. **Color Schemes** — Primary, accent, background, text colors
3. **Button Strategies** — Size, style, placement, text, icons
4. **Gradients** — Background gradients, text gradients, directional choices
5. **Shadow Systems** — Depth hierarchy (none, sm, md, lg, xl)
6. **Dark Mode** — Enable/disable, color inversion strategy
7. **Typography** — Font families, sizes, weights, line heights
8. **Spacing & Rhythm** — Compact vs spacious, gaps, padding
9. **Component Variants** — Testimonial styles, card layouts, hero variants
10. **Animations & Transitions** — Speed, easing, effects (enabled/disabled)
11. **Icons & Imagery** — Icon sets, photo styles, placeholder treatment
12. **Mobile Behavior** — Stack order, touch targets, adaptive layouts

---

## Rule Format (IF/THEN)

Every rule follows this structure:

```typescript
{
  decision: 'color-primary', // What decision this rule makes
  trigger: {
    condition: 'vertical === "plumbing" AND yearsInBusiness >= 5',
    description: 'Established plumbing company'
  },
  output: {
    value: '#0369a1', // The actual color value
    rationale: 'Trust blue for established plumbing (water, reliability)'
  },
  fallback: '#1e40af', // If no rules match, use this
  priority: 10, // Higher = more specific, applies over lower-priority rules
}
```

---

## 1. PAGE TEMPLATES

### Decision: Hero Template Variant

**Rules:**

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 100 | emergencyFocused && mobileTraffic >= 60% | `hero-minimal-cta` | Emergency + mobile = need quick call button |
| 90 | portfolioHeavy && portfolioSize >= 20 | `hero-image-showcase` | Portfolio-heavy needs visual proof immediately |
| 80 | premiumPositioning && yearsInBusiness >= 10 | `hero-elegant-minimal` | Premium, established = confidence, elegance |
| 70 | highSocialProof && reviewCount >= 500 | `hero-trust-dominant` | High reviews = lead with credibility |
| 60 | multiLocation && teamSize >= 3 | `hero-geographic-map` | Multiple locations = show service area upfront |
| 50 | soloOperator && trustMature | `hero-personal-story` | Solo = personal touch, expertise-driven |
| 40 | seasonal && seasonalityFactor >= 0.6 | `hero-time-sensitive` | Seasonal = "Book now for [season]" messaging |
| 20 | default | `hero-standard` | Neutral, works for all service businesses |

**Template Details:**

```typescript
// hero-minimal-cta
{
  layout: 'full-bleed-color-with-accent-bar',
  accentBar: 'left', // 4px colored bar on left
  headline: 'ultra-large', // 3.2rem
  subheadline: 'small', // 1rem
  backgroundType: 'solid-with-accent', // No image, quick load
  ctaPosition: 'center-prominent',
  ctaText: 'EMERGENCY CALL', // All caps for urgency
  ctaButton: 'large-call-button', // 56px height
  mobileHeight: '280px', // Fits above fold
  desktopHeight: '600px',
}

// hero-image-showcase
{
  layout: 'split-image-text',
  imageSide: 'left',
  imageRatio: '16:9',
  backgroundType: 'showcase-photo',
  headline: 'large',
  subheadline: 'medium',
  ctaPosition: 'right-stack',
  ctaButtons: 2, // Primary + secondary CTA
  mobileLayout: 'stack-image-top',
}

// hero-elegant-minimal
{
  layout: 'text-only-centered',
  backgroundType: 'gradient-subtle',
  headline: 'elegant', // Serif, 2.4rem
  subheadline: 'refined', // 1rem, lighter weight
  ctaPosition: 'center-refined',
  ctaButton: 'subtle-ghost-button',
  spacing: 'spacious', // Extra breathing room
  animation: 'fade-in-slow', // 0.8s vs 0.3s
}

// hero-trust-dominant
{
  layout: 'text-with-trust-stack',
  trustBadges: ['rating', 'review-count', 'years', 'certifications'],
  trustBadgeSize: 'large',
  badge: 'foil-seal-prominent',
  headline: 'large-confidence',
  backgroundType: 'subtle-gradient',
  trustStack: 'visible-above-fold',
}
```

**Agent Logic:**

```typescript
function selectHeroTemplate(business: BusinessProfile): string {
  const rules = [
    { priority: 100, condition: () => business.emergencyFocused && business.mobileTraffic >= 60, value: 'hero-minimal-cta' },
    { priority: 90, condition: () => business.portfolioHeavy && business.portfolio.length >= 20, value: 'hero-image-showcase' },
    { priority: 80, condition: () => business.premiumPositioning && business.yearsInBusiness >= 10, value: 'hero-elegant-minimal' },
    { priority: 70, condition: () => business.highSocialProof && business.reviewCount >= 500, value: 'hero-trust-dominant' },
    { priority: 20, condition: () => true, value: 'hero-standard' },
  ];
  
  const matching = rules.filter(r => r.condition()).sort((a, b) => b.priority - a.priority);
  return matching[0]?.value || 'hero-standard';
}
```

---

### Decision: Services Grid Layout

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | portfolioHeavy && portfolioSize >= 10 | `grid-2col-feature-gallery` | Portfolio = lead with visual proof |
| 80 | highSocialProof && serviceCount <= 6 | `grid-3col-cards-with-testimonials` | High trust + few services = prove each |
| 70 | multiService && serviceCount >= 8 | `grid-2col-cards-compact` | Many services = organized grid |
| 60 | premiumPositioning | `grid-3col-large-cards` | Premium = spacious, breathing room |
| 50 | emergencyFocused | `grid-2col-highlight-first-service` | Emergency = highlight most urgent |
| 30 | default | `grid-3col-standard` | Standard 3-column |

---

### Decision: Testimonials Layout

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | highSocialProof && reviewCount >= 1000 | `testimonial-wall-grid` | Massive proof = show abundance |
| 80 | premiumPositioning && reviewCount >= 100 | `testimonial-carousel-featured` | Premium + proof = curated showcase |
| 70 | portfolioHeavy | `testimonial-contextual-near-services` | Portfolio sites = proof near features |
| 60 | emergencyFocused | `testimonial-urgent-guarantee` | Emergency = quick reassurance statements |
| 30 | default | `testimonial-grid-3col` | Standard 3-column grid |

---

## 2. COLOR SCHEMES

### Decision: Primary Brand Color

**Rules by Vertical:**

| Vertical | Primary | Rationale | Accent |
|----------|---------|-----------|--------|
| Plumbing | #0369a1 (blue) | Water, trust, reliability | #f59e0b (amber—warmth) |
| HVAC | #1e40af (darker blue) | Professionalism, tech, cooling | #ef4444 (red—heat/urgency) |
| Roofing | #7c3aed (purple) | Premium, elevation, quality | #ec4899 (pink—precision) |
| Landscaping | #059669 (emerald) | Nature, growth, health | #84cc16 (lime—vibrant) |
| Electrical | #0ea5e9 (sky blue) | Energy, electricity, power | #f97316 (orange—voltage) |
| Cleaning | #10b981 (teal) | Fresh, clean, renewal | #fbbf24 (gold—shine) |

### Decision: Brand Color Assignment (Dynamic)

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 100 | vertical === 'plumbing' | use `plumbing-colors` | Industry standard—trust blue |
| 100 | vertical === 'hvac' | use `hvac-colors` | Professional, tech positioning |
| 90 | premiumPositioning && vertical === 'landscaping' | #059669 (darker emerald) | Premium = richer, deeper green |
| 80 | emergencyFocused && vertical not plumbing/hvac | add `red-accent` (danger signal) | Emergency = red prominently |
| 70 | highSocialProof && yearsInBusiness >= 10 | `established-color-scheme` | Trustworthy = deeper, mature tones |
| 50 | soloOperator | `personal-warmth-variant` | Solo = warmer accent colors |

**Agent Logic:**

```typescript
function selectPrimaryColor(business: BusinessProfile): string {
  const verticalColors = {
    'plumbing': '#0369a1',
    'hvac': '#1e40af',
    'roofing': '#7c3aed',
    'landscaping': '#059669',
    'electrical': '#0ea5e9',
    'cleaning': '#10b981',
    'default': '#3b82f6',
  };
  
  let color = verticalColors[business.vertical] || verticalColors['default'];
  
  // Premium = darker, richer tone
  if (business.premiumPositioning) {
    color = darkenColor(color, 10); // 10% darker
  }
  
  // Established = saturated, confident
  if (business.yearsInBusiness >= 10) {
    color = saturateColor(color, 15); // 15% more saturated
  }
  
  return color;
}
```

### Decision: Dark Mode Support

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | premiumPositioning | `dark-mode-full` | Premium audiences expect dark mode |
| 80 | reviewCount >= 500 | `dark-mode-full` | High-social-proof brands use dark |
| 70 | yearsInBusiness >= 10 | `dark-mode-optional` | Established businesses = conservative |
| 50 | emergencyFocused | `dark-mode-disabled` | Emergency services = high contrast (light) |
| 20 | default | `dark-mode-optional` | Most get optional dark mode |

---

## 3. BUTTON STRATEGIES

### Decision: Primary CTA Button

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 100 | emergencyFocused && mobileTraffic >= 60% | `button-call-large-sticky` | Mobile emergency = always-visible call |
| 90 | mobileTraffic >= 60% | `button-call-prominent` | 60%+ mobile = call button emphasizes phone |
| 80 | emergencyFocused | `button-call-with-icon` | Emergency = 📞 icon + text |
| 70 | reviewCount < 100 | `button-aggressive-color` | Low proof = aggressive CTA color |
| 60 | premiumPositioning | `button-subtle-elegant` | Premium = refined, not loud |
| 50 | highSocialProof | `button-secondary-style-ok` | High proof = don't need aggressive CTA |
| 30 | default | `button-standard-primary` | Standard solid CTA button |

**Button Variants:**

```typescript
// button-call-large-sticky
{
  type: 'call',
  text: 'EMERGENCY CALL', // or "📞 Call (XXX) XXX-XXXX"
  size: '56px-height', // Large tap target
  color: 'brand-red', // Red for emergency urgency
  placement: 'fixed-bottom-mobile',
  style: 'solid-filled',
  icon: '📞',
  emphasis: 'maximum',
  animateEntry: 'slide-up-fade',
  mobileOnly: true,
}

// button-call-prominent
{
  type: 'call',
  text: 'Call Now', // or full phone number
  size: '48px-height',
  color: 'brand-primary',
  placement: 'hero-center',
  style: 'solid-filled',
  icon: '📞',
  emphasis: 'high',
}

// button-subtle-elegant
{
  type: 'action',
  text: 'Get Started', // or "Schedule Consultation"
  size: '44px-height',
  color: 'brand-primary',
  placement: 'hero-center',
  style: 'ghost-outline', // Outline, not filled
  emphasis: 'refined',
  fontWeight: '500', // Lighter than default
  borderRadius: '8px',
}

// button-standard-primary
{
  type: 'action',
  text: 'Get Your Free Quote',
  size: '44px-height',
  color: 'brand-primary',
  style: 'solid-filled',
  emphasis: 'standard',
}
```

### Decision: Secondary Button Style

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 80 | premiumPositioning | `button-ghost-outline` | Premium = refined, understated |
| 70 | highSocialProof | `button-text-only` | High proof = CTA can be subtle |
| 50 | emergencyFocused | `button-secondary-red` | Emergency = secondary still red |
| 30 | default | `button-outline-standard` | Standard outline button |

### Decision: Button Grouping (Multiple CTAs)

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | portfolioHeavy | `buttons-call-and-gallery` | Portfolio = "Call" + "View Gallery" |
| 80 | reviewCount >= 100 | `buttons-call-and-review` | Social proof = "Call" + "See Reviews" |
| 70 | highSocialProof && testimonials >= 20 | `button-single-primary-only` | Very high proof = one strong CTA |
| 50 | default | `buttons-primary-secondary` | Standard call + secondary CTA |

---

## 4. GRADIENTS

### Decision: Hero Background Gradient

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | premiumPositioning && yearsInBusiness >= 10 | `gradient-subtle-diagonal` | Premium, established = understated |
| 80 | emergencyFocused | `gradient-dynamic-red-orange` | Emergency = warm, urgent feeling |
| 70 | portfolioHeavy | `gradient-none-photo-only` | Portfolio = let photos speak |
| 60 | highSocialProof | `gradient-brand-accent` | Trust = brand color gradients |
| 50 | soloOperator && premiumPositioning | `gradient-personal-warmth` | Solo premium = personal, warm tones |
| 30 | default | `gradient-brand-subtle` | Soft brand-to-white gradient |

**Gradient Definitions:**

```typescript
// gradient-subtle-diagonal
background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
// Minimal, sophisticated

// gradient-dynamic-red-orange
background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
// Warm, energetic, urgent

// gradient-brand-accent
background: linear-gradient(180deg, var(--brand) 0%, var(--brand-accent) 100%);
// Vertical brand → accent transition

// gradient-personal-warmth
background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
// Warm amber tones (soloOperator personality)
```

### Decision: CTA Button Gradient

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | emergencyFocused && lowConversion | `gradient-red-to-orange` | Emergency + low trust = warm urgency |
| 80 | premiumPositioning | `no-gradient-solid-color` | Premium = refined, not "loud" |
| 70 | soloOperator | `gradient-warm-personal` | Solo = personal, approachable feel |
| 50 | reviewCount >= 500 | `no-gradient-solid-brand` | High trust = simple, confident |
| 30 | default | `gradient-brand-to-accent` | Standard button gradient |

---

## 5. SHADOW SYSTEMS

### Decision: Card Elevation Depth

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | premiumPositioning | `shadow-refined` | Premium = subtle, refined depth |
| 80 | darkMode | `shadow-none-border-only` | Dark mode = shadows don't read well |
| 70 | emergencyFocused | `shadow-bold` | Emergency = strong hierarchy |
| 60 | portfolioHeavy | `shadow-medium-lift` | Portfolio cards = noticeable depth |
| 50 | default | `shadow-standard` | Moderate shadow |

**Shadow Levels:**

```typescript
// shadow-none: border-only
box-shadow: none;
border: 1px solid var(--color-line);

// shadow-refined (premium)
box-shadow: 0 1px 2px rgba(0,0,0,0.05);
// Barely visible, sophisticated

// shadow-standard
box-shadow: 0 4px 6px rgba(0,0,0,0.1);

// shadow-medium-lift (portfolio)
box-shadow: 0 10px 15px rgba(0,0,0,0.1);

// shadow-bold (emergency)
box-shadow: 0 10px 25px rgba(0,0,0,0.15);
// Strong visual separation
```

### Decision: Hover Shadow Behavior

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 80 | premiumPositioning | `hover-shadow-lift-subtle` | Premium = smooth, minimal lift |
| 70 | emergencyFocused | `hover-shadow-lift-prominent` | Emergency = clear interactive feedback |
| 50 | default | `hover-shadow-lift-standard` | Standard +4px lift |

---

## 6. DARK MODE

### Decision: Dark Mode Palette Strategy

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 100 | premiumPositioning && yearsInBusiness >= 10 | `dark-mode-sophisticated` | Premium brands = refined dark |
| 90 | reviewCount >= 500 | `dark-mode-full` | High trust = invest in dark mode |
| 80 | soloOperator || emergencyFocused | `dark-mode-high-contrast` | Need strong readability |
| 50 | default | `dark-mode-optional` | Standard dark mode |

**Dark Mode Variants:**

```typescript
// dark-mode-sophisticated (premium)
{
  background: '#0f172a', // Near black
  surface: '#1e293b', // Charcoal
  text: '#f1f5f9', // Off white
  accent: 'var(--brand-light)', // Lighter accent on dark
  border: 'rgba(255,255,255,0.1)', // Subtle borders
  shadow: 'rgba(0,0,0,0.3)', // Muted shadows
}

// dark-mode-full (high trust)
{
  background: '#1a1a1a',
  surface: '#2a2a2a',
  text: '#ffffff',
  accent: 'var(--brand-accent)',
}

// dark-mode-high-contrast (emergency/solo)
{
  background: '#000000',
  surface: '#1a1a1a',
  text: '#ffffff',
  accent: 'var(--brand)', // Bright accent on dark
  border: 'rgba(255,255,255,0.2)', // Visible borders
}
```

---

## 7. TYPOGRAPHY

### Decision: Heading Font Family

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | premiumPositioning && yearsInBusiness >= 10 | `serif-elegant` | Premium, established = classic serif |
| 80 | portfolioHeavy | `sans-modern` | Visual-heavy = modern, clean |
| 70 | emergencyFocused | `sans-bold` | Emergency = clear, commanding |
| 60 | soloOperator && reviewCount >= 100 | `sans-humanist` | Personal trusted expert = warm sans |
| 50 | default | `sans-geometric` | Standard modern sans-serif |

**Font Stacks:**

```typescript
// serif-elegant (premium)
font-family: 'Garamond', 'Georgia', serif;
font-weight: 400;
letter-spacing: -0.01em;
// Classic, refined

// sans-modern (portfolio)
font-family: 'Inter', 'Helvetica Neue', sans-serif;
font-weight: 600;
// Clean, contemporary

// sans-bold (emergency)
font-family: 'Montserrat', 'Arial', sans-serif;
font-weight: 700;
// Commanding, urgent

// sans-humanist (trusted solo)
font-family: 'Segoe UI', 'Tahoma', sans-serif;
font-weight: 500;
// Warm, approachable
```

### Decision: Heading Size Scale

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | premiumPositioning | `scale-elegant` | Premium = spacious typography |
| 80 | emergencyFocused | `scale-bold` | Emergency = larger, commanding |
| 70 | soloOperator | `scale-personal` | Solo = slightly smaller, intimate |
| 50 | default | `scale-standard` | Balanced sizing |

**Heading Sizes:**

```typescript
// scale-elegant (premium)
h1: 2.2rem; // Elegant, not huge
h2: 1.8rem;
h3: 1.4rem;
body: 1rem;
// More generous leading

// scale-bold (emergency)
h1: 3.2rem; // Large, commanding
h2: 2.4rem;
h3: 1.8rem;
body: 1.1rem;

// scale-standard
h1: 2.8rem;
h2: 2rem;
h3: 1.5rem;
body: 1rem;
```

### Decision: Body Font

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | yearsInBusiness >= 10 && reviewCount >= 500 | `font-readable-serif` | Established, high proof = serif body |
| 80 | portfolioHeavy | `font-modern-sans` | Visual-heavy = sans for clarity |
| 70 | mobileTraffic >= 70 | `font-mobile-optimized` | Mobile = larger x-height, better readability |
| 50 | default | `font-standard-sans` | Clean, modern sans |

---

## 8. SPACING & RHYTHM

### Decision: Layout Density

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | premiumPositioning | `spacing-spacious` | Premium = breathing room, luxury feel |
| 80 | soloOperator | `spacing-comfortable` | Solo = approachable, not corporate |
| 70 | emergencyFocused | `spacing-compact` | Emergency = dense, action-focused |
| 60 | highSocialProof | `spacing-comfortable` | High trust = confidence, can be spacious |
| 50 | default | `spacing-standard` | Balanced spacing |

**Spacing Values:**

```typescript
// spacing-spacious (premium)
section-padding: 7rem 2rem;
component-gap: 3rem;
card-padding: 2.5rem;
// Extra breathing room

// spacing-comfortable (solo)
section-padding: 5.5rem 2rem;
component-gap: 2rem;
card-padding: 2rem;

// spacing-compact (emergency)
section-padding: 4rem 2rem;
component-gap: 1.5rem;
card-padding: 1.5rem;
// Dense, action-focused
```

---

## 9. COMPONENT VARIANTS

### Decision: Testimonial Card Style

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | highSocialProof && premiumPositioning | `testimonial-refined-card` | Premium + high proof = elegant presentation |
| 80 | emergencyFocused && highSocialProof | `testimonial-bold-quote` | Emergency + trust = prominent quote |
| 70 | portfolioHeavy | `testimonial-context-near-feature` | Portfolio = proof near relevant service |
| 60 | soloOperator | `testimonial-personal-story` | Solo = customer journey narrative |
| 50 | default | `testimonial-standard-grid` | Simple 3-column grid |

**Testimonial Variants:**

```typescript
// testimonial-refined-card
{
  layout: 'card-with-border-top',
  borderColor: 'var(--brand-accent)',
  borderWidth: '4px',
  backgroundColor: 'subtle-background',
  padding: 'spacious',
  quote: { fontSize: '1.25rem', fontStyle: 'italic' },
  author: { fontWeight: 600, fontSize: '0.95rem' },
  rating: 'stars-large',
  shadow: 'refined',
}

// testimonial-bold-quote
{
  layout: 'quote-first-large',
  quote: { fontSize: '1.5rem', color: 'brand-primary', fontWeight: 700 },
  author: { fontSize: '1rem', marginTop: '1.5rem' },
  rating: 'stars-extra-large', // Prominent
  backgroundColor: 'white',
  borderLeft: '6px solid var(--brand-accent)',
}

// testimonial-context-near-feature
{
  layout: 'inline-near-service',
  size: 'compact',
  quote: { fontSize: '1rem' },
  author: { fontSize: '0.9rem' },
  placement: 'right-side-of-service-card',
}
```

### Decision: Service Card Layout

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | portfolioHeavy && portfolioSize >= 10 | `card-image-top-text-bottom` | Portfolio = showcase image |
| 80 | premiumPositioning | `card-large-spacious` | Premium = luxurious cards |
| 70 | emergencyFocused | `card-icon-text-minimal` | Emergency = quick scan, minimal |
| 60 | highSocialProof | `card-with-testimonial-inline` | Trust = proof inside cards |
| 50 | default | `card-standard-icon-text` | Simple icon + title + description |

---

## 10. ANIMATIONS & TRANSITIONS

### Decision: Animation Intensity

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | premiumPositioning | `animation-subtle` | Premium = refined, not flashy |
| 80 | emergencyFocused | `animation-disabled` | Emergency = high contrast, no distraction |
| 70 | soloOperator && highSocialProof | `animation-gentle` | Trusted solo = personality, gentle motion |
| 50 | default | `animation-standard` | Standard 200-300ms transitions |

**Animation Profiles:**

```typescript
// animation-subtle
{
  duration: 400ms,
  easing: 'cubic-bezier(0.2, 0.9, 0.8, 0.1)',
  enable: ['hover-lift', 'page-transition', 'scroll-reveal'],
  disable: ['background-flicker', 'flashy-effects'],
}

// animation-disabled
{
  duration: 0,
  enable: [],
  disable: 'all',
}

// animation-gentle
{
  duration: 300ms,
  easing: 'ease-out',
  enable: ['hover-scale', 'scroll-fade-in', 'button-bounce'],
  scale: 0.95, // Subtle scale, not aggressive
}

// animation-standard
{
  duration: 200ms,
  easing: 'ease-out',
  enable: 'all',
}
```

### Decision: Hover Effect

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | premiumPositioning | `hover-subtle-lift` | Premium = -1px lift, minimal shadow increase |
| 80 | emergencyFocused | `hover-color-shift` | Emergency = color change signals action |
| 70 | soloOperator | `hover-scale-small` | Solo = approachable, 1.02x scale |
| 50 | default | `hover-lift-standard` | Standard -2px lift + shadow |

---

## 11. ICONS & IMAGERY

### Decision: Icon Set Style

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | premiumPositioning && yearsInBusiness >= 10 | `icons-minimal-line` | Premium = refined line icons |
| 80 | portfolioHeavy | `icons-none-photo-only` | Portfolio = photos speak louder |
| 70 | soloOperator | `icons-emoji-warmth` | Solo = approachable emoji (📞, ✨, 🏆) |
| 60 | emergencyFocused | `icons-bold-solid` | Emergency = clear, bold icons |
| 50 | default | `icons-standard-line` | Standard line icon set |

**Icon Treatments:**

```typescript
// icons-minimal-line
{
  style: 'outline',
  strokeWidth: 2,
  color: 'var(--brand)',
  size: 32,
  library: 'feathericons-or-custom',
}

// icons-emoji-warmth
{
  style: 'emoji',
  size: 40,
  usageExample: '📞 Call Now, ✨ Premium, 🏆 Guaranteed',
}

// icons-bold-solid
{
  style: 'solid-filled',
  color: 'var(--brand)',
  size: 40,
  weight: 'bold',
}
```

### Decision: Photo Style

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | premiumPositioning | `photos-professional-retouched` | Premium = polished, high-end |
| 80 | portfolioHeavy | `photos-raw-authentic` | Portfolio = unpolished reality |
| 70 | soloOperator | `photos-personal-candid` | Solo = authentic, human feel |
| 60 | reviewCount < 100 | `photos-high-quality-stock` | Low proof = professional visuals |
| 50 | default | `photos-professional-standard` | Clean, professional photos |

---

## 12. MOBILE BEHAVIOR

### Decision: Mobile Stack Order

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 90 | emergencyFocused | `stack-cta-first` | Emergency = call button before anything |
| 80 | portfolioHeavy | `stack-gallery-first` | Portfolio = images first (mobile browsing) |
| 70 | highSocialProof | `stack-reviews-prominent` | Trust = social proof high on mobile |
| 50 | default | `stack-text-cta-gallery` | Standard: headline → CTA → gallery |

### Decision: Mobile Button Behavior

| Priority | IF | THEN | Why |
|----------|----|----|-----|
| 100 | emergencyFocused | `button-sticky-bottom` | Emergency = always-accessible call |
| 90 | mobileTraffic >= 70% | `button-auto-dial` | High mobile = tap-to-call enabled |
| 80 | soloOperator | `button-touch-friendly` | Solo = larger tap targets (48px+) |
| 50 | default | `button-standard-responsive` | Responsive resizing (44px → 56px) |

---

## Master Decision Algorithm

```typescript
class UniversalDesignEngine {
  analyzeAndDecide(business: BusinessProfile): DesignDecisions {
    const decisions = {
      heroTemplate: this.rule('page-template-hero', business),
      servicesGrid: this.rule('page-layout-services', business),
      testimonialsStyle: this.rule('component-testimonials', business),
      
      primaryColor: this.rule('color-primary', business),
      accentColor: this.rule('color-accent', business),
      darkModeEnabled: this.rule('dark-mode-enable', business),
      darkModePalette: this.rule('dark-mode-palette', business),
      
      primaryButton: this.rule('button-primary', business),
      secondaryButton: this.rule('button-secondary', business),
      buttonGrouping: this.rule('button-grouping', business),
      
      heroGradient: this.rule('gradient-hero', business),
      buttonGradient: this.rule('gradient-button', business),
      
      cardShadow: this.rule('shadow-card', business),
      hoverShadow: this.rule('shadow-hover', business),
      
      headingFont: this.rule('typography-heading', business),
      bodyFont: this.rule('typography-body', business),
      typographyScale: this.rule('typography-scale', business),
      
      spacingDensity: this.rule('spacing-density', business),
      componentGap: this.rule('spacing-gap', business),
      
      animationIntensity: this.rule('animation-intensity', business),
      hoverEffect: this.rule('animation-hover', business),
      
      iconStyle: this.rule('icon-style', business),
      photoStyle: this.rule('photo-style', business),
      
      mobileStackOrder: this.rule('mobile-stack-order', business),
      mobileButtonBehavior: this.rule('mobile-button-behavior', business),
    };
    
    return decisions;
  }
  
  rule(decision: string, business: BusinessProfile): any {
    // Load rules for this decision type
    const rules = this.getRulesForDecision(decision);
    
    // Filter by conditions
    const matching = rules.filter(r => this.evaluateCondition(r.trigger.condition, business));
    
    // Sort by priority (higher first)
    matching.sort((a, b) => b.priority - a.priority);
    
    // Return highest-priority match or fallback
    return matching[0]?.output.value || rules.find(r => r.priority === 0)?.output.value;
  }
  
  evaluateCondition(condition: string, business: BusinessProfile): boolean {
    // Safe evaluation of condition string against business object
    const context = {
      ...business,
      emergencyService: business.emergencyFocused || ['plumbing', 'hvac', 'electrical'].includes(business.vertical),
      trustMature: business.yearsInBusiness >= 3,
      trustedEstablished: business.yearsInBusiness >= 10,
      highSocialProof: business.reviewCount >= 500,
      veryHighSocialProof: business.reviewCount >= 1000,
      visualTrade: business.portfolioHeavy || ['landscaping', 'roofing', 'renovation'].includes(business.vertical),
    };
    
    // Safely evaluate the condition
    return this.safeEval(condition, context);
  }
}
```

---

## Usage Example: Complete Site Build

Given this business profile:

```typescript
const pizzaRepairBusiness = {
  vertical: 'appliance-repair',
  yearsInBusiness: 6,
  reviewCount: 287,
  teamSize: 2,
  portfolioSize: 45,
  averageProjectValue: 250,
  premiumPositioning: false,
  emergencyFocused: true,
  mobileTraffic: 72,
  guaranteeType: '2-year-warranty',
};
```

The engine decides:

```typescript
{
  heroTemplate: 'hero-minimal-cta', // emergencyFocused + mobile 72%
  primaryColor: '#e11d48', // appliance-repair + emergency (red)
  primaryButton: 'button-call-prominent', // emergency + 72% mobile
  buttonText: '📞 CALL (555) 555-1234',
  darkModeEnabled: false, // emergency focused (high contrast)
  headingFont: 'sans-bold', // emergency services
  spacingDensity: 'spacing-compact', // action-focused
  animationIntensity: 'animation-disabled', // emergency (no distraction)
  testimonialStyle: 'testimonial-bold-quote', // 287 reviews, emergency focus
  servicesGrid: 'grid-2col-highlight-first-service',
  mobileStackOrder: 'stack-cta-first',
  mobileButtonBehavior: 'button-auto-dial', // 72% mobile
}
```

Result: A **fast, action-focused website** with minimal animations, bold calls, and emergency-appropriate design—not a beautiful leisurely luxury site.

---

## Rule Expansion Pattern

To add new design decisions:

1. **Identify the decision** — "What visual/functional choice is this?"
2. **Define the output** — "What are the possible values?"
3. **Create 5-8 rules** — Map business characteristics to outputs
4. **Assign priorities** — Higher = more specific triggers
5. **Set fallback** — Default value if no rules match

Example: Adding a new "logo size" decision:

```typescript
{
  decision: 'logo-size',
  rules: [
    { priority: 80, condition: 'premiumPositioning', output: { value: '200px', rationale: 'Premium = spacious branding' } },
    { priority: 60, condition: 'emergencyFocused', output: { value: '120px', rationale: 'Emergency = content-first' } },
    { priority: 50, condition: 'soloOperator', output: { value: '150px', rationale: 'Solo = personal brand emphasis' } },
    { priority: 20, condition: 'default', output: { value: '160px', rationale: 'Standard sizing' } },
  ]
}
```

This ensures **every visual decision** flows from business data through clear, deterministic rules.

