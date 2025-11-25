import os
from sqlmodel import SQLModel, create_engine, Session

def ensure_vote_is_featured_column(connection):
    # This is SQLite specific, skip for Postgres
    if "sqlite" not in str(connection.engine.url):
        return
        
    result = connection.exec_driver_sql("PRAGMA table_info('vote')")
    columns = {row[1] for row in result}
    if "is_featured" not in columns:
        connection.exec_driver_sql(
            "ALTER TABLE vote ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT 0"
        )

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./database.db")

if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    connect_args = {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, pool_pre_ping=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    with engine.begin() as connection:
        ensure_vote_is_featured_column(connection)

def get_session():
    with Session(engine) as session:
        yield session
