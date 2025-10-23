#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BACKOFFICE_DIR="$ROOT_DIR/back-office"
HOME_DIR="$ROOT_DIR/home"

# Load shared environment configuration if present
for env_file in "$ROOT_DIR/.env" "$ROOT_DIR/.env.local"; do
  if [[ -f "$env_file" ]]; then
    echo "Loading environment from $env_file"
    set -a
    source "$env_file"
    set +a
  fi
done

if [[ ! -d "$HOME_DIR" ]]; then
  echo "Unable to locate home directory at $HOME_DIR"
  exit 1
fi

if [[ ! -d "$BACKOFFICE_DIR" ]]; then
  echo "Unable to locate back-office directory at $BACKOFFICE_DIR"
  exit 1
fi

echo "Syncing shared catalog from Firebase Storage..."
cd "$BACKOFFICE_DIR"
node scripts/bootstrap-storage.ts

echo "Ensuring catalog contains all team products..."
node scripts/rebuild-catalog.ts

if [[ ! -L "$HOME_DIR/shared" ]]; then
  echo "Copying updated catalog into home storefront..."
  cp -f "$ROOT_DIR/shared/products.json" "$HOME_DIR/shared/products.json"
else
  echo "Home storefront uses shared/ symlink; skipping copy step."
fi

cd "$HOME_DIR"

echo "Installing dependencies (npm ci)..."
npm ci

echo "Building storefront (npm run firebase:build)..."
npm run firebase:build

echo "Deploying storefront (npm run firebase:deploy)..."
npm run firebase:deploy

echo "✅ Storefront deployed successfully."
