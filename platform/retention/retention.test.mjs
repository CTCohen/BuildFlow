import test from "node:test";
import assert from "node:assert/strict";
import { runRetentionPurge, requestDeletion, fulfillDeletionRequest, checkOverdueDeletions } from "./retention.mjs";

test("runRetentionPurge calls the SQL job and returns its counts", async () => {
  const calls = [];
  const result = { customers_purged: 2, leads_anonymized: 5, crm_sync_log_deleted: 10, crm_conflict_log_deleted: 3 };
  const db = { query: async (sql, p) => { calls.push({ sql, p }); return { rows: [{ result }] }; } };
  const out = await runRetentionPurge(db, "2026-09-21T00:00:00Z");
  assert.deepEqual(out, result);
  assert.ok(calls[0].sql.includes("purge_expired_data"));
  assert.equal(calls[0].p[0], "2026-09-21T00:00:00Z");
});

test("requestDeletion rejects an unknown subject type before hitting the db", async () => {
  const db = { query: async () => { throw new Error("should not be called"); } };
  await assert.rejects(() => requestDeletion(db, { subjectType: "prospect", subjectId: "x" }),
    /subjectType must be "customer" or "lead"/);
});

test("requestDeletion passes subjectType/subjectId/source through and returns the new id", async () => {
  const calls = [];
  const db = { query: async (sql, p) => { calls.push({ sql, p }); return { rows: [{ id: "req-1" }] }; } };
  const id = await requestDeletion(db, { subjectType: "customer", subjectId: "cust-1", source: "subject" }, "now");
  assert.equal(id, "req-1");
  assert.ok(calls[0].sql.includes("request_deletion"));
  assert.deepEqual(calls[0].p, ["customer", "cust-1", "subject", "now"]);
});

test("requestDeletion defaults source to 'subject'", async () => {
  const calls = [];
  const db = { query: async (sql, p) => { calls.push({ sql, p }); return { rows: [{ id: "req-2" }] }; } };
  await requestDeletion(db, { subjectType: "lead", subjectId: "lead-1" });
  assert.equal(calls[0].p[2], "subject");
});

test("fulfillDeletionRequest returns whatever the SQL function reports (method + sla_met)", async () => {
  const calls = [];
  const result = { customer_id: "cust-1", method: "hard_deleted", request_id: "req-1", sla_met: true };
  const db = { query: async (sql, p) => { calls.push({ sql, p }); return { rows: [{ result }] }; } };
  const out = await fulfillDeletionRequest(db, "req-1", "2026-10-01T00:00:00Z");
  assert.deepEqual(out, result);
  assert.ok(calls[0].sql.includes("fulfill_deletion_request"));
  assert.deepEqual(calls[0].p, ["req-1", "2026-10-01T00:00:00Z"]);
});

test("checkOverdueDeletions finds nothing due: no alerts, empty report", async () => {
  const calls = [];
  const db = { query: async (sql, p) => { calls.push({ sql, p }); return { rows: [] }; } };
  const out = await checkOverdueDeletions(db, "now");
  assert.deepEqual(out, []);
  assert.equal(calls.length, 1); // only the overdue lookup, no raise_alert call
});

test("checkOverdueDeletions raises one alert per overdue request and reports each", async () => {
  const calls = [];
  const overdue = [
    { id: "req-1", subject_type: "customer", subject_id: "cust-1", due_at: "2026-08-01T00:00:00Z" },
    { id: "req-2", subject_type: "lead", subject_id: "lead-9", due_at: "2026-08-05T00:00:00Z" },
  ];
  const db = {
    query: async (sql, p) => {
      calls.push({ sql, p });
      if (sql.includes("overdue_deletion_requests")) return { rows: overdue };
      return { rows: [{}] }; // raise_alert
    },
  };
  const out = await checkOverdueDeletions(db, "2026-09-21T00:00:00Z");
  assert.equal(out.length, 2);
  assert.deepEqual(out[0], { id: "req-1", subjectType: "customer", subjectId: "cust-1", dueAt: "2026-08-01T00:00:00Z" });

  const alertCalls = calls.filter((c) => c.sql.includes("raise_alert"));
  assert.equal(alertCalls.length, 2);
  assert.equal(alertCalls[0].p[0], "deletion-sla:req-1");
  assert.equal(alertCalls[0].p[1], "critical");
  assert.equal(alertCalls[0].p[2], "compliance");
  assert.ok(alertCalls[0].p[3].includes("req-1"));
});
