/**
 * Variant Selector — Deterministic design variant selection for service businesses
 * Creates reproducible design choices (colors, typography, variants) from business attributes
 */

export interface Business {
  id: string;
  name: string;
  industry: string;
  location?: string;
  serviceArea?: string;
  employees?: number;
  yearsInBusiness?: number;
  targetAudience?: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  success: string;
  error: string;
  warning: string;
}

export interface TypographyToken {
  fontFamily: string;
  headingScale: number; // multiplier for heading sizes
  bodySize: number; // px
  lineHeight: number;
  fontWeight: {
    light: number;
    regular: number;
    semibold: number;
    bold: number;
  };
}

export interface VariantSelection {
  variantId: string;
  category: string;
  colors: ColorScheme;
  typography: TypographyToken;
  seed: number;
}

// Color palettes for different variant IDs
const COLOR_PALETTES: Record<string, ColorScheme> = {
  // Bold & Professional (trades, contractors)
  'bold-pro': {
    primary: '#1F2937',
    secondary: '#3B82F6',
    accent: '#F59E0B',
    neutral: '#6B7280',
    success: '#10B981',
    error: '#EF4444',
    warning: '#FBBF24',
  },
  // Warm & Approachable (cleaning, home services)
  'warm-approachable': {
    primary: '#92400E',
    secondary: '#DC2626',
    accent: '#F97316',
    neutral: '#78716C',
    success: '#16A34A',
    error: '#EF4444',
    warning: '#F59E0B',
  },
  // Tech & Modern (modern HVAC, smart home)
  'tech-modern': {
    primary: '#0F172A',
    secondary: '#06B6D4',
    accent: '#8B5CF6',
    neutral: '#475569',
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
  },
  // Trustworthy & Calm (plumbing, roofing)
  'trustworthy-calm': {
    primary: '#1E3A8A',
    secondary: '#0891B2',
    accent: '#059669',
    neutral: '#64748B',
    success: '#16A34A',
    error: '#DC2626',
    warning: '#D97706',
  },
  // Vibrant & Energetic (pressure washing, junk removal)
  'vibrant-energetic': {
    primary: '#7C3AED',
    secondary: '#EC4899',
    accent: '#F59E0B',
    neutral: '#6B7280',
    success: '#10B981',
    error: '#EF4444',
    warning: '#FBBF24',
  },
};

const TYPOGRAPHY_TOKENS: Record<string, TypographyToken> = {
  'serif-traditional': {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    headingScale: 1.4,
    bodySize: 16,
    lineHeight: 1.6,
    fontWeight: {
      light: 300,
      regular: 400,
      semibold: 600,
      bold: 700,
    },
  },
  'sans-modern': {
    fontFamily: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif",
    headingScale: 1.35,
    bodySize: 16,
    lineHeight: 1.5,
    fontWeight: {
      light: 300,
      regular: 400,
      semibold: 600,
      bold: 700,
    },
  },
  'sans-geometric': {
    fontFamily: "'Poppins', 'DM Sans', '-apple-system', sans-serif",
    headingScale: 1.3,
    bodySize: 15,
    lineHeight: 1.6,
    fontWeight: {
      light: 300,
      regular: 400,
      semibold: 600,
      bold: 700,
    },
  },
  'mono-tech': {
    fontFamily: "'Courier New', 'Menlo', monospace",
    headingScale: 1.25,
    bodySize: 14,
    lineHeight: 1.7,
    fontWeight: {
      light: 300,
      regular: 400,
      semibold: 600,
      bold: 700,
    },
  },
  'sans-friendly': {
    fontFamily: "'Trebuchet MS', sans-serif",
    headingScale: 1.4,
    bodySize: 16,
    lineHeight: 1.6,
    fontWeight: {
      light: 300,
      regular: 400,
      semibold: 600,
      bold: 700,
    },
  },
};

// Variant selection by industry category
const VARIANT_BY_INDUSTRY: Record<string, string[]> = {
  plumbing: ['trustworthy-calm', 'bold-pro'],
  hvac: ['tech-modern', 'trustworthy-calm', 'bold-pro'],
  electrical: ['bold-pro', 'tech-modern'],
  roofing: ['trustworthy-calm', 'bold-pro'],
  carpentry: ['warm-approachable', 'bold-pro'],
  cleaning: ['warm-approachable', 'vibrant-energetic'],
  'pressure-washing': ['vibrant-energetic', 'warm-approachable'],
  'junk-removal': ['vibrant-energetic', 'bold-pro'],
  'carpet-cleaning': ['warm-approachable', 'vibrant-energetic'],
  'house-cleaning': ['warm-approachable', 'trustworthy-calm'],
  landscaping: ['warm-approachable', 'vibrant-energetic'],
  painting: ['vibrant-energetic', 'warm-approachable'],
  'handyman': ['bold-pro', 'warm-approachable'],
  default: ['bold-pro', 'warm-approachable', 'tech-modern', 'trustworthy-calm', 'vibrant-energetic'],
};

/**
 * Hash a business to a deterministic seed number
 * Same business always produces same seed
 */
export function createSeed(business: Business): number {
  const input = `${business.name}|${business.industry}|${business.location || ''}`;
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash);
}

/**
 * Select a variant ID from a category using seed for determinism
 */
export function selectVariant(category: string, seed: number): string {
  const variants = VARIANT_BY_INDUSTRY[category.toLowerCase()] ||
    VARIANT_BY_INDUSTRY.default;

  const index = seed % variants.length;
  return variants[index];
}

/**
 * Select a color scheme based on variant ID and seed
 */
export function selectColorToken(variantId: string, seed: number): ColorScheme {
  // Return palette for variant, or default if not found
  return (
    COLOR_PALETTES[variantId] ||
    COLOR_PALETTES['bold-pro']
  );
}

/**
 * Select typography based on variant ID and seed
 */
export function selectTypographyToken(variantId: string, seed: number): TypographyToken {
  // Map variants to typography tokens for cohesive design
  const variantToTypography: Record<string, string> = {
    'bold-pro': 'sans-modern',
    'warm-approachable': 'sans-friendly',
    'tech-modern': 'sans-geometric',
    'trustworthy-calm': 'serif-traditional',
    'vibrant-energetic': 'sans-geometric',
  };

  const typographyKey = variantToTypography[variantId] || 'sans-modern';
  return TYPOGRAPHY_TOKENS[typographyKey] || TYPOGRAPHY_TOKENS['sans-modern'];
}

/**
 * Complete variant selection pipeline
 * Takes business info, returns full design token set
 */
export function selectVariantForBusiness(business: Business): VariantSelection {
  const seed = createSeed(business);
  const variantId = selectVariant(business.industry, seed);
  const colors = selectColorToken(variantId, seed);
  const typography = selectTypographyToken(variantId, seed);

  return {
    variantId,
    category: business.industry,
    colors,
    typography,
    seed,
  };
}

/**
 * Get all available variants for documentation/preview
 */
export function getAvailableVariants(): Record<string, { colors: ColorScheme; typography: TypographyToken }> {
  const result: Record<string, { colors: ColorScheme; typography: TypographyToken }> = {};

  for (const [variantId, colors] of Object.entries(COLOR_PALETTES)) {
    const typography = selectTypographyToken(variantId, 0);
    result[variantId] = { colors, typography };
  }

  return result;
}

/**
 * Preview what a business would receive
 */
export function previewBusinessDesign(business: Business): VariantSelection & { preview: string } {
  const selection = selectVariantForBusiness(business);
  return {
    ...selection,
    preview: `Business "${business.name}" (${business.industry}) → Variant: ${selection.variantId}, Seed: ${selection.seed}`,
  };
}
