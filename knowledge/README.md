---
title: Readme
purpose: Documentation for README.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

> **Updated 2026-09-18 (spec reconciliation):** the spec's SEO/GEO system is `SPEC-16-seo-geo.md` in this folder. Phase 1 verticals are plumbing, HVAC, electrical and roofing; HVAC is complete, plumbing and electrical are partial, roofing has no pack yet. The cards also feed the **reusable copy pool** (copy generated once per vertical x service x city x profile, not per prospect; see `docs/LLM_COST_AND_API_PLAN.md`).


# knowledge/

The build knowledge base. Plain files, version-controlled next to the theme code they
drive. Agents read a **compiled subset** of this at build time — never the whole tree.

Later this lifts into Cortex nodecards unchanged: every card is already a standalone note
with frontmatter + `[[wikilinks]]`.

## Layout

```
principles/   cross-cutting rules (web design, conversion, local SEO, AI SEO, a11y, perf, copy)
templates/    reusable page + section structures
trades/<t>/   trade-specific packs (hvac first): must-haves, page-map, copy-bank,
              objection-handling, trust-signals, schema, keyword-map, seasonal
sops/         step procedures: build-a-site, seo-audit, ai-seo-setup, site-qa,
              managed-monthly, content-refresh
references/   one note per video/guide/doc consumed — source, date, takeaways, what we adopted
decisions/    why we chose X (feeds app/DESIGN.md)
test-logs/    one note per Build→Test→Learn round
```

## Card format

```markdown
---
id: hvac-must-haves
type: trade-pack        # principle | template | trade-pack | sop | reference | decision | test-log
trade: hvac             # or omit
status: active          # draft | active | deprecated
source: [ref:hook-agency-2025]
last_reviewed: 2026-09-08
applies_to: [build]      # build | seo | managed
links: [[hvac-page-map]] [[trust-signals]]
---

# Title

## Rule
Actionable, imperative, specific, testable.

## Why
Evidence, 1–3 lines, cite source ids.

## Check
How the QA gate or a reviewer verifies it was done. (This is what makes the card operational.)
```

## How agents use it

```bash
node knowledge/compile.mjs --task build --trade hvac --out app/KNOWLEDGE.md
```

`compile.mjs` reads `manifest.json`, resolves the ordered card list for that task+trade,
strips frontmatter, and concatenates into one file with a table of contents and a version
hash. The build agent then reads `app/KNOWLEDGE.md` + `app/DESIGN.md` and nothing else from
here. `references/`, `decisions/`, `test-logs/` are for humans and the learn step — never
injected into a build.

`app/KNOWLEDGE.md` is a build artifact (gitignored). Regenerate it before every build;
`sops/build-a-site.md` step 1 is the compile.

## Adding or changing a card

1. Edit / add the `.md` file.
2. If it's a new card, add its path to `manifest.json` under the right task(s).
3. If it changes the quality bar, update `app/DESIGN.md` and the QA rubric too.
4. Commit the card + any `src/` change together.
