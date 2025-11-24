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

from routes import (
    auth,
    songs,
    shows,
    lists,
    venues,
    stats,
    search,
    tours,
    years,
    performance_comparisons,
    profile,
    notifications,
    u,
    export,
    feedback,
    changelog,
    home
)
from database import create_db_and_tables

# ... (previous code)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(auth.router)
app.include_router(songs.router)
app.include_router(shows.router)
app.include_router(lists.router)
app.include_router(venues.router)
app.include_router(stats.router)
app.include_router(search.router)
app.include_router(tours.router)
app.include_router(years.router)
app.include_router(performance_comparisons.router)
app.include_router(profile.router)
app.include_router(notifications.router)
app.include_router(u.router)
app.include_router(export.router)
app.include_router(feedback.router)
app.include_router(changelog.router)
app.include_router(home.router)

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

