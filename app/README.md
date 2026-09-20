---
title: Readme
purpose: Documentation for README.md
status: draft
owner: c.t.cohen
updated: '2026-09-12'
tier_scope: all
phase: operational
---

> **Updated 2026-09-18 (spec reconciliation):** clients now carry `tier` (micro|smb) and `styleProfile` (see `src/data/schema.mjs`); `content.es` is optional (English-only at launch). Scaffold with `npm run new-client -- <slug> <trade> [--tier micro|smb] [--profile <id>] [--es]`. QA takes `--stage demo|live` (demo floor: Lighthouse 80/90/80; live 90). Deploy: static output goes to Cloudflare Pages/R2 (not one Railway service per client); see `docs/tech-stack.md`.


# BuildFlow — website generator

One Astro codebase. **One client per build.** Each client is a single JSON file in
`src/data/clients/<slug>.json`; the build renders that client's site into `dist/`.

## Commands

```bash
npm install
npm run dev                         # preview the demo client at localhost:4321
CLIENT=demo-plumbing npm run build  # build one client → dist/
npm run qa -- --client demo-plumbing   # schema + build + rendered-HTML checks
npm run new-client -- acme-hvac hvac    # scaffold a new client file to fill in
npm run check                       # astro/TS check
```

Env (`.env`, or Railway per client): `CLIENT`, `SITE_URL`, `FORM_ENDPOINT` — see `.env.example`.

## Layout

```
src/
  data/
    schema.mjs            # client data contract — used by the app AND the QA gate
    clients/<slug>.json   # one file = one client site
  layouts/Base.astro      # <head>, SEO, JSON-LD LocalBusiness, nav/footer, reveal
  components/              # Hero, Services, About, Testimonials, ServiceArea, QuoteForm, ...
  pages/                   # index, services, about, contact, 404, sitemap.xml
  styles/global.css        # the design system (see ../DESIGN.md)
scripts/
  qa.mjs                   # per-client QA gate
  new-client.mjs           # client scaffolder
references/                # visual bar — screenshots (see references/README.md)
DESIGN.md                  # house style — read before generating/editing a site
```

## QA gate status

Implemented: schema validation, build, placeholder-leak scan, required-content presence
(title/h1/meta/JSON-LD/phone/service-area), internal-link check, EN/ES parity.

Not yet wired (need Playwright + Lighthouse + a browser): Lighthouse budget, layout
sanity, LLM rubric review. Stubs present in `scripts/qa.mjs`.

## Deploy (per client, later)

Static output (`dist/`) uploaded to Cloudflare Pages/R2 with `CLIENT=<slug>` + `SITE_URL=<their domain>`; custom domains through Cloudflare DNS. Any static host works for Offboard exports.
