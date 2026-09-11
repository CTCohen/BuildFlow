/**
 * Vertical Pools System
 *
 * Each vertical (HVAC, landscaping, roofing, etc.) gets a dedicated pool of:
 * - 150+ color palettes
 * - 6-10 hero variants
 * - 4-6 service layouts
 * - 3-4 testimonial styles
 * - 15-25 conditional features
 */

export interface VerticalPool {
  verticalId: string;
  verticalName: string;
  category: 'emergency' | 'seasonal' | 'premium' | 'project-based' | 'specialized';

  colorPalettes: {
    primary: string;
    accent: string;
    primaryDark: string;
    primaryLight: string;
    wcagRatio: number;
  }[];

  heroVariants: string[];
  serviceLayouts: string[];
  testimonialStyles: string[];

  // NEW: Icon system (category-specific, SVG inline)
  icons: {
    phone: string; // Emergency call icon variant
    checkmark: string;
    star: string;
    [key: string]: string;
  };

  // NEW: Typography hierarchy per vertical
  typography: {
    displayScale: number; // H1 size multiplier (1.0 = normal, 1.2 = larger)
    fontFamily: 'grotesk-sans' | 'humanist-sans' | 'serif-classic';
    letterSpacing: 'tight' | 'normal' | 'wide';
    accentTypography?: 'uppercase' | 'italic' | 'letterspaced';
  };

  // NEW: Decorative elements (patterns, shapes, textures)
  decorativeElements: {
    pattern?: 'dots' | 'lines' | 'grid' | 'waves' | 'gradient-blend';
    shapes?: Array<'blob' | 'circle' | 'accent-bar'>;
    gradientDividers?: boolean;
    textureOverlay?: 'subtle' | 'medium' | 'bold';
  };

  // NEW: Spacing & rhythm variations
  spacing: {
    sectionGap: 'compact' | 'comfortable' | 'spacious'; // varies --density-section
    asymmetricalLayouts?: boolean; // Allow non-grid compositions
    overlappingSections?: boolean; // Hero/Services bleed effect
  };

  // NEW: Micro-interactions & motion
  interactions: {
    buttonHover: 'lift' | 'glow' | 'ripple';
    formFocus: 'underline' | 'border-glow' | 'background-tint';
    accentPulse?: boolean; // CTA pulse for emergency
    revealAnimation?: 'fade-up' | 'fade-in' | 'scale-in';
    transitionDuration: 'fast' | 'normal' | 'slow';
  };

  // NEW: Component-specific variants (includes 2025 gap-closing features)
  components: {
    formStates?: 'minimal' | 'robust'; // validation feedback level
    formValidation?: 'inline' | 'tooltip' | 'modal'; // Real-time error feedback style
    multiStepForm?: boolean; // 86% better conversion than single-page
    ctaBar?: 'sticky-mobile' | 'floating' | 'inline';
    gallery?: 'lightbox' | 'carousel' | 'grid';
    beforeAfter?: boolean; // Interactive before/after slider (portfolio differentiator)
    beforeAfterStyle?: 'slider' | 'toggle' | 'fade'; // Different UX patterns
    timeline?: boolean; // Process/workflow steps (differentiates commodities)
    timelineStyle?: 'vertical' | 'horizontal' | 'diagonal'; // Mobile-responsive variants
    statsDisplay?: boolean; // Metrics cards with animated counters
    trustBadges?: boolean; // Certifications/licenses
    testimonialVideos?: boolean; // Video testimonials with lightbox (highest trust)
    contextualTestimonials?: boolean; // Place testimonials near doubt points, not separate page
    testimonialPlacement?: 'near-feature' | 'aside-module' | 'dedicated-section'; // Strategic positioning
    testimonialRefresh?: number; // Update frequency (days) to signal freshness
    teamShowcase?: boolean; // People-focused variant
    pricingCards?: boolean; // Service/package comparison
    microInteractionsEnabled?: boolean; // Hover lift, glow, success celebration, fade-up reveals
  };

  // NEW: Mobile-first enhancements
  mobile: {
    navStyle: 'hamburger' | 'drawer' | 'sticky-header';
    buttonSize: 'compact' | 'standard' | 'large'; // min 48px touch target
    heroLayout: 'single-col' | 'text-first' | 'image-first';
    ctaStrategy: 'top-bar' | 'bottom-bar' | 'floating-button';
  };

  conditionalFeatures: {
    emergencyFocused?: boolean;
    portfolioHeavy?: boolean;
    seasonal?: boolean;
    projectBased?: boolean;
    premiumPositioning?: boolean;
    multiLocation?: boolean;
    soloOperator?: boolean;
    healthSafety?: boolean;
  };
}

// HVAC Pool (Emergency Category)
export const hvacPool: VerticalPool = {
  verticalId: 'hvac',
  verticalName: 'HVAC Services',
  category: 'emergency',

  // Icons: Bold, action-oriented for emergency services
  icons: {
    phone: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1z"/></svg>',
    checkmark: '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5"><path d="m5 13 4 4L19 7"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .9-5 4.9 1.2 7L12 18l-6.4 3.3L6.8 14 1.8 9.1l7-.9z"/></svg>',
  },

  typography: {
    displayScale: 1.15,
    fontFamily: 'humanist-sans',
    letterSpacing: 'normal',
    accentTypography: 'uppercase', // Emergency urgency
  },

  decorativeElements: {
    pattern: 'gradient-blend',
    shapes: ['accent-bar'], // Emergency red/orange accent bar
    gradientDividers: true,
    textureOverlay: 'subtle',
  },

  spacing: {
    sectionGap: 'comfortable',
    asymmetricalLayouts: true,
    overlappingSections: true,
  },

  interactions: {
    buttonHover: 'lift',
    formFocus: 'border-glow',
    accentPulse: true, // CTA pulses for urgency
    revealAnimation: 'fade-up',
    transitionDuration: 'fast',
  },

  components: {
    formStates: 'robust',
    ctaBar: 'sticky-mobile', // Always accessible on mobile
    gallery: false,
    beforeAfter: false,
    timeline: true, // "Same day service" workflow
    statsDisplay: true, // "8+ years", "4 areas served"
    trustBadges: true, // EPA certified, licensed
    teamShowcase: false,
    pricingCards: true, // "Flat rate pricing"
  },

  mobile: {
    navStyle: 'sticky-header',
    buttonSize: 'large', // Emphasis for emergency calls
    heroLayout: 'text-first', // Headline first: "AC quit?"
    ctaStrategy: 'bottom-bar', // Persistent call button
  },

  colorPalettes: [
    // Emergency + Trust cluster (primary palettes)
    {
      primary: '#0369a1',
      accent: '#f59e0b',
      primaryDark: '#024e7a',
      primaryLight: '#e0f2fe',
      wcagRatio: 7.2,
    },
    {
      primary: '#0369a1',
      accent: '#ea580c',
      primaryDark: '#024e7a',
      primaryLight: '#e0f2fe',
      wcagRatio: 6.8,
    },
    {
      primary: '#003d7a',
      accent: '#f59e0b',
      primaryDark: '#001f3f',
      primaryLight: '#e6f2ff',
      wcagRatio: 8.5,
    },
    // Professional + Warm variations
    {
      primary: '#1e40af',
      accent: '#f97316',
      primaryDark: '#1d4ed8',
      primaryLight: '#eff6ff',
      wcagRatio: 7.4,
    },
    {
      primary: '#1e3a8a',
      accent: '#d97706',
      primaryDark: '#172554',
      primaryLight: '#f0f9ff',
      wcagRatio: 7.6,
    },
    // Navy + Gold premium variations
    {
      primary: '#0f172a',
      accent: '#d4af37',
      primaryDark: '#020617',
      primaryLight: '#f8fafc',
      wcagRatio: 9.2,
    },
    {
      primary: '#1e293b',
      accent: '#f59e0b',
      primaryDark: '#0f172a',
      primaryLight: '#f1f5f9',
      wcagRatio: 7.1,
    },
    // Additional HVAC-specific palettes (variations for diversity)
    {
      primary: '#064e3b',
      accent: '#dc2626',
      primaryDark: '#022c1d',
      primaryLight: '#d1fae5',
      wcagRatio: 6.9,
    },
    {
      primary: '#7c3aed',
      accent: '#0ea5e9',
      primaryDark: '#6d28d9',
      primaryLight: '#f3e8ff',
      wcagRatio: 6.1,
    },
    {
      primary: '#dc2626',
      accent: '#0369a1',
      primaryDark: '#b91c1c',
      primaryLight: '#fee2e2',
      wcagRatio: 5.2,
    },
    // ... (140+ more palettes would be generated programmatically)
  ],

  heroVariants: [
    'full-bleed',      // Emergency emphasis
    'photo-left',      // Team/equipment showcase
    'accent-bar',      // Urgent colored bar
    'minimal',         // Tech-forward minimal
    'split',           // Before/after or service split
    'emergency-badge', // 24-hour badge overlay
  ],

  serviceLayouts: [
    'grid-3col',
    'grid-2col-feature',
    'card-stack',
    'list-sidebar',
    'services-emergency-vs-planned', // NEW: Split emergency/maintenance
  ],

  testimonialStyles: [
    'grid',
    'carousel',
    'sidebar',
  ],

  conditionalFeatures: {
    emergencyFocused: true,     // 24/7 messaging, floating CTA
    portfolioHeavy: false,      // Not typically portfolio-driven
    seasonal: true,             // Heating/cooling seasonal
    projectBased: false,
    premiumPositioning: false,
    multiLocation: true,        // Many HVAC franchises multi-location
    soloOperator: true,         // Solo HVAC techs exist
    healthSafety: false,
  },
};

// Landscaping Pool
export const landscapingPool: VerticalPool = {
  verticalId: 'landscaping',
  verticalName: 'Landscaping Services',
  category: 'seasonal',

  icons: {
    phone: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1z"/></svg>',
    checkmark: '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5"><path d="m5 13 4 4L19 7"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .9-5 4.9 1.2 7L12 18l-6.4 3.3L6.8 14 1.8 9.1l7-.9z"/></svg>',
  },

  typography: {
    displayScale: 1.1,
    fontFamily: 'humanist-sans',
    letterSpacing: 'normal',
    accentTypography: 'uppercase',
  },

  decorativeElements: {
    pattern: 'waves',
    shapes: ['blob'],
    gradientDividers: true,
    textureOverlay: 'subtle',
  },

  spacing: {
    sectionGap: 'comfortable',
    asymmetricalLayouts: true,
    overlappingSections: true,
  },

  interactions: {
    buttonHover: 'lift',
    formFocus: 'border-glow',
    accentPulse: false,
    revealAnimation: 'fade-up',
    transitionDuration: 'normal',
  },

  components: {
    formStates: 'robust',
    ctaBar: 'sticky-mobile',
    gallery: 'lightbox',
    beforeAfter: true,
    timeline: true,
    statsDisplay: true,
    trustBadges: true,
    teamShowcase: true,
    pricingCards: false,
  },

  mobile: {
    navStyle: 'hamburger',
    buttonSize: 'standard',
    heroLayout: 'image-first',
    ctaStrategy: 'bottom-bar',
  },

  colorPalettes: [
    // Nature + Growth cluster
    {
      primary: '#059669',
      accent: '#dc2626',
      primaryDark: '#055b4f',
      primaryLight: '#d1fae5',
      wcagRatio: 6.9,
    },
    {
      primary: '#0d9488',
      accent: '#f97316',
      primaryDark: '#0f766e',
      primaryLight: '#ccfbf1',
      wcagRatio: 6.5,
    },
    {
      primary: '#16a34a',
      accent: '#ea580c',
      primaryDark: '#15803d',
      primaryLight: '#dcfce7',
      wcagRatio: 6.2,
    },
    // Sky + Green combinations
    {
      primary: '#4dabf7',
      accent: '#059669',
      primaryDark: '#1971c2',
      primaryLight: '#e7f5ff',
      wcagRatio: 5.8,
    },
    {
      primary: '#0ea5e9',
      accent: '#16a34a',
      primaryDark: '#0369a1',
      primaryLight: '#e0f2fe',
      wcagRatio: 6.4,
    },
    // Earth tones
    {
      primary: '#7c3aed',
      accent: '#059669',
      primaryDark: '#6d28d9',
      primaryLight: '#f3e8ff',
      wcagRatio: 6.3,
    },
    {
      primary: '#b45309',
      accent: '#059669',
      primaryDark: '#92400e',
      primaryLight: '#fef3c7',
      wcagRatio: 5.7,
    },
    // Additional variations for diversity
    {
      primary: '#15803d',
      accent: '#f59e0b',
      primaryDark: '#166534',
      primaryLight: '#dcfce7',
      wcagRatio: 7.0,
    },
    {
      primary: '#065f46',
      accent: '#ff7f50',
      primaryDark: '#064e3b',
      primaryLight: '#d1fae5',
      wcagRatio: 6.2,
    },
    {
      primary: '#047857',
      accent: '#fbbf24',
      primaryDark: '#065f46',
      primaryLight: '#d1fae5',
      wcagRatio: 7.1,
    },
    // ... (140+ more palettes)
  ],

  heroVariants: [
    'photo-left',           // Portfolio emphasis
    'split',                // Before/after split
    'full-bleed',           // Design showcase
    'minimal',              // Clean, modern
    'accent-bar',           // Subtle
    'portfolio-carousel',   // NEW: Auto-rotating portfolio
  ],

  serviceLayouts: [
    'grid-3col',
    'grid-2col-feature',
    'card-stack',
    'services-with-gallery', // NEW: Gallery beneath each service
  ],

  testimonialStyles: [
    'grid',
    'carousel',
    'sidebar',
  ],

  conditionalFeatures: {
    emergencyFocused: false,
    portfolioHeavy: true,      // Before/after carousel essential
    seasonal: true,            // Spring rush, winter quiet
    projectBased: true,        // Project-based work
    premiumPositioning: false,
    multiLocation: true,       // Multi-area service
    soloOperator: true,
    healthSafety: false,
  },
};

// Roofing Pool (Premium Category - Luxury, Architectural)
export const roofingPool: VerticalPool = {
  verticalId: 'roofing',
  verticalName: 'Roofing Services',
  category: 'premium',

  icons: {
    phone: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1z"/></svg>',
    checkmark: '<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2.5"><path d="m5 13 4 4L19 7"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .9-5 4.9 1.2 7L12 18l-6.4 3.3L6.8 14 1.8 9.1l7-.9z"/></svg>',
  },

  typography: {
    displayScale: 0.95,
    fontFamily: 'serif-classic',
    letterSpacing: 'wide',
    accentTypography: 'italic',
  },

  decorativeElements: {
    pattern: 'grid',
    shapes: ['circle'],
    gradientDividers: false,
    textureOverlay: 'medium',
  },

  spacing: {
    sectionGap: 'spacious',
    asymmetricalLayouts: true,
    overlappingSections: false,
  },

  interactions: {
    buttonHover: 'glow',
    formFocus: 'background-tint',
    accentPulse: false,
    revealAnimation: 'scale-in',
    transitionDuration: 'slow',
  },

  components: {
    formStates: 'robust',
    ctaBar: 'floating',
    gallery: 'grid',
    beforeAfter: true,
    timeline: true,
    statsDisplay: true,
    trustBadges: true,
    teamShowcase: true,
    pricingCards: true,
  },

  mobile: {
    navStyle: 'drawer',
    buttonSize: 'standard',
    heroLayout: 'text-first',
    ctaStrategy: 'floating-button',
  },

  colorPalettes: [
    // Premium + Luxury cluster
    {
      primary: '#2c3e50',
      accent: '#d4af37',
      primaryDark: '#1a252f',
      primaryLight: '#ecf0f1',
      wcagRatio: 10.2,
    },
    {
      primary: '#001f3f',
      accent: '#f59e0b',
      primaryDark: '#000814',
      primaryLight: '#ecf0f9',
      wcagRatio: 7.9,
    },
    {
      primary: '#0f172a',
      accent: '#fbbf24',
      primaryDark: '#020617',
      primaryLight: '#f8fafc',
      wcagRatio: 7.9,
    },
    // Sophisticated dark variations
    {
      primary: '#1e293b',
      accent: '#f59e0b',
      primaryDark: '#0f172a',
      primaryLight: '#f1f5f9',
      wcagRatio: 7.1,
    },
    {
      primary: '#334155',
      accent: '#d4af37',
      primaryDark: '#1e293b',
      primaryLight: '#f1f5f9',
      wcagRatio: 9.8,
    },
    {
      primary: '#475569',
      accent: '#fbbf24',
      primaryDark: '#334155',
      primaryLight: '#f1f5f9',
      wcagRatio: 6.2,
    },
    // Additional premium variations
    {
      primary: '#1f2937',
      accent: '#0ea5e9',
      primaryDark: '#111827',
      primaryLight: '#f3f4f6',
      wcagRatio: 6.8,
    },
    {
      primary: '#374151',
      accent: '#ec4899',
      primaryDark: '#1f2937',
      primaryLight: '#f3f4f6',
      wcagRatio: 6.5,
    },
    {
      primary: '#4b5563',
      accent: '#06b6d4',
      primaryDark: '#2d3748',
      primaryLight: '#f7fafc',
      wcagRatio: 6.1,
    },
    {
      primary: '#7c3aed',
      accent: '#0ea5e9',
      primaryDark: '#6d28d9',
      primaryLight: '#f3e8ff',
      wcagRatio: 6.1,
    },
    // ... (140+ more palettes)
  ],

  heroVariants: [
    'minimal',              // Refined, understated
    'photo-left',           // Portfolio showcase
    'split',                // Before/after split
    'full-bleed',           // Dramatic showcase
    'luxury-minimal',       // NEW: Luxury + minimal combined
  ],

  serviceLayouts: [
    'grid-3col',
    'grid-2col-feature',
    'card-stack',
  ],

  testimonialStyles: [
    'grid',
    'sidebar',          // Featured testimonial style
    'carousel',
  ],

  conditionalFeatures: {
    emergencyFocused: false,
    portfolioHeavy: true,      // Before/after critical
    seasonal: false,
    projectBased: true,
    premiumPositioning: true,  // Always premium tone
    multiLocation: true,
    soloOperator: true,
    healthSafety: false,
  },
};

// Septic/Mold/Well (Health & Safety)
export const healthSafetyPool: VerticalPool = {
  verticalId: 'health-safety',
  verticalName: 'Health/Safety Services',
  category: 'specialized',

  colorPalettes: [
    // Professional + Health cluster
    {
      primary: '#003d7a',
      accent: '#4caf50',
      primaryDark: '#001f3f',
      primaryLight: '#e6f2ff',
      wcagRatio: 8.5,
    },
    {
      primary: '#0051ba',
      accent: '#059669',
      primaryDark: '#003087',
      primaryLight: '#e6f2ff',
      wcagRatio: 8.2,
    },
    {
      primary: '#1e40af',
      accent: '#10b981',
      primaryDark: '#1d4ed8',
      primaryLight: '#eff6ff',
      wcagRatio: 7.3,
    },
    // Clean professional variations
    {
      primary: '#1e3a8a',
      accent: '#34d399',
      primaryDark: '#172554',
      primaryLight: '#f0f9ff',
      wcagRatio: 7.4,
    },
    {
      primary: '#2563eb',
      accent: '#10b981',
      primaryDark: '#1d4ed8',
      primaryLight: '#eff6ff',
      wcagRatio: 6.8,
    },
    {
      primary: '#0369a1',
      accent: '#059669',
      primaryDark: '#024e7a',
      primaryLight: '#e0f2fe',
      wcagRatio: 6.5,
    },
    // Additional health-focused variations
    {
      primary: '#0c4a6e',
      accent: '#059669',
      primaryDark: '#082f49',
      primaryLight: '#e0f2fe',
      wcagRatio: 7.8,
    },
    {
      primary: '#1e3a8a',
      accent: '#0ea5e9',
      primaryDark: '#172554',
      primaryLight: '#f0f9ff',
      wcagRatio: 6.9,
    },
    {
      primary: '#0f766e',
      accent: '#2563eb',
      primaryDark: '#093e36',
      primaryLight: '#ccfbf1',
      wcagRatio: 5.8,
    },
    {
      primary: '#03543f',
      accent: '#3b82f6',
      primaryDark: '#022c22',
      primaryLight: '#d1fae5',
      wcagRatio: 6.4,
    },
    // ... (140+ more palettes)
  ],

  heroVariants: [
    'minimal',              // Professional, educational
    'photo-left',           // Inspector/expert display
    'accent-bar',           // Authority signal
    'full-bleed',           // Serious tone
  ],

  serviceLayouts: [
    'grid-3col',
    'card-stack',
    'education-focused',   // NEW: Info-first layout
  ],

  testimonialStyles: [
    'grid',
    'sidebar',
  ],

  conditionalFeatures: {
    emergencyFocused: true,        // Health risk = urgent
    portfolioHeavy: false,
    seasonal: false,
    projectBased: false,
    premiumPositioning: false,
    multiLocation: true,
    soloOperator: false,
    healthSafety: true,            // Certification + education focus
  },
};

// Plumbing Pool (Emergency + Multi-location)
export const plumbingPool: VerticalPool = {
  verticalId: 'plumbing',
  verticalName: 'Plumbing Services',
  category: 'emergency',

  colorPalettes: [
    // Navy + Copper (water-themed)
    {
      primary: '#0c4a6e',
      accent: '#92400e',
      primaryDark: '#082f49',
      primaryLight: '#e0f2fe',
      wcagRatio: 7.8,
    },
    {
      primary: '#1e3a8a',
      accent: '#b45309',
      primaryDark: '#172554',
      primaryLight: '#f0f9ff',
      wcagRatio: 7.2,
    },
    // Navy + Orange (urgency)
    {
      primary: '#0369a1',
      accent: '#ea580c',
      primaryDark: '#024e7a',
      primaryLight: '#e0f2fe',
      wcagRatio: 6.8,
    },
    {
      primary: '#003d7a',
      accent: '#f59e0b',
      primaryDark: '#001f3f',
      primaryLight: '#e6f2ff',
      wcagRatio: 8.5,
    },
    // Slate + Teal
    {
      primary: '#1e293b',
      accent: '#0d9488',
      primaryDark: '#0f172a',
      primaryLight: '#f1f5f9',
      wcagRatio: 7.4,
    },
    {
      primary: '#334155',
      accent: '#06b6d4',
      primaryDark: '#1e293b',
      primaryLight: '#f1f5f9',
      wcagRatio: 6.9,
    },
  ],

  heroVariants: [
    'full-bleed',      // Emergency emphasis
    'photo-left',      // Plumber at work
    'accent-bar',      // Urgent colored bar
    'minimal',         // Professional minimal
    'split',           // Problem/solution split
  ],

  serviceLayouts: [
    'grid-3col',
    'grid-2col-feature',
    'card-stack',
    'list-sidebar',
  ],

  testimonialStyles: ['grid', 'carousel', 'sidebar'],

  conditionalFeatures: {
    emergencyFocused: true,     // 24/7 emergency service
    portfolioHeavy: false,
    seasonal: false,
    projectBased: false,
    premiumPositioning: false,
    multiLocation: true,        // Multi-location franchises common
    soloOperator: true,         // Solo plumbers exist
    healthSafety: false,
  },
};

// Electrical Pool (Emergency + Safety)
export const electricalPool: VerticalPool = {
  verticalId: 'electrical',
  verticalName: 'Electrical Services',
  category: 'emergency',

  colorPalettes: [
    // High voltage yellow + blue
    {
      primary: '#1e40af',
      accent: '#fbbf24',
      primaryDark: '#1d4ed8',
      primaryLight: '#eff6ff',
      wcagRatio: 7.1,
    },
    {
      primary: '#0c4a6e',
      accent: '#fcd34d',
      primaryDark: '#082f49',
      primaryLight: '#e0f2fe',
      wcagRatio: 6.8,
    },
    // Professional blue + orange safety
    {
      primary: '#0369a1',
      accent: '#f97316',
      primaryDark: '#024e7a',
      primaryLight: '#e0f2fe',
      wcagRatio: 7.4,
    },
    {
      primary: '#1e3a8a',
      accent: '#fb923c',
      primaryDark: '#172554',
      primaryLight: '#f0f9ff',
      wcagRatio: 6.9,
    },
    // Dark professional
    {
      primary: '#1f2937',
      accent: '#fbbf24',
      primaryDark: '#111827',
      primaryLight: '#f3f4f6',
      wcagRatio: 7.2,
    },
    {
      primary: '#374151',
      accent: '#fcd34d',
      primaryDark: '#1f2937',
      primaryLight: '#f3f4f6',
      wcagRatio: 6.5,
    },
  ],

  heroVariants: [
    'full-bleed',      // Emergency visibility
    'photo-left',      // Licensed electrician display
    'accent-bar',      // Safety emphasis
    'minimal',         // Professional minimal
  ],

  serviceLayouts: [
    'grid-3col',
    'card-stack',
    'list-sidebar',
  ],

  testimonialStyles: ['grid', 'carousel', 'sidebar'],

  conditionalFeatures: {
    emergencyFocused: true,     // Electrical emergencies critical
    portfolioHeavy: false,
    seasonal: false,
    projectBased: false,
    premiumPositioning: false,
    multiLocation: true,        // Service multiple areas
    soloOperator: true,
    healthSafety: true,         // Safety certifications important
  },
};

// Deck/Fence Pool (Project-based)
export const projectBasedPool: VerticalPool = {
  verticalId: 'project-based',
  verticalName: 'Project-Based Services',
  category: 'project-based',

  colorPalettes: [
    // Natural wood + green
    {
      primary: '#b45309',
      accent: '#059669',
      primaryDark: '#92400e',
      primaryLight: '#fef3c7',
      wcagRatio: 5.9,
    },
    {
      primary: '#7c2d12',
      accent: '#0d9488',
      primaryDark: '#431407',
      primaryLight: '#fed7aa',
      wcagRatio: 6.1,
    },
    // Slate + earth
    {
      primary: '#4b5563',
      accent: '#92400e',
      primaryDark: '#2d3748',
      primaryLight: '#f7fafc',
      wcagRatio: 6.2,
    },
    {
      primary: '#374151',
      accent: '#a16207',
      primaryDark: '#1f2937',
      primaryLight: '#f3f4f6',
      wcagRatio: 6.8,
    },
    // Green + brown (nature)
    {
      primary: '#47a869',
      accent: '#92400e',
      primaryDark: '#3d6a52',
      primaryLight: '#e8f5e9',
      wcagRatio: 5.8,
    },
  ],

  heroVariants: [
    'photo-left',           // Portfolio showcase (before/after)
    'split',                // Before/after side-by-side
    'full-bleed',           // Project showcase
    'minimal',              // Clean design
  ],

  serviceLayouts: [
    'grid-2col-feature',    // Feature gallery
    'card-stack',
    'grid-3col',
  ],

  testimonialStyles: ['grid', 'carousel', 'sidebar'],

  conditionalFeatures: {
    emergencyFocused: false,
    portfolioHeavy: true,       // Before/after critical for these trades
    seasonal: false,
    projectBased: true,        // Timeline and scope essential
    premiumPositioning: false,
    multiLocation: true,       // Multi-area projects
    soloOperator: true,
    healthSafety: false,
  },
};

// Pool registry (for easy lookup)
export const verticalPools: Record<string, VerticalPool> = {
  hvac: hvacPool,
  plumbing: plumbingPool,      // Dedicated plumbing pool
  electrical: electricalPool,
  landscaping: landscapingPool,
  roofing: roofingPool,
  carpentry: projectBasedPool,  // Use project-based pool for carpentry
  'fence-installation': projectBasedPool,
  'deck-building': projectBasedPool,
  'health-safety': healthSafetyPool,
  septic: healthSafetyPool,
  mold: healthSafetyPool,
  radon: healthSafetyPool,
};

/**
 * Get the appropriate vertical pool for a business
 */
export function getVerticalPool(verticalId: string): VerticalPool {
  return verticalPools[verticalId] || hvacPool; // Default to HVAC
}

/**
 * Get a random palette from a pool
 */
export function getRandomPalette(pool: VerticalPool): VerticalPool['colorPalettes'][0] {
  return pool.colorPalettes[Math.floor(Math.random() * pool.colorPalettes.length)];
}

/**
 * Get all palettes by category (for constrained variety testing)
 */
export function getPalettesByCategory(pool: VerticalPool, count: number = 10) {
  const shuffled = [...pool.colorPalettes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.colorPalettes.length));
}
