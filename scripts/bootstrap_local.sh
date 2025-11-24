#!/usr/bin/env bash
set -euo pipefail

# Bootstrap local API (8000) and Web (3000) using docker-compose + local overrides.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

COMPOSE_ARGS=(-f docker-compose.yml -f docker-compose.local.yml)

echo "Starting Honkingversion stack locally (api:8000, web:3000)..."
docker compose "${COMPOSE_ARGS[@]}" up -d --build

echo "Current service status:"
docker compose "${COMPOSE_ARGS[@]}" ps

if command -v curl >/dev/null 2>&1; then
  echo "API health check:"
  if curl -fsS http://localhost:8000/healthz >/dev/null; then
    echo "  API healthy on http://localhost:8000/healthz"
  else
    echo "  API health check failed (http://localhost:8000/healthz)" >&2
  fi
fi

echo "Next.js should be reachable at http://localhost:3000 once build completes."
