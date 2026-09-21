// Minimal platform service. Zero dependencies so the image builds with no registry access.
//   GET /health  liveness: the process is up (used by Railway and Cloud Run probes)
//   GET /ready   readiness: also checks the database when DATABASE_URL is set and `pg` is installed
// PORT is read from the environment (Railway and Cloud Run both inject it).
import http from "node:http";

const startedAt = Date.now();
const VERSION = process.env.GIT_SHA || process.env.RAILWAY_GIT_COMMIT_SHA || process.env.K_REVISION || "dev";

export async function checkDatabase(env = process.env, loadPg = () => import("pg")) {
  if (!env.DATABASE_URL) return { configured: false, ok: true };
  let pg;
  try {
    pg = await loadPg();
  } catch {
    return { configured: true, ok: false, error: "pg driver not installed" };
  }
  const Client = pg.default?.Client ?? pg.Client;
  const client = new Client({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 3000 });
  const t0 = Date.now();
  try {
    await client.connect();
    await client.query("select 1");
    return { configured: true, ok: true, latencyMs: Date.now() - t0 };
  } catch (e) {
    return { configured: true, ok: false, error: e.message };
  } finally {
    await client.end().catch(() => {});
  }
}

export function createHandler({ env = process.env, dbCheck = checkDatabase } = {}) {
  return async (req, res) => {
    const send = (code, body) => {
      res.writeHead(code, { "content-type": "application/json", "cache-control": "no-store" });
      res.end(JSON.stringify(body));
    };
    const path = new URL(req.url, "http://x").pathname;
    if (req.method !== "GET" && req.method !== "HEAD") return send(405, { error: "method not allowed" });
    if (path === "/health") {
      return send(200, { status: "ok", version: VERSION, uptimeSeconds: Math.round((Date.now() - startedAt) / 1000) });
    }
    if (path === "/ready") {
      const db = await dbCheck(env);
      return send(db.ok ? 200 : 503, { status: db.ok ? "ready" : "not-ready", db });
    }
    return send(404, { error: "not found" });
  };
}

export const createServer = (opts) => http.createServer(createHandler(opts));

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 8080);
  const server = createServer();
  server.listen(port, "0.0.0.0", () => console.log(JSON.stringify({ msg: "listening", port })));
  // Cloud Run and Railway send SIGTERM on redeploy
  process.on("SIGTERM", () => server.close(() => process.exit(0)));
}
