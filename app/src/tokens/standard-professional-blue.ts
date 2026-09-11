/**
 * Standard Professional Blue + Warm Accent Variant
 * Industry-standard blue primary, warm orange/rust accent - established, reliable, accessible
 * Ideal for: Traditional service businesses, mainstream positioning, broad appeal
 * Psychology: Conveys competence, reliability, trust, accessibility, professionalism
 */

import type { ColorVariant } from './color-token-structure';

export const standardProfessionalBlue: ColorVariant = {
  id: 'standard-professional-blue',
  name: 'Standard Professional Blue + Warm',
  description: 'Industry-standard blue primary with warm accent. Reliable, accessible, trusted.',
  use_cases: ['Mainstream HVAC', 'Traditional plumbing', 'Broad market appeal', 'Value positioning'],
  wcag_ratio: 7.4,

  light_mode: {
    // Primary: Industry-Standard Blue
    primary: {
      base: '#2563eb',        // Blue-600: Classic, recognized professional blue
      light: '#eff6ff',       // Blue-50: Light background
      dark: '#1e40af',        // Blue-700: Dark variant
      surface: '#f0f9ff',     // Blue-50: Subtle background
    },

    // Accent: Warm Orange/Rust
    accent: {
      base: '#ea580c',        // Orange-600: Warm, approachable accent
      light: '#fed7aa',       // Orange-100: Light background
      dark: '#7c2d12',        // Orange-900: Dark variant
      muted: '#fb923c',       // Orange-400: Muted variant
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
      base: '#dc2626',        // Red-600
      light: '#fee2e2',       // Red-100
      dark: '#7f1d1d',        // Red-950
    },

    info: {
      base: '#2563eb',        // Blue-600 (aligns with primary)
      light: '#eff6ff',       // Blue-50
      dark: '#1e40af',        // Blue-700
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
      light: '#dbeafe',       // Blue-100
      medium: '#bfdbfe',      // Blue-200
      dark: '#93c5fd',        // Blue-300
    },
  },

  dark_mode: {
    // Primary: Bright Blue (for dark mode)
    primary: {
      base: '#3b82f6',        // Blue-500: Brighter blue for dark mode
      light: '#1e40af',       // Blue-700: For backgrounds
      dark: '#dbeafe',        // Blue-200: Text/strokes
      surface: '#1e3a8a',     // Blue-900: Dark surface
    },

    // Accent: Warm Orange
    accent: {
      base: '#f97316',        // Orange-500: Bright orange in dark mode
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
      base: '#3b82f6',        // Blue-500
      light: '#1e40af',       // Blue-700
      dark: '#dbeafe',        // Blue-200
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
      light: '#1e40af',       // Blue-700
      medium: '#2563eb',      // Blue-600
      dark: '#3b82f6',        // Blue-500
    },
  },

  badge_config: {
    success: '#16a34a',       // Green-600
    warning: '#f59e0b',       // Amber-500
    error: '#dc2626',         // Red-600
    info: '#2563eb',          // Blue-600
    default: '#ea580c',       // Orange (accent color)
  },
};

/**
 * Component Usage Guide for Standard Professional Blue + Warm
 *
 * Primary Button (Get Help Now):
 *   - Background: var(--color-primary-base)  // #2563eb
 *   - Text: var(--color-text-inverse)        // #ffffff
 *   - Border: var(--color-primary-dark)      // #1e40af
 *   - Hover: Darken primary by 10%
 *   - Active: Further darken or adjust shadow
 *
 * Secondary Button (Learn More):
 *   - Background: var(--color-accent-light)  // #fed7aa
 *   - Text: var(--color-accent-dark)         // #7c2d12
 *   - Border: var(--color-accent-base)       // #ea580c
 *   - Hover: Darken accent by 5%
 *
 * Service Card:
 *   - Background: var(--color-neutral-white)
 *   - Border: var(--color-border-light)
 *   - Icon/Badge: var(--color-accent-base)
 *   - Heading: var(--color-primary-base)
 *   - Text: var(--color-text-primary)
 *
 * Review/Testimonial Card:
 *   - Background: var(--color-neutral-light)
 *   - Border-left: var(--color-accent-base)
 *   - Rating stars: var(--color-accent-base)
 *   - Text: var(--color-text-primary)
 *
 * Trust/Credential Badge:
 *   - Background: var(--color-info-light)    // #eff6ff
 *   - Text: var(--color-info-dark)           // #1e40af
 *   - Border: var(--color-info-base)         // #2563eb
 *   - Icon: var(--color-accent-base)
 *
 * Hero/Banner Section:
 *   - Background: var(--color-primary-base)
 *   - Text: var(--color-text-inverse)
 *   - Accent stripe: var(--color-accent-base)
 *   - Button: Orange accent style
 *
 * Form Elements:
 *   - Input border: var(--color-border-light)
 *   - Focus ring: var(--color-primary-base)
 *   - Label: var(--color-primary-base)
 *   - Valid indicator: var(--color-success-base)
 *   - Error: var(--color-error-base)
 *
 * Navigation:
 *   - Background: var(--color-primary-base)
 *   - Text: var(--color-text-inverse)
 *   - Active link: var(--color-accent-base)
 *   - Hover: Lighten primary by 10%
 */
