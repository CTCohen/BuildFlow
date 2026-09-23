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


**Code lives at:** `platform/dashboards/lib/customer-dashboard.mjs`, `tier-features.mjs`, `sandbox-dashboard.mjs`, `demo-tracking.mjs` (shared with SMB, see `systems/dashboard_smb_system.md`)

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
  (see `systems/dashboard_smb_system.md`), not a Micro-specific reduction.

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
sync is an SMB-tier capability per `systems/outbound_system.md`/`systems/admin_dashboard_system.md`). `editHours` and the
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

## Proposed MVP spec (2026-09-22, needs Tyler approval)

This section is a **proposal**, not a ruling — extends the "Built and verified" logic above with the actual
field list, Micro feature set, and Micro/SMB delta for an MVP a trades solo operator would not find overwhelming.
Grounded in `platform/dashboards/lib/customer-dashboard.mjs`/`tier-features.mjs` (read in full) and
`platform/CONTRACT.md`'s `app.form_submissions` row shape — extending what exists, not designing from scratch.

### Lead inbox field list (what a website's quote-request form must send)
This is both the dashboard's field list and, read backwards, the required data-capture contract for every
client site's quote-request form (so the Design Agent's forms and this dashboard never drift):
- `prospect_name` (required) — visitor's name
- `prospect_email` (required) — for follow-up and CRM sync
- `prospect_phone` (required — trades leads are phone-first; a lead with no phone is a weak lead in this
  business) — this is not yet a NOT NULL constraint in `platform/CONTRACT.md`'s `app.form_submissions`, flagged
  below as a build gap
- `message` (optional free text — what the customer typed, e.g. "AC not cooling, need someone today")
- `submitted_at` (system-set, not form input)
- **Proposed new, not in current code:** `service_requested` (which service from the vertical's copy-pool list
  the form was under, e.g. `ac-repair` — trivial to capture since `knowledge/pool/<vertical>.json` already has
  a stable `service.id` per service; lets the lead inbox show "AC repair" instead of a bare message string, and
  gives Micro owners the single most useful triage signal without adding UI complexity)
- **Proposed new, not in current code:** `urgency_flag` (boolean, set true only when the form is submitted from
  an emergency-tagged service page, i.e. `requires: ["emergency_24_7"]` per the copy pool) — lets the inbox sort
  or badge same-day-critical leads first, which matters more to a solo operator than any CRM feature
- System-derived, already built: `crmSyncStatus` (defaults `"pending"`), `pipelineStage` (defaults `"new"`)

Everything else current code carries (`id`) stays internal/non-shown.

### Micro feature set (deliberately minimal — solo contractor, no time for CRM complexity)
Confirms the existing `MICRO_OVERRIDES` design is close to right and proposes two small additions, no removals:
1. **Lead inbox, read-only, newest-first** (built: `buildLeadInbox`) — the single screen a Micro owner should
   need to open daily. Add the two new fields above (`service_requested`, `urgency_flag`) as inbox columns.
2. **CSV export** (built: `toCsv`) — for the owner's own spreadsheet/QuickBooks habit, no in-dashboard reporting.
3. **Email alert on new lead** (built flag: `emailAlerts`) — replaces the dashboard as the primary notification
   channel; a solo operator should not have to remember to check a dashboard.
4. **Single logo replace** (built: `singleLogoUpload`) — the one image edit worth self-service.
5. **Single phone number edit** (built: `singlePhoneNumberEdit`) — keeps the site's call-to-action correct
   without a full contact-info editor.
6. **Edit hours** (built, inherited unchanged from SMB base) — matters for emergency-vertical accuracy
   (a wrong "closed" state costs a lead), low-complexity, keep as-is.
7. **Proposed new:** a single **"Mark as contacted" one-tap action** on a lead row — not the full new/contacted/
   converted pipeline (that's SMB), just a boolean "I called this back" checkbox with no stage machine. Solves
   the real Micro pain (forgetting which leads were already called) without building CRM. Requires a new
   boolean field, not `pipeline_stage` — deliberately not reusing the SMB pipeline column to keep the tiers'
   data models genuinely separate rather than exposing a crippled version of SMB's feature.

Everything else (notes, pipeline, multi-image, CRM config, service-description editing, testimonials, full
contact-info editing) stays off, per existing `MICRO_OVERRIDES` — this proposal does not add any of them back.

### Why Micro stops here
A solo trades operator's real workflow is: see the lead, call the lead, done. Notes and pipeline stages solve a
team-coordination problem Micro does not have (one person, no handoff). CRM config solves a systems-integration
problem Micro's plan doesn't include. Every Micro feature above maps to "get the lead" or "keep the phone number
and hours right" — nothing else.

### What current code doesn't yet support (tagged for future build)
- `service_requested` and `urgency_flag` are not columns on `app.form_submissions` in `platform/CONTRACT.md`,
  and no equivalent optional-field pattern exists yet the way `pipeline_stage`/`notes` do in
  `customer-dashboard.mjs`'s existing CONTRACT GAP comment — would need the same treatment (optional field,
  logged to `operations/TYLER_QUEUE.md`, Lane A rules on schema).
- The proposed "Mark as contacted" boolean has no field anywhere yet (not `pipeline_stage`, which is SMB-only
  and a three-state machine) — needs its own boolean column, e.g. `contacted_by_owner boolean default false`.
- No rendered UI exists for any of this — same gap already logged in "Specified, not yet built" below.

## Open questions
- Per Tyler's 2026-09-22 ruling: dashboards stay uniform within a tranche for now, not per-vertical — he may
  revisit this based on need. Tracked here as the source of truth for that open door, per the task's
  instruction.

### (a) Can all 40+ verticals use the identical dashboard?
Real answer, not a guess: **yes for the dashboard as currently scoped.** The dashboard's entire surface area —
lead inbox, CSV export, email alerts, and (SMB) notes/pipeline/CRM config — operates on `app.form_submissions`
and `app.crm_integrations` rows, neither of which has a single vertical-specific field anywhere in
`platform/CONTRACT.md`. A lead is a lead: name, email, phone, message, timestamp, sync status, whether someone
called back. That's identical whether the business is HVAC or a security/alarm-monitoring company. The one
place a "fundamentally different vertical" argument could bite is **urgency/safety framing** — a security or
life-safety service (e.g. alarm monitoring, gas leak response) might want urgency badging or escalation that a
routine trade (landscaping) doesn't need. The proposed `urgency_flag` field above already generalizes this: it's
driven by the copy pool's existing `requires: ["emergency_24_7"]` tag, which is vertical-agnostic and already
used by HVAC/plumbing/electrical for exactly this purpose. So the answer holds: lead-inbox-plus-pipeline is
genuinely universal at the current MVP scope; nothing found in the four built verticals' data shape requires a
different dashboard per vertical.

### (b) Can all verticals share the same basic website feature set?
Real answer from reading `knowledge/pool/`'s actual files: **yes, structurally.** All four built vertical files
(`hvac.json`, `plumbing.json`, `electrical.json`, `roofing.json`) share byte-identical top-level structure:
`vertical`, `version`, `status`, `note`, `services[]`, and every service object has the same field set
(`id`, `name`, `symptoms`, `headlines`, `heroSub`, `blurb`, `directAnswer`, `process`, `faq`, `facts`, optional
`requires`). Six services per vertical in every file. Nothing in the STRUCTURE varies by vertical — only the
copy content does, exactly as `knowledge/pool/README.md` describes the pool's purpose (reusable copy, one schema
per service, vertical only changes which words fill it). Quote-request form, service pages, service-area pages,
and trust signals (the `facts` array, gated by the same `requires` flags — `warranty`, `same_day`, `license`,
etc. — across all four files) are all vertical-agnostic mechanisms. The one caveat: this is confirmed only for
the 4 built verticals (residential trades). Whether a structurally different category — e.g. a
license-regulated inspection service with a multi-step form, or a subscription/monitoring service with no
single "quote request" — would still fit this same one-form-plus-service-pages shape is **not yet tested**,
since no vertical outside the 4 built ones has a copy-pool file to check against. Flagging that as the actual
open edge, not asserting it's fine for all 40+ sight unseen.
