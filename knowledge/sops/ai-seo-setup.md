---
id: ai-seo-setup
type: sop
status: active
last_reviewed: 2026-09-08
applies_to: [seo]
links: [[ai-seo]] [[hvac-schema]] [[page-service-detail]]
---

# SOP — AI SEO setup (per site)

## Steps
1. **`/llms.txt`** generated at root: `# <Business>`, one-line description, then a
   markdown list linking home, every service page, every area page, contact. Regenerate
   whenever the page set changes.
2. **Direct-answer-first:** every service page and FAQ answer opens with a 1-sentence
   answer in the first 40–60 words.
3. **Fact density:** each service page carries ≥ 3 concrete numbers (response window,
   price range, warranty, brands, years).
4. **Schema:** `FAQPage` on home + service pages; `HowTo` on service "what we do" steps;
   `HVACBusiness` sitewide. FAQ JSON mirrors visible text exactly.
5. **Entity consistency:** business name, service names, city names identical everywhere
   (page copy + schema + llms.txt + title tags).
6. Run `searchfit-seo:ai-visibility`; fix findings.

## Check
- `searchfit-seo:ai-visibility` passes.
- QA: `/llms.txt` lists every indexable page; `FAQPage` valid on `/` + each `/services/*`;
  entity strings match across copy, schema, and llms.txt.
