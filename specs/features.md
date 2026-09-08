# Feature registry — BuildFlow

Status: `idea` | `building` | `live` | `blocked`

## Critical paths

### 1. Candidate discovery (AI-automated) — `building`
Find real service businesses that need a better/first website. Output: reachable business
records (name, vertical, location, contact, current web presence, why they're a fit).
De-dupe against prior contacts. Quality bar: a human agrees they're a fit.

### 2. Outreach — email + SMS (AI-automated) — `building`
Contact candidates. Sequenced, opt-out respecting, rate-limited. First reply from a
candidate hands off to a human. Copy changes require approval.

### 3. Human handoff — `idea`
On first candidate reply, package context and route to Chase. Traceable, logged.

### 4. Site generation (AI-automated) — `building`
Produce a complete, high-quality EN/ES site per candidate. No placeholders. Real
structure, copy, imagery. Drop-in replacement or first site.

### 5. Onboarding / go-live — `idea`
Business adopts the site and makes it live without a support call. Changes require approval.

### 6. Token accounting — `idea`
Every automated run reports tokens consumed to `metrics/`. Enforce per-run caps against
the Claude Pro budget.

## Supporting

- EN/ES correctness checks for generated sites
- Speed instrumentation: start→built, start→closed
