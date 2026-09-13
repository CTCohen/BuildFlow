---
title: Usage Guide
purpose: Documentation for USAGE-GUIDE.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

# Color Token System - Usage Guide

## Overview

The BuildFlow color token system provides 5 pre-configured color variants optimized for different service business positioning strategies. Each variant includes complete token definitions for light and dark modes, semantic colors, and badge configurations.

**Key files:**
- `color-token-structure.ts` - Core token interface and CSS generation
- `emergency-red-orange.ts` - Urgency-focused variant
- `premium-deep-refined.ts` - Luxury/sophistication variant
- `trust-blue-accent.ts` - Trust/professionalism variant
- `visual-vibrant-green.ts` - Visual trades/expertise variant
- `standard-professional-blue.ts` - Mainstream/accessible variant
- `index.ts` - Variant registry and utilities

---

## Variant Overview

| Variant | Primary | Accent | Best For | Psychology |
|---------|---------|--------|----------|------------|
| **Emergency Red + Orange** | #dc2626 | #ea580c | 24/7 services, urgent positioning | Urgency, speed, response |
| **Premium Deep + Refined** | #1e3a8a | #b8860b | Luxury services, high-end | Sophistication, expertise, trust |
| **Trust Blue + Warm** | #0369a1 | #f59e0b | Established trades, value | Professionalism, warmth, balance |
| **Visual Vibrant Green + Gold** | #059669 | #ca8a04 | Landscaping, visual trades | Nature, quality, craftsmanship |
| **Standard Professional Blue + Warm** | #2563eb | #ea580c | Mainstream appeal, broad market | Competence, accessibility, trust |

---

## Token Structure

Each variant includes these token categories:

### Primary Color
- `base` - Main brand color for buttons, headers
- `light` - Light background variant (light mode)
- `dark` - Dark mode variant for text/strokes
- `surface` - Subtle background use

### Accent Color
- `base` - Secondary actions, highlights
- `light` - Light background
- `dark` - Dark mode variant
- `muted` - Subdued version for secondary elements

### Semantic Colors
- `success`, `warning`, `error`, `info`
- Each has `base`, `light`, `dark` variants

### Neutral Grays
- `white` through `black` spectrum
- Used for backgrounds, borders, neutral elements

### Text Colors
- `primary` - Main body text
- `secondary` - Muted text
- `inverse` - Text on dark backgrounds
- `muted` - Placeholder, helpers

### Border Colors
- `light`, `medium`, `dark` - Different emphasis levels

### Badge Config
- `success`, `warning`, `error`, `info`, `default` - Status badge colors

---

## Usage in Astro Components

### Method 1: Component Props with Variant

```astro
---
import { getVariant } from '../tokens';

interface Props {
  variantId?: string;
  isDark?: boolean;
}

const { variantId = 'standard-professional-blue', isDark = false } = Astro.props;
const variant = getVariant(variantId);
const tokens = isDark ? variant?.dark_mode : variant?.light_mode;
---

<style define:vars={{
  primaryBase: tokens?.primary.base,
  accentBase: tokens?.accent.base,
  textPrimary: tokens?.text.primary,
  textInverse: tokens?.text.inverse,
  borderLight: tokens?.border.light,
}}>
  .button {
    background-color: var(--primaryBase);
    color: var(--textInverse);
    border: 1px solid var(--borderLight);
  }

  .button:hover {
    opacity: 0.9;
  }

  .secondary-button {
    background-color: transparent;
    color: var(--accentBase);
    border: 2px solid var(--accentBase);
  }
</style>

<button class="button">Primary Action</button>
<button class="secondary-button">Secondary</button>
```

### Method 2: Direct Import

```astro
---
import { standardProfessionalBlue } from '../tokens';

const tokens = standardProfessionalBlue.light_mode;
---

<style define:vars={{
  primary: tokens.primary.base,
  accent: tokens.accent.base,
}}>
  .header {
    background-color: var(--primary);
    color: var(--textInverse);
  }
</style>
```

### Method 3: CSS Variables with Fallback

```astro
---
// In a layout or root component
import { getVariant } from '../tokens';

const variant = getVariant('standard-professional-blue');
const lightTokens = variant?.light_mode;
const darkTokens = variant?.dark_mode;
---

<style define:vars={{
  ...Object.entries(lightTokens || {}).reduce((acc, [key, val]) => {
    if (typeof val === 'object' && val !== null) {
      Object.entries(val).forEach(([k, v]) => {
        acc[`color${key.charAt(0).toUpperCase() + key.slice(1)}${k.charAt(0).toUpperCase() + k.slice(1)}`] = v;
      });
    }
    return acc;
  }, {}),
}}>
  :root {
    --color-primary-base: var(--colorPrimaryBase);
    --color-accent-base: var(--colorAccentBase);
    --color-text-primary: var(--colorTextPrimary);
  }
</style>
```

---

## Global Styling Strategy

### 1. Create a Base Layout Component

```astro
---
// src/layouts/ClientLayout.astro
import { getVariant } from '../tokens';

interface Props {
  variantId?: string;
  title?: string;
}

const { variantId = 'standard-professional-blue', title } = Astro.props;
const variant = getVariant(variantId);
const light = variant?.light_mode;
const dark = variant?.dark_mode;
---

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>{title}</title>
    <style define:vars={{
      // Light mode tokens
      lightPrimaryBase: light?.primary.base,
      lightAccentBase: light?.accent.base,
      lightTextPrimary: light?.text.primary,
      
      // Dark mode tokens
      darkPrimaryBase: dark?.primary.base,
      darkAccentBase: dark?.accent.base,
      darkTextPrimary: dark?.text.primary,
    }}>
      :root {
        --primary: var(--lightPrimaryBase);
        --accent: var(--lightAccentBase);
        --text-primary: var(--lightTextPrimary);
      }

      @media (prefers-color-scheme: dark) {
        :root {
          --primary: var(--darkPrimaryBase);
          --accent: var(--darkAccentBase);
          --text-primary: var(--darkTextPrimary);
        }
      }
    </style>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### 2. Component-Level Application

```astro
---
// src/components/Button.astro
interface Props {
  variant?: 'primary' | 'secondary' | 'accent';
  isDark?: boolean;
}

const { variant = 'primary', isDark = false } = Astro.props;
---

<style>
  .button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .button.primary {
    background-color: var(--primary);
    color: white;
    border: 1px solid var(--primary);
  }

  .button.primary:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .button.secondary {
    background-color: transparent;
    color: var(--primary);
    border: 2px solid var(--primary);
  }

  .button.secondary:hover {
    background-color: rgba(var(--primary-rgb), 0.05);
  }

  .button.accent {
    background-color: var(--accent);
    color: white;
    border: 1px solid var(--accent);
  }
</style>

<button class={`button ${variant}`}>
  <slot />
</button>
```

---

## Badge Configuration

Each variant has a badge configuration for status indicators:

```astro
---
import { getVariant } from '../tokens';

interface Props {
  status: 'success' | 'warning' | 'error' | 'info' | 'default';
  variantId?: string;
}

const { status, variantId = 'standard-professional-blue' } = Astro.props;
const variant = getVariant(variantId);
const badgeColor = variant?.badge_config[status];
---

<style define:vars={{ badgeColor }}>
  .badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: var(--badgeColor);
    color: white;
  }
</style>

<span class="badge">
  <slot />
</span>
```

---

## Common Component Patterns

### CTA Button (Emergency Red + Orange)

```astro
---
import { emergencyRedOrange } from '../tokens';

const tokens = emergencyRedOrange.light_mode;
---

<style define:vars={{
  primary: tokens.primary.base,
  accent: tokens.accent.base,
}}>
  .cta-button {
    background: linear-gradient(135deg, var(--primary), var(--accent));
    color: white;
    padding: 1rem 2rem;
    font-size: 1.125rem;
    font-weight: bold;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  }

  .cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
  }
</style>

<button class="cta-button">
  <slot />
</button>
```

### Service Card (Premium Deep + Refined)

```astro
---
import { premiumDeepRefined } from '../tokens';

const tokens = premiumDeepRefined.light_mode;
---

<style define:vars={{
  primary: tokens.primary.base,
  accent: tokens.accent.base,
  border: tokens.border.light,
  background: tokens.neutral.white,
}}>
  .service-card {
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .service-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: var(--accent);
  }

  .service-card h3 {
    color: var(--primary);
    margin-top: 1rem;
  }
</style>

<div class="service-card">
  <h3><slot name="title" /></h3>
  <p><slot /></p>
</div>
```

### Form Input (Trust Blue + Accent)

```astro
---
import { trustBlueAccent } from '../tokens';

const tokens = trustBlueAccent.light_mode;
---

<style define:vars={{
  primary: tokens.primary.base,
  borderLight: tokens.border.light,
  borderMedium: tokens.border.medium,
  textMuted: tokens.text.muted,
}}>
  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--borderLight);
    border-radius: 0.375rem;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.1);
  }

  .form-input::placeholder {
    color: var(--textMuted);
  }
</style>

<input type="text" class="form-input" placeholder="Enter text..." />
```

---

## Dark Mode Implementation

The token system includes built-in dark mode support:

```astro
---
import { getVariant } from '../tokens';

const variant = getVariant('standard-professional-blue');
const isDarkMode = true; // Detect from system or user preference
const tokens = isDarkMode ? variant?.dark_mode : variant?.light_mode;
---

<style define:vars={{
  primary: tokens?.primary.base,
  textPrimary: tokens?.text.primary,
  textInverse: tokens?.text.inverse,
}}>
  :root {
    --primary: var(--primary);
    --text: var(--textPrimary);
  }

  body {
    background-color: var(--text-inverse);
    color: var(--text);
  }
</style>
```

Or use CSS Media Query:

```css
:root {
  --primary: #2563eb;
  --text: #1f2937;
}

@media (prefers-color-scheme: dark) {
  :root {
    --primary: #3b82f6;
    --text: #f3f4f6;
  }
}
```

---

## Token Reference Matrix

For quick component styling reference:

| Component | Primary Token | Accent Token | Border Token | Text Token |
|-----------|---------------|--------------|--------------|-----------|
| CTA Button | `primary.base` | - | `primary.dark` | `text.inverse` |
| Secondary Button | `neutral.light` | `accent.base` | `accent.base` | `accent.dark` |
| Card | - | - | `border.light` | `text.primary` |
| Form Input | - | - | `border.light` (focus: `primary.base`) | `text.primary` |
| Badge | varies | - | varies | `text.inverse` |
| Header | `primary.base` | - | - | `text.inverse` |
| Divider | - | - | `border.medium` | - |
| Link | `primary.base` | - | - | `primary.base` |

---

## Migration from Existing Colors

If migrating from hardcoded colors:

**Before:**
```astro
<style>
  .button {
    background-color: #2563eb;
    color: white;
  }
</style>
```

**After:**
```astro
---
import { getVariant } from '../tokens';
const variant = getVariant('standard-professional-blue');
const tokens = variant?.light_mode;
---

<style define:vars={{
  primary: tokens?.primary.base,
}}>
  .button {
    background-color: var(--primary);
    color: white;
  }
</style>
```

---

## Testing Color Contrast

All variants include WCAG contrast ratios. Verify accessibility:

- **AA compliance** (minimum): 4.5:1 for text
- **AAA compliance** (enhanced): 7:1 for text

Each variant lists its `wcag_ratio` for primary color on background.

---

## Adding New Variants

To add a new variant:

1. Create a new file: `src/tokens/your-variant.ts`
2. Implement the `ColorVariant` interface
3. Include light and dark mode tokens
4. Add to `index.ts` registry
5. Document use cases in variant description

```typescript
export const yourVariant: ColorVariant = {
  id: 'your-variant-id',
  name: 'Your Variant Name',
  description: '...',
  use_cases: ['...'],
  wcag_ratio: 7.4,
  light_mode: { /* tokens */ },
  dark_mode: { /* tokens */ },
  badge_config: { /* config */ },
};
```

---

## Questions?

Refer to specific variant files for component usage examples or check `color-token-structure.ts` for token interface details.
