# Testing strategy — BuildFlow (DRAFT — needs owner + help defining)

## What we know we need to test

| Area | What "good" means | How (TBD) |
|------|-------------------|-----------|
| Website output | Renders, no placeholders, forms work, feels alive | automated checks + human eyes |
| AI-agent integration | Clean, logged handoffs across the full process | integration tests on the pipeline |
| Speed | start→built, start→closed measured, trending down | timing instrumentation |
| E2E | Full pipeline runs on a real candidate safely | sandboxed end-to-end run |
| Auth + onboarding | Works, fails safe, no support call needed | scripted walkthrough |
| Discovery quality | Businesses are real, reachable, a genuine fit | sampled human review, hit-rate metric |
| Language (EN/ES) | Site operates correctly in either language | per-language output checks |

## Next step

Pick one area (suggest: website output) and define concrete pass/fail checks + tooling.
