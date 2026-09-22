-- 0006: per-customer hosting cost alert (SPEC-03 section 4: "alert if >$50/mo (margin risk)";
-- SPEC-13 cost monitoring). Deterministic threshold, no LLM. Reuses admin.raise_alert /
-- admin.resolve_alert from 0004_monitoring.sql so this rides the existing dispatcher (severity,
-- channels, cadence) rather than inventing a new alerting path.

create or replace function admin.record_hosting_cost(
  p_customer_id uuid, p_cost_usd numeric, p_now timestamptz default now()
) returns text language plpgsql as $$
declare v_threshold numeric := 50;
begin
  insert into admin.business_metrics_log (metric, value, recorded_at)
  values ('hosting_cost:' || p_customer_id, p_cost_usd, p_now);

  if p_cost_usd > v_threshold then
    perform admin.raise_alert('hosting-cost:' || p_customer_id, 'warning', 'cost',
      'Hosting cost over $' || v_threshold || ' for customer ' || p_customer_id,
      'Latest reading: $' || p_cost_usd, p_now);
    return 'over-threshold';
  end if;

  perform admin.resolve_alert('hosting-cost:' || p_customer_id, p_now);
  return 'ok';
end $$;

revoke all on function admin.record_hosting_cost(uuid, numeric, timestamptz) from public, anon, authenticated;
grant execute on function admin.record_hosting_cost(uuid, numeric, timestamptz) to service_role, bf_admin;
