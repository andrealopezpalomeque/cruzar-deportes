#!/bin/bash

# Script to check for TypeScript usage in pages, components, and layouts
# Exit with error if TypeScript is found

echo "Checking for TypeScript in pages, components, and layouts..."

# Check for lang="ts" in Vue files
TS_IN_VUE=$(grep -r 'lang="ts"' pages/ components/ layouts/ 2>/dev/null || true)

if [ -n "$TS_IN_VUE" ]; then
  echo "❌ ERROR: TypeScript found in Vue files!"
  echo "$TS_IN_VUE"
  exit 1
fi

# Check for type annotations in script blocks
TYPE_ANNOTATIONS=$(grep -r -E ':\s*(string|number|boolean|any|void|unknown|Array<|Record<)' pages/ components/ layouts/ | grep -v '//' || true)

if [ -n "$TYPE_ANNOTATIONS" ]; then
  echo "⚠️  WARNING: Possible TypeScript syntax found:"
  echo "$TYPE_ANNOTATIONS"
fi

# Check for interface/type declarations
INTERFACES=$(grep -r -E '(interface|type)\s+\w+' pages/ components/ layouts/ | grep -v '//' || true)

if [ -n "$INTERFACES" ]; then
  echo "⚠️  WARNING: TypeScript interfaces/types found:"
  echo "$INTERFACES"
fi

echo "✅ No TypeScript detected in pages, components, and layouts"
exit 0
