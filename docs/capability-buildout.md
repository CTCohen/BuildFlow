---
title: Capability Buildout
purpose: Documentation for capability-buildout.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

# Capability Buildout (Pass 0) — learning & testing tactic

**Purpose:** before running the discovery→delivery pipeline, prove we can build
launch-quality HVAC websites (plus SEO, AI SEO, and managed ops) every time.
**Principle:** you don't perfect this in the abstract — you perfect it *in the loop*,
on real Phoenix HVAC businesses you never contact. The learning phase front-loads known
best practice so round 1 doesn't start from zero.

Venture: **BuildFlow** (locked). Repo: `~/BuildFlow`. Knowledge base: `knowledge/`
(local; lifts to Cortex nodecards later, unchanged format).

---

## PART A — Learning system

### Competencies
1. **Website building** — Astro, HVAC specifics, UX, conversion, copy authenticity
2. **SEO + AI SEO** — on-page, local, schema, `llms.txt`, entity clarity, AI-answer citation
3. **Website management** — the Package-B monthly loop

### Learning loop (per competency, ~days 1–6)

| # | Step | What it means |
|---|------|---------------|
| 1 | **Frame the questions** | Before consuming anything, write the specific questions each competency must answer (e.g. "the 10 things an HVAC buyer checks before calling", "what schema drives local ranking in 2025", "what makes a page AI-answer-extractable"). These become card stubs. |
| 2 | **Curate + rank sources** | Build `docs/resource-index.md`: skills (have), MCP tools, repos, videos (last 6–12 mo), docs, expert creators. Rank by authority × recency × home-service-local specificity. |
| 3 | **Consume + extract** | One `knowledge/references/<slug>.md` per source: source, date, 3–7 takeaways, "adopt / reject / test". Videos via `claudetube` (`get-transcript`, `analyze_deep_tool`, `ask_video`); docs via `context7` / `exa` / WebFetch. |
| 4 | **Synthesize into cards** | Roll durable takeaways into `principles/`, `templates/`, `trades/hvac/`, `sops/`. Every card gets a `Check` block. Source conflicts → keep both, resolve in a `decisions/` card with rationale. |
| 5 | **Wire to enforcement** | Anything that moves the bar updates `app/DESIGN.md` + the QA rubric + the gate. A principle with no enforcement path is not done. |
| 6 | **Freeze KB v1** | `compile.mjs` hash = the KB version, recorded on every test build. |

**Card status gate:** a card is `draft` until a Build→Test→Learn round has used it and it
held up; only then → `active`. `node knowledge/graph.mjs` reports `active/total` — target
28/28 by exit. The graph report (stubs, missing `Check`, dangling links, orphans, unused
refs) is the punch list for each session.

### Resources

**Website building**
| Type | Picks | Status |
|---|---|---|
| Skills | `impeccable`, `frontend-design`, `front-end-design-work-flow`, `no-ai-slop`, `modern-web-guidance` | have |
| Live docs | `context7` → Astro 5, Tailwind 4, `astro-seo` | have |
| Repos | **AstroWind** (`onwidget/astrowind`), Astroship, Astro `examples/`, Preline/Flowbite blocks | acquire |
| Videos | Astro 5 crash courses (Coding in Public / Fireship / Astro official); **Hook Agency** (contractor web+SEO); ServiceTitan & Jobber Academy; CXL home-service landing | curate |
| Guides | web.dev CWV, WCAG 2.2 AA quick-ref, NN/g SMB UX & forms, Hook Agency / Contractor Dynamics playbooks | curate |

**SEO + AI SEO**
| Type | Picks | Status |
|---|---|---|
| Skills | `searchfit-seo:*` (+ `seo-auditor`, `competitor-analyzer`, `content-strategist` agents); `marketing-skills:` seo-audit / ai-seo / programmatic-seo / schema / site-architecture / cro; `solo-builder:seo-content` | have |
| Videos | Local: **Sterling Sky / Joy Hawkins**, Hook Agency local SEO 2025, GBP optimization 2025. AI SEO/GEO: **Mike King / iPullRank**, **Aleyda Solis**, Rand Fishkin | curate |
| Guides | Google Search Essentials + 2024 Starter Guide, Google local ranking factors, Schema.org `HVACBusiness`, Google AI-features guidance | curate |

**Website management**
| Type | Picks | Status |
|---|---|---|
| Skills | `searchfit-seo:seo-check` / `broken-links` / `internal-linking`, `chrome-devtools-mcp:debug-optimize-lcp`, `product-tracking-skills`, `marketing-skills:analytics` / `performance-report` | have |
| Videos/guides | Contractor Dynamics / Hook Agency retainer playbooks, "monthly local SEO 2025" | curate |

---

## PART B — Testing system

### Test subjects
- Pull **12 real Phoenix HVAC businesses** via a Places discovery sample → `app/samples/phoenix-hvac.json`. **Internal only, never contacted.**
- Split: **9** for build rounds (3/round), **3** held back as a final blind set.
- For each: snapshot their current site + one top local competitor as comparison baselines.

### Test battery (every built site)

| Layer | Tool | Pass bar |
|---|---|---|
| Build | `npm run build` | compiles clean |
| Automated QA | `npm run qa` | 0 hard-fails |
| Performance | Lighthouse CI | perf ≥ 90 |
| Accessibility | axe / Lighthouse a11y + `chrome-devtools-mcp:a11y-debugging` | a11y ≥ 95, 0 critical |
| Layout sanity | Playwright mobile + desktop | no h-scroll, no broken img, no overlap |
| On-page + local SEO | `searchfit-seo:seo-audit` + `marketing-skills:seo-audit` | ≥ 90, valid `HVACBusiness` schema, NAP consistent |
| AI SEO | `searchfit-seo:ai-visibility` | `llms.txt`, FAQ/HowTo schema, entity-consistent, extractable structure |
| Copy authenticity | grep banned phrases + LLM "copy specificity" rubric | 0 banned hits, specificity ≥ 4/5 |
| Design polish | `impeccable` + LLM rubric (credibility / polish / completeness) | each ≥ 4/5 |
| Human review (you) | scorecard, same rubric | accept |
| Comparative | side-by-side vs current site + top competitor | "clearly better than current, competitive with best" |

### Build → Test → Learn → Improve round (repeat)

1. **Build** 3 sample sites from the current KB (`sops/build-a-site`).
2. **Test** — full battery on each. Scores → `knowledge/test-logs/round-NN.md`.
3. **Triage** every miss: *content-miss* (one-off — fix the site) vs *systemic* (KB / template / rubric gap).
4. **Improve** — apply systemic fixes to `src/`, `DESIGN.md`, rubric thresholds, HVAC pack, KB cards. Bump KB version.
5. **Regression-check** — re-run the battery on the same 3 to confirm the fix.
6. **Next round** — 3 fresh businesses, applied knowledge. Compare round-over-round metrics.

### Per-round metrics (table in each test-log)
KB version · sites built · % QA first-pass · avg Lighthouse perf / a11y · avg SEO score ·
avg LLM rubric · human accept rate · avg agent build time · # systemic fixes applied

### Exit criteria → green-light Pass 1

- [ ] 3 consecutive sites: 0 hard-fails on first `npm run qa`
- [ ] Last 5 sites: LLM rubric avg ≥ 4.5, **human accept 100%**
- [ ] Every site: SEO ≥ 90, valid schema, NAP consistent
- [ ] Every site: Lighthouse perf ≥ 90 / a11y ≥ 95
- [ ] Every site: AI-SEO baseline present
- [ ] Agent build time start → `demo_ready` < 45 min
- [ ] **Blind set** (3 held-back businesses): agent builds each per `sops/build-a-site` with no human help → all pass battery + human accept
- [ ] HVAC trade pack complete (8 cards `active`); `sops/build-a-site` + `seo-audit` + `ai-seo-setup` validated on our own sites

---

## PART C — Flow (sequence)

| Window | Work | Deliverable |
|---|---|---|
| Days 1–2 | Frame questions; curate + rank resources | `docs/resource-index.md` |
| Days 2–5 | Consume + extract | `knowledge/references/*` (~15–25 notes) |
| Days 4–6 | Synthesize KB v1 | 21+ cards `active`, `DESIGN.md` updated, KB v1 frozen |
| Days 4–7 | Wire test battery | `npm run qa` full; Lighthouse + Playwright + SEO + AI-SEO hooked |
| Days 6–8 | Discovery sample | `app/samples/phoenix-hvac.json` + competitor snapshots |
| Days 7–16 | Build→Test→Learn rounds (~2/week) | `knowledge/test-logs/round-01..N`, KB v2..vN, hardened `src/` |
| ~Day 16 | Blind set + exit review | `docs/capability-exit-review.md` signed off |
| Then | Pass 1 (discovery pipeline build) | — |

---

## PART D — Deliverables produced

- `docs/resource-index.md` — ranked source list + status
- `knowledge/references/*` — one note per source consumed
- `knowledge/` KB v1 → vN — 21+ active cards (principles, templates, HVAC pack, SOPs)
- `knowledge/decisions/*` — resolved conflicts / choices
- `app/DESIGN.md` — updated quality bar
- `npm run qa` — full test battery (all 3 stubs wired + SEO + AI-SEO)
- `app/samples/phoenix-hvac.json` — 12 test businesses + competitor URLs
- `knowledge/test-logs/round-*.md` — per-round scores + triage
- `docs/capability-exit-review.md` — go/no-go checklist
- Hardened `app/src/` theme + trade variants
