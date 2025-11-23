import sqlite3

def fix_schema():
    conn = sqlite3.connect('database.db')
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

    conn.commit()
    conn.close()

if __name__ == "__main__":
    fix_schema()
