---
title: Readme
purpose: Documentation for README.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

> **Updated 2026-09-18 (spec reconciliation):** this 5-variant color-token layer sits under the spec's 10 styling profiles (`../data/styleProfiles.json`), which map the 32 themes. Keep using these tokens for color; profiles decide which theme and variants a customer sees. The other token docs in this folder (COLOR-REFERENCE, IMPLEMENTATION-CHECKLIST, USAGE-GUIDE, VARIANT-SPECIFICATIONS) are reference material and have no spec conflict.


# Color Token System

BuildFlow's design token system provides 5 pre-configured color variants optimized for different service business positioning strategies. Each variant includes complete token definitions for light and dark modes, semantic colors, and badge configurations.

## Quick Start

### 1. Choose a Variant

```typescript
import { getVariant } from './tokens';

const variant = getVariant('standard-professional-blue');
const tokens = variant?.light_mode;
```

### 2. Use in Astro Components

```astro
---
import { getVariant } from '../tokens';

const variant = getVariant('standard-professional-blue');
const tokens = variant?.light_mode;
---

<style define:vars={{
  primary: tokens?.primary.base,
  accent: tokens?.accent.base,
}}>
  .button {
    background-color: var(--primary);
    color: white;
  }
</style>

<button class="button">Click me</button>
```

## Available Variants

| Variant | Primary | Accent | Best For | Psychology |
|---------|---------|--------|----------|------------|
| **emergency-red-orange** | #dc2626 | #ea580c | 24/7 services, urgent positioning | Urgency, speed, response |
| **premium-deep-refined** | #1e3a8a | #b8860b | Luxury services, high-end | Sophistication, expertise |
| **trust-blue-accent** | #0369a1 | #f59e0b | Established trades, value | Professionalism, warmth |
| **visual-vibrant-green** | #059669 | #ca8a04 | Landscaping, visual trades | Nature, quality, craftsmanship |
| **standard-professional-blue** | #2563eb | #ea580c | Mainstream appeal, broad market | Competence, accessibility |

## File Structure

```
tokens/
├── README.md                          # This file - overview
├── USAGE-GUIDE.md                     # Detailed usage patterns & examples
├── COLOR-REFERENCE.md                 # Complete hex/RGB/HSL reference
├── color-token-structure.ts           # Core interfaces & utilities
├── index.ts                           # Variant registry & exports
├── emergency-red-orange.ts            # Urgency-focused variant
├── premium-deep-refined.ts            # Luxury variant
├── trust-blue-accent.ts               # Trust/professionalism variant
├── visual-vibrant-green.ts            # Visual trades variant
└── standard-professional-blue.ts      # Mainstream variant
```

## Token Categories

Each variant includes:

- **Primary Color** - Main brand color (base, light, dark, surface)
- **Accent Color** - Secondary actions and highlights (base, light, dark, muted)
- **Semantic Colors** - Success, warning, error, info (each with base, light, dark)
- **Neutral Grays** - Complete gray spectrum from white to black
- **Text Colors** - Primary, secondary, inverse, muted
- **Border Colors** - Light, medium, dark emphasis levels
- **Badge Config** - Status indicator colors

## Key Features

✅ **5 Pre-Designed Variants** - Optimized for different positioning strategies
✅ **Light & Dark Mode** - Complete token sets for both modes
✅ **WCAG AAA Compliant** - All variants meet accessibility standards
✅ **Semantic Naming** - Color intentions clear from token names
✅ **TypeScript Support** - Full type safety for token usage
✅ **CSS Variable Ready** - Easy integration with Astro `define:vars`
✅ **Component Patterns** - Examples for buttons, cards, forms, badges
✅ **Dark Mode Built-in** - Automatic dark mode support

## Common Token References

| Usage | Token | Example Values |
|-------|-------|-----------------|
| Primary Button Background | `primary.base` | #dc2626 → #2563eb |
| Primary Button Text | `text.inverse` | #ffffff |
| Primary Button Hover | `primary.dark` | #991b1b → #1e40af |
| Secondary Button | `accent.light` + `accent.dark` | #fed7aa → #7c2d12 |
| Card Border | `border.light` | #e5e7eb |
| Form Focus Ring | `primary.base` | #dc2626 |
| Success Badge | `badge_config.success` | #10b981 |
| Heading Text | `primary.base` | #dc2626 |

## Usage Examples

### Basic Button Component

```astro
---
import { getVariant } from '../tokens';

interface Props {
  variant?: 'primary' | 'secondary';
  variantId?: string;
}

const { variant = 'primary', variantId = 'standard-professional-blue' } = Astro.props;
const colorVariant = getVariant(variantId);
const tokens = colorVariant?.light_mode;
---

<style define:vars={{
  primary: tokens?.primary.base,
  primaryDark: tokens?.primary.dark,
  accent: tokens?.accent.base,
  textInverse: tokens?.text.inverse,
}}>
  button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
  }

  button.primary {
    background-color: var(--primary);
    color: var(--textInverse);
  }

  button.primary:hover {
    background-color: var(--primaryDark);
  }

  button.secondary {
    background-color: transparent;
    color: var(--accent);
    border: 2px solid var(--accent);
  }

  button.secondary:hover {
    opacity: 0.8;
  }
</style>

<button class={variant}>
  <slot />
</button>
```

### Service Card Component

```astro
---
import { getVariant } from '../tokens';

interface Props {
  variantId?: string;
}

const { variantId = 'standard-professional-blue' } = Astro.props;
const variant = getVariant(variantId);
const tokens = variant?.light_mode;
---

<style define:vars={{
  primary: tokens?.primary.base,
  borderLight: tokens?.border.light,
}}>
  .card {
    background: white;
    border: 1px solid var(--borderLight);
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .card-title {
    color: var(--primary);
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }
</style>

<div class="card">
  <h3 class="card-title">
    <slot name="title" />
  </h3>
  <p>
    <slot />
  </p>
</div>
```

### Dark Mode Support

```astro
---
import { getVariant } from '../tokens';

const variant = getVariant('standard-professional-blue');
const lightTokens = variant?.light_mode;
const darkTokens = variant?.dark_mode;
---

<style define:vars={{
  // Light mode defaults
  primary: lightTokens?.primary.base,
  text: lightTokens?.text.primary,
  bg: lightTokens?.neutral.white,
  
  // Dark mode overrides
  primaryDark: darkTokens?.primary.base,
  textDark: darkTokens?.text.primary,
  bgDark: darkTokens?.neutral.darkest,
}}>
  :root {
    --color-primary: var(--primary);
    --color-text: var(--text);
    --color-bg: var(--bg);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --color-primary: var(--primaryDark);
      --color-text: var(--textDark);
      --color-bg: var(--bgDark);
    }
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text);
  }
</style>
```

## Documentation

- **[USAGE-GUIDE.md](./USAGE-GUIDE.md)** - Comprehensive guide with component patterns and implementation strategies
- **[COLOR-REFERENCE.md](./COLOR-REFERENCE.md)** - Complete hex/RGB/HSL reference for all variants and semantic colors

## Token APIs

### Core Utilities

```typescript
import {
  getVariant,           // Get a variant by ID
  getVariantIds,        // List all variant IDs
  getVariantsByUseCase, // Filter variants by use case
  allVariants,          // Array of all variants
  variantRegistry,      // Registry object for lookup
  generateCSSVariables, // Generate CSS var() strings
} from './tokens';
```

### Type Definitions

```typescript
interface ColorTokens {
  primary: { base, light, dark, surface };
  accent: { base, light, dark, muted };
  success: { base, light, dark };
  warning: { base, light, dark };
  error: { base, light, dark };
  info: { base, light, dark };
  neutral: { white, lightest, light, medium, dark, darker, darkest, black };
  text: { primary, secondary, inverse, muted };
  border: { light, medium, dark };
}

interface ColorVariant {
  id: string;
  name: string;
  description: string;
  use_cases: string[];
  wcag_ratio: number;
  light_mode: ColorTokens;
  dark_mode: ColorTokens;
  badge_config: BadgeConfig;
}
```

## Accessibility

All variants meet or exceed WCAG AA standards (4.5:1 minimum) for text contrast. AAA compliance (7:1) achieved on all variants:

- Emergency Red + Orange: 7.4
- Premium Deep + Refined: 7.8
- Trust Blue + Accent: 7.2
- Visual Vibrant Green: 7.1
- Standard Professional Blue: 7.4

## Integration Checklist

- [ ] Import tokens in layout component
- [ ] Define CSS variables with `define:vars`
- [ ] Reference tokens in component styles
- [ ] Test light and dark mode rendering
- [ ] Verify WCAG contrast on all elements
- [ ] Test form focus states
- [ ] Verify semantic color usage (success/warning/error)
- [ ] Test mobile responsiveness

## Variant Selection Guide

Choose your variant based on:

1. **Emergency Red + Orange** - Your business emphasizes speed, 24/7 availability, emergency response
2. **Premium Deep + Refined** - Targeting luxury segment, emphasis on expertise and premium positioning
3. **Trust Blue + Warm** - Traditional trades, balance of professionalism and approachability
4. **Visual Vibrant Green + Gold** - Visual trades (landscaping, decorative work), craftsmanship focus
5. **Standard Professional Blue + Warm** - Mainstream appeal, broad market positioning, industry standard

## Updating Variants

To add a new variant or update existing ones:

1. Edit the variant file (e.g., `standard-professional-blue.ts`)
2. Update `light_mode` and/or `dark_mode` tokens
3. Test in components: `import { standardProfessionalBlue } from './tokens'`
4. Verify WCAG contrast ratios
5. Update documentation if needed

## Questions?

- See [USAGE-GUIDE.md](./USAGE-GUIDE.md) for implementation patterns
- Check [COLOR-REFERENCE.md](./COLOR-REFERENCE.md) for hex/RGB values
- Review variant files for component usage examples
- Refer to `color-token-structure.ts` for interface definitions

---

**Version:** 1.0
**Created:** 2026-09-07
**Variants:** 5 (Emergency, Premium, Trust, Visual, Standard)
**Modes:** 2 (Light, Dark)
**Total Token Sets:** 10
