\set ON_ERROR_STOP on
\pset pager off
create or replace function pg_temp.check(p_ok boolean, p_label text) returns void language plpgsql as $$
begin
  if not p_ok then raise exception 'FAIL  %', p_label; end if;
  raise notice 'PASS  %', p_label;
end $$;

\echo '=== Health check rule: 3 consecutive fails = down ==='
select admin.record_health_check('https://api.test/health','http',false,null,500,'boom', '2026-01-01 10:00:00+00') as r1;
select admin.record_health_check('https://api.test/health','http',false,null,500,'boom', '2026-01-01 10:05:00+00') as r2;
select pg_temp.check((select count(*) = 0 from admin.alerts), 'two failures raise no alert');
select admin.record_health_check('https://api.test/health','http',false,null,500,'boom', '2026-01-01 10:10:00+00') as r3;
select pg_temp.check((select count(*) = 1 and min(severity) = 'critical' from admin.alerts where status='open'), 'third failure raises one CRITICAL alert');
select admin.record_health_check('https://api.test/health','http',false,null,500,'boom', '2026-01-01 10:15:00+00') as r4;
select pg_temp.check((select count(*) = 1 and max(occurrences) = 2 from admin.alerts), 'fourth failure dedupes into the same alert');
select pg_temp.check((select count(*) = 0 from (select 1 from admin.alerts group by dedupe_key having count(*) filter (where status<>'resolved') > 1) x), 'never two live alerts for one key');

\echo '=== Dispatcher: channels and cadence ==='
select alert_id is not null as claimed, severity, channels from admin.claim_alerts_to_notify('2026-01-01 10:16:00+00');
select pg_temp.check((select count(*) = 0 from admin.claim_alerts_to_notify('2026-01-01 10:20:00+00')), 'critical not re-sent inside 30 min');
select pg_temp.check((select channels = array['sms','slack','email'] from admin.claim_alerts_to_notify('2026-01-01 10:50:00+00')), 'critical re-sent after 30 min via sms+slack+email');

select admin.raise_alert('metric:qa','warning','business','QA pass rate below 90%',null,'2026-01-01 11:00:00+00');
select pg_temp.check((select channels = array['slack','email'] from admin.claim_alerts_to_notify('2026-01-01 11:01:00+00') where severity='warning'), 'warning goes to slack+email');
select pg_temp.check((select count(*) = 0 from admin.claim_alerts_to_notify('2026-01-01 11:30:00+00') where severity='warning'), 'warning not re-sent inside an hour');

-- info: 06:00 Arizona (= 13:00 UTC) is before 08:00, so held; 16:00 UTC = 09:00 AZ goes out
select admin.raise_alert('info:digest','info','business','FYI',null,'2026-01-01 13:00:00+00');
select pg_temp.check((select count(*) = 0 from admin.claim_alerts_to_notify('2026-01-01 13:00:00+00') where severity='info'), 'info held before 08:00 Arizona');
select pg_temp.check((select channels = array['email'] from admin.claim_alerts_to_notify('2026-01-01 16:00:00+00') where severity='info'), 'info sent after 08:00 Arizona, email only');

\echo '=== Severity only escalates ==='
select admin.raise_alert('metric:qa','critical','business','QA pass rate below 80%',null,'2026-01-01 12:00:00+00');
select pg_temp.check((select severity = 'critical' from admin.alerts where dedupe_key='metric:qa'), 'warning escalated to critical');
select admin.raise_alert('metric:qa','warning','business','QA pass rate below 90%',null,'2026-01-01 12:05:00+00');
select pg_temp.check((select severity = 'critical' from admin.alerts where dedupe_key='metric:qa'), 'critical not downgraded by a later warning');

\echo '=== Acknowledge silences; recovery resolves ==='
select admin.acknowledge_alert((select id from admin.alerts where dedupe_key='metric:qa'), '2026-01-01 12:10:00+00');
select pg_temp.check((select count(*) = 0 from admin.claim_alerts_to_notify('2026-01-02 12:00:00+00') where title like 'QA%'), 'acknowledged alert is never sent');
select admin.record_health_check('https://api.test/health','http',true,42,200,null,'2026-01-01 12:20:00+00') as recovered;
select pg_temp.check((select status = 'resolved' from admin.alerts where dedupe_key='health:https://api.test/health'), 'a passing check resolves the outage alert');
select admin.record_health_check('https://api.test/health','http',false,null,500,'boom','2026-01-01 12:25:00+00');
select pg_temp.check((select count(*) filter (where status<>'resolved') = 0 from admin.alerts where dedupe_key='health:https://api.test/health'), 'one failure after recovery does not re-alert');

\echo '=== Retention ==='
insert into admin.health_check_log (endpoint, kind, ok, checked_at) values ('old','http',true,'2025-11-01+00'),('recent','http',true,'2026-01-01+00');
insert into admin.business_metrics_log (metric, value, recorded_at) values ('m',1,'2025-09-01+00'),('m',2,'2026-01-01+00');
select admin.prune_monitoring('2026-01-05+00') as pruned;
select pg_temp.check((select count(*) = 0 from admin.health_check_log where endpoint='old'), 'health logs older than 30 days pruned');
select pg_temp.check((select count(*) = 1 from admin.business_metrics_log), 'metrics older than 90 days pruned, recent kept');

\echo
\echo 'MONITORING TESTS COMPLETE'
