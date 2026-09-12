# Mega-Scale Research Parameters & Guidance

## Approved Scope

### 1. Vertical Priority: Balanced Coverage
Research 20-25 verticals across 5 categories (4-5 per category):

**Emergency-Focused (response time critical):**
- HVAC/AC (year-round, acute failures)
- Plumbing (burst pipes, clogs)
- Electrical (power outages, hazards)
- Emergency restoration (water/fire damage)
- (1 more: gas leak, furnace failure)

**Seasonal (availability messaging key):**
- Landscaping (spring-fall heavy)
- Snow removal (winter-specific)
- Pool services (summer-focused)
- Tree care/arborist (seasonal pruning)
- Pressure washing (seasonal)

**Premium/High-Touch (craftsmanship + trust):**
- Roofing (high-cost, durability critical)
- Foundation repair (scary + expensive)
- Custom woodworking/carpentry
- Masonry/stonework
- Concrete (artisan finishes)

**Construction/Project-Based (timeline + scope):**
- Fence installation
- Deck building
- Bathroom renovation
- Kitchen renovation
- Decking/outdoor structures

**Specialized/Niche (education + proof):**
- Carpet/upholstery cleaning
- Pressure washing/exterior cleaning
- Septic service
- Well drilling/maintenance
- Chimney sweep
- Radon mitigation

---

### 2. Design System Research: Core + Vertical Deltas

**Deliverable Structure:**

1. **Core UX Mechanics** (5-8 patterns, any service site)
   - Pattern name
   - Why it matters for service businesses
   - Example sites that nail it
   - Source: (Nielsen Norman / UX Collective / Figma community)

2. **Vertical-Specific Customizations** (for each of 5 categories)
   - Emergency-focused sites: what's different from planned-service sites
   - Seasonal sites: what messaging/features emphasize availability
   - Premium sites: what signals luxury/craftsmanship
   - Project-based sites: what clarifies scope/timeline
   - Specialized sites: what educates the customer

3. **Conditional Feature Matrix**
   - IF [vertical attribute] THEN [include UX feature]
   - IF [business positioning] THEN [select component variant]
   - IF [business scale] THEN [layout complexity]
   - IF [service type] THEN [CTA strategy]

Example rows:
```
IF emergency-focused THEN add: floating emergency CTA, "24/7" messaging, response time guarantee, "On-call ready" indicator

IF portfolio-heavy THEN add: before/after carousel, service detail galleries, project showcases, photo upload for reviews

IF premium positioning THEN add: craftsmanship story section, material/warranty specs, luxury typography, refined color palettes

IF seasonal THEN add: availability calendar, "bookings open for [season]" CTA, seasonal service messaging

IF project-based THEN add: project timeline template, "here's what to expect" explainer, scope definition section
```

---

### 3. Color Research: Empirical + Normative

**Per Vertical, Research:**

A. **Empirical: Top Competitors' Color Choices**
   - Identify 3-5 market leaders per vertical
   - Extract their primary + accent colors
   - Note color choices + patterns
   - Why did they choose these? (if stated)

B. **Normative: Color Psychology + Theory**
   - What psychology research says about this vertical
   - Associations: emergency (red/orange/blue), growth (green), premium (purple/gold), etc.
   - Trust signals per vertical (durability = deep colors? expertise = blues?)

C. **Synthesis: Evidence-Based Recommendations**
   - Where empirical + theory align (strongest signals)
   - Where they differ (market vs. psychology)
   - Recommended 150-palette framework per vertical

Example for HVAC:
```
Empirical: Top 5 HVAC sites use: blue (65%), orange (40%), red (20%), gray (35%)
  → Trust (blue), urgency (orange), emergency (red background rare but accent common)
  
Normative: Psychology research says emergency services should use:
  → Blue (trust, professionalism) + Orange/red (urgency, action)
  → Avoid: pure red (alarm fatigue), gray (professionalism but no warmth)
  
Synthesis: 150-palette framework for HVAC should include:
  → Blue + orange combinations (empirically validated, psychologically sound)
  → Navy + warm accent variations (trust + action, not alarm)
  → Avoid: pure red-only (jarring), pure gray (cold)
```

---

## Research Sources (Verified Availability)

### Design Systems & Scale
- Material Design documentation (Google)
- Tailwind CSS design system
- Shadcn/ui component library
- Stripe design philosophy (public essays)
- Airbnb Bento (design system talk)

### UX/Design
- Nielsen Norman Group (usability research)
- AdobeXD blog + case studies
- Figma design community insights
- Smashing Magazine (design systems at scale)
- UX Collective (Medium)

### Frontend Engineering
- Fireship (YouTube - component patterns)
- Web Dev Simplified (YouTube - UX/frontend)
- ByteGrad (YouTube - design + code)
- CSS-Tricks (component design)

### Service Business Specifics
- YouTube: contractor marketing channels
- G2 reviews for service business software
- Service business websites (actual competitors)
- Small business marketing guides

### AI/Design at Scale
- Hugging Face: design synthesis research
- Lambda Labs: AI UI generation
- v0 by Vercel: AI component generation
- Papers on neural design synthesis

---

## Quality Checkpoints

Validate all findings:
- [ ] Each vertical has ≥3 sources cited
- [ ] Color palettes are WCAG AA/AAA tested
- [ ] Conditional features are evidence-based (not speculation)
- [ ] Core UX mechanics are industry-standard (not novel)
- [ ] Examples are real websites (not hypothetical)
- [ ] Vertical differences are substantive (not just color swaps)

---

## Deliverable Format

**Vertical Table** (20-25 rows × 7 columns):
| Vertical | Emergency? | Scale | Key UX Needs | Visual Identity | Complexity | Sources |

**UX Matrix** (5 sections):
1. Core mechanics (table or bulleted list)
2. Emergency-specific customizations
3. Seasonal-specific customizations
4. Premium-specific customizations
5. Project/construction-specific customizations

**Color Psychology Clusters** (5-7 groups):
- Group name
- Verticals in this cluster
- Color palette characteristics
- Why these colors work together
- 150-palette framework sketch

**Quality at Scale Insights** (3-5 key takeaways):
- How design systems scale without sacrifice
- What "diverse but good" looks like
- Metrics for quality at scale
- Agent decision-making patterns
- Risk mitigation strategies

---

## Success Criteria

✓ Research is evidence-based (sources cited)
✓ Findings are actionable (can code from this)
✓ Vertical differences are clear (not cosmetic)
✓ Conditional features are specific (not vague)
✓ Quality guardrails are defined (pass/fail criteria)
✓ Color psychology is integrated (not separate from business logic)

**Estimated output:** 5,000-7,000 words of structured, actionable research ready for architecture design phase.
