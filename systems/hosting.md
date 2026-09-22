---
title: Hosting & Deployment System
purpose: Authoritative spec and build checklist for static site hosting, deployment pipeline, domains, and cost monitoring. Superseded/absorbed from platform/SPEC-03-hosting-infrastructure.md (System 03).
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Hosting & Deployment System

Static sites (demo and live) on Cloudflare Pages/Workers with R2 storage; dashboards/API/agents run as a
container on Railway now, Google Cloud Run later (per the 2026-09-18 override, which supersedes the spec's
original Lightsail/Vercel finalist list). Code: `platform/hosting/`, built 2026-09-22 on mocks (no Cloudflare
account exists yet).

## Built and verified
- [x] Pages/Workers deploy + versioning/rollback — `platform/hosting/deploy.mjs`: real per-client project
  naming (`fornax-site-<slug>`), real versioning (`VersionStore`), auto-rollback to last known-good deploy on
  failure, plus an explicit `rollback()`. The actual Cloudflare Pages API call is mocked
  (`MockCloudflareAdapter.deployPages`/`rollbackTo`). Reads real build output from
  `agents/design/design-agent.mjs`'s `renderSite()`.
- [x] R2 bucket for site assets — `platform/hosting/assets.mjs`: real key structure
  (`sites/<slug>/<version>/<relative path>`, versioned so re-deploys never clobber prior assets), real
  content-type mapping, real manifest from actual build output; upload call mocked
  (`MockCloudflareAdapter.uploadObject`). Returns `bundleUrl` shaped to `app.websites.bundle_url` per
  `platform/CONTRACT.md`.
- [x] DNS + two-domain model — `platform/hosting/domains.mjs`: `subdomainForSlug()` assigns
  `<slug>.<customerRootDomain>`; `primaryHostnameFor()` picks the customer's own domain when set, else the
  subdomain. Domain names are config/env placeholders (`FORNAX_APP_DOMAIN`, `FORNAX_CUSTOMER_ROOT_DOMAIN`),
  not hardcoded — real values wait on D32 (which domains Tyler actually owns).
- [x] Deploy pipeline, timed end to end — `platform/hosting/pipeline.mjs`'s `runDeployPipeline()`: deploy → R2
  upload → DNS/SSL provision → health check, each stage timed against `PIPELINE_TARGET_MS` (this module's share
  of SPEC-03's ~60s total: upload ~2s + DNS/SSL ~30s + health check ~5s = 37s), checked via `withinTarget` on
  every run.
- [x] Per-customer hosting cost alert (>$50) — `platform/hosting/cost-alert.mjs` +
  `platform/db/migrations/0006_hosting_cost_alert.sql`. Reuses the existing `admin.raise_alert`/
  `admin.resolve_alert` dedupe/escalate/resolve pattern from `0004_monitoring.sql`. `cost-alert.mjs`'s own 3 JS
  unit tests pass live.

**Test evidence:** 40/40 unit tests pass (`node --test platform/hosting/*.test.mjs`), which includes the
pipeline module's own 9/9 case subset — run live 2026-09-22 per `operations/BUILD_TASKS.md` §2 and
`operations/COORDINATOR_STATE.md`. The SQL migration for the cost alert (`0006_hosting_cost_alert.sql`) and its
SQL test (`platform/db/tests/21_hosting_cost.sql`) were **not run live** — this sandbox cannot start local
Postgres (`shmget: Operation not permitted`); needs Tyler's Mac or CI.

## Specified, not yet built
- [ ] Cloudflare account + real API token [credential: Cloudflare, per `operations/BUILD_TASKS.md` §2]
- [ ] Real end-to-end deploy/rollback/upload/DNS calls — all currently mocked behind `MockCloudflareAdapter`
- [ ] Wildcard SSL for customer subdomains — confirmed this is **not application code to build**: a
  Cloudflare account-level setting (Universal SSL / Advanced Certificate Manager) that activates once a domain
  is on a Cloudflare zone. The mock DNS step reports `sslStatus: "active"` as a stand-in only.
- [ ] Real per-customer cost feed wiring (Cloudflare/R2 billing API → `recordHostingCost`) — nothing calls the
  built alert function yet with real data
- [ ] Container deploy to Railway (real, not local) [credential: Railway project exists — confirm env, per
  `operations/BUILD_TASKS.md` §1]
- [ ] Real Supabase service-role key for backend connection [credential — project exists, publishable key
  stored, service role key still needed]

## Possible future specs (not built, not committed to)
- Migration from Railway to Google Cloud Run once volume justifies it — explicitly planned as a later step, not
  a Phase 1 commitment, per the 2026-09-18 override ("start on Railway and migrate later; containerize from day
  1 so the move is a redeploy")

## Open questions
- None found beyond the credential blockers already tracked in `operations/TYLER_QUEUE.md`.
