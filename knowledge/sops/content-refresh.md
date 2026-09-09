---
id: content-refresh
type: sop
status: draft
last_reviewed: 2026-09-08
applies_to: [managed]
links: [[managed-monthly]] [[page-service-detail]] [[ai-seo]] [[hvac-keyword-map]]
---

# SOP — content refresh (per managed client, monthly)

One meaningful content change per month. Pick the highest-leverage option:

1. **New service-area page** — if the client serves a city with no `/areas/*` page yet.
2. **New / deepened service page** — a service they do that has no page, or a thin page
   below 400 words.
3. **FAQ expansion** — add 2–3 real questions (from their call logs / reviews) with
   direct-answer-first copy + update `FAQPage` schema.
4. **Seasonal update** — refresh the home hero + top service page per
   [[hvac-phoenix-seasonal]] current month.
5. **Review refresh** — pull the latest Google reviews into the embedded block.

Rules:
- Every change keeps the site passing `sops/site-qa`.
- Update `/llms.txt` + `/sitemap.xml` if the page set changed.
- Log the change in the client's CRM activity timeline.

## Check
- One change shipped per client per month; site still passes QA; CRM activity logged.
