import test from "node:test";
import assert from "node:assert/strict";
import { buildDemoAnalytics, groupBySession, buildConversionRate } from "./lib/demo-tracking.mjs";

const DEMO_ID = "demo-1";

function ev(session_id, event_type, payload = {}) {
  return { demo_id: DEMO_ID, session_id, event_type, payload, occurred_at: "2026-09-22T00:00:00Z" };
}

test("groupBySession buckets events by session_id", () => {
  const events = [ev("s1", "view"), ev("s1", "scroll_depth", { pct: 25 }), ev("s2", "view")];
  const grouped = groupBySession(events);
  assert.deepEqual(Object.keys(grouped).sort(), ["s1", "s2"]);
  assert.equal(grouped.s1.length, 2);
});

test("buildDemoAnalytics counts views and unique sessions", () => {
  const events = [
    ev("s1", "view", { device: "mobile", referrer: "email" }),
    ev("s2", "view", { device: "desktop", referrer: "direct" }),
    ev("s2", "view", { device: "desktop", referrer: "direct" }), // duplicate view event still counted here;
    // dedupe of the *aggregate counter* is the DB function's job (admin.record_demo_event), this
    // layer reads whatever rows exist.
  ];
  const a = buildDemoAnalytics(events);
  assert.equal(a.viewCount, 3);
  assert.equal(a.uniqueSessions, 2);
  assert.deepEqual(a.deviceCounts, { mobile: 1, desktop: 2 });
  assert.deepEqual(a.referrerCounts, { email: 1, direct: 2 });
});

test("scroll depth milestones: only the max reached per session counts, sessions not double-counted", () => {
  const events = [
    ev("s1", "view"),
    ev("s1", "scroll_depth", { pct: 25 }),
    ev("s1", "scroll_depth", { pct: 50 }),
    ev("s1", "scroll_depth", { pct: 75 }),
    ev("s2", "view"),
    ev("s2", "scroll_depth", { pct: 25 }),
  ];
  const a = buildDemoAnalytics(events);
  // s1 reached 75 (so counted at 25/50/75 too), s2 only reached 25
  assert.deepEqual(a.scrollDepthReached, { 25: 2, 50: 1, 75: 1, 100: 0 });
  assert.equal(a.scrollDepthPct[25], 100); // 2/2 sessions
  assert.equal(a.scrollDepthPct[75], 50); // 1/2 sessions
  assert.equal(a.scrollDepthPct[100], 0);
});

test("section clicks tallied by section name", () => {
  const events = [
    ev("s1", "section_click", { section: "pricing" }),
    ev("s1", "section_click", { section: "pricing" }),
    ev("s2", "section_click", { section: "features" }),
  ];
  const a = buildDemoAnalytics(events);
  assert.deepEqual(a.sectionClicks, { pricing: 2, features: 1 });
});

test("form engagement counted per-session (not per-event), with a percentage of sessions", () => {
  const events = [
    ev("s1", "view"), ev("s1", "form_interaction", { field: "email", action: "focus" }),
    ev("s1", "form_interaction", { field: "email", action: "submit" }), // same session, two events
    ev("s2", "view"),
  ];
  const a = buildDemoAnalytics(events);
  assert.equal(a.formEngagementSessions, 1);
  assert.equal(a.formEngagementPct, 50); // 1 of 2 sessions
});

test("avgTimeOnSiteSeconds averages time_on_site events, 0 when none recorded", () => {
  const events = [ev("s1", "time_on_site", { seconds: 40 }), ev("s2", "time_on_site", { seconds: 20 })];
  assert.equal(buildDemoAnalytics(events).avgTimeOnSiteSeconds, 30);
  assert.equal(buildDemoAnalytics([ev("s1", "view")]).avgTimeOnSiteSeconds, 0);
});

test("buildDemoAnalytics on no events returns zeroed shape, no division by zero", () => {
  const a = buildDemoAnalytics([]);
  assert.equal(a.viewCount, 0);
  assert.equal(a.uniqueSessions, 0);
  assert.deepEqual(a.scrollDepthPct, { 25: 0, 50: 0, 75: 0, 100: 0 });
  assert.equal(a.formEngagementPct, 0);
});

test("buildConversionRate computes viewed vs converted from admin.demos-shaped rows", () => {
  const demos = [
    { id: "d1", view_count: 3, conversion_flag: true },
    { id: "d2", view_count: 1, conversion_flag: false },
    { id: "d3", view_count: 0, conversion_flag: false }, // never viewed, excluded from denominator
  ];
  const r = buildConversionRate(demos);
  assert.equal(r.demosViewed, 2);
  assert.equal(r.demosConverted, 1);
  assert.equal(r.conversionRatePct, 50);
});

test("buildConversionRate on empty input has no division by zero", () => {
  assert.deepEqual(buildConversionRate([]), { demosViewed: 0, demosConverted: 0, conversionRatePct: 0 });
});
