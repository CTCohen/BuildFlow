// Demo tracking aggregation (BUILD_TASKS.md §3, SPEC-06 section 2's locked event schema:
// "demo viewed (timestamp, device, referrer), time on site, scroll depth (25/50/75/100%),
// section clicks, form interaction" / "view count, view duration, scroll depth, form
// engagement, conversion rate, device type, traffic source"). CONTRACT.md's admin.demos only
// carried aggregate columns (view_count, conversion_flag) with nowhere to log a raw event —
// that gap is filled by the new admin.demo_tracking_events table + admin.record_demo_event()
// (platform/db/migrations/0007_demo_tracking.sql). This module is the pure, DB-agnostic
// aggregation layer over rows shaped like that table, for both the customer/admin dashboard
// and the sandbox/demo-embed dashboard to render from.
//
// Recording itself (the write path) is the SQL function; this module only shapes reads —
// consistent with customer-dashboard.mjs / admin-dashboard.mjs, which are also pure view-model
// builders over fixture/CONTRACT.md-shaped rows, no live Supabase wiring yet (gate G3).

const SCROLL_MILESTONES = [25, 50, 75, 100];

export function buildDemoAnalytics(events) {
  const bySession = groupBySession(events);
  const sessions = Object.keys(bySession);
  const viewEvents = events.filter((e) => e.event_type === "view");
  const deviceCounts = {};
  const referrerCounts = {};
  for (const e of viewEvents) {
    const device = e.payload?.device ?? "unknown";
    const referrer = e.payload?.referrer ?? "unknown";
    deviceCounts[device] = (deviceCounts[device] ?? 0) + 1;
    referrerCounts[referrer] = (referrerCounts[referrer] ?? 0) + 1;
  }

  const scrollDepthReached = { 25: 0, 50: 0, 75: 0, 100: 0 };
  for (const sessionEvents of Object.values(bySession)) {
    const maxPct = sessionEvents
      .filter((e) => e.event_type === "scroll_depth")
      .reduce((max, e) => Math.max(max, Number(e.payload?.pct) || 0), 0);
    for (const milestone of SCROLL_MILESTONES) {
      if (maxPct >= milestone) scrollDepthReached[milestone] += 1;
    }
  }

  const sectionClicks = {};
  for (const e of events.filter((e) => e.event_type === "section_click")) {
    const section = e.payload?.section ?? "unknown";
    sectionClicks[section] = (sectionClicks[section] ?? 0) + 1;
  }

  const formInteractionSessions = new Set(
    events.filter((e) => e.event_type === "form_interaction").map((e) => e.session_id)
  ).size;

  const timeOnSiteSeconds = events
    .filter((e) => e.event_type === "time_on_site")
    .map((e) => Number(e.payload?.seconds) || 0);
  const avgTimeOnSiteSeconds = timeOnSiteSeconds.length
    ? Math.round(timeOnSiteSeconds.reduce((a, b) => a + b, 0) / timeOnSiteSeconds.length)
    : 0;

  return {
    viewCount: viewEvents.length,
    uniqueSessions: sessions.length,
    deviceCounts,
    referrerCounts,
    scrollDepthReached, // e.g. {25: 4, 50: 3, 75: 1, 100: 0} = sessions that reached each milestone
    scrollDepthPct: Object.fromEntries(
      SCROLL_MILESTONES.map((m) => [
        m, sessions.length ? Math.round((scrollDepthReached[m] / sessions.length) * 1000) / 10 : 0,
      ])
    ),
    sectionClicks,
    formEngagementSessions: formInteractionSessions,
    formEngagementPct: sessions.length ? Math.round((formInteractionSessions / sessions.length) * 1000) / 10 : 0,
    avgTimeOnSiteSeconds,
  };
}

export function groupBySession(events) {
  const out = {};
  for (const e of events) {
    (out[e.session_id] ??= []).push(e);
  }
  return out;
}

// Conversion rate for a set of demos (admin.demos rows), independent of the per-event detail
// above — matches SPEC-06 section 2's "conversion rate" analytics line.
export function buildConversionRate(demos) {
  const viewed = demos.filter((d) => d.view_count > 0);
  const converted = demos.filter((d) => d.conversion_flag);
  return {
    demosViewed: viewed.length,
    demosConverted: converted.length,
    conversionRatePct: viewed.length ? Math.round((converted.length / viewed.length) * 1000) / 10 : 0,
  };
}
