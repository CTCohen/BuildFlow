\set ON_ERROR_STOP on
\pset pager off
create or replace function pg_temp.check(p_ok boolean, p_label text) returns void language plpgsql as $$
begin
  if not p_ok then raise exception 'FAIL  %', p_label; end if;
  raise notice 'PASS  %', p_label;
end $$;

\echo '=== Demo tracking events: setup ==='
insert into admin.leads (name, status) values ('Tracking Test Lead', 'new')
  returning id as lead_id \gset
insert into admin.prospects (lead_id) values (:'lead_id') returning id as prospect_id \gset
insert into admin.demos (prospect_id, client_slug, status)
  values (:'prospect_id', 'tracking-test', 'generated') returning id as demo_id \gset

\echo '=== First view bumps aggregate counters, session-scoped ==='
select admin.record_demo_event(:'demo_id', 'sess-1', 'view', '{"device":"mobile","referrer":"email"}'::jsonb);
select pg_temp.check((select view_count = 1 from admin.demos where id = :'demo_id'), 'first view bumps admin.demos.view_count');
select pg_temp.check((select status = 'viewed' from admin.demos where id = :'demo_id'), 'first view flips status generated -> viewed');
select pg_temp.check((select demo_view_count = 1 and demo_viewed_at is not null from admin.prospects where id = :'prospect_id'), 'prospect aggregate columns also bumped');

\echo '=== A second view event in the SAME session does not double-count ==='
select admin.record_demo_event(:'demo_id', 'sess-1', 'view', '{"device":"mobile","referrer":"email"}'::jsonb);
select pg_temp.check((select view_count = 1 from admin.demos where id = :'demo_id'), 'duplicate view in same session is a no-op on the counter');
select pg_temp.check((select count(*) = 1 from admin.demo_tracking_events where demo_id = :'demo_id' and event_type = 'view' and session_id = 'sess-1'), 'exact duplicate event row not re-inserted');

\echo '=== A view from a DIFFERENT session does count ==='
select admin.record_demo_event(:'demo_id', 'sess-2', 'view', '{"device":"desktop","referrer":"direct"}'::jsonb);
select pg_temp.check((select view_count = 2 from admin.demos where id = :'demo_id'), 'a new session raises view_count again');

\echo '=== Scroll depth ticks, deduped per exact payload, kept across distinct depths ==='
select admin.record_demo_event(:'demo_id', 'sess-1', 'scroll_depth', '{"pct":25}'::jsonb);
select admin.record_demo_event(:'demo_id', 'sess-1', 'scroll_depth', '{"pct":25}'::jsonb); -- duplicate tick
select admin.record_demo_event(:'demo_id', 'sess-1', 'scroll_depth', '{"pct":50}'::jsonb);
select pg_temp.check((select count(*) = 2 from admin.demo_tracking_events where demo_id = :'demo_id' and event_type = 'scroll_depth'), 'duplicate 25% tick collapses; 25% and 50% both recorded');

\echo '=== Section click and form interaction recorded ==='
select admin.record_demo_event(:'demo_id', 'sess-1', 'section_click', '{"section":"pricing"}'::jsonb);
select admin.record_demo_event(:'demo_id', 'sess-1', 'form_interaction', '{"field":"email","action":"focus"}'::jsonb);
select pg_temp.check((select count(*) = 1 from admin.demo_tracking_events where demo_id = :'demo_id' and event_type = 'section_click' and payload->>'section' = 'pricing'), 'section click recorded with section name');
select pg_temp.check((select count(*) = 1 from admin.demo_tracking_events where demo_id = :'demo_id' and event_type = 'form_interaction'), 'form interaction recorded');

\echo '=== Unknown event_type rejected ==='
select pg_temp.check(
  (select count(*) = 1 from pg_catalog.pg_proc where proname = 'record_demo_event'),
  'sanity: function exists before negative test'
);
do $$
begin
  begin
    perform admin.record_demo_event((select id from admin.demos limit 1), 'sess-x', 'bogus_type', '{}'::jsonb);
    raise exception 'FAIL  unknown event_type should have been rejected';
  exception when others then
    if sqlerrm not like 'unknown event_type%' then raise; end if;
    raise notice 'PASS  unknown event_type rejected';
  end;
end $$;

\echo '=== Two demos do not collide on session_id ==='
insert into admin.leads (name, status) values ('Tracking Test Lead 2', 'new') returning id as lead_id2 \gset
insert into admin.prospects (lead_id) values (:'lead_id2') returning id as prospect_id2 \gset
insert into admin.demos (prospect_id, client_slug, status) values (:'prospect_id2', 'tracking-test-2', 'generated') returning id as demo_id2 \gset
select admin.record_demo_event(:'demo_id2', 'sess-1', 'view', '{"device":"mobile"}'::jsonb); -- same session_id, different demo
select pg_temp.check((select view_count = 1 from admin.demos where id = :'demo_id2'), 'a shared session_id across two different demos does not collide');
select pg_temp.check((select view_count = 2 from admin.demos where id = :'demo_id'), 'first demo view_count unaffected by the second demo''s event');

\echo
\echo 'DEMO TRACKING TESTS COMPLETE'
