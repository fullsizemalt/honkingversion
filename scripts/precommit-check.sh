#!/usr/bin/env bash
set -euo pipefail

# Fail if cache/db files are staged
BAD_FILES=$(git diff --cached --name-only | grep -E "^(api/data/cache/|database\.db)" || true)
if [[ -n "$BAD_FILES" ]]; then
  echo "Refusing to commit cached data or database file:" >&2
  echo "$BAD_FILES" >&2
  exit 1
fi

echo "Precommit checks passed"
