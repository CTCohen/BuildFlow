---
id: page-services
type: template
status: active
source: [ref:local-seo-hvac-2025]
last_reviewed: 2026-09-08
applies_to: [build]
links: [[page-service-detail]] [[local-seo]] [[section-blocks]]
---

# Services hub page (`/services`)

The hub that links every service × city spoke.

Structure:
1. **H1** — "`<Trade>` services in `<primary city>`".
2. Intro — 2 sentences: what they do, area covered, one differentiator. Direct answer first.
3. **Service grid** — one card per service (symptom-aware name + 1-line blurb + link to
   the detail page).
4. **Service-area strip** — named suburbs as chips, each linking the matching
   service-area page.
5. FAQ block (3–5 Q&As, `FAQPage` schema).
6. Quote form.

Rules:
- ≥ 4 services. Each links to its own `/services/<slug>` page.
- Every service name is how a customer would describe the problem or job, not internal jargon.

## Check
- QA: `/services` exists, has an H1 matching the pattern, links ≥ 4 `/services/*` pages
  and ≥ 1 `/areas/*` page, carries `FAQPage` schema.
