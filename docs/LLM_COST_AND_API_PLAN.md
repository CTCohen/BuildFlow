---
title: LLM Cost and API Plan
purpose: Every place Fornax could call a model API, whether it needs one, what it costs per use and per customer, how it can be abused, and how to avoid or cap it
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
critical_path: true
related: [agents/AGENT_REGISTRY.md, docs/tech-stack.md, RECONCILIATION_LOG.md, metrics/token-log.md]
---

# LLM cost and API plan

**Ruling (Tyler, 2026-09-18):** deterministic code first; Claude Pro for build and operator work; **Claude API only for unattended real-time steps, capped at $30/mo before first revenue** (revisit after the first $500 MRR). Estimates below are mine and must be measured; log real numbers in `metrics/token-log.md`.

## Rate card (verified 2026-09-18, platform.claude.com pricing)
| Model | Input / output per MTok | Batch (50% off) | Cache read |
|---|---|---|---|
| Claude Sonnet 5 | $2 / $10 | $1 / $5 | 0.1x input |
| Claude Haiku 4.5 | $1 / $5 | $0.50 / $2.50 | 0.1x input |
| Claude Opus 5 | $5 / $25 | $2.50 / $12.50 | 0.1x input |
Claude 4.7+ tokenizers emit about 30% more tokens for the same text. Cloudflare Workers AI: 10,000 free neurons per day, then $0.011 per 1,000; Llama 3.1 8B about $0.045 in / $0.384 out per MTok; embeddings about $0.012-0.02 per MTok; Llama 3.2 11B Vision about $0.049 / $0.676.
Sonnet 5 on batch costs the same as Haiku 4.5 at standard rates. **Pro terms:** `claude -p` and the Agent SDK work with a Pro login but Anthropic frames it as individual experimentation and automation; production automation should use API keys. Sources disagree on a paused June 15 billing change; re-check at setup. `--bare` mode ignores the subscription login.

## Three lanes
- **A. No LLM:** deterministic code. All event-triggered fulfillment, sync, dunning, scoring and templating.
- **B. Pro lane:** build-time and low-volume operator work on Tyler's plan (scheduled `claude -p` or attended sessions).
- **C. Capped API key:** only when a step is real-time and customer- or prospect-triggered, or batch volume exceeds Lane B. Per-agent monthly cap; batch and prompt caching wherever the step is asynchronous.

## Guardrails on every LLM call
Per-agent monthly cap and a kill switch · tokens and dollars logged on `AgentRun` and in `metrics/token-log.md` · max-token limit per call · LLM output never triggers an irreversible action on its own · Turnstile plus per-IP and per-sender caps on public entry points · untrusted text (crawled sites, emails, form messages, reviews) is data, never instructions.

## A. System-scheduled and internal
| Action | Best fit | Cost per use | Per customer / mo | Abuse risk and control |
|---|---|---|---|---|
| Lead lookup and merge; business-size classification; lead score | No LLM | $0 | $0 | None (internal) |
| Score note for the 50-69 band | Workers AI or Haiku | ~$0.003 x 15% of leads | $0 | None |
| Brand extraction from a prospect site | Parse CSS/DOM; Workers AI for tone | ~$0.0004 | $0 | Prospect pages can carry prompt injection: extract to structured fields only; block internal IPs (SSRF) |
| Design copy | Reused copy pool; Sonnet 5 batch for new blocks | ~$0.0105 per new block, ~$0.002 per prospect | $0 | None |
| QA checks | No LLM (Lighthouse, axe) | $0 | $0 | None |
| QA rubric | Pro lane, ~5% sample | ~$0.011 x 5% | $0 | None |
| Outreach touch-1 hook | Workers AI or signal-based template | ~$0.0003 | $0 | None |
| Outreach touches 2-5, sequencing, unsubscribe | No LLM (spec templates, deterministic) | $0 | $0 | Unsubscribe must be deterministic (CAN-SPAM) |
| Review sync, CRM push, churn score, health checks, experiment math | No LLM | $0 | $0 | None |
| Dunning state machine, back-payment math, dunning and onboarding emails, monthly report | No LLM (templates) | $0 | $0 | None |
| Demand letter (Tier 4) | No LLM; attorney template | $0 | $0 | An LLM-written legal letter is a liability |
**Per prospect total about $0.004; per acquired customer about $0.13** ($0.08-0.20 at 5%-2% conversion). Naive "LLM everywhere" is about $0.14 per prospect.

## B. Paying customer (authenticated)
| Action | Best fit | Cost per use | Per customer / mo | Abuse risk and control |
|---|---|---|---|---|
| Payment to live, edit to regenerate, inbox, notes, pipeline | No LLM | $0 | $0 | Edit spam is compute, not tokens: rate-limit edits |
| Support email triage | Rules + embeddings first; Haiku or Workers AI otherwise | ~$0.004-0.0065 | ~$0.002 (0.3 tickets) | Email floods: auto-reply only to registered addresses, cap tokens per ticket and tickets per sender per day |
| In-app feedback classify and dedup | Embeddings | ~$0.0002 | ~$0 | Rate-limit per customer |
| Photo alt text | Required caption field; AI only as a suggestion | $0.00013 (Workers AI vision) to $0.002 (Haiku) | ~$0.001 once | Upload floods: per-tier image cap |
| SEO suggestions (Layer 2) | Trigger-only, Sonnet 5 batch | ~$0.01 x 10% of sites | ~$0.001 | Only on a rank drop, and Tyler approves each |
| Spanish translation (opt-in) | Sonnet 5 batch | ~$0.03 once | one-time | Cache; cap regeneration |
| "AI rewrite my text" (future) | Claude API | ~$0.0028 | <= $0.06 with a 20/mo cap | **High if uncapped:** 1,000 uses/day is about $84/mo from one customer. Hard monthly cap per tier |

## C. Public visitor or prospect (unauthenticated, abuse-prone)
| Action | Best fit | Cost per use | Per customer / mo | Abuse risk and control |
|---|---|---|---|---|
| Demo page view | No LLM (static) | ~$0 | $0 | Bots cost bandwidth, not tokens: Cloudflare WAF, non-guessable token URLs |
| Contact-form submission | No LLM | $0 | $0 | Spam floods email, SMS and CRM push: Turnstile plus honeypot (the spec has no spam filtering in Phase 1; add it) |
| Optional spam classifier | Workers AI, after Turnstile | ~$0.0002 | ~$0 | 1M bot posts is about $200 without Turnstile |
| **Marketing-site "build my demo" (System 19)** | Pool-only copy, queued | ~$0.004 (naive design ~$0.14) | n/a | **Highest exposure:** 100k bot requests is about $400 (naive about $14,000). Turnstile, email verification before generation, one demo per domain per day, global daily cap (Demo Generation Rate dial), no per-request LLM |
| Prospect reply intent | Workers AI | ~$0.0002 | n/a | Per-sender cap |
| Docs and help search | Client-side search (no API) | $0 | $0 | None |
| Public SEO scorecard (parked idea) | No LLM (deterministic audit) | crawl cost only | n/a | Free tool means free abuse target: per-IP limit, SSRF-safe crawler |
| Site chat widget (future) | Workers AI or fixed FAQ retrieval | ~$0.0055 Haiku / ~$0.0003 Workers AI | ~$0.55 / ~$0.03 at 100 chats | **Unbounded by design:** per-session and per-IP caps, monthly per-site cap, Turnstile, max tokens; sell as a metered add-on |

## D. Tyler-triggered (Pro lane)
Writing code, templates, specs and evals; blog and help articles; Agent Insights summary; weekly ops digest; QA calibration: $0 marginal. Eval regression runs (~300 cases): deterministic assertions first, judge on the rest, about $1.50 per full run. Photo-intake OCR and structuring (Phase 1.5): **API**, real-time, about $0.003 per photo, Tyler's account only, daily cap.

## E. Possible later (not in the specs)
Monthly per-site content refresh (~$0.015 per run; on demand or quarterly, not for every site monthly) · review-reply drafting (~$0.0013 each, cap per customer) · AI-answer visibility monitoring (~$0.6 per site per month with search calls, about $6k/mo at 10,000 customers: sample 10% or premium-only) · auto-written blog posts per customer (~$0.022 each) · AI phone receptionist (unpriced: telephony plus realtime model; separate product decision).

## Roll-up per customer
| | Recommended design |
|---|---|
| Acquisition LLM cost (one-time) | ~$0.13 |
| Ongoing LLM cost (support, triggered SEO, dunning) | ~$0.003-0.005 per month, about $30-50 per month at 10,000 customers |
| With optional features and caps | About $0.10-0.70 per month at worst, under 0.5% of a $149 plan |
| Scenario totals, recommended vs naive | 900 demos/mo $4 vs $129; 3,000 demos/mo $12 vs $429; 15,000 demos/mo $60 vs $2,145 |
Normal use never threatens margin. The exposure is anything an outsider can trigger without a cap, or any uncapped loop.

## Not yet priced
Apollo, Hunter, Google Places and Business Profile, Yelp, SendGrid, Twilio, SerpAPI or SEMrush-tier rank tracking: rates unverified; research before committing (D05, launch plan Step 2.7).
