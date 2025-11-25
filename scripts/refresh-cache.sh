#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="$ROOT_DIR/.cache/shows"
mkdir -p "$CACHE_DIR"

API_URL=${API_URL:-http://localhost:8000}
DAYS=${DAYS:-0}

if [[ $DAYS -eq 0 ]]; then
  echo "Usage: DAYS=30 API_URL=http://localhost:8000 scripts/refresh-cache.sh"
  echo "Caches show date responses into $CACHE_DIR (ignored by git)."
  exit 0
fi

start_date=$(date -v-${DAYS}d +%Y-%m-%d)
end_date=$(date +%Y-%m-%d)

current_date="$start_date"
while [[ "$current_date" < "$end_date" || "$current_date" == "$end_date" ]]; do
  outfile="$CACHE_DIR/show_date_${current_date}.json"
  echo "Fetching $current_date -> $outfile"
  curl -s "${API_URL}/shows/date/${current_date}" -o "$outfile" || true
  current_date=$(date -j -v+1d -f "%Y-%m-%d" "$current_date" +%Y-%m-%d)
done

echo "Cache refreshed under $CACHE_DIR"
