import test from "node:test";
import assert from "node:assert/strict";
import { createHandler, checkDatabase } from "./server.mjs";

// Call the handler with mock req/res (no socket needed).
async function call(opts, path, method = "GET") {
  const res = { code: null, headers: null, body: "", writeHead(c, h) { this.code = c; this.headers = h; }, end(b) { this.body = b; } };
  await createHandler(opts)({ url: path, method }, res);
  return { status: res.code, json: JSON.parse(res.body) };
}

test("GET /health answers 200 ok", async () => {
  const r = await call({}, "/health");
  assert.equal(r.status, 200);
  assert.equal(r.json.status, "ok");
  assert.equal(typeof r.json.uptimeSeconds, "number");
});
test("/health does not touch the database", async () => {
  const r = await call({ dbCheck: () => { throw new Error("must not be called"); } }, "/health");
  assert.equal(r.status, 200);
});
test("/ready is 200 when no database is configured", async () => {
  assert.equal((await call({ env: {} }, "/ready")).status, 200);
});
test("/ready is 503 when the database check fails", async () => {
  const r = await call({ dbCheck: async () => ({ configured: true, ok: false, error: "down" }) }, "/ready");
  assert.equal(r.status, 503);
  assert.equal(r.json.status, "not-ready");
});
test("unknown path is 404, POST is 405", async () => {
  assert.equal((await call({}, "/nope")).status, 404);
  assert.equal((await call({}, "/health", "POST")).status, 405);
});
test("checkDatabase reports a missing driver instead of throwing", async () => {
  const r = await checkDatabase({ DATABASE_URL: "postgres://x" }, () => Promise.reject(new Error("nope")));
  assert.deepEqual(r, { configured: true, ok: false, error: "pg driver not installed" });
});
