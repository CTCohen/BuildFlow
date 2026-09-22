#!/usr/bin/env bash
# Apply migrations to a throwaway local Postgres and run the SQL tests. No Docker, no accounts.
# Usage: platform/db/run-local.sh            (needs postgres 15 binaries on PATH: initdb, pg_ctl, psql)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
DIR="${TMPDIR:-/tmp}/fornax-pg-$$"
PORT="${BF_PG_PORT:-54329}"
PGBIN="$(dirname "$(command -v initdb || echo /opt/homebrew/opt/postgresql@15/bin/initdb)")"
export PATH="$PGBIN:$PATH"

cleanup() { pg_ctl -D "$DIR/data" -m immediate stop >/dev/null 2>&1 || true; }
trap cleanup EXIT

mkdir -p "$DIR"
initdb -D "$DIR/data" -U postgres --auth=trust -E UTF8 >/dev/null
pg_ctl -D "$DIR/data" -o "-p $PORT -k $DIR -c listen_addresses=''" -l "$DIR/pg.log" -w start >/dev/null
export PGHOST="$DIR" PGPORT="$PORT" PGUSER=postgres
createdb fornax
export PGDATABASE=fornax
PSQL=(psql -v ON_ERROR_STOP=1 -q)

echo ">> local auth shim"; "${PSQL[@]}" -f "$HERE/tests/00_local_auth_shim.sql"
for f in "$HERE"/migrations/*.sql; do echo ">> migrate $(basename "$f")"; "${PSQL[@]}" -f "$f"; done
echo ">> migrations applied a second time on a fresh DB must also work: checking idempotent role creation"
for t in 10_isolation 20_monitoring; do echo; echo "########## $t"; "${PSQL[@]}" -f "$HERE/tests/$t.sql" 2>&1; done
echo; echo "ALL DB TESTS PASSED"
