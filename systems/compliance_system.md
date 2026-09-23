---
title: Compliance & Data Retention System
purpose: Authoritative spec and build checklist for GDPR/CCPA compliance, data retention/deletion, and the legal document drafts. Superseded/absorbed from legal/SPEC-11-compliance-security.md (System 11).
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Compliance & Data Retention System

Two distinct halves that must not be conflated: (1) built, tested **code** for data retention/deletion
workflows (`platform/retention/`), and (2) **drafted legal documents** (Terms, Privacy, Security Statement)
that are written but explicitly still need lawyer review before the first real charge, per
`legal/SPEC-11-compliance-security.md`'s own override note. Neither is "done" in the same sense.


**Code lives at:** `platform/retention/` (code); `legal/` (draft legal documents, out of scope for this session's edits)

## Built and verified
- [x] Data retention/deletion workflows — `platform/db/migrations/0005_retention.sql` (scheduled purge job
  `admin.purge_expired_data`; deletion-request workflow `admin.request_deletion`/
  `admin.fulfill_deletion_request`, logged to `admin.deletion_requests`; SLA-overdue alert hook
  `admin.overdue_deletion_requests`) + JS runner `platform/retention/retention.mjs`. Numbers match
  `legal/SPEC-11-compliance-security.md` Section 1 exactly: cancelled customer 90 days, unconverted lead 12
  months, `crm_sync_log` 90 days, `crm_conflict_log` 30 days, deletion-on-request fulfilled within 45 days.
  JS unit tests: `node --test platform/retention/retention.test.mjs` — **7/7 pass live.**
- [x] Three genuine spec ambiguities on exact deletion mechanics were found and logged to
  `operations/TYLER_QUEUE.md` under "Retention/deletion — open questions" rather than guessed into the
  migration.

**Caveat that applies to the item above:** the SQL migration itself was **not run live** — this sandbox cannot
start local Postgres (`shmget: Operation not permitted`, same limitation as the Foundation isolation test).
Syntax was reviewed by hand (balanced parens/`$$` pairs, functions matching grant/revoke signatures) but not
executed. `operations/BUILD_TASKS.md` §8 states explicitly: "Someone should run `platform/db/run-local.sh` on a
real machine... before this is trusted as proven, not just written." No later BUILD_TASKS.md or
COORDINATOR_STATE.md entry found confirming that run happened — treat the SQL side as written-not-proven.

## Specified, not yet built
- [ ] Terms of Service, Privacy Policy lawyer review [credential/decision: T1, lawyer chosen by Tyler] — drafts
  exist (`legal/TERMS_OF_SERVICE.md`, `legal/PRIVACY_POLICY.md`) but are **not built code**; they are legal
  text pending counsel sign-off before the first charge, per the spec's own override
- [ ] Security Statement finalized [depends: lawyer review] — draft exists (`legal/SECURITY_STATEMENT.md`),
  same pending-review status
- [ ] WCAG 2.1 AA compliance gate — the design QA loop this depends on is itself only partial
  (`operations/BUILD_TASKS.md` §3: "Design QA loop... ◐ partial"), so this compliance gate is not fully proven
  end to end yet, even though it's referenced as "built into Design System"
- [ ] Authentication (Supabase Auth: Google + email/password, optional TOTP) — blocked on a real Google OAuth
  client [credential, `operations/BUILD_TASKS.md` §1]
- [ ] Data isolation enforcement beyond RLS policies already written — RLS policies exist and the isolation
  test was confirmed run and passing by Tyler 2026-09-21 (`operations/BUILD_TASKS.md` §1: "RLS isolation test
  actually run and confirmed"), but this is Foundation's item, not this system's; noting it here only as the
  dependency this compliance system relies on for Section 4's data-isolation requirement
- [ ] Incident response tooling/runbook automation (breach classification, 72-hour notification workflow) — no
  code found; Section 5 of the spec is a documented process, not automated
- [ ] SOC 2 Type II — explicitly deferred to Phase 2 per the spec's own locked timeline (10-50 customers,
  $3-5K ARR), correctly not a Phase 1 item

## Possible future specs (not built, not committed to)
- GDPR-specific tooling (DPA, EU data subject rights, 72-hour breach notification) — explicitly deferred to
  Phase 2+ if EU customers, per the spec (Phase 1 is US-only)
- Cyber liability / E&O insurance — spec explicitly says "skip Phase 1 (too small), consider Phase 2 at $100K+
  ARR"

## Open questions
- Three ambiguities on deletion mechanics logged to `operations/TYLER_QUEUE.md` (not reproduced in full here —
  see that file's "Retention/deletion — open questions" section for the exact list) remain unresolved as of
  this pass.
- Whether `platform/db/run-local.sh` has since been run on a real machine to confirm the retention SQL — not
  found confirmed anywhere; flagging as still open per the caveat above.
