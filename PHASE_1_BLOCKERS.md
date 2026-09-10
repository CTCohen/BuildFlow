# Phase 1 — Blockers

> Everything standing between "prep done" and "outreach going out." Pulled out of the
> scattered PHASE_1_*.md files and session notes into one place.
> Last updated: 2026-09-10

Phase 1 target: 5–10 customers on a plan, 3–5 live sites, real revenue, 3–5 testimonials.

---

## ✅ Resolved

| # | Blocker | Resolution |
|---|---------|-----------|
| R1 | Pricing model contradiction — legal docs + sales script + messaging pitched a superseded `$375/$595 one-time` model that contradicts `docs/delivery-model.md` and `CLAUDE.md` ($99/mo Managed Growth default, $497 one-time Ownership downsell). Would have blown up a live sales call. | `legal/` reconciled — commit `9ee7f8e`. Sales script + email/SMS hooks + onboarding sequences + site-build workflow reconciled — commit `aff977b`. |

---

## 🔴 Open — needs Chase (external accounts / actions only he can do)

| # | Blocker | What's needed | Blocks |
|---|---------|---------------|--------|
| B1 | **Calendly link doesn't exist** | Create a booking link (5-min "BuildFlow intro call" event). Then replace `[CALENDLY_LINK]` / `[CALENDAR_LINK]` placeholders in `outreach/REAL_PROSPECTS_READY_TO_SEND.md`, `outreach/EMAIL-SENDING-READY.md`, `messaging/*`. | All outreach |
| B2 | **Outreach not sent** | Send the 5 personalized emails in `outreach/REAL_PROSPECTS_READY_TO_SEND.md` from Chase's real address. | Entire sales cycle |
| B3 | **Stripe products not created** | Create in Stripe: (a) $99/mo recurring subscription "Managed Growth", (b) $497 one-time "Ownership". Grab the hosted checkout / payment links. Sales script + onboarding reference "signup link". | Closing / collecting revenue |
| B4 | **Business email addresses** | `hello@`, `support@`, `legal@`, and `chase@buildflow.com` referenced across legal docs, website, onboarding, sales script. Need to actually exist and forward somewhere. | Credibility on first reply; legal doc validity |
| B5 | **Domain `buildflow.com`** | Confirm it's registered to Chase and DNS is pointable to Railway. If taken, decide fallback (`buildflow.xyz` etc.) and update `astro.config.mjs` `site`, all doc references, email domain. | Website deploy; email addresses; email portfolio links (`buildflow.com/samples/hvac`) |
| B6 | **Business address in Terms** | `legal/TERMS_OF_SERVICE.md` §16 has `[add business address before first send]`. Needs a real address (or registered-agent address) before the doc is shown to a prospect. | Sending legal docs to first lead |

---

## 🟡 Open — needs a decision from Chase

| # | Blocker | The call |
|---|---------|----------|
| D1 | **"Theme 2: Ownership" messaging pillar** in `messaging/EMAIL-HOOKS.md` still frames the pitch around "you own the website / you own the leads". Under Managed Growth we host and retain the code — leading with "you own it" undercuts the subscription. | Keep it (reframe as "your domain, your leads, your content" — true under B) or drop it and lead on "we run it for you". Not blocking the 5 price-neutral prospect emails. |
| D2 | **`outreach/PHASE_1_EXECUTED_EXAMPLE.md`** is a fictional worked-example narrative still written on the $375 one-time model, with invented customer/dates/payment. | Update it to the $99/mo model as an illustrative example, or move it to `archive/` so it's not mistaken for real execution. |

---

## 🟢 Open — Claude can do (no user input needed)

| # | Blocker | Status |
|---|---------|--------|
| C1 | **BuildFlow.com website** — existing `website/` scaffold is built on the old $375/no-monthly-fees model; wrong offer, wrong FAQ, wrong pricing cards. | Rebuilding now to the $99/mo Managed Growth model + $497 Ownership. |
| C2 | **Website legal pages** — footer links to `/legal/terms` and `/legal/privacy` which don't exist as routes. | Add as part of C1 (render from `legal/*.md`). |
| C3 | **Deploy website** — Railway service + custom domain. Depends on B5 (domain) for the custom-domain step; the Railway `*.up.railway.app` URL can go live before that. | After C1. |

---

## Dependency order

```
R1 ✅
 └─ C1 (website rebuild)  ──►  C2 (legal pages)  ──►  C3 (deploy to railway URL)
 B5 (domain) ──────────────────────────────────────►  C3 (custom domain)  ──►  B4 (email @ that domain)
 B1 (calendly) ─┐
 B6 (address)  ─┼─►  B2 (send 5 emails)  ──►  [replies]  ──►  calls (B3 stripe)  ──►  closes  ──►  site builds  ──►  testimonials
 D1, D2 (decisions) ─┘  (D1 not strictly blocking B2)
```

**Critical path to first revenue:** B1 + B6 → B2 → replies → B3 → close → build → launch.
Everything in the 🟢 group is parallel and doesn't gate B2.
