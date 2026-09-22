import test from "node:test";
import assert from "node:assert/strict";
import { probeHttp, probeDb, runHealthChecks, dispatchAlerts, memorySenders } from "./monitor.mjs";

const fakeFetch = (status) => async () => ({ status, ok: status >= 200 && status < 300 });

test("probeHttp: 200 is ok", async () => {
  const r = await probeHttp("http://x", { fetchImpl: fakeFetch(200) });
  assert.equal(r.ok, true); assert.equal(r.statusCode, 200);
});
test("probeHttp: 500 is a failure with the status", async () => {
  const r = await probeHttp("http://x", { fetchImpl: fakeFetch(500) });
  assert.equal(r.ok, false); assert.equal(r.error, "HTTP 500");
});
test("probeHttp: a network error is a failure, not a throw", async () => {
  const r = await probeHttp("http://x", { fetchImpl: async () => { throw new Error("ECONNREFUSED"); } });
  assert.equal(r.ok, false); assert.equal(r.error, "ECONNREFUSED");
});
test("probeHttp: a timeout is reported as 'timeout'", async () => {
  const r = await probeHttp("http://x", { fetchImpl: async () => { const e = new Error("t"); e.name = "TimeoutError"; throw e; } });
  assert.equal(r.error, "timeout");
});
test("probeDb: query error is a failure", async () => {
  const r = await probeDb({ query: async () => { throw new Error("db down"); } });
  assert.equal(r.ok, false); assert.equal(r.error, "db down");
});
test("runHealthChecks records each target through the SQL function", async () => {
  const calls = [];
  const db = { query: async (sql, p) => { calls.push({ sql, p }); return { rows: [{ state: "up" }] }; } };
  const out = await runHealthChecks(db, [{ endpoint: "api", kind: "http", url: "http://api/health" }, { endpoint: "db", kind: "db" }],
    { fetchImpl: fakeFetch(200) });
  assert.equal(out.length, 2);
  assert.ok(calls.some((c) => c.sql.includes("record_health_check") && c.p[0] === "api" && c.p[2] === true));
  assert.ok(out.every((o) => o.state === "up"));
});
test("dispatchAlerts sends each alert on its channels", async () => {
  const db = { query: async () => ({ rows: [{ alert_id: "1", severity: "critical", title: "API down", channels: ["sms", "slack", "email"] }] }) };
  const mem = memorySenders();
  const rep = await dispatchAlerts(db, mem.senders);
  assert.deepEqual(rep[0].delivered, ["sms", "slack", "email"]);
  assert.equal(mem.sent.length, 3);
});
test("dispatchAlerts: one failing channel does not stop the others and is reported", async () => {
  const db = { query: async () => ({ rows: [{ alert_id: "1", severity: "critical", title: "t", channels: ["sms", "slack"] }] }) };
  const senders = { sms: async () => { throw new Error("twilio 401"); }, slack: async () => {} };
  const rep = await dispatchAlerts(db, senders);
  assert.deepEqual(rep[0].delivered, ["slack"]);
  assert.deepEqual(rep[0].failed, [{ channel: "sms", error: "twilio 401" }]);
});
test("dispatchAlerts: missing sender is reported, not silently dropped", async () => {
  const db = { query: async () => ({ rows: [{ alert_id: "1", severity: "info", title: "t", channels: ["email"] }] }) };
  const rep = await dispatchAlerts(db, {});
  assert.equal(rep[0].failed[0].error, "no sender configured");
});
test("dispatchAlerts: nothing due returns an empty report", async () => {
  assert.deepEqual(await dispatchAlerts({ query: async () => ({ rows: [] }) }, {}), []);
});
