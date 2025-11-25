#!/bin/bash
# Quick database seeding script

set -e

echo "🌱 Honkingversion Database Seeding Script"
echo "=========================================="
echo ""

# Check if Docker containers are running
if ! docker compose ps | grep -q "api"; then
    echo "❌ API container is not running!"
    echo "Starting containers..."
    docker compose up -d
    echo "⏳ Waiting for API to be ready..."
    sleep 10
fi

echo "📍 Current directory: $(pwd)"
echo ""

# Seed from El Goose
echo "1️⃣  Seeding shows and performances from El Goose..."
docker compose exec -T api python seed_from_elgoose.py

echo ""
echo "2️⃣  Creating user personas and reviews..."
docker compose exec -T api python seed_comprehensive.py

echo ""
echo "3️⃣  Seeding changelog entries for /updates..."
python scripts/seed-changelog.py || {
    echo "❌ Failed to seed changelog via host python, skipping."
}

echo ""
echo "📊 Database Statistics:"
docker compose exec -T api python << 'EOF'
from database import get_session
from sqlmodel import select, func
from models import User, Vote, Show, SongPerformance

session = next(get_session())
print(f"   Users: {session.exec(select(func.count(User.id))).one()}")
print(f"   Votes: {session.exec(select(func.count(Vote.id))).one()}")
print(f"   Shows: {session.exec(select(func.count(Show.id))).one()}")
print(f"   Performances: {session.exec(select(func.count(SongPerformance.id))).one()}")
EOF

echo ""
echo "✅ Seeding complete!"
echo ""
echo "🚀 Access your site at:"
echo "   Web:  https://honkingversion.runfoo.run"
echo "   API:  https://api.honkingversion.runfoo.run"
echo ""
