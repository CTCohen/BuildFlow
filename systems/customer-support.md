---
title: Customer Support System
purpose: Authoritative spec and build checklist for support workflow, triage, severity levels, and help-center/KB structure. Absorbs systems/14-customer-support-documentation-system.md from the original 19-system export.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Customer Support System

Handles how customer support requests get triaged, resolved, and fed back into product and help-center content.
Identified as a real gap in `systems/AUDIT.md` (2026-09-22) — the old `operations/SPEC-14-customer-support.md`
spec exists and is active, but no `systems/*.md` file previously covered it. Nothing has been built yet: no
support code path exists anywhere in the repo (checked `operations/BUILD_TASKS.md` and
`operations/COORDINATOR_STATE.md` — neither lists a support/ticketing lane as started or in progress).

**Code lives at:** nothing yet. Spec source: `operations/SPEC-14-customer-support.md` (copy of the original
export, unchanged).

## Built and verified
(none — no support code exists in this repo)

## Specified, not yet built
- [ ] Support channel: email (`support@buildflowsites.com`, primary), help-center self-serve; chat and phone
  explicitly out of scope for Phase 1.
- [ ] Severity triage (P0-P3) with response/resolve SLA targets — P0 site-down/payment-blocking/security <1hr
  respond, 24hr resolve; P1 broken feature/data-loss <4hr/48hr; P2 cosmetic/feature-request <24hr/72hr; P3
  general <72hr/1wk. **Note the published-vs-internal SLA override already ruled by Tyler (2026-09-18):** the
  public promise is 24-48hr, these P0-P3 targets are internal only — not customer-facing commitments.
- [ ] Help center / knowledge base (`help.buildflowsites.com`): Getting Started, Lead Management, CRM
  Integration, Website Performance, Billing & Account, Troubleshooting categories; full-text search, related
  articles, "was this helpful?" feedback.
- [ ] Internal troubleshooting flowcharts and incident playbooks (site down, CRM sync failing, customer not
  receiving leads, payment processor down, data breach, churn response).
- [ ] Automated triage layer (Support Triage Agent, Agent Registry #10): classify severity/category on inbound
  email, auto-reply with matching KB article for high-confidence P2/P3, route P0/P1 or low-confidence straight
  to Tyler's queue with a fail-safe default of P2+queue (never silent auto-close). Feature-request category
  auto-forwards to the Feedback system's triage agent.
- [ ] Support→product feedback loop (monthly ticket analysis by severity/category/resolution time, CSAT,
  action items feeding roadmap input).

## Possible future specs (not built, not committed to)
- Chat channel (explicitly deferred to "Phase 2" in the original spec)
- Phone support (not planned for any named phase yet)

## Open questions
- Cross-reference `operations/LOOPS.md` L13 "Support triage" (inbound email → classify/KB-reply/queue, P0/P1
  always to Tyler) — that loop is already described in LOOPS.md and should be linked once this system's build
  actually starts, not re-described here.
- No support email inbox, help-center domain, or ticketing tool has been chosen or provisioned yet — this is a
  prerequisite decision before any of the above can be built, and isn't listed anywhere else as owned.
