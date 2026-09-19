---
name: agent-registry
description: Unified catalog of every BuildFlow AI agent — purpose, pattern, model tier, inputs/outputs, retry/escalation logic, monitoring, scaling model, and 2026 eval standards. Covers all 19 systems.
sources: [chat]
aliases: [agent catalog, agent architecture, agent list, orchestration patterns]
---

# BuildFlow Agent Registry

**Purpose:** Single source of truth for every agent in the system. Built from Anthropic's "Building Effective Agents" patterns (workflows vs. agents; prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer) + 2026 production orchestration practice (triage/router, fan-out/fan-in, supervisor, pipeline patterns; mandatory retry/escalation/human-gate design), refreshed against current research (see Section D for citations).

**Core design principle:** Default to the simplest structure — a fixed-step **workflow**, not an autonomous **agent** — unless the task genuinely needs the model to decide its own path. Most of BuildFlow's "agents" are actually **workflows** (predictable, auditable, code-controlled sequences). This is validated by 2026 research: Princeton NLP found a single well-scoped agent matches or outperforms multi-agent systems on 64% of benchmarked tasks when given the same tools/context, and 40% of multi-agent pilots fail within six months of production deployment — usually from over-engineering separation that isn't needed. BuildFlow's existing separation (Lead Lookup / Lead Scoring / Outreach-Copy as three distinct agents rather than one monolith) is the exception that's justified: 2026 AI-SDR benchmarks show multi-agent architectures with separated lead-gen/qualification/outreach roles converting up to 7x higher than single-agent approaches, specifically because each step needs a different tool/judgment shape.

**Model tiering principle:** Use a cheap/fast model for extraction, classification, and formatting. Reserve a stronger model for judgment calls (scoring with nuance, design QA, customer-facing copy). Mixing tiers cuts cost significantly with no quality loss on the cheap-tier tasks.

---

## Section A: Agent Catalog

### 1. Design Agent
- **Type:** Workflow (templated generation, not open-ended)
- **Pattern:** Prompt chaining (vertical template → personalization → render)
- **Used by:** System 4 (origin), System 6 (demo generation), System 18 (photo intake auto-build), **System 12 Section 4 / System 2 Section 3 "Site Regeneration" — the customer-edit-triggered re-render is a FOURTH call site of this same agent, not a separate "Site Regeneration Agent."** All four call sites must use the identical template warehouse/logic.
- **Model tier:** Strong (design judgment, brand consistency)
- **Input:** Vertical, company name, services, colors, discovery profile (if available), styling profile selection, OR (4th call site) customer's edited fields + existing site state
- **Output:** Static HTML/CSS/JS (~50KB), ~10 sec generation time
- **Retry logic:** On QA failure (see Design QA Agent below), re-render with corrective prompt; max 2 retries before Tyler escalation
- **Eval metrics (2026 standard — see Section D):** task completion rate (renders passing QA first-try), human override rate (Tyler manual-fixes per 100 renders), cost-per-success, first-pass QA rate, generation latency
- **Monitoring:** First-pass QA rate, generation latency, template usage distribution

### 2. Design Discovery Agent
- **Type:** Workflow (crawl → extract → structure)
- **Pattern:** Prompt chaining (crawl pages → extract brand elements → output JSON profile)
- **Used by:** System 4, feeds Design Agent
- **Model tier:** Medium (extraction + light classification)
- **Input:** Customer's existing website URL
- **Output:** Brand profile JSON (logo, colors, fonts, tone, layout patterns, features)
- **Retry logic:** If crawl fails (site down, blocked), fallback to manual intake form; no infinite retry
- **Eval metrics:** crawl success rate, extraction accuracy (spot-checked against actual site — this is a data-freshness-rot risk per 2026 eval research; re-verify extraction against live site monthly, not just at build time)
- **Monitoring:** Crawl success rate, extraction accuracy

### 3. Design QA Agent
- **Type:** Workflow (deterministic checks) + Evaluator-Optimizer loop for the manual-review tier
- **Pattern:** Evaluator-Optimizer (Design Agent generates → QA Agent evaluates → loop until pass or escalate)
- **Used by:** System 4, gates System 6 and System 18 deployment, and the 4th call site (customer edits)
- **Model tier:** Cheap for automated checks (Lighthouse/axe are deterministic tools, not LLM calls); Medium for the "manual-review-flagged" LLM pre-screen before Tyler sees it
- **Input:** Rendered HTML
- **Output:** Pass/fail + specific failure reasons (contrast, alt text, heading hierarchy, etc.)
- **Retry logic:** Fail → feed reasons back to Design Agent → re-render → re-check. 2 failed attempts → escalate to Tyler (System 18 feedback queue)
- **Eval metrics:** pass rate by failure category, false-pass rate (design that passed automated QA but Tyler still rejected — the "human override rate" for this agent)
- **Monitoring:** Pass rate by failure category (feeds System 4 Section 3 feedback loop)

### 4. Lead Scoring Agent
- **Type:** Workflow (scoring formula + LLM-assisted qualitative signals)
- **Pattern:** Routing (score determines which pipeline branch: immediate outreach / secondary / backlog / deprioritize)
- **Used by:** System 7 (origin, outbound prospecting), System 18 (photo intake — SAME model, must stay unified)
- **Model tier:** Medium (needs judgment on fit, not just pattern match)
- **Input:** Company profile (website quality signals, vertical, business size, location), engagement signals if available
- **Output:** Score 0–100, reasoning, ICP match %
- **Retry logic:** If external data source fails (Apollo/Hunter down), score on available data with lower confidence flag; don't block
- **Eval metrics:** score-to-conversion calibration (is a 70 actually converting more than a 50 — the single most important number for this agent), segmentation-error rate BY VERTICAL (2026 benchmark data shows ~30% of AI-SDR campaigns underperform specifically from segmentation errors — this agent must be evaluated per-vertical, not just in aggregate, since BuildFlow spans 4 verticals with different buying signals)
- **Monitoring:** Score-to-conversion calibration, tracked per-vertical in System 18 Agent Insights
- **⚠️ Cross-system requirement:** SAME agent/model used by System 7 (outbound) and System 18 (photo intake). Do not fork into two separate scoring logics.

### 5. Lead Lookup Agent
- **Type:** Workflow (API orchestration, not autonomous)
- **Pattern:** Fan-out/fan-in (query Apollo + Hunter + LinkedIn in parallel, merge results by confidence)
- **Used by:** System 18 (photo intake, single-lead real-time), System 7 / System 2 Section 3 ("Lead Discovery Agent" is this same agent doing batch warehouse population — naming unified here, System 2 should reference this name, not a separate one)
- **Model tier:** Cheap (matching/merging logic, minimal reasoning)
- **Input:** Business name, phone, location hints (from OCR) OR vertical/region criteria (batch mode)
- **Output:** Matched company record + confidence score per source
- **Retry logic:** If all sources fail to match: flag for manual Tyler lookup, don't auto-score
- **Eval metrics:** match rate, false-positive rate (wrong company matched), cost-per-successful-match
- **Monitoring:** Match rate, false-positive rate

### 6. OCR / Photo Intake Agent
- **Type:** Workflow (vision model call, single-shot)
- **Pattern:** Simple augmented LLM call (no chaining needed)
- **Used by:** System 18 only
- **Model tier:** Medium (vision + text extraction accuracy matters; highest-stakes single call in the photo intake chain — bad OCR poisons everything downstream)
- **Input:** Photo (vehicle/signage image)
- **Output:** Business name, phone, location hints, logo presence (structured JSON)
- **Retry logic:** Low-confidence extraction → flag for Tyler manual entry via iOS app; don't auto-proceed to Lookup Agent on low confidence
- **Eval metrics:** extraction accuracy (target 90%+), latency (<2 min full pipeline budget), false-confidence rate (agent reports high confidence but extraction was wrong — the dangerous failure mode)
- **Monitoring:** Extraction accuracy, latency
- **Latency budget:** First of 4 sequential steps (OCR → Lookup → Score → Build) in <2 min total; gets ~15–20 sec since downstream steps are heavier

### 7. Outreach / Copy Agent
- **Type:** Workflow (templated personalization, not autonomous)
- **Pattern:** Prompt chaining (lead data → personalization hook → email draft)
- **Used by:** System 7 (outbound campaigns — this is the agent behind System 2 Section 3's "Outbound Campaign Agent"; the naming there should be corrected to Outreach/Copy Agent, since the actual sending/sequencing logic is deterministic workflow code, not agentic), System 18 (photo intake personalized demo hook)
- **Model tier:** Medium (needs to sound human, not robotic)
- **Input:** Lead record, source context (photo intake hook vs. standard outbound), touch number (1–5 in System 7's sequence — see Section B on why this is a parameter, not separate agents), demo link
- **Output:** Personalized email/SMS copy
- **Retry logic:** N/A (not pass/fail); A/B tested via System 17 Experimentation
- **Eval metrics:** open rate, response rate, reply-sentiment by copy variant, human-override rate (how often Tyler rewrites before sending on high-touch path)
- **Monitoring:** Open rate, response rate by copy variant (feeds System 18 Agent Insights: "personal hook +18% open rate")

### 8. CRM Sync Agent
- **Type:** Workflow (deterministic sync + evaluator step for conflicts)
- **Pattern:** Pipeline (push) + Evaluator-Optimizer (conflict resolution)
- **Used by:** System 9 (customer-facing CRM connectors), System 10 (top-10 trades CRM data contracts), referenced by System 18
- **Model tier:** Cheap (field mapping is deterministic — no LLM call at all, per System 9 Section 5B); the conflict-reconciliation step (System 9's "4 signals" logic) is Medium
- **Input:** Lead/customer events (create, update, status change)
- **Output:** Synced record in external CRM + confirmation
- **Retry logic:** System 10 Section 7 spec — temporary fail: retry 5 min ×6; auth fail: alert customer; rate limit: queue and batch; 3 failures → Tyler notified; 5 → sync paused
- **Eval metrics:** sync success rate, latency, per-CRM error rates, conflict-reconciliation accuracy (System 9's stated target: >95%, <5% manual escalation)
- **Monitoring:** Sync success rate, latency, per-CRM error rates (System 13 Observability)

### 9. Dunning / Payment Recovery Agent
- **Type:** Workflow (staged, deterministic tier progression) + LLM for personalized messaging
- **Pattern:** Pipeline (Tier 1 → 2 → 3 → 4 → 5, time-gated)
- **Used by:** System 8 (origin), coordinates with System 12 (Lifecycle churn tracking)
- **Model tier:** Medium (personalized soft-touch emails in Tier 1–2 need to not sound like a form letter)
- **Input:** Payment failure event, customer history (repeat delinquency count), LTV
- **Output:** Staged email/action per System 8's locked 90-day lifecycle
- **Retry logic:** N/A in the LLM sense — the tiers ARE the retry/escalation ladder
- **Eval metrics:** recovery rate per tier, payment-plan acceptance rate (already spec'd in System 8), back-payment calculation accuracy (System 8's own validation rule: calculate twice independently, alert if discrepancy >$1)
- **Monitoring:** Recovery rate per tier, payment-plan acceptance rate

### 10. Support Triage Agent
- **Type:** Workflow (classification, single-shot)
- **Pattern:** Routing (triage pattern)
- **Used by:** System 14
- **Model tier:** Cheap (classification task)
- **Input:** Incoming support email
- **Output:** Priority (P0–P3), category, suggested KB article match, routing decision
- **Retry logic:** Low-confidence classification → default to P2, route to Tyler (fail safe, never silently drop)
- **Eval metrics:** auto-resolve rate, false-priority rate (P0/P1 mis-rated lower — the dangerous failure mode per System 14 Section 5), category accuracy
- **Monitoring:** Auto-resolve rate, false-priority rate, category accuracy (spot-checked monthly)

### 11. Feedback Triage Agent
- **Type:** Workflow (classification, single-shot)
- **Pattern:** Routing (bug / feature request / docs gap / billing question)
- **Used by:** System 15, fed automatically by Support Triage Agent (#10) when a support email is classified "feature request"
- **Model tier:** Cheap
- **Input:** Feedback text (in-app form, or forwarded from Support Triage Agent)
- **Output:** Category, sentiment, duplicate-detection flag
- **Retry logic:** N/A — worst case is miscategorization, corrected in monthly Tyler review
- **Eval metrics:** duplicate-detection accuracy, category accuracy
- **Monitoring:** Category distribution, duplicate-detection accuracy (spot-checked monthly)
- **Scope boundary (explicit):** Prioritization (Impact × Effort scoring, System 15 Section 2) stays Tyler's judgment call — the agent does capture + dedup only, never auto-scores business priority.

### 12. Lifecycle / Churn Prediction Agent
- **Type:** Workflow (scoring formula, same architecture as Lead Scoring Agent)
- **Pattern:** Routing (health score determines intervention tier)
- **Used by:** System 12 (origin), feeds System 18 customer health dashboard
- **Model tier:** Cheap (formula-driven: engagement 40%, payment 30%, retention signals 20%, growth 10% — locked in System 18 Section 4; System 12 references this, doesn't redefine it)
- **Input:** Engagement metrics (System 13), payment status (System 8), renewal proximity
- **Output:** Health score 0–100, risk tier (green/yellow/red)
- **Retry logic:** N/A (scheduled daily recompute) + event-triggered (payment failure entering Dunning Tier 3+, login-inactivity threshold crossed)
- **Eval metrics:** score-to-actual-churn calibration
- **Monitoring:** Score-to-actual-churn calibration

### 13. SEO/GEO Optimization Agent
- **Type:** Workflow (monitor → threshold check → trigger optimization)
- **Pattern:** Routing (ranking drop triggers one of several optimization playbooks)
- **Used by:** System 16
- **Model tier:** Medium (content/meta optimization needs judgment)
- **Input:** Ranking position data, page performance metrics
- **Output:** Optimization action (meta tag update, content tweak, schema markup fix) or "no action needed"
- **Retry logic:** Anti-thrashing — changes monitored 2 weeks before agent can trigger another pass on the same page
- **Eval metrics:** ranking position over time, organic traffic delta post-optimization, false-trigger rate (agent acted when ranking drop was noise, not signal)
- **Monitoring:** Ranking position over time, organic traffic delta
- **Human gate:** Tyler applies or dismisses every proposed change (System 16 Section 2's "Approval workflow") — agent never auto-publishes to a live site.

### 14. Review Sync Agent
- **Type:** Workflow (API poll → dedup → structure)
- **Pattern:** Pipeline (daily poll, off-peak)
- **Used by:** System 12 Section 4 (origin — was previously described there and in System 2 Section 3 as a bare workflow with no agent-registry entry; this closes that gap)
- **Model tier:** Cheap (no LLM judgment needed — pure API poll + dedup against existing review IDs)
- **Input:** Customer's connected Google Business Profile / Yelp / Trustpilot account
- **Output:** New reviews (rating, author, text, date, URL), deduplicated against previously synced set
- **Retry logic:** If source API down: retry next scheduled cycle (daily), no urgent retry — reviews aren't time-critical
- **Eval metrics:** sync success rate, duplicate-import rate (should be ~0%)
- **Monitoring:** Sync success rate (System 13)
- **Note:** This is a pure data-movement pipeline like the CRM Sync push mechanism (Agent #8) — cheap tier throughout, no reasoning step required.

### 15. Experimentation / Guardrail Agent
- **Type:** Workflow (statistical monitoring + routing)
- **Pattern:** Routing (guardrail breach routes to auto-kill; clean run routes to Tyler's winner-decision queue)
- **Used by:** System 17 (origin — previously entirely manual/spreadsheet-driven per Section 6 "Documentation & Sharing")
- **Model tier:** Cheap (statistical calculation — sample size, p-value, confidence interval — is deterministic math, not LLM judgment)
- **Input:** Test configuration (hypothesis, control/variant definitions, MDE, audience split), daily metric snapshots
- **Output:** (a) sample-size-met flag, (b) daily guardrail check (has variant underperformed control by >10% per System 17 Section 9's mitigation rule — if so, auto-kill and alert Tyler immediately), (c) at test-end: p-value, confidence interval, effect size, recommendation (not a final decision — Tyler still calls the winner per System 17 Section 5's governance)
- **Retry logic:** N/A — this agent observes and calculates, doesn't take irreversible action except the guardrail auto-kill
- **Eval metrics:** false-guardrail-trigger rate (killed a test that was actually fine — noisy early data), missed-guardrail rate (should have killed but didn't)
- **Monitoring:** Test inventory dashboard (System 17 Section 8) — this agent is what populates it automatically instead of a manually-maintained spreadsheet
- **Human gate:** Declaring a winner and rolling out the change stays Tyler's call, always (System 17 Section 5 "Winner decision" step is unchanged) — the agent only removes the manual math/spreadsheet-tracking burden, never the decision itself.

---

## Section A2: Confirmed Non-Agent Pipelines (Explicit — Closes Audit Gaps)

Some workflows mentioned across systems are deterministic data movement with no LLM reasoning step, and are deliberately NOT catalogued as agents:

| Name (as referenced in systems) | System | Why not an agent |
|---|---|---|
| Analytics Event Agent | System 2 Section 3 | Pure event-stream ingestion (page views, form submits) → database. No classification, no judgment call. Rename to "Analytics Event Pipeline" in System 2 if revised. |
| CRM push mechanism | System 9 Section 5B, System 10 | Field-mapped HTTP calls, explicitly confirmed "no LLM needed" in the system's own spec. The *conflict-reconciliation* step layered on top IS agentic (see CRM Sync Agent #8's Medium-tier evaluator step) — the push itself is not. |
| Health Check / Business Metrics / Alert Dispatcher / Dashboard Renderer (System 13's four "agents") | System 13 | These are infrastructure monitoring cron jobs (ping endpoints, run SQL, dispatch notifications, render JSON) — no model call anywhere in the loop. System 13 calls them "agents" colloquially; they are workflows in the strict sense used here. No change needed to System 13, just noted for registry completeness. |

---

## Section B: Agent Scaling Model — Instances vs. Parameters

**The question this section answers:** given 4 verticals (plumbing, HVAC, electrical, roofing), 3 tranches (Micro/SMB/Mid-Market), and multi-touch outbound sequences (5 emails), how many agents does BuildFlow actually need to build?

**Answer: 15 agent types (Section A), zero additional builds for vertical/tranche/touch-count variation.** These are runtime parameters passed into a shared agent, not separate agents. Building separate agents per segment would mean 15 × 4 verticals × 3 tranches = 180 "agents" to maintain — this is exactly the over-engineering failure mode 2026 research warns against (40% of multi-agent pilots fail from unnecessary complexity). The correct pattern is: **narrow agent scope (one job), broad parameterization (many contexts).**

| Agent | Varies by | How it varies | Still 1 agent? |
|---|---|---|---|
| Design Agent | Vertical, styling profile (10 options, System 4 Section 6) | Template selection + prompt context | Yes — template warehouse is data, not code |
| Lead Scoring Agent | Vertical | Keyword/signal weighting differs per vertical (System 7 Section 2) — **but must be evaluated per-vertical** (see Agent #4's eval note) even though it's one deployed agent | Yes |
| Outreach/Copy Agent | Touch number (1–5), source (photo intake vs. outbound) | Template + tone variant selected by workflow code, same agent call pattern | Yes |
| CRM Sync Agent | Which CRM (10 trades CRMs) | Field-mapping config per CRM (System 10 Section 6's mapping table) is data, not a forked agent | Yes |
| SEO/GEO Agent | Vertical | Vertical-specific keyword sets (System 16 Section 2) passed as input | Yes |

**Where segmentation DOES matter, even with one shared agent:**
- **Calibration tracking must be per-vertical**, not aggregate. A Lead Scoring Agent that's well-calibrated for plumbing but poorly calibrated for roofing will look "fine" in an aggregate score-to-conversion chart while quietly costing conversions in roofing. This is the concrete mechanism behind the "30% of AI-SDR campaigns underperform from segmentation errors" finding (Section D). System 18's Agent Insights dashboard should break out calibration by vertical, not just show one blended number.
- **Prompt tuning is per-vertical even though deployment is not.** The shared agent's system prompt should include vertical-specific context (already partially true — System 16 Section 2 has vertical keyword tables; System 7 Section 2 doesn't yet segment its scoring weights by vertical, which is a real gap worth flagging to Tyler for Phase 2 if calibration drift appears in one vertical).

**Outbound touch-count scaling:** System 7's 5-email sequence (Section 3) is 5 calls to the SAME Outreach/Copy Agent with `touch_number` as an input parameter selecting tone/urgency (per the existing template variants A/B/C). Adding a 6th touch, or a SMS touch (System 17 Section 2 mentions this for Phase 2+), is a workflow config change, not a new agent.

**When you WOULD need a genuinely separate agent (none apply yet, but the test to apply later):** per Anthropic's guidance and the 2026 research above, split into a new agent only when (a) the subtask requires a fundamentally different tool set the shared agent doesn't have, or (b) true parallelism is needed (the tasks must run simultaneously, not just be called repeatedly), or (c) a different model tier is genuinely warranted for cost reasons at the new task's volume. None of BuildFlow's tranche/vertical/touch variations meet this bar today.

---

## Section C: Orchestration Pattern Summary (Which System Uses Which Pattern)

| System | Primary Pattern | Why |
|--------|-----------------|-----|
| 2 (Platform Architecture) | N/A — defines the DAG/dependency chain all agents run within; its own Section 3 agent catalog is superseded by this registry (naming corrections noted per-agent above) | Architectural home, not a distinct pattern |
| 4 (Design) | Evaluator-Optimizer | Generate → QA check → loop until pass |
| 6 (Demo) | Pipeline | Fixed sequence: generate → QA → deploy → track |
| 7 (Lead Pipeline) | Routing | Score determines outreach tier |
| 8 (Dunning) | Pipeline | Fixed time-gated tier progression |
| 9/10 (CRM Sync) | Pipeline + Evaluator-Optimizer | Push is pipeline; conflict resolution is evaluator |
| 12 (Lifecycle) | Routing | Health score routes to intervention tier |
| 13 (Observability) | N/A (data layer) | Agents report metrics; infrastructure cron jobs, not LLM agents |
| 14 (Support) | Routing (Triage) | Classic triage pattern |
| 15 (Feedback) | Routing | Category triage |
| 16 (SEO) | Routing | Threshold triggers playbook selection |
| 17 (Experimentation) | Routing | Guardrail breach vs. clean run routes to different outcomes |
| 18 (Photo Intake) | Pipeline (fan-out inside it) | OCR → Lookup (fan-out to 3 sources) → Score → Build, sequential overall |

**Systems with no agents at all (confirmed, not gaps):** 1 (Business Operations — financial modeling, no automation target), 3 (Hosting & Infrastructure — provisioning is IaC/Terraform-style config, not agentic), 5 (Feature System — scope/acceptance-criteria doc, no runtime component), 11 (Compliance & Security — audit logging is deterministic, incident response is a human runbook per its own spec), 19 (BuildFlow Website — Phase 1 blog is manually written per System 19's own roadmap; a Content Agent would be a reasonable Phase 2 addition once posting volume justifies it, but is explicitly not built yet).

**None of BuildFlow's agents need full autonomous agent architecture** (open-ended, unbounded tool use). All map to workflows or the routing/pipeline/evaluator-optimizer patterns. Per 2026 production research, this is the right default — reserve genuine agentic autonomy for tasks with unknown step count, which none of BuildFlow's current tasks are.

---

## Section D: 2026 Best-Practice Evaluation & Observability Standard

Applied across every agent in Section A, based on current (2026) production research:

**The two metrics that matter most (apply to every agent):**
1. **Task completion rate** — % of invocations producing a usable output with no human intervention. This is the single most important number; it integrates accuracy, reliability, and safety.
2. **Human override rate** — how often Tyler corrects or replaces the agent's output. A rising override rate is the most reliable leading indicator of quality drift, more sensitive than aggregate accuracy scores. Every agent's "monitoring" line in Section A should track this even where not explicitly stated.

**Secondary metrics, applied where relevant:**
- **Trajectory / tool-call correctness** (for agents that chain tool calls — Lead Lookup's fan-out, CRM Sync's push): tool-selection accuracy, schema validity, argument validity, evaluated separately rather than only checking the final output, since an agent can reach a correct-looking final answer via a wrong path that won't generalize.
- **Recovery quality** (for any agent with retry logic — most of Section A): time-to-detect a failure, retries-to-recover, and — critically — whether the agent escalates appropriately rather than silently retrying forever or silently giving up. This is explicitly why every retry-capable agent in Section A has a hard escalation ceiling (2–5 attempts) rather than unbounded retry.
- **Cost-per-success** (not cost-per-call): matters most for Medium/Strong-tier agents (Design, Lead Scoring, OCR) since these dominate spend; a cheap agent that fails often can cost more per successful outcome than an expensive one that rarely fails.

**Eval suite standard before shipping any agent:** Enterprise 2026 practice calls for ≥50 representative test cases per agent across difficulty tiers, with baseline metrics recorded (accuracy, latency, cost) and CI-gated regression checks on every change. For a solo-founder build, the proportionate version is: **≥15–20 hand-built test cases per agent before Phase 1 launch** (covering the obvious case, the edge case, and the failure case for each), with the full 50-case suite as a Phase 2 target once volume justifies the investment. Don't skip this step to save time — per 2026 field reports, skipping eval infrastructure is the single most common cause of teams "firefighting quality issues for weeks that a disciplined eval suite would have caught on day one."

**Reliability target:** 2026 field data consistently shows a gap between demo-quality (~80% reliability) and production-quality (99%+) agents. BuildFlow's existing QA gates (Lighthouse 80+ demo threshold, 90+ manual-review threshold, System 9's 95%+ CRM reconciliation target) are already calibrated in this range — this section confirms those thresholds match current best practice rather than being arbitrary.

**Why most BuildFlow agents stay single-call workflows, not multi-step autonomous loops:** validated directly by the Princeton NLP finding cited in this document's intro — multi-agent orchestration adds roughly 2.1 percentage points of accuracy at double the cost and 10–30× the latency versus a well-scoped single agent, and is worth it only for genuinely cross-domain work. None of BuildFlow's 15 cataloged agents meet that bar individually; the system-level separation between agents (Section A) is where the real value comes from, not internal agentic looping within any one agent.

**Sources (searched September 2026, current within the past 6 months):**
- Princeton NLP single-vs-multi-agent benchmark findings; 40%-multi-agent-pilot-failure stat — beam.ai, "6 Multi-Agent Orchestration Patterns for Production" (Jul 2026)
- 5-pattern production taxonomy (fan-out/pipeline/debate/supervisor/swarm), supervisor-as-2026-default — digitalapplied.com, "Multi-Agent Orchestration: 5 Patterns That Work in 2026" (May 2026)
- Task completion rate / human override rate as primary metrics — thinking.inc, "AI Agent Evaluation in Production (2026 Guide)" (Mar 2026)
- Trajectory evaluation, tool-call correctness layers, recovery quality metrics — kunalganglani.com, "AI Agent Evaluation Framework 2026: 8 Metrics" (Aug 2026); morphllm.com, "AI Agent Evaluation (2026)" (Jun 2026)
- ≥50 test case eval-suite standard, CI-gating, cost guards checklist — dev.to/tamizuddin, "Beyond the Demo: Building Production-Ready AI Agents" (Aug 2026)
- 80% demo vs. 99%+ production reliability gap — ranksquire.com, "AI Agents Orchestration 2026: The Production Blueprint" (Apr 2026)
- 7x conversion lift from separated lead-gen/qualification/outreach agents; 30% of AI-SDR campaigns underperform from segmentation errors; high-persona-variance ICPs break templated personalization; AI-only outreach sees 25-35% lower pipeline value — brilo.ai, "AI SDR & Outbound Automation Statistics & Trends [2026]" (Jun 2026)

---

## Section E: Cross-System Coordination Rules (Fixes Identified Gaps)

1. **Lead Scoring Agent (#4) is shared** between System 7 and System 18. One model, one calibration dataset, evaluated **per-vertical** (Section B). Never fork into divergent implementations.

2. **Lifecycle/Churn Agent (#12) reuses System 18's health-score formula.** System 12 does not invent a separate churn model.

3. **Design Agent (#1) is invoked from FOUR places** (System 4 direct, System 6 demo flow, System 18 photo-intake auto-build, and the customer-edit-triggered regeneration previously called "Site Regeneration Agent" in System 2/System 4 Section 1 — this is the same agent, not a fifth agent). All four must call the identical agent/template warehouse.

4. **Support Triage (#10) feeds Feedback Triage (#11).** A support email classified "feature request" auto-forwards into the Feedback pipeline.

5. **Dunning Agent (#9) notifies Lifecycle Agent (#12) on entry to Tier 3+** (30+ days late) immediately, not at the next scheduled health recompute.

6. **Lead Lookup Agent (#5)** is one agent in two modes: single-lead real-time (System 18 photo intake) and batch (System 7 warehouse population, previously mislabeled "Lead Discovery Agent" in System 2 Section 3 — naming corrected here).

7. **Outreach/Copy Agent (#7)** absorbs what System 2 Section 3 called "Outbound Campaign Agent" — the copy-generation is agentic, the sending/sequencing/cadence logic is deterministic workflow code (System 7 Section 3), not part of the agent itself.

8. **Review Sync (#14) and Analytics Event ingestion are distinct**, despite both being "background pollers" — Review Sync makes judgment-adjacent calls (dedup against fuzzy-matched existing reviews) and is cataloged as an agent; Analytics Event ingestion is pure structured-event storage and is explicitly NOT an agent (Section A2).

---

## Section F: Human-in-the-Loop Gates (Non-Negotiable Checkpoints)

| Agent | Gate | Trigger |
|-------|------|---------|
| Design QA Agent | Tyler review | 2 failed auto-QA attempts |
| Lead Scoring Agent (photo intake) | Tyler approval | Score 50–69 (medium confidence) |
| CRM Sync Agent | Tyler notification | 3+ failed sync attempts |
| Support Triage Agent | Tyler queue | Any P0/P1, or low-confidence classification |
| Dunning Agent | Tyler direct contact | Tier 2 (Day 7+) — already locked in System 8 |
| SEO/GEO Agent | Tyler approval | Every proposed content/meta change — never auto-publishes |
| Experimentation Agent | Tyler decision | Declaring a test winner and rolling out the change — agent only auto-kills on guardrail breach, never auto-ships a winner |
| Redesign Service | Tyler/designer | All redesign requests are human-executed by design (System 4 Section 8) |

---

## Section G: System Coverage Completeness Audit

Every one of BuildFlow's 19 systems checked against the registry:

| System | Agent-touching? | Status |
|---|---|---|
| 1 Business Operations | No | Confirmed — financial modeling only |
| 2 Platform Architecture | Yes | Its own Section 3 agent catalog had naming drift (Lead Discovery→Lead Lookup, Outbound Campaign→Outreach/Copy, Demo Generation→Design, QA Validation→Design QA, Site Regeneration→Design Agent 4th call site) and one true gap (Review Sync Agent, now added) |
| 3 Hosting & Infrastructure | No | Confirmed — IaC/config, not agentic |
| 4 Design & Quality | Yes | Cross-referenced |
| 5 Feature System | No | Confirmed — scope doc, no runtime |
| 6 Demo-to-Customer | Yes | Cross-referenced |
| 7 Lead-to-Customer Pipeline | Yes | Cross-referenced |
| 8 Payments & Billing | Yes | Cross-referenced |
| 9 CRM Integration | Yes | Cross-referenced |
| 10 External Integrations | Yes | Cross-referenced |
| 11 Compliance & Security | No | Confirmed — deterministic audit logging, human incident-response runbook |
| 12 Customer Lifecycle | Yes | Cross-referenced; Review Sync Agent gap fixed |
| 13 Observability | N/A | Its "four agents" are infrastructure cron jobs, not LLM agents — confirmed, no change needed |
| 14 Customer Support | Yes | Cross-referenced |
| 15 Customer Feedback | Yes | Cross-referenced |
| 16 SEO/GEO | Yes | Cross-referenced |
| 17 Experimentation | Yes | Was entirely manual/spreadsheet-driven; Experimentation Agent added |
| 18 Admin CRM & Operations | Yes | Cross-referenced |
| 19 BuildFlow Website | No (yet) | Confirmed — Phase 1 blog is manual; Content Agent is a reasonable Phase 2 addition, explicitly not built now |

**No cycles found.** The dependency graph is a DAG: Lead Lookup/Scoring → Outreach/Copy → Design → Design QA → (Dunning ⇄ Lifecycle is the only bidirectional link, and it's a one-way notification in each direction, not a loop — Dunning notifies Lifecycle on Tier 3 entry; Lifecycle never triggers Dunning). The Design Agent ⇄ Design QA Agent retry loop (generate → check → re-generate) is an intentional bounded loop (evaluator-optimizer pattern, capped at 2 retries), not an uncontrolled cycle.

---

## Status: LOCKED — Reference document for all agent-touching systems (2, 4, 6, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18). 15 agent types total. Systems 1, 3, 5, 11, 19 confirmed to need no agent. System 13 confirmed as infrastructure cron jobs, not LLM agents.
