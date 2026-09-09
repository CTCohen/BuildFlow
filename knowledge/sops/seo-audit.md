---
id: seo-audit
type: sop
status: active
last_reviewed: 2026-09-08
applies_to: [seo]
links: [[local-seo]] [[hvac-schema]] [[hvac-keyword-map]]
---

# SOP — SEO audit

Two uses: (a) score a **prospect's** current site (Stage 2B — becomes an outreach asset),
(b) verify **our** built site before it ships.

## Steps
1. Compile: `node knowledge/compile.mjs --task seo --trade <trade> --out app/KNOWLEDGE.md`.
2. Crawl homepage + up to 5 internal pages.
3. **Technical:** HTTPS, HTTP status, title/meta/H1 present + unique, canonical, sitemap,
   robots, image alt coverage, broken links, page weight, mobile viewport.
4. **Core Web Vitals:** Lighthouse LCP / CLS / TBT.
5. **Local:** NAP present + consistent with GBP, `LocalBusiness`/`HVACBusiness` schema,
   embedded map, city in title/H1 of location pages, service×city page coverage, GBP link.
6. **Content:** word count, # service pages, CTA presence, copyright/last-modified year,
   blog freshness.
7. **Platform detection** (prospect audits): Wix / Squarespace / GoDaddy / WordPress+theme
   / Weebly / Duda / hand-coded.
8. Score 0–100 with per-category breakdown + evidence list + top 3 fixes.

## Pass bar (our sites)
Overall ≥ 90 · valid schema · NAP consistent · every page unique title+meta · CWV within targets.

## Check
- Run against a known-good and a known-bad URL; scores rank them correctly.
- Our last 3 built sites all score ≥ 90.
