"""Payment -> live-site fulfillment: the record `billing/webhooks.py` hands off to
`platform/hosting/`, and the CLI that lets that handoff be exercised for real across
the Python/Node boundary (BUILD_TASKS.md §5 "Payment → live site fulfillment").

## Why this shape, not literal glue code

Billing (Python) and hosting (Node, `platform/hosting/`) are different runtimes with
no shared process today, and no cross-language RPC pattern exists anywhere else in
this repo (`platform/service/server.mjs` is a bare health/ready probe, not a bridge —
checked before writing this). The one pattern that *does* already exist for exactly
this kind of hand-off is `platform/CONTRACT.md`'s `admin.events` table: "idempotent
event log + DLQ" — `id`, `event_id` (idempotency), `stream`, `source`, `recipient`,
`event_type`, `payload jsonb`, `status`, `attempts`, `created_at`. That table doesn't
exist yet as a live database (no Supabase project — gate G3), but its *shape* is
already the contract every lane codes against, so this module reuses that shape
verbatim instead of inventing a second one.

`build_fulfillment_event()` is what `billing/webhooks.py` calls to produce that row
in memory. `write_events_ndjson()` / `read_events_ndjson()` are the concrete transport
standing in for the eventual `admin.events` table row: newline-delimited JSON, one
event per line, append-only — the same shape a real Postgres LISTEN/NOTIFY or polling
consumer would read once G3 lands. `platform/hosting/fulfillment.mjs` is the Node-side
consumer of that exact shape. Going live later is a transport swap (write/read
Postgres rows instead of an ndjson file), not a schema or logic change — same
"two swaps, not a rewrite" promise `webhooks.py`'s own module docstring makes for
Stripe itself.
"""
from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from datetime import date, datetime, timezone
from pathlib import Path

# admin.events.event_type for this hand-off. Not in platform/CONTRACT.md's existing
# enum list (that list is Lane A's to extend) — namespaced `site.*` so it reads
# unambiguously next to `crm.*`/`billing.*`-shaped types if those get added later.
FULFILLMENT_EVENT_TYPE = "site.fulfillment_requested"


@dataclass
class FulfillmentEvent:
    """In-memory mirror of an `admin.events` row (platform/CONTRACT.md), scoped to
    this one event type. Field names and meanings match that table exactly."""
    event_id: str
    stream: str            # per-customer ordering key, per admin.events' own doc
    source: str
    recipient: str
    event_type: str
    payload: dict
    status: str = "pending"
    attempts: int = 0
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def to_dict(self) -> dict:
        return asdict(self)


def build_fulfillment_event(
    *, customer_id: str, stripe_event_id: str, subscription, on: date,
) -> FulfillmentEvent:
    """Build the fulfillment event for a subscription whose payment just succeeded.
    `subscription` is a `billing.webhooks.Subscription` (duck-typed here rather than
    imported, to avoid a circular import with webhooks.py, which imports this module).
    """
    payload = {
        "customer_id": customer_id,
        "tier": subscription.tier,
        "billing_cycle": subscription.billing_cycle,
        "stripe_subscription_id": subscription.stripe_subscription_id,
        "launch_cohort": subscription.launch_cohort,
        "triggering_stripe_event_id": stripe_event_id,
        "requested_at": on.isoformat(),
    }
    return FulfillmentEvent(
        event_id=f"fulfill_{stripe_event_id}",
        stream=f"customer:{customer_id}",
        source="billing.webhooks",
        recipient="platform.hosting",
        event_type=FULFILLMENT_EVENT_TYPE,
        payload=payload,
    )


def write_events_ndjson(events: list[FulfillmentEvent], path: str | Path) -> None:
    """Append events to the ndjson queue file (the stand-in transport — see module
    docstring). Each line is one `admin.events`-shaped JSON row."""
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with p.open("a", encoding="utf-8") as f:
        for evt in events:
            f.write(json.dumps(evt.to_dict(), sort_keys=True))
            f.write("\n")


def read_events_ndjson(path: str | Path) -> list[dict]:
    """Read back the ndjson queue file. Provided for symmetry/testing on the Python
    side; the real consumer is `platform/hosting/fulfillment.mjs`'s
    `readFulfillmentQueue`, which parses the same format independently (proving the
    format, not a shared parser, is the contract)."""
    p = Path(path)
    if not p.exists():
        return []
    out = []
    for line in p.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line:
            out.append(json.loads(line))
    return out
