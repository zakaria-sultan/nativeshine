#!/usr/bin/env bash
# One-shot local setup after you create a Supabase project.
# Usage:
#   export SUPABASE_URL=https://xxxx.supabase.co
#   export SUPABASE_ANON_KEY=eyJ...
#   export SUPABASE_SERVICE_ROLE_KEY=eyJ...
#   export SEED_SUPER_EMAIL=you@example.com
#   export SEED_SUPER_PASSWORD='strong-password'
#   export SEED_ADMIN_EMAIL=client@example.com
#   export SEED_ADMIN_PASSWORD='strong-password'
#   ./scripts/setup-with-env.sh

set -euo pipefail
cd "$(dirname "$0")/.."

missing=0
for v in SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY SEED_SUPER_EMAIL SEED_SUPER_PASSWORD SEED_ADMIN_EMAIL SEED_ADMIN_PASSWORD; do
  if [[ -z "${!v:-}" ]]; then
    echo "Missing: $v"
    missing=1
  fi
done
if [[ "$missing" -eq 1 ]]; then
  echo "Fill the variables above, then re-run."
  exit 1
fi

cat > .env <<EOF
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
EOF

echo "Wrote .env (VITE_* only — service role is NOT stored in .env)"

echo ""
echo "=== IMPORTANT: run the SQL migration in Supabase SQL Editor first ==="
echo "File: supabase/migrations/20260321120000_initial.sql"
echo "Then deploy the edge function:"
echo "  npx supabase login"
echo "  npx supabase link --project-ref YOUR_REF"
echo "  npx supabase functions deploy admin-users"
echo ""

read -r -p "Have you already run the SQL migration in Supabase? [y/N] " ok
if [[ ! "$ok" =~ ^[Yy]$ ]]; then
  echo "Open Supabase → SQL Editor → paste migration → Run, then re-run this script."
  exit 1
fi

export SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY
export SEED_SUPER_EMAIL SEED_SUPER_PASSWORD SEED_ADMIN_EMAIL SEED_ADMIN_PASSWORD
export SEED_SUPER_NAME="${SEED_SUPER_NAME:-Super Admin}"
export SEED_ADMIN_NAME="${SEED_ADMIN_NAME:-Client Admin}"

npm run seed
echo ""
echo "Seed done. Start locally with: npm run dev"
echo "Admin login: ${SEED_SUPER_EMAIL} / (your SEED_SUPER_PASSWORD)"
echo "Client admin: ${SEED_ADMIN_EMAIL} / (your SEED_ADMIN_PASSWORD)"
