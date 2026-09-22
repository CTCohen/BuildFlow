import test from "node:test";
import assert from "node:assert/strict";
import { recordHostingCost, recordHostingCostBatch, HOSTING_COST_ALERT_THRESHOLD_USD } from "./cost-alert.mjs";

test("recordHostingCost: calls the SQL decision function with customer, cost, and clock", async () => {
  const calls = [];
  const db = { query: async (sql, p) => { calls.push({ sql, p }); return { rows: [{ state: "ok" }] }; } };
  const res = await recordHostingCost(db, { customerId: "c1", costUsd: 12.5, now: "2026-01-01T00:00:00Z" });
  assert.equal(res.state, "ok");
  assert.equal(res.threshold, HOSTING_COST_ALERT_THRESHOLD_USD);
  assert.ok(calls[0].sql.includes("record_hosting_cost"));
  assert.deepEqual(calls[0].p, ["c1", 12.5, "2026-01-01T00:00:00Z"]);
});

test("recordHostingCost: requires customerId and a numeric cost", async () => {
  const db = { query: async () => ({ rows: [{ state: "ok" }] }) };
  await assert.rejects(() => recordHostingCost(db, { costUsd: 10 }), /customerId is required/);
  await assert.rejects(() => recordHostingCost(db, { customerId: "c1", costUsd: "10" }), /must be a number/);
});

test("recordHostingCostBatch: keeps going after one bad reading and reports it, not throw", async () => {
  const db = {
    query: async (sql, [customerId]) => {
      if (customerId === "bad") throw new Error("db exploded");
      return { rows: [{ state: "ok" }] };
    },
  };
  const results = await recordHostingCostBatch(db, [
    { customerId: "c1", costUsd: 10 },
    { customerId: "bad", costUsd: 60 },
    { customerId: "c2", costUsd: 55 },
  ]);
  assert.equal(results.length, 3);
  assert.equal(results[0].ok, true);
  assert.equal(results[1].ok, false);
  assert.match(results[1].error, /db exploded/);
  assert.equal(results[2].ok, true);
});
