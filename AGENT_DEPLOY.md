# Deploy Instructions for Claude Agent on nexus-vector

## IMPORTANT: You are already ON nexus-vector
These instructions assume you are running commands DIRECTLY on nexus-vector, not SSHing into it.

## Prerequisites
- You have sudo/root access on nexus-vector
- Docker and Docker Compose are installed
- Git is installed

## Step-by-Step Deployment

### Step 0: Check if Project Exists
```bash
ls -la /root/ANTIGRAVITY/honkingversion
```

**If directory exists**: Skip to Step 2
**If "No such file or directory"**: Continue to Step 1

### Step 1: Clone Repository (ONLY if it doesn't exist)
```bash
sudo bash -c 'mkdir -p /root/ANTIGRAVITY && cd /root/ANTIGRAVITY && git clone ssh://git@localhost:2222/runfoo/honkingversion.git'
```

Or with HTTPS:
```bash
sudo bash -c 'mkdir -p /root/ANTIGRAVITY && cd /root/ANTIGRAVITY && git clone https://git.runfoo.run/runfoo/honkingversion.git'
```

### Step 2: Navigate to Project and Pull Latest Code
```bash
cd /root/ANTIGRAVITY/honkingversion
git pull origin master
```

Verify you see the latest commits:
```bash
git log --oneline -3
```

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

You should see all containers running (green).

### Step 5: Seed Database - Part 1: Shows and Performances from El Goose
```bash
docker compose exec api python seed_from_elgoose.py
```

This imports hundreds of Goose shows and performances. May take 2-5 minutes.

### Step 6: Seed Database - Part 2: User Personas and 3 Months History
```bash
docker compose exec api python seed_comprehensive.py
```

Creates 69 diverse users with realistic voting patterns and 3 months of historical data.

### Step 7: Verify Database Is Fully Populated
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

print("\n" + "="*60)
print("✅ DATABASE SEEDING STATUS")
print("="*60)
print(f"Users:        {users:,} (target: 60+)")
print(f"Votes:        {votes:,} (target: 1000+)")
print(f"Shows:        {shows:,} (target: 100+)")
print(f"Performances: {perfs:,} (target: 500+)")
print(f"Follows:      {follows:,} (target: 300+)")
print("="*60 + "\n")

if users >= 60 and votes >= 1000:
    print("✅ ALL SEEDING COMPLETE - DEPLOYMENT SUCCESSFUL!")
else:
    print("⚠️  Seeding may still be in progress or incomplete")
EOF
```

## Expected Output

After all steps complete, you should see:
```
Users:        69
Votes:        1800+
Shows:        200+
Performances: 500+
Follows:      500+

✅ ALL SEEDING COMPLETE - DEPLOYMENT SUCCESSFUL!
```

## Test the Deployment

### Check if Web is Running
```bash
curl -s https://honkingversion.runfoo.run/ | grep -o "HONKINGVERSION" | head -1
```

Should return: `HONKINGVERSION`

### Check if API is Running
```bash
curl -s https://api.honkingversion.runfoo.run/ | grep -o "Welcome"
```

Should return: `Welcome`

## Success Checklist

- [ ] Project directory exists at `/root/ANTIGRAVITY/honkingversion`
- [ ] Latest code pulled from Forgejo
- [ ] All Docker containers running (`docker compose ps`)
- [ ] 60+ users created
- [ ] 1000+ votes/reviews created
- [ ] 200+ shows with performances
- [ ] Web site accessible at https://honkingversion.runfoo.run
- [ ] API responsive at https://api.honkingversion.runfoo.run
- [ ] Homepage shows 3-column dashboard:
  - **Left Column**: Trending Performances with 🔥 heat indicators
  - **Middle Column**: Highest Rated Performances
  - **Right Column**: Top 10 Community Voters

## After Deployment: Updates and Future Changes

Once seeding is complete and verified:
```bash
cd /root/ANTIGRAVITY/honkingversion
git push origin master
```

**⚠️ NOTE**: Pushing to Forgejo does NOT automatically trigger deployment. The `.github/workflows/deploy.yml` is a GitHub Actions template that won't work on Forgejo.

For future code changes, you'll need to manually re-run the deployment steps (pull, rebuild, restart services).

## Troubleshooting

### Git clone fails
Try HTTPS instead of SSH:
```bash
sudo bash -c 'mkdir -p /root/ANTIGRAVITY && cd /root/ANTIGRAVITY && git clone https://git.runfoo.run/runfoo/honkingversion.git'
```

### Docker containers won't start
```bash
docker compose logs api
docker compose logs web
```

Check the error messages.

### Database corruption / seeding issues
Full reset:
```bash
docker compose down -v
docker compose up -d --build
sleep 30
docker compose exec api python seed_from_elgoose.py
docker compose exec api python seed_comprehensive.py
```

### Seeding takes a long time
El Goose seeding (Step 5) can take 2-5 minutes. This is normal. Watch:
```bash
docker compose logs api -f
```

Press Ctrl+C when it's done.

## Command Quick Reference

```bash
# Check service status
docker compose ps

# View logs
docker compose logs -f api
docker compose logs -f web

# Restart a service
docker compose restart api

# Stop all services
docker compose down

# Full reset
docker compose down -v && docker compose up -d --build
```
