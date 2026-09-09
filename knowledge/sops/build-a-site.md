---
id: build-a-site
type: sop
status: draft
last_reviewed: 2026-09-08
applies_to: [build]
links: [[page-home]] [[hvac-must-haves]] [[anti-ai-slop-copy]] [[site-qa]]
---

# SOP — build a site (agent)

Input: one `warehouse` row (business + `derived_services` + `derived_voice` + their
current site URL). Output: a passing site in `app/` for slug `<places_id>` + a demo URL.

1. **Compile knowledge:**
   `node knowledge/compile.mjs --task build --trade <trade> --out app/KNOWLEDGE.md`
2. **Read** `app/KNOWLEDGE.md` + `app/DESIGN.md`. These are the law for this build.
3. **Gather source material:** fetch the business's current site + GBP; keep the
   Stage-2B audit findings. Extract real facts: services, service areas, hours,
   license #, brands serviced, badges, years, phone, email, any photos.
4. **Scaffold the client file:** `npm run new-client -- <slug> <trade>`; fill every
   field from step 3. Never invent a badge, license, or review.
5. **Write copy** per [[anti-ai-slop-copy]] and the trade `copy-bank` — from their
   review language and `derived_voice`. EN first, then ES with true parity.
6. **Choose brand tokens** (`heroStyle`, `typePairing`, `density`, colors) per
   `app/DESIGN.md` knobs — pull colors from their existing branding if any.
7. **Build:** `CLIENT=<slug> npm run build`. Fix until it compiles clean.
8. **QA gate:** `npm run qa -- --client <slug>`. Fix every hard-fail. Address warnings.
9. **Self-critique:** run the [[site-qa]] LLM rubric + `impeccable`. Apply systemic
   fixes; log content-vs-systemic per the learn step.
10. **Deploy demo** to the pool project; record the URL on the row; set status
    `demo_ready`.
11. **Stop.** Do not send outreach — that is a separate stage and a separate gate.

Never: hand-edit `app/KNOWLEDGE.md`, write per-client code in `src/`, ship stock photos
of people, or claim a certification the business does not hold.

## Check
- `sops/site-qa` passes (QA exit 0, rubric ≥ 4/5, human accept).
- Row status advanced to `demo_ready` with a recorded demo URL.
- Agent build time start → `demo_ready` < 45 min.
- Zero deviations from this SOP's steps on the run (logged in the round test-log).
