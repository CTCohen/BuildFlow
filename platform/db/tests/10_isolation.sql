\set ON_ERROR_STOP on
\pset pager off
-- Seed as superuser (bypasses RLS): two fake customers, each with website, submission, review, CRM token, subscription.
\set ua '11111111-1111-1111-1111-111111111111'
\set ub '22222222-2222-2222-2222-222222222222'
\set ca 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
\set cb 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'

insert into app.customers (id, name, email, tier) values
  (:'ca','Alpha Plumbing','a@alpha.test','smb'), (:'cb','Bravo HVAC','b@bravo.test','micro');
insert into app.customer_users (customer_id, user_id) values (:'ca', :'ua'), (:'cb', :'ub');
insert into app.websites (id, customer_id, slug, client_json) values
  ('a0000000-0000-0000-0000-000000000001', :'ca', 'alpha-plumbing', '{"slug":"alpha-plumbing"}'),
  ('b0000000-0000-0000-0000-000000000001', :'cb', 'bravo-hvac', '{"slug":"bravo-hvac"}');
insert into app.form_submissions (customer_id, website_id, prospect_name, message) values
  (:'ca','a0000000-0000-0000-0000-000000000001','Alpha lead','leak'),
  (:'cb','b0000000-0000-0000-0000-000000000001','Bravo lead','no cooling');
insert into app.reviews (customer_id, website_id, source, rating, url) values
  (:'ca','a0000000-0000-0000-0000-000000000001','google',5,'u1'),
  (:'cb','b0000000-0000-0000-0000-000000000001','yelp',4,'u2');
insert into app.crm_integrations (customer_id, crm_type, auth_token_encrypted) values
  (:'ca','hubspot','\xdeadbeef'), (:'cb','jobber','\xcafebabe');
insert into app.subscriptions (customer_id, stripe_subscription_id, tier, monthly_price_cents, launch_cohort) values
  (:'ca','sub_A','smb',24900,'launch'), (:'cb','sub_B','micro',14900,'standard');
insert into admin.customer_admin (customer_id, ltv_cents) values (:'ca', 100000), (:'cb', 50000);
insert into admin.payment_transactions (customer_id, stripe_transaction_id, amount_cents, transaction_type, status)
  values (:'ca','ch_A',24900,'charge','succeeded');
insert into admin.leads (name, status) values ('Some prospect','new');

create or replace function pg_temp.expect_denied(p_sql text, p_label text) returns void language plpgsql as $$
begin
  begin
    execute p_sql;
  exception when insufficient_privilege then
    raise notice 'PASS  denied: %', p_label; return;
  end;
  raise exception 'FAIL  expected permission denied: %', p_label;
end $$;
create or replace function pg_temp.expect_count(p_sql text, p_expected int, p_label text) returns void language plpgsql as $$
declare n int;
begin
  execute 'select count(*) from (' || p_sql || ') q' into n;
  if n <> p_expected then raise exception 'FAIL  % : expected %, got %', p_label, p_expected, n; end if;
  raise notice 'PASS  % (rows=%)', p_label, n;
end $$;
grant execute on function pg_temp.expect_denied(text,text), pg_temp.expect_count(text,int,text) to public;

\echo
\echo '=== Customer A (jwt sub = user A) ==='
set role authenticated;
select set_config('request.jwt.claim.sub', :'ua', false);
select 'A sees customers' as check, name from app.customers;
select 'A sees websites' as check, slug from app.websites;
select 'A sees submissions' as check, prospect_name from app.form_submissions;
select 'A sees reviews' as check, source from app.reviews;
select 'A sees integrations' as check, crm_type from app.crm_integrations;
select 'A sees subscription' as check, tier, monthly_price_cents, payment_status from app.subscriptions;
select pg_temp.expect_count('select 1 from app.customers', 1, 'A: customers = own only');
select pg_temp.expect_count($$select 1 from app.customers where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'$$, 0, 'A cannot read customer B');
select pg_temp.expect_count($$select 1 from app.websites where customer_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'$$, 0, 'A cannot read B websites');
select pg_temp.expect_count($$select 1 from app.form_submissions where customer_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'$$, 0, 'A cannot read B form submissions');
select pg_temp.expect_count($$select 1 from app.reviews where customer_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'$$, 0, 'A cannot read B reviews');
select pg_temp.expect_count($$select 1 from app.crm_integrations where customer_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'$$, 0, 'A cannot read B CRM integration');
select pg_temp.expect_count($$select 1 from app.subscriptions where customer_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'$$, 0, 'A cannot read B subscription');
select pg_temp.expect_count('select 1 from app.customer_users', 1, 'A sees only own user mapping');
-- writes denied (customers are read-only; writes go through the backend)
select pg_temp.expect_denied($$update app.websites set bundle_url = 'x'$$, 'A cannot update websites');
select pg_temp.expect_denied($$insert into app.form_submissions (customer_id, website_id) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','a0000000-0000-0000-0000-000000000001')$$, 'A cannot insert submissions');
select pg_temp.expect_denied($$delete from app.customers$$, 'A cannot delete customers');
-- column limits
select pg_temp.expect_denied('select auth_token_encrypted from app.crm_integrations', 'A cannot read CRM token');
select pg_temp.expect_denied('select stripe_subscription_id from app.subscriptions', 'A cannot read Stripe subscription id');
-- admin schema wholly closed
select pg_temp.expect_denied('select 1 from admin.leads', 'A cannot read admin.leads');
select pg_temp.expect_denied('select 1 from admin.customer_admin', 'A cannot read admin.customer_admin (ltv)');
select pg_temp.expect_denied('select 1 from admin.payment_transactions', 'A cannot read admin.payment_transactions');
select pg_temp.expect_denied('select 1 from admin.agent_runs', 'A cannot read admin.agent_runs');
select pg_temp.expect_denied('select admin.raise_alert(''x'',''info'',''x'',''x'')', 'A cannot call admin functions');
reset role;

\echo
\echo '=== Customer B (jwt sub = user B) ==='
set role authenticated;
select set_config('request.jwt.claim.sub', :'ub', false);
select 'B sees customers' as check, name from app.customers;
select 'B sees websites' as check, slug from app.websites;
select pg_temp.expect_count($$select 1 from app.customers where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$, 0, 'B cannot read customer A');
select pg_temp.expect_count($$select 1 from app.form_submissions where customer_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$, 0, 'B cannot read A form submissions');
select pg_temp.expect_count($$select 1 from app.crm_integrations where customer_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'$$, 0, 'B cannot read A CRM integration');
reset role;

\echo
\echo '=== Unknown user (valid login, no customer) and anonymous ==='
set role authenticated;
select set_config('request.jwt.claim.sub', '99999999-9999-9999-9999-999999999999', false);
select pg_temp.expect_count('select 1 from app.customers', 0, 'stranger sees no customers');
select pg_temp.expect_count('select 1 from app.websites', 0, 'stranger sees no websites');
reset role;
set role anon;
select pg_temp.expect_denied('select 1 from app.customers', 'anon cannot read app.customers');
select pg_temp.expect_denied('select 1 from admin.leads', 'anon cannot read admin.leads');
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub', '', false);
select pg_temp.expect_count('select 1 from app.customers', 0, 'no jwt sub sees nothing');
reset role;

\echo
\echo '=== Tyler (bf_admin) and backend (service_role) ==='
set role bf_admin;
select pg_temp.expect_count('select 1 from app.customers', 2, 'admin reads all customers');
select pg_temp.expect_count('select 1 from admin.customer_admin', 2, 'admin reads ltv table');
select pg_temp.expect_count('select 1 from admin.leads', 1, 'admin reads leads');
select pg_temp.expect_denied($$update app.customers set name = 'x'$$, 'admin role is read-only on app tables');
reset role;
set role service_role;
select pg_temp.expect_count('select 1 from app.form_submissions', 2, 'service_role reads everything');
reset role;

\echo
\echo '=== Data-integrity guards ==='
do $$ begin
  begin
    insert into app.form_submissions (customer_id, website_id) values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','a0000000-0000-0000-0000-000000000001');
    raise exception 'FAIL  cross-customer submission accepted';
  exception when raise_exception then
    if sqlerrm like 'FAIL%' then raise; end if;
    raise notice 'PASS  submission with mismatched customer_id rejected';
  end;
  begin
    insert into app.websites (customer_id, slug, client_json) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','s1','{"slug":"other"}');
    raise exception 'FAIL  slug mismatch accepted';
  exception when check_violation then raise notice 'PASS  websites.slug must equal client_json.slug';
  end;
end $$;

\echo
\echo 'ISOLATION TESTS COMPLETE'
