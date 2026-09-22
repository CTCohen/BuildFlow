// Per-customer hosting cost alert (platform/SPEC-03-hosting-infrastructure.md section 4:
// "alert if >$50/mo (margin risk)"; platform/SPEC-13-observability.md cost monitoring).
// Deterministic threshold check, no LLM.
//
// Same shape as platform/monitoring/monitor.mjs and platform/retention/retention.mjs: the
// decision (threshold, dedupe, raise/resolve) lives in SQL
// (platform/db/migrations/0006_hosting_cost_alert.sql), reusing admin.raise_alert/resolve_alert
// from 0004_monitoring.sql so this rides the same dispatcher (severity, channels, cadence)
// already built and tested there. This file only records a reading and reports what happened.
// `db` is any object with query(sql, params) -> { rows }.

export const HOSTING_COST_ALERT_THRESHOLD_USD = 50;

/** Record one customer's current hosting cost reading; raises/resolves the cost alert in the same call. */
export async function recordHostingCost(db, { customerId, costUsd, now = null }) {
  if (!customerId) throw new Error("recordHostingCost: customerId is required");
  if (typeof costUsd !== "number" || Number.isNaN(costUsd)) throw new Error("recordHostingCost: costUsd must be a number");
  const { rows } = await db.query("select admin.record_hosting_cost($1,$2,$3) as state", [customerId, costUsd, now]);
  return { customerId, costUsd, state: rows[0].state, threshold: HOSTING_COST_ALERT_THRESHOLD_USD };
}

/** Record a batch of per-customer readings (e.g. from a nightly Cloudflare/R2 billing pull). Never throws
 *  on one bad reading — reports it and keeps going, same "one failure doesn't stop the rest" rule as
 *  platform/monitoring/monitor.mjs's dispatchAlerts(). */
export async function recordHostingCostBatch(db, readings, now = null) {
  const results = [];
  for (const r of readings) {
    try {
      results.push({ ok: true, ...(await recordHostingCost(db, { ...r, now })) });
    } catch (err) {
      results.push({ ok: false, customerId: r.customerId, error: err.message });
    }
  }
  return results;
}
