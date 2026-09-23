---
title: Systems Coverage Audit
purpose: One-time coverage audit (2026-09-22) — missing systems, redundancy check across the 14 existing systems/*.md files. Feeds systems.md's table; does not replace it.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Systems Coverage Audit — 2026-09-22

Method: read every top-level folder (`platform/`, `billing/`, `crm/`, `agents/`, `knowledge/`, `legal/`,
`website/`, `operations/`, `app/`), every `SPEC-NN-*.md` file (`find . -iname "SPEC-*.md"`, 17 files, SPEC-02
through SPEC-19 with some numbers absorbed already), and all 14 `systems/*.md` files, then cross-checked each
old SPEC's content against whether a `systems/*.md` file already absorbs it.

## Missing systems (real business capability, no `systems/*.md` file yet)

### 1. Customer Support
**Why missing:** `operations/SPEC-14-customer-support.md` (System 14 in the old numbering) exists and is
`status: active`, but nothing in `systems/` covers it. A grep across all 14 existing system files for "support
ticket", "help center", "knowledge base", "SLA" only turns up two incidental hits — `systems/compliance_system.md`'s
deletion-request SLA and `systems/offboarding_system.md`'s same SLA reference — neither is a real description of a
support/ticketing system. This is a genuine gap: support triage, severity levels (P0-P3), help center/KB
structure, and the support→product feedback loop have no home.
**What it should absorb:** all of `operations/SPEC-14-customer-support.md` — support workflow and triage,
severity levels, help-center/KB structure, internal troubleshooting guides, the automated triage layer. Note
the published-vs-internal SLA override already ruled by Tyler (2026-09-18): 24-48hr public promise, P0-P3
targets are internal only. Also cross-references `operations/LOOPS.md` L13 "Support triage" (inbound email →
classify/KB-reply/queue, P0/P1 always to Tyler) — that loop already exists and should be linked, not
re-described, once the system file is drafted.

### 2. Customer Feedback & Iteration
**Why missing:** `operations/SPEC-15-customer-feedback.md` (System 15) exists, `status: active`, but no
`systems/*.md` file covers it. The only related hit is a single unbuilt checkbox in `systems/admin_dashboard_system.md`
("Agent QA & feedback loop dashboard card... not found") — that's an admin-dashboard feature referencing
feedback data, not a description of the feedback capture/triage/roadmap system itself.
**What it should absorb:** all of `operations/SPEC-15-customer-feedback.md` — feedback capture and sources
(support tickets, in-app form, NPS/quarterly surveys, usage data, direct outreach, competitor monitoring),
triage/categorization, impact×effort prioritization scoring, roadmap format, release planning/cadence, and
shipped-feature impact metrics.

### 3. SEO / AI-Visibility
**Why missing:** `knowledge/SPEC-16-seo-geo.md` (System 16) exists, `status: active`, with a real Tyler override
(2026-09-18) on scope by layer. The only hit in `systems/` is one unbuilt checkbox inside
`systems/design_mid_market_system.md` mentioning "Core Web Vitals" as part of a paused-tier QA gate — that's a design
QA line item, not a description of the SEO/AI-visibility system's three layers.
**What it should absorb:** all of `knowledge/SPEC-16-seo-geo.md` — Layer 1 (design defaults: schema, meta
tags, Core Web Vitals, `llms.txt`, answer-structured FAQ — applies to every tier per Tyler's override), Layer 2
(dynamic per-customer optimization, SMB only per the override), Layer 3 (ranking monitoring and
auto-optimization triggers, deferred until revenue per the override). Note: per the override, "GEO" here means
geographic targeting, not generative-engine-optimization — the file name should make that unambiguous
(suggested: `systems/seo_ai_visibility_system.md`, since the AI-answer-optimization half lives in Layer 1).

### 4. Experimentation
**Why missing:** `operations/SPEC-17-experimentation.md` (System 17) exists, `status: active`, with a Tyler
override marking it explicitly post-launch. A grep for "A/B test" or "experiment" across all 14 existing
system files returns zero hits — no existing file touches this at all, not even incidentally.
**What it should absorb:** all of `operations/SPEC-17-experimentation.md` — A/B test framework and hypothesis
structure, outbound campaign testing (email variants first, per the override, Month 1 post-launch), pricing/
offer testing (waits until after the price increase is decided, per the override), feature/onboarding testing,
testing checklist/governance, cadence and tooling. Since this is explicitly post-launch and not yet started,
the drafted system file should carry mostly "Specified, not yet built" and "Open questions" content, near-empty
"Built and verified".

**Not missing — checked and already covered:** SPEC-02 (Platform Architecture) is split across
`systems/hosting_system.md`/`admin-dashboard.md`/others' "Code lives at" sections rather than one system, which is
correct per the granularity rule (platform architecture is a code-organization concern, not a customer-facing
system). SPEC-06 (Demo→Customer), SPEC-07 (Lead pipeline), SPEC-08 (Billing), SPEC-09/10 (CRM), SPEC-11
(Compliance/Security), SPEC-12 (Customer Lifecycle), SPEC-13 (Observability), SPEC-18 (Admin/CRM Ops), SPEC-19
(Website), SPEC-03/04 (Hosting/Design Quality) all map cleanly onto existing drafted systems files (outbound,
billing, admin-dashboard, compliance, onboarding, design-*, marketing-site, hosting). SPEC-13 (Observability)
is the one partial exception: it's referenced piecemeal inside `systems/hosting_system.md` and `systems/compliance_system.md`
rather than having its own row, but it's infrastructure-facing (logging/alerting/cost-alerts, not a
customer-facing unit with its own lifecycle) — under the granularity rule this correctly stays as detail inside
Hosting/Compliance rather than becoming its own system. Not flagged as missing.

## Redundancies found across the 14 existing `systems/*.md` files

**None found that amount to real redundancy.** Checked every pairwise combination where two files' code paths
or subject matter obviously overlap:
- **Outbound ↔ Admin Dashboard** (both touch outbound pacing/CRM funnel) — expected touch point, not
  redundancy: Admin Dashboard controls pacing/views it, Outbound executes it. Confirmed by reading both files
  in full; neither restates the other's build detail, each references the other by file path only.
- **Dashboard-Micro ↔ Dashboard-SMB** (share the same `platform/dashboards/lib/` code, same functions) — this
  is the one place duplication risk was real, and Tyler's own dashboard-uniformity ruling plus this task's
  Task 2 pass addressed it directly: each file's new "Exact differences from ___" section now defers to the
  *other* file rather than re-stating the comparison twice (`dashboard-smb.md` explicitly says "see
  `dashboard-micro.md` ... not duplicated here to avoid drift").
- **Compliance ↔ Offboarding** (both reference the 45-day deletion SLA and `platform/retention/`) — expected
  touch point: Offboarding triggers the deletion workflow that Compliance's file specs out; each references the
  same migration file by path rather than re-describing the retention logic.
- **Onboarding ↔ Billing** (`billing/webhooks.py` appears in Onboarding's code list) — expected touch point:
  Stripe payment confirmation is the trigger Onboarding starts from; Billing owns the webhook/payment logic
  itself.
- **Design-Micro ↔ Design-SMB ↔ Design-Mid-Market** — all reference `agents/design/`, but each file describes a
  distinct tier's actual design philosophy/constraints (locked layout vs. curated choices vs. paused), not the
  same content twice.

No two files were found to fully describe the same capability. The task's own example (Outbound/Admin Dashboard
"outbound pacing") was the only pattern that looked risky on a first pass, and it checked out as an expected
touch point, not redundancy, on full read.

## Changes made to `systems.md`
Added four new table rows for the systems identified above, each marked `identified, not yet drafted` and
pointing at a not-yet-created filename (`systems/support.md`, `systems/feedback.md`,
`systems/seo_ai_visibility_system.md`, `systems/experimentation_system.md`). Per this task's scope, the full file content for
these four is **not** written here — that's separate follow-up work, tracked by their table row's status.
