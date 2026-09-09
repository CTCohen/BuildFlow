---
id: page-contact
type: template
status: active
source: [ref:local-seo-hvac-2025, ref:cxl-home-service-landing]
last_reviewed: 2026-09-08
applies_to: [build]
links: [[conversion]] [[local-seo]] [[page-service-area]]
---

# Contact page (`/contact`)

Structure:
1. **H1** — "Contact `<Business>`".
2. Lead line — phone (tap-to-call, bold) + same-business-day reply promise.
3. **Quote form** — 4 fields (name, phone, address, "what's going on?") + service select.
4. **NAP block** — business name, phone, email, hours, service area — the canonical NAP
   string (must match footer + schema + GBP).
5. **Service-area** map + suburb chips.
6. Emergency line callout if the business offers 24/7.

## Check
- QA: `/contact` has H1, a `tel:` link, a form with ≤ 5 fields, and a NAP block whose
  name+phone string matches the footer and JSON-LD exactly.
