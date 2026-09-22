"""Run all CRM evals: `python3 -m crm.run_evals`. Exit 1 on any failure."""
from __future__ import annotations

import sys
import unittest

from .evals import test_mapping, test_sync


def main() -> int:
    suite = unittest.TestSuite()
    loader = unittest.defaultTestLoader
    suite.addTests(loader.loadTestsFromModule(test_mapping))
    suite.addTests(loader.loadTestsFromModule(test_sync))

    res = unittest.TextTestRunner(verbosity=0).run(suite)
    passed = res.testsRun - len(res.failures) - len(res.errors)
    print(f"crm hubspot connector: {passed}/{res.testsRun} passed")
    return 1 if (res.failures or res.errors) else 0


if __name__ == "__main__":
    sys.exit(main())
