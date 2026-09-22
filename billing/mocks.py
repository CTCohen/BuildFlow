"""Mock Stripe webhook delivery for `billing/webhooks.py`.

Same pattern as `billing/dunning/mocks.py` (in-memory recorders, no network, no real
credential) — extended here, not duplicated, for the webhook-specific pieces dunning
didn't need: signature verification and constructing scripted event payloads. No real
Stripe account exists yet (BUILD_TASKS.md §5, TYLER_QUEUE.md §2 "Stripe").
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date


class WebhookSignatureError(Exception):
    """Raised when a mock signature fails to verify — mirrors
    `stripe.error.SignatureVerificationError` in shape (an exception at the
    verification boundary), not in implementation."""


@dataclass
class WebhookSignatureMock:
    """Stand-in for `stripe.Webhook.construct_event(payload, sig_header, secret)`.

    Real Stripe HMAC-signs the raw request body with the endpoint's signing secret;
    there is no real secret to sign against yet. This mock instead requires the
    caller to pass a `sig_header` equal to `mock-sig-{secret}`, so tests can exercise
    both the "verified" and "rejected" paths without any cryptography. Swap this
    class for the real `stripe.Webhook.construct_event` call once
    `STRIPE_WEBHOOK_SECRET` exists for real (see `webhooks.py` module docstring).
    """
    secret: str
    verified_calls: list = field(default_factory=list)

    def construct_event(self, payload: dict, sig_header: str) -> dict:
        ok = sig_header == f"mock-sig-{self.secret}"
        self.verified_calls.append({"sig_header": sig_header, "ok": ok})
        if not ok:
            raise WebhookSignatureError("mock signature verification failed")
        return payload


@dataclass
class StripeEventFactory:
    """Builds scripted Stripe-shaped event payloads for tests — enough of the real
    Stripe event envelope (`id`, `type`, `data.object`) to exercise `handle_event`
    without a real Stripe account. Field names match Stripe's actual webhook payload
    shape (`customer`, `subscription`, `attempt_count`, `amount_paid`, etc.) so
    swapping in real Stripe events later requires no changes to `webhooks.py`.
    """
    _seq: int = 0

    def _next_id(self, prefix: str) -> str:
        self._seq += 1
        return f"{prefix}_ph_{self._seq}"

    def invoice_payment_failed(
        self, customer_id: str, subscription_id: str, amount_due_cents: int,
        attempt_count: int, on: date,
    ) -> dict:
        return {
            "id": self._next_id("evt"),
            "type": "invoice.payment_failed",
            "created": on.isoformat(),
            "data": {"object": {
                "id": self._next_id("in"),
                "customer": customer_id,
                "subscription": subscription_id,
                "amount_due": amount_due_cents,
                "attempt_count": attempt_count,
            }},
        }

    def invoice_payment_succeeded(
        self, customer_id: str, subscription_id: str, amount_paid_cents: int, on: date,
    ) -> dict:
        return {
            "id": self._next_id("evt"),
            "type": "invoice.payment_succeeded",
            "created": on.isoformat(),
            "data": {"object": {
                "id": self._next_id("in"),
                "customer": customer_id,
                "subscription": subscription_id,
                "amount_paid": amount_paid_cents,
            }},
        }

    def subscription_created(
        self, customer_id: str, subscription_id: str, price_id: str, tier: str,
        billing_cycle: str, on: date,
    ) -> dict:
        return {
            "id": self._next_id("evt"),
            "type": "customer.subscription.created",
            "created": on.isoformat(),
            "data": {"object": {
                "id": subscription_id,
                "customer": customer_id,
                "status": "active",
                "items": {"data": [{"price": {"id": price_id}}]},
                "metadata": {"tier": tier, "billing_cycle": billing_cycle},
            }},
        }

    def subscription_updated(
        self, customer_id: str, subscription_id: str, status: str, price_id: str, on: date,
    ) -> dict:
        return {
            "id": self._next_id("evt"),
            "type": "customer.subscription.updated",
            "created": on.isoformat(),
            "data": {"object": {
                "id": subscription_id,
                "customer": customer_id,
                "status": status,
                "items": {"data": [{"price": {"id": price_id}}]},
            }},
        }

    def subscription_deleted(self, customer_id: str, subscription_id: str, on: date) -> dict:
        return {
            "id": self._next_id("evt"),
            "type": "customer.subscription.deleted",
            "created": on.isoformat(),
            "data": {"object": {
                "id": subscription_id,
                "customer": customer_id,
                "status": "canceled",
            }},
        }
