# CLAUDE.md — BuildFlow

> Operating manual for this venture. Read before any build, spec, or outreach work.
> Workspace governance: `~/CLAUDE.md` and `~/.claude/CLAUDE.md` still apply.

## Role

**BuildFlow** — "Professional websites on your doorstep."
We build living, breathing websites for small service businesses — automated by AI agents
end to end, from finding the candidate to first human reply. A human (Chase) owns the deal
from first response through onboarding.

## Product in one paragraph

Small service businesses (plumbers, HVAC, electricians, roofers, carpenters, house/carpet
cleaning, pressure washing, junk removal) either have a weak website or none. BuildFlow
discovers these businesses, reaches out, and delivers a finished high-quality site they can
adopt as a drop-in replacement or first web presence. Discovery, outreach, and site
generation are AI-agent automated; the sell and onboarding are human.

## Core responsibilities

- **Discovery** — AI agents find candidate businesses that need a better website.
- **Outreach** — AI agents run email + SMS outreach to candidates; first reply is human.
- **Site generation** — AI agents build a complete, high-quality site per candidate.
- **Handoffs** — clean, traceable transitions between discovery → outreach → human → onboarding.
- **Onboarding** — smooth path for a business to adopt and go live with their new site.
- **Bilingual output** — sites and messaging work equally well in English and Spanish.

## Technical stack

_To be locked down. Requirement: one clear stack that works for a solo operator, is cheap
to run, and won't force a rewrite later. Candidate decisions tracked in `docs/tech-stack.md`._

## Critical paths (cannot break)

- Automated discovery of candidate businesses
- Automated outreach (email + SMS) delivery
- Generated websites themselves (uptime, rendering, forms)
- Onboarding / go-live flow
- Auth for anything customer-facing
- EN/ES correctness in generated sites

## Constraints

- **Token budget:** Claude Pro plan this month — limited usage. Every automation run must
  report tokens consumed. Track production vs. spend in `metrics/` so automation doesn't
  starve other work.
- Minimalist business: few moving parts by design. Prefer removing a step to adding one.

## Decision rules

**Safe — no approval needed:**
- Run discovery of candidate businesses/customers
- Build a candidate website (draft/preview)
- Send email + SMS outreach
- Test any part of the pipeline and propose improvements to workflow, site build,
  outreach, or the AI agents

**Ask first:**
- Changes to outreach copy / messaging
- Changes to the onboarding process
- Anything touching a critical path in production
- Adding a paid service or new dependency
- Migrations, auth changes

## Testing strategy

Owner needs help defining this. Known targets:
- Website output quality checks (automated + human eyes)
- AI-agent integration + handoff correctness across the full process
- Speed: start→built, start→closed
- E2E of the full pipeline
- Auth + onboarding
- Discovery quality (how well the AI finds real candidates)
- Language: EN + ES site operation
See `routines/testing.md`.

## Do's

_TBD — capture proven patterns here as they emerge._
- Keep the pipeline minimal; delete steps before adding them.
- Every automated run logs token cost.

## Don'ts

_TBD — capture anti-patterns here as they emerge._
- Don't ship outreach copy or onboarding changes without approval.
- Don't let an automation run untracked against the Pro token budget.
