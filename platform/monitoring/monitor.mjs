// Pre-launch monitoring runner (System 13 subset): Health Check job + Alert Dispatcher job.
// Decisions (3-strikes rule, dedupe, channels, cadence) live in SQL (db/migrations/0004_monitoring.sql).
// This file only probes endpoints and delivers what the database says is due.
// `db` is any object with query(sql, params) -> { rows }; `senders` maps channel -> async ({alert}) => void.
// No real SMS/Slack/email goes out unless real senders are passed in (they need keys Tyler holds).

export async function probeHttp(url, { timeoutMs = 5000, fetchImpl = fetch } = {}) {
  const t0 = Date.now();
  try {
    const res = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs) });
    return { ok: res.status >= 200 && res.status < 300, latencyMs: Date.now() - t0, statusCode: res.status,
             error: res.ok ? null : `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, latencyMs: Date.now() - t0, statusCode: null, error: e.name === "TimeoutError" ? "timeout" : e.message };
  }
}

export async function probeDb(db) {
  const t0 = Date.now();
  try { await db.query("select 1"); return { ok: true, latencyMs: Date.now() - t0, statusCode: null, error: null }; }
  catch (e) { return { ok: false, latencyMs: Date.now() - t0, statusCode: null, error: e.message }; }
}

// targets: [{ endpoint, kind: "http"|"db", url? }]
export async function runHealthChecks(db, targets, { fetchImpl } = {}) {
  const results = [];
  for (const t of targets) {
    const r = t.kind === "db" ? await probeDb(db) : await probeHttp(t.url ?? t.endpoint, { fetchImpl });
    const { rows } = await db.query(
      "select admin.record_health_check($1,$2,$3,$4,$5,$6) as state",
      [t.endpoint, t.kind, r.ok, r.latencyMs, r.statusCode, r.error]);
    results.push({ endpoint: t.endpoint, ...r, state: rows[0].state });
  }
  return results;
}

// Claim what is due, deliver each on its channels. A failed channel is reported, never swallowed;
// one channel failing does not stop the others.
export async function dispatchAlerts(db, senders, now = null) {
  const { rows } = await db.query("select * from admin.claim_alerts_to_notify($1)", [now]);
  const report = [];
  for (const alert of rows) {
    const delivered = [], failed = [];
    for (const ch of alert.channels) {
      const send = senders[ch];
      if (!send) { failed.push({ channel: ch, error: "no sender configured" }); continue; }
      try { await send({ alert }); delivered.push(ch); }
      catch (e) { failed.push({ channel: ch, error: e.message }); }
    }
    report.push({ alertId: alert.alert_id, severity: alert.severity, delivered, failed });
  }
  return report;
}

// Stand-in senders for local runs: record instead of sending.
export function memorySenders() {
  const sent = [];
  const mk = (channel) => async ({ alert }) => { sent.push({ channel, severity: alert.severity, title: alert.title }); };
  return { sent, senders: { sms: mk("sms"), slack: mk("slack"), email: mk("email") } };
}
