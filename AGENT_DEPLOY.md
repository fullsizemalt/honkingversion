# Deploy Instructions for Claude Agent on nexus-vector

## Prerequisites
- SSH access to nexus-vector with root or sudo privileges
- Docker and Docker Compose installed
- Git installed

## Step-by-Step Deployment

### Step 1: SSH into nexus-vector and Navigate to Project
```bash
ssh root@nexus-vector
cd ~/ANTIGRAVITY/honkingversion
```

### Step 2: Pull Latest Code from Forgejo
```bash
git pull origin master
```

Verify you see the latest commits:
```bash
git log --oneline -5
```

Should show commits about "3-column dashboard", "CI/CD pipeline", "seeding", and "error handling".

### Step 3: Stop Old Containers and Start Fresh
```bash
docker compose down
docker compose pull
docker compose up -d --build
```

Wait 30 seconds for services to start:
```bash
sleep 30
```

### Step 4: Verify Services Are Running
```bash
docker compose ps
```

You should see:
- `honkingversion-api-1` running on port 8000
- `honkingversion-web-1` running on port 3000

### Step 5: Seed Database - Part 1: Shows and Performances
Run this to import from El Goose API:
```bash
docker compose exec api python seed_from_elgoose.py
```

**Expected output**: Should download and create hundreds of shows and performances. This may take 2-5 minutes.

### Step 6: Seed Database - Part 2: User Personas and History
Run this to create 69 diverse users with 3 months of voting history:
```bash
docker compose exec api python seed_comprehensive.py
```

**Expected output**: Should create 69 users across 8 personas with thousands of votes and reviews.

### Step 7: Verify Database Population
```bash
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

print("\n" + "="*50)
print("✅ DATABASE SEEDING COMPLETE!")
print("="*50)
print(f"Users:       {users}")
print(f"Votes:       {votes}")
print(f"Shows:       {shows}")
print(f"Performances: {perfs}")
print(f"Follows:     {follows}")
print("="*50 + "\n")

# Verify some data
if users >= 60:
    print("✅ User seeding successful (60+ users)")
if votes >= 1000:
    print("✅ Vote seeding successful (1000+ votes)")
if shows >= 100:
    print("✅ Show seeding successful (100+ shows)")
EOF
```

### Step 8: Verify Web and API Are Accessible

**Test API**:
```bash
curl -s https://api.honkingversion.runfoo.run/ | head -20
```

Should return JSON with "Welcome to Honkingversion.net API" or similar.

**Test Web**:
```bash
curl -s https://honkingversion.runfoo.run/ | grep -o "HONKINGVERSION" | head -1
```

Should return "HONKINGVERSION".

### Step 9: Check Service Logs for Any Errors
```bash
docker compose logs api | tail -20
docker compose logs web | tail -20
```

Look for any ERROR messages. If all is well, you should see startup messages without errors.

## Success Criteria

✅ All services running (`docker compose ps`)
✅ 60+ users created
✅ 1000+ votes/reviews
✅ 100+ shows with performances
✅ Web accessible at https://honkingversion.runfoo.run
✅ API accessible at https://api.honkingversion.runfoo.run
✅ Homepage shows 3-column dashboard:
   - Left: Trending Performances with 🔥 heat indicators
   - Middle: Highest Rated Performances
   - Right: Top 10 Community Voters

## If Something Goes Wrong

### Services won't start
```bash
docker compose logs api
docker compose logs web
```

Check the error messages.

### Database is corrupted
```bash
docker compose down -v
docker compose up -d --build
```

This removes all volumes and starts fresh. Then re-run Steps 5-6.

### API can't connect to database
Ensure the database file is writable:
```bash
ls -la ~/ANTIGRAVITY/honkingversion/database.db
```

### Port conflicts
Check what's using ports 8000 and 3000:
```bash
lsof -i :8000
lsof -i :3000
```

## After Deployment

From this point forward, the CI/CD pipeline is active. Just push changes to Forgejo:
```bash
git push origin master
```

And GitHub Actions will automatically:
1. Build Docker images
2. Push to registry
3. Deploy to production

No more manual deployments needed!

## Quick Command Reference

```bash
# View logs
docker compose logs -f api
docker compose logs -f web

# Restart a service
docker compose restart api
docker compose restart web

# Check status
docker compose ps

# Stop all services
docker compose down

# Remove all volumes and reset database
docker compose down -v
docker compose up -d --build
```
