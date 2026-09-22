// Fictitious sample data for the sandbox/demo-embed dashboard (BUILD_TASKS.md §7 "Sandbox
// dashboard (read-only demo embed)"). Deliberately separate from customer-dashboard.fixtures.mjs
// and admin-dashboard.fixtures.mjs, which shape *test* fixtures — this file is what a real
// prospect sees embedded in their demo, so every name/email/phone here must read as obviously
// invented, never as something that could be mistaken for a real lead or customer.

export const SAMPLE_FORM_SUBMISSIONS = [
  {
    id: "sample-1", customer_id: "sample-customer", website_id: "sample-site",
    prospect_name: "Jordan Sample", prospect_email: "jordan@example.com", prospect_phone: "555-0100",
    message: "Sample lead: interested in a free estimate for a kitchen remodel.",
    submitted_at: "2026-09-20T15:00:00Z", crm_sync_status: "synced", pipeline_stage: "new", notes: "",
  },
  {
    id: "sample-2", customer_id: "sample-customer", website_id: "sample-site",
    prospect_name: "Taylor Example", prospect_email: "taylor@example.com", prospect_phone: "555-0101",
    message: "Sample lead: AC not cooling, need service this week.",
    submitted_at: "2026-09-19T10:00:00Z", crm_sync_status: "synced", pipeline_stage: "contacted",
    notes: "Sample note: called back, scheduled Thursday.",
  },
  {
    id: "sample-3", customer_id: "sample-customer", website_id: "sample-site",
    prospect_name: "Morgan Demo", prospect_email: "morgan@example.com", prospect_phone: "555-0102",
    message: "Sample lead: water heater replacement quote.",
    submitted_at: "2026-09-16T08:00:00Z", crm_sync_status: "synced", pipeline_stage: "converted",
    notes: "Sample note: booked, deposit paid.",
  },
];

export const SAMPLE_CRM_INTEGRATION = {
  id: "sample-crm", customer_id: "sample-customer", crm_type: "hubspot",
  auth_token_encrypted: Buffer.from("not-a-real-token"),
  sync_status: "active", last_sync_at: "2026-09-21T00:00:00Z", leads_sent: 3, sync_errors_count: 0,
};

// Demo tracking sample events, shaped like admin.demo_tracking_events rows (0007_demo_tracking.sql),
// for the "here's what your analytics will look like" preview inside the sandbox dashboard.
export const SAMPLE_DEMO_EVENTS = [
  { demo_id: "sample-demo", session_id: "s1", event_type: "view", payload: { device: "mobile", referrer: "email" } },
  { demo_id: "sample-demo", session_id: "s1", event_type: "scroll_depth", payload: { pct: 25 } },
  { demo_id: "sample-demo", session_id: "s1", event_type: "scroll_depth", payload: { pct: 50 } },
  { demo_id: "sample-demo", session_id: "s1", event_type: "section_click", payload: { section: "pricing" } },
  { demo_id: "sample-demo", session_id: "s2", event_type: "view", payload: { device: "desktop", referrer: "direct" } },
  { demo_id: "sample-demo", session_id: "s2", event_type: "scroll_depth", payload: { pct: 100 } },
  { demo_id: "sample-demo", session_id: "s2", event_type: "form_interaction", payload: { field: "email", action: "focus" } },
];
