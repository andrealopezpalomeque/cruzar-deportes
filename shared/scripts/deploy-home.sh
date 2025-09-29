#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"
HOME_DIR="$ROOT_DIR/home"

if [[ ! -d "$HOME_DIR" ]]; then
  echo "Unable to locate home directory at $HOME_DIR"
  exit 1
fi

cd "$HOME_DIR"

echo "Installing dependencies (npm ci)..."
npm ci

echo "Building storefront (npm run firebase:build)..."
npm run firebase:build

echo "Deploying storefront (npm run firebase:deploy)..."
npm run firebase:deploy

echo "✅ Storefront deployed successfully."
