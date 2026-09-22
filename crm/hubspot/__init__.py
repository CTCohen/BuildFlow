"""HubSpot push connector (Track G, BUILD_TASKS.md §6).

One-way: Fornax lead/prospect (`admin.leads` / `admin.prospects`, per
`platform/CONTRACT.md`) -> HubSpot contact/deal. Mocked the same way
`billing/dunning/mocks.py` mocked Stripe/SendGrid — no real HubSpot account
exists yet (DECISIONS.md #12/#17, D22: HubSpot confirmed as first CRM;
TYLER_QUEUE.md still lists the HubSpot developer/private app as not created).

Spec: `crm/SPEC-09-crm-integration.md` (Section 2, 5B) and
`crm/SPEC-10-external-integrations.md` (line 89) — one-way push, 5-minute
batch cadence, retries 1s/5s/30s/5min up to 5 attempts, Tyler notified after
3 failures, sync paused after 5.
"""
