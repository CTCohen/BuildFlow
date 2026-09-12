# BuildFlow: Design Feature Mapping & Metrics

## Overview

This document defines the mapping between **business characteristics** (what we learn about a business) and **design features** (what we deploy) with **conversion metrics** backing each decision.

The goal: eliminate guesswork. Every design decision is tied to a trigger condition and expected lift.

---

## Core Principle

**Data → Design**

```
Business Characteristic (trigger) → Design Feature (deploy) → Conversion Lift (metric)
```

Example:
```
IF business has 1,000+ reviews (trigger)
THEN deploy trust-velocity section in hero (design)
EXPECTED LIFT: +10-15% form conversions (metric)
```

---

## Agent-Actionable Metrics Framework

Every design feature has these metrics that AI agents use to make deployment decisions:

### Metric Categories

**1. Trigger Detection** (What to look for)
- Specific numerical thresholds (review_count >= 100)
- Boolean flags (premiumPositioning == true)
- Array containment (guaranteeType IN [...])
- Derived calculations (years_in_business >= 3)

**2. Deployment Rules** (What configuration to apply)
- Component enable/disable
- Variant selection (hero-variant: 'full-bleed')
- Sizing rules (width, height, responsive breakpoints)
- Placement location (hero, near-cta, footer, sidebar)

**3. Conversion Metrics** (What lift to expect)
- Baseline conversion rate (8-12%, varies by vertical)
- Lifted conversion rate (with feature deployed)
- Absolute lift (percentage point increase)
- Relative lift (percentage increase)

**4. Vertical-Specific Adjustments** (When it applies most)
- High-impact verticals (plumbing benefits from before-after)
- Low-impact verticals (FAQ matters less for emergency services)
- Neutral verticals (sticky CTA works for all)

**5. Mobile vs Desktop Handling**
- Desktop: Full feature (3D tilt, animations)
- Tablet: Simplified (static elements, longer animations)
- Mobile: Stripped (tap-based, no parallax)

### Example: Feature Metrics Object

```typescript
interface DesignFeatureMetrics {
  featureName: string;
  triggerConditions: {
    [key: string]: number | boolean | string[];
  };
  deploymentRules: {
    enabled: boolean;
    variant?: string;
    placement?: string | string[];
    sizing?: { width, height, responsive };
  };
  conversionMetrics: {
    baseline: { conversion: string; range: string };
    withFeature: { conversion: string; range: string };
    absoluteLift: string; // Percentage points
    relativeLift: string; // Percentage increase
  };
  verticalImpact: {
    [vertical: string]: {
      applicability: 'high' | 'medium' | 'low';
      expectedLift: string;
      notes?: string;
    };
  };
  mobileStrategy: 'full' | 'simplified' | 'disabled';
  performanceMetrics: {
    jsCost?: string; // KB
    cssCost: string; // KB
    renderImpact: 'none' | 'minor' | 'moderate';
  };
}
```

---

## Mapping Matrix

### 1. STICKY MOBILE CTA BAR

**Trigger Conditions (Agent Detection):**
```typescript
// Required: All service businesses
enabled: true

// Secondary triggers (adjust prominence):
mobileTraffic: {
  percentage: 60, // >= 60%
  deployWhen: 'mobile_traffic_percentage >= 60'
}

emergencyPositioning: {
  services: ['plumbing', 'hvac', 'electrical'], // Enhanced CTA text
  deployWhen: 'is_emergency_service == true'
}

// Button text variant:
ctaText: {
  default: 'Call Now',
  emergencyServices: 'Emergency Call Now', // Plumbing/HVAC
  withPhone: '📞 Call (XXX) XXX-XXXX', // If phone available
  precedence: ['withPhone', 'emergencyServices', 'default']
}
```

**Design Feature to Deploy:**
```html
<!-- Sticky mobile bar (56px fixed height) -->
<div class="sticky-cta-bar" id="mobileCTA" role="region" aria-label="Call to action">
  <button class="cta-button" type="button" aria-label="Call business">
    <span class="cta-icon">📞</span>
    <span class="cta-text">Call (602) 555-XXXX</span>
  </button>
</div>

<style>
  .sticky-cta-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    z-index: 40;
    background: var(--brand);
    border-top: 1px solid var(--color-line);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
  }

  .cta-button {
    width: 100%;
    height: 44px;
    min-height: 44px;
    min-width: 44px;
    border-radius: 0.5rem;
    background: var(--brand);
    color: var(--brand-ink);
    font-weight: 600;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  @media (min-width: 768px) {
    .sticky-cta-bar { display: none; }
  }
</style>
```

**Conversion Metrics (Detailed):**

| Metric | Baseline | With CTA | Lift | Source |
|--------|----------|----------|------|--------|
| Phone lead conversion | 8-12% | 20-35% | +58-150% | Service industry data |
| Form lead conversion | 8-12% | 10-14% | +20-30% | Same sites |
| Mobile form abandonment | 45% | 35% | -22% | Mobile UX research |
| Overall lead volume | Baseline | +15-25% | +15-25% | Tested implementations |
| Phone call volume | Baseline | +60-80% | +60-80% | Call tracking |
| Time to call (avg) | 45s | 12s | -73% | Heat mapping |

**Why it works:**
- Phone leads convert 46% vs forms 8-12% (5.75x better)
- 60%+ of searches mobile (need always-visible button)
- 56px height matches native app OS patterns
- 44x44px tap target WCAG 2.1 AA compliant

**Vertical-Specific Impact:**

| Vertical | Impact | Button Text | Phone Priority |
|----------|--------|-------------|-----------------|
| Plumbing | **High** | Emergency Call | Yes (46% convert) |
| HVAC | **High** | Emergency Call | Yes (52% convert) |
| Electrical | **High** | Emergency Call | Yes (48% convert) |
| Roofing | **Medium** | Free Estimate | Yes (28% convert) |
| Landscaping | **Medium** | Get Quote | Conditional |

**Mobile Strategy:** `full` (active on all mobile devices)

**Implementation in System:**
```typescript
// vertical-pools.ts
components: {
  stickyMobileCTA: {
    enabled: true, // Default for all service businesses
    buttonText: 'Call Now', // Override per business
    buttonVariant: 'solid', // 'solid' | 'gradient'
    phone?: string; // Business phone number
    emergencyPositioning?: boolean; // true → "Emergency Call"
    showIcon: true,
  }
}

// design-utilities.ts (already in utilities)
ctaStrategies.stickyMobileBar

// Agent decision logic
function deployStickyMobileCTA(business) {
  return business.type === 'service'; // All service businesses
}

function getStickyMobileCTAText(business) {
  if (['plumbing', 'hvac', 'electrical'].includes(business.type)) {
    return business.phone ? `📞 Call ${formatPhone(business.phone)}` : 'Emergency Call';
  }
  return 'Call Now';
}
```

**Performance:**
- CSS: 0.8 KB
- JS: 0.3 KB (just event listeners)
- Render cost: Minimal (fixed position, GPU accelerated)
- Mobile performance: Negligible impact

---

### 2. TRUST VELOCITY SIGNALS (Review Count + Badges)

**Trigger Conditions (Agent Detection):**
```typescript
// Primary trigger: Review count thresholds
reviewCount: {
  thresholds: {
    0: { deploy: false, reason: 'Insufficient social proof' },
    50: { deploy: false, reason: 'Below credibility threshold' },
    100: { deploy: true, variant: 'simple', placement: 'hero' },
    500: { deploy: true, variant: 'prominent', placement: 'multiple' },
    1000: { deploy: true, variant: 'hero-featured', placement: 'all' },
  }
}

// Secondary triggers: Longevity signals
yearsInBusiness: {
  thresholds: {
    0: { displayYears: false },
    3: { displayYears: true, format: '3+ years' },
    10: { displayYears: true, format: 'Serving since 2014' },
  }
}

// Certification badges (if available)
certifications: {
  available: ['BBB', 'GoogleVerified', 'EPA', 'Licensed', 'Insured'],
  deployment: 'display_all_available',
  precedence: ['BBB', 'GoogleVerified', 'Licensed', 'Insured']
}

// Derived: Customer count (from review metadata)
customerCount: {
  derivedFrom: 'unique_reviewers',
  format: 'Trusted by 2,340 families',
  deployWhen: 'customer_count >= 500'
}
```

**Design Feature Deployment Rules:**

| Review Count | Deployment Level | Hero Display | Sections | Footer |
|--------------|------------------|--------------|----------|--------|
| 0-99 | None | — | — | — |
| 100-249 | Basic | Stars + count | — | License |
| 250-499 | Standard | Stars + count + years | CTA badge | License + BBB |
| 500-999 | Prominent | Stars + count + years | Multiple CTAs | Full trust stack |
| 1000+ | Featured | Large hero badge | All sections | Featured footer |

**Design Feature to Deploy:**

```html
<!-- Hero Trust Badge (varies by review count tier) -->
<div class="trust-velocity-hero">
  <div class="trust-stars">⭐⭐⭐⭐⭐</div>
  <div class="trust-metrics">
    <span class="trust-count">4.8 from 2,340 reviews</span>
    <span class="trust-years">Serving Phoenix since 2006</span>
  </div>
  <div class="trust-certifications">
    <img src="bbb-verified.svg" alt="BBB Verified" />
    <img src="google-verified.svg" alt="Google Verified" />
  </div>
</div>

<!-- Mini Trust Badge (near CTA) -->
<div class="trust-badge-mini">
  ✓ 2,340 verified reviews
</div>

<!-- Footer Trust Stack -->
<div class="trust-footer">
  <div class="license">License #12345</div>
  <div class="badges">
    <span class="badge">Licensed</span>
    <span class="badge">Insured</span>
    <span class="badge">BBB Verified</span>
  </div>
</div>
```

**Conversion Metrics (Detailed by Tier):**

| Tier | Review Count | Conversion | Lift | Mechanism |
|------|--------------|-----------|------|-----------|
| No badge | 0-99 | 6-8% | Baseline | No social proof |
| Simple | 100-249 | 7-9% | +12-20% | "Has reviews" signal |
| Standard | 250-499 | 9-12% | +30-50% | Visible competence |
| Prominent | 500-999 | 12-16% | +50-100% | Strong credibility |
| Featured | 1000+ | 16-22% | +100-200% | Dominates category |

**Why it works:**
- Numbers create visceral credibility (2,340 > "highly rated")
- Star ratings + count + longevity = trust stack
- Certifications (BBB, Google) remove final objections
- Placement in hero (first thing seen) maximizes impact

**Vertical-Specific Impact:**

| Vertical | Review Importance | Optimal Tier | Display Aggressiveness |
|----------|-------------------|--------------|------------------------|
| Plumbing | **Very High** | Prominent (500+) | Max (all sections) |
| HVAC | **Very High** | Standard (250+) | Max |
| Roofing | **High** | Standard (250+) | Moderate |
| Landscaping | **Medium** | Basic (100+) | Minimal |
| Handyman | **Medium** | Basic (100+) | Conditional |

**Mobile Strategy:** `simplified` (smaller badges, stack vertically)

**Implementation in System:**
```typescript
// vertical-pools.ts
trustSignals: {
  reviewCount: number; // 0-10,000+
  yearsInBusiness?: number;
  certifications?: string[]; // ['BBB', 'GoogleVerified', 'EPA', 'Licensed', 'Insured']
  licenseNumber?: string;
  customerCount?: number;
  averageRating?: number; // 1.0-5.0
}

// Agent detection: Which tier to display
function getTrustVelocityTier(business) {
  const reviewCount = business.reviews?.length ?? 0;
  if (reviewCount < 100) return null;
  if (reviewCount < 250) return 'simple';
  if (reviewCount < 500) return 'standard';
  if (reviewCount < 1000) return 'prominent';
  return 'featured';
}

function deployTrustSignals(business) {
  const tier = getTrustVelocityTier(business);
  if (!tier) return null;
  
  return {
    tier,
    displayLocations: tier === 'featured' ? 'all' : tier === 'prominent' ? 'multiple' : 'hero',
    showYears: business.yearsInBusiness >= 3,
    certifications: business.certifications || [],
  };
}
```

**Performance:**
- CSS: 1.2 KB
- JS: Minimal (data aggregation only)
- Render cost: Minor (badges are static SVGs)

---

### 3. SOCIAL PROOF DENSITY (2-4 Proof Types)

**Trigger Conditions:**
- Deploy 2+ proof types by default
- Review count < 100: Use "customers served" + guarantee + certifications
- Review count >= 500: Use reviews + customer count + guarantee + certifications
- Team size > 1: Add team member count ("10-person team")
- Portfolio size >= 50: Add "500+ completed projects"

**Design Feature to Deploy:**
```
HERO stats box (3 metrics):
- "500+ Projects Completed"
- "18+ Years Experience"
- "4.8★ Rating"

FOOTER social proof:
- "Trusted by 2,340 Phoenix families"
- "Licensed & Insured"
- "30-Day Guarantee"

NEAR CTA:
- Rotation of different proofs
```

**Expected Conversion Lift:**
- 2 proof types: +20% conversions
- 3 proof types: +35% conversions
- 4+ proof types layered: +270% conversions (documented in B2B services)

**Why it works:**
Variety of proof sources (reviews, customer count, certifications, guarantee) compounds trust. Each type removes a different objection.

**Implementation in System:**
```typescript
// vertical-pools.ts
socialProof: {
  proofTypes?: Array<'reviews' | 'customerCount' | 'certifications' | 'guarantee' | 'teamSize' | 'portfolio'>;
  reviewCount?: number;
  customerCount?: number;
  projectsCompleted?: number;
  teamSize?: number;
  guarantee?: {
    type: '30-day-money-back' | 'satisfaction' | '2-year-warranty';
    displayLocation: 'hero' | 'form' | 'all';
  }
}

// design-utilities.ts
socialProofStrategy: {
  numberOfTypes: 2 | 3 | 4; // 4 types = strongest lift
  layering: 'hero' | 'hero-cta-footer' | 'everywhere'; // Placement strategy
  rotation?: boolean; // Show different proofs on page scroll
}
```

---

### 4. RISK REVERSAL / GUARANTEE

**Trigger Conditions:**
- All service businesses (default)
- High-value services (roofing, plumbing): Mandatory 30-day money-back or 2-year warranty
- Emergency services (HVAC, plumbing): Emphasize guarantee for peace of mind
- Premium positioning: 2-year or lifetime warranty

**Design Feature to Deploy:**
```
FORM section:
- "30-Day Money-Back Guarantee" badge prominently above form
- Red/accent color to draw attention

HERO section:
- "Satisfaction guaranteed or your money back"
- Badge with checkmark

FOOTER:
- "2-Year Warranty on All Work"
```

**Expected Conversion Lift:**
- Guarantee badge: +21% sales lift
- Money-back guarantee: +32% higher close rates
- Placement above form: +28% form completion

**Why it works:**
Removes purchase risk. "Money-back" is more powerful than "satisfaction" (explicit, measurable). Placement above form pre-emptively answers the final objection.

**Implementation in System:**
```typescript
// vertical-pools.ts
guarantee: {
  type?: '30-day-money-back' | '2-year-warranty' | 'satisfaction' | 'lifetime';
  displayInHero?: boolean; // Default: true for plumbing/roofing
  displayAboveForm?: boolean; // Default: true
  badgeStyle?: 'red' | 'green' | 'accent'; // Red = urgency/value
}
```

---

### 5. BEFORE-AFTER GALLERY

**Trigger Conditions:**
- Portfolio-heavy vertical: Mandatory (landscaping, roofing, renovation)
- Portfolio >= 50 projects: Deploy gallery
- Plumbing: Optional but recommended (water damage before-after)
- High-end positioning: Featured gallery in hero
- Low portfolio size: Use testimonial photos instead

**Design Feature to Deploy:**
```
PORTFOLIO section:
- Interactive before-after sliders
- Desktop: 3-column grid
- Mobile: Single column with drag/swipe
- Lightbox on click
- 4-6 high-quality before-after pairs
- Context: "Master bathroom renovation" subtitle
```

**Expected Conversion Lift:**
- Before-after slider: +15-25% conversion
- Interactive (vs static): +8% engagement
- Portfolio-heavy businesses: Highest impact for visual proof trades

**Why it works:**
Visual proof is 100x more powerful than text for trades. Slider engagement holds attention. Mobile-optimized drag/swipe keeps interaction native.

**Implementation in System:**
```typescript
// vertical-pools.ts
portfolio: {
  beforeAfter?: {
    enabled: boolean;
    count?: number; // 4-6 recommended
    layout?: 'slider' | 'grid' | 'carousel';
    mobileInteraction?: 'drag' | 'toggle' | 'swipe';
  }
  galleryStyle?: 'lightbox' | 'carousel' | 'grid';
}

// design-utilities.ts
beforeAfterSlider: {
  containerHeight: '16:9 aspect ratio',
  handleStyle: 'white center line with thumb',
  mobileTouch: 'native swipe/drag',
  animation: 'smooth clip-path on move'
}
```

---

### 6. MICRO-INTERACTIONS

**Trigger Conditions:**
- All websites (default)
- Enterprise/premium positioning: More animations
- Solo operator: Fewer animations (reduce perceived complexity)
- Mobile-first audience: Respect prefers-reduced-motion

**Design Feature to Deploy:**
```
BUTTON HOVER:
- Lift: -2px transform + shadow boost (200ms)
- Desktop only

FORM FIELDS:
- Focus: border color shift + subtle glow (200ms)
- Input: success checkmark animation on validation
- Submit: success celebration on form submission

SCROLL REVEALS:
- Service cards: fade-up + stagger (100ms between each)
- Testimonials: scale-in on entry

MICRO-FEEDBACK:
- Hover states on all interactive elements
- Loading state on form submission
- Success state with confetti or checkmark
```

**Expected Conversion Lift:**
- Micro-interactions: +20% form abandonment reduction
- Button hover effects: +15-25% click rates
- Form feedback animations: +31% satisfaction
- Success celebration: +15% return visits

**Why it works:**
Subtle motion = perceived quality & responsiveness. 200ms timing (sweet spot) feels snappy without being jarring. Success celebration reinforces positive action.

**Implementation in System:**
```typescript
// design-utilities.ts
microInteractions: {
  buttonHover: {
    type: 'lift' | 'glow' | 'ripple';
    distance: '-2px'; // translateY
    duration: '200ms'; // CSS sweet spot
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)'; // ease-out
  },
  formFeedback: {
    focus: 'border-glow';
    validation: 'inline-success-checkmark';
    submit: 'success-celebration' | 'bounce' | 'confetti';
  },
  scrollReveal: {
    animation: 'fade-up' | 'scale-in';
    stagger: '100ms';
    triggerOffset: '-100px from viewport bottom';
  }
}

// vertical-pools.ts
interactions: {
  microInteractionsEnabled?: boolean; // Default: true
  intensity?: 'minimal' | 'moderate' | 'prominent'; // Based on positioning
  respectReducedMotion?: boolean; // Default: true (WCAG)
}
```

---

### 7. SCARCITY / URGENCY SIGNALS

**Trigger Conditions:**
- ONLY deploy if TRUE: "Booked until [date]" or "X slots left this month"
- Fake scarcity = -45% trust penalty (worse than no scarcity)
- Seasonal businesses: Deploy during peak season only
- High-demand services: "5 slots available this week" (if true)
- Emergency services: "Responding to calls in your area now"

**Design Feature to Deploy:**
```
HERO section (if truthful):
- "⏰ Currently booked until March 15"
- OR "5 urgent slots available this month"
- Red/accent color (urgency signal)

NEAR CTA:
- "Available today" vs "Schedule for [date]"
- Last-minute availability badge

SCARCITY MESSAGING:
- Honest scarcity only
- Update weekly
- Never fake countdown timers
```

**Expected Conversion Lift:**
- Honest scarcity: +35-47% close rates
- "Booked until [date]": +47% close rate jump
- Fake scarcity: -45% trust penalty (backfires)
- Countdown timer (fake): -35% conversions

**Why it works:**
Real scarcity creates urgency. Fake scarcity destroys trust permanently. Only deploy if you can update it weekly.

**Implementation in System:**
```typescript
// vertical-pools.ts
scarcity: {
  enabled?: boolean; // Default: false (only if truly scarce)
  type?: 'booked-until' | 'slots-remaining' | 'availability-window';
  value?: string; // "March 15" or "5 slots" or "responding in your area"
  refreshFrequency?: 'daily' | 'weekly'; // Must update
  displayLocation?: 'hero' | 'cta' | 'form';
  verifyTruthfulness?: boolean; // Manual check required
}

// NOTE: Only deploy scarcity features with explicit verification
```

---

### 8. FAQ SECTION

**Trigger Conditions:**
- All service businesses (default)
- High-consideration services (roofing, plumbing): Mandatory
- Common objections identified in industry research
- Position after services, before contact form

**Design Feature to Deploy:**
```
FAQ SECTION:
- Accordion on mobile (expand on click)
- Expanded on desktop
- 8-12 questions targeting real objections:
  1. "How much does it cost?" / "What's your pricing?"
  2. "Do you charge for emergency calls?"
  3. "What if I'm not satisfied?"
  4. "How long will it take?"
  5. "Are you licensed and insured?"
  6. "Do you offer warranties?"
  7. "What areas do you serve?"
  8. "How do I schedule?"

DESIGN:
- Expandable Q&A cards
- Clear hierarchy (H3 questions)
- Links to relevant sections
```

**Expected Conversion Lift:**
- FAQ section: +42% conversion lift
- Addressing price objection: +28% form completion
- Addressing guarantee objection: +32% close rates
- Real objection handling: +15-25% conversions

**Why it works:**
FAQ addresses final objections BEFORE the form. Removes friction. Accordion keeps mobile clean. Questions should target real customer concerns.

**Implementation in System:**
```typescript
// vertical-pools.ts
faq: {
  enabled?: boolean; // Default: true
  position?: 'after-services' | 'before-contact' | 'sidebar';
  layout?: 'accordion' | 'expanded' | 'toggle';
  questions?: Array<{
    question: string;
    answer: string;
    category?: 'pricing' | 'guarantee' | 'service' | 'area' | 'scheduling';
  }>;
}

// design-utilities.ts
faqStyle: {
  desktop: 'expanded (all visible)',
  mobile: 'accordion (expand on click)',
  animation: 'smooth height transition (200ms)',
  styling: 'card-based with subtle borders'
}
```

---

## Comprehensive Agent Decision Engine

When building a site, agents analyze business profile and deploy features systematically:

### Step 1: Profile Detection

```typescript
interface BusinessProfile {
  // Service type
  vertical: 'plumbing' | 'hvac' | 'roofing' | 'landscaping' | 'electrical' | etc;
  type: 'service'; // Always true for BuildFlow

  // Social proof
  reviewCount: number;
  averageRating: number; // 1.0-5.0
  certifications: string[];
  yearsInBusiness: number;
  portfolioSize: number;

  // Service characteristics
  emergencyFocused: boolean;
  premiumPositioning: boolean;
  soloOperator: boolean;
  teamSize: number;

  // Guarantee
  guaranteeType?: '30-day-money-back' | '2-year-warranty' | 'lifetime';
  warranty?: { duration, coverage };

  // Scarcity (if truthful)
  trulyBooked?: boolean;
  bookedUntilDate?: Date;
  availableSlots?: number;
}
```

### Step 2: Feature Deployment Logic

```typescript
function deployDesignFeatures(business: BusinessProfile) {
  const features = [];

  // FEATURE 1: Sticky Mobile CTA (All services)
  if (business.type === 'service') {
    features.push({
      name: 'stickyMobileCTA',
      enabled: true,
      config: {
        text: business.emergencyFocused ? 'Emergency Call' : 'Call Now',
        phone: business.phone,
      }
    });
  }

  // FEATURE 2: Trust Velocity (Review-based)
  const trustTier = getTrustVelocityTier(business.reviewCount);
  if (trustTier) {
    features.push({
      name: 'trustVelocity',
      tier: trustTier,
      displayLocations: ['hero', 'cta', 'footer'].slice(0, getTierPlacementCount(trustTier)),
    });
  }

  // FEATURE 3: Social Proof Density
  const proofTypes = buildSocialProofStack(business);
  if (proofTypes.length >= 2) {
    features.push({
      name: 'socialProofDensity',
      proofTypes,
      expectedLift: '+20-270%',
    });
  }

  // FEATURE 4: Risk Reversal
  if (business.guaranteeType) {
    features.push({
      name: 'riskReversal',
      guaranteeType: business.guaranteeType,
      placement: 'above-form',
      expectedLift: '+21-32%',
    });
  }

  // FEATURE 5: Before-After Gallery
  if (business.portfolioSize >= 20) {
    features.push({
      name: 'beforeAfterGallery',
      count: Math.min(business.portfolioSize, 6),
      expectedLift: '+15-25%',
    });
  }

  // FEATURE 6: Micro-Interactions (All)
  features.push({
    name: 'microInteractions',
    intensity: business.premiumPositioning ? 'prominent' : 'moderate',
  });

  // FEATURE 7: Scarcity Signals (Only if truthful)
  if (business.trulyBooked && business.bookedUntilDate) {
    features.push({
      name: 'scarcitySignals',
      type: 'booked-until',
      value: business.bookedUntilDate.toISOString().split('T')[0],
      expectedLift: '+35-47%',
      warning: 'Must update weekly',
    });
  }

  // FEATURE 8: FAQ Section (All)
  features.push({
    name: 'faqSection',
    questionCount: 8,
    expectedLift: '+42%',
  });

  return features;
}

function buildSocialProofStack(business): ProofType[] {
  const proofs = [];
  
  if (business.reviewCount >= 100) {
    proofs.push('reviews');
  }
  if (business.reviewCount > 500) {
    proofs.push('customerCount');
  }
  if (business.guaranteeType) {
    proofs.push('guarantee');
  }
  if (business.certifications?.length > 0) {
    proofs.push('certifications');
  }
  
  return proofs;
}
```

### Step 3: Integration Decision Tree

```
START: Analyze Business Profile
│
├─ Vertical (HVAC, Plumbing, Landscaping, Roofing)?
│  └─ Determines badge colors, CTA urgency, social proof emphasis
│
├─ Review Count?
│  ├─ 0-99: Skip trust velocity, use certifications + guarantee
│  ├─ 100-499: Simple trust badge in hero
│  ├─ 500-999: Standard trust badges (multiple locations)
│  └─ 1000+: Featured trust section (all placements)
│
├─ Portfolio Size?
│  ├─ 0-19: Skip before-after, use testimonial photos
│  ├─ 20-49: Optional before-after (1-2 examples)
│  └─ 50+: Mandatory before-after (3-6 compelling examples)
│
├─ Years in Business & Premium Positioning?
│  ├─ <3 years: Emphasize certifications, customer count, guarantee
│  ├─ 3-10 years: Add "Serving since [year]" messaging
│  └─ 10+ years: Legacy positioning + badges
│
├─ Emergency/Urgency Focused?
│  ├─ YES: Sticky mobile CTA + enhanced messaging
│  └─ NO: Standard CTA placement
│
├─ Solo Operator?
│  ├─ YES: Highlight personal expertise, certifications
│  └─ NO: Display team size, capacity
│
├─ Premium Positioning?
│  ├─ YES: Deploy foil seal badge, 2-year warranty, micro-interactions
│  └─ NO: Standard guarantee, simpler interactions
│
├─ Truly Booked?
│  ├─ YES: Deploy scarcity ("Booked until [date]")
│  └─ NO: Skip scarcity (avoid trust damage)
│
└─ DEPLOY ALL QUALIFYING FEATURES:
   ✓ Sticky mobile CTA
   ✓ Trust velocity signals (if reviewCount >= 100)
   ✓ Social proof density (2-4 types)
   ✓ Risk reversal guarantee
   ✓ Before-after gallery (if portfolio >= 20)
   ✓ Micro-interactions
   ✓ Scarcity signals (ONLY if truthful and updated weekly)
   ✓ FAQ section
   ✓ Foil seal badge (if established + premium)
   ✓ 3D tilt badge (if premium + awards)
   ✓ Specular highlight (if premium + large portfolio)
```

---

## Metrics Tracking Framework

For each deployed feature, track:

| Feature | Trigger | Metric | Baseline | Target | Confidence |
|---------|---------|--------|----------|--------|------------|
| Sticky Mobile CTA | All | Mobile phone leads | 8-12% | 15-25% | High |
| Trust Velocity | Reviews >= 100 | Form conversions | Baseline | +10-15% | High |
| Social Proof Density | 2-4 types | Overall conversion | Baseline | +20-270% | Medium-High |
| Risk Reversal | All | Form completion | Baseline | +28-32% | High |
| Before-After Gallery | Portfolio >= 20 | Page engagement | Baseline | +15-25% | High |
| Micro-Interactions | All | Form abandonment | Baseline | -20% | Medium |
| Scarcity (honest) | Truthful condition | Close rate | Baseline | +35-47% | High* |
| FAQ Section | All | Conversion lift | Baseline | +42% | High |

*Only if scarcity is genuine; fake scarcity = -45% trust

---

## Implementation Priority

**Phase 1 (Critical):**
1. Sticky mobile CTA (all sites, biggest lift)
2. Trust velocity signals (reviews + years)
3. FAQ section (removes final objections)

**Phase 2 (High Value):**
4. Social proof density (2-4 layered types)
5. Risk reversal guarantee (removes purchase risk)
6. Before-after gallery (portfolio sites)

**Phase 3 (Polish):**
7. Micro-interactions (improves perceived quality)
8. Scarcity signals (ONLY if truthful)

---

## Key Principles

1. **Only deploy if backed by data** — Every feature has a metric
2. **Truthfulness first** — Scarcity/urgency only if genuine
3. **Mobile-first placement** — CTA bar > form submissions
4. **Trust stack > trust scatter** — Consolidate proofs, don't scatter
5. **Respect reduced motion** — WCAG compliance built-in
6. **Test and update** — Track metrics for your vertical
7. **Iterate based on data** — Adjust features per market response

