#!/usr/bin/env bash
# Apply all Prisma migrations to a Turso database (run once after creating the DB).
# Usage: TURSO_DB_NAME=algolytics ./scripts/apply-turso-migrations.sh
set -euo pipefail

DB_NAME="${TURSO_DB_NAME:-algolytics}"

if ! command -v turso >/dev/null 2>&1; then
  echo "Install Turso CLI: https://docs.turso.tech/cli"
  exit 1
fi

for migration in prisma/migrations/*/migration.sql; do
  echo "Applying $(basename "$(dirname "$migration")")..."
  turso db shell "$DB_NAME" < "$migration"
done

echo "Done. Migrations applied to Turso database: $DB_NAME"
