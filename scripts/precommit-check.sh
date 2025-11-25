#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Running precommit checks..."

# Fail if cache/db files are staged
BAD_FILES=$(git diff --cached --name-only | grep -E "^(api/data/cache/|database\.db)" || true)
if [[ -n "$BAD_FILES" ]]; then
  echo "Refusing to commit cached data or database file:" >&2
  echo "$BAD_FILES" >&2
  exit 1
fi

# Optional lint/test checks (set SKIP_LINT=1 or SKIP_TESTS=1 to bypass)
if [[ "${SKIP_LINT:-0}" != "1" ]]; then
  if [[ -f package.json ]]; then
    echo "Running lint..."
    npm run lint --if-present || {
      echo "Lint failed. Set SKIP_LINT=1 to bypass." >&2
      exit 1
    }
  fi
fi

if [[ "${SKIP_TESTS:-0}" != "1" ]]; then
  if command -v pytest >/dev/null 2>&1; then
    echo "Running targeted tests..."
    pytest api/tests/test_settings.py -q || {
      echo "Tests failed. Set SKIP_TESTS=1 to bypass." >&2
      exit 1
    }
  fi
fi

echo "Precommit checks passed"
