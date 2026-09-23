"""Evals for `billing/fulfillment.py` and the fulfillment hand-off inside
`billing/webhooks.py::handle_event` (BUILD_TASKS.md §5)."""
import json
import tempfile
import unittest
from datetime import date
from pathlib import Path

from billing.dunning.mocks import SendGridDunningMock
from billing.fulfillment import FULFILLMENT_EVENT_TYPE, build_fulfillment_event, read_events_ndjson, write_events_ndjson
from billing.mocks import StripeEventFactory
from billing.prices import BillingCycle, LaunchCohort, Tier, price_for_cohort
from billing.webhooks import handle_event

D0 = date(2026, 10, 5)
SMB_MONTHLY = price_for_cohort(Tier.SMB, BillingCycle.MONTHLY, LaunchCohort.LAUNCH)


def new_world():
    return {}, {}, SendGridDunningMock(), StripeEventFactory()


class FulfillmentTrigger(unittest.TestCase):
    def test_f01_first_payment_succeeded_produces_fulfillment_event(self):
        subs, accts, sg, ef = new_world()
        fulfilled = set()
        handle_event(
            ef.subscription_created("cust_1", "sub_1", SMB_MONTHLY.stripe_price_id, "smb", "monthly", D0),
            subs, accts, sg, D0, fulfilled_customers=fulfilled,
        )
        result = handle_event(
            ef.invoice_payment_succeeded("cust_1", "sub_1", SMB_MONTHLY.unit_amount_cents, D0),
            subs, accts, sg, D0, fulfilled_customers=fulfilled,
        )
        evt = result.fulfillment_event
        self.assertIsNotNone(evt)
        self.assertEqual(evt.event_type, FULFILLMENT_EVENT_TYPE)
        self.assertEqual(evt.payload["customer_id"], "cust_1")
        self.assertEqual(evt.payload["tier"], "smb")
        self.assertEqual(evt.payload["stripe_subscription_id"], "sub_1")
        self.assertEqual(evt.source, "billing.webhooks")
        self.assertEqual(evt.recipient, "platform.hosting")
        self.assertIn("fulfillment requested", result.action)
        self.assertIn("cust_1", fulfilled)

    def test_f02_second_payment_succeeded_does_not_refulfill(self):
        subs, accts, sg, ef = new_world()
        fulfilled = set()
        handle_event(
            ef.subscription_created("cust_1", "sub_1", SMB_MONTHLY.stripe_price_id, "smb", "monthly", D0),
            subs, accts, sg, D0, fulfilled_customers=fulfilled,
        )
        first = handle_event(
            ef.invoice_payment_succeeded("cust_1", "sub_1", SMB_MONTHLY.unit_amount_cents, D0),
            subs, accts, sg, D0, fulfilled_customers=fulfilled,
        )
        second = handle_event(
            ef.invoice_payment_succeeded("cust_1", "sub_1", SMB_MONTHLY.unit_amount_cents, D0),
            subs, accts, sg, D0, fulfilled_customers=fulfilled,
        )
        self.assertIsNotNone(first.fulfillment_event)
        self.assertIsNone(second.fulfillment_event)
        self.assertNotIn("fulfillment requested", second.action)

    def test_f03_no_fulfilled_customers_arg_means_no_fulfillment_ever(self):
        subs, accts, sg, ef = new_world()
        handle_event(
            ef.subscription_created("cust_1", "sub_1", SMB_MONTHLY.stripe_price_id, "smb", "monthly", D0),
            subs, accts, sg, D0,
        )
        result = handle_event(
            ef.invoice_payment_succeeded("cust_1", "sub_1", SMB_MONTHLY.unit_amount_cents, D0),
            subs, accts, sg, D0,
        )
        self.assertIsNone(result.fulfillment_event)

    def test_f04_dunning_recovery_payment_still_fulfills_once_if_not_yet_fulfilled(self):
        # Edge case: a customer whose very first payment recovers them from dunning
        # (shouldn't happen in practice — subscription.created always precedes any
        # dunning episode — but the trigger is "not yet fulfilled", not "dunning-free",
        # so this proves the two code paths compose correctly rather than fighting.
        subs, accts, sg, ef = new_world()
        fulfilled = set()
        handle_event(
            ef.subscription_created("cust_1", "sub_1", SMB_MONTHLY.stripe_price_id, "smb", "monthly", D0),
            subs, accts, sg, D0, fulfilled_customers=fulfilled,
        )
        for n in (1, 2, 3):
            handle_event(
                ef.invoice_payment_failed("cust_1", "sub_1", SMB_MONTHLY.unit_amount_cents, n, D0),
                subs, accts, sg, D0, fulfilled_customers=fulfilled,
            )
        result = handle_event(
            ef.invoice_payment_succeeded("cust_1", "sub_1", SMB_MONTHLY.unit_amount_cents, D0),
            subs, accts, sg, D0, fulfilled_customers=fulfilled,
        )
        self.assertIsNotNone(result.fulfillment_event)
        self.assertIn("cust_1", fulfilled)


class FulfillmentEventShape(unittest.TestCase):
    def test_f05_build_fulfillment_event_matches_admin_events_shape(self):
        class FakeSub:
            tier = "micro"
            billing_cycle = "annual"
            stripe_subscription_id = "sub_x"
            launch_cohort = "standard"

        evt = build_fulfillment_event(customer_id="cust_9", stripe_event_id="evt_9", subscription=FakeSub(), on=D0)
        d = evt.to_dict()
        for key in ("event_id", "stream", "source", "recipient", "event_type", "payload", "status", "attempts", "created_at"):
            self.assertIn(key, d)
        self.assertEqual(d["status"], "pending")
        self.assertEqual(d["attempts"], 0)
        self.assertEqual(d["stream"], "customer:cust_9")
        self.assertTrue(json.dumps(d))  # must be JSON-serializable — this is the transport


class NdjsonTransport(unittest.TestCase):
    def test_f06_write_then_read_round_trips(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "sub" / "queue.ndjson"
            subs, accts, sg, ef = new_world()
            fulfilled = set()
            handle_event(
                ef.subscription_created("cust_1", "sub_1", SMB_MONTHLY.stripe_price_id, "smb", "monthly", D0),
                subs, accts, sg, D0, fulfilled_customers=fulfilled,
            )
            result = handle_event(
                ef.invoice_payment_succeeded("cust_1", "sub_1", SMB_MONTHLY.unit_amount_cents, D0),
                subs, accts, sg, D0, fulfilled_customers=fulfilled,
            )
            write_events_ndjson([result.fulfillment_event], path)
            write_events_ndjson([result.fulfillment_event], path)  # append, not overwrite
            rows = read_events_ndjson(path)
            self.assertEqual(len(rows), 2)
            self.assertEqual(rows[0]["payload"]["customer_id"], "cust_1")

    def test_f07_read_missing_file_returns_empty_list(self):
        self.assertEqual(read_events_ndjson("/tmp/does-not-exist-fornax-fulfillment.ndjson"), [])


if __name__ == "__main__":
    unittest.main()
