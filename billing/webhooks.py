"""Stripe webhook handler — real dispatch logic, mocked delivery/verification.

Handles the Stripe payment events named in BUILD_TASKS.md §5 ("payment_succeeded,
payment_failed, subscription events") and wires a payment-failure event into
`billing/dunning/`'s already-merged Tier 1-3 state machine, matching that module's
scope and the spec header override:
    "Dunning clock starts at the third failed retry (delinquency day 0)"
    (`billing/SPEC-08-payments-billing.md` header; SPEC-08 Section 2: "After 3
    failures: mark delinquent, pause site").

What's real vs. mocked:
    - `handle_event()` and everything it calls (subscription bookkeeping, the
      3rd-failure -> `start_delinquency()` handoff, recovery on payment success)
      is real, tested dispatch logic with no Stripe-account dependency.
    - Signature verification (`WebhookSignatureMock`) and the events themselves
      (`StripeEventFactory` in `billing/mocks.py`) are mocked, because no real
      Stripe account/webhook endpoint exists yet (TYLER_QUEUE.md §2 "Stripe").
    - `billing/dunning/mocks.py`'s `SendGridDunningMock` continues to record the
      actual dunning emails `start_delinquency`/`advance` send — unchanged from
      how the dunning lane already uses it.

Going live later (once TYLER_QUEUE.md's Stripe item is resolved) needs exactly two
swaps, not a rewrite:
    1. Register a real webhook endpoint in the Stripe Dashboard, get its signing
       secret, and replace `WebhookSignatureMock.construct_event` with
       `stripe.Webhook.construct_event(payload, sig_header, secret)`.
    2. Feed `handle_event()` real Stripe event dicts (Stripe's SDK already returns
       the same `{"type", "data": {"object": {...}}}` shape this module expects)
       instead of `StripeEventFactory`'s scripted ones.

Persistence: like `billing/dunning/` and Lane C (`agents/lead/TASKS.md`), the
`Subscription` records this module manages are in-memory only (no live Supabase
project yet — COORDINATOR_STATE.md G3). Field names below mirror
`platform/CONTRACT.md`'s `app.subscriptions` exactly (`stripe_subscription_id`,
`stripe_price_id`, `tier`, `billing_cycle`, `monthly_price_cents`, `payment_status`,
`launch_cohort`, ...) so wiring this to a real Supabase read/write later is a
mechanical swap, not a schema redesign.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from enum import Enum

from .dunning.mocks import SendGridDunningMock, StripeChargeMock
from .dunning.state_machine import DunningAccount, State, TylerNotification, advance, record_payment, start_delinquency
from .mocks import WebhookSignatureMock
from .prices import PRICE_CATALOG

# SPEC-08 Section 2: "DUNNING RETRY COUNT: STANDARD (3) — LOCKED ... After 3 failures:
# mark delinquent". This is the ONLY place that threshold is applied to a webhook event —
# the dunning state machine itself takes `start_delinquency()` as a precondition-met signal
# (see billing/dunning/state_machine.py's own docstring) and does not re-count retries.
DELINQUENCY_TRIGGER_ATTEMPT_COUNT = 3

SUPPORTED_EVENT_TYPES = frozenset({
    "invoice.payment_succeeded",
    "invoice.payment_failed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
})


class WebhookHandlingError(Exception):
    """Raised for a malformed or unsupported event, or a payload referencing a
    subscription/price this handler has never seen via `customer.subscription.created`."""


class PaymentStatus(str, Enum):
    """Mirrors `platform/CONTRACT.md`'s `payment_status (subscription)` enum exactly."""
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    UNPAID = "unpaid"


@dataclass
class Subscription:
    """In-memory mirror of `app.subscriptions` (`platform/CONTRACT.md`). Not persisted —
    see module docstring."""
    customer_id: str
    stripe_subscription_id: str
    stripe_price_id: str
    tier: str
    billing_cycle: str
    monthly_price_cents: int
    payment_status: PaymentStatus = PaymentStatus.ACTIVE
    launch_cohort: str = "standard"
    canceled_at: date | None = None
    cancellation_reason: str | None = None


@dataclass
class WebhookResult:
    """What `handle_event` decided and did — for the caller (an HTTP route, or an eval)
    to log/act on. `notifications` are dunning's `TylerNotification`s, passed through
    unchanged when a payment-failure handoff reaches Tier 2/3/4."""
    event_id: str
    event_type: str
    customer_id: str | None
    action: str
    notifications: list = field(default_factory=list)


def verify_and_parse(payload: dict, sig_header: str, verifier: WebhookSignatureMock) -> dict:
    """Verify the webhook signature and return the parsed event. Raises
    `WebhookSignatureError` (from `billing/mocks.py`) on a bad signature — the caller
    (an HTTP route) is expected to turn that into a 400, same as Stripe's own guidance
    for a real `stripe.Webhook.construct_event` failure."""
    return verifier.construct_event(payload, sig_header)


def _price_lookup(price_id: str):
    for p in PRICE_CATALOG:
        if p.stripe_price_id == price_id:
            return p
    return None


def handle_event(
    event: dict,
    subscriptions: dict[str, Subscription],
    dunning_accounts: dict[str, DunningAccount],
    sendgrid: SendGridDunningMock,
    today: date,
) -> WebhookResult:
    """Dispatch one already-verified Stripe event. `subscriptions` and
    `dunning_accounts` are both keyed by `customer_id` and mutated in place — callers
    (an eval, or eventually a real route reading/writing Supabase rows) own their
    lifecycle across calls, this function does not create its own storage.
    """
    event_type = event.get("type")
    if event_type not in SUPPORTED_EVENT_TYPES:
        raise WebhookHandlingError(f"unsupported event type: {event_type!r}")

    obj = event["data"]["object"]
    customer_id = obj.get("customer")
    notifications: list[TylerNotification] = []

    if event_type == "customer.subscription.created":
        price_id = obj["items"]["data"][0]["price"]["id"]
        price = _price_lookup(price_id)
        if price is None:
            raise WebhookHandlingError(f"unknown stripe_price_id on subscription.created: {price_id!r}")
        sub = Subscription(
            customer_id=customer_id,
            stripe_subscription_id=obj["id"],
            stripe_price_id=price_id,
            tier=price.tier.value,
            billing_cycle=price.billing_cycle.value,
            monthly_price_cents=(
                price.unit_amount_cents if price.billing_cycle.value == "monthly"
                else price.unit_amount_cents // 12
            ),
            launch_cohort=price.launch_cohort.value,
            payment_status=PaymentStatus.ACTIVE,
        )
        subscriptions[customer_id] = sub
        action = f"subscription created: {sub.tier}/{sub.billing_cycle}, cohort={sub.launch_cohort}"

    elif event_type == "customer.subscription.updated":
        sub = subscriptions.get(customer_id)
        if sub is None:
            raise WebhookHandlingError(f"subscription.updated for unknown customer {customer_id!r}")
        price_id = obj["items"]["data"][0]["price"]["id"]
        price = _price_lookup(price_id)
        if price is not None:
            sub.stripe_price_id = price_id
            sub.tier = price.tier.value
            sub.billing_cycle = price.billing_cycle.value
            sub.monthly_price_cents = (
                price.unit_amount_cents if price.billing_cycle.value == "monthly"
                else price.unit_amount_cents // 12
            )
        status = obj.get("status")
        if status == "active" and sub.payment_status != PaymentStatus.CANCELED:
            sub.payment_status = PaymentStatus.ACTIVE
        elif status == "past_due":
            sub.payment_status = PaymentStatus.PAST_DUE
        elif status == "unpaid":
            sub.payment_status = PaymentStatus.UNPAID
        action = f"subscription updated: status={status}"

    elif event_type == "customer.subscription.deleted":
        sub = subscriptions.get(customer_id)
        if sub is None:
            raise WebhookHandlingError(f"subscription.deleted for unknown customer {customer_id!r}")
        sub.payment_status = PaymentStatus.CANCELED
        sub.canceled_at = today
        sub.cancellation_reason = sub.cancellation_reason or "stripe_subscription_deleted"
        action = "subscription canceled"

    elif event_type == "invoice.payment_failed":
        sub = subscriptions.get(customer_id)
        if sub is None:
            raise WebhookHandlingError(f"invoice.payment_failed for unknown customer {customer_id!r}")
        attempt_count = obj.get("attempt_count", 0)
        if attempt_count < DELINQUENCY_TRIGGER_ATTEMPT_COUNT:
            # SPEC-08 Section 2's own retry ladder (day of renewal / day 3 / day 7) is
            # still in progress — not yet a dunning-worthy delinquency.
            action = f"payment failed, attempt {attempt_count}/{DELINQUENCY_TRIGGER_ATTEMPT_COUNT} — not yet delinquent"
        else:
            sub.payment_status = PaymentStatus.PAST_DUE
            acct = dunning_accounts.get(customer_id)
            if acct is None:
                acct = DunningAccount(customer_id=customer_id, monthly_amount_cents=sub.monthly_price_cents)
                dunning_accounts[customer_id] = acct
            if acct.state in (State.ACTIVE, State.RECOVERED):
                start_delinquency(acct, today)
                action = f"3rd failed retry — handed off to dunning (episode started {today.isoformat()})"
            else:
                # Already mid-episode (e.g. a later renewal's own 3rd failure while
                # still delinquent from a prior one) — let the existing episode's
                # advance() cadence continue rather than starting a second one.
                action = f"3rd failed retry, but dunning episode already in progress (state={acct.state.value})"
            notifications.extend(advance(acct, today, StripeChargeMock(), sendgrid))

    elif event_type == "invoice.payment_succeeded":
        sub = subscriptions.get(customer_id)
        if sub is None:
            raise WebhookHandlingError(f"invoice.payment_succeeded for unknown customer {customer_id!r}")
        acct = dunning_accounts.get(customer_id)
        if acct is not None and acct.state not in (State.ACTIVE, State.RECOVERED):
            record_payment(acct, obj.get("amount_paid", sub.monthly_price_cents), today)
            sub.payment_status = PaymentStatus.ACTIVE if acct.state == State.RECOVERED else sub.payment_status
            action = f"payment succeeded — dunning episode resolved (state={acct.state.value})"
        else:
            sub.payment_status = PaymentStatus.ACTIVE
            action = "payment succeeded — no dunning episode in progress"

    else:  # pragma: no cover — guarded by SUPPORTED_EVENT_TYPES above
        raise WebhookHandlingError(f"unhandled event type: {event_type!r}")

    return WebhookResult(
        event_id=event.get("id", ""),
        event_type=event_type,
        customer_id=customer_id,
        action=action,
        notifications=notifications,
    )
