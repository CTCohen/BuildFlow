import unittest

from crm.hubspot.mocks import MockHubSpotClient, MockTylerNotifier
from crm.hubspot.sync import (
    NOTIFY_AFTER_FAILURES,
    PAUSE_AFTER_FAILURES,
    RETRY_DELAYS_SECONDS,
    HubSpotSyncEngine,
    SyncStatus,
)

LEAD = {
    "id": "lead-1",
    "name": "Dana Lee",
    "email": "dana@leehvac.com",
    "phone": "555-0101",
    "company": "Lee HVAC",
    "title": "Owner",
    "vertical": "hvac",
    "website_url": "https://leehvac.com",
    "source": "apollo",
    "status": "scored",
    "score": 74,
    "assigned_tier": "SMB",
}

PROSPECT = {
    "id": "prospect-1",
    "lead_id": "lead-1",
    "demo_generated_at": "2026-09-20T10:00:00Z",
    "demo_view_count": 1,
    "demo_converted_at": None,
}


def make_engine(outcomes):
    client = MockHubSpotClient(outcomes=outcomes)
    notifier = MockTylerNotifier()
    return HubSpotSyncEngine(client=client, notifier=notifier), client, notifier


class TestHappyPath(unittest.TestCase):
    def test_first_attempt_success_pushes_contact_and_deal(self):
        engine, client, notifier = make_engine(outcomes=[True, True])  # contact ok, deal ok
        state = engine.enqueue(LEAD, PROSPECT)
        touched = engine.run_cycle(now=0.0, leads_by_id={"lead-1": LEAD}, prospects_by_lead_id={"lead-1": PROSPECT})

        self.assertEqual(len(touched), 1)
        self.assertEqual(state.status, SyncStatus.SUCCEEDED)
        self.assertEqual(state.attempts, 1)
        self.assertIsNotNone(state.hubspot_contact_id)
        self.assertIsNotNone(state.hubspot_deal_id)
        self.assertEqual(len(client.contact_calls), 1)
        self.assertEqual(len(client.deal_calls), 1)
        self.assertEqual(notifier.notifications, [])

    def test_succeeded_lead_is_not_retouched_on_later_cycles(self):
        engine, client, _ = make_engine(outcomes=[True, True])
        engine.enqueue(LEAD, PROSPECT)
        engine.run_cycle(now=0.0, leads_by_id={"lead-1": LEAD}, prospects_by_lead_id={"lead-1": PROSPECT})
        touched_again = engine.run_cycle(now=300.0, leads_by_id={"lead-1": LEAD}, prospects_by_lead_id={"lead-1": PROSPECT})
        self.assertEqual(touched_again, [])
        self.assertEqual(len(client.contact_calls), 1)  # not called again


class TestRetryLadder(unittest.TestCase):
    def test_retry_delays_match_spec_1_5_30_300(self):
        # fail contact upsert every time -> pure retry-ladder timing test
        engine, client, notifier = make_engine(outcomes=[False] * 10)
        state = engine.enqueue(LEAD, PROSPECT)

        now = 0.0
        engine.run_cycle(now=now, leads_by_id={"lead-1": LEAD})
        self.assertEqual(state.attempts, 1)
        self.assertAlmostEqual(state.next_attempt_at, now + RETRY_DELAYS_SECONDS[0])  # +1s

        # too early — nothing happens before next_attempt_at
        engine.run_cycle(now=now + 0.5, leads_by_id={"lead-1": LEAD})
        self.assertEqual(state.attempts, 1)

        now = state.next_attempt_at
        engine.run_cycle(now=now, leads_by_id={"lead-1": LEAD})
        self.assertEqual(state.attempts, 2)
        self.assertAlmostEqual(state.next_attempt_at, now + RETRY_DELAYS_SECONDS[1])  # +5s

        now = state.next_attempt_at
        engine.run_cycle(now=now, leads_by_id={"lead-1": LEAD})
        self.assertEqual(state.attempts, 3)
        self.assertAlmostEqual(state.next_attempt_at, now + RETRY_DELAYS_SECONDS[2])  # +30s
        self.assertTrue(state.tyler_notified)
        self.assertEqual(len(notifier.notifications), 1)
        self.assertEqual(notifier.notifications[0]["attempt_count"], NOTIFY_AFTER_FAILURES)

        now = state.next_attempt_at
        engine.run_cycle(now=now, leads_by_id={"lead-1": LEAD})
        self.assertEqual(state.attempts, 4)
        self.assertAlmostEqual(state.next_attempt_at, now + RETRY_DELAYS_SECONDS[3])  # +300s (5min)

        now = state.next_attempt_at
        engine.run_cycle(now=now, leads_by_id={"lead-1": LEAD})
        self.assertEqual(state.attempts, 5)
        self.assertEqual(state.status, SyncStatus.PAUSED)
        self.assertEqual(state.attempts, PAUSE_AFTER_FAILURES)

    def test_notified_exactly_once_even_if_failures_continue(self):
        engine, client, notifier = make_engine(outcomes=[False] * 10)
        engine.enqueue(LEAD, PROSPECT)
        now = 0.0
        for _ in range(5):
            engine.run_cycle(now=now, leads_by_id={"lead-1": LEAD})
            now = engine.states["lead-1"].next_attempt_at or now
        self.assertEqual(len(notifier.notifications), 1)

    def test_paused_lead_is_never_retried_automatically(self):
        engine, client, _ = make_engine(outcomes=[False] * 10)
        engine.enqueue(LEAD, PROSPECT)
        now = 0.0
        for _ in range(5):
            engine.run_cycle(now=now, leads_by_id={"lead-1": LEAD})
            now = engine.states["lead-1"].next_attempt_at or now
        calls_at_pause = len(engine.client.contact_calls)
        engine.run_cycle(now=now + 10_000, leads_by_id={"lead-1": LEAD})
        self.assertEqual(len(engine.client.contact_calls), calls_at_pause)

    def test_manual_reset_reenables_a_paused_lead(self):
        engine, client, _ = make_engine(outcomes=[False, False, False, False, False, True, True])
        engine.enqueue(LEAD, PROSPECT)
        now = 0.0
        for _ in range(5):
            engine.run_cycle(now=now, leads_by_id={"lead-1": LEAD})
            now = engine.states["lead-1"].next_attempt_at or now
        self.assertEqual(engine.states["lead-1"].status, SyncStatus.PAUSED)

        engine.reset_paused("lead-1")
        touched = engine.run_cycle(now=now + 1, leads_by_id={"lead-1": LEAD}, prospects_by_lead_id={"lead-1": PROSPECT})
        self.assertEqual(engine.states["lead-1"].status, SyncStatus.SUCCEEDED)
        self.assertEqual(len(touched), 1)

    def test_partial_failure_retries_only_the_failed_item(self):
        # lead-1 succeeds first try, lead-2 fails first try — only lead-2 should retry
        engine = HubSpotSyncEngine(client=MockHubSpotClient(outcomes=[True, True, False]), notifier=MockTylerNotifier())
        lead2 = {**LEAD, "id": "lead-2", "email": "other@x.com"}
        engine.enqueue(LEAD, PROSPECT)
        engine.enqueue(lead2, None)
        touched = engine.run_cycle(now=0.0, leads_by_id={"lead-1": LEAD, "lead-2": lead2}, prospects_by_lead_id={"lead-1": PROSPECT})
        self.assertEqual(engine.states["lead-1"].status, SyncStatus.SUCCEEDED)
        self.assertEqual(engine.states["lead-2"].status, SyncStatus.PENDING)
        self.assertEqual(engine.states["lead-2"].attempts, 1)
        self.assertEqual(len(touched), 2)


class TestEndToEndTestLead(unittest.TestCase):
    """The task's item 3: a test lead going through the full pipeline (mocked)."""

    def test_lead_lands_in_mock_hubspot_after_transient_failure_then_success(self):
        # Simulates: batch 1 transient API failure, batch 2 (5 min later) succeeds.
        client = MockHubSpotClient(outcomes=[False, True, True])
        notifier = MockTylerNotifier()
        engine = HubSpotSyncEngine(client=client, notifier=notifier)

        test_lead = {
            "id": "test-lead-e2e",
            "name": "Test Prospect",
            "email": "test-prospect@example-hvac.com",
            "phone": "555-0199",
            "company": "Example HVAC Co",
            "title": "Owner",
            "vertical": "hvac",
            "website_url": "https://example-hvac.com",
            "source": "manual",
            "status": "scored",
            "score": 88,
            "assigned_tier": "SMB",
        }
        test_prospect = {
            "id": "test-prospect-e2e",
            "lead_id": "test-lead-e2e",
            "demo_generated_at": "2026-09-22T00:00:00Z",
            "demo_view_count": 0,
            "demo_converted_at": None,
        }

        engine.enqueue(test_lead, test_prospect)

        # batch 1 at t=0: contact upsert fails transiently
        engine.run_cycle(now=0.0, leads_by_id={"test-lead-e2e": test_lead}, prospects_by_lead_id={"test-lead-e2e": test_prospect})
        state = engine.states["test-lead-e2e"]
        self.assertEqual(state.status, SyncStatus.PENDING)
        self.assertEqual(state.attempts, 1)
        self.assertEqual(state.next_attempt_at, 1.0)  # 1s backoff

        # batch 2, 5 minutes later (well past the 1s retry delay): succeeds
        engine.run_cycle(now=300.0, leads_by_id={"test-lead-e2e": test_lead}, prospects_by_lead_id={"test-lead-e2e": test_prospect})
        self.assertEqual(state.status, SyncStatus.SUCCEEDED)
        self.assertEqual(state.attempts, 2)
        self.assertTrue(state.hubspot_contact_id.startswith("hs-contact-"))
        self.assertTrue(state.hubspot_deal_id.startswith("hs-deal-"))

        # verify what actually landed in "HubSpot" (the mock) — field mapping proof
        final_contact_call = client.contact_calls[-1]
        self.assertTrue(final_contact_call["success"])
        self.assertEqual(final_contact_call["properties"]["email"], "test-prospect@example-hvac.com")
        self.assertEqual(final_contact_call["properties"]["firstname"], "Test")
        self.assertEqual(final_contact_call["properties"]["lastname"], "Prospect")
        self.assertEqual(final_contact_call["properties"]["fornax_lead_id"], "test-lead-e2e")

        final_deal_call = client.deal_calls[-1]
        self.assertTrue(final_deal_call["success"])
        self.assertEqual(final_deal_call["properties"]["dealname"], "Example HVAC Co — Fornax smb")
        self.assertEqual(final_deal_call["properties"]["amount"], 249.0)
        self.assertEqual(final_deal_call["associated_contact_id"], state.hubspot_contact_id)

        self.assertEqual(notifier.notifications, [])  # never hit 3 failures, no Tyler alert


if __name__ == "__main__":
    unittest.main()
