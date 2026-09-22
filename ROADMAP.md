---
title: Fornax Weekly Roadmap
purpose: Weekly planning and execution tracking with clear goals and success metrics
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0
tier_scope: all
phase: phase_1
staleness_days: 7
related:
- CLAUDE.md
- DECISIONS.md
- phases/PHASE_1.md
---

# ROADMAP.md — Fornax

> Rebuilt 2026-09-20 as a **parallel plan**: tracks that run at the same time, not phases that wait for each other.
> Every launch step and sub-step is still listed in `LAUNCH_ROADMAP.md` (the checklist). Open conflicts: `RECONCILIATION_LOG.md`. What needs Tyler: `operations/TYLER_QUEUE.md`. How the tracks work: `operations/lanes/README.md`.

## Goal (target: soft launch ~2026-11-23)
A working platform where agents find and score prospects, generate a personalized demo site, send it, and convert paying customers automatically, with Tyler handling only decisions and sales calls. Launch scope: English only, Micro and SMB, email-only outreach, HubSpot first. **Mid-Market is paused about 12 months** (shown, not built).

## The tracks (all start early and run together)
| Track | Who | Builds | Owns | Starts | Needs first |
|---|---|---|---|---|---|
| **T1 Business and legal** | Tyler | Entity, EIN, bank, address, lawyer | none | W1 | nothing |
| **T2 Domains, email, warmup** | Tyler | Domain map, mailboxes, SendGrid, warmup | none | W1 | nothing |
| **T3 Accounts and keys** | Tyler | Cloudflare, Supabase, Google Cloud, Stripe test, Anthropic key ($30 cap), Apollo/Hunter/Places, HubSpot app, CRM partner applications, Slack, Twilio, Calendly | none | W1 | nothing |
| **T4 Decisions and approvals** | Tyler | Rulings, copy and legal approvals, logo, videos, calls | none | W1 | items in `TYLER_QUEUE.md` |
| **A Foundation** | Claude | Data contract, schema, row-level security, auth, container, monitoring | `platform/` | W1 | nothing (local database) |
| **B Design engine** | Claude | Design, Design QA and Discovery agents; 10 profiles; Micro templates | `app/`, `design/`, `agents/design/` | W1 | nothing (existing client JSON) |
| **C Lead engine** | Claude | Scoring, lookup (mocks), outreach templates, send workflow (sandbox) | `agents/lead/`, `outreach/`, `messaging/` | W1 | nothing (scoring is pure logic) |
| **D Content** | Claude (light) | Reusable copy pool; plumbing, electrical and roofing packs | `knowledge/` | W1 | nothing |
| **E Public side** | Claude (light) | Marketing site, help center, video scripts, docs | `website/`, `onboarding/` | W2 | nothing |
| **F Billing and fulfillment** | Claude | Versioned Stripe prices, webhooks, dunning state machine, payment to live in <60 s | `billing/` | W3 | A's contract and schema; Stripe test account |
| **G CRM** | Claude | HubSpot connector, 5-minute batch, retries | `crm/` | W3 | A's contract; HubSpot app |
| **H Dashboards** | Claude | Customer dashboard (SMB, then Micro), admin web, sandbox dashboard for demos | `platform/dashboards/` | W4 | A's schema; B's output format |
| **I Integration and QA** | Main session | End to end, evals, isolation, load, monitoring | root, `metrics/` | W5 | Outputs of A, B, C, F |

## What actually blocks what
- **A's data contract** (published W1) feeds C's tables, F, G and H.
- **B's output format** (stable by W3) feeds H's sandbox dashboard and F's fulfillment.
- **D's copy pool** feeds B and C, but both start on templates and swap it in later.
- **Tyler's accounts** unlock real behavior only (real database, test payments, HubSpot sandbox, real sends, deploys, legal sign-off). No Claude track waits on an account to start; each begins on mocks and a local database.

## Week by week: what runs at the same time (re-cut after W1)
Sessions = active Claude sessions (Tyler can run up to four at once).
| Week | Running in parallel (Claude) | Tyler | Sessions | Gate |
|---|---|---|---|---|
| **W1** Sep 21-27 | A: contract, schema · B: Design Agent v0, build-time benchmark · C: scoring, templates · D: copy pool skeleton | T1 entity and EIN · T2 domains, mailboxes, SendGrid, warmup · T3 Cloudflare, Supabase, Google Cloud, Stripe test | 3 + 1 light | **G0** contract published |
| **W2** Sep 28-Oct 4 | A: RLS, auth, container · B: QA loop, Discovery · C: lookup mocks, scheduler · D: HVAC and plumbing packs · E: site polish | T1 lawyer · T3 Anthropic key, Apollo/Hunter/Places, HubSpot app, partner applications | 3 + 2 light | **G1** design engine builds a site |
| **W3** Oct 5-11 | A: monitoring · B: profiles, Micro · C: send workflow, evals · D: electrical, roofing · **F starts** · **G starts** | T4 approve profiles and copy drafts | 4 | **G2** lead pipeline dry run |
| **W4** Oct 12-18 | B: evals · C: finish · F: prices, webhooks, dunning · G: HubSpot · **H starts** · E: help center | T3 Stripe test products, Slack, Twilio | 4 | **G3** lead becomes a demo record |
| **W5** Oct 19-25 | F: payment to live · G: retries · H: customer dashboard · **I starts** | T4 review demo pages | 4 | **G4** test payment gives a live site |
| **W6** Oct 26-Nov 1 | H: admin web, Micro, demo sandbox · F: annual, cohort · E: video scripts | T4 dashboard UX review | 4 | **G5** demo shows site plus dashboard |
| **W7** Nov 2-8 | I: end to end · E: site final, logo · legal drafts revised | T4 approve logo and copy | 3 | |
| **W8** Nov 9-15 | I: fixes · E: help center content | T4 record videos (4-5 hrs) | 2 | |
| **W9** Nov 16-22 | I: evals, isolation, load, WCAG sample | T1 lawyer sign-off; Stripe live only after | 2 | **G6** full dry run · **G7** legal |
| **W10** Nov 23-29 | I: watch the soft launch | T4 calls and closes with the 5 Phoenix HVAC prospects | 1 | **G8** soft launch |

## Gates (each needs visible proof)
G0 `platform/CONTRACT.md` committed and imported by other tracks · G1 a generated site per vertical and tier, plus build-time numbers · G2 sample leads scored to the spec thresholds, send dates correct, unsubscribe test · G3 a scored lead and its demo as database rows · G4 a test-mode payment ends in a live site under 60 s · G5 a demo link showing site plus tier dashboard · G6 full funnel dry run, monthly and annual, dunning tiers 1-3 · G7 counsel sign-off on Terms and Privacy · G8 the 5 prospects contacted with approved copy.

## How the parallel work stays coordinated
One branch and one folder set per track (`operations/lanes/`); only Track A changes the data contract; a weekly Friday integration day (merge in dependency order, run the manifest check, lint and evals; Tyler approves each merge); each track writes a status file when it stops; independent pieces inside a track can be fanned out to sub-agents. Constraints: at most four Claude sessions at once, Tyler's 15-20 hrs/week, and **no technical checks (Lighthouse, browser QA) are run or requested until the setup work is done**: those run on Tyler's machine in one batch at W6 or later.

## Open decisions never block a track (defaults)
D02 price timing: build versioned prices, use launch prices · D22 first CRM: HubSpot · D26: `llms.txt` and answer-structured FAQ in Layer 1 · D29 Mid-Market-size leads: suppressed · D32 domains: `.io` marketing, `.com` app/admin/demo, [domain TBD under Fornax name] customer sites · D01 sender: `hello@`.

## Out of scope
Mid-Market build, SMS outreach, Spanish sites, iOS app, customer mobile app, more verticals, paid acquisition.

## Constraints
$50/mo platform budget until the first $500 MRR; Claude API capped at $30/mo (`docs/LLM_COST_AND_API_PLAN.md`). Solo operator. One codebase, no per-client code.
