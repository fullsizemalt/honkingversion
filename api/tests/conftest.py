import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from pathlib import Path
import sys

# Ensure repository root is on sys.path
# This ensures that 'api' can be imported as a top-level package
REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

@pytest.fixture(name="engine")
def engine_fixture(tmp_path):
    # Import database and models here to ensure fresh state for each engine fixture
    import api.database as database
    import api.models as models # This import registers models with SQLModel.metadata

    temp_db_path = tmp_path / "test.db"
    db_url = f"sqlite:///{temp_db_path}"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
    
    # Point the application's database engine to the test engine
    database.engine = engine
    
    # Create tables
    SQLModel.metadata.create_all(engine)
    yield engine
    # Drop tables after tests are done
    SQLModel.metadata.drop_all(engine)
    # Clear metadata to prevent redefinition errors in subsequent test runs
    SQLModel.metadata.clear()

@pytest.fixture(name="session")
def session_fixture(engine):
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session: Session, engine):
    # Import app and routes here to ensure fresh state for each client fixture
    from api.main import app
    from api.routes import settings as settings_router
    from api.database import get_session

    def override_get_session():
        with Session(engine) as session_override:
            yield session_override

    app.dependency_overrides[get_session] = override_get_session
    app.include_router(settings_router.router)

    with TestClient(app) as client:
        yield client
    
    # Clear overrides after the test
    app.dependency_overrides.clear()