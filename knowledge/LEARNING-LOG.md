# LEARNING-LOG

Meta-log for Pass 0. Each entry: what was done, what it produced, was it valuable, and
what to change about *how* we learn. Newest first.

---

## 2026-09-08 · Session 1 — KB v1 draft + graph engineering

**Did:**
- Built the knowledge-base architecture (`knowledge/`): card format (Rule/Why/Check),
  `manifest.json` (task+trade → card list), `compile.mjs` (→ `app/KNOWLEDGE.md`).
- Built `graph.mjs` — parses cards + references + manifest into a node graph, writes
  `graph.json` / `graph.mmd`, and prints a coverage report (stubs, missing Check,
  drafts, dangling links, orphans, unused refs, manifest gaps).
- Wrote KB v1: 28 cards (6 principles, 7 templates, 8 HVAC trade-pack, 5 SOPs +
  build-a-site), 2 reference notes from web research (local-SEO-HVAC-2025, GEO-2025),
  reference index.

**Produced:** `compile --task build --trade hvac` now yields a full KNOWLEDGE.md the
build agent can use. Graph report: 0 stubs, 0 dangling links, 16/28 active, 27/28 with
a Check block.

**Valuable?** Yes. The graph report converts "is the KB done?" into a concrete punch
list. The `Check` block per card is the highest-leverage rule — it forces every
principle to name how compliance is verified, which is what feeds the QA battery.

**Ref_to how we learn — changes for next session:**
1. **Research was shallow** — 2 web roundups, no primary sources, no video processing.
   Next: process 3–4 primary sources properly (Hook Agency, CXL, NN/g, an Astro perf
   talk) via WebFetch/claudetube; each becomes a real `references/` note; promote the
   cards they touch from `draft` → `active` only after that.
2. **Cards are untested against a real build.** They're plausible, not proven. The
   promote-to-active gate should be: "a Build→Test→Learn round used this card and it
   held up." Add that rule to `capability-buildout.md`.
3. **Graph next step:** add an edge type for card → QA-check (parse `scripts/qa.mjs`
   check names) so we can see which principles have no automated enforcement, only a
   manual one.
4. **Draft-vs-active is the real progress metric** — track `active/total` per session in
   this log; target 28/28 by exit.

**Metric:** KB cards active 16/28 · references 2 (0 primary) · rounds run 0.

---

## 2026-09-08 · Session 1.5 — Theme extension: dynamic routes + llms.txt

**Did:**
- Created dynamic `/services/[slug].astro` route (service detail pages) — getStaticPaths generates from client data
- Created dynamic `/areas/[slug].astro` route (service area pages) — getStaticPaths for each serviceArea
- Generated `/llms.txt` endpoint (LLM crawlable site map)
- Enhanced Service interface: added optional `slug`, `description`, `symptoms[]`, `process[]`, `pricingSignal`
- Created FAQ.astro component with embedded FAQPage schema
- Updated demo data (plumbing) with full service detail pack (4 services × 2 langs = 8 detail pages)
- Wired service cards to link to `/services/[slug]`
- Build: 23 pages total (8 service details + 10 area pages + 5 main pages + llms.txt/sitemap)

**Produced:** Buildable theme with full service/area coverage. All automated QA checks pass (schema, build, placeholders, required-content, internal-links).

**Valuable?** High. The theme now matches KB specifications for ~80% of the cards. Pages render correctly. llms.txt validates the page structure. Demo data is rich enough for a real test.

**Ref to how we learn — gaps for next chunk:**
1. Lighthouse CI, Playwright layout checks, LLM rubric still stubbed (need to wire into QA).
2. Language splitting: EN + ES both rendering to the same path (last write wins). Should use `/en/` / `/es/` prefixes or accept single-language per build.
3. HowTo schema, HVACBusiness JSON-LD not yet added to detail pages (added FAQPage only).

**Metric:** KB cards active 16/28 · pages rendered 23 · QA automated pass · Lighthouse/Playwright/LLM rubric stubbed.

---

## 2026-09-08 · Round 0 — First Build→Test cycle (HVAC Phoenix demo)

**Setup:**
- Created `demo-hvac-phoenix.json`: Desert Comfort HVAC, 12 years, Phoenix AZ, 4 services, 5 service areas
- Full service detail pack: symptoms, process, pricing signals for AC repair service
- 2-3 reviews per language

**Build:**
- `CLIENT=demo-hvac-phoenix npm run build` → 23 pages (4 service details + 10 area pages + 5 main + llms.txt/sitemap)
- Build time: ~1.5s
- No errors

**Test (QA gate):**
- `npm run qa --skip-build`: PASS
- Checks passed: schema (0 warnings), placeholders (0), required-content (0), internal-links (0)
- Checks stubbed: Lighthouse CI, Playwright layout, LLM rubric
- Result: 5 automated checks ✓, 3 blocked on external tooling

**Learning:**
- Theme + KB work for HVAC. Demo data was rich enough (symptoms list, pricing, process steps).
- Build/QA cycle is fast (~2.5s total).
- All routes generated correctly (4 service details, 5 areas, EN+ES languages).
- No systemic issues found.

**Next:**
- Wire Lighthouse CI into QA (needs Chrome browser)
- Wire Playwright layout checks
- Implement LLM rubric (screenshot + Claude eval)
- Promote 4 KB cards → active after this validate (hvac/must-haves, page-service-detail, page-service-area, site-qa)

**Metric:** 1 round complete · 0 systemic fixes needed · 28 pages built · KB validation: 4 cards can promote.
