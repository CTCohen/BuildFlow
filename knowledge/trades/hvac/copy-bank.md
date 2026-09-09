---
id: hvac-copy-bank
type: trade-pack
trade: hvac
status: draft
source: [ref:no-ai-slop-skill, ref:hook-agency-contractor-web-2025]
last_reviewed: 2026-09-08
applies_to: [build]
links: [[anti-ai-slop-copy]] [[hvac-objection-handling]] [[page-service-detail]]
---

# HVAC copy bank

Patterns to adapt — **fill every bracket with a real fact from the business**. Never ship
a bracket. Rewrite in the owner's voice from their reviews (`derived_voice`).

## Headlines
- "`<City>` AC repair, done right the first time"
- "No cool air? We can be there `<today / same day / within N hours>`"
- "`<Brand>` furnace acting up? `<Business>` fixes it — `<n>` years in `<City>`"

## Hero sub
- "From a `<symptom>` to a full system replacement, `<Business>` shows up on time,
  quotes before we start, and cleans up when we leave."

## Direct answers (service page openers)
- "We repair `<AC / furnace>` problems across `<city list>`, usually same day. Most
  repairs run `<$range>`; diagnostics are `<$X / free with repair>`. Call `<phone>` or
  send the form."

## Symptom bullets (AC)
- Warm air from the vents · unit runs but house won't cool · frozen coil / ice on the
  lines · water around the furnace · loud buzzing or grinding · breaker keeps tripping ·
  bill jumped for no reason

## Proof lines (use real numbers)
- "`<n>` years serving `<metro>`" · "`<n>`+ `<Google>` reviews at `<rating>`★" ·
  "Licensed `<ROC #>`, bonded & insured" · "`<Brand>` `<factory-authorized>` dealer" ·
  "We answer the phone `<hours>` — you talk to a tech, not a call center"

## Offer lines
- "Financing available — `<0% for 12 months / $XX per month>` on qualifying systems"
- "Ask about federal tax credits and `<utility>` rebates on high-efficiency and heat-pump systems"
- "`<Plan name>`: `<$XX/yr>` — `<2 tune-ups, priority scheduling, 15% off repairs>`"

## Banned (see [[anti-ai-slop-copy]])
"unparalleled", "your trusted partner", "in today's world", "look no further",
"we pride ourselves", rule-of-three adjective stacks.

## Check
- QA anti-ai-slop grep: 0 hits. QA placeholder scan: 0 unfilled brackets.
- LLM "copy specificity" ≥ 4/5.
