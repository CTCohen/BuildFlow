/**
 * Design Utilities System
 *
 * Centralizes animations, patterns, form states, and micro-interactions
 * across all verticals to eliminate inconsistency
 */

// Animation durations & easing
export const animations = {
  duration: {
    fast: '0.15s',
    normal: '0.25s',
    slow: '0.4s',
  },
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  timing: 'ease-out',
};

// Micro-interaction CSS templates
export const microInteractions = {
  buttonHover: {
    lift: `
      transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1),
                  box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: transform;
    }
    &:hover { transform: translateY(-2px); box-shadow: var(--shadow-lift); }
    &:active { transform: translateY(0); }
    `,
    glow: `
      transition: box-shadow 0.2s ease-out, background-color 0.2s ease-out;
    }
    &:hover {
      box-shadow: 0 0 20px var(--brand-accent, #f59e0b);
      filter: brightness(1.05);
    }
    `,
    ripple: `
      position: relative;
      overflow: hidden;
    }
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255,255,255, 0.5);
      transform: translate(-50%, -50%);
    }
    &:active::before {
      animation: ripple-effect 0.6s ease-out;
    }
    @keyframes ripple-effect {
      to { width: 300px; height: 300px; opacity: 0; }
    }
    `,
  },
  formFocus: {
    underline: `
      border: none;
      border-bottom: 2px solid transparent;
      transition: border-color 0.2s ease-out;
    }
    &:focus { border-bottom-color: var(--brand); outline: none; }
    `,
    borderGlow: `
      border: 1px solid var(--color-line);
      transition: all 0.2s ease-out;
    }
    &:focus {
      border-color: var(--brand);
      box-shadow: 0 0 0 3px var(--brand-light);
      outline: none;
    }
    `,
    backgroundTint: `
      background: var(--color-surface);
      border: 1px solid var(--color-line);
      transition: background 0.2s ease-out;
    }
    &:focus {
      background: color-mix(in srgb, var(--brand) 5%, var(--color-surface));
      border-color: var(--brand);
      outline: none;
    }
    `,
  },
  accentPulse: `
    animation: pulse-accent 2s ease-in-out infinite;
    @keyframes pulse-accent {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
  `,
  revealAnimation: {
    fadeUp: `
      opacity: 0;
      transform: translateY(14px);
      animation: reveal-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes reveal-fade-up {
      to { opacity: 1; transform: translateY(0); }
    }
    `,
    fadeIn: `
      opacity: 0;
      animation: reveal-fade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes reveal-fade {
      to { opacity: 1; }
    }
    `,
    scaleIn: `
      opacity: 0;
      transform: scale(0.95);
      animation: reveal-scale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes reveal-scale {
      to { opacity: 1; transform: scale(1); }
    }
    `,
  },
};

// Decorative patterns as SVG data URIs
export const patterns = {
  dots: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20"%3E%3Ccircle cx="2" cy="2" r="1.5" fill="currentColor" opacity="0.1"/%3E%3C/svg%3E',
  lines: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="10" height="10"%3E%3Cline x1="0" y1="0" x2="10" y2="10" stroke="currentColor" stroke-width="0.5" opacity="0.1"/%3E%3C/svg%3E',
  grid: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20"%3E%3Cpath d="M0 0h20v20H0z" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.05"/%3E%3C/svg%3E',
  waves: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="20" viewBox="0 0 100 20"%3E%3Cpath d="M0,10 Q25,0 50,10 T100,10" stroke="currentColor" fill="none" stroke-width="0.5" opacity="0.1"/%3E%3C/svg%3E',
};

// Form validation states
export const formStates = {
  // Minimal: Just icon feedback, no text
  minimal: {
    error: {
      indicator: '⚠️',
      color: '#dc2626',
      showMessage: false,
    },
    success: {
      indicator: '✓',
      color: '#10b981',
      showMessage: false,
    },
  },
  // Robust: Full feedback with messages, hints, validation
  robust: {
    error: {
      indicator: '✗',
      color: '#dc2626',
      showMessage: true,
      className: 'text-xs text-red-600 mt-1',
    },
    success: {
      indicator: '✓',
      color: '#10b981',
      showMessage: true,
      className: 'text-xs text-green-600 mt-1',
    },
    info: {
      icon: 'ℹ️',
      className: 'text-xs text-blue-600 mt-1',
    },
  },
};

// Accent color applications (where to use brand-accent)
export const accentColorPlaces = [
  'border-top on featured card',
  'divider between sections',
  'button hover glow',
  'testimonial star color',
  'highlighted stats/metrics',
  'accent bar on hero (emergency)',
  'form focus glow',
  'link hover underline',
  'badge background',
  'CTA emphasis',
];

// Icon system (category-specific variants)
export const iconVariants = {
  emergency: {
    primary: '🚨', // Alert
    phone: '📞', // Call
    checkmark: '✓',
    fast: '⚡', // Speed
    trusted: '🛡️', // Protection
  },
  seasonal: {
    primary: '🌱', // Growth
    schedule: '📅', // Calendar
    weather: '☀️', // Season
    checkmark: '✓',
  },
  premium: {
    primary: '✨', // Luxury
    award: '🏆', // Excellence
    crafted: '🎨', // Design
    guarantee: '✓',
  },
  portfolio: {
    primary: '📸', // Portfolio
    before: '📷', // Before
    after: '✨', // After
    project: '🎯',
  },
};

// Typography scales per category
export const typographyScales = {
  emergency: {
    h1: '2.8rem', // Larger, commanding
    h2: '2rem',
    h3: '1.3rem',
    body: '1rem',
    label: '0.75rem',
  },
  seasonal: {
    h1: '2.4rem',
    h2: '1.8rem',
    h3: '1.2rem',
    body: '1rem',
    label: '0.8rem',
  },
  premium: {
    h1: '2.2rem', // Elegant, spacious
    h2: '1.6rem',
    h3: '1.1rem',
    body: '1rem',
    label: '0.85rem',
  },
};

// Spacing rhythm variations
export const spacingRhythms = {
  compact: 'section padding: 4rem, gap: 1.5rem',
  comfortable: 'section padding: 5.5rem, gap: 2rem',
  spacious: 'section padding: 7rem, gap: 3rem',
};

// Mobile-first CTA strategies
export const ctaStrategies = {
  sticky: `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    padding: 1rem;
    background: white;
    border-top: 1px solid var(--color-line);
    box-shadow: 0 -8px 24px rgba(16, 24, 40, 0.3);
  `,
  floating: `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 40;
    border-radius: 50%;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  `,
  inline: `
    position: relative;
    margin: 2rem 0;
  `,
};

// Multi-step form patterns (86% better conversion than single-page)
export const formPatterns = {
  progressIndicator: `
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
  `,
  progressDot: `
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    transition: all 0.2s;
  `,
  progressDotActive: `
    background: var(--brand);
    color: var(--brand-ink);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  `,
  progressDotCompleted: `
    background: var(--brand);
    color: var(--brand-ink);
    opacity: 0.6;
  `,
  stepTransition: `
    opacity: 0;
    transform: translateY(8px);
    animation: fade-up 0.3s ease-out forwards;
  `,
  fieldContainer: `
    margin-bottom: 1.5rem;
    display: grid;
    gap: 0.375rem;
  `,
};

// Before/after slider component (critical for portfolio sites)
export const beforeAfterSlider = {
  container: `
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-lg);
    aspect-ratio: 16 / 9;
    cursor: col-resize;
    user-select: none;
  `,
  handle: `
    position: absolute;
    top: 0;
    left: 50%;
    width: 4px;
    height: 100%;
    background: white;
    transform: translateX(-50%);
    z-index: 10;
    cursor: col-resize;
  `,
  handleThumb: `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3rem;
    height: 3rem;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  `,
};

// Process timeline (differentiates commodities)
export const processTimeline = {
  container: `
    display: grid;
    gap: 2rem;
    position: relative;
  `,
  step: `
    display: grid;
    grid-template-columns: 3rem 1fr;
    gap: 1.5rem;
  `,
  stepNumber: `
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--brand);
    color: var(--brand-ink);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.25rem;
    flex-shrink: 0;
  `,
  stepContent: `
    padding-top: 0.25rem;
  `,
  stepLine: `
    position: absolute;
    left: 1.5rem;
    top: 3.5rem;
    width: 0;
    height: calc(100% - 3.5rem);
    border-left: 2px solid var(--color-line);
  `,
};

// Video testimonial facade pattern (prevents CLS, optimizes performance)
export const videoTestimonial = {
  container: `
    position: relative;
    aspect-ratio: 16 / 9;
    background: #000;
    border-radius: var(--radius-lg);
    overflow: hidden;
  `,
  poster: `
    width: 100%;
    height: 100%;
    object-fit: cover;
  `,
  playButton: `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: var(--brand);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    z-index: 10;
  `,
  playButtonHover: `
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  `,
};

// Contextual testimonial positioning (2-3x engagement)
export const testimonialPlacement = {
  nearFeature: `
    margin-top: 2rem;
    padding: 1.5rem;
    border-left: 4px solid var(--brand-accent);
    background: color-mix(in srgb, var(--brand) 5%, white);
    border-radius: 0.5rem;
  `,
  asideModule: `
    position: sticky;
    top: 6rem;
    padding: 1.5rem;
    background: var(--color-surface-2);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-line);
  `,
};

// Validation feedback patterns (WCAG 2.1 AA + UX research)
export const validationFeedback = {
  errorIcon: '✕',
  successIcon: '✓',
  container: `
    display: grid;
    gap: 0.25rem;
    font-size: 0.875rem;
  `,
  message: `
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.375rem;
  `,
  errorMessage: `
    color: #dc2626;
  `,
  successMessage: `
    color: #10b981;
  `,
  ariaDescribedBy: true, // WCAG requirement
};

// Advanced Badge & Guarantee Seal System
export const badgePatterns = {
  // 3D Tilt + Parallax Effect (11-18% trust lift for premium)
  tilt3D: {
    container: `
      perspective: 1000px;
      transform-style: preserve-3d;
      transition: transform 0.1s ease-out;
      cursor: pointer;
    `,
    tiltEffect: `
      transform: rotateX(var(--tilt-y, 0deg)) rotateY(var(--tilt-x, 0deg)) scale(1.02);
    `,
    innerGlow: `
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255, 0.3), rgba(255,255,255, 0));
      opacity: 0;
      transition: opacity 0.3s ease-out;
    `,
    onHover: `
      opacity: 1;
    `,
  },

  // Dynamic Specular Highlight (light reflection shift)
  specularHighlight: {
    container: `
      position: relative;
      overflow: hidden;
      border-radius: 50%;
    `,
    shine: `
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        135deg,
        rgba(255,255,255, 0.6) 0%,
        rgba(255,255,255, 0.2) 20%,
        transparent 40%
      );
      animation: shine-shift 3s ease-in-out infinite;
    `,
    keyframes: `
      @keyframes shine-shift {
        0% { transform: translateX(-100%) translateY(-100%) rotate(0deg); }
        50% { transform: translateX(0) translateY(0) rotate(5deg); }
        100% { transform: translateX(100%) translateY(100%) rotate(0deg); }
      }
    `,
  },

  // Skeuomorphic Badge/Foil Seal (embossed, physical depth)
  foilSeal: {
    container: `
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f3c659 0%, #d4af37 50%, #c9a961 100%);
      box-shadow:
        0 10px 30px rgba(0,0,0,0.3),
        inset -2px -2px 5px rgba(0,0,0,0.1),
        inset 2px 2px 5px rgba(255,255,255,0.4);
      transform: rotateX(5deg) rotateY(-5deg);
    `,
    emboss: `
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.6);
      box-shadow:
        inset 0 2px 4px rgba(0,0,0,0.2),
        0 1px 2px rgba(255,255,255,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    label: `
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      text-align: center;
      color: #3d2817;
      text-shadow: 1px 1px 0 rgba(255,255,255,0.3);
    `,
  },

  // Color Variations for Badges
  colorSchemes: {
    gold: {
      bg: 'linear-gradient(135deg, #f3c659 0%, #d4af37 50%, #c9a961 100%)',
      accent: '#3d2817',
      glow: 'rgba(211,165,56,0.5)',
      foilEdge: 'rgba(255,215,0,0.6)',
    },
    silver: {
      bg: 'linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 50%, #a8a8a8 100%)',
      accent: '#2c2c2c',
      glow: 'rgba(192,192,192,0.4)',
      foilEdge: 'rgba(220,220,220,0.6)',
    },
    copper: {
      bg: 'linear-gradient(135deg, #b87333 0%, #9a6322 50%, #7d5217 100%)',
      accent: '#3d2817',
      glow: 'rgba(184,115,51,0.4)',
      foilEdge: 'rgba(218,165,32,0.5)',
    },
    holographic: {
      bg: 'linear-gradient(45deg, #ff1493, #00ced1, #32cd32, #ffa500)',
      accent: '#ffffff',
      glow: 'rgba(255,20,147,0.3)',
      foilEdge: 'rgba(0,206,209,0.4)',
    },
  },
};

// Trust Badge Deployment Metrics
export const trustBadgeMetrics = {
  // Skeuomorphic Badge Seal: When to deploy
  foilSeal: {
    trigger: {
      yearsInBusiness: 5, // >= 5 years (established)
      guaranteeType: ['30-day-money-back', '2-year-warranty', 'lifetime'],
      premiumPositioning: true,
    },
    conversionLift: {
      baseline: '8-12%',
      withBadge: '18-25%',
      liftPercentage: '+58-150%',
    },
    placements: [
      'hero-bottom-right',
      'guarantee-section-top',
      'form-submission-success',
      'testimonial-author-badge',
    ],
    colorByVertical: {
      hvac: 'silver', // Professional, trust
      plumbing: 'gold', // Premium, quality
      roofing: 'copper', // Warmth, reliability
      landscaping: 'holographic', // Modern, premium
    },
  },

  // 3D Tilt Effect: When to deploy
  tilt3D: {
    trigger: {
      premiumPositioning: true,
      yearsInBusiness: 3,
      awardCount: 1, // At least 1 award
      desktopOnly: true, // Mobile: static
    },
    conversionLift: {
      baseline: '8-12%',
      withTilt: '11-18%',
      liftPercentage: '+25-75%',
    },
    placements: [
      'award-badge-hero',
      'featured-guarantee-module',
      'trust-score-display',
    ],
    mobileAlternative: 'static-badge', // No tilt on mobile (UX + perf)
  },

  // Dynamic Specular Highlight: When to deploy
  specularHighlight: {
    trigger: {
      premiumPositioning: true,
      portfolioSize: 50, // >= 50 projects
      yearsInBusiness: 5,
    },
    conversionLift: {
      baseline: '8-12%',
      withHighlight: '14-20%',
      liftPercentage: '+40-100%',
    },
    placements: [
      'portfolio-before-after-slider',
      'testimonial-author-photo',
      'award-badge-display',
    ],
    animationTiming: '3s', // Smooth 3-second shift
  },
};

export default {
  animations,
  microInteractions,
  patterns,
  formStates,
  accentColorPlaces,
  iconVariants,
  typographyScales,
  spacingRhythms,
  ctaStrategies,
  formPatterns,
  beforeAfterSlider,
  processTimeline,
  videoTestimonial,
  testimonialPlacement,
  validationFeedback,
  badgePatterns,
  trustBadgeMetrics,
};
