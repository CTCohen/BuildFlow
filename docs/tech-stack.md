# Tech stack — BuildFlow

Solo operator. Cheap to run. No rewrite later. One codebase for all sites.

## Locked

| Layer | Choice | Notes |
|-------|--------|-------|
| Public sites | **Astro**, single multi-tenant app | ~6-page service sites; ships HTML; very stable |
| Tenancy | Route by domain → `content/<slug>/` + `theme.json` | one deploy serves every client |
| Content store | **Files in the repo** (Markdown/JSON) | no database until ~10+ clients; Claude edits directly |
| Hosting | **Railway** (one service, many custom domains) | already subscribed |
| DNS / SSL / cache | **Cloudflare** (free tier) in front | client CNAMEs their domain to us |
| Forms → leads | Form → small endpoint (Railway) or Web3Forms free tier → email + SMS to owner | keep minimal |
| Domains | Client points existing domain, or we register at cost (~$12/yr) and bill through | |
| Pipeline / CRM | `pipeline.md` file or Airtable free tier | not a database |
| AI agents | Run **native on Chase's machine + cloud**, against **Claude Pro** | no Anthropic API |

## Not using (and why)

- **Anthropic API** — Pro covers agent + site-gen work. Only revisit if embedding Claude
  *inside* delivered sites; many cheaper options exist for that and it's a separate call.
- **Database** — premature under ~10 clients; files are simpler and versioned.
- **Next.js** — heavier than needed for mostly-static service sites; Astro is more durable.
- **Per-client repos** — kills the "fix once" property and the minimalist thesis.

## Open questions

- Lead endpoint: roll our own on Railway vs. Web3Forms/Formspree free tier
- SMS provider for lead alerts (owner notifications) — cost + deliverability
- When files → Postgres on Railway (trigger: ~10 clients or content editing pain)
- Where A-package exports get deployed (Netlify/Vercel one-click vs. zip + instructions)
- Analytics: Cloudflare Web Analytics (free) vs. Plausible

## Decisions log

- 2026-09-07 — Astro multi-tenant, Railway + Cloudflare, files-not-DB, no Anthropic API,
  hosted-subscription delivery model. See `docs/delivery-model.md`.
