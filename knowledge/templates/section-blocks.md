---
id: section-blocks
type: template
status: active
last_reviewed: 2026-09-08
applies_to: [build]
links: [[web-design]] [[conversion]] [[page-home]]
---

# Reusable section blocks

The theme's building blocks. Every page is composed from these; no bespoke sections.

| Block | Purpose | Key rules |
|---|---|---|
| `Hero` | above-the-fold pitch | H1 = trade+city+promise; call CTA; trust strip; 3 style variants |
| `ServicesGrid` | list services | 3–6 cards, symptom-aware names, link to detail |
| `WhyUs` | proof | 3 points, each backed by a number, not adjectives |
| `Reviews` | social proof | embedded Google reviews + 2–3 pull quotes w/ name + suburb |
| `ServiceArea` | coverage | suburb chips + map; restates hours |
| `Offer` | financing / maintenance plan | price + what's included; trade-dependent |
| `FAQ` | objections + GEO | 3–5 Q&As, `FAQPage` schema, direct-answer-first |
| `QuoteForm` | secondary CTA | 4 fields; outcome-labelled button; same-day-reply promise |
| `CallBar` | mobile sticky CTA | `tel:` + number, hidden ≥ md |
| `TrustBadges` | credentials | only badges the business holds; near a CTA |

Rules:
- Consistent vertical rhythm (`--density-section`).
- Alternate background (`surface` / `surface-2`) for adjacent sections, max 2 tones.
- Each block is independently reveal-animated with ≤ 60ms stagger.

## Check
- QA: rendered pages contain only known block markers; no one-off section classes.
- `impeccable`: no structural/spacing findings across blocks.
