"""Evals for the Stripe webhook handler (all mock, no network, no LLM)."""
import unittest
from datetime import date, timedelta

from billing.dunning.mocks import SendGridDunningMock
from billing.dunning.state_machine import State
from billing.mocks import StripeEventFactory, WebhookSignatureError, WebhookSignatureMock
from billing.prices import BillingCycle, LaunchCohort, Tier, price_for_cohort
from billing.webhooks import (
    PaymentStatus,
    Subscription,
    WebhookHandlingError,
    handle_event,
    verify_and_parse,
)

D0 = date(2026, 10, 5)
SMB_MONTHLY = price_for_cohort(Tier.SMB, BillingCycle.MONTHLY, LaunchCohort.LAUNCH)


def new_world():
    return {}, {}, SendGridDunningMock(), StripeEventFactory()


class SignatureVerification(unittest.TestCase):
    def test_w01_valid_signature_passes_through_payload(self):
        verifier = WebhookSignatureMock(secret="whsec_ph_test")
        payload = {"type": "invoice.payment_succeeded", "data": {"object": {}}}
        result = verify_and_parse(payload, "mock-sig-whsec_ph_test", verifier)
        self.assertEqual(result, payload)

    def test_w02_invalid_signature_raises(self):
        verifier = WebhookSignatureMock(secret="whsec_ph_test")
        with self.assertRaises(WebhookSignatureError):
            verify_and_parse({"type": "x"}, "mock-sig-wrong-secret", verifier)


class SubscriptionLifecycle(unittest.TestCase):
    def test_w03_subscription_created_builds_subscription_record(self):
        subs, accts, sg, ef = new_world()
        evt = ef.subscription_created("cust_1", "sub_1", SMB_MONTHLY.stripe_price_id, "smb", "monthly", D0)
        result = handle_event(evt, subs, accts, sg, D0)
        self.assertEqual(result.action.split(":")[0], "subscription created")
        sub = subs["cust_1"]
        self.assertEqual(sub.tier, "smb")
        self.assertEqual(sub.monthly_price_cents, SMB_MONTHLY.unit_amount_cents)
        self.assertEqual(sub.launch_cohort, "launch")

    def test_w04_unknown_price_id_on_created_raises(self):
        subs, accts, sg, ef = new_world()
        evt = ef.subscription_created("cust_1", "sub_1", "price_ph_does_not_exist", "smb", "monthly", D0)
        with self.assertRaises(WebhookHandlingError):
            handle_event(evt, subs, accts, sg, D0)

    def test_w05_subscription_deleted_cancels(self):
        subs, accts, sg, ef = new_world()
        handle_event(ef.subscription_created("cust_1", "sub_1", SMB_MONTHLY.stripe_price_id, "smb", "monthly", D0), subs, accts, sg, D0)
        handle_event(ef.subscription_deleted("cust_1", "sub_1", D0), subs, accts, sg, D0)
        self.assertEqual(subs["cust_1"].payment_status, PaymentStatus.CANCELED)
        self.assertEqual(subs["cust_1"].canceled_at, D0)

    def test_w06_event_for_unknown_customer_raises(self):
        subs, accts, sg, ef = new_world()
        evt = ef.subscription_deleted("cust_ghost", "sub_x", D0)
        with self.assertRaises(WebhookHandlingError):
            handle_event(evt, subs, accts, sg, D0)


class PaymentFailureHandoff(unittest.TestCase):
    def _with_sub(self, subs, accts, sg, ef):
        handle_event(ef.subscription_created("cust_1", "sub_1", SMB_MONTHLY.stripe_price_id, "smb", "monthly", D0), subs, accts, sg, D0)

    def test_w07_attempts_1_and_2_do_not_trigger_dunning(self):
        subs, accts, sg, ef = new_world()
        self._with_sub(subs, accts, sg, ef)
        for n in (1, 2):
            evt = ef.invoice_payment_failed("cust_1", "sub_1", SMB_MONTHLY.unit_amount_cents, n, D0)
            result = handle_event(evt, subs, accts, sg, D0)
            self.assertIn("not yet delinquent", result.action)
        self.assertNotIn("cust_1", accts)

    def test_w08_third_failed_attempt_starts_dunning_episode(self):
        subs, accts, sg, ef = new_world()
        self._with_sub(subs, accts, sg, ef)
        evt = ef.invoice_payment_failed("cust_1", "sub_1", SMB_MONTHLY.unit_amount_cents, 3, D0)
        result = handle_event(evt, subs, accts, sg, D0)
        self.assertIn("cust_1", accts)
        self.assertEqual(accts["cust_1"].state, State.TIER1)
        self.assertTrue(accts["cust_1"].site_paused)
        self.assertEqual(subs["cust_1"].payment_status, PaymentStatus.PAST_DUE)
        self.assertIn("dunning", result.action)

    def test_w09_third_failure_wires_into_real_dunning_emails(self):
        """The handoff must actually run dunning's advance() on day 0, not just flip state."""
        subs, accts, sg, ef = new_world()
        self._with_sub(subs, accts, sg, ef)
        handle_event(ef.invoice_payment_failed("cust_1", "sub_1", SMB_MONTHLY.unit_amount_cents, 3, D0), subs, accts, sg, D0)
        # advance() on day 0 itself sends nothing yet (day 1/4/7 emails haven't arrived) —
        # confirm the account is genuinely mid-machine, not just relabeled.
        self.assertEqual(accts["cust_1"].delinquent_since, D0)
        result = handle_event(
            ef.invoice_payment_failed("cust_1", "sub_1", SMB_MONTHLY.unit_amount_cents, 4, D0 + timedelta(days=7)),
            subs, accts, sg, D0 + timedelta(days=7),
        )
        self.assertIn("already in progress", result.action)
        self.assertEqual([m["template"] for m in sg.sent][:3], ["tier1_day1", "tier1_day4", "tier1_day7"])

    def test_w10_payment_succeeded_recovers_delinquent_account(self):
        subs, accts, sg, ef = new_world()
        self._with_sub(subs, accts, sg, ef)
        handle_event(ef.invoice_payment_failed("cust_1", "sub_1", SMB_MONTHLY.unit_amount_cents, 3, D0), subs, accts, sg, D0)
        result = handle_event(
            ef.invoice_payment_succeeded("cust_1", "sub_1", SMB_MONTHLY.unit_amount_cents, D0 + timedelta(days=3)),
            subs, accts, sg, D0 + timedelta(days=3),
        )
        self.assertEqual(accts["cust_1"].state, State.RECOVERED)
        self.assertFalse(accts["cust_1"].site_paused)
        self.assertEqual(subs["cust_1"].payment_status, PaymentStatus.ACTIVE)
        self.assertIn("resolved", result.action)

    def test_w11_payment_succeeded_with_no_delinquency_is_a_noop_recovery(self):
        subs, accts, sg, ef = new_world()
        self._with_sub(subs, accts, sg, ef)
        result = handle_event(
            ef.invoice_payment_succeeded("cust_1", "sub_1", SMB_MONTHLY.unit_amount_cents, D0),
            subs, accts, sg, D0,
        )
        self.assertEqual(subs["cust_1"].payment_status, PaymentStatus.ACTIVE)
        self.assertIn("no dunning episode", result.action)

    def test_w12_unsupported_event_type_raises(self):
        subs, accts, sg, ef = new_world()
        with self.assertRaises(WebhookHandlingError):
            handle_event({"type": "charge.dispute.created", "data": {"object": {}}}, subs, accts, sg, D0)


if __name__ == "__main__":
    unittest.main()
