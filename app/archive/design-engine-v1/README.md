# Superseded — not wired into the live pipeline

`design-decision-engine.ts` and `design-tokens.ts` implemented a more elaborate
`BusinessProfile → decision category → variant pool → seeded selection` architecture
(see `../../DECISION_ENGINE_IMPLEMENTATION.md` for what it was meant to do).

**Neither file was ever imported by any `.astro` component or page.** Every real build —
including all synthetic test clients — ran on the simpler, live system instead:

- `src/lib/conditional-features.ts` — trade-string + business-signal rules
- explicit `brand.*` fields in each client JSON (hand-set, override the rules)

Archived here rather than deleted (2026-09-11) per workspace policy. If the more elaborate
categorization approach is wanted later, this is the starting point — but per the
2026-09-11 direction, BuildFlow has **one** design system going forward
(`conditional-features.ts` + the logo-detection branch in `schema.mjs`/`client.ts`), not two
in parallel.
