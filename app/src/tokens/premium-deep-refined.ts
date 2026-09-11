/**
 * Premium Deep + Refined Variant
 * Deep navy/charcoal primary, muted accents - sophistication, excellence, high-end
 * Ideal for: Premium HVAC contractors, luxury service positioning, established firms
 * Psychology: Conveys expertise, luxury, trust, timelessness, refined taste
 */

import type { ColorVariant } from './color-token-structure';

export const premiumDeepRefined: ColorVariant = {
  id: 'premium-deep-refined',
  name: 'Premium Deep + Refined',
  description: 'Deep navy/charcoal primary with muted accents. Conveys sophistication and excellence.',
  use_cases: ['Premium HVAC', 'Luxury home services', 'High-end contractors', 'Expert positioning'],
  wcag_ratio: 7.8,

  light_mode: {
    // Primary: Deep Navy
    primary: {
      base: '#1e3a8a',        // Blue-900: Deep, sophisticated blue
      light: '#dbeafe',       // Blue-100: Light background
      dark: '#0c1e3c',        // Blue-950: Darker variant
      surface: '#eff6ff',     // Blue-50: Subtle background
    },

    // Accent: Muted Gold
    accent: {
      base: '#b8860b',        // Goldenrod: Sophisticated metallic
      light: '#fef3c7',       // Amber-100: Light background
      dark: '#78350f',        // Amber-900: Dark variant
      muted: '#fbbf24',       // Amber-400: Lighter muted
    },

    // Semantic Colors
    success: {
      base: '#059669',        // Emerald-600
      light: '#d1fae5',       // Emerald-100
      dark: '#047857',        // Emerald-700
    },

    warning: {
      base: '#d97706',        // Amber-600
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
      medium: '#cbd5e1',
      dark: '#64748b',
      darker: '#334155',
      darkest: '#1e293b',
      black: '#000000',
    },

    // Text Colors
    text: {
      primary: '#1e293b',     // Slate-900
      secondary: '#64748b',   // Slate-500
      inverse: '#ffffff',     // White on dark backgrounds
      muted: '#94a3b8',       // Slate-400
    },

    // Border Colors
    border: {
      light: '#e2e8f0',       // Slate-200
      medium: '#cbd5e1',      // Slate-300
      dark: '#94a3b8',        // Slate-400
    },
  },

  dark_mode: {
    // Primary: Deep charcoal (refined for dark)
    primary: {
      base: '#3b82f6',        // Blue-500: Elevated blue for dark mode
      light: '#0c1e3c',       // Blue-950: For backgrounds
      dark: '#93c5fd',        // Blue-300: Text/strokes
      surface: '#1e293b',     // Slate-900: Dark surface
    },

    // Accent: Warm Gold
    accent: {
      base: '#fbbf24',        // Amber-400: Warm and refined
      light: '#78350f',       // Amber-900: Backgrounds
      dark: '#fef3c7',        // Amber-100: Text/strokes
      muted: '#92400e',       // Amber-800: Muted variant
    },

    // Semantic Colors
    success: {
      base: '#10b981',        // Emerald-500
      light: '#064e3b',       // Emerald-950
      dark: '#86efac',        // Emerald-300
    },

    warning: {
      base: '#f59e0b',        // Amber-500
      light: '#78350f',       // Amber-900
      dark: '#fcd34d',        // Amber-300
    },

    error: {
      base: '#ef4444',        // Red-500
      light: '#7f1d1d',       // Red-950
      dark: '#fca5a5',        // Red-300
    },

    info: {
      base: '#06b6d4',        // Cyan-500
      light: '#164e63',       // Cyan-950
      dark: '#cffafe',        // Cyan-200
    },

    // Neutral Grays
    neutral: {
      white: '#ffffff',
      lightest: '#f1f5f9',
      light: '#cbd5e1',
      medium: '#64748b',
      dark: '#334155',
      darker: '#1e293b',
      darkest: '#0f172a',
      black: '#000000',
    },

    // Text Colors
    text: {
      primary: '#f1f5f9',     // Slate-100
      secondary: '#cbd5e1',   // Slate-300
      inverse: '#0f172a',     // Dark slate
      muted: '#64748b',       // Slate-500
    },

    // Border Colors
    border: {
      light: '#334155',       // Slate-700
      medium: '#475569',      // Slate-600
      dark: '#94a3b8',        // Slate-400
    },
  },

  badge_config: {
    success: '#059669',       // Emerald-600
    warning: '#d97706',       // Amber-600
    error: '#dc2626',         // Red-600
    info: '#0891b2',          // Cyan-600
    default: '#b8860b',       // Goldenrod (accent color)
  },
};

/**
 * Component Usage Guide for Premium Deep + Refined
 *
 * Primary Button (Schedule Appointment):
 *   - Background: var(--color-primary-base)  // #1e3a8a
 *   - Text: var(--color-text-inverse)        // #ffffff
 *   - Border: var(--color-primary-dark)      // #0c1e3c
 *   - Hover: Lighten primary by 15%
 *   - Shadow: Subtle shadow for depth
 *
 * Secondary Button (View Services):
 *   - Background: var(--color-neutral-light) // #f3f4f6
 *   - Text: var(--color-primary-base)        // #1e3a8a
 *   - Border: var(--color-primary-light)     // #dbeafe
 *   - Hover: Background to #e5e7eb
 *
 * Premium Accent Element:
 *   - Background: var(--color-accent-base)   // #b8860b
 *   - Text: var(--color-text-inverse)        // #ffffff
 *   - Used for: Special offers, certifications, elite badges
 *
 * Card/Service Box:
 *   - Background: var(--color-neutral-white)
 *   - Border: var(--color-border-light)      // Subtle line
 *   - Title: var(--color-primary-base)       // Navy heading
 *   - Text: var(--color-text-primary)
 *   - Hover: Lift shadow, subtle color shift
 *
 * Form Elements:
 *   - Input border: var(--color-border-light)
 *   - Focus ring: var(--color-primary-base)
 *   - Placeholder: var(--color-text-muted)
 *   - Label: var(--color-primary-base)
 *
 * Header/Hero:
 *   - Background: var(--color-primary-base)
 *   - Accent stripe: var(--color-accent-base)
 *   - Text: var(--color-text-inverse)
 *   - Subtext: var(--color-neutral-light)
 */
