---
name: 17-experimentation-system
description: A/B testing infrastructure for outbound campaigns, pricing, and features to drive optimization and product learning
sources: [chat]
aliases: [A/B testing, testing framework, experimentation, optimization]
---

# System 17 — Experimentation System

## Purpose

Set up A/B testing infrastructure for outbound, pricing, features to drive optimization and measure impact.

## Contents

- A/B test framework, hypothesis structure, statistical rigor
- Outbound campaign testing (email, SMS variables and metrics)
- Pricing and offer testing
- Feature and onboarding testing (feature flags, UI/UX variants)
- Testing checklist and governance
- Cadence, portfolio approach, cross-system integration
- Tools, infrastructure, risk/guardrails, and learning playbook
- Agent cross-reference

## Specifications

### Section 1: A/B Test Framework & Methodology

**Hypothesis-driven:** "If we [change X], then [metric Y] will [improve] because [reason]"

**Statistical rigor:** pre-calculated sample size, 95% confidence (α=0.05), 80% power (β=0.20), Bonferroni correction for multiple comparisons, p<0.05 significance threshold, no audience overlap

---

## Section 2: Outbound Campaign Testing

**Email variables:** subject line (urgency/curiosity/personalization), CTA, body length, sender identity, send time, sequence cadence

**Metrics:** open rate, click rate, reply rate, bounce rate, unsubscribe rate, demo view rate, conversion rate, time-to-conversion

---

## Section 3: Pricing & Offer Testing (Phase 2+)

Price point variants (±10%, charm pricing), offer variants (annual discount, free trial, money-back guarantee), messaging variants — tracked via conversion rate, revenue per customer, LTV, price anchoring

---

## Section 4: Feature & Onboarding Testing

Feature flags with staged rollout (5%→25%→50%→100%); onboarding flow variants; UI/UX variants — tracked via adoption, engagement, retention, support tickets, task completion rate

---

## Section 5: Testing Checklist & Governance

**Before:** hypothesis written, control/variant defined, metrics defined, sample size calculated, duration set, audience defined, no-peeking rule established, statistical test chosen, downside risk assessed

**During:** track daily but don't act early, monitor data quality, watch SLA (kill if degraded), no early stopping, no ad-hoc analysis

**After:** run statistical test, document results, check guardrails, winner decision (significant AND business-meaningful), archive, capture learning

---

## Section 6: Cadence & Portfolio Approach

Month 1: outbound email variants. Month 2-3: 2-3 parallel non-overlapping tests. Month 4+: continuous 1-2 running tests. Quarterly portfolio review.

---

## Section 7: Integration with Other Systems

Feeds: Lead Pipeline (winning sequences), Demo System (preview format), Payments (winning pricing/offers), Feature System (winning flags), Lifecycle System (winning onboarding)

---

## Section 8: Tools & Infrastructure

Email A/B (SendGrid/Mailchimp/manual split), feature flags (LaunchDarkly or custom), statistical calculator, event tracking (test_id, variant, timestamp per assignment)

---

## Section 9: Risk & Guardrails

**Risks:** early stopping bias, multiple comparisons problem, segment interaction, temporal/seasonal effects, cannibalization

**Mitigation:** pre-planned duration adherence, Bonferroni correction, segmented analysis, stable-period testing, revenue-not-just-conversion tracking, downside alert (kill if variant underperforms control by >10%)

---

## Section 10: Learning & Playbook

Pattern recognition across tests feeds a living playbook per motion (outbound sequences, pricing, onboarding); winning variants become new controls; updated monthly

---

## Dependencies

**Upstream:** Lead-to-Customer Pipeline, Payments & Billing, Demo-to-Customer
**Downstream:** Lead-to-Customer Pipeline, Payments, Feature System, Lifecycle System

---

## Section 11: Agent Cross-Reference

**Agent used:** Experimentation / Guardrail Agent (Agent Registry #15) — cheap-tier statistical-monitoring workflow. Computes sample size, checks Section 9's guardrail rule (auto-kill if variant underperforms control by >10%) daily, and at test-end calculates p-value/confidence interval/effect size.

**What the agent does NOT do:** declare a winner or roll out a change — that stays Tyler's explicit call per Section 5's governance. The agent removes manual math/spreadsheet burden, not decision authority.

**Monitoring:** false-guardrail-trigger rate, missed-guardrail rate.

Full agent detail: `systems/agent-registry.md`
