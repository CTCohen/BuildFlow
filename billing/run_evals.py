"""Run all billing evals — prices, webhooks, and dunning: `python3 -m billing.run_evals`.
Exit 1 on any failure. `billing/dunning/run_evals.py` still runs the dunning suite alone."""
from __future__ import annotations

import sys
import unittest

from .dunning.evals import test_state_machine
from .evals import test_fulfillment, test_prices, test_webhooks


def main() -> int:
    suite = unittest.TestSuite()
    loader = unittest.defaultTestLoader
    modules = [test_prices, test_webhooks, test_state_machine, test_fulfillment]
    for m in modules:
        suite.addTests(loader.loadTestsFromModule(m))
    res = unittest.TextTestRunner(verbosity=0).run(suite)
    passed = res.testsRun - len(res.failures) - len(res.errors)
    print(f"billing (prices + webhooks + dunning): {passed}/{res.testsRun} passed")
    return 1 if (res.failures or res.errors) else 0


if __name__ == "__main__":
    sys.exit(main())
