---
title: Client Offboarding System
purpose: Authoritative spec and build checklist for the Offboard tier's data export/handoff and cancellation flow. Superseded/absorbed from onboarding/SPEC-12-customer-lifecycle.md (System 12) and platform/SPEC-03-hosting-infrastructure.md's Offboard export override.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Client Offboarding System

Handles a customer leaving Fornax two ways: an Offboard-tier one-time purchase where the customer takes their
domain and site files with no ongoing support (per `CLAUDE.md`: "Never hand over code, DNS or hosting under
Managed. Never delete"), and a Managed-tier cancellation, which triggers the retention/deletion timeline. No
dedicated Offboarding spec file exists — its content lives inside System 12 (customer lifecycle) and System 03
(hosting, "after conversion a site runs on our hosting or the client's — Offboard export").


**Code lives at:** `platform/retention/`, `platform/dashboards/`, `platform/hosting/`

## Built and verified
- [x] Cancelled-customer data retention timeline (90 days then delete) — `platform/db/migrations/0005_retention.sql`
  (`admin.purge_expired_data` scheduled purge job) + `platform/retention/retention.mjs`. Numbers match
  `legal/SPEC-11-compliance-security.md` Section 1 exactly. JS unit tests: `node --test
  platform/retention/retention.test.mjs` — 7/7 pass live. **Caveat:** the SQL migration itself was not run live
  in this sandbox (`shmget: Operation not permitted`, Postgres cannot start here); syntax reviewed by hand only,
  per `operations/BUILD_TASKS.md` §8. Treat the SQL side as written-not-proven until run on a real machine.
- [x] Deletion-request workflow (customer-initiated data deletion, 45-day SLA) — same migration file:
  `admin.request_deletion` / `admin.fulfill_deletion_request`, logged to `admin.deletion_requests`, with an
  SLA-overdue alert hook (`admin.overdue_deletion_requests`). Same live-run caveat as above.

## Blocking dependency (Tyler, 2026-09-22)
Neither Client Onboarding nor Client Offboarding should be built out further until the customer dashboard and
hosting specs for BOTH paths are exact: what a Managed customer's dashboard/hosting setup looks like, and
separately what an Offboard customer walks away with. Building onboarding/offboarding logic ahead of those specs
being nailed down risks building the wrong handoff shape twice.

## RULED (Tyler, 2026-09-22): offboarding is viable
Phone/voicemail/call-routing is Managed-only, never Offboard-eligible — confirmed. Edge cases and client-
experience recovery on the phone side are handled personally by Tyler, manually, not automated (his own
day-job experience in client relations covers this). With phone off the table for Offboard customers, what's
left to hand off is a static site + exported lead data + a DNS pointer change — genuinely simple. **Offboarding
is viable as a low-commitment entry-tier product**, exactly as originally intended: something to sell to
prospects who'd never buy Managed at all.

Still blocked on the dependency above (exact dashboard/hosting specs for both paths) before building the actual
handoff mechanics — but the viability question itself is closed, not open anymore.

## Specified, not yet built
- [ ] Offboard export mechanics — handing the customer their domain and static site files with no ongoing
  support (D04: "Offboard replaces Ownership"). No code found under any folder implementing an export/handoff
  flow; `platform/hosting/` (built on mocks, 31/31 tests) covers deploy/DNS/R2 for *our* hosting, not an export
  path off of it.
- [ ] Offboard tier's data export/handoff UI or API — not found in `platform/dashboards/` or `platform/hosting/`
- [ ] Cancellation flow (customer-initiated, Managed tier): "cancel anytime (access through end of month)" per
  `billing/SPEC-08-payments-billing.md` Section 2 — no cancellation-specific code found; Stripe subscription
  cancellation itself would come from a real Stripe account, which does not exist yet
  (`operations/BUILD_TASKS.md` §5, §10)
- [ ] Annual-plan cancellation (non-refundable, immediate access stop, no proration) — `billing/SPEC-08` Section 7
  specifies this distinct policy from monthly cancellation; not found built anywhere
- [ ] GDPR/CCPA-style data export (JSON, encrypted email delivery, 24hr link expiry, fulfilled within 7 days)
  per `legal/SPEC-11-compliance-security.md` Section 4 — not found built; distinct from the deletion-request
  workflow above (export vs. delete)
- [ ] Refund handling on offboard/cancellation (30-day pro-rata, exceptions for billing error or 24+hr outage)
  per `billing/SPEC-08` Section 4 — not found built; billing's 42/42 tests cover webhooks and dunning, not
  refund logic specifically (not confirmed either way by reading test files in this pass — flagging as
  unconfirmed rather than built)

## Possible future specs (not built, not committed to)
- Automated "take your files" self-service export button in the customer dashboard, vs. a manual Tyler-assisted
  handoff at this stage of the business (15-20 hrs/week solo operator) — not decided

## Open questions
- Whether Offboard's file handoff is meant to be fully self-service from day one or Tyler-assisted manually
  while volume is low — not ruled on anywhere found in DECISIONS.md or RECONCILIATION_LOG.md.
- Whether the retention SQL migration (0005_retention.sql) has been run and verified on Tyler's own machine
  since BUILD_TASKS.md flagged it as unproven — no later BUILD_TASKS.md or COORDINATOR_STATE.md entry confirms
  this happened; treat as still open.
