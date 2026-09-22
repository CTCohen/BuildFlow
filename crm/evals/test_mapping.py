import unittest

from crm.hubspot.mapping import (
    TIER_TO_MONTHLY_CENTS,
    lead_prospect_to_hubspot_deal,
    lead_to_hubspot_contact,
)

SAMPLE_LEAD = {
    "id": "lead-1",
    "name": "Maria Gonzalez",
    "email": "maria@acmehvac.com",
    "phone": "555-0100",
    "company": "Acme HVAC",
    "title": "Owner",
    "location": "Phoenix, AZ",
    "vertical": "hvac",
    "website_url": "https://acmehvac.com",
    "source": "google-places",
    "status": "scored",
    "score": 82,
    "assigned_tier": "SMB",
}

SAMPLE_PROSPECT = {
    "id": "prospect-1",
    "lead_id": "lead-1",
    "demo_generated_at": "2026-09-20T10:00:00Z",
    "demo_view_count": 3,
    "demo_converted_at": None,
}


class TestLeadToContact(unittest.TestCase):
    def test_splits_name_and_maps_core_fields(self):
        props = lead_to_hubspot_contact(SAMPLE_LEAD)
        self.assertEqual(props["firstname"], "Maria")
        self.assertEqual(props["lastname"], "Gonzalez")
        self.assertEqual(props["email"], "maria@acmehvac.com")
        self.assertEqual(props["company"], "Acme HVAC")
        self.assertEqual(props["fornax_lead_id"], "lead-1")
        self.assertEqual(props["fornax_lead_score"], 82)

    def test_single_word_name_goes_to_firstname(self):
        lead = {**SAMPLE_LEAD, "name": "Cher"}
        props = lead_to_hubspot_contact(lead)
        self.assertEqual(props["firstname"], "Cher")
        self.assertEqual(props["lastname"], "")

    def test_status_maps_to_lifecyclestage(self):
        self.assertEqual(
            lead_to_hubspot_contact({**SAMPLE_LEAD, "status": "converted"})["lifecyclestage"],
            "customer",
        )
        self.assertEqual(
            lead_to_hubspot_contact({**SAMPLE_LEAD, "status": "contacted"})["lifecyclestage"],
            "salesqualifiedlead",
        )

    def test_missing_email_raises(self):
        lead = {**SAMPLE_LEAD, "email": None}
        with self.assertRaises(ValueError):
            lead_to_hubspot_contact(lead)

    def test_no_none_values_leak_into_properties(self):
        lead = {**SAMPLE_LEAD, "phone": None, "company": None}
        props = lead_to_hubspot_contact(lead)
        self.assertNotIn(None, props.values())


class TestLeadProspectToDeal(unittest.TestCase):
    def test_maps_tier_to_amount(self):
        deal = lead_prospect_to_hubspot_deal(SAMPLE_LEAD, SAMPLE_PROSPECT)
        self.assertEqual(deal["amount"], TIER_TO_MONTHLY_CENTS["smb"] / 100)
        self.assertEqual(deal["fornax_assigned_tier"], "smb")

    def test_status_maps_to_dealstage(self):
        deal = lead_prospect_to_hubspot_deal({**SAMPLE_LEAD, "status": "converted"}, None)
        self.assertEqual(deal["dealstage"], "closedwon")

    def test_works_without_prospect_row(self):
        deal = lead_prospect_to_hubspot_deal(SAMPLE_LEAD, None)
        self.assertNotIn("fornax_demo_generated_at", deal)
        self.assertTrue(deal["dealname"].startswith("Acme HVAC"))

    def test_includes_demo_fields_when_prospect_present(self):
        deal = lead_prospect_to_hubspot_deal(SAMPLE_LEAD, SAMPLE_PROSPECT)
        self.assertEqual(deal["fornax_demo_view_count"], 3)

    def test_unscored_tier_has_no_amount(self):
        lead = {**SAMPLE_LEAD, "assigned_tier": None}
        deal = lead_prospect_to_hubspot_deal(lead, None)
        self.assertNotIn("amount", deal)


if __name__ == "__main__":
    unittest.main()
