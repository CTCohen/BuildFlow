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
`systems/dashboard_micro_system.md`). SMB gets full lead management: notes, a simple pipeline, image uploads, and a
CRM config UI, per `docs/TIER-FEATURE-MATRIX.md`.


**Code lives at:** `platform/dashboards/lib/customer-dashboard.mjs`, `tier-features.mjs`, `sandbox-dashboard.mjs`, `demo-tracking.mjs` (shared with Micro, see `systems/dashboard_micro_system.md`)

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

### Exact fields shown
Lead inbox (`buildLeadInbox()`): `id`, `name`, `email`, `phone`, `message`, `submittedAt`, `crmSyncStatus`
(default `"pending"`), `pipelineStage` (default `"new"`, editable — see actions below). CSV export
(`toCsv()`): `id,name,email,phone,submitted_at,pipeline_stage,crm_sync_status`. Pipeline view
(`buildPipeline()`): submission ids grouped by stage into `{new: [...], contacted: [...], converted: [...]}`
(the fixed `PIPELINE_STAGES` list — no custom stages). CRM config view (`buildCrmConfigView()`): `id`,
`crmType` (`crm_type`), `syncStatus` (`sync_status`), `lastSyncAt` (`last_sync_at`), `leadsSent`
(`leads_sent`), `syncErrorsCount` (`sync_errors_count`), `connected` (derived: `sync_status === "active"`) —
`auth_token_encrypted` is explicitly stripped, never returned even if passed in (asserted by test).

### Exact actions available to SMB (full `SMB_FEATURES` set, `tier-features.mjs`)
Lead inbox + CSV export + email alerts (same as Micro) — plus: add/edit **notes** per lead
(`setSubmissionNotes()`), move a lead through the **pipeline** new → contacted → converted
(`moveSubmissionStage()`, validates the target stage against `PIPELINE_STAGES` or throws), full **CRM config**
view (`buildCrmConfigView()`, read-only view of connection health — no write/reconnect action modeled yet),
**multi-image uploads** (`buildImageUploadConfig("smb")` → `{mode: "multi", targets: ["logo", "hero",
"services", "team", "testimonials"], maxFiles: 20}`), edit service descriptions, edit full contact info, edit
hours, add testimonials. Off even for SMB: `editBrandColor` ("pre-approved by Fornax, no tier can self-edit at
launch" per the matrix), `editFonts`, `customCss`, `multiUser`, `apiAccess` — none of these five exist for
either tier at launch.

### Exact data sources
`app.form_submissions` (lead inbox, pipeline, notes, CSV) and `app.crm_integrations`-shaped rows (CRM config
view, via `buildCrmConfigView`) — no live Supabase wiring yet (gate G3), fixture/mock rows only in tests.

### Exact differences from Micro
See `systems/dashboard_micro_system.md`'s "Exact differences from SMB" section for the same comparison from the
other side — not duplicated here to avoid drift between the two files.

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
  noted in `systems/dashboard_micro_system.md`, applies here too.
