# ROADMAP.md — BuildFlow

> Weekly planning. Keep it short. One goal, clear scope, measurable done.

## This month's goal (target: ~2026-10-07)

Get **3 businesses set up for free**, with all automations running smoothly and every
delivered site feeling living/breathing and high quality.

## This week's goal

_Set a specific, shippable goal here._

## Focus areas

- [in progress] Astro app scaffolded + demo site building + QA gate passing (`app/`)
- QA gate: wire the 3 stubbed checks (Lighthouse, layout sanity, LLM rubric)
- Deploy the demo site to Railway + Cloudflare to prove the hosting path
- Stand up automated discovery of candidate service businesses
- Stand up automated email + SMS outreach with human first-reply handoff
- Site-generation agent producing a full, high-quality EN/ES site per candidate
- Finalize the offer sheet (B $99/mo default, A $497 downsell) — `docs/delivery-model.md`

## In scope

- Discovery, outreach, site generation, handoffs, onboarding for the first 3 free clients
- EN + ES site output
- Instrumentation of token spend

## Out of scope (for now)

- Paid acquisition / billing
- Verticals beyond service businesses
- Anything that adds a step to the pipeline without removing one

## Success metrics

- 3 free businesses onboarded and live
- All automations run without manual intervention
- Site quality: passes human eyes review every time
- Token spend stays inside the Pro budget with room for other work
- start→built and start→closed times measured and trending down

## Constraints

- Claude Pro usage limits — log significant automation/site-gen runs in `metrics/token-log.md`
  so pipeline work doesn't starve other Claude Code work (no Anthropic API in use)
- Solo operator — no step that needs a second person
- One codebase — no per-client code
