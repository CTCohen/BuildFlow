/**
 * Emergency Red + Orange Variant
 * Red primary, orange accent - urgency, speed, immediate action
 * Ideal for: HVAC emergency services, plumbing repairs, urgent trades
 * Psychology: Conveys urgency, energy, immediate response capability
 */

import type { ColorVariant } from './color-token-structure';

export const emergencyRedOrange: ColorVariant = {
  id: 'emergency-red-orange',
  name: 'Emergency Red + Orange',
  description: 'Red primary with orange accent. Conveys urgency and immediate response.',
  use_cases: ['Emergency HVAC', 'Emergency plumbing', '24/7 services', 'Fast response positioning'],
  wcag_ratio: 7.4,

  light_mode: {
    // Primary: Urgent Red
    primary: {
      base: '#dc2626',        // Red-600: Action-driving red
      light: '#fee2e2',       // Red-100: Light background
      dark: '#991b1b',        // Red-900: Dark variant
      surface: '#fef2f2',     // Red-50: Subtle background
    },

    // Accent: Energetic Orange
    accent: {
      base: '#ea580c',        // Orange-600: High visibility accent
      light: '#fed7aa',       // Orange-100: Light background
      dark: '#7c2d12',        // Orange-900: Dark variant
      muted: '#fbcfe8',       // Rose-100: Muted for secondary
    },

    // Semantic Colors
    success: {
      base: '#16a34a',        // Green-600
      light: '#dcfce7',       // Green-100
      dark: '#15803d',        // Green-700
    },

    warning: {
      base: '#f59e0b',        // Amber-500
      light: '#fef3c7',       // Amber-100
      dark: '#b45309',        // Amber-700
    },

    error: {
      base: '#dc2626',        // Red-600 (aligns with primary)
      light: '#fee2e2',       // Red-100
      dark: '#991b1b',        // Red-900
    },

    info: {
      base: '#0369a1',        // Cyan-600
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
    // Primary: Bright Red (adjusted for dark backgrounds)
    primary: {
      base: '#ef4444',        // Red-500: Brighter red for dark mode
      light: '#7f1d1d',       // Red-950: For "light" surfaces in dark mode
      dark: '#fca5a5',        // Red-300: Text/strokes on dark
      surface: '#7f1d1d',     // Red-950: Dark surface
    },

    // Accent: Bright Orange
    accent: {
      base: '#f97316',        // Orange-500: Brighter in dark mode
      light: '#7c2d12',       // Orange-950: Backgrounds
      dark: '#fed7aa',        // Orange-200: Text/strokes
      muted: '#fb7185',       // Rose-400: Muted accent
    },

    // Semantic Colors
    success: {
      base: '#22c55e',        // Green-500
      light: '#166534',       // Green-900
      dark: '#86efac',        // Green-300
    },

    warning: {
      base: '#facc15',        // Yellow-400
      light: '#78350f',       // Amber-900
      dark: '#fef08a',        // Yellow-200
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
      inverse: '#111827',     // Dark gray (inverse of dark mode)
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
    success: '#10b981',       // Emerald-500
    warning: '#f59e0b',       // Amber-500
    error: '#dc2626',         // Red-600
    info: '#3b82f6',          // Blue-500
    default: '#ea580c',       // Orange (accent color)
  },
};

/**
 * Component Usage Guide for Emergency Red + Orange
 *
 * Primary Button (Call Now / Get Help):
 *   - Background: var(--color-primary-base)  // #dc2626
 *   - Text: var(--color-text-inverse)        // #ffffff
 *   - Border: var(--color-primary-dark)      // #991b1b
 *   - Hover: Darken primary by 10%
 *
 * Secondary Button (Learn More):
 *   - Background: var(--color-accent-light)  // #fed7aa
 *   - Text: var(--color-accent-dark)         // #7c2d12
 *   - Border: var(--color-accent-base)       // #ea580c
 *   - Hover: Darken accent by 10%
 *
 * Urgency Badge:
 *   - Background: var(--color-error-light)   // #fee2e2
 *   - Text: var(--color-error-dark)          // #991b1b
 *   - Border: var(--color-error-base)        // #dc2626
 *
 * Hero Section:
 *   - Background: var(--color-primary-base)  // #dc2626
 *   - Accent stripe: var(--color-accent-base) // #ea580c
 *   - Text overlay: var(--color-text-inverse) // #ffffff
 *
 * Form Elements:
 *   - Input border: var(--color-border-light)
 *   - Focus ring: var(--color-primary-base)
 *   - Label text: var(--color-text-primary)
 *   - Helper text: var(--color-text-muted)
 */
