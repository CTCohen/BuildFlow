---
id: local-seo
type: principle
status: active
source: [ref:local-seo-hvac-2025, ref:google-localbusiness-schema]
last_reviewed: 2026-09-08
applies_to: [build, seo, managed]
links: [[ai-seo]] [[performance-baseline]] [[hvac-schema]] [[hvac-keyword-map]]
---

# Local SEO

## Rule
- **NAP consistency:** business name, address (or "service area"), phone — identical
  string in the footer, contact page, and schema, matching the Google Business Profile.
- **Schema:** valid `LocalBusiness` (trade subtype where one exists, e.g. `HVACBusiness`)
  on every page; `areaServed` lists the real suburbs; `sameAs` links the GBP.
- **Structure:** a services hub linking **service × city** pages ("AC repair in
  Chandler"). One generic "Services" page does not rank.
- City name in the `<title>`, `<h1>`, and URL of location pages.
- Every page: unique title (≤ 60 char) + meta description (≤ 155 char), canonical, in the
  sitemap. `robots` allows indexing.
- Internal links: hub ↔ spokes, every page reachable in ≤ 2 clicks from home.
- Embed real Google reviews; keep them fresh (managed phase).

## Why
GBP + review signals are >half the local-pack outcome; on-page ~15%. Service×city pages
and clean schema are the parts we fully control. (ref:local-seo-hvac-2025)

## Check
- `searchfit-seo:seo-audit` ≥ 90; schema validates; NAP string identical in footer /
  contact / JSON-LD.
- QA: ≥ 4 service pages + ≥ 1 service-area page; each location page has city in title & H1.
- QA: every page has a unique non-empty title + meta description + canonical.
