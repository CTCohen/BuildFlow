"""Lightweight gitignored-env config loader (no third-party deps).

Some config (the CAN-SPAM mailing address, future real API keys) must never
land in a git-tracked file. The pattern already used elsewhere in the repo
for this is a gitignored `.local/<name>.env` file (see `.local/supabase.env`,
`.local/cloudflare.env`, `.local/business-contact.env`) read at runtime.
This module is that same pattern, generalized for Python callers in this lane.

Real process environment always wins (so ops/CI can inject real values
without touching the filesystem); the `.local/*.env` file is the local-dev
fallback.
"""
from __future__ import annotations

import os
from pathlib import Path

_REPO_ROOT = Path(__file__).resolve().parents[2]
_LOCAL_ENV_DIR = _REPO_ROOT / ".local"


def _parse_env_file(path: Path) -> dict:
    values: dict[str, str] = {}
    if not path.is_file():
        return values
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        val = val.strip().strip('"').strip("'")
        if key:
            values[key] = val
    return values


def get_env(key: str, *, local_file: str | None = None) -> str | None:
    """Read `key` from the real process environment first, then (if
    `local_file` is given) from the gitignored `.local/<local_file>`.
    Returns None, never raises, if the key is nowhere to be found — callers
    decide whether that's an error.
    """
    val = os.environ.get(key)
    if val:
        return val
    if local_file:
        return _parse_env_file(_LOCAL_ENV_DIR / local_file).get(key) or None
    return None
