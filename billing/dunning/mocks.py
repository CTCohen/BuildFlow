"""Mock Stripe/SendGrid clients for the dunning state machine.

Neither of these makes a network call or holds a real credential — both are
scripted, in-memory recorders, matching the pattern used by
`agents/lead/send.py`'s `MockSendGrid`. No real Stripe or SendGrid account
exists yet for this project (see COORDINATOR_STATE.md Track F), so nothing
here can be swapped for a live client without deliberately doing so.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date


@dataclass
class StripeChargeMock:
    """Records charge attempts against a scripted list of outcomes.

    `outcomes` is consumed in order (True = charge succeeded); once exhausted,
    every further attempt fails. This is enough to script "3rd retry failed"
    scenarios without a real Stripe account.
    """
    outcomes: list = field(default_factory=list)
    calls: list = field(default_factory=list)

    def attempt(self, customer_id: str, amount_cents: int, on: date) -> bool:
        ok = self.outcomes.pop(0) if self.outcomes else False
        self.calls.append({"customer_id": customer_id, "amount_cents": amount_cents, "date": on, "success": ok})
        return ok


@dataclass
class SendGridDunningMock:
    """Records dunning emails in memory. Never sends for real."""
    sent: list = field(default_factory=list)

    def send(self, customer_id: str, template: str, tier: str, on: date, **fields) -> str:
        msg = {"customer_id": customer_id, "template": template, "tier": tier, "on": on, **fields}
        self.sent.append(msg)
        return f"mock-dunning-{len(self.sent)}"
