#!/bin/bash
# Script to remove all rounded corner classes from TSX files

cd "$(dirname "$0")/.."

# Find all TSX files and remove rounded classes
find web/src -name "*.tsx" -type f -exec sed -i '' \
  -e 's/ rounded-full//g' \
  -e 's/ rounded-3xl//g' \
  -e 's/ rounded-2xl//g' \
  -e 's/ rounded-xl//g' \
  -e 's/ rounded-lg//g' \
  -e 's/ rounded-md//g' \
  -e 's/ rounded-sm//g' \
  -e 's/ rounded//g' \
  {} +

echo "✓ Removed all rounded corner classes from TSX files"
