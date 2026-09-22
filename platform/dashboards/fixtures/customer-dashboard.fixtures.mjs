// Mock/fixture rows shaped exactly per platform/CONTRACT.md app.* tables — used until Supabase's service
// role key exists (COORDINATOR_STATE.md gate G3). Not wired to a live database.

export const formSubmissions = [
  {
    id: "fs-1", customer_id: "cust-1", website_id: "web-1",
    prospect_name: "Alice Rivera", prospect_email: "alice@example.com", prospect_phone: "555-0101",
    message: "Need a quote for a bathroom remodel.", submitted_at: "2026-09-20T14:00:00Z",
    synced_to_crm_at: null, crm_sync_status: "pending", crm_error_message: null,
    pipeline_stage: "new", notes: "",
  },
  {
    id: "fs-2", customer_id: "cust-1", website_id: "web-1",
    prospect_name: "Bob Chen", prospect_email: "bob@example.com", prospect_phone: "555-0102",
    message: "Leaky faucet, ASAP.", submitted_at: "2026-09-19T09:30:00Z",
    synced_to_crm_at: "2026-09-19T09:31:00Z", crm_sync_status: "synced", crm_error_message: null,
    pipeline_stage: "contacted", notes: "Called, scheduled for Friday.",
  },
  {
    id: "fs-3", customer_id: "cust-1", website_id: "web-1",
    prospect_name: "Carla Diaz", prospect_email: "carla@example.com", prospect_phone: "555-0103",
    message: "Water heater install.", submitted_at: "2026-09-15T11:00:00Z",
    synced_to_crm_at: "2026-09-15T11:01:00Z", crm_sync_status: "synced", crm_error_message: null,
    pipeline_stage: "converted", notes: "Signed, job booked.",
  },
];

export const crmIntegration = {
  id: "crm-1", customer_id: "cust-1", crm_type: "hubspot",
  auth_token_encrypted: Buffer.from("secret-token"),
  sync_status: "active", last_sync_at: "2026-09-21T00:00:00Z",
  leads_sent: 12, sync_errors_count: 0,
  created_at: "2026-08-01T00:00:00Z", updated_at: "2026-09-21T00:00:00Z",
};
