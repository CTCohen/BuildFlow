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

## Delivery model

**One multi-tenant codebase. We host and maintain every site. No code is ever handed over.**
Each site = the same Astro app rendering a per-client content folder + theme config.

- **B — Managed Growth (default offer):** $99/mo. Hosting, SSL, domain, local + AI SEO,
  unlimited small content edits, monthly check-in. Annual: $990/yr.
- **A — Ownership (downsell, offer only if they reject monthly):** $497 one-time. Static
  starter site on the client's own host, 1 month transition support, then no ongoing
  service. Hosting/domain/email bills become theirs at handoff (in writing).
- Cold outreach leads with B; A is the fallback.
- No per-client custom code. New needs become config-flagged template features or are declined.

Full detail: `docs/delivery-model.md`.

## Technical stack

- **Public sites:** Astro, single multi-tenant app, routed by domain
- **Content:** files in repo — `content/<client>/{pages,theme.json}` (no DB until ~10 clients)
- **Hosting:** Railway (one service, many custom domains) + Cloudflare (DNS/SSL/cache)
- **Forms → leads:** contact/quote form → small endpoint → email + SMS to owner
- **Agents (discovery, outreach, site-gen):** run native on Chase's machine + cloud against
  **Claude Pro** — no Anthropic API. Embedding Claude *in* a product is a separate metered call.
- **Pipeline state:** `pipeline.md` / Airtable free tier — not a database

Candidate decisions + open questions: `docs/tech-stack.md`.

## Critical paths (cannot break)

- Automated discovery of candidate businesses
- Automated outreach (email + SMS) delivery
- Generated websites themselves (uptime, rendering, forms)
- Onboarding / go-live flow
- Auth for anything customer-facing
- EN/ES correctness in generated sites

## Constraints

- **Claude Pro usage:** agents and site-gen run against the Pro plan (no API). Log each
  significant automation run in `metrics/token-log.md` so pipeline work doesn't starve
  other Claude Code work.
- Minimalist business: few moving parts by design. Prefer removing a step to adding one.
- One codebase. If a fix would only help one client, it's the wrong fix.

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

Two layers (`routines/testing.md`):
- **Template** — full suite run only when the shared Astro app/theme changes (responsive,
  a11y, Lighthouse, components, visual regression).
- **Per-client QA gate** — `npm run qa -- --client <slug>` on every generated site before
  it goes to outreach/handoff: no placeholder leakage, required content present, links,
  form submit, EN/ES parity, Lighthouse budget, layout sanity, LLM rubric review.
- Calibrate: first ~10 sites also reviewed by hand against the same rubric to tune thresholds.

Still to define: agent-handoff correctness, speed (start→built / start→closed), discovery
quality metric, auth + onboarding walkthrough.

## Do's

- Keep the pipeline minimal; delete steps before adding them.
- Every fix lands in the shared codebase and helps all sites.
- Run the per-client QA gate before any site leaves the pipeline.
- Log significant automation runs in `metrics/token-log.md`.

## Don'ts

- Don't ship outreach copy or onboarding changes without approval.
- Don't write per-client code or one-off patches.
- Don't promise lead *outcomes* in package B — promise the lead-capture machinery.
- Don't hand over code, hosting, or DNS under package B.
