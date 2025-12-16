#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../../.." && pwd)"
BACKOFFICE_DIR="$ROOT_DIR/apps/back-office"
HOME_DIR="$ROOT_DIR/apps/home"

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

SHARED_TARGET="$ROOT_DIR/packages/shared"
SHARED_LINK="$HOME_DIR/shared"

if [[ -L "$SHARED_LINK" ]]; then
  echo "Home storefront shared directory already symlinked; skipping."
elif [[ -e "$SHARED_LINK" ]]; then
  echo "Home storefront shared directory exists but is not a symlink; replacing with symlink to $SHARED_TARGET."
  rm -rf "$SHARED_LINK"
  ln -s "$SHARED_TARGET" "$SHARED_LINK"
else
  echo "Creating symlink for shared catalog into home storefront..."
  ln -s "$SHARED_TARGET" "$SHARED_LINK"
fi

cd "$ROOT_DIR"

echo "Installing dependencies (npm ci)..."
npm ci --workspace apps/home --include-workspace-root false

echo "Building storefront (npm run firebase:build)..."
npm run --workspace apps/home firebase:build

echo "Deploying storefront (npm run firebase:deploy)..."
npm run --workspace apps/home firebase:deploy

echo "✅ Storefront deployed successfully."
