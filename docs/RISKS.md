---
title: Risk Register
purpose: Known risks to the Fornax launch with an owner and a mitigation
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Risk register

| # | Risk | Likelihood / impact | Mitigation | Owner |
|---|---|---|---|---|
| 1 | Demo-to-customer conversion below 2% makes demo cost exceed LTV | Medium / High | Measure months 1-3; keep demo cost near zero; scale spend only under the CAC gate | Tyler |
| 2 | Cold-email compliance (CAN-SPAM, consent) and deliverability | Medium / High | Separate warmed sender domain, one-click unsubscribe, bounce under 5%, pause at 5% spam, email only; SMS cold outreach stays off | Loops + Tyler |
| 3 | Lead data terms (Apollo, Hunter, scraping) and provider terms (SendGrid cold email; Google/Yelp review display) | Medium / Medium | Read terms before volume; start on free tiers; verify review storage and display rules (D24) | Claude, Tyler |
| 4 | Publishing fabricated proof (testimonials, "customer results", simulation records naming a real business) | Low now / High | Banners on simulations; no invented proof on the website or in copy; real testimonials only | Claude |
| 5 | Anthropic subscription terms for unattended use; API cost runaway | Medium / Medium | Deterministic-first design, $30/mo cap, kill switch, per-agent caps (`docs/LLM_COST_AND_API_PLAN.md`); re-check Pro terms at setup | Claude |
| 6 | Public entry points abused for cost (demo builder, forms, chat) | Medium / Medium | Turnstile, per-IP and per-sender caps, daily generation cap, no per-request LLM | Claude |
| 7 | Single-founder capacity (15-20 hrs/week; day job) | High / High | Automate everything not a decision; `TYLER_QUEUE.md`; published support target 24-48 h; scaling wall near 100 customers | Tyler |
| 8 | Legal drafts published before counsel review; claims exceeding reality (certifications, encryption) | Medium / High | DRAFT banners; lawyer sign-off before first charge; claims limited to System 11 | Tyler |
| 9 | Data isolation failure between customers | Low / Very high | Row-level security, isolation tests before launch and regularly | Claude |
| 10 | Provider concentration and migration (Railway to Cloud Run; Cloudflare custom-domain limits at scale) | Medium / Medium | Containerize from day 1; verify Cloudflare limits before 1,000 domains | Claude |
| 11 | Astro per-site build time misses the 10-second generation target | Medium / Medium | Benchmark in week 2; parallel build queue; programmatic render if needed | Claude |
| 12 | Price increase after launch upsets early customers | Medium / Low | Versioned prices, launch-cohort flag, grandfathering decision (D02) | Tyler |
| 13 | Plaintext keys stored in a global instruction file; expired GitHub token | Medium / Medium | Move keys to a secret manager or `.env`; rotate | Tyler |
| 14 | Mid-Market demand arrives while paused | Low / Low | Waitlist page; revisit when SMB and Micro are stable | Tyler |
