---
title: System 04 — Design Quality System
purpose: AI-generated website templates, components, design constraints, QA validation gates including WCAG 2.1 AA
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: 04-design-quality-system
spec_aliases:
- design system
- quality assurance
- design templates
- QA gates
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

> **Overrides (Tyler, 2026-09-18).** This spec is authoritative except where Tyler ruled otherwise (`RECONCILIATION_LOG.md`, `DECISIONS.md`):
> - Existing SMB design system is the base; Micro templates next. Mid-Market customization is deferred. Launch is English-only.
> - Customer sliders (Section 7) are SMB-only; Micro edits text and images and has no sliders.
> - The 32 existing themes map to the 10 profiles (`app/src/data/styleProfiles.json`).
> - Discovery Agent is built pre-launch in a minimal form (not Phase 1.5).
> - QA floors: demo Lighthouse >= 80 and accessibility >= 90 with axe zero must-fix; live sites >= 90. Initial render plus 2 retries, escalate on the 3rd failure. Manual review is for escalations and a sample, not every render; Tyler scores the first ~10 sites.
> - Redesign service is a waitlist item (human-executed).


# System 04 — Design Quality System

## Purpose

Lock down how AI generates high-quality websites, design constraints that ensure WCAG 2.1 AA compliance, and QA gates preventing bad designs from reaching customers.

## Contents

- Design generation model and template warehouse
- Design constraints locked from customer modification
- Customization scope per tranche
- WCAG 2.1 AA compliance requirements
- Automated and manual QA validation gates
- QA workflow and escalation path
- Design system versioning and governance
- Design update rollout strategy
- Design discovery agent, styling profiles, customization layer, redesign service

## Specifications

### SECTION 1: Design System & Templates

**LOCKED IN ARCHITECTURE:**

- **Master template warehouse:** Per-vertical static HTML templates (plumbing, HVAC, electrical, roofing)
- **Design Agent:** Generates personalized static HTML/CSS/JS per prospect during demo
  - Input: vertical, prospect company name, services, colors
  - Output: static HTML file, ~50KB including CSS + small JS bundle
  - Generation time: ~10 seconds
  - Storage: static files uploaded to Cloudflare Workers/Pages
- **Deployment target:** Cloudflare (not S3) — demo and live sites share same infra, seamless transition
- **Customer customization:** Admin dashboard (React SPA) hosted on Cloud Run
  - Changes trigger: backend API → Site Regeneration → new static HTML → push to Cloudflare
  - Live update latency: <5 seconds
- **Design constraints (locked from customer modification):** wireframe structure, logo positioning, color palette (5-6 predefined), fonts (3-4 pairs), responsive layout (fixed grid)

**Customization scope per tranche:**
- **Micro ($149/mo):** business name, description, contact info, images only
- **SMB ($249/mo):** + colors, fonts, service descriptions
- **Mid-Market ($399/mo):** + custom sections, restructure layout, custom forms/integrations

**Accessibility baseline (built into all templates):** 4.5:1 color contrast, 44x44px touch targets, keyboard navigation, ARIA labels, lang="en", skip links

---

## SECTION 2: Design Constraints & WCAG 2.1 AA Compliance

**WCAG 2.1 AA compliance requirements:** Text alternatives (alt text, max 125 chars), adaptable (reflow at 320px), distinguishable (4.5:1 contrast normal text, 3:1 large text), operable (full keyboard access, no traps), understandable (grade-8 readability, consistent nav), robust (valid HTML, correct ARIA)

**Automated validation gates:**
- Tool: axe DevTools + Lighthouse
- Run on: every template before launch, every customer site at deployment
- Fail gate: Lighthouse Accessibility score <90 blocks deployment

**Manual review checklist (Tyler's QA):** keyboard nav, tab order, focus visible, color contrast, mobile layout (320px/768px), touch targets, alt text, form labels, error messages, skip links

**Performance budget gates (Core Web Vitals):** FCP <1.8s, LCP <2.5s, CLS <0.1, TTI <3.8s

**Design review SLA:** automated checks <1 min; manual review by Tyler within 24 hours; re-submission SLA <4 hours

---

## SECTION 3: Quality Assurance Workflow

**LOCKED PROCESS:**

**QA triggers & timing:** Demo generation triggers QA immediately after Design Agent renders, before uploading to Cloudflare. Customer site regen: QA runs before pushing to Cloudflare. If QA fails, edits rejected with explanation.

**QA workflow (linear):**
1. Design Agent renders HTML/CSS website (10 sec)
2. Automated QA (Lighthouse, axe) runs (1 min)
3. If Lighthouse score <90 or axe errors: **REJECT**, log reason, go to Step 5
4. If passes automated QA: manual review by Tyler within 24 hours
   - Approved: **PASS** — demo uploads to Cloudflare / customer edit applies
   - Rejected: log specific issue, go to Step 5
5. Failed design handling: Design Agent re-renders with improved prompt (demo) or edit rejected with error shown (customer edit); after 2 failed attempts, escalate to Tyler

**Automated QA gates:** Lighthouse Accessibility ≥90, axe errors = 0 must-fix, Core Web Vitals within budget, valid HTML

**QA metrics tracked:** first-pass rate, automated failure rate, manual rejection rate, avg time render→approval, common rejection reasons

**Feedback loop:** every failed design logs rejection reason; monthly review of top 3 failure modes; Design Agent prompt refined to avoid those errors

**Escalation path:** if Design Agent can't pass QA after 3 attempts, escalate to Tyler (reject/manual fix/accept with warning)

---

## SECTION 4: Design System Governance & Updates

**Design system versioning:** MAJOR.MINOR.PATCH (current: v1.0.0)

**Design update rollout strategy:**
- PATCH (bug fix): auto-apply to all sites, no notice
- MINOR (new feature): auto-apply, notify customer
- MAJOR (breaking): customer opt-in, 2 weeks advance notice, 30-day transition window

**Design deprecation:** 90 days advance notice; migration assistance offered; fallback to security-patches-only if customer doesn't migrate

**Design quality tracking:** open issues per template, priority P0-P3, SLA (P0 24h, P1 1 week), tracked in GitHub issues, reviewed monthly

---

## SECTION 5: Design Discovery Agent (Phase 1.5)

**Purpose:** Automatically crawl customer's existing website to extract brand, aesthetics, layout patterns, copy tone, and preserve them in new Fornax site.

**Workflow:**
1. Customer provides existing website URL during onboarding
2. Agent crawls up to 10 pages, extracts: logo, colors (primary/secondary/accent), fonts, layout patterns, photography style, copy tone, certifications/awards, features/services, CTA patterns
3. Stores in JSON brand profile (logo_url, colors, fonts, tone, key_phrases, layout_patterns, features/services/testimonials/certifications/guarantees)
4. Design Agent uses discovery profile to generate new site — preserves logo/colors/tone/layout order/service descriptions/certifications; improves typography/spacing/mobile/component design/loading performance

**Success Metric:** Customer recognizes their brand in the new site (visual continuity preserved)

---

## SECTION 6: Design Styling Profiles (Phase 1)

**Purpose:** 8–10 pre-designed aesthetic themes so customers can customize mood without deep redesign.

| Profile | Vibe | Best For |
|---|---|---|
| Professional Service | Corporate, trustworthy | Electrical, plumbing (established firms) |
| Modern Minimalist | Clean, tech-forward | Tech-savvy contractors, startups |
| Cutting-Edge Tech | Innovative, future-focused | Solar, smart home, tech services |
| Established Authority | Heritage, reliability | Long-standing businesses, family firms |
| Energetic & Bold | Approachable, dynamic | Younger contractors, growth-focused |
| Eco-Conscious | Sustainable, responsible | Green services, solar, water |
| Luxury Premium | High-end, exclusive | Premium services |
| Community-Focused | Local, personal, friendly | Family businesses, local heroes |
| Modern Industrial | Tough, capable, technical | Construction trades, skilled trades |
| Transparent & Honest | Direct, no-BS | Value contractors, budget-conscious market |

**Customer chooses at onboarding:** default is Professional Service; profile applies to colors/fonts/spacing/icons/photography treatment — NOT layout structure, copy, or services list (those come from discovery)

---

## SECTION 7: Customization Layer (Phase 1)

**Purpose:** Sliders for quick appearance tweaks without full redesign.

| Control | Range | Effect |
|---|---|---|
| Primary Color | Color picker | Buttons, headings, accents |
| Secondary Color | Color picker | Hover states, borders, highlights |
| Headline Font | Dropdown (4 options/profile) | H1–H3 fonts |
| Body Font | Dropdown (2 options/profile) | Paragraph text |
| Spacing Scale | Slider 0.8x–1.3x | Margins/padding globally |
| Border Radius | Slider 0–20px | Buttons, cards |
| Accent Color | Color picker | Highlights, hover effects |

**Live preview**, "Save" applies changes, backend regenerates static HTML → push to Cloudflare in <5 seconds, "Reset to Profile Defaults" available. QA gate re-runs Lighthouse/axe after changes; warns on contrast failures.

---

## SECTION 8: Redesign Service (Phase 1)

**"Professional Redesign" Service** — pricing: $199 (layout tweaks), $299 (2-3 sections), $499 (full custom)

**Process:** questionnaire → Tyler/designer sketches 2-3 concepts → customer picks → designer builds → QA review → deploy. Turnaround 7-14 days.

**Value prop:** keeps customer on Fornax instead of losing to Wix/Squarespace; revenue uplift; positioned at onboarding, at churn-risk moment, or as optional upsell.

---

## Agent Registry Cross-Reference

Design Agent, Design Discovery Agent, and Design QA Agent are cataloged in `agents/AGENT_REGISTRY.md` (#1, #2, #3). Design Agent is invoked from FOUR places — System 4 direct, System 6 demo generation, System 18 photo-intake auto-build, and the customer-edit-triggered regeneration (System 2/12) — and must use identical logic/template warehouse across all four; no forked implementations per entry point.

---

## DEMO QA THRESHOLD — LOCKED

**Minimum Lighthouse Score: 80+**
- Scores <80: flagged for manual review or paused
- Scores 80–90: ship to prospects
- Scores 90+: polished, held for latter-stage optimization
- Tool: Google PageSpeed Insights / Chrome DevTools Lighthouse
- Audit axes: Performance + Accessibility (primary); Best Practices + SEO (secondary)
