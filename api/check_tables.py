import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "database.db")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall()]

print("Tables found:", tables)

required = ['feedback', 'changelogentry']
missing = [t for t in required if t not in tables]

if missing:
    print(f"Missing tables: {missing}")
    exit(1)
else:
    print("All required tables found.")
    exit(0)
