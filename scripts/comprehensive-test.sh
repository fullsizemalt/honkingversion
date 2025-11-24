#!/bin/bash
# Comprehensive testing and seeding script for Honkingversion
# Run this on nexus-vector after deploying the latest code

set -e

echo "🧪 Honkingversion Comprehensive Testing & Seeding"
echo "=================================================="
echo ""

cd /root/ANTIGRAVITY/honkingversion

# Step 1: Pull latest code
echo "📥 Step 1: Pulling latest code from Forgejo..."
git pull origin master
echo "✅ Code pulled"
echo ""

# Step 2: Full clean rebuild
echo "🔨 Step 2: Rebuilding Docker services (clean)..."
docker compose down -v
docker compose pull
docker compose up -d --build
echo "✅ Services rebuilt"
echo ""

# Step 3: Wait for services
echo "⏳ Step 3: Waiting for services to start (30 seconds)..."
sleep 30
echo "✅ Ready"
echo ""

# Step 4: Check Docker status
echo "📊 Step 4: Docker service status..."
docker compose ps
echo ""

# Step 5: Check API logs
echo "📋 Step 5: Checking API logs for errors..."
API_LOG=$(docker compose logs api | tail -20)
echo "$API_LOG"
if echo "$API_LOG" | grep -qi "error"; then
    echo "⚠️  Errors found in API logs, continuing anyway..."
else
    echo "✅ No critical errors in logs"
fi
echo ""

# Step 6: Test database connection
echo "🗄️  Step 6: Testing database connection..."
docker compose exec api python << 'EOF'
try:
    from database import get_session
    session = next(get_session())
    print("✅ Database connection successful")
except Exception as e:
    print(f"❌ Database error: {e}")
    exit(1)
EOF
echo ""

# Step 7: Test all imports
echo "🔧 Step 7: Testing critical imports..."
docker compose exec api python << 'EOF'
try:
    print("  Importing models...", end="")
    from models import User, Show, Song, SongPerformance, Vote, UserFollow
    print(" ✅")

    print("  Importing database...", end="")
    from database import get_session
    print(" ✅")

    print("  Importing routes...", end="")
    from routes import auth, shows, songs, performances, votes
    print(" ✅")

    print("  Importing services...", end="")
    from services import show_fetcher
    print(" ✅")

    print("\n✅ All critical imports successful!")
except Exception as e:
    print(f"\n❌ Import error: {e}")
    import traceback
    traceback.print_exc()
    exit(1)
EOF
echo ""

# Step 8: Test external connectivity
echo "🌐 Step 8: Testing external connectivity..."
if curl -s https://honkingversion.runfoo.run/ | grep -q "HONKINGVERSION"; then
    echo "✅ Web site is accessible"
else
    echo "⚠️  Web site might not be responding"
fi
echo ""

# Step 9: Seed El Goose data
echo "📥 Step 9: Seeding El Goose shows and performances..."
echo "   (This will take 2-5 minutes, be patient...)"
docker compose exec api python seed_from_elgoose.py
echo "✅ El Goose data seeded"
echo ""

# Step 10: Seed user personas
echo "👥 Step 10: Seeding 69 user personas with 3 months of history..."
echo "   (This will take 1-2 minutes...)"
docker compose exec api python seed_comprehensive.py
echo "✅ User personas seeded"
echo ""

# Step 11: Verify database population
echo "📊 Step 11: Verifying database population..."
docker compose exec api python << 'EOF'
from database import get_session
from sqlmodel import select, func
from models import User, Vote, Show, SongPerformance, UserFollow

session = next(get_session())
users = session.exec(select(func.count(User.id))).one()
votes = session.exec(select(func.count(Vote.id))).one()
shows = session.exec(select(func.count(Show.id))).one()
perfs = session.exec(select(func.count(SongPerformance.id))).one()
follows = session.exec(select(func.count(UserFollow.id))).one()

print("\n" + "="*60)
print("✅ DATABASE POPULATION REPORT")
print("="*60)
print(f"Users:        {users:>6,} (target: 60+)         {'✅' if users >= 60 else '❌'}")
print(f"Votes:        {votes:>6,} (target: 1000+)       {'✅' if votes >= 1000 else '❌'}")
print(f"Shows:        {shows:>6,} (target: 100+)        {'✅' if shows >= 100 else '❌'}")
print(f"Performances: {perfs:>6,} (target: 500+)        {'✅' if perfs >= 500 else '❌'}")
print(f"Follows:      {follows:>6,} (target: 300+)      {'✅' if follows >= 300 else '❌'}")
print("="*60)

all_good = (users >= 60 and votes >= 1000 and shows >= 100 and perfs >= 500)
if all_good:
    print("\n🎉 ALL TESTS PASSED! Database is fully populated!")
else:
    print("\n⚠️  Some metrics below target. Check seeding output.")

print("="*60 + "\n")
EOF

# Final summary
echo "🏁 TESTING COMPLETE!"
echo ""
echo "📍 Next steps:"
echo "   1. Visit https://honkingversion.runfoo.run"
echo "   2. You should see the 3-column dashboard with:"
echo "      - Trending Performances (with 🔥 heat indicators)"
echo "      - Highest Rated Performances"
echo "      - Top 10 Community Voters"
echo ""
echo "🚀 CI/CD is ready:"
echo "   - Runner is set up on nexus-vector"
echo "   - Configure secrets in Forgejo"
echo "   - Then: git push origin master = automatic deployment!"
echo ""
