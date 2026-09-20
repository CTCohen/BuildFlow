---
id: ai-seo
type: principle
status: active
source: [ref:geo-2025]
last_reviewed: 2026-09-08
applies_to: [build, seo, managed]
links: [[local-seo]] [[anti-ai-slop-copy]] [[hvac-schema]]
---

> **Updated 2026-09-18:** applied as a Layer 1 default in every tier (see `knowledge/SPEC-16-seo-geo.md`).


# AI SEO / GEO

## Rule
- **Direct answer first.** Each section (esp. service pages, FAQ) opens with a
  1-sentence answer in the first 40–60 words, then supports it.
- **Fact density:** a concrete number or spec roughly every 150–200 words — response
  window, price range, warranty length, brands serviced, years, certifications.
- **Schema:** `FAQPage` on home + service pages; `HowTo` where a process is described;
  `LocalBusiness` sitewide.
- **Entity consistency:** business name, service names, and city names phrased
  identically on every page and in schema — no synonyms drift.
- **`/llms.txt`** at site root: title, one-line description, and a linked list of the key
  pages (home, each service, service areas, contact).
- Content is extractable: real headings that are questions or noun phrases, short
  paragraphs, lists where a list is the honest structure.

## Why
AI answers are a fast-growing, low-competition, high-converting channel. Extractable,
fact-dense, schema-backed pages get cited. (ref:geo-2025)

## Check
- `searchfit-seo:ai-visibility` passes: `/llms.txt` present + well-formed; FAQ/HowTo
  schema valid; sections lead with a direct answer; entities consistent.
- QA: `/llms.txt` exists and lists every indexable page; `FAQPage` schema on `/` and each
  `/services/*`.
