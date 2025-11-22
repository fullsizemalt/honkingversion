from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Honkingversion.net API", description="API for Goose Fan Site")

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .routes import auth, shows, users, votes, lists, songs, performances
from .database import create_db_and_tables

# ... (previous code)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(auth.router)
app.include_router(shows.router)
app.include_router(songs.router)
app.include_router(performances.router)
app.include_router(users.router)
app.include_router(votes.router)
app.include_router(lists.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Honkingversion.net API"}

