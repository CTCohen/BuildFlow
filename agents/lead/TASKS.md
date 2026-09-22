---
title: Lead Engine Tasks
purpose: Status, run instructions, assumptions and open questions for Lane C (lead scoring, lookup, outreach, send workflow)
status: active
owner: c.t.cohen
updated: '2026-09-21'
version: 1.1.0
tier_scope: all
phase: phase_1
related: [operations/lanes/LANE-C-lead.md, outreach/SPEC-07-lead-to-customer-pipeline.md, agents/AGENT_REGISTRY.md]
---

# Lane C tasks

Run everything: `python3 -m agents.lead.run_evals` (stdlib only, tested on Python 3.14; no keys, no network, no LLM).

| # | Task | Status | Where |
|---|---|---|---|
| 1 | Lead Scoring, 100-point model, thresholds 70/50/20, tiers, Mid-Market suppression, per-vertical calibration | Done | `scoring.py` |
| 2 | Lead Lookup, fan-out to mock Apollo/Hunter/Places, merge by confidence, manual flag | Done | `lookup.py`, `fixtures/` |
| 3 | Size classification from free signals | Done | `size.py` |
| 4 | 5-touch templates, hook chosen from signals | Done, copy is DRAFT | `sequence.py`, `messaging/outreach_sequence_draft.json` |
| 5 | Send and sequence workflow on a mock SendGrid | Done | `send.py` |
| 6 | Evals (all pass) | Done: scoring 18, size 17, lookup 16, outreach+send 40, adapter 8 (99 total) | `evals/` |
| 7 | Adapter: plain-dict lead/prospect shapes → `platform/CONTRACT.md` tables | Done | `adapter.py` |

## Assumptions to confirm (I chose, spec is silent)
1. **Size tiers** come from `docs/PRICING.md`: Micro <3, SMB 3-20, Mid-Market >20 or >$5M revenue. SPEC-07 targets 1-50 employees, so 21-50 still earns the size points but the lead is suppressed as Mid-Market.
2. **"Headcount aligns" (+10)** = 1-20 (the two sellable tiers).
3. **Touch 5 is an email on day 21** (per the lane brief). SPEC-07 words day 21 as "mark contacted/no response"; both fit, sequence completes after touch 5.
4. **Touch 2 is skipped if touch 1 was opened** (spec: "re-send if no open").
5. **Calendar days, not business days** for the 0/3/7/14/21 offsets, so weekends can get sends. Say if you want weekends skipped.
6. **Bounce rate >=5% also pauses** (spec sets the target at <5% but only names spam for pause). Rates are ignored below 20 sends. Complaint rate >=0.1% raises an alert.
7. Unsubscribe token is HMAC-SHA256 of lead_id with a secret; the URL host is a placeholder.
8. Local time zones: AZ Phoenix (no DST), CA Pacific, TX Central, FL/NY Eastern; unknown state defaults to Eastern.

## Ruled 2026-09-21 (see TYLER_QUEUE.md "Ruled tonight")
- **D01 sender address = `hello@`** — `send.Campaign` now takes `sender_email` (default
  `hello@fornax.example`, matching the existing `.example` placeholder pattern used for
  `base_url` since the real domain (D32) isn't settled) and stamps it as `msg["from"]` on every
  send. Covered by `evals/test_outreach_send.py::SendWorkflow::test_c08_sender_is_hello_by_default`
  and `test_c09_sender_email_configurable`.
- **D29 Mid-Market leads: capture in warehouse, no outreach, nothing built yet** — this was already
  this lane's default (`scoring.py`'s `suppressed` flag, `send.py`'s `enroll()` refusing suppressed
  leads). The new `adapter.py` makes the "capture" half concrete: a suppressed lead still gets a
  `to_lead_warehouse_row()` and `to_lead_row()` (status `"suppressed"`, `assigned_tier` null), but
  `to_prospect_row()` raises `ValueError` if called on one — so nothing downstream can accidentally
  build a demo or enroll it in outreach. No real warehouse write yet (no live Supabase project per
  `operations/BUILD_TASKS.md` §1); this is the shape Lane A's service layer inserts once it exists.

## Blocked on / needs Tyler
- **Approve the outreach copy** (`messaging/outreach_sequence_draft.json`, `meta.status` is `draft`). The engine refuses any non-mock sender until it says `approved`.
- **Postal address** for the email footer (CAN-SPAM). The engine refuses to run without one.
- **Later:** Apollo, Hunter and SendGrid keys in his `.env`; a warmed sender domain.
- Real provider clients are not written; they only need to implement `search(query)`.

## Not done / next
- Persistence: state is in memory. Storage arrives with the Supabase schema — `adapter.py` produces
  the rows but nothing calls a DB client yet (no real Supabase project provisioned).
- Calibration needs real outcomes; the function is tested only for shape.
- Lookup fixtures are small and hand-made (6 businesses). Real-world name matching will need tuning once recorded live responses exist.
- Score note for the 50-69 band (LLM, ~$0.003) deliberately not built: API is out of scope.
- `send.py`'s `Campaign._send()` discards `self.sender.send(msg)`'s return value (the would-be
  SendGrid message id) — `adapter.to_campaign_run_row()` accepts `sendgrid_message_id` as soon as
  something upstream starts capturing it.
