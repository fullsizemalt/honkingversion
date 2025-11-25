#!/usr/bin/env bash
set -euo pipefail

# Run the precommit checks in CI context. Set SKIP_LINT=1 or SKIP_TESTS=1 to bypass.
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

SKIP_LINT=${SKIP_LINT:-0} SKIP_TESTS=${SKIP_TESTS:-0} scripts/precommit-check.sh
