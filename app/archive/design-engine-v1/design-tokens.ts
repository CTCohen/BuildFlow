/**
 * Design Tokens System
 *
 * Intermediate representation between business data and rendered components.
 * Agents use this to make consistent design decisions across 30+ themes.
 */

export interface ColorPalette {
  primary: string;        // Hex color, used for brand elements
  accent: string;         // Hex color, used for CTAs and highlights
  primaryDark: string;    // Darkened primary for hover/active states
  primaryLight: string;   // Lightened primary for backgrounds
}

export interface DesignTokens {
  // Theme identity
  themeId: string;        // e.g., "trust-blue-gold", "modern-blue-pink"
  themeName: string;      // Human-readable name
  colors: ColorPalette;

  // Typography (from existing brand config)
  typography: 'humanist' | 'classic' | 'grotesk-serif';

  // Spacing (from existing brand config)
  density: 'compact' | 'comfortable' | 'spacious';

  // Component variants (AI-selected based on business analysis)
  components: {
    heroVariant: 'full-bleed' | 'photo-left' | 'accent-bar' | 'minimal' | 'split';
    servicesLayout: 'grid-3col' | 'grid-2col-feature' | 'card-stack' | 'list-sidebar';
    testimonialStyle: 'grid' | 'carousel' | 'sidebar';
    ctaPosition: 'floating' | 'sticky-footer' | 'embedded';
    footerVariant: 'minimal' | 'full';
  };

  // Content tone (affects copy generation)
  contentTone: {
    urgency: 'high' | 'normal' | 'low';
    formality: 'professional' | 'approachable' | 'casual';
    emphasis: 'trust' | 'speed' | 'value' | 'innovation';
  };
}

export interface BusinessAnalysis {
  maturity: 'new' | 'established' | 'veteran';    // Based on yearsInBusiness
  urgency: 'high' | 'normal';                     // Emergency-focused services?
  scale: 'solo' | 'small' | 'medium' | 'large';  // Based on teamSize
  complexity: number;                              // service_count + area_count
  trade: string;                                   // hvac, plumbing, electrical, etc.
  positioning: 'discount' | 'value' | 'premium' | 'specialist';
}

/**
 * Validate a DesignTokens object
 * Ensures all required fields are present and valid
 */
export function validateTokens(tokens: any): tokens is DesignTokens {
  if (!tokens || typeof tokens !== 'object') return false;

  // Check required fields
  if (!tokens.themeId || typeof tokens.themeId !== 'string') return false;
  if (!tokens.themeName || typeof tokens.themeName !== 'string') return false;
  if (!tokens.colors || typeof tokens.colors !== 'object') return false;
  if (!tokens.components || typeof tokens.components !== 'object') return false;

  // Validate colors
  const hexRegex = /^#(?:[0-9a-f]{3}){1,2}$/i;
  if (
    !hexRegex.test(tokens.colors.primary) ||
    !hexRegex.test(tokens.colors.accent) ||
    !hexRegex.test(tokens.colors.primaryDark) ||
    !hexRegex.test(tokens.colors.primaryLight)
  ) {
    return false;
  }

  // Validate component variants
  const validHeroVariants = ['full-bleed', 'photo-left', 'accent-bar', 'minimal', 'split'];
  const validLayouts = ['grid-3col', 'grid-2col-feature', 'card-stack', 'list-sidebar'];
  const validTestimonials = ['grid', 'carousel', 'sidebar'];
  const validCtaPositions = ['floating', 'sticky-footer', 'embedded'];

  if (!validHeroVariants.includes(tokens.components.heroVariant)) return false;
  if (!validLayouts.includes(tokens.components.servicesLayout)) return false;
  if (!validTestimonials.includes(tokens.components.testimonialStyle)) return false;
  if (!validCtaPositions.includes(tokens.components.ctaPosition)) return false;

  return true;
}

/**
 * Get contrast ratio between two colors
 * Used to ensure accessibility (WCAG AA minimum 4.5:1 for text)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const [rs, gs, bs] = [r, g, b].map(x => {
      const val = x / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Ensure theme meets accessibility standards
 */
export function validateAccessibility(tokens: DesignTokens): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // White background for text contrast checks
  const white = '#ffffff';

  // Primary text on white should be ≥4.5:1 (WCAG AA)
  const primaryContrast = getContrastRatio(tokens.colors.primary, white);
  if (primaryContrast < 4.5) {
    issues.push(
      `Primary color contrast with white is ${primaryContrast.toFixed(2)}:1, needs ≥4.5:1 (WCAG AA)`
    );
  }

  // Accent text on white should be ≥4.5:1
  const accentContrast = getContrastRatio(tokens.colors.accent, white);
  if (accentContrast < 4.5) {
    issues.push(
      `Accent color contrast with white is ${accentContrast.toFixed(2)}:1, needs ≥4.5:1 (WCAG AA)`
    );
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
