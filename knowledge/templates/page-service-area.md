---
id: page-service-area
type: template
status: active
source: [ref:local-seo-hvac-2025]
last_reviewed: 2026-09-08
applies_to: [build, seo]
links: [[local-seo]] [[page-service-detail]] [[hvac-keyword-map]]
---

# Service-area page (`/areas/<city-slug>`)

One per served suburb. Generated from the `serviceAreas` list. This is the local-SEO
spoke that captures "`<service>` in `<city>`" searches.

Structure:
1. **H1** — "`<Trade>` in `<City>`, `<ST>`".
2. Direct answer — we serve `<City>`, response window, how to book.
3. Local proof — neighbourhoods covered, a `<City>` review if available, "based in
   `<HQ city>`, `<n> min` from `<City>`".
4. Services offered in this city — linked list to `/services/*`.
5. FAQ (city-flavoured), `FAQPage` schema.
6. CTA.

Rules:
- City in URL, title, H1, and first paragraph.
- Not thin/duplicated: each page has ≥ 120 words unique to that city (neighbourhoods,
  landmarks, a real local review, drive time).
- `LocalBusiness` schema with `areaServed` = this city.

## Check
- QA: one `/areas/*` page per `serviceAreas` entry; each has city in title+H1+URL and
  ≥ 120 words not shared with sibling area pages.
