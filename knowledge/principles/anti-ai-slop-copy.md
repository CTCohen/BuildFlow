---
id: anti-ai-slop-copy
type: principle
status: active
source: [ref:no-ai-slop-skill]
last_reviewed: 2026-09-08
applies_to: [build, managed]
links: [[web-design]] [[conversion]]
---

# Copy that sounds like the owner, not a model

## Rule
- Write from the business's own review language and services. Every claim must be
  something *this* business could truthfully say.
- Ban these patterns: "It's not X, it's Y." · "In today's fast-paced world" · "Look no
  further" · "We pride ourselves on" · "unparalleled / unmatched / world-class" ·
  "your trusted partner" · rule-of-three adjective stacks · em-dash drama · "Whether
  you need A, B, or C, we've got you covered."
- Concrete over abstract: "We answer the phone by the third ring, 6am–8pm" beats "We're
  committed to responsive service."
- Name real things: neighborhoods, brands serviced, permit/licensing bodies, actual
  warranty length, actual response window.
- Headlines state place + trade + promise. No "Welcome to our website."
- Short sentences. Second person. Active voice. One idea per line.

## Why
Service-business owners and their customers can smell generated copy, and it reads as
"another out-of-town marketing company." Specificity is the trust signal. (ref:no-ai-slop-skill)

## Check
- Grep the rendered site for the banned phrases → zero hits (QA gate step "placeholders"
  extended with this list).
- LLM rubric "copy specificity" ≥ 4/5: reviewer can name three facts on the page that
  are true only of this business.
