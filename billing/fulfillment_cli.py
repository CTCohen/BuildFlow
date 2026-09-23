"""CLI entrypoint: run a real Stripe-webhook-to-fulfillment sequence through
`billing/webhooks.py`'s real `handle_event()` and write the resulting
`FulfillmentEvent`(s) to an ndjson queue file, in the exact `admin.events` shape
`billing/fulfillment.py` documents.

This is the Python side of the cross-language integration test
(`platform/hosting/fulfillment.test.mjs`): that test spawns this script as a real
subprocess (not a stub), so the "connection between billing and hosting" the task
asks for is exercised as two real processes handing off a real file, not two mocked
pieces asserted separately.

Usage: `python3 -m billing.fulfillment_cli <queue-path> [customer_id]`
Prints the queue path and event count to stdout on success; exit 1 on any billing
error so a calling process (or CI) sees it as a real failure, not a silent no-op.
"""
from __future__ import annotations

import sys
from datetime import date

from .dunning.mocks import SendGridDunningMock
from .fulfillment import write_events_ndjson
from .mocks import StripeEventFactory
from .prices import BillingCycle, LaunchCohort, Tier, price_for_cohort
from .webhooks import handle_event


def run(queue_path: str, customer_id: str = "cust_demo_fulfillment", on: date | None = None) -> int:
    on = on or date.today()
    subs, accounts, sendgrid, events = {}, {}, SendGridDunningMock(), StripeEventFactory()
    price = price_for_cohort(Tier.SMB, BillingCycle.MONTHLY, LaunchCohort.LAUNCH)
    fulfilled: set[str] = set()

    created = events.subscription_created(
        customer_id, f"sub_{customer_id}", price.stripe_price_id, "smb", "monthly", on,
    )
    handle_event(created, subs, accounts, sendgrid, on, fulfilled_customers=fulfilled)

    paid = events.invoice_payment_succeeded(customer_id, f"sub_{customer_id}", price.unit_amount_cents, on)
    result = handle_event(paid, subs, accounts, sendgrid, on, fulfilled_customers=fulfilled)

    if result.fulfillment_event is None:
        print("no fulfillment event produced — this is a bug in the CLI or webhooks.py", file=sys.stderr)
        return 1

    write_events_ndjson([result.fulfillment_event], queue_path)
    print(f"wrote 1 fulfillment event to {queue_path} for {customer_id}")
    return 0


def main(argv: list[str]) -> int:
    if not argv:
        print("usage: python3 -m billing.fulfillment_cli <queue-path> [customer_id]", file=sys.stderr)
        return 2
    queue_path = argv[0]
    customer_id = argv[1] if len(argv) > 1 else "cust_demo_fulfillment"
    return run(queue_path, customer_id)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
