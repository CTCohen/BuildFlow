---
title: Customer Feedback & Iteration System
purpose: Authoritative spec and build checklist for feedback capture, triage, prioritization, and release planning. Absorbs systems/15-customer-feedback-iteration-system.md from the original 19-system export.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Customer Feedback & Iteration System

Handles how customer feedback flows into product decisions and how Fornax ships improvements. Identified as a
real gap in `systems/AUDIT.md` (2026-09-22) — the old `operations/SPEC-15-customer-feedback.md` spec exists and
is active, but no `systems/*.md` file previously covered it beyond one unbuilt dashboard-card checkbox
referencing it. Nothing has been built: no feedback-capture, triage, or roadmap code exists anywhere in the
repo (checked `operations/BUILD_TASKS.md` and `operations/COORDINATOR_STATE.md` — neither lists this as
started).

**Code lives at:** nothing yet. Spec source: `operations/SPEC-15-customer-feedback.md` (copy of the original
export, unchanged).

## Built and verified
(none — no feedback-system code exists in this repo)

## Specified, not yet built
- [ ] Feedback capture sources: support tickets, in-app "Send feedback" form, NPS + quarterly surveys, implicit
  usage data, direct outreach, competitor monitoring.
- [ ] Categorization: Bugs (P0-P3), Feature requests (must-have/nice-to-have/future), Improvements (impact
  tier), Questions/Confusion (UX/doc-gap signal), Compliments.
- [ ] Tyler's monthly triage workflow (read → categorize → dedupe → estimate effort/value → prioritize top 3-5
  → communicate back) and its storage (GitHub issues/Notion/Airtable — not chosen yet).
- [ ] Impact(1-5) × Effort(1-5) prioritization scoring model, with strategic-importance/time-sensitivity/risk
  tiebreakers.
- [ ] Rolling 90-day roadmap format (Now 0-30d / Next 30-90d / Later 90+d / Backlog).
- [ ] Release planning: cadence (ship-when-ready, min monthly/max weekly), major/minor/patch composition,
  release-notes format, future beta-testing cohort (10% opt-in).
- [ ] Shipped-feature impact metrics: adoption (>50% of relevant customers target), engagement, retention
  impact, business impact — with a Week1/Week2-4/Month1/Month3/Month6 evaluation timeline and a Keep/Iterate/
  Kill decision framework.
- [ ] Automated capture & triage layer (Feedback Triage Agent, Agent Registry #11): classify category/
  sentiment, dedupe against open items (increments vote count on match), create new entries for Tyler's
  monthly scoring pass. Scope boundary already decided in the original spec: the agent does capture+dedup
  only, never auto-scores business priority — that stays Tyler's call.

## Possible future specs (not built, not committed to)
- Public-facing changelog/release-notes page
- Automated NPS survey scheduling and response aggregation

## Open questions
- No feedback-storage tool (GitHub issues vs. Notion vs. Airtable) has been chosen — a prerequisite decision
  before any capture tooling can be built.
- This system's automated triage layer is explicitly meant to receive forwarded "feature request" items from
  the Customer Support system's triage agent (`systems/customer_support_system.md`) — both are unbuilt, so this
  hand-off is untested and worth building together rather than independently.
