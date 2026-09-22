\set ON_ERROR_STOP on
\pset pager off
create or replace function pg_temp.check(p_ok boolean, p_label text) returns void language plpgsql as $$
begin
  if not p_ok then raise exception 'FAIL  %', p_label; end if;
  raise notice 'PASS  %', p_label;
end $$;

\echo '=== Hosting cost alert: threshold, dedupe, resolve ==='
select '11111111-1111-1111-1111-111111111111'::uuid as cust \gset

select admin.record_hosting_cost(:'cust', 12.00, '2026-01-01 00:00:00+00') as r1;
select pg_temp.check((select count(*) = 0 from admin.alerts), 'under $50 raises no alert');
select pg_temp.check((select count(*) = 1 from admin.business_metrics_log where metric = 'hosting_cost:' || :'cust'), 'reading logged to business_metrics_log');

select admin.record_hosting_cost(:'cust', 63.50, '2026-01-02 00:00:00+00') as r2;
select pg_temp.check((select count(*) = 1 and severity = 'warning' from admin.alerts where dedupe_key = 'hosting-cost:' || :'cust' group by severity), 'over $50 raises one WARNING alert');

select admin.record_hosting_cost(:'cust', 71.00, '2026-01-03 00:00:00+00') as r3;
select pg_temp.check((select count(*) = 1 from admin.alerts where dedupe_key = 'hosting-cost:' || :'cust'), 'repeated over-threshold reading dedupes into the same alert, not a new one');
select pg_temp.check((select occurrences = 2 from admin.alerts where dedupe_key = 'hosting-cost:' || :'cust'), 'dedupe increments occurrences');

select admin.record_hosting_cost(:'cust', 20.00, '2026-01-04 00:00:00+00') as r4;
select pg_temp.check((select status = 'resolved' from admin.alerts where dedupe_key = 'hosting-cost:' || :'cust'), 'a reading back under $50 resolves the alert');

select admin.record_hosting_cost(:'cust', 55.00, '2026-01-05 00:00:00+00') as r5;
select pg_temp.check((select count(*) filter (where status <> 'resolved') = 1 from admin.alerts where dedupe_key = 'hosting-cost:' || :'cust'), 're-crossing the threshold after resolution raises a fresh open alert');

\echo '=== Two customers do not collide ==='
select '22222222-2222-2222-2222-222222222222'::uuid as cust2 \gset
select admin.record_hosting_cost(:'cust2', 99.00, '2026-01-05 00:00:00+00');
select pg_temp.check((select count(distinct dedupe_key) = 2 from admin.alerts where dedupe_key like 'hosting-cost:%'), 'each customer gets its own alert, keyed by customer_id');

\echo
\echo 'HOSTING COST TESTS COMPLETE'
