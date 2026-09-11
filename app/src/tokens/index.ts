/**
 * Color Token Index
 * Central export point for all color variants and token definitions.
 *
 * Usage in Astro components:
 *   ---
 *   import { getVariant, allVariants } from '../tokens';
 *
 *   // Get a specific variant
 *   const variant = getVariant('emergency-red-orange');
 *
 *   // Or iterate all variants
 *   export const allOptions = allVariants;
 *   ---
 */

import type { ColorVariant } from './color-token-structure';
import { emergencyRedOrange } from './emergency-red-orange';
import { premiumDeepRefined } from './premium-deep-refined';
import { trustBlueAccent } from './trust-blue-accent';
import { visualVibrantGreen } from './visual-vibrant-green';
import { standardProfessionalBlue } from './standard-professional-blue';

/**
 * All available color variants
 * Each variant has complete light and dark mode token definitions
 */
export const allVariants: ColorVariant[] = [
  emergencyRedOrange,
  premiumDeepRefined,
  trustBlueAccent,
  visualVibrantGreen,
  standardProfessionalBlue,
];

/**
 * Variant registry by ID for quick lookup
 */
export const variantRegistry: Record<string, ColorVariant> = {
  'emergency-red-orange': emergencyRedOrange,
  'premium-deep-refined': premiumDeepRefined,
  'trust-blue-accent': trustBlueAccent,
  'visual-vibrant-green': visualVibrantGreen,
  'standard-professional-blue': standardProfessionalBlue,
};

/**
 * Get a variant by ID
 * @param variantId - The variant identifier (e.g., 'emergency-red-orange')
 * @returns The ColorVariant, or undefined if not found
 */
export function getVariant(variantId: string): ColorVariant | undefined {
  return variantRegistry[variantId];
}

/**
 * Get all variant IDs
 */
export function getVariantIds(): string[] {
  return Object.keys(variantRegistry);
}

/**
 * Get all variants grouped by use case
 */
export function getVariantsByUseCase(useCase: string): ColorVariant[] {
  return allVariants.filter((variant) =>
    variant.use_cases.some((uc) => uc.toLowerCase().includes(useCase.toLowerCase()))
  );
}

/**
 * Component Integration Example
 *
 * For Astro components, import tokens and apply them:
 *
 *   ---
 *   import { getVariant } from '../tokens';
 *
 *   interface Props {
 *     variantId?: string;
 *   }
 *
 *   const { variantId = 'standard-professional-blue' } = Astro.props;
 *   const variant = getVariant(variantId);
 *   const tokens = variant?.light_mode;
 *   ---
 *
 *   <style define:vars={{
 *     primaryBase: tokens?.primary.base,
 *     accentBase: tokens?.accent.base,
 *     textPrimary: tokens?.text.primary,
 *   }}>
 *     .button {
 *       background-color: var(--primaryBase);
 *       color: var(--textPrimary);
 *     }
 *   </style>
 *
 *   <button>Click me</button>
 *
 * CSS Variable Fallback for Global Styling
 *
 * In your global CSS or layout component:
 *
 *   :root {
 *     --color-primary-base: #2563eb;
 *     --color-accent-base: #ea580c;
 *     --color-text-primary: #1f2937;
 *     --color-text-inverse: #ffffff;
 *     --color-border-light: #dbeafe;
 *   }
 *
 *   @media (prefers-color-scheme: dark) {
 *     :root {
 *       --color-primary-base: #3b82f6;
 *       --color-accent-base: #f97316;
 *       --color-text-primary: #f3f4f6;
 *       --color-text-inverse: #111827;
 *       --color-border-light: #1e40af;
 *     }
 *   }
 *
 * Badge Color Reference
 *
 * For status badges:
 *
 *   const badge = {
 *     success: variant.badge_config.success,   // #16a34a
 *     warning: variant.badge_config.warning,   // #f59e0b
 *     error: variant.badge_config.error,       // #dc2626
 *     info: variant.badge_config.info,         // #2563eb
 *     default: variant.badge_config.default,   // #ea580c
 *   };
 */

// Re-export individual variants for convenience
export { emergencyRedOrange } from './emergency-red-orange';
export { premiumDeepRefined } from './premium-deep-refined';
export { trustBlueAccent } from './trust-blue-accent';
export { visualVibrantGreen } from './visual-vibrant-green';
export { standardProfessionalBlue } from './standard-professional-blue';

// Re-export types and utilities
export type { ColorTokens, ColorVariant, BadgeConfig } from './color-token-structure';
export { generateCSSVariables } from './color-token-structure';
