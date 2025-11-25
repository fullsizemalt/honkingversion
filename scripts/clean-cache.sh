#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

rm -rf "$ROOT_DIR/.cache/shows" "$ROOT_DIR/api/data/cache" || true
mkdir -p "$ROOT_DIR/.cache/shows"
echo "Cache directories cleaned and reset."
