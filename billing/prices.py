"""Stripe Products/Prices catalog — Micro and SMB, monthly and annual, versioned.

Scope (BUILD_TASKS.md §5 "Stripe test-mode products/prices"): Mid-Market is paused
per DECISIONS.md item 4/14 ("shown on the site and pricing, nothing built") — no
Mid-Market entry exists in this catalog and none should be added until Tyler lifts
the pause.

No real Stripe account exists yet (TYLER_QUEUE.md §2 "Stripe"). Every `stripe_price_id`
and `stripe_product_id` below is an obvious placeholder (`price_ph_...` / `prod_ph_...`)
— never a real Stripe object ID. Swapping to real IDs is a data change (create the
real Products/Prices in the Stripe Dashboard or via `stripe.Price.create`, then update
`PRICE_CATALOG` below), not a code change — nothing that reads this module cares
whether the ID is real or a placeholder.

Versioning scheme (SPEC-08 header override: "Prices will rise soon after launch: use
versioned Stripe Price IDs and a launch-cohort flag on the customer" — DECISIONS.md D02):
    - Each (tier, billing_cycle) pair has one or more `PriceVersion` rows, `version`
      1, 2, 3, ... in ascending price order. Only one version per (tier, billing_cycle)
      is `active=True` at a time — that is the price offered to *new* signups today.
    - A customer's own `stripe_price_id` (set at signup, stored per
      `platform/CONTRACT.md`'s `app.subscriptions.stripe_price_id`) never changes on
      its own when a new version goes active — Stripe (and this catalog) never
      retroactively repriced an existing subscription.
    - `launch_cohort` on the row is which cohort *that catalog price* is for:
      "launch" = the version offered to launch-window signups (grandfathered forever
      per DECISIONS.md D02, RECONCILIATION_LOG D02 — pending Tyler's exact grandfather
      cutoff, tracked in TYLER_QUEUE.md), "standard" = the version offered once launch
      pricing ends. Both a customer row (`app.subscriptions.launch_cohort`) and a
      price-catalog row carry the flag; `price_for_cohort()` below is what joins them.
    - Raising prices later means: add a new `PriceVersion` row with `launch_cohort="standard"`
      and a higher `version` number, flip its `active` on and the previous standard
      version's `active` off. The "launch" cohort rows are never deactivated — anyone
      on `launch_cohort="launch"` keeps resolving to the launch price forever via
      `price_for_cohort()`, which is the whole point of grandfathering.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from enum import Enum


class PriceCatalogError(Exception):
    """Raised for an invalid tier/cycle/cohort lookup or a malformed catalog."""


class Tier(str, Enum):
    MICRO = "micro"
    SMB = "smb"
    # MID_MARKET intentionally absent — paused per DECISIONS.md item 4/14, do not add.


class BillingCycle(str, Enum):
    MONTHLY = "monthly"
    ANNUAL = "annual"


class LaunchCohort(str, Enum):
    LAUNCH = "launch"       # grandfathered early customers (D02)
    STANDARD = "standard"   # post-launch-pricing customers


# Locked launch prices, CLAUDE.md pricing table (2026-09-22) / SPEC-08 Section 7.
# Annual = 10x monthly, per CLAUDE.md ("annual = 10x monthly per CLAUDE.md pricing table").
LAUNCH_MONTHLY_CENTS: dict[Tier, int] = {
    Tier.MICRO: 14_900,
    Tier.SMB: 24_900,
}


def _annual_cents(monthly_cents: int) -> int:
    return monthly_cents * 10


@dataclass(frozen=True)
class PriceVersion:
    """One versioned Stripe Price, mirroring `app.subscriptions.stripe_price_id`
    (`platform/CONTRACT.md`). `stripe_product_id`/`stripe_price_id` are placeholders
    until a real Stripe account exists."""
    version: int
    tier: Tier
    billing_cycle: BillingCycle
    launch_cohort: LaunchCohort
    unit_amount_cents: int
    stripe_product_id: str
    stripe_price_id: str
    active: bool                # currently offered to new signups in this cohort?
    effective_from: date
    effective_until: date | None = None  # None = still in effect


def _placeholder_price_id(tier: Tier, cycle: BillingCycle, cohort: LaunchCohort, version: int) -> str:
    # Obvious placeholder, never a real Stripe object ID (Stripe's real IDs are
    # opaque random suffixes, e.g. "price_1Nabc..."; this is deliberately readable
    # and prefixed "ph" so it can never be mistaken for one).
    return f"price_ph_{tier.value}_{cycle.value}_{cohort.value}_v{version}"


def _placeholder_product_id(tier: Tier) -> str:
    return f"prod_ph_{tier.value}"


LAUNCH_DATE = date(2026, 9, 22)  # Fornax rebrand / build date; adjust once real go-live is set

# --- v1 catalog: the only version that exists today. Every row is launch_cohort="launch" —
# there is no "standard" pricing yet because prices have not risen yet (D02 still open,
# see TYLER_QUEUE.md for the target date/numbers). When Tyler rules the increase, add v2
# "standard" rows here rather than editing v1 in place. ---
PRICE_CATALOG: list[PriceVersion] = []
for _tier, _monthly in LAUNCH_MONTHLY_CENTS.items():
    for _cycle, _amount in (
        (BillingCycle.MONTHLY, _monthly),
        (BillingCycle.ANNUAL, _annual_cents(_monthly)),
    ):
        PRICE_CATALOG.append(
            PriceVersion(
                version=1,
                tier=_tier,
                billing_cycle=_cycle,
                launch_cohort=LaunchCohort.LAUNCH,
                unit_amount_cents=_amount,
                stripe_product_id=_placeholder_product_id(_tier),
                stripe_price_id=_placeholder_price_id(_tier, _cycle, LaunchCohort.LAUNCH, 1),
                active=True,
                effective_from=LAUNCH_DATE,
            )
        )
del _tier, _monthly, _cycle, _amount


def active_prices() -> list[PriceVersion]:
    """All prices currently offered to new signups (one per tier x cycle x cohort)."""
    return [p for p in PRICE_CATALOG if p.active]


def price_for_cohort(tier: Tier, billing_cycle: BillingCycle, launch_cohort: LaunchCohort) -> PriceVersion:
    """The price a given customer resolves to. A `launch` cohort customer keeps resolving
    to their cohort's price even after a newer `standard` version goes active elsewhere —
    that is the grandfathering guarantee (D02)."""
    candidates = [
        p for p in PRICE_CATALOG
        if p.tier == tier and p.billing_cycle == billing_cycle and p.launch_cohort == launch_cohort
    ]
    if not candidates:
        raise PriceCatalogError(f"no price for tier={tier.value} cycle={billing_cycle.value} cohort={launch_cohort.value}")
    # Prefer the active one; if none active (shouldn't happen for an existing cohort with
    # any history), fall back to the highest version as the best-known current price.
    active = [p for p in candidates if p.active]
    return max(active or candidates, key=lambda p: p.version)


def add_price_increase(
    tier: Tier,
    billing_cycle: BillingCycle,
    new_monthly_or_annual_cents: int,
    effective_from: date,
) -> PriceVersion:
    """Raise a **standard**-cohort price: deactivates the current standard version (if any)
    for this tier/cycle and appends a new one. Never touches `launch` rows — grandfathered
    customers are untouched by design. Returns the new `PriceVersion`."""
    current_standard = [
        p for p in PRICE_CATALOG
        if p.tier == tier and p.billing_cycle == billing_cycle and p.launch_cohort == LaunchCohort.STANDARD and p.active
    ]
    next_version = 1 + max(
        (p.version for p in PRICE_CATALOG if p.tier == tier and p.billing_cycle == billing_cycle),
        default=0,
    )
    for i, p in enumerate(PRICE_CATALOG):
        if p in current_standard:
            PRICE_CATALOG[i] = PriceVersion(**{**p.__dict__, "active": False, "effective_until": effective_from})
    new_price = PriceVersion(
        version=next_version,
        tier=tier,
        billing_cycle=billing_cycle,
        launch_cohort=LaunchCohort.STANDARD,
        unit_amount_cents=new_monthly_or_annual_cents,
        stripe_product_id=_placeholder_product_id(tier),
        stripe_price_id=_placeholder_price_id(tier, billing_cycle, LaunchCohort.STANDARD, next_version),
        active=True,
        effective_from=effective_from,
    )
    PRICE_CATALOG.append(new_price)
    return new_price
