/**
 * Visual Vibrant Green + Gold Variant
 * Vibrant emerald primary, gold accent - visual trades, artistry, expertise
 * Ideal for: Landscaping, environmental services, decorative trades, craftsmanship
 * Psychology: Conveys nature, quality, expertise, growth, visual excellence, sustainability
 */

import type { ColorVariant } from './color-token-structure';

export const visualVibrantGreen: ColorVariant = {
  id: 'visual-vibrant-green',
  name: 'Visual Vibrant Green + Gold',
  description: 'Vibrant emerald primary with gold accent. Conveys expertise and visual excellence.',
  use_cases: ['Landscaping', 'Visual trades', 'Decorative services', 'Environmental positioning'],
  wcag_ratio: 7.1,

  light_mode: {
    // Primary: Vibrant Emerald
    primary: {
      base: '#059669',        // Emerald-600: Vibrant, natural green
      light: '#d1fae5',       // Emerald-100: Light background
      dark: '#047857',        // Emerald-700: Dark variant
      surface: '#ecfdf5',     // Emerald-50: Subtle background
    },

    // Accent: Sophisticated Gold
    accent: {
      base: '#ca8a04',        // Amber-700: Rich gold
      light: '#fef3c7',       // Amber-100: Light background
      dark: '#78350f',        // Amber-900: Dark variant
      muted: '#fbbf24',       // Amber-400: Muted variant
    },

    // Semantic Colors
    success: {
      base: '#059669',        // Emerald-600 (aligns with primary)
      light: '#d1fae5',       // Emerald-100
      dark: '#047857',        // Emerald-700
    },

    warning: {
      base: '#f59e0b',        // Amber-500
      light: '#fef3c7',       // Amber-100
      dark: '#b45309',        // Amber-700
    },

    error: {
      base: '#dc2626',        // Red-600
      light: '#fee2e2',       // Red-100
      dark: '#7f1d1d',        // Red-950
    },

    info: {
      base: '#0891b2',        // Cyan-600
      light: '#cffafe',       // Cyan-100
      dark: '#0c4a6e',        // Cyan-900
    },

    // Neutral Grays
    neutral: {
      white: '#ffffff',
      lightest: '#f9fafb',
      light: '#f3f4f6',
      medium: '#d1d5db',
      dark: '#6b7280',
      darker: '#374151',
      darkest: '#111827',
      black: '#000000',
    },

    // Text Colors
    text: {
      primary: '#1f2937',     // Gray-800
      secondary: '#6b7280',   // Gray-500
      inverse: '#ffffff',     // White on dark backgrounds
      muted: '#9ca3af',       // Gray-400
    },

    // Border Colors
    border: {
      light: '#d1fae5',       // Emerald-200
      medium: '#a7f3d0',      // Emerald-300
      dark: '#6ee7b7',        // Emerald-400
    },
  },

  dark_mode: {
    // Primary: Bright Emerald (for dark mode)
    primary: {
      base: '#10b981',        // Emerald-500: Brighter green for dark mode
      light: '#064e3b',       // Emerald-950: For backgrounds
      dark: '#a7f3d0',        // Emerald-300: Text/strokes
      surface: '#064e3b',     // Emerald-950: Dark surface
    },

    // Accent: Warm Gold
    accent: {
      base: '#fbbf24',        // Amber-400: Bright gold for dark mode
      light: '#78350f',       // Amber-900: Backgrounds
      dark: '#fef3c7',        // Amber-100: Text/strokes
      muted: '#92400e',       // Amber-800: Muted variant
    },

    // Semantic Colors
    success: {
      base: '#10b981',        // Emerald-500
      light: '#064e3b',       // Emerald-950
      dark: '#a7f3d0',        // Emerald-300
    },

    warning: {
      base: '#f59e0b',        // Amber-500
      light: '#78350f',       // Amber-900
      dark: '#fef3c7',        // Amber-100
    },

    error: {
      base: '#ef4444',        // Red-500
      light: '#7f1d1d',       // Red-950
      dark: '#fca5a5',        // Red-300
    },

    info: {
      base: '#06b6d4',        // Cyan-500
      light: '#0c4a6e',       // Cyan-900
      dark: '#cffafe',        // Cyan-200
    },

    // Neutral Grays
    neutral: {
      white: '#ffffff',
      lightest: '#f9fafb',
      light: '#e5e7eb',
      medium: '#9ca3af',
      dark: '#4b5563',
      darker: '#1f2937',
      darkest: '#111827',
      black: '#000000',
    },

    // Text Colors
    text: {
      primary: '#f3f4f6',     // Gray-100
      secondary: '#d1d5db',   // Gray-300
      inverse: '#111827',     // Dark gray
      muted: '#9ca3af',       // Gray-400
    },

    // Border Colors
    border: {
      light: '#047857',       // Emerald-700
      medium: '#059669',      // Emerald-600
      dark: '#10b981',        // Emerald-500
    },
  },

  badge_config: {
    success: '#059669',       // Emerald-600
    warning: '#f59e0b',       // Amber-500
    error: '#dc2626',         // Red-600
    info: '#0891b2',          // Cyan-600
    default: '#ca8a04',       // Gold (accent color)
  },
};

/**
 * Component Usage Guide for Visual Vibrant Green + Gold
 *
 * Primary Button (View Portfolio):
 *   - Background: var(--color-primary-base)  // #059669
 *   - Text: var(--color-text-inverse)        // #ffffff
 *   - Border: var(--color-primary-dark)      // #047857
 *   - Hover: Darken primary by 10%
 *
 * Secondary Button (Get Quote):
 *   - Background: var(--color-accent-base)   // #ca8a04
 *   - Text: var(--color-text-inverse)        // #ffffff
 *   - Border: var(--color-accent-dark)       // #78350f
 *   - Hover: Brighten accent by 10%
 *
 * Portfolio/Work Card:
 *   - Background: var(--color-neutral-white)
 *   - Border: var(--color-border-medium)     // Green-300
 *   - Accent bar: var(--color-accent-base)
 *   - Hover: Lift shadow, slight scale
 *   - Title: var(--color-primary-base)
 *
 * Before/After Gallery:
 *   - Border: var(--color-primary-base)      // Green
 *   - Divider accent: var(--color-accent-base) // Gold
 *   - Label: var(--color-text-primary)
 *
 * Achievement/Expertise Badge:
 *   - Background: var(--color-primary-light) // #d1fae5
 *   - Text: var(--color-primary-dark)        // #047857
 *   - Icon: var(--color-accent-base)         // Gold
 *
 * Hero Section:
 *   - Background: Linear gradient (primary to dark)
 *   - Accent stripe: var(--color-accent-base)
 *   - Text: var(--color-text-inverse)
 *   - Button: Secondary style (gold)
 *
 * Form Elements:
 *   - Input border: var(--color-border-light)
 *   - Focus ring: var(--color-primary-base)
 *   - Label: var(--color-primary-base)
 *   - Success check: var(--color-primary-base)
 */
