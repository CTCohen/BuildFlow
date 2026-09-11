/**
 * Trust Blue + Warm Accent Variant
 * Trust blue primary, warm orange/amber accent - reliability, professionalism, approachability
 * Ideal for: Traditional trades, established HVAC/plumbing, value positioning
 * Psychology: Conveys trust, reliability, professionalism, warmth, approachability
 */

import type { ColorVariant } from './color-token-structure';

export const trustBlueAccent: ColorVariant = {
  id: 'trust-blue-accent',
  name: 'Trust Blue + Warm Accent',
  description: 'Professional trust blue primary with warm orange accent. Balanced reliability and approachability.',
  use_cases: ['Established HVAC', 'Traditional plumbing', 'Value positioning', 'Community trades'],
  wcag_ratio: 7.2,

  light_mode: {
    // Primary: Trust Blue
    primary: {
      base: '#0369a1',        // Cyan-600: Professional trust blue
      light: '#e0f2fe',       // Cyan-100: Light background
      dark: '#0c4a6e',        // Cyan-900: Dark variant
      surface: '#ecf0f9',     // Cyan-50: Subtle background
    },

    // Accent: Warm Orange
    accent: {
      base: '#f59e0b',        // Amber-500: Warm, inviting orange
      light: '#fef3c7',       // Amber-100: Light background
      dark: '#b45309',        // Amber-700: Dark variant
      muted: '#fed7aa',       // Amber-200: Muted for secondary
    },

    // Semantic Colors
    success: {
      base: '#16a34a',        // Green-600
      light: '#dcfce7',       // Green-100
      dark: '#15803d',        // Green-700
    },

    warning: {
      base: '#ea580c',        // Orange-600
      light: '#fed7aa',       // Orange-100
      dark: '#7c2d12',        // Orange-900
    },

    error: {
      base: '#dc2626',        // Red-600
      light: '#fee2e2',       // Red-100
      dark: '#7f1d1d',        // Red-950
    },

    info: {
      base: '#0369a1',        // Cyan-600 (aligns with primary)
      light: '#e0f2fe',       // Cyan-100
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
      light: '#e5e7eb',       // Gray-200
      medium: '#d1d5db',      // Gray-300
      dark: '#9ca3af',        // Gray-400
    },
  },

  dark_mode: {
    // Primary: Bright Blue (for dark mode)
    primary: {
      base: '#06b6d4',        // Cyan-500: Brighter blue for dark mode
      light: '#0c4a6e',       // Cyan-900: For backgrounds
      dark: '#cffafe',        // Cyan-200: Text/strokes
      surface: '#0c4a6e',     // Cyan-900: Dark surface
    },

    // Accent: Warm Orange
    accent: {
      base: '#f97316',        // Orange-500: Brighter orange in dark mode
      light: '#7c2d12',       // Orange-900: Backgrounds
      dark: '#fed7aa',        // Orange-200: Text/strokes
      muted: '#fb923c',       // Orange-400: Muted variant
    },

    // Semantic Colors
    success: {
      base: '#22c55e',        // Green-500
      light: '#166534',       // Green-900
      dark: '#86efac',        // Green-300
    },

    warning: {
      base: '#f97316',        // Orange-500
      light: '#7c2d12',       // Orange-900
      dark: '#fed7aa',        // Orange-200
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
      light: '#374151',       // Gray-700
      medium: '#4b5563',      // Gray-600
      dark: '#9ca3af',        // Gray-400
    },
  },

  badge_config: {
    success: '#16a34a',       // Green-600
    warning: '#ea580c',       // Orange-600
    error: '#dc2626',         // Red-600
    info: '#0369a1',          // Cyan-600
    default: '#f59e0b',       // Amber (accent color)
  },
};

/**
 * Component Usage Guide for Trust Blue + Warm Accent
 *
 * Primary Button (Get Estimate):
 *   - Background: var(--color-primary-base)  // #0369a1
 *   - Text: var(--color-text-inverse)        // #ffffff
 *   - Border: var(--color-primary-dark)      // #0c4a6e
 *   - Hover: Darken primary by 10%
 *
 * Secondary Button (Learn More):
 *   - Background: var(--color-accent-light)  // #fef3c7
 *   - Text: var(--color-accent-dark)         // #b45309
 *   - Border: var(--color-accent-base)       // #f59e0b
 *   - Hover: Darken accent by 5%
 *
 * Trust Indicator Badge:
 *   - Background: var(--color-info-light)    // #e0f2fe
 *   - Text: var(--color-info-dark)           // #0c4a6e
 *   - Border: var(--color-info-base)         // #0369a1
 *
 * Service Card:
 *   - Background: var(--color-neutral-white)
 *   - Border: var(--color-border-light)
 *   - Icon/Accent: var(--color-accent-base)
 *   - Title: var(--color-primary-base)
 *   - Text: var(--color-text-primary)
 *
 * CTA Section:
 *   - Background: var(--color-primary-base)
 *   - Accent bar: var(--color-accent-base)
 *   - Text: var(--color-text-inverse)
 *   - Button: Use secondary style
 *
 * Form Elements:
 *   - Input border: var(--color-border-light)
 *   - Focus ring: var(--color-primary-base)
 *   - Label: var(--color-primary-base)
 *   - Helper text: var(--color-text-muted)
 */
