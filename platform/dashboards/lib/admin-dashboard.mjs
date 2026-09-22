// Admin web dashboard (platform/SPEC-18-admin-crm-operations.md). Web-only at launch (spec override: the iOS
// photo-intake app is Phase 1.5, out of scope here). Pure view-model builders over CONTRACT.md row shapes +
// fixtures — no live Supabase wiring yet (same G3 gate as customer-dashboard.mjs).
//
// Pipeline stages per SPEC-18 section 1, MINUS "Trial Active" (spec override, 2026-09-18: no free trial, so
// that stage and the trial-conversion metric are removed) and MINUS Churn Risk/Churned folded into the health
// score / churn view instead of the funnel, per the same override's intent (no trial-conversion metric to
// anchor a Churn Risk funnel stage on). Funnel here: Identified -> Outreach Sent -> Demo Viewed ->
// Demo Conversion -> Customer.

export const PIPELINE_STAGES = [
  "identified",
  "outreach_sent",
  "demo_viewed",
  "demo_conversion",
  "customer",
];

// Section 1 -> maps CONTRACT.md rows (leads/prospects/demos/customers) into funnel counts + conversion %.
export function buildPipelineFunnel({ leads = [], prospects = [], demos = [], customers = [] }) {
  const counts = {
    identified: leads.length,
    outreach_sent: leads.filter((l) => l.status === "contacted" || l.status === "qualified").length,
    demo_viewed: demos.filter((d) => d.status === "viewed" || d.status === "converted").length,
    demo_conversion: demos.filter((d) => d.status === "converted").length,
    customer: customers.length,
  };
  const stages = PIPELINE_STAGES.map((stage, i) => {
    const prevCount = i === 0 ? counts[stage] : counts[PIPELINE_STAGES[i - 1]];
    const conversionPct = prevCount > 0 ? Math.round((counts[stage] / prevCount) * 1000) / 10 : 0;
    return { stage, count: counts[stage], conversionFromPrevPct: i === 0 ? 100 : conversionPct };
  });
  return { stages, stuckDeals: findStuckDeals(prospects) };
}

// "stuck-deal alerts" (SPEC-18 section 1). A prospect is stuck if a demo was generated 14+ days ago with no
// conversion and no recent follow-up. `now` is injectable for tests.
export function findStuckDeals(prospects, now = new Date()) {
  const STUCK_AFTER_DAYS = 14;
  return prospects
    .filter((p) => p.demo_generated_at && !p.demo_converted_at)
    .filter((p) => {
      const generatedAt = new Date(p.demo_generated_at);
      const ageDays = (now - generatedAt) / (1000 * 60 * 60 * 24);
      const lastTouch = p.next_follow_up_date ? new Date(p.next_follow_up_date) : generatedAt;
      return ageDays >= STUCK_AFTER_DAYS && lastTouch <= now;
    })
    .map((p) => ({ prospectId: p.id, leadId: p.lead_id, demoGeneratedAt: p.demo_generated_at }));
}

// Customer record view (SPEC-18 section 1's "Customer record fields") built from CONTRACT.md's
// app.customers + admin.customer_admin + app.subscriptions, joined by customer_id.
export function buildCustomerRecord(customer, customerAdmin, subscription) {
  return {
    customerId: customer.id,
    companyName: customer.name,
    email: customer.email,
    domain: customer.domain,
    tier: customer.tier,
    startedDate: customer.created_at,
    churnDate: customer.churn_date ?? null,
    subscriptionStatus: subscription?.payment_status ?? null,
    monthlyChargeCents: subscription?.monthly_price_cents ?? null,
    renewalDate: subscription?.next_billing_date ?? null,
    ltvCents: customerAdmin?.ltv_cents ?? null,
    phone: customerAdmin?.phone ?? null,
    paymentStatus: customerAdmin?.payment_status ?? null,
    notes: customerAdmin?.notes ?? "",
  };
}

// Health score (System 4 / SPEC-18 section 4 — the canonical formula System 12 reuses). Weighted 0-100:
// Engagement 40%, Payment 30%, Retention Signals 20%, Growth 10%. Each component is pre-normalized 0-100 by
// the caller (agent-owned scoring, not this dashboard layer) — this function only applies the weights and
// the banding, so it stays a pure, easily-tested presentation function.
export function computeHealthScore({ engagement, payment, retention, growth }) {
  for (const [name, v] of Object.entries({ engagement, payment, retention, growth })) {
    if (typeof v !== "number" || v < 0 || v > 100) {
      throw new Error(`computeHealthScore: "${name}" must be a number 0-100, got ${v}`);
    }
  }
  const score = Math.round(engagement * 0.4 + payment * 0.3 + retention * 0.2 + growth * 0.1);
  const band = score >= 80 ? "healthy" : score >= 60 ? "at-risk" : "churning";
  return { score, band };
}

// Revenue dashboard (SPEC-18 section 3), minus Trial Conversion Rate (spec override) and Mid-Market
// breakdown (spec override: Mid-Market reporting deferred). Built from app.subscriptions rows.
export function buildRevenueDashboard(subscriptions) {
  const active = subscriptions.filter((s) => s.payment_status === "active");
  const mrrCents = active.reduce((sum, s) =>
    sum + (s.billing_cycle === "annual" ? Math.round(s.monthly_price_cents) : s.monthly_price_cents), 0);
  const arrCents = mrrCents * 12;
  const activeCustomers = active.length;
  const churned = subscriptions.filter((s) => s.payment_status === "canceled").length;
  const totalEverActive = activeCustomers + churned;
  const churnRatePct = totalEverActive > 0 ? Math.round((churned / totalEverActive) * 1000) / 10 : 0;
  const arpuCents = activeCustomers > 0 ? Math.round(mrrCents / activeCustomers) : 0;

  const byTier = {};
  for (const tier of ["micro", "smb"]) { // mid-market excluded per spec override
    const tierSubs = active.filter((s) => s.tier === tier);
    const tierMrr = tierSubs.reduce((sum, s) => sum + s.monthly_price_cents, 0);
    byTier[tier] = {
      customerCount: tierSubs.length,
      mrrCents: tierMrr,
      pctOfBase: activeCustomers > 0 ? Math.round((tierSubs.length / activeCustomers) * 1000) / 10 : 0,
    };
  }

  return { mrrCents, arrCents, activeCustomers, churnRatePct, arpuCents, byTier };
}

// Alerts view (SPEC-18 section 6 + platform/CONTRACT.md admin.alerts). Groups open/acknowledged alerts by
// severity for the dashboard's alert card; resolved alerts are dropped (contract: kept 7 days post-resolve
// for audit, but not shown as active).
export function buildAlertsView(alerts) {
  const active = alerts.filter((a) => a.status !== "resolved");
  const bySeverity = { critical: [], warning: [], info: [] };
  for (const a of active) {
    if (!bySeverity[a.severity]) throw new Error(`buildAlertsView: unknown severity "${a.severity}"`);
    bySeverity[a.severity].push({
      dedupeKey: a.dedupe_key,
      title: a.title,
      detail: a.detail,
      status: a.status,
      occurrences: a.occurrences,
      firstSeenAt: a.first_seen_at,
      lastSeenAt: a.last_seen_at,
    });
  }
  return { counts: { critical: bySeverity.critical.length, warning: bySeverity.warning.length, info: bySeverity.info.length }, bySeverity };
}
