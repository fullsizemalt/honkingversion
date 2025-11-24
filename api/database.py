from sqlmodel import SQLModel, create_engine, Session

def ensure_vote_is_featured_column(connection):
    result = connection.exec_driver_sql("PRAGMA table_info('vote')")
    columns = {row[1] for row in result}
    if "is_featured" not in columns:
        connection.exec_driver_sql(
            "ALTER TABLE vote ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT 0"
        )

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    with engine.begin() as connection:
        ensure_vote_is_featured_column(connection)

def get_session():
    with Session(engine) as session:
        yield session
