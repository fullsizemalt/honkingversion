from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

from routes import auth, shows, users, votes, lists, songs, performances, search, tags, attended, follows, export, venues, comments, notifications
from database import create_db_and_tables

# ... (previous code)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(auth.router)
app.include_router(shows.router)
app.include_router(songs.router)
app.include_router(performances.router)
app.include_router(search.router)
app.include_router(users.router)
app.include_router(votes.router)
app.include_router(lists.router)
app.include_router(tags.router)
app.include_router(attended.router)
app.include_router(follows.router)
app.include_router(export.router)
app.include_router(venues.router)
app.include_router(comments.router)
app.include_router(notifications.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Honkingversion.net API"}
