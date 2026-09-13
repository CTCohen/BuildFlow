---
title: BuildFlow
purpose: Workspace overview, quick navigation, and status dashboard
status: active
owner: c.t.cohen
updated: 2026-09-12
version: 1.0
tier_scope: all
phase: operational
related: [CLAUDE.md, DECISIONS.md, ROADMAP.md]
---

# BuildFlow

**Professional websites for service businesses, automated end-to-end.**

We discover small service businesses that need better websites, build them high-quality sites in 7 days, and host them forever for $99/month. Discovery, outreach, and site generation are AI-agent automated; sales and onboarding are human-driven.

---

## Quick Links

**First time here?** Start with:
- [What is BuildFlow?](docs/DELIVERY_MODEL.md) — Our product, pricing, and positioning
- [How do we build sites?](docs/ARCHITECTURE.md) — Technical overview
- [How do we run the business?](DECISIONS.md) — Current strategy and decisions

**Tracking progress?**
- [This week's status](PROGRESS.md) — Weekly snapshot
- [Phase 1 execution](phases/PHASE_1.md) — Current roadmap and blockers
- [Metrics & KPIs](metrics/METRICS.md) — Financial and operational health

**Deep dives by area:**

| Area | Main Doc | Sub-docs |
|------|----------|----------|
| 📋 **Evergreen docs** | [docs/](docs/) | Architecture, tech stack, delivery model, FAQ |
| 🏃 **Operations** | [operations/](operations/) | Metrics, runbooks, processes, daily logs |
| 🚀 **Roadmap** | [phases/](phases/) | Phase 1, Phase 2, etc. (one doc per phase) |
| 💰 **Financial health** | [metrics/FINANCIAL.md](metrics/FINANCIAL.md) | Revenue, costs, margins, breakeven |
| 🎯 **Go-to-market** | [sales/](sales/) | Pitch, prospecting, case studies, pricing |
| 👥 **Customers** | [customers/](customers/) | Customer intake, feedback, case studies |
| 📞 **Outreach** | [outreach/](outreach/) | Prospect lists, email templates, tracking |
| 🔬 **Research** | [research/](research/) | Market sizing, competitive analysis, trade research |
| 📚 **Knowledge** | [knowledge/](knowledge/) | Per-trade playbooks (HVAC, plumbing, etc.) |
| 🗂️ **Archive** | [archive/](archive/) | Historical decisions, old plans, old research |

---

## Current Status

**Phase:** Phase 1 (5 closes by 9/30)  
**Last updated:** 2026-09-11  
**Status:** 🟢 READY TO EXECUTE  

### What's Done
✅ Pipeline fully tested and QA-gated (7 of 9 checks)  
✅ 5 real Phoenix HVAC prospects identified  
✅ Personalized emails drafted and ready to send  
✅ Website rebuilt and deployment infrastructure in place  
✅ Security hardened (path-traversal fix)  
✅ Design system consolidated (logo-first as single branch point)  

### What's Blocking
⏳ Chase: 6 setup blockers (Calendly, Stripe, email, domain, address, warmup)  
📋 See [PHASE_1_EXECUTION_SETUP.md](phases/PHASE_1.md) for details  

### Next Steps
1. **Today/tomorrow:** Chase completes 6 blockers (75 min of work)
2. **Monday 9 AM:** Send 5 prospect emails
3. **Wed–Fri:** Monitor opens, handle sales calls
4. **Fri–Mon:** Build customer sites (if closes happen)
5. **By 9/30:** 5 closes, revenue flowing

---

## How to Use This Repo

### For Documentation
- **Evergreen docs** (how the product works, architecture, delivery model) live in `docs/`
- **Decisions** (what we decided and why) live in `DECISIONS.md`
- **Plans & roadmaps** (what we're building next) live in `phases/`
- **Old decisions & old plans** go to `archive/` once superseded

### For Operations
- **Weekly status** → update `PROGRESS.md` every Friday
- **Metrics & health** → update `metrics/METRICS.md` monthly
- **Daily standup notes** → add to `operations/logs/[date].md`
- **New processes** → document in `operations/PROCESSES/`

### For Sales & Customers
- **Prospecting** → see `sales/PROSPECTING.md`
- **Pitch & objections** → see `sales/PITCH.md`
- **Customer intake** → create folder in `customers/[customer-slug]/`
- **Case studies** → summarize in `customers/CASE_STUDIES.md`

### For Research
- **Market sizing** → `research/MARKET_SIZING.md`
- **Competitive analysis** → `research/COMPETITIVE_ANALYSIS.md`
- **Per-trade research** → `research/TRADE_RESEARCH/[trade].md`

### For Archiving
- **When a plan becomes historical** (Phase 1 ends, old roadmap superseded) → move to `archive/planning/`
- **When a decision is reversed** → move old decision to `archive/decisions/`
- **Never delete, only move.** Archive keeps historical context.

---

## Folder Structure

```
BuildFlow/
├── README.md                    (you are here)
├── CLAUDE.md                    (how to work with this codebase)
├── DECISIONS.md                 (current decisions & strategy)
├── PROGRESS.md                  (weekly status, updated Friday)
│
├── docs/                        (evergreen documentation)
│   ├── DELIVERY_MODEL.md
│   ├── ARCHITECTURE.md
│   ├── TECH_STACK.md
│   └── FAQ.md
│
├── operations/                  (daily operations & health)
│   ├── METRICS.md              (KPIs, financial health, ops health)
│   ├── RUNBOOKS.md             (standard procedures)
│   ├── PROCESSES/              (checklists for common tasks)
│   │   ├── ONBOARDING.md
│   │   ├── CUSTOMER_LAUNCH.md
│   │   └── INCIDENT_RESPONSE.md
│   └── logs/                   (daily & weekly snapshots)
│       ├── 2026-09-11.md
│       └── ...
│
├── phases/                      (execution roadmaps)
│   ├── PHASE_1.md              (current)
│   ├── PHASE_2.md
│   └── ...
│
├── sales/                       (go-to-market)
│   ├── PITCH.md
│   ├── PROSPECTING.md
│   ├── CASE_STUDIES.md
│   └── TEMPLATES/
│       └── [cold email, call scripts, etc.]
│
├── research/                    (market & competitive)
│   ├── MARKET_SIZING.md
│   ├── COMPETITIVE_ANALYSIS.md
│   ├── CUSTOMER_RESEARCH.md
│   └── TRADE_RESEARCH/
│       ├── hvac.md
│       └── ...
│
├── customers/                   (customer data & feedback)
│   ├── CASE_STUDIES.md         (summary of all wins)
│   ├── [customer-slug]/
│   │   ├── INTAKE.md
│   │   ├── FEEDBACK.md
│   │   ├── METRICS.md
│   │   └── NOTES.md
│   └── ...
│
├── metrics/                     (business health)
│   ├── METRICS.md              (KPIs dashboard)
│   ├── FINANCIAL.md            (revenue, costs, margins)
│   ├── OPERATIONAL.md          (sales velocity, build time, uptime)
│   ├── CUSTOMER.md             (churn, satisfaction, NPS)
│   └── logs/
│       ├── 2026-09.md
│       └── ...
│
├── outreach/                    (prospect acquisition)
│   ├── REAL_PROSPECTS_READY_TO_SEND.md
│   ├── TEMPLATES/
│   │   └── EMAIL_SEQUENCES.md
│   └── TRACKING/
│
├── knowledge/                   (per-trade playbooks)
│   ├── trades/
│   │   ├── hvac/
│   │   ├── plumbing/
│   │   └── ...
│   └── ...
│
├── archive/                     (old docs, never delete)
│   ├── decisions/               (superseded decisions)
│   ├── planning/                (old roadmaps, old phase plans)
│   └── research/                (old research)
│
├── app/                         (multi-tenant Astro app)
├── website/                     (marketing site)
├── legal/                       (terms, privacy, security)
│
└── .claude/
    └── memory/
```

---

## Communication & Decisions

**How decisions get made:**
1. Claude or Chase identifies a choice that affects the business
2. We discuss the options and tradeoffs
3. Chase decides (final call on product/go-to-market; Claude on technical)
4. Decision gets logged in `DECISIONS.md` with: date, what we decided, why, status
5. Relevant docs get updated (architecture.md, pricing, sales pitch, etc.)
6. When the decision is reversed, old entry moves to `archive/decisions/` with a note

**How we track progress:**
- `PROGRESS.md` → updated every Friday (this week's wins, blockers, next week's focus)
- `operations/logs/[date].md` → daily standup notes (optional but useful)
- `metrics/METRICS.md` → KPIs updated monthly or as data arrives
- `metrics/logs/[date].md` → monthly summaries (revenue, closes, builds)

**How we avoid chaos:**
- One doc per topic (not many competing docs)
- Every doc has metadata: last_updated, owner, status
- Old docs go to archive/ immediately when superseded (never deleted)
- Folder README.md explains what's inside and who owns it

---

## Getting Help

**Questions about:**
- **The product** → `docs/DELIVERY_MODEL.md`
- **The roadmap** → `phases/PHASE_1.md` (or whatever phase we're in)
- **How to do X** → `operations/PROCESSES/` or `operations/RUNBOOKS.md`
- **Why we decided Y** → `DECISIONS.md`
- **Historical context** → `archive/`

**Questions about the codebase?** → See `CLAUDE.md`

---

**Last updated:** 2026-09-11  
**Maintained by:** Claude (structure & docs), Chase (decisions & direction)
