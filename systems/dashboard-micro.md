---
title: Customer Dashboard — Micro
purpose: Authoritative spec and build checklist for the Micro tier's customer dashboard. Superseded/absorbed from docs/TIER-FEATURE-MATRIX.md, platform/dashboards/lib/tier-features.mjs and customer-dashboard.mjs.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: micro
phase: phase_1
---

# Customer Dashboard — Micro

One shared dashboard codebase with tier flags, not a separate build per tier (per Tyler's 2026-09-22 ruling,
also stated in `systems.md`'s "Note on dashboards"). Micro's variant is the same component tree as SMB with
most edit capabilities flagged off: effectively lead-inbox-only, wired to that customer's own site's
lead-capture endpoints. Dashboards are uniform within the Micro tranche — not per-vertical (yet; open question
below).


**Code lives at:** `platform/dashboards/lib/customer-dashboard.mjs`, `tier-features.mjs`, `sandbox-dashboard.mjs`, `demo-tracking.mjs` (shared with SMB, see `systems/dashboard-smb.md`)

## Built and verified
- [x] Feature-flag resolution for Micro — `platform/dashboards/lib/tier-features.mjs`'s `MICRO_OVERRIDES`:
  turns off `notes`, `pipeline`, `imageUploads` (multi-image), `crmConfig`, `editServiceDescriptions`,
  `addTestimonials`, full `editContactInfo`; turns on `singleLogoUpload` and `singlePhoneNumberEdit` in their
  place. `resolveFeatures("micro")` applies these overrides on top of the SMB base feature set.
- [x] Lead inbox and CSV export work identically for Micro and SMB — confirmed by
  `platform/dashboards/customer-dashboard.test.mjs`'s "Micro dashboard end to end" test (added 2026-09-22),
  which walks every capability once for both tiers, verifying `buildLeadInbox`/`toCsv` work for both while
  `buildPipeline`, `setSubmissionNotes`, `buildCrmConfigView` all throw for Micro, and
  `buildImageUploadConfig("micro")` returns `single-logo` mode.
- [x] Sandbox/demo-embed dashboard (read-only preview shown to prospects during the demo, per DECISIONS.md #6:
  "Demo = the built site plus the tier's dashboard") — `platform/dashboards/lib/sandbox-dashboard.mjs`'s
  `buildSandboxDashboard("micro")`, built on sample/fixture data only (`sample-*` ids, `@example.com` emails),
  `assertSampleShaped()` throws on any real-looking id, no mutation helpers re-exported. Includes
  `demoAnalytics` from `demo-tracking.mjs`.

### Exact fields shown (lead inbox — the only data view Micro has)
`buildLeadInbox()` maps each `app.form_submissions` row to: `id`, `name` (`prospect_name`), `email`
(`prospect_email`), `phone` (`prospect_phone`), `message`, `submittedAt` (`submitted_at`), `crmSyncStatus`
(defaults `"pending"`) and `pipelineStage` (defaults `"new"` — Micro never lets the customer move it, see below).
Sorted newest-submission-first. `toCsv()` exports the same seven columns as `id,name,email,phone,submitted_at,
pipeline_stage,crm_sync_status`.

### Exact actions available to Micro (`platform/dashboards/lib/tier-features.mjs` `MICRO_OVERRIDES`)
- View lead inbox (`leadInbox: true`), export CSV (`csvExport: true`), receive email alerts on new leads
  (`emailAlerts: true`) — same as SMB.
- Replace the site logo, one image only (`singleLogoUpload: true` via `buildImageUploadConfig("micro")` →
  `{mode: "single-logo", targets: ["logo"], maxFiles: 1}`).
- Add/edit one phone number (`singlePhoneNumberEdit: true`) — not full contact-info editing.
- Edit business hours (`editHours: true`, inherited unchanged from the SMB base set — not overridden off).
- Everything else is off: `notes`, `pipeline` (`buildPipeline`/`moveSubmissionStage` both throw
  `"pipeline is not enabled for tier \"micro\""`), `imageUploads` (multi-image), `crmConfig`
  (`buildCrmConfigView` throws), `editServiceDescriptions`, `addTestimonials`, `editContactInfo` (full),
  `editBrandColor`, `editFonts`, `customCss`, `multiUser`, `apiAccess` — the last five are off for SMB too
  (see `systems/dashboard-smb.md`), not a Micro-specific reduction.

### Exact data sources
`app.form_submissions` (lead inbox, CSV export) — no live Supabase wiring yet, fixture/mock rows only.
Sandbox view additionally reads `fixtures/sandbox-dashboard.fixtures.mjs`'s `SAMPLE_FORM_SUBMISSIONS`,
`SAMPLE_CRM_INTEGRATION` (unused since `crmConfig` is off), `SAMPLE_DEMO_EVENTS` (→ `demo-tracking.mjs`'s
`buildDemoAnalytics()` for the read-only demo analytics block: view count, unique sessions, device/referrer
counts, scroll-depth milestones, section clicks, form-engagement rate, avg time on site).

### Exact differences from SMB (not just "less")
Same component tree, same `customer-dashboard.mjs`/`tier-features.mjs` functions — Micro is a flag reduction,
not a separate build. The concrete deltas: Micro trades SMB's multi-image uploader for a single logo replace,
trades full contact-info editing for one phone-number field, and has no notes, no pipeline (lead status is
always `"new"` in the UI, uneditable), and no CRM config screen at all (Micro has no CRM integration — CRM
sync is an SMB-tier capability per `systems/outbound.md`/`systems/admin-dashboard.md`). `editHours` and the
five always-off flags (`editBrandColor`, `editFonts`, `customCss`, `multiUser`, `apiAccess`) are identical
between tiers.

**Test evidence:** part of the 43/43 `platform/dashboards` `node --test` suite, verified live 2026-09-22
(`operations/BUILD_TASKS.md` §7, `operations/COORDINATOR_STATE.md`'s "5 buildable-now items" run). **Not wired
to a live database** — no Supabase service-role key yet (gate G3) — and no rendered UI component yet, logic
layer only.

## Specified, not yet built
- [ ] Rendered dashboard UI (React or similar) — only the tested logic layer exists, per
  `platform/SPEC-03-hosting-infrastructure.md` Section 2's "Customer admin dashboard: React SPA on Cloud Run"
- [ ] Wiring to the customer's own live site's lead-capture endpoints — depends on real hosting
  (`platform/hosting/`, built on mocks, 40/40 tests) and a real Supabase connection, neither live yet
- [ ] Basic site analytics view (pageviews, traffic source, no conversion tracking) per the superseded matrix's
  Micro "Read-Only" section — not found built as a distinct capability in `customer-dashboard.mjs`
- [ ] Phone call log view (if Twilio-integrated) — Twilio is explicitly out of Phase 1 launch scope
  (`CLAUDE.md`: "SMS off"), so this has no credential path yet either

## Possible future specs (not built, not committed to)
- Per-vertical dashboard variants (HVAC vs. plumbing vs. electrical vs. roofing) — explicitly not planned now,
  see open question below

## Open questions
- Per Tyler's 2026-09-22 ruling: dashboards stay uniform within a tranche for now, not per-vertical — he may
  revisit this based on need. Tracked here as the source of truth for that open door, per the task's
  instruction.
