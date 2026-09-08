# Tech stack — BuildFlow (DECISION PENDING)

Requirement: one clear stack for a solo operator — cheap to run, simple to maintain,
won't force a rewrite as the business grows.

## Open questions

- Site generation: static-site output (templated) vs. app-rendered? Hosting target?
- Where do generated client sites live? (per-client subdomain, their domain, our platform)
- Discovery: data source(s) for finding businesses
- Outreach: email provider + SMS provider (deliverability, cost, opt-out handling)
- Datastore for candidates / pipeline state
- Orchestration for the AI agents (discovery, outreach, site-gen) + token metering hook

## Decisions log

_Record each locked choice here with date + rationale._
