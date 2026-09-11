# Launch Roadmap — what's between here and a tight, strong launch

> Pre-launch hardening plan. Distinct from `PHASE_1_BLOCKERS.md` (which tracks what's
> blocking the *first 5 outreach emails*). This tracks what's blocking a launch you'd
> point real volume at with confidence. Last updated: 2026-09-10.

**Current foundation (already real, not aspirational):**
- Multi-tenant Astro app with a design-decision engine (`app/src/lib/design-decision-engine.ts`,
  `agent-decisions.ts`, `conditional-features.ts`) and a token system
- Automated per-client QA gate (`app/scripts/qa.mjs`) with 9 checks incl. an LLM rubric pass
- `knowledge/` base: trade-specific SEO/content knowledge (HVAC fully built), SOPs, principles
- Legal (Terms/Privacy/Security), reconciled sales + messaging stack, BuildFlow.com site (built, undeployed)
- Competitive research (`research/COMPETITIVE-ANALYSIS.md`), delivery model with real market pricing rationale

**What "launch" means here:** ready to run outreach at real volume (50+/week) and have every
resulting site, onboarding, and cancellation handled without Chase doing manual one-offs.

---

## 1. Website: perfect it + automate onboarding + automate offboarding

### 1a. BuildFlow.com — remaining polish
- [ ] Deploy to Railway, point `buildflow.com` once domain is confirmed (see Blockers B5)
- [ ] Replace `mailto:` CTAs and the Formspree placeholder with a real signup flow (ties to §5 billing)
- [ ] Add real case studies once Phase 1 sites exist (the 3 on the page today are illustrative, not real — label them as such or swap in real ones the moment they exist)
- [ ] `og:image` referenced in `Layout.astro` doesn't exist yet — needed for link previews when emails get forwarded/shared

### 1b. Automated onboarding (Managed Growth — recurring clients)
**Today:** 5 video scripts + email sequence exist as content, but nothing *triggers* them. A human has to notice a close happened and manually send things.

- [ ] Trigger: Stripe subscription `checkout.session.completed` webhook → kicks off Day 0 sequence automatically
- [ ] Day 0: welcome email + intake form (business info, logo upload, photos, services, hours) — currently this is "email us your info," should be a form that writes straight into `content/<slug>/`
- [ ] Day 1–3: automated build using `new-client.mjs` scaffold + design-decision-engine, gated by `qa.mjs` before anything is shown to the client
- [ ] Day 3–5: preview link auto-sent, approve/request-changes captured (not just "reply if you don't like it")
- [ ] Day 7: auto-launch if approved or no response (per `operations/SITE-BUILD-WORKFLOW.md`'s existing "approved by inaction" rule) + onboarding video emails fire on schedule
- [ ] Ongoing: monthly check-in email auto-scheduled; content-edit requests (email in) need a lightweight intake → apply → confirm loop, not ad hoc
- [ ] Failure path: what happens if intake form is never completed? Needs a nudge sequence + a hard stop (don't build on missing/garbage data — `qa.mjs` check 3 already blocks this, good)

### 1c. Automated offboarding — **does not exist yet, needs to be built from scratch**
Two distinct offboarding paths, currently undocumented:

- [ ] **Ownership plan (the $497 one-timer):** define the actual export mechanism. What does "static export to their own host" mean technically — a zip of built HTML/CSS/assets? A one-click deploy to Netlify/Vercel under their account? Needs a real script, not a promise in the Terms. Plus: 1-month transition-support tracking (who pings them, when does support end, what's the "you're on your own now" email).
- [ ] **Managed Growth cancellation:** Terms say "site goes offline at end of paid period" — needs an actual automated flow: cancellation received → confirmation email → site stays live until period end → auto-takedown → win-back email at +30/+60 days → optional paid static-export-on-cancel (upsell to Ownership pricing, per Terms §4)
- [ ] Data retention/deletion on offboarding — Privacy Policy commits to specific handling; nothing automated enforces it yet

**This is a real gap.** Legal docs already promise both flows exist; right now neither is automated, and Ownership's export mechanism isn't even specified technically.

---

## 2. SEO & AI SEO

**Today:** `knowledge/principles/local-seo.md`, `ai-seo.md` and `knowledge/sops/seo-audit.md`,
`ai-seo-setup.md` exist — but they're short (~30 lines each) human-run playbooks, not automated
per-client execution. Nothing runs these against a generated site automatically.

- [ ] Turn `seo-audit.md` and `ai-seo-setup.md` from SOPs into scripted checks — fold into `qa.mjs` (schema markup present, meta tags complete, sitemap/robots.txt correct, canonical tags, structured data for LocalBusiness/Service) rather than a human reading a checklist per client
- [ ] Google Business Profile: today it's "we provide guidance in onboarding videos" — decide whether BuildFlow claims/manages it directly (stronger offer, more liability) or stays guidance-only (weaker, but matches "we promise machinery not results")
- [ ] AI-search optimization ("AI SEO" is in the priced offer) — needs a concrete, defensible definition: llms.txt (already exists at `app/src/pages/llms.txt.ts` — good), structured FAQ schema, clear entity/NAP consistency. Write down what BuildFlow actually *does* here before selling it as a line item.
- [ ] `knowledge/trades/hvac/` is fully built out (must-haves, keyword-map, page-map, trust-signals, seasonal). **Only HVAC.** Plumbing, electrical, roofing, cleaning, etc. need the same depth before outreach expands past HVAC — right now quality is trade-uneven.
- [ ] Ongoing SEO (the recurring part of the $99/mo promise) needs a monthly automated task per client, not a one-time setup — currently nothing runs "ongoing."

---

## 3. Automated site generation — make "very high quality" the normal result, not the best case

**Today:** design-decision-engine + token system + QA gate + LLM rubric are real and reasonably
sophisticated. The gap is **calibration against real output**, which can't happen without real
clients — this is a chicken-and-egg the roadmap has to name honestly.

- [ ] Run the pipeline end-to-end on 5–10 *synthetic* businesses across different trades (not just HVAC) before the first real client — catch failure modes now, not on a paying customer's site
- [ ] Tighten `qa.mjs`'s LLM rubric thresholds using those synthetic runs — right now the thresholds are set from the plan, not from observed output distribution
- [ ] Visual regression baseline (`routines/testing.md` calls for Playwright screenshots against baselines) — confirm this is actually wired into CI, not just described
- [ ] Decide the human-review gate: does every site get a human glance before going live in Phase 1 (likely yes, at this volume), and when does that stop being required as trust in the automation grows?
- [ ] Logo-first design extraction (`design/LOGO-FIRST-DESIGN.md`) — confirm this is implemented in `design-decision-engine.ts` or still aspirational; it's a named differentiator in the plan and needs to actually run

---

## 4. Business plan & market research

**Today:** `docs/delivery-model.md` has real pricing rationale from market research;
`research/COMPETITIVE-ANALYSIS.md` exists. What's missing is a single coherent plan a buyer,
partner, or Chase-in-six-months could read end to end.

- [ ] **Unit economics doc:** cost to acquire (time per close × hourly value), cost to serve (hosting cost/client, support time/client/month), margin at $99/mo and at $497, breakeven client count, churn assumption and its effect on LTV. None of this is written down as numbers yet.
- [ ] **TAM/SAM/SOM** — how many HVAC/plumbing/electrical/etc. businesses in target metros lack a good site; realistic capture rate. `research/COMPETITIVE-ANALYSIS.md` has competitor detail but not market sizing.
- [ ] **Capacity plan** — how many concurrent Managed Growth clients can one person (Chase) support at acceptable quality before support automation (Phase 3–4 in `ROADMAP_PHASES_1-6.md`) becomes mandatory, not optional
- [ ] **Churn/retention plan** — $99/mo only works if churn is low; nothing currently addresses why a client stays past month 2 beyond "we handle their edits"
- [ ] **Consolidate into one document** — right now business logic is spread across `delivery-model.md`, `CLAUDE.md`, `ROADMAP_PHASES_1-6.md`, `GOVERNANCE.md`, and this file. A single `BUSINESS_PLAN.md` that a bank, investor, or acquirer could read cold doesn't exist yet.

---

## 5. Other pre-launch essentials (not explicitly asked for, but load-bearing)

- [ ] **Billing automation** — Stripe subscription + one-time products don't exist yet (Blocker B3). Failed-payment handling, dunning, and the suspend-after-10-days rule in the Terms need to actually run, not just be written down.
- [ ] **A real pipeline/CRM** — prospect tracking is currently markdown tables (`outreach/PROSPECT_LIST_PHASE_1.md`). Fine for 5 prospects, breaks at 50+/week. Needs at minimum an Airtable base (already the stated Phase 1 tool per `CLAUDE.md`) actually set up, not just referenced.
- [ ] **Monitoring/uptime** — the Terms promise 99.5% uptime and 48-hour breach notification. Nothing currently watches for either. Minimum: uptime pings per client domain, an alert channel.
- [ ] **Support intake** — `support@buildflow.com` is promised with 24–48hr response in the Terms. Needs to actually route somewhere Chase checks, ideally with a lightweight ticket/thread tracker so nothing falls through at 10+ clients.
- [ ] **Backup/disaster recovery** — Terms promise daily backups retained 30 days. Confirm Railway/whatever host actually does this, or it's a liability, not a feature.
- [ ] **A soft-launch cohort** — before opening the floodgates, is there a plan to run the first 5–10 clients (Phase 1 itself) as a deliberate calibration cohort with extra hand-holding, explicitly to surface the gaps in §1–3 before scaling outreach volume?

---

## Suggested sequencing

1. **Now → before first close:** §1b trigger + intake automation (can't onboard a real client cleanly without it), §5 billing (can't collect money without it), §3 synthetic-business dry runs (cheap insurance before a real client sees the output)
2. **Before scaling past ~10 clients:** §1c offboarding (someone *will* cancel), §2 SEO automation + multi-trade knowledge depth, §4 unit economics + capacity plan (need real numbers to know if scaling is even a good idea)
3. **Before scaling past ~30–50 clients:** §5 monitoring, support ticketing, real CRM — this is roughly where Phase 3–4 automation from `ROADMAP_PHASES_1-6.md` becomes mandatory rather than nice-to-have

**Note on Phase 1 vs this roadmap:** none of §1c, §2's automation, §3's calibration, or §4's
unit economics has to be *finished* before sending the first 5 emails — but §1b (onboarding
trigger) and §5 (billing) do, because the moment someone says yes, there's currently no
automated path to actually deliver and bill them.
