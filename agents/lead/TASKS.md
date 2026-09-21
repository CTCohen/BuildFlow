---
title: Lead Engine Tasks
purpose: Status, run instructions, assumptions and open questions for Lane C (lead scoring, lookup, outreach, send workflow)
status: active
owner: c.t.cohen
updated: '2026-09-20'
version: 1.0.0
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
| 6 | Evals (all pass) | Done: scoring 18, size 17, lookup 16, outreach+send 38 | `evals/` |

## Assumptions to confirm (I chose, spec is silent)
1. **Size tiers** come from `docs/PRICING.md`: Micro <3, SMB 3-20, Mid-Market >20 or >$5M revenue. SPEC-07 targets 1-50 employees, so 21-50 still earns the size points but the lead is suppressed as Mid-Market.
2. **"Headcount aligns" (+10)** = 1-20 (the two sellable tiers).
3. **Touch 5 is an email on day 21** (per the lane brief). SPEC-07 words day 21 as "mark contacted/no response"; both fit, sequence completes after touch 5.
4. **Touch 2 is skipped if touch 1 was opened** (spec: "re-send if no open").
5. **Calendar days, not business days** for the 0/3/7/14/21 offsets, so weekends can get sends. Say if you want weekends skipped.
6. **Bounce rate >=5% also pauses** (spec sets the target at <5% but only names spam for pause). Rates are ignored below 20 sends. Complaint rate >=0.1% raises an alert.
7. Unsubscribe token is HMAC-SHA256 of lead_id with a secret; the URL host is a placeholder.
8. Local time zones: AZ Phoenix (no DST), CA Pacific, TX Central, FL/NY Eastern; unknown state defaults to Eastern.

## Blocked on / needs Tyler
- **Approve the outreach copy** (`messaging/outreach_sequence_draft.json`, `meta.status` is `draft`). The engine refuses any non-mock sender until it says `approved`.
- **Postal address** for the email footer (CAN-SPAM). The engine refuses to run without one.
- **Later:** Apollo, Hunter and SendGrid keys in his `.env`; a warmed sender domain.
- Real provider clients are not written; they only need to implement `search(query)`.

## Not done / next
- `platform/CONTRACT.md` (Lane A) did not exist yet. Leads here are plain dicts; when the Lead/Prospect shapes land, add a thin adapter.
- Persistence: state is in memory. Storage arrives with the Supabase schema.
- Calibration needs real outcomes; the function is tested only for shape.
- Lookup fixtures are small and hand-made (6 businesses). Real-world name matching will need tuning once recorded live responses exist.
- Score note for the 50-69 band (LLM, ~$0.003) deliberately not built: API is out of scope.
