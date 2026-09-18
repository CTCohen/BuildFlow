---
name: 15-customer-feedback-iteration-system
description: Feedback capture, triage, prioritization, roadmap planning, release coordination
sources: [chat]
aliases: [feedback, roadmap, product iteration, release notes]
---

# System 15 — Customer Feedback Iteration System

## Purpose

Lock down how customer feedback flows into product decisions and how BuildFlow iterates and ships improvements.

## Contents

- Feedback capture, triage, and categorization
- Prioritization scoring model (impact × effort) and roadmap format
- Release planning, cadence, and communication
- Metrics and impact analysis for shipped features
- Automated capture & triage layer

## Specifications

### SECTION 1: Feedback Capture & Triage

**Sources:** support tickets, in-app "Send feedback" form, surveys (NPS + quarterly feature), usage data (implicit), direct outreach, competitor monitoring

**Categorization:** Bugs (P0-P3 severity), Feature requests (must-have/nice-to-have/future), Improvements (high/medium/low impact), Questions/Confusion (signals UX/doc gap), Compliments (marketing use)

**Triage workflow (Tyler's monthly review):** read all feedback → categorize → dedupe → estimate effort+value → prioritize top 3-5 for roadmap → communicate back to customers

**Storage:** GitHub issues/Notion/Airtable — title, description, source, category, priority, vote count, status, owner

---

## SECTION 2: Prioritization & Roadmap Planning

**Scoring model:** Impact (1-5) / Effort (1-5) = Priority score. Tiebreakers: strategic importance, time-sensitivity, risk mitigation.

**Roadmap format:** rolling 90-day (Now 0-30d / Next 30-90d / Later 90+d / Backlog)

**Roadmap content:** title, description, expected impact, timeline range (no specific ship date), status

**Deferred features:** communicate rationale (technical complexity vs. low demand), revisit trigger, workaround suggestion

---

## SECTION 3: Release Planning & Launch

**Cadence:** ship when ready (not time-boxed); minimum monthly, maximum weekly

**Composition:** major (quarterly, big feature + improvements + fixes), minor (monthly, 1-2 features + fixes), patch (ad-hoc, fixes only)

**Process:** code complete → testing → staging deploy → customer communication → production deploy → post-launch monitoring

**Beta testing (future):** 10% opt-in early adopters, 1-2 weeks, resolve critical issues before full rollout

**Release notes:** announcement, features (with screenshot), improvements, fixes, migration guide if breaking, customer thank-you

---

## SECTION 4: Metrics & Impact Analysis

**Success metrics:** Adoption (% using, time-to-first-use, target >50% of relevant customers), Engagement (repeat use, MAU, frequency), Retention impact (churn of users vs non-users, NPS, expansion), Business impact (revenue, support cost delta, ROI)

**Evaluation timeline:** Week 1 (critical bugs?) → Week 2-4 (adoption/early signals) → Month 1 (full adoption) → Month 3 (retention impact) → Month 6 (long-term ROI)

**Decision points:** Keep & improve / Keep-maintain / Iterate / Kill (30-day deprecation notice)

---

## SECTION 5: Automated Capture & Triage Layer

**Agent used:** Feedback Triage Agent (Agent Registry #11) — cheap-tier classification workflow.

**Automated workflow:**
1. Feedback arrives from in-app form OR forwarded from Support Triage Agent (System 14) when classified "feature request"
2. Agent classifies category/sentiment, checks for duplicates against open items
3. Duplicate detected → increments existing item's vote count (real-time countable, not just monthly-discovered)
4. New item → creates entry with agent-assigned category, awaits Tyler's monthly Impact×Effort scoring

**Scope boundary:** Prioritization scoring and roadmap decisions stay Tyler's call — the agent does capture + dedup only, never auto-scores business priority.

**Monitoring:** duplicate-detection accuracy, category accuracy, volume trend by category

Full agent detail: `systems/agent-registry.md`
