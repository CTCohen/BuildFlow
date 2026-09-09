---
id: accessibility-baseline
type: principle
status: active
source: [ref:nng-smb-ux]
last_reviewed: 2026-09-08
applies_to: [build]
links: [[web-design]] [[performance-baseline]]
---

# Accessibility baseline (WCAG 2.2 AA)

## Rule
- Every image has meaningful `alt` (empty `alt=""` only for decoration).
- One `<h1>` per page; headings nest in order, no skips.
- Colour contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI borders.
- All interactive elements keyboard-reachable with a visible focus ring; logical tab order.
- Forms: every field has a associated `<label>`; errors announced in text, not colour only.
- Tap targets ≥ 44×44px; adequate spacing between them.
- Link text is descriptive ("AC repair services", not "click here").
- `lang` set on `<html>`; `prefers-reduced-motion` respected.
- Semantic landmarks: `header`, `nav`, `main`, `footer`; skip-to-content link.

## Why
A meaningful share of local customers use assistive tech or are older; a11y failures also
tank Lighthouse and local SEO. AA is the floor, not a stretch goal. (ref:nng-smb-ux)

## Check
- Lighthouse a11y ≥ 95; `chrome-devtools-mcp:a11y-debugging` reports 0 critical issues.
- QA: exactly one `<h1>` per page; all `<img>` have an `alt` attribute.
- Manual: tab through the home page — focus visible at every stop, form usable without a mouse.
