from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

app = FastAPI(title="Honkingversion.net API", description="API for Goose Fan Site")

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://honkingversion.runfoo.run",
    "https://api.honkingversion.runfoo.run",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from api.routes import (
    attended,
    auth,
    changelog,
    comments,
    export,
    feedback,
    follows,
    home,
    lists,
    notifications,
    performances,
    search,
    shows,
    songs,
    stats,
    tags,
    tours,
    users,
    venues,
    votes,
)
from api.database import create_db_and_tables

# ... (previous code)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

routers = [
    auth.router,
    songs.router,
    shows.router,
    lists.router,
    venues.router,
    stats.router,
    search.router,
    tours.router,
    notifications.router,
    export.router,
    feedback.router,
    changelog.router,
    home.router,
    attended.router,
    follows.router,
    tags.router,
    users.router,
    votes.router,
    performances.router,
    comments.router,
]

for router in routers:
    app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Honkingversion.net API"}


@app.exception_handler(404)
async def not_found_handler(request: Request, exc: Exception):
    """Handle 404 errors gracefully"""
    return JSONResponse(
        status_code=404,
        content={
            "detail": "Resource not found",
            "path": request.url.path,
            "method": request.method
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors gracefully"""
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": exc.errors()
        }
    )


@app.middleware("http")
async def catch_all_404_middleware(request: Request, call_next):
    """Catch unmatched routes and return 404"""
    response = await call_next(request)
    return response
