import sqlite3

def fix_schema():
    import os
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(BASE_DIR, "database.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE vote ADD COLUMN blurb TEXT")
        print("Added blurb column.")
    except Exception as e:
        print(f"Error adding blurb: {e}")

    try:
        cursor.execute("ALTER TABLE vote ADD COLUMN full_review TEXT")
        print("Added full_review column.")
    except Exception as e:
        print(f"Error adding full_review: {e}")

    try:
        cursor.execute("ALTER TABLE show ADD COLUMN tour TEXT")
        print("Added tour column.")
    except Exception as e:
        print(f"Error adding tour: {e}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    fix_schema()
