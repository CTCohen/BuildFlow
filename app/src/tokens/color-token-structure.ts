/**
 * Color Token Structure
 * Defines the canonical token schema for all color variants.
 * Components import these token definitions and reference by token name.
 */

export interface ColorTokens {
  // Primary brand color - main UI elements, buttons, headers
  primary: {
    base: string;        // Primary action color
    light: string;       // Light background variant (for light mode)
    dark: string;        // Dark variant (for dark mode primary text)
    surface: string;     // Subtle background uses
  };

  // Accent color - highlights, secondary actions, emphasis
  accent: {
    base: string;        // Default accent (CTAs, highlights)
    light: string;       // Light background variant
    dark: string;        // Dark mode variant
    muted: string;       // Subdued accent for secondary elements
  };

  // Semantic colors - status & intent badges
  success: {
    base: string;
    light: string;
    dark: string;
  };

  warning: {
    base: string;
    light: string;
    dark: string;
  };

  error: {
    base: string;
    light: string;
    dark: string;
  };

  info: {
    base: string;
    light: string;
    dark: string;
  };

  // Neutral grays - backgrounds, borders, text
  neutral: {
    white: string;       // Pure white backgrounds
    lightest: string;    // #f9fafb / #fafafa
    light: string;       // #f3f4f6 / #f1f5f9
    medium: string;      // #e5e7eb / #cbd5e1
    dark: string;        // #4b5563 / #64748b
    darker: string;      // #1f2937 / #1e293b
    darkest: string;     // #111827 / #0f172a
    black: string;       // Pure black text/elements
  };

  // Text colors - optimized for readability
  text: {
    primary: string;     // Main body text
    secondary: string;   // Secondary, muted text
    inverse: string;     // Text on dark backgrounds
    muted: string;       // Placeholder, helper text
  };

  // Border colors
  border: {
    light: string;       // Subtle borders
    medium: string;      // Standard borders
    dark: string;        // Strong borders/dividers
  };
}

export interface ColorVariant {
  id: string;                    // Unique variant identifier (kebab-case)
  name: string;                  // Human-readable variant name
  description: string;           // What this variant conveys
  use_cases: string[];          // Ideal industries/business types
  light_mode: ColorTokens;      // Light mode token values
  dark_mode: ColorTokens;       // Dark mode token values (overrides)
  wcag_ratio: number;           // WCAG contrast ratio (primary on white/dark)
  badge_config: BadgeConfig;    // Badge color mappings for this variant
}

export interface BadgeConfig {
  success: string;
  warning: string;
  error: string;
  info: string;
  default: string;              // For neutral/unspecified badges
}

/**
 * CSS Variable Generation
 * Produces CSS custom properties from token definitions.
 * Usage in .astro or .css files:
 *
 *   @import url('./token-variables.css');
 *
 *   .button {
 *     background-color: var(--color-primary-base);
 *     color: var(--color-text-primary);
 *     border-color: var(--color-border-medium);
 *   }
 */
export function generateCSSVariables(tokens: ColorTokens, isDark = false): string {
  const prefix = isDark ? '--color-dark' : '--color-light';

  return `
    /* Primary Colors */
    ${prefix}-primary-base: ${tokens.primary.base};
    ${prefix}-primary-light: ${tokens.primary.light};
    ${prefix}-primary-dark: ${tokens.primary.dark};
    ${prefix}-primary-surface: ${tokens.primary.surface};

    /* Accent Colors */
    ${prefix}-accent-base: ${tokens.accent.base};
    ${prefix}-accent-light: ${tokens.accent.light};
    ${prefix}-accent-dark: ${tokens.accent.dark};
    ${prefix}-accent-muted: ${tokens.accent.muted};

    /* Semantic Colors */
    ${prefix}-success-base: ${tokens.success.base};
    ${prefix}-success-light: ${tokens.success.light};
    ${prefix}-success-dark: ${tokens.success.dark};

    ${prefix}-warning-base: ${tokens.warning.base};
    ${prefix}-warning-light: ${tokens.warning.light};
    ${prefix}-warning-dark: ${tokens.warning.dark};

    ${prefix}-error-base: ${tokens.error.base};
    ${prefix}-error-light: ${tokens.error.light};
    ${prefix}-error-dark: ${tokens.error.dark};

    ${prefix}-info-base: ${tokens.info.base};
    ${prefix}-info-light: ${tokens.info.light};
    ${prefix}-info-dark: ${tokens.info.dark};

    /* Neutral Colors */
    ${prefix}-neutral-white: ${tokens.neutral.white};
    ${prefix}-neutral-lightest: ${tokens.neutral.lightest};
    ${prefix}-neutral-light: ${tokens.neutral.light};
    ${prefix}-neutral-medium: ${tokens.neutral.medium};
    ${prefix}-neutral-dark: ${tokens.neutral.dark};
    ${prefix}-neutral-darker: ${tokens.neutral.darker};
    ${prefix}-neutral-darkest: ${tokens.neutral.darkest};
    ${prefix}-neutral-black: ${tokens.neutral.black};

    /* Text Colors */
    ${prefix}-text-primary: ${tokens.text.primary};
    ${prefix}-text-secondary: ${tokens.text.secondary};
    ${prefix}-text-inverse: ${tokens.text.inverse};
    ${prefix}-text-muted: ${tokens.text.muted};

    /* Border Colors */
    ${prefix}-border-light: ${tokens.border.light};
    ${prefix}-border-medium: ${tokens.border.medium};
    ${prefix}-border-dark: ${tokens.border.dark};
  `.trim();
}

/**
 * Token Reference Guide
 * Components should reference tokens by their semantic name:
 *
 *   Primary Action Button:
 *     - Background: var(--color-primary-base)
 *     - Text: var(--color-text-inverse)
 *     - Border: var(--color-primary-dark)
 *
 *   Secondary Action Button:
 *     - Background: var(--color-accent-base)
 *     - Text: var(--color-text-primary)
 *     - Hover: var(--color-accent-dark)
 *
 *   Form Input:
 *     - Border: var(--color-border-light)
 *     - Focus Border: var(--color-primary-base)
 *     - Text: var(--color-text-primary)
 *
 *   Success Badge:
 *     - Background: var(--color-success-light)
 *     - Text: var(--color-success-dark)
 *     - Border: var(--color-success-base)
 *
 *   Card/Container:
 *     - Background: var(--color-neutral-white)
 *     - Border: var(--color-border-light)
 *     - Text: var(--color-text-primary)
 *
 *   Dark Mode Overrides:
 *     - Background: var(--color-neutral-darkest)
 *     - Text: var(--color-text-inverse)
 *     - Borders: var(--color-border-dark)
 */
