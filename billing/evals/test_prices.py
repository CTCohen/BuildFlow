"""Evals for the Stripe products/prices catalog (all mock, no network, no LLM)."""
import unittest
from datetime import date

from billing.prices import (
    LAUNCH_MONTHLY_CENTS,
    PRICE_CATALOG,
    BillingCycle,
    LaunchCohort,
    PriceCatalogError,
    Tier,
    active_prices,
    add_price_increase,
    price_for_cohort,
)


class Catalog(unittest.TestCase):
    def test_p01_micro_and_smb_only_no_mid_market(self):
        tiers = {p.tier for p in PRICE_CATALOG}
        self.assertEqual(tiers, {Tier.MICRO, Tier.SMB})

    def test_p02_monthly_prices_match_claude_md(self):
        self.assertEqual(LAUNCH_MONTHLY_CENTS[Tier.MICRO], 14_900)
        self.assertEqual(LAUNCH_MONTHLY_CENTS[Tier.SMB], 24_900)

    def test_p03_annual_is_exactly_10x_monthly(self):
        for tier in (Tier.MICRO, Tier.SMB):
            monthly = price_for_cohort(tier, BillingCycle.MONTHLY, LaunchCohort.LAUNCH)
            annual = price_for_cohort(tier, BillingCycle.ANNUAL, LaunchCohort.LAUNCH)
            self.assertEqual(annual.unit_amount_cents, monthly.unit_amount_cents * 10)

    def test_p04_price_ids_are_obvious_placeholders(self):
        for p in PRICE_CATALOG:
            self.assertTrue(p.stripe_price_id.startswith("price_ph_"))
            self.assertTrue(p.stripe_product_id.startswith("prod_ph_"))

    def test_p05_each_active_price_is_versioned(self):
        for p in active_prices():
            self.assertGreaterEqual(p.version, 1)

    def test_p06_unknown_tier_cycle_cohort_raises(self):
        with self.assertRaises(PriceCatalogError):
            price_for_cohort(Tier.SMB, BillingCycle.MONTHLY, LaunchCohort.STANDARD)  # no standard cohort yet


class PriceIncrease(unittest.TestCase):
    def test_p07_add_price_increase_creates_new_standard_version(self):
        before = len(PRICE_CATALOG)
        new_price = add_price_increase(Tier.SMB, BillingCycle.MONTHLY, 34_900, date(2027, 6, 1))
        self.assertEqual(len(PRICE_CATALOG), before + 1)
        self.assertEqual(new_price.launch_cohort, LaunchCohort.STANDARD)
        self.assertTrue(new_price.active)
        self.assertEqual(new_price.unit_amount_cents, 34_900)

    def test_p08_price_increase_never_touches_launch_cohort(self):
        launch_before = price_for_cohort(Tier.SMB, BillingCycle.MONTHLY, LaunchCohort.LAUNCH)
        add_price_increase(Tier.SMB, BillingCycle.MONTHLY, 39_900, date(2027, 7, 1))
        launch_after = price_for_cohort(Tier.SMB, BillingCycle.MONTHLY, LaunchCohort.LAUNCH)
        self.assertEqual(launch_before.stripe_price_id, launch_after.stripe_price_id)
        self.assertEqual(launch_after.unit_amount_cents, LAUNCH_MONTHLY_CENTS[Tier.SMB])

    def test_p09_second_increase_deactivates_first_standard_version(self):
        add_price_increase(Tier.MICRO, BillingCycle.MONTHLY, 19_900, date(2027, 1, 1))
        v2 = add_price_increase(Tier.MICRO, BillingCycle.MONTHLY, 22_900, date(2027, 8, 1))
        standard_micro_monthly = [
            p for p in PRICE_CATALOG
            if p.tier == Tier.MICRO and p.billing_cycle == BillingCycle.MONTHLY and p.launch_cohort == LaunchCohort.STANDARD
        ]
        active = [p for p in standard_micro_monthly if p.active]
        self.assertEqual(len(active), 1)
        self.assertEqual(active[0].stripe_price_id, v2.stripe_price_id)

    def test_p10_new_standard_customer_resolves_to_latest_active(self):
        add_price_increase(Tier.SMB, BillingCycle.ANNUAL, 349_900, date(2027, 1, 1))
        resolved = price_for_cohort(Tier.SMB, BillingCycle.ANNUAL, LaunchCohort.STANDARD)
        self.assertEqual(resolved.unit_amount_cents, 349_900)
        self.assertTrue(resolved.active)


if __name__ == "__main__":
    unittest.main()
