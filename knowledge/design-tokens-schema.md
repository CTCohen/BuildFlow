---
id: design-tokens-schema
type: sop
status: active
links: [mood-boards, web-design, accessibility-baseline]
---

# Design Tokens Schema & Agent Decision Rules

## Overview

Design tokens are the intermediate layer between business data and rendered components. Agents analyze a business's characteristics and output design tokens that drive visual uniqueness without code changes.

**Flow:** Business JSON → Agent Analysis → Design Token JSON → Template Rendering → HTML

---

## Design Token Structure

```typescript
interface DesignTokens {
  // Identity
  themeId: string;           // e.g., "trust-blue-gold", "modern-blue-pink"
  themeName: string;         // Human-readable name
  colors: ColorPalette;      // Primary, accent, dark, light variants

  // Typography (reuse from brand config)
  typography: 'humanist' | 'classic' | 'grotesk-serif';

  // Spacing (reuse from brand config)
  density: 'compact' | 'comfortable' | 'spacious';

  // Component Variants (AI-selected based on business analysis)
  components: {
    heroVariant: 'full-bleed' | 'photo-left' | 'accent-bar' | 'minimal' | 'split';
    servicesLayout: 'grid-3col' | 'grid-2col-feature' | 'card-stack' | 'list-sidebar';
    testimonialStyle: 'grid' | 'carousel' | 'sidebar';
    ctaPosition: 'floating' | 'sticky-footer' | 'embedded';
    footerVariant: 'minimal' | 'full';
  };

  // Content Tone (affects copy generation)
  contentTone: {
    urgency: 'high' | 'normal' | 'low';
    formality: 'professional' | 'approachable' | 'casual';
    emphasis: 'trust' | 'speed' | 'value' | 'innovation';
  };
}
```

---

## Color Palette Requirements

Each theme defines 4 colors:

| Field | Purpose | Rules |
|-------|---------|-------|
| **primary** | All text, headings, links | Must pass WCAG AA on white (≥4.5:1) |
| **accent** | CTAs, highlights, alerts | Must pass WCAG AA on white (≥4.5:1) |
| **primaryDark** | Hover states, borders | Darker shade of primary |
| **primaryLight** | Backgrounds, subtle fills | Lighter shade of primary |

**Validation:**
```javascript
function validateColors(palette) {
  const white = '#ffffff';
  return {
    primaryContrast: getContrastRatio(palette.primary, white),
    accentContrast: getContrastRatio(palette.accent, white),
    isValid: (
      getContrastRatio(palette.primary, white) >= 4.5 &&
      getContrastRatio(palette.accent, white) >= 4.5
    )
  }
}
```

---

## 30 Themes: Organization

All themes are defined in `app/src/data/themes-30.json`. Each includes:

```json
{
  "themeId": "trust-blue-gold",
  "themeName": "Trust + Speed",
  "maturity": "established",
  "positioning": "value",
  "trades": ["hvac", "plumbing"],
  "colors": { "primary": "#0369a1", "accent": "#f59e0b", ... },
  "wcagRatio": 7.2,
  "rationale": "Professional blue with warm amber for trust + urgency."
}
```

### Theme Selection Criteria

**Maturity (years in business):**
- `new` — <5 years, wants to prove themselves
- `established` — 5-15 years, trusted local presence
- `veteran` — 15+ years, heritage and expertise

**Positioning (business identity):**
- `discount` — Fast, affordable, high-volume
- `value` — Good quality at fair price
- `premium` — High-end, specialized, exclusive
- `specialist` — Niche (eco, tech, luxury)

**Trades:**
- `hvac`, `plumbing`, `electrical`, etc.

---

## Agent Decision Framework

### Step 1: Analyze Business Data

Agent extracts:
```typescript
const analysis = {
  maturity: yearsInBusiness < 5 ? 'new' : yearsInBusiness < 15 ? 'established' : 'veteran',
  urgency: isEmergencyService(services) ? 'high' : 'normal',
  scale: teamSize < 3 ? 'solo' : teamSize < 10 ? 'small' : 'medium',
  complexity: services.length + serviceAreas.length,
  trade: data.trade,
  positioning: inferPositioning(data), // From pricing, messaging, market
}
```

### Step 2: Select Theme

**Selection Logic:**

1. **Filter themes by trade** — `themes.filter(t => t.trades.includes(analysis.trade))`
2. **Filter by maturity** — Match `analysis.maturity` exactly
3. **Filter by positioning** — Match business positioning
4. **Pick first remaining theme** — Or pick by secondary criteria (complexity, scale)

**Fallback:** If no exact match, relax positioning filter and match on (maturity + trade).

Example:
```javascript
// HVAC, established, value positioning
const candidates = themes.filter(t =>
  t.trades.includes('hvac') &&
  t.maturity === 'established' &&
  t.positioning === 'value'
);
return candidates[0] || themes.filter(t => t.trades.includes('hvac') && t.maturity === 'established')[0];
```

### Step 3: Select Component Variants

Once theme is chosen, select variants based on business characteristics:

**Hero Variant:**
- `full-bleed` — For bold, emergency-focused services
- `photo-left` — For established, balanced positioning
- `minimal` — For premium, text-first positioning
- `accent-bar` — For compact, value-focused
- `split` — For balanced, premium services

**Services Layout:**
- `grid-3col` — For 3–4 services (standard)
- `grid-2col-feature` — For 4–6 services (feature first)
- `card-stack` — For <3 services (spacious)
- `list-sidebar` — For 6+ services (complex)

**Selection:**
```javascript
function selectVariants(analysis, theme) {
  return {
    heroVariant:
      analysis.urgency === 'high' ? 'full-bleed' :
      analysis.positioning === 'premium' ? 'minimal' :
      'photo-left',

    servicesLayout:
      analysis.complexity >= 6 ? 'list-sidebar' :
      analysis.complexity <= 2 ? 'card-stack' :
      'grid-3col',

    testimonialStyle:
      analysis.scale === 'solo' ? 'sidebar' :
      analysis.scale === 'medium' ? 'grid' :
      'carousel',

    ctaPosition: analysis.urgency === 'high' ? 'floating' : 'embedded',
    footerVariant: analysis.complexity > 5 ? 'full' : 'minimal',
  };
}
```

### Step 4: Select Content Tone

```javascript
function selectTone(analysis) {
  return {
    urgency: analysis.urgency,
    formality:
      analysis.positioning === 'premium' ? 'professional' :
      analysis.maturity === 'new' ? 'approachable' :
      'professional',
    emphasis:
      analysis.urgency === 'high' ? 'speed' :
      analysis.positioning === 'premium' ? 'value' :
      'trust',
  };
}
```

---

## Token Validation Checklist

Before rendering any site with design tokens, verify:

- [ ] **Color Validation**
  - [ ] Primary ≥4.5:1 contrast on white (WCAG AA)
  - [ ] Accent ≥4.5:1 contrast on white (WCAG AA)
  - [ ] Dark/light variants are correct shades

- [ ] **Component Validation**
  - [ ] Hero variant is one of 5 valid options
  - [ ] Services layout matches service count (3 services → grid-3col, not list-sidebar)
  - [ ] Testimonial style exists (grid, carousel, sidebar)

- [ ] **Tone Validation**
  - [ ] Urgency matches service type (emergency → high, planned → low)
  - [ ] Formality matches positioning (premium → professional)
  - [ ] Emphasis aligns with business positioning

- [ ] **Data Flow**
  - [ ] Business data → analysis produces valid fields
  - [ ] Analysis → token selection produces valid token structure
  - [ ] Tokens → component rendering (no missing variant implementations)

---

## Testing Tokens (QA Gate)

Add this to `qa.mjs`:

```javascript
import { validateTokens, validateAccessibility } from './lib/design-tokens.ts';

function validateTokensQA(client) {
  const errors = [];

  // 1. Load tokens for this client
  const tokensPath = `data/clients/${client.slug}-tokens.json`;
  let tokens;
  try {
    tokens = JSON.parse(readFileSync(tokensPath, 'utf8'));
  } catch (e) {
    errors.push(`❌ Token file not found or invalid JSON: ${tokensPath}`);
    return errors;
  }

  // 2. Validate token structure
  if (!validateTokens(tokens)) {
    errors.push(`❌ Token structure invalid`);
    return errors;
  }

  // 3. Validate accessibility
  const a11y = validateAccessibility(tokens);
  if (!a11y.valid) {
    errors.push(`❌ Accessibility issues: ${a11y.issues.join(', ')}`);
  }

  // 4. Validate component variants exist
  const componentErrors = validateComponentVariants(tokens.components);
  errors.push(...componentErrors);

  return errors.length === 0 ? ['✓ Tokens validated'] : errors;
}
```

---

## Example: Complete Token Output

Given this business data:

```json
{
  "name": "Desert Comfort HVAC",
  "yearsInBusiness": 8,
  "services": ["AC repair", "System replacement", "Maintenance"],
  "serviceAreas": ["Phoenix", "Mesa"],
  "trade": "hvac"
}
```

Agent produces:

```json
{
  "themeId": "trust-blue-gold",
  "themeName": "Trust + Speed",
  "colors": {
    "primary": "#0369a1",
    "accent": "#f59e0b",
    "primaryDark": "#024e7a",
    "primaryLight": "#e0f2fe"
  },
  "typography": "classic",
  "density": "comfortable",
  "components": {
    "heroVariant": "photo-left",
    "servicesLayout": "grid-3col",
    "testimonialStyle": "grid",
    "ctaPosition": "floating",
    "footerVariant": "minimal"
  },
  "contentTone": {
    "urgency": "high",
    "formality": "professional",
    "emphasis": "speed"
  }
}
```

Template then renders using:
- Hero: photo-left variant with primary color background
- Services: 3-column grid with primary text, accent CTAs
- Testimonials: 3-card grid layout
- CTA: Floating button with accent color

---

## Diversity Metrics (Constrained Variety Testing)

When running a test loop, ensure:

```javascript
const metrics = {
  diversity: {
    unique_themes: new Set(sites.map(s => s.tokens.themeId)).size,
    unique_hero_variants: new Set(sites.map(s => s.tokens.components.heroVariant)).size,
    unique_layouts: new Set(sites.map(s => s.tokens.components.servicesLayout)).size,
    unique_testimonial_styles: new Set(sites.map(s => s.tokens.components.testimonialStyle)).size,
  },
  quality: {
    qa_pass_rate: (passed / total * 100).toFixed(1),
    token_validation_pass: (tokensPassed / total * 100).toFixed(1),
  }
};

// Target: diversity_score ≥ 0.8 across all dimensions
```

---

## Do's & Don'ts

**DO:**
- ✓ Use pre-tested 30 themes (not random colors)
- ✓ Match hero variant to business urgency
- ✓ Test token → component rendering before ship
- ✓ Validate WCAG on every new theme
- ✓ Log theme + variant choices in metrics

**DON'T:**
- ✗ Override theme selection manually (defeats diversity)
- ✗ Mix primary + accent for body text (use primary only)
- ✗ Apply random variants per site (deterministic selection)
- ✗ Add new themes without WCAG audit
- ✗ Assume theme works without accessibility test

---

*Design tokens enable 1000+ unique sites from 30 themes × 5 hero variants × 4 layouts × 3 testimonial styles = 1,800+ combinations, plus agent-driven tone and positioning selection.*
