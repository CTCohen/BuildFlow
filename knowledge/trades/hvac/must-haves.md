---
id: hvac-must-haves
type: trade-pack
trade: hvac
status: draft
source: [ref:hook-agency-contractor-web-2025, ref:servicetitan-hvac-marketing, ref:google-localbusiness-schema]
last_reviewed: 2026-09-08
applies_to: [build, seo]
links: [[hvac-page-map]] [[hvac-trust-signals]] [[hvac-objection-handling]] [[local-seo]]
---

# HVAC website must-haves

## Rule
Above the fold, on mobile, in this order: business name, "AC & heating repair in
<city>", tap-to-call button, "same-day service" / emergency availability, star rating +
review count. Sticky tap-to-call bar persists on scroll.

Must be present somewhere on the site:
- **License #** and "licensed, bonded & insured" (AZ: ROC license number).
- **Years in business** and **service-area list** (name the suburbs, not just "metro").
- **Symptom-framed service pages**: "AC not cooling", "AC blowing warm air", "furnace
  won't ignite", "no heat", "strange noises", "high energy bills" — these match how
  people search. Link them from a services hub.
- **Financing** — named provider + "0% for 12 months" style offer, and a line on
  federal tax credits / utility rebates for high-efficiency and heat-pump systems
  (large ticket; AZ buyers care).
- **Maintenance plan / membership** offer with price and what's included.
- **Trust badges**: NATE-certified, EPA 608, BBB, and manufacturer dealer status
  (Trane / Carrier / Lennox / Goodman) — only the ones the business actually holds.
- **Embedded Google reviews** (real, pulled at build) + 2–3 pulled-quote testimonials.
- **Short quote form**: name, phone, address, "what's going on?" — 4 fields, no more.
- **Real photos**: trucks, techs, install jobs. No stock people. (If none available,
  flag for the human — do not ship stock headshots.)

## Why
HVAC is an urgency + high-ticket purchase. Buyers decide fast on: are they local, are
they licensed, can they come today, and can I afford it. Symptom pages capture the
long-tail search intent that generic "HVAC services" pages miss. (ref:hook-agency-contractor-web-2025)

## Check
- QA: index.html above-the-fold contains phone `tel:` link, city string, rating, and
  an "emergency"/"same-day" token.
- QA: at least 4 symptom service pages exist and are linked from `/services`.
- QA: financing section present; maintenance-plan section present.
- Schema: valid `HVACBusiness` (see [[hvac-schema]]).
- Reviewer: every badge shown is one the business actually holds (spot-check against
  their GBP / current site).
