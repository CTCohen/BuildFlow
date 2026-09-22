-- 0007: demo tracking events (BUILD_TASKS.md §3, SPEC-06 section 2's locked event schema).
-- admin.demos already carries aggregate columns (view_count, conversion_flag) but no raw event
-- log — there is nowhere to record "scroll depth 50%" or "section clicked: pricing" today. This
-- migration adds that missing per-event table plus an idempotent recorder function, matching the
-- 0006 pattern (deterministic, no LLM, mirrors an existing admin.* table style).
--
-- SPEC-06 section 2 event list: demo viewed (timestamp, device, referrer), time on site, scroll
-- depth (25/50/75/100%), section clicks, form interaction. This table stores each occurrence;
-- admin.demos.view_count stays the fast aggregate counter, bumped by admin.record_demo_view().

create table admin.demo_tracking_events (
  id uuid primary key default gen_random_uuid(),
  demo_id uuid not null references admin.demos(id) on delete cascade,
  event_type text not null check (event_type in
    ('view', 'scroll_depth', 'section_click', 'form_interaction', 'time_on_site')),
  -- scroll_depth: {"pct": 25|50|75|100}; section_click: {"section": "pricing"};
  -- form_interaction: {"field": "email", "action": "focus"|"submit"};
  -- time_on_site: {"seconds": n}; view: {"device": "...", "referrer": "..."}.
  payload jsonb not null default '{}'::jsonb,
  session_id text not null, -- one browser session on one demo visit; dedupes repeat scroll ticks
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index on admin.demo_tracking_events (demo_id);
create index on admin.demo_tracking_events (demo_id, session_id);
create index on admin.demo_tracking_events (event_type);

-- Idempotent recorder: a scroll-depth or section-click tick for the same (demo, session, type,
-- payload) is a no-op on repeat — the client-side beacon can retry/double-fire without inflating
-- counts. Bumps admin.demos.view_count + demo_viewed_at on the first 'view' event of a session,
-- matching the aggregate columns 0002_tables.sql already defined on admin.demos.
create or replace function admin.record_demo_event(
  p_demo_id uuid, p_session_id text, p_event_type text, p_payload jsonb default '{}'::jsonb,
  p_now timestamptz default now()
) returns uuid language plpgsql as $$
declare
  v_id uuid;
  v_is_new_view boolean := false;
begin
  if p_event_type not in ('view','scroll_depth','section_click','form_interaction','time_on_site') then
    raise exception 'record_demo_event: unknown event_type %', p_event_type;
  end if;

  select id into v_id from admin.demo_tracking_events
    where demo_id = p_demo_id and session_id = p_session_id and event_type = p_event_type
      and payload = p_payload
    limit 1;
  if v_id is not null then
    return v_id; -- duplicate tick, no-op
  end if;

  if p_event_type = 'view' then
    select not exists(
      select 1 from admin.demo_tracking_events
      where demo_id = p_demo_id and session_id = p_session_id and event_type = 'view'
    ) into v_is_new_view;
  end if;

  insert into admin.demo_tracking_events (demo_id, session_id, event_type, payload, occurred_at)
  values (p_demo_id, p_session_id, p_event_type, p_payload, p_now)
  returning id into v_id;

  if v_is_new_view then
    update admin.demos
      set view_count = view_count + 1,
          status = case when status = 'generated' then 'viewed' else status end
      where id = p_demo_id;
    update admin.prospects
      set demo_view_count = demo_view_count + 1,
          demo_viewed_at = coalesce(demo_viewed_at, p_now)
      where id = (select prospect_id from admin.demos where id = p_demo_id);
  end if;

  return v_id;
end $$;

revoke all on function admin.record_demo_event(uuid, text, text, jsonb, timestamptz) from public, anon, authenticated;
grant execute on function admin.record_demo_event(uuid, text, text, jsonb, timestamptz) to service_role, bf_admin;

revoke all on admin.demo_tracking_events from public, anon, authenticated;
grant select, insert on admin.demo_tracking_events to service_role, bf_admin;
