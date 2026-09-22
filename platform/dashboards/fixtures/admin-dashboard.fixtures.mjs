// Mock/fixture rows shaped per platform/CONTRACT.md admin.* / app.* tables. Not wired to a live database.

export const leads = [
  { id: "lead-1", status: "new" },
  { id: "lead-2", status: "contacted" },
  { id: "lead-3", status: "qualified" },
  { id: "lead-4", status: "new" },
];

export const prospects = [
  {
    id: "pros-1", lead_id: "lead-2",
    demo_generated_at: "2026-08-20T00:00:00Z", demo_viewed_at: "2026-08-21T00:00:00Z",
    demo_converted_at: null, next_follow_up_date: "2026-08-25T00:00:00Z", customer_id: null,
  },
  {
    id: "pros-2", lead_id: "lead-3",
    demo_generated_at: "2026-09-01T00:00:00Z", demo_viewed_at: "2026-09-02T00:00:00Z",
    demo_converted_at: "2026-09-05T00:00:00Z", next_follow_up_date: null, customer_id: "cust-1",
  },
];

export const demos = [
  { id: "demo-1", prospect_id: "pros-1", status: "viewed" },
  { id: "demo-2", prospect_id: "pros-2", status: "converted" },
];

export const customers = [
  { id: "cust-1", name: "Rivera Plumbing", email: "owner@riveraplumbing.com", domain: "riveraplumbing.com", tier: "smb", created_at: "2026-09-05T00:00:00Z", churn_date: null },
];

export const customerAdmin = {
  customer_id: "cust-1", ltv_cents: 249000, phone: "555-0199", payment_status: "current", notes: "Great customer, referred two leads.",
};

export const subscriptions = [
  { id: "sub-1", customer_id: "cust-1", tier: "smb", billing_cycle: "monthly", monthly_price_cents: 24900, payment_status: "active", next_billing_date: "2026-10-05T00:00:00Z" },
  { id: "sub-2", customer_id: "cust-2", tier: "micro", billing_cycle: "monthly", monthly_price_cents: 14900, payment_status: "active", next_billing_date: "2026-10-02T00:00:00Z" },
  { id: "sub-3", customer_id: "cust-3", tier: "smb", billing_cycle: "monthly", monthly_price_cents: 24900, payment_status: "canceled", next_billing_date: null },
];

export const alerts = [
  { dedupe_key: "crm-sync-down:hubspot", severity: "critical", category: "crm", title: "CRM sync failing", detail: "2 customers affected", status: "open", occurrences: 3, first_seen_at: "2026-09-21T10:00:00Z", last_seen_at: "2026-09-21T12:00:00Z" },
  { dedupe_key: "churn-risk:cust-9", severity: "warning", category: "health", title: "High-value churn risk", detail: "Health score dropped to 55", status: "acknowledged", occurrences: 1, first_seen_at: "2026-09-20T00:00:00Z", last_seen_at: "2026-09-20T00:00:00Z" },
  { dedupe_key: "nps-trend", severity: "info", category: "nps", title: "NPS trending negative", detail: "-4 over 30 days", status: "resolved", occurrences: 1, first_seen_at: "2026-09-10T00:00:00Z", last_seen_at: "2026-09-10T00:00:00Z" },
];
