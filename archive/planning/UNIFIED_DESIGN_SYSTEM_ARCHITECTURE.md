# BuildFlow: Unified Design System Architecture

## Overview

**Four-layer system combining our complete design feature mapping with deterministic-yet-diverse variant selection.**

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 1: DECISION RULES (Deterministic)                         │
│ Business data → Design categories (high-level)                  │
│ Output: Category selections + Feature flags                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│ Layer 2: VARIANT POOLS (Pre-designed options)                   │
│ Each category has 3-5 visual implementations                    │
│ (Our existing templates become variants)                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│ Layer 3: SEEDED SELECTION (Reproducible diversity)              │
│ Hash(business.id) → Select variant from pool                   │
│ Same business = same variant (deterministic)                   │
│ Different business = different variant (diverse)               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│ Layer 4: TOKEN SYSTEM + FEATURE RULES (Detailed)                │
│ Apply colors, typography, spacing, animations (tokens)         │
│ Deploy specific features: badges, guarantees, scarcity, FAQs    │
│ Feature-specific IF/THEN rules layer on top                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Decision Rules (High-Level Categorization)

Rules map business data to **categories**, not directly to implementations.

### Hero Template Category Decision

```typescript
function decideHeroCategory(business: BusinessProfile): HeroCategory {
  // Rule priority order (check highest priority first)
  
  if (business.emergencyFocused && business.mobileTraffic >= 60) {
    return 'emergency-mobile'; // High priority: emergency + mobile
  }
  
  if (business.portfolioHeavy && business.portfolioSize >= 20) {
    return 'portfolio-visual'; // Portfolio = visual proof priority
  }
  
  if (business.premiumPositioning && business.yearsInBusiness >= 10) {
    return 'premium-established'; // Premium + maturity = elegance
  }
  
  if (business.reviewCount >= 500) {
    return 'trust-dominant'; // High social proof = trust-focused
  }
  
  if (business.multiLocation && business.teamSize >= 3) {
    return 'geographic-capacity'; // Multiple areas = show coverage
  }
  
  if (business.soloOperator && business.reviewCount >= 100) {
    return 'personal-expertise'; // Solo + trust = personal brand
  }
  
  // Default
  return 'standard-balanced';
}

// Output: Category (string)
// Each category has 3-5 variants in the pool
```

### Other Decision Rules (Similar Pattern)

```typescript
function decideColorCategory(business: BusinessProfile): ColorCategory {
  if (business.emergencyFocused) return 'emergency-warm'; // Red/orange
  if (business.premiumPositioning) return 'premium-refined'; // Deeper tones
  if (business.visual_trade) return 'visual-vibrant'; // Richer colors
  return 'standard-professional'; // Industry-standard colors
}

function decideSpacingCategory(business: BusinessProfile): SpacingCategory {
  if (business.premiumPositioning) return 'spacious-luxury';
  if (business.emergencyFocused) return 'compact-action-focused';
  if (business.soloOperator) return 'comfortable-approachable';
  return 'standard-balanced';
}

function decideAnimationCategory(business: BusinessProfile): AnimationCategory {
  if (business.premiumPositioning) return 'subtle-refined';
  if (business.emergencyFocused) return 'disabled-high-contrast';
  if (business.soloOperator && business.trustMature) return 'gentle-personal';
  return 'standard-responsive';
}

// ... one function per decision category
```

**Key principle:** Rules output a **category**, not a specific implementation.

---

## Layer 2: Variant Pools (Pre-Designed Implementations)

Each category has 3-5 variants. These are our existing templates, color schemes, component styles.

### Hero Variant Pool

```typescript
export const heroVariantPool = {
  'emergency-mobile': [
    {
      id: 'emergency-mobile-minimal-accent-bar',
      description: 'Left accent bar, minimal text, large CTA',
      template: 'HeroMinimalAccentBar.astro',
      layout: 'full-bleed-accent-left',
      headline: 'ultra-large', // 3.2rem
      accentBar: 'left-4px',
      ctaPosition: 'center-prominent',
      ctaSize: 'large-56px',
      backgroundType: 'solid-with-accent',
      mobileHeight: '280px',
      desktopHeight: '500px',
      colorTokenAxes: ['primary-red', 'accent-orange'], // Variants within this variant
      typographyTokenAxes: ['sans-bold'],
      animationIntensity: 'none', // Emergency = high contrast
    },
    {
      id: 'emergency-mobile-call-bold',
      description: 'Bold "EMERGENCY CALL" text centered',
      template: 'HeroCallBold.astro',
      layout: 'text-centered-stacked',
      headline: 'bold-ultra-large', // 3.2rem, all caps
      subheadline: 'small',
      backgroundType: 'gradient-red-orange',
      ctaPosition: 'below-text-prominent',
      ctaSize: 'large-56px',
      mobileHeight: '320px',
      desktopHeight: '600px',
      colorTokenAxes: ['primary-red', 'accent-orange', 'tertiary-yellow'],
      typographyTokenAxes: ['sans-bold', 'sans-extra-bold'],
      animationIntensity: 'disabled',
    },
    {
      id: 'emergency-mobile-urgent-with-badge',
      description: 'Badge + urgency messaging + phone CTA',
      template: 'HeroUrgentBadge.astro',
      layout: 'badge-top-text-cta-bottom',
      badge: 'urgency-badge', // "AVAILABLE NOW" or "EMERGENCY SERVICE"
      headline: 'large-bold',
      backgroundType: 'solid-emergency-color',
      ctaPosition: 'bottom-full-width',
      ctaSize: 'large-56px',
      colorTokenAxes: ['primary-red', 'primary-orange', 'primary-darkred'],
      typographyTokenAxes: ['sans-bold'],
      animationIntensity: 'disabled',
    }
  ],

  'portfolio-visual': [
    {
      id: 'portfolio-visual-image-left',
      description: 'Large image on left, text on right',
      template: 'HeroImageLeft.astro',
      layout: 'split-50-50',
      imageSide: 'left',
      imageRatio: '16:9',
      headline: 'large',
      subheadline: 'medium',
      backgroundType: 'image-focus',
      ctaPosition: 'right-stack',
      mobileLayout: 'stack-image-top',
      colorTokenAxes: ['brand-primary', 'accent-complementary'],
      typographyTokenAxes: ['sans-modern', 'serif-elegant'],
      animationIntensity: 'standard',
    },
    {
      id: 'portfolio-visual-gallery-showcase',
      description: 'Featured image carousel/gallery top, text below',
      template: 'HeroGalleryShowcase.astro',
      layout: 'image-carousel-top',
      imageHeight: '400px',
      imageCarouselType: 'featured-with-thumbnails',
      headline: 'medium',
      subheadline: 'small',
      backgroundType: 'white-minimal',
      colorTokenAxes: ['brand-primary', 'brand-accent'],
      typographyTokenAxes: ['sans-modern'],
      animationIntensity: 'standard',
    },
    {
      id: 'portfolio-visual-split-modern',
      description: 'Diagonal split layout, image and text interleaved',
      template: 'HeroSplitModern.astro',
      layout: 'diagonal-split',
      imagePosition: 'top-right',
      textPosition: 'bottom-left',
      headline: 'large',
      backgroundType: 'gradient-subtle-accent',
      colorTokenAxes: ['brand-primary', 'brand-accent', 'tertiary-gray'],
      typographyTokenAxes: ['sans-modern', 'sans-bold'],
      animationIntensity: 'gentle',
    }
  ],

  'premium-established': [
    {
      id: 'premium-established-elegant-minimal',
      description: 'Text-only, elegant serif, centered, minimal',
      template: 'HeroElegantMinimal.astro',
      layout: 'text-centered-minimal',
      headline: 'elegant-serif', // 2.2rem, serif, refined
      subheadline: 'refined', // 1rem, lighter weight
      backgroundType: 'gradient-subtle-diagonal',
      ctaPosition: 'center-refined',
      ctaStyle: 'ghost-outline', // Subtle button
      spacing: 'spacious', // Extra breathing room
      mobileHeight: '350px',
      desktopHeight: '700px',
      colorTokenAxes: ['primary-deep', 'accent-muted', 'background-light'],
      typographyTokenAxes: ['serif-elegant', 'sans-refined'],
      animationIntensity: 'subtle',
    },
    {
      id: 'premium-established-gradient-subtle',
      description: 'Subtle gradient background, elegant typography',
      template: 'HeroGradientSubtle.astro',
      layout: 'text-centered-with-gradient',
      headline: 'elegant-large', // 2.6rem
      subheadline: 'refined-medium',
      backgroundType: 'gradient-brand-to-accent-subtle',
      ctaPosition: 'center-refined',
      ctaStyle: 'subtle-solid-muted',
      spacing: 'spacious',
      colorTokenAxes: ['primary-deep', 'accent-deep', 'tertiary-white'],
      typographyTokenAxes: ['serif-elegant'],
      animationIntensity: 'subtle-slow', // 400ms vs 200ms
    },
    {
      id: 'premium-established-centered-featured',
      description: 'Image centered, text overlay refined',
      template: 'HeroCenteredFeatured.astro',
      layout: 'image-centered-text-overlay',
      imageFocus: 'center',
      imageOverlay: 'gradient-dark-subtle', // Subtle overlay for text readability
      headline: 'elegant-serif-white',
      subheadline: 'refined-light',
      backgroundType: 'image-premium',
      ctaPosition: 'overlay-center',
      colorTokenAxes: ['primary-dark', 'accent-gold', 'text-white'],
      typographyTokenAxes: ['serif-elegant'],
      animationIntensity: 'subtle',
    }
  ],

  'trust-dominant': [
    {
      id: 'trust-dominant-stats-prominent',
      description: 'Large trust metrics (reviews, ratings, years)',
      template: 'HeroTrustStats.astro',
      layout: 'text-left-trust-stats-right',
      trustElements: ['review-count', 'rating-stars', 'years-in-business'],
      trustBadgeSize: 'large',
      headline: 'large-confidence',
      backgroundType: 'subtle-gradient-accent',
      colorTokenAxes: ['primary-trust-blue', 'accent-warm', 'text-dark'],
      typographyTokenAxes: ['sans-modern', 'sans-bold'],
      animationIntensity: 'standard',
    },
    {
      id: 'trust-dominant-testimonial-featured',
      description: 'Large customer testimonial/quote as hero',
      template: 'HeroTestimonialFeatured.astro',
      layout: 'quote-featured-large',
      quote: 'large-prominent', // 1.5rem, brand color
      author: 'standard',
      rating: 'stars-extra-large',
      backgroundColor: 'white',
      borderLeft: '6px-brand-accent',
      colorTokenAxes: ['primary-trust-blue', 'accent-warm'],
      typographyTokenAxes: ['sans-modern'],
      animationIntensity: 'gentle',
    },
    {
      id: 'trust-dominant-badge-seal-focused',
      description: 'Foil seal badge prominent, trust messaging',
      template: 'HeroTrustBadgeFocus.astro',
      layout: 'badge-prominent-left',
      badge: 'foil-seal-large',
      badgePosition: 'left-center',
      headline: 'medium-confident',
      trustElements: ['review-count-mini', 'years-mini', 'certifications'],
      backgroundType: 'gradient-brand-subtle',
      colorTokenAxes: ['primary-deep', 'badge-gold-silver-copper'],
      typographyTokenAxes: ['sans-modern', 'serif-elegant'],
      animationIntensity: 'subtle',
    }
  ],

  'standard-balanced': [
    {
      id: 'standard-balanced-simple',
      description: 'Basic hero, image or color, centered text, CTA',
      template: 'HeroStandardSimple.astro',
      layout: 'text-centered-cta-below',
      headline: 'standard-large',
      subheadline: 'standard-medium',
      backgroundType: 'solid-or-gradient-brand',
      ctaPosition: 'center-below',
      ctaStyle: 'solid-brand',
      spacing: 'standard',
      colorTokenAxes: ['brand-primary', 'brand-accent'],
      typographyTokenAxes: ['sans-modern'],
      animationIntensity: 'standard',
    },
    {
      id: 'standard-balanced-image-text',
      description: 'Image + text side-by-side',
      template: 'HeroImageText.astro',
      layout: 'split-60-40-text-right',
      imageSide: 'left',
      imageRatio: '4:3',
      headline: 'large',
      backgroundType: 'white-with-image',
      colorTokenAxes: ['brand-primary', 'brand-accent'],
      typographyTokenAxes: ['sans-modern'],
      animationIntensity: 'standard',
    },
    {
      id: 'standard-balanced-full-bleed',
      description: 'Full-bleed color/image, minimal text, max impact',
      template: 'HeroFullBleed.astro',
      layout: 'full-bleed-color',
      backgroundType: 'image-or-gradient-full',
      headline: 'ultra-large-white',
      subheadline: 'medium-light',
      ctaPosition: 'center-prominent',
      colorTokenAxes: ['brand-primary', 'accent-warm', 'text-white'],
      typographyTokenAxes: ['sans-bold'],
      animationIntensity: 'standard',
    }
  ],

  // ... additional categories: geometric-capacity, personal-expertise, standard-balanced
};
```

**Key points:**
- Each variant is a pre-designed, complete implementation
- Variants in same category share a semantic purpose but differ visually
- Each variant specifies design axes (colorTokenAxes, typographyTokenAxes) that can vary within the variant
- Templates reference actual .astro components

---

## Layer 3: Seeded Selection (Deterministic Diversity)

Use business data to deterministically select a variant from the pool.

```typescript
class VariantSelector {
  
  selectHeroVariant(business: BusinessProfile): HeroVariantId {
    // Step 1: Determine category (Layer 1)
    const heroCategory = this.decideHeroCategory(business);
    
    // Step 2: Get variant pool for category (Layer 2)
    const variantsInCategory = heroVariantPool[heroCategory];
    
    // Step 3: Create seed (business identifier)
    const seed = this.createSeed(business);
    
    // Step 4: Select variant deterministically
    const selectedVariantIndex = seed % variantsInCategory.length;
    return variantsInCategory[selectedVariantIndex].id;
  }
  
  createSeed(business: BusinessProfile): number {
    // Use business ID or name as seed
    const identifier = business.id || business.name;
    const hash = this.hashCode(identifier);
    return Math.abs(hash); // Ensure positive number
  }
  
  hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
  
  // Apply to all component categories
  selectServicesLayout(business: BusinessProfile): ServicesLayoutVariantId {
    const category = this.decideServicesCategory(business);
    const variants = servicesVariantPool[category];
    const seed = this.createSeed(business);
    return variants[seed % variants.length].id;
  }
  
  selectColorScheme(business: BusinessProfile): ColorSchemeVariantId {
    const category = this.decideColorCategory(business);
    const variants = colorVariantPool[category];
    const seed = this.createSeed(business);
    return variants[seed % variants.length].id;
  }
  
  selectTestimonialLayout(business: BusinessProfile): TestimonialVariantId {
    const category = this.decideTestimonialCategory(business);
    const variants = testimonialVariantPool[category];
    const seed = this.createSeed(business);
    return variants[seed % variants.length].id;
  }
  
  // ... for each component type
}
```

**Result:**
- Same business (same ID/name) → Always selects same variant (deterministic)
- Different business → Hash differs → Possibly different variant index → Different variant (diverse)
- No randomness, fully reproducible

---

## Layer 4: Token System + Feature-Specific Rules

Within each variant, apply **tokens** (colors, typography, spacing, animations) and deploy **feature-specific rules**.

### Token Application

```typescript
class DesignTokenApplier {
  
  applyTokensToVariant(
    variantId: string, 
    business: BusinessProfile,
    seed: number
  ): DesignTokens {
    
    const variant = this.getVariant(variantId);
    
    // Within the variant, select token options based on seed
    const selectedTokens = {
      color: this.selectColorToken(variant.colorTokenAxes, business, seed),
      typography: this.selectTypographyToken(variant.typographyTokenAxes, business, seed),
      spacing: this.selectSpacingToken(business),
      animation: this.selectAnimationToken(variant.animationIntensity, business),
    };
    
    return selectedTokens;
  }
  
  selectColorToken(availableColors: string[], business: BusinessProfile, seed: number): ColorToken {
    // Option A: Use seed to select from available colors in variant
    if (availableColors.length > 1) {
      const colorIndex = seed % availableColors.length;
      return availableColors[colorIndex];
    }
    
    // Option B: Use business data to select (premium → deeper tones)
    if (business.premiumPositioning) {
      return this.deepenColor(availableColors[0]);
    }
    
    return availableColors[0];
  }
  
  selectTypographyToken(availableTypography: string[], business: BusinessProfile, seed: number): TypographyToken {
    if (availableTypography.length > 1) {
      const typogIndex = seed % availableTypography.length;
      return availableTypography[typogIndex];
    }
    return availableTypography[0];
  }
  
  selectSpacingToken(business: BusinessProfile): SpacingToken {
    // Spacing comes from layer 1 decision (not seeded within variant)
    if (business.premiumPositioning) return 'spacious';
    if (business.emergencyFocused) return 'compact';
    return 'standard';
  }
  
  selectAnimationToken(animationIntensity: string, business: BusinessProfile): AnimationToken {
    // Animation intensity from variant, respect user preferences
    if (this.prefersReducedMotion()) return 'disabled';
    if (business.premiumPositioning && animationIntensity === 'subtle') return 'subtle-slow';
    if (business.emergencyFocused && animationIntensity === 'disabled') return 'disabled';
    return animationIntensity;
  }
}
```

### Feature-Specific Rules (IF/THEN)

These tactical features still use direct IF/THEN (they're not variants, they're binary or specialized):

```typescript
class FeatureDeployer {
  
  deployFeatures(business: BusinessProfile): FeatureDeployment {
    const features = {};
    
    // STICKY MOBILE CTA (Always on for services)
    features.stickyMobileCTA = {
      enabled: true,
      text: business.emergencyFocused ? 'EMERGENCY CALL' : 'Call Now',
      phone: business.phone,
      expectedLift: '+15-25%'
    };
    
    // FOIL SEAL BADGE (Specific IF/THEN)
    if (business.yearsInBusiness >= 5 && 
        business.guaranteeType && 
        business.premiumPositioning) {
      features.foilSealBadge = {
        enabled: true,
        color: this.selectBadgeColor(business.vertical),
        placement: 'hero-bottom-right',
        expectedLift: '+58-150%'
      };
    }
    
    // 3D TILT BADGE (Specific IF/THEN)
    if (business.premiumPositioning && 
        business.yearsInBusiness >= 3 && 
        business.awards?.length >= 1) {
      features.tilt3DBadge = {
        enabled: true,
        placement: 'award-section',
        mobileStrategy: 'static',
        expectedLift: '+25-75%'
      };
    }
    
    // SPECULAR HIGHLIGHT (Specific IF/THEN)
    if (business.premiumPositioning && 
        business.portfolioSize >= 50 && 
        business.yearsInBusiness >= 5) {
      features.specularHighlight = {
        enabled: true,
        placement: ['portfolio-slider', 'testimonial-photo'],
        expectedLift: '+40-100%'
      };
    }
    
    // SCARCITY SIGNALS (ONLY if truthful - specific IF/THEN)
    if (business.trulyBooked && business.bookedUntilDate && this.isDateFresh(business.bookedUntilDate)) {
      features.scarcitySignals = {
        enabled: true,
        type: 'booked-until',
        value: business.bookedUntilDate,
        expectedLift: '+35-47%',
        warning: 'Update weekly or trust penalty'
      };
    }
    
    // TRUST VELOCITY (Tier-based IF/THEN from our mapping)
    const trustTier = this.getTrustVelocityTier(business.reviewCount);
    if (trustTier) {
      features.trustVelocity = {
        enabled: true,
        tier: trustTier,
        displayLocations: this.getTierLocations(trustTier),
        expectedLift: `+${this.getTierLift(trustTier)}%`
      };
    }
    
    // SOCIAL PROOF DENSITY
    const proofStack = this.buildSocialProofStack(business);
    if (proofStack.length >= 2) {
      features.socialProofDensity = {
        enabled: true,
        proofTypes: proofStack,
        expectedLift: '+20-270%'
      };
    }
    
    // BEFORE-AFTER GALLERY (IF/THEN)
    if (business.portfolioSize >= 20) {
      features.beforeAfterGallery = {
        enabled: true,
        count: Math.min(business.portfolioSize, 6),
        expectedLift: '+15-25%'
      };
    }
    
    // FAQ SECTION (Default for all)
    features.faqSection = {
      enabled: true,
      questionCount: 8,
      expectedLift: '+42%'
    };
    
    // ... additional features
    
    return features;
  }
}
```

**Key insight:** Features like badges, guarantees, and scarcity are **binary or tier-based decisions**, not variants. They use targeted IF/THEN rules.

---

## Complete Build Flow

```typescript
class UnifiedDesignEngine {
  
  async buildSite(business: BusinessProfile): Promise<SiteDesign> {
    // Layer 1: Decide categories
    const decisions = {
      heroCategory: this.decideHeroCategory(business),
      servicesCategory: this.decideServicesCategory(business),
      testimonialCategory: this.decideTestimonialCategory(business),
      colorCategory: this.decideColorCategory(business),
      spacingCategory: this.decideSpacingCategory(business),
      animationCategory: this.decideAnimationCategory(business),
      // ... all decision rules from our UNIVERSAL_DESIGN_DECISION_ENGINE
    };
    
    // Layer 2 & 3: Select variants using seed
    const seed = this.createSeed(business);
    const variants = {
      hero: this.selectVariant(decisions.heroCategory, seed),
      services: this.selectVariant(decisions.servicesCategory, seed),
      testimonials: this.selectVariant(decisions.testimonialCategory, seed),
      // ... all variant selections
    };
    
    // Layer 4a: Apply tokens within variants
    const tokens = {
      color: this.selectColorToken(business, seed),
      typography: this.selectTypographyToken(business, seed),
      spacing: this.selectSpacingToken(business),
      animation: this.selectAnimationToken(business),
    };
    
    // Layer 4b: Deploy feature-specific rules
    const features = this.deployFeatures(business);
    
    // Combine all into final design
    const siteDesign = {
      hero: {
        variant: variants.hero,
        template: this.getTemplate(variants.hero),
        tokens: tokens,
        features: features.filter(f => f.placement?.includes('hero'))
      },
      services: {
        variant: variants.services,
        template: this.getTemplate(variants.services),
        tokens: tokens,
      },
      testimonials: {
        variant: variants.testimonials,
        template: this.getTemplate(variants.testimonials),
        tokens: tokens,
        contextualPlacement: features.contextualTestimonials
      },
      colors: {
        primary: tokens.color.primary,
        accent: tokens.color.accent,
        darkModeEnabled: this.shouldEnableDarkMode(business)
      },
      badges: {
        foilSeal: features.foilSealBadge,
        tilt3D: features.tilt3DBadge,
        specularHighlight: features.specularHighlight
      },
      features: {
        stickyMobileCTA: features.stickyMobileCTA,
        trustVelocity: features.trustVelocity,
        socialProof: features.socialProofDensity,
        beforeAfter: features.beforeAfterGallery,
        faqSection: features.faqSection,
        scarcitySignals: features.scarcitySignals,
        // ... all 11+ features
      },
      metrics: {
        expectedCombinedLift: this.calculateCombinedLift(features),
        deterministic: true,
        seed: seed,
        reproducible: true
      }
    };
    
    return siteDesign;
  }
}
```

---

## Component File Structure

Reflects the variant organization:

```
components/
├── Hero/
│   ├─ HeroMinimalAccentBar.astro          (variant implementation)
│   ├─ HeroCallBold.astro                  (variant implementation)
│   ├─ HeroUrgentBadge.astro               (variant implementation)
│   ├─ HeroImageLeft.astro                 (variant implementation)
│   ├─ HeroGalleryShowcase.astro           (variant implementation)
│   ├─ HeroElegantMinimal.astro            (variant implementation)
│   ├─ HeroTrustStats.astro                (variant implementation)
│   ├─ HeroTestimonialFeatured.astro       (variant implementation)
│   ├─ HeroTrustBadgeFocus.astro           (variant implementation)
│   ├─ HeroStandardSimple.astro            (variant implementation)
│   ├─ HeroImageText.astro                 (variant implementation)
│   ├─ HeroFullBleed.astro                 (variant implementation)
│   └─ index.astro                          (selector: passes variant to correct component)
│
├── Services/
│   ├─ ServicesGrid2colFeatureGallery.astro
│   ├─ ServicesGrid3colCardsWithTestimonials.astro
│   ├─ ServicesGrid2colCompact.astro
│   └─ index.astro
│
├── Testimonials/
│   ├─ TestimonialWallGrid.astro
│   ├─ TestimonialCarouselFeatured.astro
│   ├─ TestimonialContextualNearServices.astro
│   └─ index.astro
│
├── Badges/
│   ├─ FoilSealBadge.astro                 (feature-specific: skeuomorphic badge)
│   ├─ Tilt3DBadge.astro                   (feature-specific: 3D tilt)
│   ├─ SpecularHighlightBadge.astro        (feature-specific: reflection shine)
│   └─ TrustVelocityBadges.astro           (feature-specific: review count badges)
│
├── Features/
│   ├─ StickyMobileCTA.astro               (feature-specific: always-on CTA)
│   ├─ FAQSection.astro                    (feature-specific: Q&A)
│   ├─ SocialProofStack.astro              (feature-specific: proof layering)
│   ├─ BeforeAfterGallery.astro            (feature-specific: interactive slider)
│   ├─ ScarcitySignals.astro               (feature-specific: urgency messaging)
│   └─ RiskReversalGuarantee.astro         (feature-specific: guarantee display)
│
└── Layout/
   ├─ Footer.astro
   ├─ Navigation.astro
   └─ Base.astro
```

---

## Example Build Output

### Business Profile A: Emergency Plumber (6 years, 287 reviews)

```typescript
const plumberA = {
  vertical: 'plumbing',
  yearsInBusiness: 6,
  reviewCount: 287,
  emergencyFocused: true,
  mobileTraffic: 72,
  guaranteeType: '2-year-warranty'
};

// Layer 1: Decisions
heroCategory: 'emergency-mobile'
colorCategory: 'emergency-warm'
spacingCategory: 'compact-action-focused'
animationCategory: 'disabled-high-contrast'

// Layer 2-3: Variants (seed = hash("Plumber A") = 123)
heroVariant: variants.heroVariantPool['emergency-mobile'][123 % 3]  
  // Index 0 → 'emergency-mobile-minimal-accent-bar'
colorScheme: variants.colorVariantPool['emergency-warm'][123 % 3]
  // Index 0 → 'emergency-red-orange-primary'

// Layer 4a: Tokens
color: { primary: #ef4444, accent: #f97316 }
typography: { heading: 'sans-bold', body: 'sans-standard' }
spacing: { sectionPadding: '4rem', gap: '1.5rem' }
animation: 'disabled' // High contrast, no distraction

// Layer 4b: Features
stickyMobileCTA: { enabled: true, text: 'EMERGENCY CALL', lift: '+15-25%' }
trustVelocity: { tier: 'standard', lift: '+12%' }  // 287 reviews
socialProof: { proofTypes: ['reviews', 'guarantee'], lift: '+35%' }
scarcitySignals: { enabled: false } // Not truly booked
foilSealBadge: { enabled: true, color: 'silver', lift: '+75%' }  // 6 years + warranty
tilt3DBadge: { enabled: false } // No awards
faqSection: { enabled: true, lift: '+42%' }

// RESULT:
// Hero: Red/orange minimal accent bar, large "EMERGENCY CALL" button
// Services: 2-column compact layout, dense
// Color: Red primary, orange accent (emergency signals)
// Animations: None (high contrast focus)
// Features: Sticky CTA, trust badges, foil seal, FAQ
// Expected Combined Lift: ~+165-180%
```

### Business Profile B: Premium Landscaping (12 years, 2000 reviews, 500 projects)

```typescript
const landscaperB = {
  vertical: 'landscaping',
  yearsInBusiness: 12,
  reviewCount: 2000,
  portfolioSize: 500,
  premiumPositioning: true,
  guaranteeType: 'lifetime'
};

// Layer 1: Decisions
heroCategory: 'premium-established'
colorCategory: 'premium-refined'
spacingCategory: 'spacious-luxury'
animationCategory: 'subtle-refined'

// Layer 2-3: Variants (seed = hash("Landscaper B") = 456)
heroVariant: variants.heroVariantPool['premium-established'][456 % 3]
  // Index 1 → 'premium-established-gradient-subtle'
colorScheme: variants.colorVariantPool['premium-refined'][456 % 3]
  // Index 1 → 'premium-emerald-deep-gold-accent'

// Layer 4a: Tokens
color: { primary: #047857, accent: #d97706 } // Deep emerald + gold
typography: { heading: 'serif-elegant', body: 'sans-refined' }
spacing: { sectionPadding: '7rem', gap: '3rem' }
animation: 'subtle-slow' // 400ms, refined

// Layer 4b: Features
stickyMobileCTA: { enabled: true, text: 'Get Your Design', lift: '+18%' }
trustVelocity: { tier: 'featured', displayLocations: 'all', lift: '+18%' }  // 2000 reviews
socialProof: { proofTypes: ['reviews', 'customerCount', 'guarantee', 'certification'], lift: '+270%' }
beforeAfterGallery: { enabled: true, count: 6, lift: '+20%' }
contextualTestimonials: { placement: 'multiple', lift: '+150%' }
foilSealBadge: { enabled: true, color: 'gold', placement: 'hero', lift: '+120%' }
tilt3DBadge: { enabled: true, lift: '+60%' }  // Multiple awards assumed
specularHighlight: { enabled: true, placement: ['portfolio', 'testimonials'], lift: '+85%' }
faqSection: { enabled: true, count: 15, lift: '+42%' }

// RESULT:
// Hero: Subtle gradient background, elegant serif typography, refined ghost button
// Services: 3-column large spacious cards, images prominent
// Color: Deep emerald green (nature/luxury) + gold accents
// Animations: Smooth, slow, subtle (400ms reveal animations)
// Features: All 11+ features deployed
// Badges: Gold foil seal, 3D tilt award badge, specular highlights on photos
// Expected Combined Lift: ~+250-350%
```

---

## Key Advantages of This Unified Approach

✅ **Deterministic** — Same business always = same output  
✅ **Diverse** — Different businesses = different variants (no homogenization)  
✅ **Preserves our work** — All 150+ rules from UNIVERSAL_DESIGN_DECISION_ENGINE intact  
✅ **Tactical flexibility** — Feature-specific rules (badges, guarantees) layer on top  
✅ **Scalable** — Add variants without touching rules  
✅ **Maintainable** — Clear separation: decisions → variants → tokens → features  
✅ **Auditable** — Seed determines everything; same business = reproducible output  

---

## Implementation Roadmap

**Phase 1:** Create variant pools for highest-impact categories (hero, services, testimonials, colors)
- Define 3-5 variants per category
- Create .astro components for each variant

**Phase 2:** Build decision engine and variant selector
- Decision rules (Layer 1)
- Variant selection logic (Layers 2-3)
- Token application (Layer 4a)

**Phase 3:** Integrate feature-specific rules (Layer 4b)
- Deploy IF/THEN features (badges, guarantees, scarcity, etc.)
- Wire into component renderer

**Phase 4:** Testing and diversity audit
- Verify no two businesses look identical (for similar profiles)
- Audit seed distribution (ensure even variant selection)
- Test determinism (same business twice = same output)

