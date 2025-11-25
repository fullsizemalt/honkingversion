import sys
from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine

# Ensure repository root is on sys.path
REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

# Import app components
import api.database as database  # noqa: E402
import api.models as models  # noqa: E402
from api.database import get_session  # noqa: E402

# Align top-level module names used in routes
sys.modules["database"] = database
sys.modules["models"] = models

from api.routes import settings as settings_router  # noqa: E402


@pytest.fixture(name="engine")
def engine_fixture(tmp_path):
    temp_db_path = tmp_path / "test.db"
    db_url = f"sqlite:///{temp_db_path}"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
    database.engine = engine  # point shared module to test engine
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(name="session")
def session_fixture(engine):
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(engine):
    app = FastAPI()

    def override_get_session():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = override_get_session
    app.include_router(settings_router.router)

    with TestClient(app) as client:
        yield client
