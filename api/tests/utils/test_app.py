from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel
from typing import Callable


def create_test_app(engine, routers: list[Callable], get_session_dep) -> TestClient:
    """Create a FastAPI TestClient with given routers and session override."""
    app = FastAPI()

    def override_get_session():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session_dep] = override_get_session

    for router in routers:
        app.include_router(router)

    SQLModel.metadata.create_all(engine)
    return TestClient(app)
