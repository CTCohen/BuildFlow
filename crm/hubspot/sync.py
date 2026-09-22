"""One-way push connector: `admin.leads`/`admin.prospects` -> HubSpot contact/deal.

Deterministic, no LLM (matches SPEC-09 Section 7 — the push half of the CRM Sync Agent is
"deterministic/cheap-tier, no LLM"; the conflict-reconciliation half is out of scope here,
that's for the two-way sync SPEC-09 explicitly defers to Phase 2).

Batch cadence: every 5 minutes, per SPEC-09 Section 2 ("within 5 minutes (batch sync every
5 min)") and Section 5B ("Cloud Scheduler cron every 5 min"). `run_cycle()` is one such
tick; the caller (a scheduler, or a test) is responsible for calling it on that cadence —
this module has no internal timer, same as `billing/dunning/state_machine.py`'s `advance()`
being called by an external clock/cron rather than sleeping itself.

Retry policy: `crm/SPEC-09-crm-integration.md`'s override block — "retries 1s/5s/30s/5min
(max 5), Tyler notified after 3 failures, sync paused at 5" — confirmed against
`crm/SPEC-10-external-integrations.md` line 89 ("3 failures -> Tyler notified. 5 -> sync
paused, customer alerted."). Both spec files agree; nothing here is a guessed secondhand
summary.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum

from .mapping import lead_prospect_to_hubspot_deal, lead_to_hubspot_contact
from .mocks import HubSpotAPIError, MockHubSpotClient, MockTylerNotifier

# --- Locked retry constants (SPEC-09 override block, confirmed by SPEC-10 line 89) ---
RETRY_DELAYS_SECONDS: tuple[float, ...] = (1, 5, 30, 300)  # 1s / 5s / 30s / 5min
MAX_ATTEMPTS = 5          # 1 initial attempt + up to 4 retries
NOTIFY_AFTER_FAILURES = 3  # Tyler notified once, after the 3rd failed attempt
PAUSE_AFTER_FAILURES = 5   # sync paused for this lead after the 5th failed attempt


class SyncError(Exception):
    """Raised on a programming/usage error (e.g. advancing a paused item without reset)."""


class SyncStatus(str, Enum):
    PENDING = "pending"      # queued, not yet attempted (or waiting for its retry delay)
    SUCCEEDED = "succeeded"  # contact + deal both pushed this run
    PAUSED = "paused"        # 5th failure reached — sync paused, needs manual reset


@dataclass
class LeadSyncState:
    """Per-lead sync bookkeeping. Persistence is out of scope (no live Supabase project
    yet, same status as the other lanes' mocked work) — this is the in-memory equivalent
    of what would live in `app.crm_sync_log`/`admin.leads.crm_*` columns."""
    lead_id: object
    status: SyncStatus = SyncStatus.PENDING
    attempts: int = 0
    next_attempt_at: float = 0.0
    hubspot_contact_id: str | None = None
    hubspot_deal_id: str | None = None
    tyler_notified: bool = False
    log: list = field(default_factory=list)


@dataclass
class HubSpotSyncEngine:
    """Owns the retry queue and batch cadence for the push connector."""
    client: MockHubSpotClient
    notifier: MockTylerNotifier
    states: dict = field(default_factory=dict)  # lead_id -> LeadSyncState

    def enqueue(self, lead: dict, prospect: dict | None = None) -> LeadSyncState:
        """Add (or re-fetch) a lead for sync. Idempotent — enqueuing an already-succeeded
        or in-progress lead just returns its existing state."""
        lead_id = lead["id"]
        if lead_id not in self.states:
            self.states[lead_id] = LeadSyncState(lead_id=lead_id)
        return self.states[lead_id]

    def reset_paused(self, lead_id) -> None:
        """Manual re-enable after a customer/Tyler fixes whatever caused 5 straight
        failures (e.g. a bad field mapping). Not automatic — SPEC-09 Section 4 requires
        persistent errors to stop retrying, not loop forever."""
        state = self.states.get(lead_id)
        if state is None:
            raise SyncError(f"no sync state for lead {lead_id!r}")
        state.status = SyncStatus.PENDING
        state.attempts = 0
        state.next_attempt_at = 0.0
        state.tyler_notified = False
        state.log.append("manually reset after pause")

    def _push_one(self, lead: dict, prospect: dict | None, state: LeadSyncState) -> None:
        contact_props = lead_to_hubspot_contact(lead)
        contact_id = self.client.upsert_contact(contact_props)
        deal_props = lead_prospect_to_hubspot_deal(lead, prospect)
        deal_id = self.client.upsert_deal(deal_props, associated_contact_id=contact_id)
        state.hubspot_contact_id = contact_id
        state.hubspot_deal_id = deal_id

    def run_cycle(self, now: float, leads_by_id: dict, prospects_by_lead_id: dict | None = None) -> list:
        """One 5-minute batch tick. Attempts every enqueued lead whose `next_attempt_at`
        has arrived and that isn't already succeeded/paused. Returns the list of
        `LeadSyncState`s touched this cycle (success or failure), for the caller to log —
        mirrors `billing/dunning/state_machine.advance()`'s return-what-happened shape.
        """
        prospects_by_lead_id = prospects_by_lead_id or {}
        touched: list[LeadSyncState] = []

        for lead_id, state in self.states.items():
            if state.status in (SyncStatus.SUCCEEDED, SyncStatus.PAUSED):
                continue
            if state.next_attempt_at > now:
                continue

            lead = leads_by_id.get(lead_id)
            if lead is None:
                continue  # lead vanished from the source set (deleted/soft-deleted) — skip

            prospect = prospects_by_lead_id.get(lead_id)
            state.attempts += 1
            try:
                self._push_one(lead, prospect, state)
            except HubSpotAPIError as exc:
                state.log.append(f"attempt {state.attempts} failed: {exc}")

                if state.attempts >= NOTIFY_AFTER_FAILURES and not state.tyler_notified:
                    self.notifier.notify(
                        reason=f"HubSpot push failing ({state.attempts} attempts): {exc}",
                        lead_id=lead_id,
                        attempt_count=state.attempts,
                    )
                    state.tyler_notified = True
                    state.log.append(f"Tyler notified at attempt {state.attempts}")

                if state.attempts >= PAUSE_AFTER_FAILURES:
                    state.status = SyncStatus.PAUSED
                    state.log.append(f"sync paused after {state.attempts} attempts")
                else:
                    delay_index = min(state.attempts - 1, len(RETRY_DELAYS_SECONDS) - 1)
                    state.next_attempt_at = now + RETRY_DELAYS_SECONDS[delay_index]
                    state.log.append(
                        f"retry scheduled in {RETRY_DELAYS_SECONDS[delay_index]}s "
                        f"(next_attempt_at={state.next_attempt_at})"
                    )
                touched.append(state)
                continue

            state.status = SyncStatus.SUCCEEDED
            state.log.append(
                f"attempt {state.attempts} succeeded: contact={state.hubspot_contact_id} "
                f"deal={state.hubspot_deal_id}"
            )
            touched.append(state)

        return touched
