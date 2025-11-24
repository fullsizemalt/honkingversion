"""
Database migration script for profile features
Adds profile fields to User table and creates new tables for UserTitle, UserBadge, and ListFollow
"""

from sqlmodel import Session, text
from database import engine

def run_migration():
    
    with Session(engine) as session:
        print("Starting profile features migration...")
        
        # Add new columns to User table
        print("Adding profile columns to User table...")
        try:
            session.exec(text("ALTER TABLE user ADD COLUMN display_name TEXT"))
            print("  ✓ Added display_name")
        except Exception as e:
            print(f"  ⚠ display_name: {e}")
        
        try:
            session.exec(text("ALTER TABLE user ADD COLUMN bio TEXT"))
            print("  ✓ Added bio")
        except Exception as e:
            print(f"  ⚠ bio: {e}")
        
        try:
            session.exec(text("ALTER TABLE user ADD COLUMN profile_picture_url TEXT"))
            print("  ✓ Added profile_picture_url")
        except Exception as e:
            print(f"  ⚠ profile_picture_url: {e}")
        
        try:
            session.exec(text("ALTER TABLE user ADD COLUMN selected_title_id INTEGER"))
            print("  ✓ Added selected_title_id")
        except Exception as e:
            print(f"  ⚠ selected_title_id: {e}")
        
        try:
            session.exec(text("ALTER TABLE user ADD COLUMN role TEXT DEFAULT 'user'"))
            print("  ✓ Added role")
        except Exception as e:
            print(f"  ⚠ role: {e}")
        
        try:
            session.exec(text("ALTER TABLE user ADD COLUMN social_links TEXT"))
            print("  ✓ Added social_links")
        except Exception as e:
            print(f"  ⚠ social_links: {e}")
        
        # Create UserTitle table
        print("\nCreating UserTitle table...")
        try:
            session.exec(text("""
                CREATE TABLE IF NOT EXISTS usertitle (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    title_name TEXT NOT NULL,
                    title_description TEXT,
                    color TEXT DEFAULT '#ff6b35',
                    icon TEXT,
                    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES user(id)
                )
            """))
            session.exec(text("CREATE INDEX IF NOT EXISTS idx_usertitle_user_id ON usertitle(user_id)"))
            print("  ✓ Created UserTitle table")
        except Exception as e:
            print(f"  ⚠ UserTitle table: {e}")
        
        # Create UserBadge table
        print("\nCreating UserBadge table...")
        try:
            session.exec(text("""
                CREATE TABLE IF NOT EXISTS userbadge (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    badge_name TEXT NOT NULL,
                    badge_description TEXT,
                    badge_icon TEXT NOT NULL,
                    unlock_criteria TEXT,
                    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES user(id)
                )
            """))
            session.exec(text("CREATE INDEX IF NOT EXISTS idx_userbadge_user_id ON userbadge(user_id)"))
            print("  ✓ Created UserBadge table")
        except Exception as e:
            print(f"  ⚠ UserBadge table: {e}")
        
        # Create ListFollow table
        print("\nCreating ListFollow table...")
        try:
            session.exec(text("""
                CREATE TABLE IF NOT EXISTS listfollow (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    list_id INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES user(id),
                    FOREIGN KEY (list_id) REFERENCES userlist(id)
                )
            """))
            session.exec(text("CREATE INDEX IF NOT EXISTS idx_listfollow_user_id ON listfollow(user_id)"))
            session.exec(text("CREATE INDEX IF NOT EXISTS idx_listfollow_list_id ON listfollow(list_id)"))
            print("  ✓ Created ListFollow table")
        except Exception as e:
            print(f"  ⚠ ListFollow table: {e}")
        
        session.commit()
        print("\n✅ Migration completed successfully!")

if __name__ == "__main__":
    run_migration()
