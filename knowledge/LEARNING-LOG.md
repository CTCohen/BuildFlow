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
