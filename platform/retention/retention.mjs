// Data retention / deletion workflows (System 11 section 1; BUILD_TASKS.md §8).
// Same shape as platform/monitoring/monitor.mjs: the decisions (what's past its retention window, what a
// deletion request touches) live in SQL (db/migrations/0005_retention.sql) so they're testable with psql;
// this file is a thin runner around them plus the SLA-overdue alert hook.
// `db` is any object with query(sql, params) -> { rows }.

// Scheduled job: purge/anonymize everything past its stated retention window. Call nightly (or however
// operations/LOOPS.md schedules jobs in this codebase) — it is idempotent, safe to re-run.
export async function runRetentionPurge(db, now = null) {
  const { rows } = await db.query("select admin.purge_expired_data($1) as result", [now]);
  return rows[0].result;
}

// Deletion-request workflow, step 1: a customer or lead asks to be deleted. Logs the request with a due_at
// 45 days out (the CCPA fulfillment window in legal/SPEC-11-compliance-security.md section 1) and returns
// the request id so the caller (support tooling, admin dashboard) can track it.
export async function requestDeletion(db, { subjectType, subjectId, source = "subject" }, now = null) {
  if (!["customer", "lead"].includes(subjectType)) {
    throw new Error(`requestDeletion: subjectType must be "customer" or "lead", got ${subjectType}`);
  }
  const { rows } = await db.query("select admin.request_deletion($1,$2,$3,$4) as id",
    [subjectType, subjectId, source, now]);
  return rows[0].id;
}

// Deletion-request workflow, step 2: actually do it. Returns what was done (method) and whether the 45-day
// SLA was met — that return value plus the row it just wrote to admin.deletion_requests IS the compliance log.
export async function fulfillDeletionRequest(db, requestId, now = null) {
  const { rows } = await db.query("select admin.fulfill_deletion_request($1,$2) as result", [requestId, now]);
  return rows[0].result;
}

// SLA guard: find pending requests already past their due_at and raise an alert for each (reusing System
// 13's admin.raise_alert — a missed deletion deadline is exactly the kind of thing that pipeline exists for).
// Returns what it found so a caller/test can assert on it without needing a real alert channel.
export async function checkOverdueDeletions(db, now = null) {
  const { rows } = await db.query("select * from admin.overdue_deletion_requests($1)", [now]);
  const overdue = [];
  for (const r of rows) {
    await db.query("select admin.raise_alert($1,$2,$3,$4,$5,$6)", [
      `deletion-sla:${r.id}`,
      "critical",
      "compliance",
      `Deletion request ${r.id} (${r.subject_type}) is past its 45-day SLA`,
      `Due ${r.due_at}, subject_id ${r.subject_id}`,
      now,
    ]);
    overdue.push({ id: r.id, subjectType: r.subject_type, subjectId: r.subject_id, dueAt: r.due_at });
  }
  return overdue;
}
