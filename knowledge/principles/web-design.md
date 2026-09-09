---
id: web-design
type: principle
status: active
source: [ref:nng-smb-ux, ref:cxl-home-service-landing]
last_reviewed: 2026-09-08
applies_to: [build]
links: [[conversion]] [[anti-ai-slop-copy]] [[accessibility-baseline]]
---

# Visual & structural design

## Rule
- **Specific over pretty.** Real photos, real service areas, real names. A plain
  specific page beats a slick generic one.
- **One primary action per screen** (call or quote). No competing CTAs.
- **Skimmable in 3 seconds per section**: the heading states the point; body supports it.
- Type: one display face + one text face max. Headings tight (`line-height ~1.12`,
  `letter-spacing -0.02em`), balanced. Body 16–18px, `line-height ~1.6`, measure ≤ 42rem.
- Spacing on a scale (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96). Consistent section rhythm.
- Elevation: at most two shadow levels. Borders 1px. Radius consistent (cards vs media).
- Colour: 2 brand colours (primary + accent) over a fixed neutral scale. Brand-on-brand
  text contrast auto-checked.
- Motion: subtle on-scroll reveal only (≤ 0.6s, ≤ 60ms stagger). Buttons lift 1px on
  hover. Respect `prefers-reduced-motion`. Nothing else moves. No carousels, no
  autoplay, no on-load modals.
- Mobile-first: design at 390px, enhance up. Sticky tap-to-call on mobile.

## Why
Service buyers are anxious and time-pressed. Clarity and proof convert; decoration and
choice paralysis don't. (ref:cxl-home-service-landing, ref:nng-smb-ux)

## Check
- LLM rubric "visual polish" ≥ 4/5 and "credibility" ≥ 4/5.
- QA layout-sanity: no horizontal scroll, no overlap, no broken images, mobile + desktop.
- `impeccable` pass with no structural findings.
