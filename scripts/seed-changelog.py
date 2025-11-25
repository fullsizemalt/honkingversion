#!/usr/bin/env python3
"""
Seed the changelog with a few recent updates for local/dev databases.
Skips seeding if rows already exist.
"""
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "database.db"

ENTRIES = [
    {
        "title": "Settings Phase 3 shipped",
        "description": "Added security, OAuth connections, and data export/delete flows to settings.",
        "type": "feature",
        "date": "2025-01-10T12:00:00Z",
    },
    {
        "title": "2FA input fixes",
        "description": "Relaxed type validation on two-factor code entry to prevent blocked sign-ins.",
        "type": "fix",
        "date": "2025-01-08T18:00:00Z",
    },
    {
        "title": "Settings utilities refactor",
        "description": "Extracted shared settings helpers to reduce duplication across panels.",
        "type": "improvement",
        "date": "2025-01-05T15:30:00Z",
    },
]


def main() -> None:
    if not DB_PATH.exists():
        raise SystemExit(f"database not found at {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    with conn:
        count = conn.execute("SELECT COUNT(*) FROM changelogentry").fetchone()[0]
        if count:
            print(f"changelogentry already has {count} row(s); skipping seed.")
            return

        rows = [
            (
                entry["title"],
                entry["description"],
                entry["date"],
                entry["type"],
                None,  # credited_user_id
            )
            for entry in ENTRIES
        ]

        conn.executemany(
            """
            INSERT INTO changelogentry (title, description, date, type, credited_user_id)
            VALUES (?, ?, ?, ?, ?)
            """,
            rows,
        )
        print(f"Seeded {len(rows)} changelog entries into {DB_PATH}")


if __name__ == "__main__":
    main()
