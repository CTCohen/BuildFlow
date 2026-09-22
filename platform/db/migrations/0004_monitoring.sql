-- 0004: pre-launch monitoring subset (System 13): health check evaluation and alert dispatcher logic.
-- Probing and sending happen in the service (platform/monitoring); the decisions live here so they are testable with psql.

-- Raise or refresh an alert. One live (non-resolved) alert per dedupe_key, so repeats inside the window collapse.
create or replace function admin.raise_alert(
  p_dedupe_key text, p_severity text, p_category text, p_title text, p_detail text default null, p_now timestamptz default now()
) returns uuid language plpgsql as $$
declare v_id uuid;
begin
  update admin.alerts
     set last_seen_at = p_now,
         occurrences = occurrences + 1,
         detail = coalesce(p_detail, detail),
         -- escalate, never downgrade
         severity = case when p_severity = 'critical' or severity = 'critical' then 'critical'
                         when p_severity = 'warning' or severity = 'warning' then 'warning' else 'info' end
   where dedupe_key = p_dedupe_key and status <> 'resolved'
   returning id into v_id;
  if v_id is null then
    insert into admin.alerts (dedupe_key, severity, category, title, detail, first_seen_at, last_seen_at)
    values (p_dedupe_key, p_severity, p_category, p_title, p_detail, p_now, p_now) returning id into v_id;
  end if;
  return v_id;
end $$;

create or replace function admin.resolve_alert(p_dedupe_key text, p_now timestamptz default now()) returns int
language sql as $$
  with r as (update admin.alerts set status = 'resolved', resolved_at = p_now
              where dedupe_key = p_dedupe_key and status <> 'resolved' returning 1)
  select count(*)::int from r
$$;

-- Log one probe result and apply the locked rule: 3 consecutive failures = down (critical); a success resolves it.
create or replace function admin.record_health_check(
  p_endpoint text, p_kind text, p_ok boolean, p_latency_ms int default null,
  p_status_code int default null, p_error text default null, p_now timestamptz default now()
) returns text language plpgsql as $$
declare v_fails int;
begin
  insert into admin.health_check_log (endpoint, kind, ok, latency_ms, status_code, error_message, checked_at)
  values (p_endpoint, p_kind, p_ok, p_latency_ms, p_status_code, p_error, p_now);

  if p_ok then
    perform admin.resolve_alert('health:' || p_endpoint, p_now);
    return 'up';
  end if;

  select count(*) filter (where not ok) into v_fails
    from (select ok from admin.health_check_log where endpoint = p_endpoint
           order by checked_at desc, id desc limit 3) last3;
  if v_fails >= 3 then
    perform admin.raise_alert('health:' || p_endpoint, 'critical', 'infrastructure',
                              p_endpoint || ' is down', 'Last 3 checks failed. Latest error: ' || coalesce(p_error, 'n/a'), p_now);
    return 'down';
  end if;
  return 'degraded';
end $$;

-- Dispatcher core: pick alerts due for notification, stamp them, and say which channels to use.
--   critical: sms + slack + email, immediately, then again after 30 min while still open
--   warning : slack + email, at most hourly
--   info    : email, once a day, not before 08:00 Arizona time
-- Acknowledged and resolved alerts are never sent.
create or replace function admin.claim_alerts_to_notify(p_now timestamptz default now())
returns table (alert_id uuid, severity text, title text, detail text, occurrences int, channels text[])
language plpgsql as $$
begin
  return query
  with due as (
    select a.id from admin.alerts a
     where a.status = 'open'
       and ( (a.severity = 'critical' and (a.last_notified_at is null or a.last_notified_at <= p_now - interval '30 minutes'))
          or (a.severity = 'warning'  and (a.last_notified_at is null or a.last_notified_at <= p_now - interval '1 hour'))
          or (a.severity = 'info'     and (a.last_notified_at is null or a.last_notified_at <= p_now - interval '1 day')
                                       and extract(hour from p_now at time zone 'America/Phoenix') >= 8) )
     for update skip locked
  ), stamped as (
    update admin.alerts a set last_notified_at = p_now from due where a.id = due.id
    returning a.id, a.severity, a.title, a.detail, a.occurrences
  )
  select s.id, s.severity, s.title, s.detail, s.occurrences,
         case s.severity when 'critical' then array['sms','slack','email']
                         when 'warning'  then array['slack','email']
                         else array['email'] end
    from stamped s
   order by case s.severity when 'critical' then 0 when 'warning' then 1 else 2 end;
end $$;

create or replace function admin.acknowledge_alert(p_id uuid, p_now timestamptz default now()) returns void
language sql as $$
  update admin.alerts set status = 'acknowledged', acknowledged_at = p_now where id = p_id and status = 'open'
$$;

-- Retention: health 30d, metrics 90d, alerts until acknowledged/resolved + 7d.
create or replace function admin.prune_monitoring(p_now timestamptz default now()) returns jsonb
language plpgsql as $$
declare h int; m int; a int;
begin
  with d as (delete from admin.health_check_log where checked_at < p_now - interval '30 days' returning 1) select count(*) into h from d;
  with d as (delete from admin.business_metrics_log where recorded_at < p_now - interval '90 days' returning 1) select count(*) into m from d;
  with d as (delete from admin.alerts where status <> 'open'
              and coalesce(resolved_at, acknowledged_at) < p_now - interval '7 days' returning 1) select count(*) into a from d;
  return jsonb_build_object('health_check_log', h, 'business_metrics_log', m, 'alerts', a);
end $$;

revoke all on all functions in schema admin from public, anon, authenticated;
grant execute on all functions in schema admin to service_role, bf_admin;
