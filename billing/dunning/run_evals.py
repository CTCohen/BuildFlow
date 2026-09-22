"""Run all dunning evals: `python3 -m billing.dunning.run_evals`. Exit 1 on any failure."""
from __future__ import annotations

import sys
import unittest

from .evals import test_state_machine


def main() -> int:
    res = unittest.TextTestRunner(verbosity=0).run(
        unittest.defaultTestLoader.loadTestsFromModule(test_state_machine)
    )
    passed = res.testsRun - len(res.failures) - len(res.errors)
    print(f"dunning state machine: {passed}/{res.testsRun} passed")
    return 1 if (res.failures or res.errors) else 0


if __name__ == "__main__":
    sys.exit(main())
