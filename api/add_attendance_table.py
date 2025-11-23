import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db_path = os.path.join(BASE_DIR, "database.db")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create UserShowAttendance table
cursor.execute("""
CREATE TABLE IF NOT EXISTS usershowattendance (
    user_id INTEGER NOT NULL,
    show_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, show_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (show_id) REFERENCES show(id)
)
""")

conn.commit()
conn.close()

print("✅ UserShowAttendance table created successfully!")
