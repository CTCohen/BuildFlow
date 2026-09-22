---
title: Customer Dashboard — SMB
purpose: Authoritative spec and build checklist for the SMB tier's customer dashboard. Superseded/absorbed from docs/TIER-FEATURE-MATRIX.md, platform/dashboards/lib/tier-features.mjs and customer-dashboard.mjs.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: smb
phase: phase_1
---

# Customer Dashboard — SMB

The base feature set of the one shared dashboard codebase (Micro is a reduction of this, not a fork — see
`systems/dashboard-micro.md`). SMB gets full lead management: notes, a simple pipeline, image uploads, and a
CRM config UI, per `docs/TIER-FEATURE-MATRIX.md`.

## Built and verified
- [x] Lead inbox + CSV export — `platform/dashboards/lib/customer-dashboard.mjs`'s `buildLeadInbox()`
  (sorted by submission date, includes CRM sync status and pipeline stage) and `toCsv()`.
- [x] Notes — `setSubmissionNotes()`, gated on `features.notes` (true for SMB).
- [x] Simple pipeline (new/contacted/converted) — `buildPipeline()` and `moveSubmissionStage()`, gated on
  `features.pipeline` (true for SMB). **Contract gap found and logged, not guessed:** `app.form_submissions`
  has no `pipeline_stage` or `notes` column in `platform/CONTRACT.md` yet; these functions accept both as
  optional fields (defaulting `pipeline_stage` to `"new"`, `notes` to `""`) so the logic layer is real and
  testable now, with the schema question logged to `operations/TYLER_QUEUE.md` §4 for Tyler/Lane A to rule on.
- [x] CRM config view — `buildCrmConfigView()`, gated on `features.crmConfig` (true for SMB). Never exposes
  `auth_token_encrypted` even if a caller passes it in — an explicit test asserts this.
- [x] Image uploads — `features.imageUploads: true` for SMB (vs. Micro's single-logo-only override).

**Test evidence:** part of the 26/26 (admin) + 43/43 (full suite including customer/sandbox/tier-features)
`node --test platform/dashboards/*.test.mjs`, verified live 2026-09-22 (`operations/BUILD_TASKS.md` §7). **Not
wired to a live database** — no Supabase service-role key yet (gate G3) — logic layer only, no rendered UI.

## Specified, not yet built
- [ ] Rendered dashboard UI (React SPA on Cloud Run per `platform/SPEC-03-hosting-infrastructure.md` Section 2)
  — only the tested logic layer exists
- [ ] Real-time lead count / sources / 3-month trend analytics view (per `docs/TIER-FEATURE-MATRIX.md`'s
  Dashboard table, "Analytics" row for SMB) — not found as a distinct builder function in
  `customer-dashboard.mjs`; only lead inbox and pipeline views exist
- [ ] Wiring to the customer's own live site's lead-capture endpoints — depends on real hosting and a live
  Supabase connection, neither live
- [ ] `pipeline_stage`/`notes` as real schema columns (or a side table) — the open contract gap above; the
  functions work today only because they tolerate the fields being absent from the real row shape

## Possible future specs (not built, not committed to)
- None beyond what's already tracked as specified-not-built above

## Open questions
- Whether `pipeline_stage`/`notes` land as new `form_submissions` columns or a side table — open in
  `operations/TYLER_QUEUE.md` §4, unresolved as of this pass.
- Per Tyler's 2026-09-22 ruling: dashboards stay uniform within a tranche (not per-vertical) — same open door
  noted in `systems/dashboard-micro.md`, applies here too.
