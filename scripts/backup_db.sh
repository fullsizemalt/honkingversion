#!/usr/bin/env bash
set -euo pipefail

# Simple DB backup for honkingversion (host-level, not inside container).
# Copies database.db to ~/backups with a timestamped filename.

ROOT_DIR="/home/admin/honkingversion"
DB_FILE="${ROOT_DIR}/database.db"
BACKUP_DIR="/home/admin/backups"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
DEST="${BACKUP_DIR}/honkingversion_db_${TIMESTAMP}.sqlite"

mkdir -p "${BACKUP_DIR}"

if [ ! -f "${DB_FILE}" ]; then
  echo "Database file not found at ${DB_FILE}"
  exit 1
fi

cp "${DB_FILE}" "${DEST}"
echo "Backup written to ${DEST}"
