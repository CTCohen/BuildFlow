"""Mock HubSpot client for the push connector.

Same pattern as `billing/dunning/mocks.py` (which itself follows
`agents/lead/send.py`'s `MockSendGrid`): a scripted, in-memory recorder, no network call,
no real credential. No real HubSpot developer/private app exists yet for this project
(TYLER_QUEUE.md §2 lists it as not created), so nothing here can be swapped for a live
client without deliberately doing so.
"""
from __future__ import annotations

from dataclasses import dataclass, field


class HubSpotAPIError(Exception):
    """Raised by the mock to simulate a HubSpot API failure (rate limit, 5xx, timeout)."""


@dataclass
class MockHubSpotClient:
    """Records upsert calls against a scripted list of outcomes.

    `outcomes` is consumed in order per call (True = call succeeded); once exhausted,
    every further call succeeds by default (set `default_success=False` to instead fail
    open, for scripting "account stays down" scenarios). This is enough to script
    "Nth attempt fails" retry scenarios without a real HubSpot account.
    """
    outcomes: list = field(default_factory=list)
    default_success: bool = True
    contact_calls: list = field(default_factory=list)
    deal_calls: list = field(default_factory=list)
    _next_contact_id: int = 1000
    _next_deal_id: int = 5000

    def _consume_outcome(self) -> bool:
        if self.outcomes:
            return self.outcomes.pop(0)
        return self.default_success

    def upsert_contact(self, properties: dict) -> str:
        """Upsert-by-email semantics (HubSpot's own contact de-dupe key). Returns the
        HubSpot object id on success; raises `HubSpotAPIError` on a scripted failure."""
        ok = self._consume_outcome()
        self.contact_calls.append({"properties": properties, "success": ok})
        if not ok:
            raise HubSpotAPIError(f"mock HubSpot contact upsert failed for {properties.get('email')!r}")
        object_id = f"hs-contact-{self._next_contact_id}"
        self._next_contact_id += 1
        return object_id

    def upsert_deal(self, properties: dict, associated_contact_id: str | None = None) -> str:
        ok = self._consume_outcome()
        self.deal_calls.append({
            "properties": properties,
            "associated_contact_id": associated_contact_id,
            "success": ok,
        })
        if not ok:
            raise HubSpotAPIError(f"mock HubSpot deal upsert failed for {properties.get('dealname')!r}")
        object_id = f"hs-deal-{self._next_deal_id}"
        self._next_deal_id += 1
        return object_id


@dataclass
class MockTylerNotifier:
    """Records "notify Tyler" events instead of sending anything real. Mirrors
    `billing/dunning/state_machine.py`'s `TylerNotification` pattern: the sync engine
    decides *that* Tyler needs telling, this mock (or, later, a real notifier) just
    records it — actual delivery is out of scope here, same as dunning."""
    notifications: list = field(default_factory=list)

    def notify(self, reason: str, lead_id, attempt_count: int) -> None:
        self.notifications.append({
            "reason": reason,
            "lead_id": lead_id,
            "attempt_count": attempt_count,
        })
