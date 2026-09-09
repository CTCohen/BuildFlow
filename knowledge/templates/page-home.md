---
id: page-home
type: template
status: draft
source: [ref:cxl-home-service-landing, ref:nng-smb-ux]
last_reviewed: 2026-09-08
applies_to: [build]
links: [[section-blocks]] [[conversion]] [[hvac-must-haves]]
---

# Home page structure

Section order (top to bottom):

1. **Hero** — H1 = `<trade> in <city> — <promise>`. Sub = one sentence, concrete.
   Primary CTA = call. Secondary CTA = "See services" or "Get a quote". Trust strip
   underneath: years · licensed/insured · service area · rating.
2. **Services grid** — 3–6 cards, each a real service with a one-line symptom-aware
   blurb. Links to service-detail pages.
3. **Why us** — 3 proof points backed by numbers (years, jobs done, response window).
   Not adjectives.
4. **Reviews** — embedded Google reviews + 2–3 pull quotes with name + suburb.
5. **Service area** — named suburbs as chips + a map. Restates hours.
6. **Offer** — financing line and/or maintenance-plan card (trade-dependent).
7. **Quote form** — 4 fields. Same-business-day reply promise.

Rules:
- One primary action per screen (call or quote). Never both competing.
- Every section is skimmable in 3 seconds: heading says the point.
- No carousel. No auto-playing anything. No modal on load.

## Check
- QA required-content: H1 matches the trade+city pattern; hero has a `tel:` CTA.
- QA: sections 1–7 all present and non-empty for the active client.
- Reviewer: page reads top-to-bottom as a story a nervous buyer would follow.
