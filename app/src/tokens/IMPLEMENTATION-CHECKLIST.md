# Implementation Checklist & Troubleshooting

## Pre-Implementation Checklist

- [ ] Review [README.md](./README.md) for overview
- [ ] Review [VARIANT-SPECIFICATIONS.md](./VARIANT-SPECIFICATIONS.md) to choose variant
- [ ] Review [COLOR-REFERENCE.md](./COLOR-REFERENCE.md) for hex values
- [ ] Review [USAGE-GUIDE.md](./USAGE-GUIDE.md) for patterns
- [ ] Decide on: light mode, dark mode, or both
- [ ] Identify primary layout component
- [ ] Audit existing color usage in codebase

## Step-by-Step Implementation

### Phase 1: Setup (30 minutes)

**Goal:** Get basic variant imported and working

1. **Create layout wrapper component**
   ```astro
   // src/layouts/ClientLayout.astro
   ---
   import { getVariant } from '../tokens';
   ---
   ```

2. **Import variant in layout**
   ```typescript
   const variant = getVariant('standard-professional-blue');
   const lightTokens = variant?.light_mode;
   ```

3. **Create CSS variables**
   ```html
   <style define:vars={{
     primary: lightTokens?.primary.base,
     accent: lightTokens?.accent.base,
   }}>
   ```

4. **Test in browser**
   - [ ] Colors are applied
   - [ ] No console errors
   - [ ] CSS variables are defined

### Phase 2: Component Migration (2-4 hours)

**Goal:** Update existing components to use tokens

1. **Identify high-impact components**
   - Button (used everywhere)
   - Card (layout component)
   - Form inputs
   - Links/CTAs
   - Badges/status indicators

2. **Update button component**
   ```astro
   ---
   import { getVariant } from '../tokens';
   const variant = getVariant(variantId);
   const tokens = variant?.light_mode;
   ---
   ```

3. **Update styles to use token variables**
   ```css
   .button {
     background-color: var(--primary-base);
     color: var(--text-inverse);
     border-color: var(--primary-dark);
   }
   ```

4. **Test each component**
   - [ ] Light mode rendering
   - [ ] Dark mode (if implemented)
   - [ ] Hover/focus states
   - [ ] WCAG contrast (dev tools)

### Phase 3: Dark Mode Support (1-2 hours)

**Goal:** Add automatic dark mode detection

1. **Add dark tokens to layout**
   ```typescript
   const darkTokens = variant?.dark_mode;
   ```

2. **Create media query styles**
   ```css
   @media (prefers-color-scheme: dark) {
     :root {
       --primary: var(--primaryDark);
       --text: var(--textDark);
     }
   }
   ```

3. **Test dark mode**
   - [ ] System preference respected
   - [ ] All colors update
   - [ ] Contrast still valid
   - [ ] No hard-coded colors visible

### Phase 4: Comprehensive Testing (2-3 hours)

**Goal:** Verify complete implementation

#### Visual Testing
- [ ] All pages render correctly
- [ ] Colors consistent across site
- [ ] Buttons respond to hover/focus
- [ ] Forms display correctly
- [ ] Cards layout properly
- [ ] Badges show correct colors

#### Accessibility Testing
- [ ] Run WCAG scanner (axe DevTools, Lighthouse)
- [ ] Check color contrast in light mode
- [ ] Check color contrast in dark mode
- [ ] Test form focus indicators
- [ ] Verify semantic HTML structure
- [ ] Check link/button distinguishability

#### Browser Testing
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

#### Responsive Testing
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)
- [ ] UltraWide (1920px+)

### Phase 5: Documentation (30 minutes)

**Goal:** Document variant choice for team

1. **Update project README**
   - Which variant is used
   - Why it was chosen
   - How to add new colors

2. **Create component guide**
   - Common color applications
   - Token reference
   - Examples

3. **Add TypeScript comments**
   ```typescript
   // Using standard-professional-blue variant
   // Import from '../tokens' and use getVariant()
   ```

## Common Integration Patterns

### Pattern 1: Layout-Level Application

```astro
---
// src/layouts/Base.astro
import { getVariant } from '../tokens';

const variantId = 'standard-professional-blue';
const variant = getVariant(variantId);
const light = variant?.light_mode;
const dark = variant?.dark_mode;
---

<!DOCTYPE html>
<html>
<head>
  <style define:vars={{
    lightPrimary: light?.primary.base,
    darkPrimary: dark?.primary.base,
  }}>
    :root {
      --primary: var(--lightPrimary);
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --primary: var(--darkPrimary);
      }
    }
  </style>
</head>
<body>
  <slot />
</body>
</html>
```

### Pattern 2: Component-Level Application

```astro
---
// src/components/Button.astro
import { getVariant } from '../tokens';

interface Props {
  variant?: string;
}

const { variant: variantId = 'standard-professional-blue' } = Astro.props;
const colorVariant = getVariant(variantId);
const tokens = colorVariant?.light_mode;
---

<style define:vars={{
  primary: tokens?.primary.base,
  primaryDark: tokens?.primary.dark,
  textInverse: tokens?.text.inverse,
}}>
  button {
    background: var(--primary);
    color: var(--textInverse);
  }
  
  button:hover {
    opacity: 0.9;
  }
</style>

<button><slot /></button>
```

### Pattern 3: Conditional Variant Selection

```astro
---
// Based on page type or client
const pageType = Astro.url.pathname.includes('/emergency') 
  ? 'emergency-red-orange' 
  : 'standard-professional-blue';

const variant = getVariant(pageType);
---
```

## Troubleshooting Guide

### Issue 1: Colors Not Applying

**Symptoms:** CSS variables undefined, colors appear as default

**Solutions:**
1. Verify import statement
   ```typescript
   import { getVariant } from '../tokens';
   ```

2. Check variant ID is correct
   ```typescript
   console.log(getVariantIds()); // List all valid IDs
   ```

3. Confirm `define:vars` syntax
   ```astro
   <style define:vars={{ primary: tokens?.primary.base }}>
   ```

4. Verify CSS variable name matches
   ```css
   background: var(--primary); /* Matches define:vars={{ primary }} */
   ```

### Issue 2: Dark Mode Not Working

**Symptoms:** Dark colors don't update on system preference change

**Solutions:**
1. Add `@media (prefers-color-scheme: dark)` block
   ```css
   @media (prefers-color-scheme: dark) {
     :root {
       --primary: var(--darkPrimary);
     }
   }
   ```

2. Ensure dark tokens are imported
   ```typescript
   const dark = variant?.dark_mode;
   ```

3. Verify browser dark mode is enabled
   - [ ] System preference set to dark
   - [ ] Browser not overriding preference

4. Check for hard-coded colors in components
   ```css
   /* ❌ Won't respond to theme */
   background: #2563eb;
   
   /* ✅ Will respond to theme */
   background: var(--primary);
   ```

### Issue 3: WCAG Contrast Failures

**Symptoms:** Accessibility audit reports contrast ratio < 4.5:1

**Solutions:**
1. Verify you're using the correct variant tokens
   ```typescript
   // ✅ Correct - primary text on background
   color: var(--text-primary);
   background: var(--primary-base);
   
   // ❌ Wrong - may not have adequate contrast
   color: #custom-color;
   ```

2. Use semantic color tokens
   ```css
   /* For text on primary background */
   color: var(--text-inverse);
   
   /* For normal text */
   color: var(--text-primary);
   ```

3. Test both light and dark mode
   - [ ] Light mode contrast valid
   - [ ] Dark mode contrast valid

4. Use border instead of color-alone differentiation
   ```css
   border: 2px solid var(--primary-base);
   background: transparent;
   ```

### Issue 4: Colors Look Wrong

**Symptoms:** Colors don't match expected values

**Solutions:**
1. Verify variant choice matches use case
   - [ ] Is this the right variant for this page?
   - [ ] Compare to [VARIANT-SPECIFICATIONS.md](./VARIANT-SPECIFICATIONS.md)

2. Check hex values in [COLOR-REFERENCE.md](./COLOR-REFERENCE.md)
   ```typescript
   // Verify expected color
   const tokens = variant?.light_mode;
   console.log(tokens?.primary.base); // Should show #2563eb or similar
   ```

3. Look for CSS override
   ```css
   /* Check for !important or more specific selectors */
   .component { background: blue !important; } /* This overrides tokens */
   ```

4. Clear browser cache
   ```bash
   # Hard refresh in browser
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

### Issue 5: Inconsistent Colors Across Pages

**Symptoms:** Different pages have different colors

**Solutions:**
1. Verify same variant used everywhere
   ```typescript
   // All pages should use
   const variant = getVariant('standard-professional-blue');
   // Not different variants on different pages
   ```

2. Check for page-specific overrides
   ```css
   /* Look for page or component-level color definitions */
   .page-specific { color: #custom; }
   ```

3. Ensure variants are imported from same location
   ```typescript
   // ✅ Correct - single source
   import { getVariant } from '../tokens';
   
   // ❌ Wrong - different imports
   import { standardProfessionalBlue } from './standard-professional-blue';
   import { emergencyRedOrange } from './emergency-red-orange';
   ```

## Performance Checklist

- [ ] Token files load once at startup
- [ ] No repeated variant lookups in loops
- [ ] CSS variables used (not repeated hex values)
- [ ] Dark mode uses single media query
- [ ] No runtime color calculations
- [ ] Bundle size < 50KB for all token files

```bash
# Check bundle impact
ls -lh app/src/tokens/*.ts
# Should see files ~5-6KB each
```

## Deployment Checklist

Before deploying to production:

- [ ] All variants imported correctly
- [ ] Light mode tested on desktop
- [ ] Light mode tested on mobile
- [ ] Dark mode tested (if implemented)
- [ ] WCAG AAA compliance verified
- [ ] No console errors
- [ ] No broken colors
- [ ] All interactive elements tested
- [ ] Forms submit correctly
- [ ] Links are distinguishable
- [ ] Badges show correct status colors
- [ ] Responsive layout works
- [ ] Image colors complement variant
- [ ] Brand colors accurate

## Rollback Instructions

If variant doesn't work:

1. **Identify issue variant**
   ```typescript
   // Current (broken)
   const variant = getVariant('emergency-red-orange');
   
   // Fallback
   const variant = getVariant('standard-professional-blue');
   ```

2. **Test fallback variant**
   - [ ] Colors render
   - [ ] Contrast valid
   - [ ] Layout intact

3. **Deploy fallback**
   ```bash
   git revert <commit-hash>
   npm run build && npm run deploy
   ```

4. **Debug original variant**
   - [ ] Check WCAG contrast
   - [ ] Verify CSS variables
   - [ ] Test in multiple browsers

## Common Mistakes to Avoid

### ❌ Mistake 1: Hardcoding Colors
```typescript
// Wrong
background: '#2563eb'; // Breaks theme switching

// Right
import { getVariant } from '../tokens';
background: getVariant('standard-professional-blue')?.light_mode?.primary.base;
```

### ❌ Mistake 2: Not Testing Dark Mode
```typescript
// Only testing light mode
const tokens = variant?.light_mode;

// Should test both
const lightTokens = variant?.light_mode;
const darkTokens = variant?.dark_mode;
```

### ❌ Mistake 3: Ignoring Contrast
```typescript
// May have low contrast
color: tokens?.accent?.muted;
background: tokens?.primary?.light;

// Better contrast
color: tokens?.primary?.base;
background: tokens?.neutral?.white;
```

### ❌ Mistake 4: Using Variant-Specific Colors
```typescript
// Breaks if variant changes
if (variant.id === 'emergency-red-orange') {
  color: '#dc2626';
}

// Use token instead
color: variant?.light_mode?.primary.base;
```

### ❌ Mistake 5: Not Updating Component Props
```astro
---
// Component doesn't accept variant
<Button />

// Should support variant
<Button variantId="premium-deep-refined" />
---
```

## Success Indicators

You've successfully implemented tokens when:

✅ All pages use same variant consistently
✅ Light and dark modes both work
✅ WCAG AAA compliance on all components
✅ No console errors or warnings
✅ Colors match variant specification
✅ Variant can be changed without code rewrites
✅ New components automatically use tokens
✅ No hardcoded hex values in component styles
✅ All interactive elements are accessible
✅ Mobile and desktop look consistent

---

**Last Updated:** 2026-09-07
**Version:** 1.0

For questions or issues, refer to specific documentation files or review the implementation examples in [USAGE-GUIDE.md](./USAGE-GUIDE.md).
