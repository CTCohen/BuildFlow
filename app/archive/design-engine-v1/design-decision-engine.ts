/**
 * UNIFIED DESIGN DECISION ENGINE
 * Layer 1: Decision Rules - Deterministic business data → design categories
 *
 * Maps business profile characteristics to high-level design categories.
 * Each decision function outputs a category string, not a specific implementation.
 * Implementations (variants) are selected in Layer 2-3 via seeded randomization.
 *
 * Decision priority order matters - check highest priority conditions first.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface BusinessProfile {
  id: string;
  name: string;
  vertical: string;

  // Maturity indicators
  yearsInBusiness: number;
  teamSize: number;
  soloOperator: boolean;

  // Trust indicators
  reviewCount: number;
  averageRating?: number;

  // Business model indicators
  emergencyFocused: boolean;
  premiumPositioning: boolean;
  portfolioHeavy: boolean;
  portfolioSize: number;
  multiLocation: boolean;

  // Mobile & traffic
  mobileTraffic: number; // 0-100 percentage

  // Features & signals
  guaranteeType?: string; // '2-year-warranty', 'lifetime', etc.
  awards?: string[];
  certifications?: string[];
  trulyBooked: boolean;
  bookedUntilDate?: Date;

  // Contact & sales
  phone: string;
  email: string;

  // Custom flags
  visual_trade?: boolean; // Photography-heavy (real estate, landscaping, etc.)
  trustMature?: boolean; // Has established trust systems
}

// Decision category types
export type HeroCategory =
  | 'emergency-mobile'
  | 'portfolio-visual'
  | 'premium-established'
  | 'trust-dominant'
  | 'geographic-capacity'
  | 'personal-expertise'
  | 'standard-balanced';

export type ColorCategory =
  | 'emergency-warm'
  | 'premium-refined'
  | 'visual-vibrant'
  | 'standard-professional';

export type SpacingCategory =
  | 'spacious-luxury'
  | 'compact-action-focused'
  | 'comfortable-approachable'
  | 'standard-balanced';

export type AnimationCategory =
  | 'subtle-refined'
  | 'disabled-high-contrast'
  | 'gentle-personal'
  | 'standard-responsive';

export type FormStrategy =
  | 'minimal-floating'
  | 'prominent-modal'
  | 'staged-progressive'
  | 'trust-assured-simple'
  | 'emergency-phone-first';

export type TestimonialCategory =
  | 'wall-gallery-dense'
  | 'carousel-featured'
  | 'contextual-near-services'
  | 'quote-minimal-elegant'
  | 'social-proof-stacked';

export type ServicesCategory =
  | 'grid-2col-feature'
  | 'grid-3col-cards'
  | 'grid-2col-compact'
  | 'list-detailed'
  | 'tab-based-organized';

export type DarkModeStrategy = boolean;

// ============================================================================
// LAYER 1: DECISION RULES
// ============================================================================

export class DecisionEngine {

  /**
   * HERO TEMPLATE CATEGORY DECISION
   * Determines which hero layout category best serves this business's needs.
   * Priority order: emergency+mobile → portfolio → premium+maturity → trust →
   * geographic → solo+expertise → default
   */
  decideHeroCategory(business: BusinessProfile): HeroCategory {
    // HIGHEST PRIORITY: Emergency services + high mobile traffic
    if (business.emergencyFocused && business.mobileTraffic >= 60) {
      return 'emergency-mobile';
      // Rationale: Emergency services need urgent visual signals and large CTAs
      // optimized for thumb-friendly mobile interaction
    }

    // HIGH PRIORITY: Portfolio-heavy businesses (visual proof)
    if (business.portfolioHeavy && business.portfolioSize >= 20) {
      return 'portfolio-visual';
      // Rationale: Photography-heavy trades (landscaping, real estate, construction)
      // need visual hero to establish credibility through work samples
    }

    // HIGH PRIORITY: Premium positioning + established (maturity + luxury positioning)
    if (business.premiumPositioning && business.yearsInBusiness >= 10) {
      return 'premium-established';
      // Rationale: Long-standing premium businesses deserve elegant, refined hero
      // with minimal distraction and sophisticated typography
    }

    // MEDIUM PRIORITY: High social proof (500+ reviews = trust-dominant positioning)
    if (business.reviewCount >= 500) {
      return 'trust-dominant';
      // Rationale: When trust metrics are extremely strong, make them the hero
      // Feature trust stats, testimonials, or trust badges prominently
    }

    // MEDIUM PRIORITY: Multi-location with team (geographic capacity)
    if (business.multiLocation && business.teamSize >= 3) {
      return 'geographic-capacity';
      // Rationale: Multi-location businesses need to communicate coverage area
      // and team capacity to build confidence in service reach
    }

    // MEDIUM PRIORITY: Solo operator with established trust
    if (business.soloOperator && business.reviewCount >= 100) {
      return 'personal-expertise';
      // Rationale: Solo operators with strong reviews benefit from personal brand hero
      // positioning themselves as expert craftspeople with proven track record
    }

    // DEFAULT: Standard, balanced approach
    return 'standard-balanced';
  }

  /**
   * COLOR CATEGORY DECISION
   * Determines color palette category based on business positioning and service type.
   */
  decideColorCategory(business: BusinessProfile): ColorCategory {
    // Emergency services: Red/orange warmth signals urgency
    if (business.emergencyFocused) {
      return 'emergency-warm';
      // Rationale: Warm red/orange colors trigger urgency perception and
      // stand out on mobile screens for emergency services
    }

    // Premium positioning: Deeper, refined tones
    if (business.premiumPositioning) {
      return 'premium-refined';
      // Rationale: Deep greens, blues, golds, charcoals communicate luxury,
      // sophistication, and premium positioning
    }

    // Visual-heavy trades: Vibrant, rich colors
    if (business.visual_trade) {
      return 'visual-vibrant';
      // Rationale: Real estate, landscaping, design, architecture benefit from
      // richer, more saturated colors that complement photography
    }

    // DEFAULT: Professional but not extreme
    return 'standard-professional';
  }

  /**
   * SPACING CATEGORY DECISION
   * Determines layout density and breathing room.
   */
  decideSpacingCategory(business: BusinessProfile): SpacingCategory {
    // Premium positioning: Generous spacing (luxury = breathing room)
    if (business.premiumPositioning) {
      return 'spacious-luxury';
      // Rationale: Luxury brands benefit from white space, generous gutters,
      // and separation between elements (visual elegance)
    }

    // Emergency services: Compact, action-focused (minimize scrolling)
    if (business.emergencyFocused) {
      return 'compact-action-focused';
      // Rationale: Emergency calls need to be above the fold with minimal scrolling
      // Dense layouts keep critical info visible without navigation
    }

    // Solo operators: Comfortable, approachable spacing
    if (business.soloOperator) {
      return 'comfortable-approachable';
      // Rationale: Solo operators benefit from friendly, warm spacing that feels
      // personal without being cramped or overwhelming
    }

    // DEFAULT: Balanced spacing
    return 'standard-balanced';
  }

  /**
   * ANIMATION CATEGORY DECISION
   * Determines animation intensity and sophistication level.
   */
  decideAnimationCategory(business: BusinessProfile): AnimationCategory {
    // Premium positioning: Subtle, refined animations (400ms+ duration)
    if (business.premiumPositioning) {
      return 'subtle-refined';
      // Rationale: Luxury brands use slow, sophisticated motion that feels
      // intentional and premium, never jarring
    }

    // Emergency services: No animations (high contrast, focus)
    if (business.emergencyFocused) {
      return 'disabled-high-contrast';
      // Rationale: Emergency services need clarity and focus, animations distract
      // from critical information and action buttons
    }

    // Solo operators with trust maturity: Gentle, personal animations
    if (business.soloOperator && business.trustMature) {
      return 'gentle-personal';
      // Rationale: Gentle animations (300ms) convey warmth and personal touch
      // without feeling overly polished or corporate
    }

    // DEFAULT: Standard, responsive animations
    return 'standard-responsive';
  }

  /**
   * FORM STRATEGY DECISION
   * Determines how contact/quote forms are presented and structured.
   */
  decideFormStrategy(business: BusinessProfile): FormStrategy {
    // Emergency services: Phone-first (faster than form)
    if (business.emergencyFocused) {
      return 'emergency-phone-first';
      // Rationale: Emergency contacts need immediate phone access
      // Forms are secondary; phone CTA is primary
    }

    // Premium positioning: Trust-assured, minimal form (fewer fields)
    if (business.premiumPositioning && business.yearsInBusiness >= 5) {
      return 'trust-assured-simple';
      // Rationale: Established premium businesses can use shorter forms
      // (clients trust them enough to provide minimal info upfront)
    }

    // High trust (500+ reviews): Minimal floating form, always accessible
    if (business.reviewCount >= 500) {
      return 'minimal-floating';
      // Rationale: High-trust businesses don't need extensive forms
      // Floating form stays accessible without being intrusive
    }

    // Portfolio/project-based: Staged, progressive form (step-by-step)
    if (business.portfolioHeavy && business.portfolioSize >= 20) {
      return 'staged-progressive';
      // Rationale: Multi-phase projects benefit from progressive forms that
      // gather info in logical stages (reduces cognitive load)
    }

    // DEFAULT: Prominent but not aggressive modal form
    return 'prominent-modal';
  }

  /**
   * TESTIMONIAL CATEGORY DECISION
   * Determines how customer testimonials are displayed and integrated.
   */
  decideTestimonialCategory(business: BusinessProfile): TestimonialCategory {
    // Very high review count: Dense gallery (show magnitude of trust)
    if (business.reviewCount >= 1000) {
      return 'wall-gallery-dense';
      // Rationale: With 1000+ reviews, the volume itself is a trust signal
      // Gallery displays the quantity impressively
    }

    // High trust + premium: Carousel with featured testimonials (curated approach)
    if (business.reviewCount >= 300 && business.premiumPositioning) {
      return 'carousel-featured';
      // Rationale: Premium businesses curate their best testimonials
      // Carousel format allows depth with visual elegance
    }

    // Moderate trust + multi-service: Contextual testimonials (near relevant services)
    if (business.reviewCount >= 100 && business.portfolioSize >= 15) {
      return 'contextual-near-services';
      // Rationale: Testimonials placed near relevant services are more persuasive
      // than grouped separately (context matters)
    }

    // Premium positioning + fewer reviews: Minimal, elegant quotes
    if (business.premiumPositioning && business.reviewCount < 100) {
      return 'quote-minimal-elegant';
      // Rationale: Premium brands benefit from fewer, carefully selected quotes
      // rather than quantity (quality > quantity)
    }

    // Growing trust: Stacked social proof (multiple types of proof)
    if (business.reviewCount >= 50 && business.reviewCount < 300) {
      return 'social-proof-stacked';
      // Rationale: Growing businesses benefit from layered proof types
      // (reviews + guarantees + certifications + awards)
    }

    // DEFAULT: Generic approach
    return 'wall-gallery-dense';
  }

  /**
   * SERVICES CATEGORY DECISION
   * Determines how services are organized and displayed.
   */
  decideServicesCategory(business: BusinessProfile): ServicesCategory {
    // Emergency services: 2-column compact (quick scan, high density)
    if (business.emergencyFocused) {
      return 'grid-2col-compact';
      // Rationale: Emergency services list needs fast scanning
      // Compact layout fits emergency availability/service types
    }

    // Premium positioning with multiple services: 3-column with cards
    if (business.premiumPositioning && business.portfolioSize >= 10) {
      return 'grid-3col-cards';
      // Rationale: Premium design benefits from spacious cards with descriptions
      // 3-column balances density with elegance
    }

    // Portfolio-heavy (visual trades): Feature images in 2-column
    if (business.visual_trade && business.portfolioSize >= 20) {
      return 'grid-2col-feature';
      // Rationale: Visual trades benefit from larger image placement
      // 2-column allows prominent image + service description pairing
    }

    // Detailed/complex services: List-based detailed view
    if (business.portfolioSize >= 30 && !business.visual_trade) {
      return 'list-detailed';
      // Rationale: Complex service offerings benefit from detailed descriptions
      // List format allows more text per service without visual crowding
    }

    // Many distinct service categories: Tab-based organization
    if (business.portfolioSize >= 50) {
      return 'tab-based-organized';
      // Rationale: Large service catalogs need organizational hierarchy
      // Tabs group related services and prevent overwhelming lists
    }

    // DEFAULT: 3-column balanced
    return 'grid-3col-cards';
  }

  /**
   * DARK MODE STRATEGY DECISION
   * Determines if dark mode should be enabled for this business.
   */
  decideDarkModeStrategy(business: BusinessProfile): DarkModeStrategy {
    // Tech-forward businesses: Enable dark mode
    if (business.visual_trade || business.portfolioSize >= 50) {
      return true;
      // Rationale: Visual professionals and large portfolios benefit from
      // dark mode for enhanced image contrast and modern perception
    }

    // Traditional/conservative businesses: Disable dark mode
    if (business.emergencyFocused || (business.premiumPositioning && business.yearsInBusiness >= 15)) {
      return false;
      // Rationale: Emergency services and traditional luxury brands
      // benefit from consistent, light-focused branding
    }

    // DEFAULT: Enable (modern standard)
    return true;
  }

  // ========================================================================
  // HELPER METHODS
  // ========================================================================

  /**
   * Get all decisions for a business profile at once
   */
  getAllDecisions(business: BusinessProfile): {
    hero: HeroCategory;
    color: ColorCategory;
    spacing: SpacingCategory;
    animation: AnimationCategory;
    form: FormStrategy;
    testimonial: TestimonialCategory;
    services: ServicesCategory;
    darkMode: DarkModeStrategy;
  } {
    return {
      hero: this.decideHeroCategory(business),
      color: this.decideColorCategory(business),
      spacing: this.decideSpacingCategory(business),
      animation: this.decideAnimationCategory(business),
      form: this.decideFormStrategy(business),
      testimonial: this.decideTestimonialCategory(business),
      services: this.decideServicesCategory(business),
      darkMode: this.decideDarkModeStrategy(business),
    };
  }
}

// ============================================================================
// LAYER 2-3: VARIANT SELECTOR (Seeded, Deterministic Selection)
// ============================================================================

export class VariantSelector {
  private decisionEngine: DecisionEngine;

  constructor() {
    this.decisionEngine = new DecisionEngine();
  }

  /**
   * Create a deterministic seed from business identifier
   * Same business ID → same seed (deterministic)
   * Different business ID → different seed (diverse)
   */
  private createSeed(business: BusinessProfile): number {
    const identifier = business.id || business.name;
    const hash = this.hashCode(identifier);
    return Math.abs(hash);
  }

  /**
   * 32-bit hash function for string seeds
   * Borrowed from Java's String.hashCode() for consistency
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  /**
   * Select a hero variant deterministically from pool
   * Decisions → Variant Pool → Seeded Index → Specific Variant
   */
  selectHeroVariant(business: BusinessProfile): string {
    const heroCategory = this.decisionEngine.decideHeroCategory(business);
    const variantCount = this.getHeroVariantCount(heroCategory);
    const seed = this.createSeed(business);
    const selectedIndex = seed % variantCount;
    return this.getHeroVariantId(heroCategory, selectedIndex);
  }

  /**
   * Select a color scheme variant deterministically
   */
  selectColorVariant(business: BusinessProfile): string {
    const colorCategory = this.decisionEngine.decideColorCategory(business);
    const variantCount = this.getColorVariantCount(colorCategory);
    const seed = this.createSeed(business);
    const selectedIndex = seed % variantCount;
    return this.getColorVariantId(colorCategory, selectedIndex);
  }

  /**
   * Select a testimonial layout variant deterministically
   */
  selectTestimonialVariant(business: BusinessProfile): string {
    const testimonialCategory = this.decisionEngine.decideTestimonialCategory(business);
    const variantCount = this.getTestimonialVariantCount(testimonialCategory);
    const seed = this.createSeed(business);
    const selectedIndex = seed % variantCount;
    return this.getTestimonialVariantId(testimonialCategory, selectedIndex);
  }

  /**
   * Select a services layout variant deterministically
   */
  selectServicesVariant(business: BusinessProfile): string {
    const servicesCategory = this.decisionEngine.decideServicesCategory(business);
    const variantCount = this.getServicesVariantCount(servicesCategory);
    const seed = this.createSeed(business);
    const selectedIndex = seed % variantCount;
    return this.getServicesVariantId(servicesCategory, selectedIndex);
  }

  // ======================================================================
  // VARIANT POOL LOOKUP HELPERS
  // These return variant counts and IDs for each category
  // In production, these would reference the actual variant pool definitions
  // ======================================================================

  private getHeroVariantCount(category: HeroCategory): number {
    const counts: Record<HeroCategory, number> = {
      'emergency-mobile': 3,
      'portfolio-visual': 3,
      'premium-established': 3,
      'trust-dominant': 3,
      'geographic-capacity': 2,
      'personal-expertise': 2,
      'standard-balanced': 3,
    };
    return counts[category];
  }

  private getHeroVariantId(category: HeroCategory, index: number): string {
    const variants: Record<HeroCategory, string[]> = {
      'emergency-mobile': [
        'emergency-mobile-minimal-accent-bar',
        'emergency-mobile-call-bold',
        'emergency-mobile-urgent-with-badge',
      ],
      'portfolio-visual': [
        'portfolio-visual-image-left',
        'portfolio-visual-gallery-showcase',
        'portfolio-visual-split-modern',
      ],
      'premium-established': [
        'premium-established-elegant-minimal',
        'premium-established-gradient-subtle',
        'premium-established-centered-featured',
      ],
      'trust-dominant': [
        'trust-dominant-stats-prominent',
        'trust-dominant-testimonial-featured',
        'trust-dominant-badge-seal-focused',
      ],
      'geographic-capacity': [
        'geographic-capacity-map-focused',
        'geographic-capacity-locations-grid',
      ],
      'personal-expertise': [
        'personal-expertise-headshot-featured',
        'personal-expertise-testimonial-showcase',
      ],
      'standard-balanced': [
        'standard-balanced-simple',
        'standard-balanced-image-text',
        'standard-balanced-full-bleed',
      ],
    };
    return variants[category][index % variants[category].length];
  }

  private getColorVariantCount(category: ColorCategory): number {
    const counts: Record<ColorCategory, number> = {
      'emergency-warm': 3,
      'premium-refined': 3,
      'visual-vibrant': 3,
      'standard-professional': 2,
    };
    return counts[category];
  }

  private getColorVariantId(category: ColorCategory, index: number): string {
    const variants: Record<ColorCategory, string[]> = {
      'emergency-warm': [
        'emergency-red-orange-primary',
        'emergency-deep-red-accent',
        'emergency-orange-yellow-contrast',
      ],
      'premium-refined': [
        'premium-deep-blue-gold',
        'premium-emerald-deep-gold',
        'premium-charcoal-silver',
      ],
      'visual-vibrant': [
        'visual-teal-coral-rich',
        'visual-purple-gold-saturated',
        'visual-forest-warm-orange',
      ],
      'standard-professional': [
        'standard-blue-accent',
        'standard-gray-warm',
      ],
    };
    return variants[category][index % variants[category].length];
  }

  private getTestimonialVariantCount(category: TestimonialCategory): number {
    const counts: Record<TestimonialCategory, number> = {
      'wall-gallery-dense': 1,
      'carousel-featured': 2,
      'contextual-near-services': 1,
      'quote-minimal-elegant': 1,
      'social-proof-stacked': 2,
    };
    return counts[category];
  }

  private getTestimonialVariantId(category: TestimonialCategory, index: number): string {
    const variants: Record<TestimonialCategory, string[]> = {
      'wall-gallery-dense': ['testimonial-wall-grid'],
      'carousel-featured': [
        'testimonial-carousel-with-featured',
        'testimonial-carousel-with-ratings',
      ],
      'contextual-near-services': ['testimonial-contextual-near-services'],
      'quote-minimal-elegant': ['testimonial-quote-minimal-elegant'],
      'social-proof-stacked': [
        'testimonial-social-proof-stacked',
        'testimonial-proof-multi-layer',
      ],
    };
    return variants[category][index % variants[category].length];
  }

  private getServicesVariantCount(category: ServicesCategory): number {
    const counts: Record<ServicesCategory, number> = {
      'grid-2col-feature': 1,
      'grid-3col-cards': 2,
      'grid-2col-compact': 1,
      'list-detailed': 1,
      'tab-based-organized': 1,
    };
    return counts[category];
  }

  private getServicesVariantId(category: ServicesCategory, index: number): string {
    const variants: Record<ServicesCategory, string[]> = {
      'grid-2col-feature': ['services-grid-2col-feature-gallery'],
      'grid-3col-cards': [
        'services-grid-3col-cards',
        'services-grid-3col-cards-with-testimonials',
      ],
      'grid-2col-compact': ['services-grid-2col-compact'],
      'list-detailed': ['services-list-detailed'],
      'tab-based-organized': ['services-tab-based-organized'],
    };
    return variants[category][index % variants[category].length];
  }
}

// ============================================================================
// LAYER 4: TOKEN SYSTEM & FEATURE DEPLOYMENT
// ============================================================================

export interface DesignTokens {
  color: {
    primary: string;
    accent: string;
    secondary?: string;
    text: string;
    background: string;
  };
  typography: {
    headingFont: 'serif-elegant' | 'sans-modern' | 'sans-bold';
    bodyFont: 'sans-refined' | 'sans-standard' | 'serif-elegant';
    headingSize: string;
    bodySize: string;
  };
  spacing: {
    sectionPadding: string;
    gutterGap: string;
    componentGap: string;
  };
  animation: {
    duration: number; // milliseconds
    intensity: 'disabled' | 'subtle' | 'gentle' | 'standard';
    easing: string;
  };
}

export interface FeatureDeployment {
  stickyMobileCTA: { enabled: boolean; text: string; expectedLift: string };
  foilSealBadge?: { enabled: boolean; color: string; placement: string; expectedLift: string };
  tilt3DBadge?: { enabled: boolean; placement: string; expectedLift: string };
  specularHighlight?: { enabled: boolean; placement: string[]; expectedLift: string };
  scarcitySignals?: { enabled: boolean; type: string; value: any; expectedLift: string };
  trustVelocity?: { enabled: boolean; tier: string; displayLocations: string[]; expectedLift: string };
  socialProofDensity?: { enabled: boolean; proofTypes: string[]; expectedLift: string };
  beforeAfterGallery?: { enabled: boolean; count: number; expectedLift: string };
  faqSection: { enabled: boolean; questionCount: number; expectedLift: string };
  [key: string]: any;
}

export class DesignTokenApplier {
  /**
   * Apply design tokens to a specific variant
   * Selects specific color/typography values within variant constraints
   */
  applyTokensToVariant(
    variantId: string,
    business: BusinessProfile,
    seed: number
  ): DesignTokens {
    const spacing = this.selectSpacingToken(business);
    const animation = this.selectAnimationToken(business);

    return {
      color: this.selectColorToken(business, seed),
      typography: this.selectTypographyToken(business, seed),
      spacing: spacing,
      animation: animation,
    };
  }

  private selectColorToken(business: BusinessProfile, seed: number): DesignTokens['color'] {
    if (business.emergencyFocused) {
      return {
        primary: '#ef4444',
        accent: '#f97316',
        secondary: '#fbbf24',
        text: '#1f2937',
        background: '#ffffff',
      };
    }

    if (business.premiumPositioning) {
      const colors = [
        { primary: '#1e40af', accent: '#d97706' }, // Deep blue + gold
        { primary: '#047857', accent: '#d97706' }, // Deep emerald + gold
        { primary: '#1f2937', accent: '#c0a080' }, // Charcoal + warm taupe
      ];
      const selected = colors[seed % colors.length];
      return {
        ...selected,
        text: '#111827',
        background: '#f9fafb',
      };
    }

    if (business.visual_trade) {
      const colors = [
        { primary: '#0891b2', accent: '#f43f5e' }, // Teal + coral
        { primary: '#7c3aed', accent: '#fcd34d' }, // Purple + gold
        { primary: '#15803d', accent: '#f97316' }, // Forest + orange
      ];
      const selected = colors[seed % colors.length];
      return {
        ...selected,
        text: '#111827',
        background: '#fafafa',
      };
    }

    // DEFAULT: Standard professional
    return {
      primary: '#2563eb',
      accent: '#db2777',
      text: '#1f2937',
      background: '#ffffff',
    };
  }

  private selectTypographyToken(business: BusinessProfile, seed: number): DesignTokens['typography'] {
    if (business.premiumPositioning) {
      return {
        headingFont: 'serif-elegant',
        bodyFont: 'sans-refined',
        headingSize: '2.2rem',
        bodySize: '1rem',
      };
    }

    if (business.emergencyFocused) {
      return {
        headingFont: 'sans-bold',
        bodyFont: 'sans-standard',
        headingSize: '2.8rem',
        bodySize: '0.95rem',
      };
    }

    // DEFAULT: Modern sans-serif
    return {
      headingFont: 'sans-modern',
      bodyFont: 'sans-standard',
      headingSize: '2rem',
      bodySize: '1rem',
    };
  }

  private selectSpacingToken(business: BusinessProfile): DesignTokens['spacing'] {
    if (business.premiumPositioning) {
      return {
        sectionPadding: '7rem',
        gutterGap: '3rem',
        componentGap: '2.5rem',
      };
    }

    if (business.emergencyFocused) {
      return {
        sectionPadding: '2.5rem',
        gutterGap: '1rem',
        componentGap: '1.5rem',
      };
    }

    if (business.soloOperator) {
      return {
        sectionPadding: '4rem',
        gutterGap: '2rem',
        componentGap: '1.75rem',
      };
    }

    // DEFAULT: Balanced
    return {
      sectionPadding: '3.5rem',
      gutterGap: '2rem',
      componentGap: '1.5rem',
    };
  }

  private selectAnimationToken(business: BusinessProfile): DesignTokens['animation'] {
    if (business.premiumPositioning) {
      return {
        duration: 400,
        intensity: 'subtle',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      };
    }

    if (business.emergencyFocused) {
      return {
        duration: 0,
        intensity: 'disabled',
        easing: 'linear',
      };
    }

    if (business.soloOperator && business.trustMature) {
      return {
        duration: 300,
        intensity: 'gentle',
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      };
    }

    // DEFAULT: Standard responsive
    return {
      duration: 250,
      intensity: 'standard',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    };
  }
}

export class FeatureDeployer {
  /**
   * Deploy feature-specific rules (IF/THEN logic)
   * These are binary or tier-based features, not variants
   */
  deployFeatures(business: BusinessProfile): FeatureDeployment {
    const features: FeatureDeployment = {
      stickyMobileCTA: {
        enabled: true,
        text: business.emergencyFocused ? 'EMERGENCY CALL' : 'Call Now',
        expectedLift: '+15-25%',
      },
      faqSection: {
        enabled: true,
        questionCount: 8,
        expectedLift: '+42%',
      },
    };

    // FOIL SEAL BADGE: Premium + established + guarantee
    if (
      business.yearsInBusiness >= 5 &&
      business.guaranteeType &&
      business.premiumPositioning
    ) {
      features.foilSealBadge = {
        enabled: true,
        color: this.selectBadgeColor(business.vertical),
        placement: 'hero-bottom-right',
        expectedLift: '+58-150%',
      };
    }

    // 3D TILT BADGE: Premium + maturity + awards
    if (
      business.premiumPositioning &&
      business.yearsInBusiness >= 3 &&
      business.awards &&
      business.awards.length >= 1
    ) {
      features.tilt3DBadge = {
        enabled: true,
        placement: 'award-section',
        expectedLift: '+25-75%',
      };
    }

    // SPECULAR HIGHLIGHT: Premium + large portfolio + established
    if (
      business.premiumPositioning &&
      business.portfolioSize >= 50 &&
      business.yearsInBusiness >= 5
    ) {
      features.specularHighlight = {
        enabled: true,
        placement: ['portfolio-slider', 'testimonial-photo'],
        expectedLift: '+40-100%',
      };
    }

    // SCARCITY SIGNALS: Only if truly booked
    if (business.trulyBooked && business.bookedUntilDate && this.isDateFresh(business.bookedUntilDate)) {
      features.scarcitySignals = {
        enabled: true,
        type: 'booked-until',
        value: business.bookedUntilDate,
        expectedLift: '+35-47%',
      };
    }

    // TRUST VELOCITY: Tier-based on review count
    const trustTier = this.getTrustVelocityTier(business.reviewCount);
    if (trustTier) {
      features.trustVelocity = {
        enabled: true,
        tier: trustTier,
        displayLocations: this.getTierLocations(trustTier),
        expectedLift: `+${this.getTierLift(trustTier)}%`,
      };
    }

    // SOCIAL PROOF DENSITY: Multiple proof types
    const proofStack = this.buildSocialProofStack(business);
    if (proofStack.length >= 2) {
      features.socialProofDensity = {
        enabled: true,
        proofTypes: proofStack,
        expectedLift: '+20-270%',
      };
    }

    // BEFORE-AFTER GALLERY: Portfolio-heavy
    if (business.portfolioSize >= 20) {
      features.beforeAfterGallery = {
        enabled: true,
        count: Math.min(business.portfolioSize, 6),
        expectedLift: '+15-25%',
      };
    }

    return features;
  }

  private selectBadgeColor(vertical: string): string {
    const colors: Record<string, string> = {
      plumbing: 'silver',
      electrical: 'gold',
      hvac: 'copper',
      landscaping: 'gold',
      roofing: 'silver',
      construction: 'copper',
    };
    return colors[vertical.toLowerCase()] || 'silver';
  }

  private isDateFresh(date: Date): boolean {
    const daysSince = Math.floor(
      (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSince <= 7; // Less than 1 week old
  }

  private getTrustVelocityTier(reviewCount: number): string | null {
    if (reviewCount >= 2000) return 'platinum';
    if (reviewCount >= 500) return 'gold';
    if (reviewCount >= 100) return 'silver';
    if (reviewCount >= 30) return 'bronze';
    return null;
  }

  private getTierLocations(tier: string): string[] {
    const locations: Record<string, string[]> = {
      platinum: ['hero', 'services-top', 'testimonials', 'footer', 'cta-primary'],
      gold: ['hero', 'services-top', 'testimonials', 'footer'],
      silver: ['services-top', 'testimonials', 'footer'],
      bronze: ['testimonials', 'footer'],
    };
    return locations[tier] || [];
  }

  private getTierLift(tier: string): number {
    const lifts: Record<string, number> = {
      platinum: 24,
      gold: 18,
      silver: 12,
      bronze: 6,
    };
    return lifts[tier] || 0;
  }

  private buildSocialProofStack(business: BusinessProfile): string[] {
    const proofTypes = [];

    if (business.reviewCount > 0) proofTypes.push('reviews');
    if (business.guaranteeType) proofTypes.push('guarantee');
    if (business.certifications && business.certifications.length > 0) {
      proofTypes.push('certification');
    }
    if (business.awards && business.awards.length > 0) proofTypes.push('award');
    if (business.yearsInBusiness >= 5) proofTypes.push('longevity');

    return proofTypes;
  }
}

// ============================================================================
// UNIFIED DESIGN ENGINE (All Layers Combined)
// ============================================================================

export interface SiteDesign {
  decisions: {
    hero: HeroCategory;
    color: ColorCategory;
    spacing: SpacingCategory;
    animation: AnimationCategory;
    form: FormStrategy;
    testimonial: TestimonialCategory;
    services: ServicesCategory;
    darkMode: DarkModeStrategy;
  };
  variants: {
    hero: string;
    color: string;
    testimonial: string;
    services: string;
  };
  tokens: DesignTokens;
  features: FeatureDeployment;
  metrics: {
    seed: number;
    deterministic: boolean;
    reproducible: boolean;
    expectedCombinedLift: string;
  };
}

export class UnifiedDesignEngine {
  private decisionEngine: DecisionEngine;
  private variantSelector: VariantSelector;
  private tokenApplier: DesignTokenApplier;
  private featureDeployer: FeatureDeployer;

  constructor() {
    this.decisionEngine = new DecisionEngine();
    this.variantSelector = new VariantSelector();
    this.tokenApplier = new DesignTokenApplier();
    this.featureDeployer = new FeatureDeployer();
  }

  /**
   * UNIFIED BUILD FLOW
   * Takes business profile and returns complete site design specification
   * Deterministic: Same business input → Same output (reproducible)
   * Diverse: Different business → Different output (no homogenization)
   */
  async buildSite(business: BusinessProfile): Promise<SiteDesign> {
    // LAYER 1: Decision Rules → Categories
    const decisions = this.decisionEngine.getAllDecisions(business);

    // LAYER 2-3: Variant Selection (seeded, deterministic)
    const seed = this.variantSelector['createSeed'](business); // Access private method for internal use
    const variants = {
      hero: this.variantSelector.selectHeroVariant(business),
      color: this.variantSelector.selectColorVariant(business),
      testimonial: this.variantSelector.selectTestimonialVariant(business),
      services: this.variantSelector.selectServicesVariant(business),
    };

    // LAYER 4a: Apply Tokens
    const tokens = this.tokenApplier.applyTokensToVariant(variants.hero, business, seed);

    // LAYER 4b: Deploy Features
    const features = this.featureDeployer.deployFeatures(business);

    // Combine all layers into final design specification
    const siteDesign: SiteDesign = {
      decisions,
      variants,
      tokens,
      features,
      metrics: {
        seed,
        deterministic: true,
        reproducible: true,
        expectedCombinedLift: this.calculateCombinedLift(features),
      },
    };

    return siteDesign;
  }

  private calculateCombinedLift(features: FeatureDeployment): string {
    // Extract numeric lifts from feature strings like "+15-25%"
    const extractNumbers = (str: string): number[] => {
      const matches = str.match(/\d+/g) || [];
      return matches.map(Number);
    };

    let totalMinLift = 0;
    let totalMaxLift = 0;

    Object.values(features).forEach((feature) => {
      if (feature && typeof feature === 'object' && 'expectedLift' in feature) {
        const [min, max] = extractNumbers(feature.expectedLift);
        totalMinLift += min || 0;
        totalMaxLift += max || 0;
      }
    });

    return `+${totalMinLift}-${totalMaxLift}%`;
  }
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default UnifiedDesignEngine;
