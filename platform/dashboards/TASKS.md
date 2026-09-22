---
title: Dashboards Lane Tasks
purpose: What Lane H (dashboards) has actually built and proven, and what's still blocked
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Lane H: Dashboards — build log

Read first: `operations/lanes/LANE-H-dashboards.md`, `platform/SPEC-18-admin-crm-operations.md`,
`docs/TIER-FEATURE-MATRIX.md`, `platform/CONTRACT.md`.

## Built this session (2026-09-22)

**Scope:** customer dashboard (SMB base + Micro feature-flag reduction, one component set per the plan's
"one dashboard, feature-flag layer" ruling) and the admin web dashboard's core view models. Built as real,
tested pure-function view-model layers over `platform/CONTRACT.md` row shapes with mock/fixture data — **not
wired to a live database.** No Supabase service-role key exists yet (COORDINATOR_STATE.md gate G3), so there is
nothing to wire to; this is the same "tested against fixtures, real backend wiring blocked" pattern
`platform/retention/retention.mjs` uses.

Files:
- `lib/tier-features.mjs` — resolves the SMB base feature set and Micro's reduced override, per
  `docs/TIER-FEATURE-MATRIX.md`'s Micro/SMB dashboard sections. Micro is the same flag set with switches off
  (lead-inbox-only + hours/one-phone/single-logo edits), not a separate build.
- `lib/customer-dashboard.mjs` — lead inbox, CSV export, simple pipeline (new/contacted/converted), notes,
  CRM config view (never leaks `auth_token_encrypted`), image-upload config (SMB multi vs Micro single-logo).
- `lib/admin-dashboard.mjs` — pipeline funnel + stuck-deal detection (SPEC-18 §1, minus "Trial Active" per the
  2026-09-18 spec override — no free trial), customer record view (joins `customers` + `customer_admin` +
  `subscriptions`), health score (SPEC-18 §4's 40/30/20/10 weighting/banding — the canonical formula, per
  CONTRACT.md's agent cross-reference, System 12 reuses), revenue dashboard (MRR/ARR/churn/ARPU + per-tier
  breakdown, minus Trial Conversion Rate and Mid-Market per the same override), alerts view (SPEC-18 §6).
- `fixtures/*.fixtures.mjs` — mock rows shaped exactly to `platform/CONTRACT.md`'s `app.*`/`admin.*` tables.
- `*.test.mjs` — real `node --test` suites (26 tests) run live this session; command + result below.

**Test evidence (run 2026-09-22):**
```
$ cd platform/dashboards && node --test *.test.mjs
# tests 26
# suites 0
# pass 26
# fail 0
```

## Contract gap found, logged, not guessed around
`app.form_submissions` (CONTRACT.md) has no `pipeline_stage` or `notes` column, but the tier matrix and
BUILD_TASKS.md §7 require SMB to have an editable simple pipeline and per-lead notes. `customer-dashboard.mjs`
accepts these as optional extension fields on the form_submissions shape (documented in the file header) so the
UI logic is real and tested now, without touching `platform/CONTRACT.md` (Lane A's file). Logged to
`operations/TYLER_QUEUE.md` for Lane A / Tyler to rule on where the fields actually land (new columns vs. a
side table).

## Still blocked (real backend wiring)
- No Supabase project/service-role key yet — nothing here can move from fixtures to live rows until Foundation
  provisions it (COORDINATOR_STATE.md gate G3).
- Auth (Google + 2FA for Tyler's admin login; customer Supabase Auth) is not built here — out of this session's
  scope, needs the live Supabase project too.
- Sandbox dashboard (read-only demo-page embed, per LANE-H-dashboards.md task 2) — not started this session.
- Actual React/Astro UI components (buttons, forms, tables) rendering these view models — not started; this
  session built the tested logic layer the UI would call. No existing dashboard UI location/pattern was found
  in the repo to match (checked `app/` — that's the Design Agent's per-client site renderer, a different
  product surface per `docs/CUSTOMER_VS_INTERNAL.md`), so `platform/dashboards/` was used per
  `operations/lanes/LANE-H-dashboards.md`'s own stated path.
- WCAG 2.1 AA accessibility and RLS-on-every-query checks (LANE-H-dashboards.md task 4) apply once there's a
  live UI and a live database to query — not applicable to pure fixture-backed functions yet.
