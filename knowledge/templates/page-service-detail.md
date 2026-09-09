---
id: page-service-detail
type: template
status: active
source: [ref:local-seo-hvac-2025, ref:geo-2025]
last_reviewed: 2026-09-08
applies_to: [build]
links: [[page-services]] [[ai-seo]] [[local-seo]] [[hvac-copy-bank]]
---

# Service detail page (`/services/<slug>`)

One per service. This is the page that ranks and gets cited.

Structure:
1. **H1** — the service as a customer says it ("AC not cooling? We fix it same day").
2. **Direct answer** (first 40–60 words): what the service is, typical turnaround, price
   signal, how to book.
3. **Symptoms / when you need this** — bulleted, real.
4. **What we do** — the process, 3–5 steps (`HowTo` schema).
5. **Why us for this** — 2–3 proof points with numbers.
6. **Pricing signal** — range, "free estimate", financing, "no trip charge with repair".
7. **Reviews** relevant to this service if available.
8. **FAQ** — 3–5, `FAQPage` schema.
9. **CTA** — call + short form.

Rules:
- Unique title + meta with the service + city.
- Cross-link sibling services and the matching service-area pages.

## Check
- QA: each `/services/*` page has H1, a first-paragraph direct answer, `HowTo` + `FAQPage`
  schema, a pricing-signal section, and ≥ 1 CTA.
- SEO audit: unique title/meta containing service + city.
