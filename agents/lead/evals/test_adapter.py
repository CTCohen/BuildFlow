"""Evals for adapter.py: plain-dict lead/prospect shapes -> platform/CONTRACT.md admin tables."""
import unittest

from agents.lead.adapter import to_campaign_run_row, to_lead_row, to_lead_warehouse_row, to_prospect_row
from agents.lead.scoring import score_lead

ICP_LEAD = {"company": "Acme Plumbing", "email": "a@acme.example", "phone": "555-000-1111",
            "vertical": "plumbing", "state": "AZ", "city": "Mesa", "headcount": 8,
            "years_in_business": 5, "review_count": 40, "has_website": True, "has_gbp": True,
            "source": "google-places"}

MIDMARKET_LEAD = {"company": "Big Plumbing Co", "email": "b@big.example", "phone": "555-000-2222",
                   "vertical": "plumbing", "state": "AZ", "city": "Phoenix", "headcount": 60,
                   "years_in_business": 10, "review_count": 300, "source": "apollo"}


class WarehouseRow(unittest.TestCase):
    def test_a01_shape(self):
        raw = {"company": "Acme Plumbing", "email": "a@acme.example", "phone": "555-000-1111",
               "vertical": "plumbing", "city": "Mesa", "state": "AZ", "website": "acme.example"}
        row = to_lead_warehouse_row(raw, source="google-places", dedupe_key="5550001111")
        for f in ("id", "source", "source_ref", "dedupe_key", "company", "name", "email", "phone",
                  "vertical", "location", "website_url", "raw", "created_at", "last_seen_at"):
            self.assertIn(f, row)
        self.assertEqual(row["location"], "Mesa, AZ")
        self.assertEqual(row["website_url"], "acme.example")
        self.assertEqual(row["source"], "google-places")
        self.assertEqual(row["raw"], raw)

    def test_a02_stable_id_when_given(self):
        raw = {"company": "X"}
        row = to_lead_warehouse_row(raw, source="manual", dedupe_key="x", warehouse_id="fixed-id")
        self.assertEqual(row["id"], "fixed-id")


class LeadRow(unittest.TestCase):
    def test_a03_icp_lead_row(self):
        result = score_lead(ICP_LEAD)
        row = to_lead_row(ICP_LEAD, result, warehouse_id="wh-1")
        self.assertEqual(row["warehouse_id"], "wh-1")
        self.assertEqual(row["company"], "Acme Plumbing")
        self.assertEqual(row["status"], "scored")
        self.assertIsNotNone(row["assigned_tier"])
        self.assertEqual(row["score"], result["score"])
        self.assertEqual(row["score_reason"]["route"], result["route"])
        self.assertIn("has_website", row["intent_signals"])

    def test_a04_midmarket_is_suppressed_status(self):
        # D29 (ruled 2026-09-21): captured, not sent -- reflected as status "suppressed", no tier.
        result = score_lead(MIDMARKET_LEAD)
        self.assertTrue(result["suppressed"])
        row = to_lead_row(MIDMARKET_LEAD, result, warehouse_id="wh-2")
        self.assertEqual(row["status"], "suppressed")
        self.assertIsNone(row["assigned_tier"])


class ProspectRow(unittest.TestCase):
    def test_a05_prospect_from_scored_lead(self):
        result = score_lead(ICP_LEAD)
        lead_row = to_lead_row(ICP_LEAD, result, warehouse_id="wh-1")
        prospect = to_prospect_row(lead_row)
        self.assertEqual(prospect["lead_id"], lead_row["id"])
        self.assertEqual(prospect["demo_view_count"], 0)
        self.assertIsNone(prospect["customer_id"])

    def test_a06_suppressed_lead_refuses_prospect(self):
        result = score_lead(MIDMARKET_LEAD)
        lead_row = to_lead_row(MIDMARKET_LEAD, result, warehouse_id="wh-2")
        with self.assertRaises(ValueError):
            to_prospect_row(lead_row)


class CampaignRunRow(unittest.TestCase):
    def test_a07_queued_without_message_id(self):
        result = score_lead(ICP_LEAD)
        lead_row = to_lead_row(ICP_LEAD, result, warehouse_id="wh-1")
        prospect = to_prospect_row(lead_row)
        msg = {"subject": "Hey Acme", "body": "...", "utm": {"campaign": "outbound"}}
        row = to_campaign_run_row(prospect, lead_row, 1, msg, "https://demo.example/acme")
        self.assertEqual(row["status"], "queued")
        self.assertIsNone(row["sent_at"])
        self.assertEqual(row["touch_number"], 1)
        self.assertEqual(row["demo_url"], "https://demo.example/acme")

    def test_a08_sent_with_message_id(self):
        result = score_lead(ICP_LEAD)
        lead_row = to_lead_row(ICP_LEAD, result, warehouse_id="wh-1")
        prospect = to_prospect_row(lead_row)
        msg = {"subject": "Hey Acme", "body": "..."}
        row = to_campaign_run_row(prospect, lead_row, 1, msg, "https://demo.example/acme",
                                   sendgrid_message_id="mock-1")
        self.assertEqual(row["status"], "sent")
        self.assertIsNotNone(row["sent_at"])
        self.assertEqual(row["sendgrid_message_id"], "mock-1")


if __name__ == "__main__":
    unittest.main()
