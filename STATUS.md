---
title: BuildFlow Execution Status
purpose: Real-time tracking of Phase 1 execution status and blockers
status: active
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: phase_1
---

> **Historical snapshot (2026-09-07).** Current status lives in `ROADMAP.md`, `PROGRESS.md` and `RECONCILIATION_LOG.md`.

# STATUS — 2026-09-07 (overnight build)

## Done this session

**Decisions locked** (in `docs/`, `CLAUDE.md`):
- Delivery: one multi-tenant Astro codebase, BuildFlow hosts + maintains, no code handoff.
- Offer (then): a two-tier pre-spec offer. **Superseded 2026-09-18** by the spec pricing: see `docs/PRICING.md`.
  (downsell, "you host it", offered only if they reject monthly). Market-researched — see
  `docs/delivery-model.md`.
- Stack: Astro + Railway + Cloudflare, client data as JSON files, Claude Pro only (superseded: see `docs/tech-stack.md`).

**Built — `app/` (Astro project, one client per build):**
- Full theme: Base layout (SEO, OpenGraph, canonical, **LocalBusiness JSON-LD**, sitemap,
  robots, skip-link, on-scroll reveal), Nav, Hero (3 style variants), Services, About,
  Testimonials, ServiceArea, QuoteForm (falls back to owner email until `FORM_ENDPOINT` set),
  Footer, mobile sticky call bar, 404.
- Design system in `src/styles/global.css` + `app/DESIGN.md` (house style — read before
  generating any site). Per-client knobs: brand colors, `heroStyle`, `typePairing`, `density`.
- Client data contract: `src/data/schema.mjs` (shared by app + QA). EN/ES both required.
- Demo client `src/data/clients/demo-plumbing.json` — "Northgate Plumbing Co.", full EN + ES.
- **QA gate** `scripts/qa.mjs` — `npm run qa -- --client <slug>`. Passing on the demo.
  Live checks: schema, build, placeholder-leak scan, required content (title/h1/meta/
  JSON-LD/phone/service-area), internal links, EN/ES parity.
  Stubbed (need Playwright + Lighthouse + browser): Lighthouse budget, layout sanity,
  LLM rubric review.
- `scripts/new-client.mjs` — `npm run new-client -- <slug> <trade>` scaffolds a client file.
- `npm run check` (astro/TS) clean. `npm run build` clean. Dev server verified rendering.

## Not done / next

1. **Wire the 3 stubbed QA checks** — install Playwright + Lighthouse CI, implement in
   `scripts/qa.mjs` (the LLM rubric is the "living/breathing" gate; rubric text is in
   `routines/testing.md` and `app/DESIGN.md`).
2. **Deploy demo to Railway + Cloudflare** — prove the per-client hosting path
   (`CLIENT=demo-plumbing`, `SITE_URL=...`, custom domain).
3. **Real photography + self-hosted fonts** — heroes are brand-tinted gradients right now;
   fonts are the system stack. See "Known gaps" in `app/DESIGN.md`.
4. **EN/ES routing** — data holds both languages; only EN routes are wired.
5. **Lead endpoint** — decide Web3Forms free tier vs. a small Railway endpoint; set `FORM_ENDPOINT`.
6. **`app/references/`** — drop 8–12 bar-setting screenshots (see its README).
7. Then: discovery agent → outreach agent + handoff → onboarding (all still `idea`/`building`
   in `specs/features.md`).

## How to pick up

```bash
cd app && npm install
npm run dev                              # see the demo site
npm run qa -- --client demo-plumbing     # see the gate
```
Read `app/README.md` and `app/DESIGN.md` first.
