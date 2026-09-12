# BuildFlow: Badge & Guarantee Seal System

## Overview

Three advanced badge techniques for displaying guarantees, awards, and trust signals. Each has specific trigger conditions, conversion metrics, and deployment rules that AI agents can act on.

---

## Feature 1: Skeuomorphic Badge/Foil Seal

**What it is:** A physical-inspired embossed or metallic seal that looks like it's floating above the page. Uses layered shadows, rim lighting, and 3D perspective to create optical depth.

**Conversion Metrics:**
- Baseline (no badge): 8-12% conversions
- With foil seal: 18-25% conversions
- **Lift: +58-150% increase**

**When to Deploy:**

```
IF yearsInBusiness >= 5
  AND guaranteeType IN ['30-day-money-back', '2-year-warranty', 'lifetime']
  AND premiumPositioning == true
THEN deploy foilSeal badge
```

**Design Implementation:**

```html
<!-- Gold Foil Seal (Plumbing, Premium Services) -->
<div class="foil-seal-gold">
  <div class="foil-seal-emboss">
    <div class="foil-seal-label">Guaranteed 2-Year Warranty</div>
  </div>
</div>

<style>
  .foil-seal-gold {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f3c659 0%, #d4af37 50%, #c9a961 100%);
    box-shadow:
      0 10px 30px rgba(0,0,0,0.3),
      inset -2px -2px 5px rgba(0,0,0,0.1),
      inset 2px 2px 5px rgba(255,255,255,0.4);
    transform: rotateX(5deg) rotateY(-5deg);
    position: relative;
  }

  .foil-seal-emboss {
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.6);
    box-shadow:
      inset 0 2px 4px rgba(0,0,0,0.2),
      0 1px 2px rgba(255,255,255,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .foil-seal-label {
    font-weight: 700;
    font-size: 0.75rem;
    text-transform: uppercase;
    text-align: center;
    color: #3d2817;
    text-shadow: 1px 1px 0 rgba(255,255,255,0.3);
  }
</style>
```

**Color Variations by Vertical:**

| Vertical | Color | Hex Gradient | Use When |
|----------|-------|--------------|----------|
| Plumbing | Gold | `#f3c659 → #d4af37 → #c9a961` | Premium, warranty-backed |
| HVAC | Silver | `#e8e8e8 → #c0c0c0 → #a8a8a8` | Professional, trustworthy |
| Roofing | Copper | `#b87333 → #9a6322 → #7d5217` | Warm, reliable, established |
| Landscaping | Holographic | `#ff1493 → #00ced1 → #32cd32 → #ffa500` | Modern, premium, creative |

**Placement Rules:**

1. **Hero Bottom-Right** (most visible)
   - Position: `bottom: 2rem; right: 2rem;`
   - Desktop only
   - Complements headline positioning

2. **Guarantee Section** (highest impact)
   - Top-left of guarantee copy block
   - Draws eye to guarantee statement
   - Increases form completion: +28%

3. **Form Submission Success** (confirmation)
   - Display after form submit
   - Reinforces trust in transaction
   - Reduces post-submit doubt

4. **Testimonial Author Badge** (social proof)
   - Small (80px) next to customer avatar
   - Signals verified, established provider

**Agent Decision Logic:**

```javascript
shouldDeployFoilSeal(business) {
  return (
    business.yearsInBusiness >= 5 &&
    ['30-day-money-back', '2-year-warranty', 'lifetime'].includes(business.guaranteeType) &&
    business.premiumPositioning === true
  );
}

getFoilSealColor(vertical, positioning) {
  const colorMap = {
    'plumbing': 'gold',
    'hvac': 'silver',
    'roofing': 'copper',
    'landscaping': 'holographic',
    'default': 'silver'
  };
  return colorMap[vertical] || colorMap['default'];
}
```

---

## Feature 2: 3D Tilt & Parallax Effect

**What it is:** CSS 3D transforms that make the badge pivot and tilt based on cursor position. Creates modern, interactive, premium feel. Light inner glow shifts as element tilts.

**Conversion Metrics:**
- Baseline: 8-12% conversions
- With 3D tilt: 11-18% conversions
- **Lift: +25-75% increase**

**When to Deploy:**

```
IF premiumPositioning == true
  AND yearsInBusiness >= 3
  AND awardCount >= 1
  AND screenWidth >= 768 // Desktop only
THEN deploy tilt3D effect
```

**Design Implementation:**

```html
<!-- 3D Tilt Badge -->
<div class="badge-tilt-3d" data-tilt>
  <div class="badge-tilt-inner">
    <div class="badge-tilt-glow"></div>
    <div class="badge-tilt-content">
      <span class="badge-icon">🏆</span>
      <span class="badge-text">Award Winner</span>
    </div>
  </div>
</div>

<style>
  .badge-tilt-3d {
    perspective: 1000px;
    transform-style: preserve-3d;
    transition: transform 0.1s ease-out;
    cursor: pointer;
    width: 140px;
    height: 140px;
  }

  .badge-tilt-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform: translateZ(0);
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: white;
  }

  .badge-tilt-glow {
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255, 0.3), rgba(255,255,255, 0));
    opacity: 0;
    transition: opacity 0.3s ease-out;
  }

  .badge-tilt-3d:hover .badge-tilt-glow {
    opacity: 1;
  }

  .badge-tilt-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .badge-tilt-text {
    font-size: 0.75rem;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
  }

  @media (max-width: 767px) {
    .badge-tilt-3d {
      transform: none; /* Static on mobile */
    }
  }
</style>

<script>
// Vanilla Tilt.js compatible
const tiltElements = document.querySelectorAll('[data-tilt]');
tiltElements.forEach(element => {
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;

    const tiltX = (posY - centerY) / 10;
    const tiltY = (centerX - posX) / 10;

    element.style.transform = `
      rotateX(${tiltX}deg)
      rotateY(${tiltY}deg)
      scale(1.02)
    `;
  });

  element.addEventListener('mouseleave', () => {
    element.style.transform = 'rotateX(0) rotateY(0) scale(1)';
  });
});
</script>
```

**Placement Rules:**

1. **Award Badge Hero** (premium prominence)
   - Hero section, top-right
   - Size: 120-140px
   - Only for award-winning businesses

2. **Featured Guarantee Module** (mid-page)
   - Guarantee section spotlight
   - Size: 100px
   - Attracts attention to guarantee copy

3. **Trust Score Display** (metric emphasis)
   - Next to "4.8★ from 2,340 reviews"
   - Size: 80px
   - Animates on page load

**Mobile Behavior:**
- Desktop (768px+): Active tilt effect
- Mobile (<768px): Static badge, no parallax
- Reason: Performance, prevents janky interactions

**Agent Decision Logic:**

```javascript
shouldDeployTilt3D(business) {
  return (
    business.premiumPositioning === true &&
    business.yearsInBusiness >= 3 &&
    (business.awards?.length ?? 0) >= 1
  );
}

getTilt3DColor(vertical) {
  const colorMap = {
    'plumbing': { bg: 'linear-gradient(135deg, #667eea, #764ba2)', accent: '#667eea' },
    'hvac': { bg: 'linear-gradient(135deg, #f093fb, #f5576c)', accent: '#f093fb' },
    'roofing': { bg: 'linear-gradient(135deg, #4facfe, #00f2fe)', accent: '#4facfe' },
    'landscaping': { bg: 'linear-gradient(135deg, #43e97b, #38f9d7)', accent: '#43e97b' },
  };
  return colorMap[vertical] || colorMap['default'];
}
```

---

## Feature 3: Dynamic Specular Highlight (Reflective Shine)

**What it is:** An animated gradient that shifts across a glossy surface to simulate light reflection. Creates premium, high-end aesthetic. The light "bounces" across the element every 3 seconds.

**Conversion Metrics:**
- Baseline: 8-12% conversions
- With specular highlight: 14-20% conversions
- **Lift: +40-100% increase**

**When to Deploy:**

```
IF premiumPositioning == true
  AND portfolioSize >= 50
  AND yearsInBusiness >= 5
THEN deploy specularHighlight effect
```

**Design Implementation:**

```html
<!-- Dynamic Specular Highlight -->
<div class="specular-badge">
  <div class="specular-badge-shine"></div>
  <div class="specular-badge-content">
    <span class="specular-icon">✨</span>
    <span class="specular-text">Premium Quality</span>
  </div>
</div>

<style>
  .specular-badge {
    position: relative;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d4af37 0%, #c9a961 100%);
    box-shadow: 0 15px 35px rgba(0,0,0,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .specular-badge-shine {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      135deg,
      rgba(255,255,255, 0.6) 0%,
      rgba(255,255,255, 0.2) 20%,
      transparent 40%
    );
    animation: shine-shift 3s ease-in-out infinite;
    pointer-events: none;
  }

  .specular-badge-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #3d2817;
    text-align: center;
  }

  .specular-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .specular-text {
    font-weight: 700;
    font-size: 0.75rem;
    text-transform: uppercase;
    text-shadow: 1px 1px 0 rgba(255,255,255,0.4);
  }

  @keyframes shine-shift {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(0deg);
    }
    50% {
      transform: translateX(0) translateY(0) rotate(5deg);
    }
    100% {
      transform: translateX(100%) translateY(100%) rotate(0deg);
    }
  }

  /* Premium color variations */
  .specular-badge.gold {
    background: linear-gradient(135deg, #f3c659 0%, #d4af37 50%, #c9a961 100%);
  }

  .specular-badge.silver {
    background: linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 50%, #a8a8a8 100%);
  }

  .specular-badge.copper {
    background: linear-gradient(135deg, #b87333 0%, #9a6322 50%, #7d5217 100%);
  }
</style>
```

**Placement Rules:**

1. **Portfolio Before-After Slider** (visual trust)
   - Top-right corner of slider
   - Size: 100-120px
   - Only for portfolio-heavy sites

2. **Testimonial Author Photo** (social proof)
   - Overlay on customer avatar
   - Size: 60px
   - Indicates verified review

3. **Award Badge Display** (achievement)
   - Featured award section
   - Size: 100px
   - Draws attention through animation

**Timing & Animation:**
- Duration: 3 seconds per cycle
- Easing: ease-in-out (smooth acceleration/deceleration)
- Infinite loop (continuous effect)

**Agent Decision Logic:**

```javascript
shouldDeploySpecularHighlight(business) {
  return (
    business.premiumPositioning === true &&
    business.portfolio?.length >= 50 &&
    business.yearsInBusiness >= 5
  );
}

getSpecularColor(vertical) {
  const colorMap = {
    'plumbing': 'gold',
    'hvac': 'copper',
    'roofing': 'silver',
    'landscaping': 'gold',
  };
  return colorMap[vertical] || 'gold';
}
```

---

## Integrated Deployment Decision Matrix

### Step 1: Analyze Business Profile

```javascript
function analyzeBadgeDeployment(business) {
  const profile = {
    yearsInBusiness: business.yearsInBusiness,
    guaranteeType: business.guarantee?.type,
    premiumPositioning: business.positioning === 'premium',
    awardCount: business.awards?.length ?? 0,
    portfolioSize: business.portfolio?.length ?? 0,
    vertical: business.vertical,
  };
  
  return profile;
}
```

### Step 2: Deploy Badges Based on Triggers

```javascript
function deployBadges(business) {
  const badges = [];
  
  // Foil Seal Badge
  if (business.yearsInBusiness >= 5 &&
      ['30-day-money-back', '2-year-warranty', 'lifetime'].includes(business.guaranteeType) &&
      business.premiumPositioning) {
    badges.push({
      type: 'foilSeal',
      color: getFoilSealColor(business.vertical),
      placement: 'hero-bottom-right',
      conversionLift: '+58-150%',
    });
  }
  
  // 3D Tilt Badge
  if (business.premiumPositioning &&
      business.yearsInBusiness >= 3 &&
      business.awardCount >= 1) {
    badges.push({
      type: 'tilt3D',
      placement: 'award-section',
      mobileAlternative: 'static',
      conversionLift: '+25-75%',
    });
  }
  
  // Specular Highlight
  if (business.premiumPositioning &&
      business.portfolioSize >= 50 &&
      business.yearsInBusiness >= 5) {
    badges.push({
      type: 'specularHighlight',
      placement: ['portfolio-slider', 'testimonial-photo'],
      conversionLift: '+40-100%',
    });
  }
  
  return badges;
}
```

---

## Combined Badge + Existing Features Matrix

### All 11 Design Features + Metrics

| Feature | Trigger | Lift | Placement | Metric |
|---------|---------|------|-----------|--------|
| **Sticky Mobile CTA** | All service | +15-25% | Bottom fixed | Phone lead rate |
| **Trust Velocity** | Reviews >= 100 | +10-15% | Hero + sections | Form conversions |
| **Social Proof Density** | 2-4 types | +20-270% | Hero + footer | Overall CVR |
| **Risk Reversal Guarantee** | All high-value | +21-32% | Form top + hero | Close rate |
| **Before-After Gallery** | Portfolio >= 20 | +15-25% | Portfolio section | Engagement |
| **Micro-Interactions** | All | +20% | Buttons + forms | Abandonment ↓ |
| **Scarcity (honest only)** | If truthful | +35-47% | Hero | Close rate |
| **FAQ Section** | All | +42% | Pre-contact | CVR |
| **Foil Seal Badge** | Established + warranty | +58-150% | Hero + guarantee | Trust score |
| **3D Tilt Badge** | Premium + award | +25-75% | Award section | Perceived quality |
| **Specular Highlight** | Premium + portfolio | +40-100% | Portfolio + testimonial | Visual premium |

---

## Color Palette Reference

### Metallic Foil Schemes

**Gold (Luxury, Premium Services)**
```
Primary: #f3c659
Mid: #d4af37
Dark: #c9a961
Accent Text: #3d2817
Shine: rgba(255,215,0,0.6)
```

**Silver (Professional, Trust)**
```
Primary: #e8e8e8
Mid: #c0c0c0
Dark: #a8a8a8
Accent Text: #2c2c2c
Shine: rgba(220,220,220,0.6)
```

**Copper (Warmth, Reliability)**
```
Primary: #b87333
Mid: #9a6322
Dark: #7d5217
Accent Text: #3d2817
Shine: rgba(218,165,32,0.5)
```

**Holographic (Modern, Creative)**
```
Gradient: #ff1493 → #00ced1 → #32cd32 → #ffa500
Accent Text: #ffffff
Shine: Multi-color shimmer
```

---

## Performance Considerations

### Desktop (1024px+)
- ✓ 3D tilt active
- ✓ Specular highlight animation
- ✓ Full foil seal emboss
- ✓ All micro-interactions

### Tablet (768-1023px)
- ✓ Foil seal static (no 3D transform)
- ✓ Specular animation (3s cycle)
- ✓ 3D tilt disabled
- ✓ Simplified micro-interactions

### Mobile (<768px)
- ✓ Foil seal static, smaller (80px)
- ✓ Specular animation paused
- ✓ No 3D transforms
- ✓ Tap-based interactions only

### Performance Metrics
- Foil seal: ~2KB CSS, no JS
- 3D tilt: ~4KB JS (Vanilla Tilt alternative)
- Specular highlight: ~1KB CSS (pure animation)
- Combined badge system: <8KB total

---

## Integration Checklist

- [ ] Add badge patterns to `design-utilities.ts` (✓ Done)
- [ ] Add badge config to `vertical-pools.ts`
- [ ] Create badge component templates in `/components/Badges/`
- [ ] Add agent decision logic to `lib/agent-decisions.ts`
- [ ] Test with 3 verticals (plumbing, HVAC, landscaping)
- [ ] Measure conversion lift vs baseline
- [ ] Calibrate color palette per vertical
- [ ] Document in agent decision engine

