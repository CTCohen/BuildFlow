/**
 * Feature Deployer — Conditional feature rules engine for service business sites
 * IF/THEN logic to deploy features based on business characteristics
 */

import type { Business } from './variant-selector';

// Feature configuration types
export interface FeatureConfig {
  enabled: boolean;
  position?: string;
  priority?: number;
  customProps?: Record<string, unknown>;
}

export interface StickyMobileCTAConfig extends FeatureConfig {
  text?: string;
  action?: 'call' | 'message' | 'book' | 'quote';
  phone?: string;
}

export interface BadgeConfig extends FeatureConfig {
  badgeType?: 'seal' | 'ribbon' | 'badge';
  text?: string;
  icon?: string;
  position?: 'header' | 'hero' | 'floating';
}

export interface SignalConfig extends FeatureConfig {
  messages?: string[];
  updateFrequency?: 'realtime' | 'daily' | 'weekly';
  showStats?: boolean;
}

export interface GalleryConfig extends FeatureConfig {
  columns?: number;
  autoPlay?: boolean;
  showLabels?: boolean;
  enableZoom?: boolean;
}

export interface CalculatorConfig extends FeatureConfig {
  serviceType?: string;
  currency?: string;
  multipleTiers?: boolean;
}

export interface TestimonialConfig extends FeatureConfig {
  layout?: 'carousel' | 'grid' | 'single';
  displayCount?: number;
  showRating?: boolean;
  showPhotos?: boolean;
}

export interface HeroConfig extends FeatureConfig {
  videoUrl?: string;
  videoAutoPlay?: boolean;
  videoMuted?: boolean;
  fallbackImage?: string;
}

export interface FAQConfig extends FeatureConfig {
  layout?: 'accordion' | 'tabs' | 'faq';
  defaultOpen?: number;
  searchable?: boolean;
  maxItems?: number;
}

export interface ChatConfig extends FeatureConfig {
  messageTarget?: 'call' | 'text' | 'email' | 'form';
  businessHours?: boolean;
  offlineMessage?: string;
}

export interface ServiceComparisonConfig extends FeatureConfig {
  compareType?: 'tiers' | 'competitors' | 'timeframes';
  displayFormat?: 'table' | 'cards';
  highlightPopular?: boolean;
}

export interface AnimationConfig extends FeatureConfig {
  animationType?: 'fade' | 'slide' | 'zoom' | 'rotate';
  duration?: number;
  easing?: string;
}

export interface SuccessStoryConfig extends FeatureConfig {
  layout?: 'carousel' | 'grid';
  storyCount?: number;
  includeMetrics?: boolean;
  showTimeline?: boolean;
}

// Feature deployment rules
export class FeatureDeployer {
  business: Business;

  constructor(business: Business) {
    this.business = business;
  }

  /**
   * STICKY MOBILE CTA
   * IF: Mobile device THEN: Deploy floating CTA button
   * Condition: Always true (deployed on client-side for mobile detection)
   */
  deployStickyMobileCTA(): StickyMobileCTAConfig | null {
    // Always deploy—client-side handles visibility
    const action = this.determineCallAction();

    return {
      enabled: true,
      position: 'bottom-right',
      priority: 100,
      action,
      text: this.getCallToActionText(action),
      phone: this.business.serviceArea?.includes('area') ? this.business.id : undefined,
      customProps: {
        showAfterScroll: 500, // pixels
        hideOnMobile: false,
      },
    };
  }

  /**
   * FOIL SEAL BADGE
   * IF: Established business (2+ years) OR (5+ employees) THEN: Show trust badge
   * Condition: yearsInBusiness >= 2 || employees >= 5
   */
  deployFoilSealBadge(): BadgeConfig | null {
    const isEstablished =
      (this.business.yearsInBusiness || 0) >= 2 ||
      (this.business.employees || 0) >= 5;

    if (!isEstablished) return null;

    const years = this.business.yearsInBusiness || 0;
    const badge = years >= 5 ? 'Premium' : 'Trusted';

    return {
      enabled: true,
      badgeType: 'seal',
      text: `${badge} ${years}+ Years`,
      icon: 'award-seal',
      position: 'floating',
      priority: 80,
      customProps: {
        animation: 'rotate-subtle',
        clickable: true,
        showTooltip: true,
      },
    };
  }

  /**
   * TILT 3D BADGE
   * IF: Modern/tech-forward industry OR (10+ years experience + high reviews)
   * THEN: Show 3D interactive badge
   * Condition: Industry match OR advanced credibility
   */
  deployTilt3DBadge(): BadgeConfig | null {
    const modernIndustries = [
      'hvac',
      'electrical',
      'tech-forward',
      'smart-home',
    ];
    const isModern = modernIndustries.some((ind) =>
      this.business.industry.toLowerCase().includes(ind),
    );

    const isHighCredibility = (this.business.yearsInBusiness || 0) >= 10;

    if (!isModern && !isHighCredibility) return null;

    return {
      enabled: true,
      badgeType: 'badge',
      text: this.business.yearsInBusiness ? '10+ Years Expert' : 'Modern Service',
      icon: 'shield-check',
      position: 'header',
      priority: 70,
      customProps: {
        use3D: true,
        tiltSensitivity: 0.8,
        glowColor: '#3B82F6',
      },
    };
  }

  /**
   * SCARCITY SIGNALS
   * IF: Service area limited OR high demand industry THEN: Show scarcity/urgency
   * Condition: serviceArea exists AND (small team OR limited capacity indicators)
   */
  deployScarcitySignals(): SignalConfig | null {
    const hasLimitedArea = Boolean(this.business.serviceArea);
    const isHighDemand = this.isHighDemandIndustry();
    const hasSmallTeam = (this.business.employees || 0) <= 5;

    if (!hasLimitedArea && !isHighDemand) return null;

    return {
      enabled: true,
      position: 'hero',
      priority: 90,
      messages: this.generateScarcityMessages(),
      updateFrequency: 'daily',
      showStats: true,
      customProps: {
        displayType: 'banner',
        backgroundColor: 'warning',
        icon: 'lightning-bolt',
        sound: false,
      },
    };
  }

  /**
   * BEFORE/AFTER GALLERY
   * IF: Visual transformation industry THEN: Deploy gallery
   * Condition: carpentry, painting, cleaning, landscaping, etc.
   */
  deployBeforeAfterGallery(): GalleryConfig | null {
    const transformationIndustries = [
      'carpentry',
      'painting',
      'cleaning',
      'landscaping',
      'pressure-washing',
      'junk-removal',
      'remodeling',
      'restoration',
    ];

    const isTransformationBusiness = transformationIndustries.some((ind) =>
      this.business.industry.toLowerCase().includes(ind),
    );

    if (!isTransformationBusiness) return null;

    return {
      enabled: true,
      position: 'services',
      priority: 85,
      columns: this.business.yearsInBusiness && this.business.yearsInBusiness > 3 ? 3 : 2,
      autoPlay: true,
      showLabels: true,
      enableZoom: true,
      customProps: {
        lazy: true,
        preload: 2,
        transitionDuration: 0.5,
        comparisonMode: 'slider', // or 'fade'
        lightbox: true,
      },
    };
  }

  /**
   * FAQ SECTION
   * IF: Service business THEN: Deploy FAQ (always useful)
   * Condition: Always true
   */
  deployFAQSection(): FAQConfig | null {
    // Always deploy FAQ for service businesses
    const hasExperience = (this.business.yearsInBusiness || 0) >= 2;

    return {
      enabled: true,
      position: 'bottom',
      priority: 50,
      layout: 'accordion',
      defaultOpen: 0,
      searchable: true,
      maxItems: hasExperience ? 15 : 8,
      customProps: {
        expandAll: false,
        scrollToExpanded: true,
        trackView: true,
        analytics: {
          trackClicks: true,
          trackSearches: true,
        },
      },
    };
  }

  /**
   * TESTIMONIAL/TRUST CAROUSEL
   * IF: Established business (1+ years) THEN: Show customer testimonials
   * Condition: yearsInBusiness >= 1
   */
  deployTestimonialCarousel(): TestimonialConfig | null {
    const isEstablished = (this.business.yearsInBusiness || 0) >= 1;

    if (!isEstablished) return null;

    const displayCount = Math.min(
      5,
      Math.max(2, Math.floor((this.business.yearsInBusiness || 1) / 2)),
    );

    return {
      enabled: true,
      position: 'below-cta',
      priority: 75,
      layout: 'carousel',
      displayCount,
      showRating: true,
      showPhotos: true,
      customProps: {
        autoRotate: true,
        rotationInterval: 6000,
        showArrows: true,
        showDots: true,
        fadeIn: true,
        verifiedBadge: true,
      },
    };
  }

  /**
   * ANIMATED TEAM HERO
   * IF: Team-based business (2+ employees) THEN: Show team section
   * Condition: employees >= 2
   */
  deployAnimatedTeamHero(): AnimationConfig | null {
    const hasTeam = (this.business.employees || 0) >= 2;

    if (!hasTeam) return null;

    return {
      enabled: true,
      position: 'about',
      priority: 60,
      animationType: 'fade',
      duration: 800,
      easing: 'ease-out-cubic',
      customProps: {
        staggerChildren: true,
        staggerDelay: 100,
        observerTrigger: 'onScroll',
        repeatOnHover: true,
        teamPhotoStyle: 'circle-border',
      },
    };
  }

  /**
   * INTERACTIVE SERVICE CALCULATOR
   * IF: Pricing-based service (plumbing, HVAC, electrical) THEN: Show calculator
   * Condition: Industry match
   */
  deployInteractiveServiceCalculator(): CalculatorConfig | null {
    const pricingIndustries = [
      'plumbing',
      'hvac',
      'electrical',
      'carpentry',
      'roofing',
      'painting',
    ];

    const hasPricingNeed = pricingIndustries.some((ind) =>
      this.business.industry.toLowerCase().includes(ind),
    );

    if (!hasPricingNeed) return null;

    return {
      enabled: true,
      position: 'services',
      priority: 65,
      serviceType: this.business.industry,
      currency: 'USD',
      multipleTiers: true,
      customProps: {
        calculateMethod: 'distance-based',
        showEstimate: true,
        requestQuoteButton: true,
        trackCalculations: true,
        shareable: true,
      },
    };
  }

  /**
   * LIVE CHAT WIDGET
   * IF: Lead capture active THEN: Show chat
   * Condition: Always deploy but with business hours toggle
   */
  deployChatWidget(): ChatConfig | null {
    return {
      enabled: true,
      position: 'floating',
      priority: 95,
      messageTarget: 'form',
      businessHours: true,
      offlineMessage: `We'll respond within 2 hours during business hours.`,
      customProps: {
        position: 'bottom-right',
        theme: 'light',
        delay: 3000, // Show after 3s
        minimized: false,
        collapseOnMobile: true,
        avatarUrl: '/avatar-bot.png',
        soundNotification: false,
      },
    };
  }

  /**
   * VIDEO HERO SECTION
   * IF: Established business (2+ years + 2+ employees) THEN: Show video hero
   * Condition: yearsInBusiness >= 2 AND employees >= 2
   */
  deployVideoHeroSection(): HeroConfig | null {
    const isEstablishedTeam =
      (this.business.yearsInBusiness || 0) >= 2 &&
      (this.business.employees || 0) >= 2;

    if (!isEstablishedTeam) return null;

    return {
      enabled: true,
      position: 'hero',
      priority: 100,
      videoUrl: `/video/${this.business.id}-hero.mp4`,
      videoAutoPlay: true,
      videoMuted: true,
      fallbackImage: `/image/${this.business.id}-hero.jpg`,
      customProps: {
        loop: true,
        controls: false,
        lazy: true,
        coverImage: true,
        overlayOpacity: 0.3,
        quality: 'hd',
      },
    };
  }

  /**
   * SERVICE COMPARISON/PRICING TABLE
   * IF: Multiple service tiers AND experienced THEN: Show comparison
   * Condition: yearsInBusiness >= 3 AND (pricing-based industry OR multiple offerings)
   */
  deployServiceComparison(): ServiceComparisonConfig | null {
    const hasExperience = (this.business.yearsInBusiness || 0) >= 3;
    const hasMultipleOfferings = (this.business.employees || 0) > 3;

    if (!hasExperience || !hasMultipleOfferings) return null;

    return {
      enabled: true,
      position: 'services',
      priority: 70,
      compareType: 'tiers',
      displayFormat: 'cards',
      highlightPopular: true,
      customProps: {
        animation: 'slide-in',
        focusPopular: true,
        interactiveComparison: true,
        printFriendly: true,
        ctaButtonStyle: 'primary',
      },
    };
  }

  /**
   * CUSTOMER SUCCESS STORIES
   * IF: Established business (3+ years) THEN: Show success stories
   * Condition: yearsInBusiness >= 3
   */
  deployCustomerSuccessStories(): SuccessStoryConfig | null {
    const hasSuccessHistory = (this.business.yearsInBusiness || 0) >= 3;

    if (!hasSuccessHistory) return null;

    return {
      enabled: true,
      position: 'content-hub',
      priority: 55,
      layout: 'carousel',
      storyCount: Math.min(5, (this.business.yearsInBusiness || 3) / 2),
      includeMetrics: true,
      showTimeline: true,
      customProps: {
        displayFormat: 'story-card',
        autoRotate: true,
        rotationInterval: 5000,
        expandableDetail: true,
        imageAspectRatio: '16:9',
      },
    };
  }

  /**
   * GET ALL FEATURES
   * Deploy all applicable features for this business
   */
  deployAllFeatures(): Record<string, FeatureConfig | null> {
    return {
      stickyMobileCTA: this.deployStickyMobileCTA(),
      foilSealBadge: this.deployFoilSealBadge(),
      tilt3DBadge: this.deployTilt3DBadge(),
      scarcitySignals: this.deployScarcitySignals(),
      beforeAfterGallery: this.deployBeforeAfterGallery(),
      faqSection: this.deployFAQSection(),
      testimonialCarousel: this.deployTestimonialCarousel(),
      animatedTeamHero: this.deployAnimatedTeamHero(),
      interactiveCalculator: this.deployInteractiveServiceCalculator(),
      chatWidget: this.deployChatWidget(),
      videoHeroSection: this.deployVideoHeroSection(),
      serviceComparison: this.deployServiceComparison(),
      successStories: this.deployCustomerSuccessStories(),
    };
  }

  /**
   * GET ENABLED FEATURES
   * Filter to only deployed (enabled) features
   */
  getEnabledFeatures(): Record<string, FeatureConfig> {
    const allFeatures = this.deployAllFeatures();
    const enabled: Record<string, FeatureConfig> = {};

    for (const [key, config] of Object.entries(allFeatures)) {
      if (config?.enabled) {
        enabled[key] = config;
      }
    }

    return enabled;
  }

  /**
   * Helper: Determine primary CTA action
   */
  private determineCallAction(): 'call' | 'message' | 'book' | 'quote' {
    const callIndustries = ['plumbing', 'hvac', 'electrical', 'emergency'];
    const bookingIndustries = ['carpentry', 'painting', 'landscaping'];

    if (callIndustries.some((ind) =>
      this.business.industry.toLowerCase().includes(ind),
    )) {
      return 'call';
    }

    if (bookingIndustries.some((ind) =>
      this.business.industry.toLowerCase().includes(ind),
    )) {
      return 'book';
    }

    return 'quote';
  }

  /**
   * Helper: Get CTA text
   */
  private getCallToActionText(action: string): string {
    const texts: Record<string, string> = {
      call: 'Call Now',
      message: 'Message Us',
      book: 'Book Service',
      quote: 'Get Quote',
    };
    return texts[action] || 'Get Started';
  }

  /**
   * Helper: Determine if high-demand industry
   */
  private isHighDemandIndustry(): boolean {
    const highDemand = [
      'plumbing',
      'hvac',
      'electrical',
      'roofing',
      'emergency',
    ];
    return highDemand.some((ind) =>
      this.business.industry.toLowerCase().includes(ind),
    );
  }

  /**
   * Helper: Generate scarcity messages
   */
  private generateScarcityMessages(): string[] {
    const area = this.business.serviceArea || 'this area';
    return [
      `Limited availability in ${area}`,
      `${this.business.employees || 3} technicians serving ${area}`,
      `Book now - limited slots this week`,
      `High demand in ${area}`,
    ];
  }
}

/**
 * Export convenience functions for quick feature deployment
 */
export function createFeatureDeployer(business: Business): FeatureDeployer {
  return new FeatureDeployer(business);
}

export function deployFeaturesForBusiness(
  business: Business,
): Record<string, FeatureConfig> {
  const deployer = new FeatureDeployer(business);
  return deployer.getEnabledFeatures();
}

export function checkIfFeatureEnabled(
  business: Business,
  featureName: keyof ReturnType<FeatureDeployer['deployAllFeatures']>,
): boolean {
  const deployer = new FeatureDeployer(business);
  const features = deployer.deployAllFeatures();
  return features[featureName]?.enabled ?? false;
}
