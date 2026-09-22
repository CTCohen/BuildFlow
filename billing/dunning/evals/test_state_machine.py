"""Evals for the Tiers 1-3 dunning state machine (all mock, no network, no LLM)."""
import unittest
from datetime import date, timedelta

from billing.dunning.mocks import SendGridDunningMock, StripeChargeMock
from billing.dunning.state_machine import (
    DunningAccount,
    DunningError,
    State,
    advance,
    record_payment,
    start_delinquency,
)

D0 = date(2026, 10, 5)


def acct(**k):
    return DunningAccount(customer_id="cust_1", monthly_amount_cents=24900, **k)


class Tier1(unittest.TestCase):
    def test_d01_start_pauses_site_no_emails_yet(self):
        a = acct()
        start_delinquency(a, D0)
        self.assertEqual(a.state, State.TIER1)
        self.assertTrue(a.site_paused)
        self.assertEqual(a.emails_sent_days, set())

    def test_d02_day1_sends_one_email(self):
        a = acct(); start_delinquency(a, D0)
        sg = SendGridDunningMock()
        advance(a, D0 + timedelta(days=1), StripeChargeMock(), sg)
        self.assertEqual([m["template"] for m in sg.sent], ["tier1_day1"])
        self.assertEqual(a.state, State.TIER1)

    def test_d03_day4_sends_two_emails_cumulative(self):
        a = acct(); start_delinquency(a, D0)
        sg = SendGridDunningMock()
        advance(a, D0 + timedelta(days=1), StripeChargeMock(), sg)
        advance(a, D0 + timedelta(days=4), StripeChargeMock(), sg)
        self.assertEqual([m["template"] for m in sg.sent], ["tier1_day1", "tier1_day4"])

    def test_d04_day7_escalates_to_tier2_with_all_three_emails(self):
        a = acct(); start_delinquency(a, D0)
        sg = SendGridDunningMock()
        advance(a, D0 + timedelta(days=7), StripeChargeMock(), sg)
        templates = [m["template"] for m in sg.sent]
        self.assertEqual(templates[:3], ["tier1_day1", "tier1_day4", "tier1_day7"])
        self.assertEqual(a.state, State.TIER2)

    def test_d05_single_far_jump_cascades_all_tier1_emails(self):
        """A cron catching up after being down: one advance() to day 7 must not skip emails."""
        a = acct(); start_delinquency(a, D0)
        sg = SendGridDunningMock()
        advance(a, D0 + timedelta(days=7), StripeChargeMock(), sg)
        self.assertEqual(len(sg.sent), 4)  # 3 tier1 emails + 1 tier2 payment-plan email


class Tier2(unittest.TestCase):
    def test_d06_day7_notifies_tyler_once_and_offers_plans(self):
        a = acct(); start_delinquency(a, D0)
        sg = SendGridDunningMock()
        notes = advance(a, D0 + timedelta(days=7), StripeChargeMock(), sg)
        self.assertEqual([n.tier for n in notes], ["tier2"])
        plan_msgs = [m for m in sg.sent if m["template"] == "tier2_payment_plans"]
        self.assertEqual(len(plan_msgs), 1)
        self.assertEqual(len(plan_msgs[0]["plans"]), 3)

    def test_d07_idempotent_no_duplicate_notification_or_email(self):
        a = acct(); start_delinquency(a, D0)
        sg = SendGridDunningMock()
        advance(a, D0 + timedelta(days=7), StripeChargeMock(), sg)
        notes = advance(a, D0 + timedelta(days=10), StripeChargeMock(), sg)
        self.assertEqual(notes, [])
        self.assertEqual(len([m for m in sg.sent if m["template"] == "tier2_payment_plans"]), 1)
        self.assertEqual(a.state, State.TIER2)

    def test_d08_partial_payment_reenables_site_stays_tier2(self):
        a = acct(); start_delinquency(a, D0)
        advance(a, D0 + timedelta(days=10), StripeChargeMock(), SendGridDunningMock())
        record_payment(a, 10000, D0 + timedelta(days=11))
        self.assertFalse(a.site_paused)
        self.assertTrue(a.payment_plan_active)
        self.assertEqual(a.state, State.TIER2)


class Tier3(unittest.TestCase):
    def test_d09_day30_final_notice_and_notification(self):
        a = acct(); start_delinquency(a, D0)
        sg = SendGridDunningMock()
        notes = advance(a, D0 + timedelta(days=30), StripeChargeMock(), sg)
        self.assertEqual(a.state, State.TIER3)
        self.assertIn("tier3_final_notice", [m["template"] for m in sg.sent])
        self.assertTrue(any(n.tier == "tier3" for n in notes))

    def test_d10_day40_final_offer(self):
        a = acct(); start_delinquency(a, D0)
        sg = SendGridDunningMock()
        advance(a, D0 + timedelta(days=30), StripeChargeMock(), sg)
        advance(a, D0 + timedelta(days=40), StripeChargeMock(), sg)
        self.assertIn("tier3_final_offer", [m["template"] for m in sg.sent])

    def test_d11_day60_enters_tier4_manual_and_notifies(self):
        a = acct(); start_delinquency(a, D0)
        sg = SendGridDunningMock()
        notes = advance(a, D0 + timedelta(days=60), StripeChargeMock(), sg)
        self.assertEqual(a.state, State.TIER4_MANUAL)
        self.assertTrue(any(n.tier == "tier4" for n in notes))

    def test_d12_tier4_stops_automation(self):
        """Out-of-scope tiers must not send anything further once reached."""
        a = acct(); start_delinquency(a, D0)
        sg = SendGridDunningMock()
        advance(a, D0 + timedelta(days=60), StripeChargeMock(), sg)
        count_before = len(sg.sent)
        notes = advance(a, D0 + timedelta(days=90), StripeChargeMock(), sg)
        self.assertEqual(len(sg.sent), count_before)
        self.assertEqual(notes, [])
        self.assertEqual(a.state, State.TIER4_MANUAL)


class Recovery(unittest.TestCase):
    def test_d13_full_payment_recovers_and_unpauses(self):
        a = acct(); start_delinquency(a, D0)
        record_payment(a, 24900, D0 + timedelta(days=3))
        self.assertEqual(a.state, State.RECOVERED)
        self.assertFalse(a.site_paused)

    def test_d14_first_episode_grace_forgiven(self):
        a = acct(); start_delinquency(a, D0)
        record_payment(a, 24900, D0 + timedelta(days=3))
        self.assertTrue(a.grace_forgiven)
        self.assertEqual(a.delinquency_count, 1)

    def test_d15_second_episode_no_grace(self):
        a = acct(); start_delinquency(a, D0)
        record_payment(a, 24900, D0 + timedelta(days=3))
        start_delinquency(a, D0 + timedelta(days=100))
        record_payment(a, 24900, D0 + timedelta(days=103))
        self.assertFalse(a.grace_forgiven)
        self.assertEqual(a.delinquency_count, 2)


class Errors(unittest.TestCase):
    def test_d16_cannot_double_start(self):
        a = acct(); start_delinquency(a, D0)
        with self.assertRaises(DunningError):
            start_delinquency(a, D0 + timedelta(days=1))

    def test_d17_advance_on_active_account_is_a_noop(self):
        """An account that was never delinquent has state ACTIVE; advance() must no-op,
        not raise — a cron sweeping all accounts hits current ones constantly."""
        a = acct()
        notes = advance(a, D0, StripeChargeMock(), SendGridDunningMock())
        self.assertEqual(notes, [])
        self.assertEqual(a.state, State.ACTIVE)

    def test_d18_cannot_pay_while_active(self):
        a = acct()
        with self.assertRaises(DunningError):
            record_payment(a, 24900, D0)


class StripeMockBehavior(unittest.TestCase):
    def test_d19_scripted_outcomes_consumed_in_order(self):
        s = StripeChargeMock(outcomes=[False, False, False])
        results = [s.attempt("cust_1", 24900, D0 + timedelta(days=n)) for n in (0, 3, 7)]
        self.assertEqual(results, [False, False, False])
        self.assertEqual(len(s.calls), 3)

    def test_d20_exhausted_outcomes_default_to_failure(self):
        s = StripeChargeMock(outcomes=[True])
        self.assertTrue(s.attempt("cust_1", 24900, D0))
        self.assertFalse(s.attempt("cust_1", 24900, D0))  # no more scripted outcomes -> fails closed


if __name__ == "__main__":
    unittest.main()
