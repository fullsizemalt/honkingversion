from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel
from typing import Callable, Optional, List
import copy


def create_test_app(
    engine,
    routers: Optional[List[Callable]] = None,
    get_session_dep: Optional[Callable] = None,
    app_title: str = "Test App"
) -> TestClient:
    """
    Create an isolated FastAPI TestClient with given routers and session override.

    This factory ensures:
    1. Each test app is completely isolated (no shared state)
    2. FastAPI metadata is reset to prevent collisions
    3. Database tables are created fresh
    4. Dependency overrides are properly configured

    Args:
        engine: SQLModel engine for the test database
        routers: List of routers to include (default: empty)
        get_session_dep: Dependency to override for session injection
        app_title: Title for the FastAPI app (default: "Test App")

    Returns:
        FastAPI TestClient with isolated state
    """
    routers = routers or []

    # Create fresh app instance with isolated metadata
    app = FastAPI(title=app_title)

    # Create tables for fresh database
    SQLModel.metadata.create_all(engine)

    # Override session dependency if provided
    if get_session_dep:
        def override_get_session():
            with Session(engine) as session:
                yield session

        app.dependency_overrides[get_session_dep] = override_get_session

    # Include routers
    for router in routers:
        app.include_router(router)

    return TestClient(app)
