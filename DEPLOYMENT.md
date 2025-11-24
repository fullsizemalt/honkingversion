# Honkingversion Deployment Guide

## CI/CD Pipeline: Forgejo Actions

The project now uses **Forgejo Actions** for automatic deployment on every push to `master`.

### How It Works

1. You push code to `master` on git.runfoo.run
2. Forgejo Actions automatically triggers the workflow (`.gitea/workflows/deploy.yml`)
3. Runner pulls latest code
4. Docker services rebuild and restart
5. Health checks verify deployment
6. Results visible at https://git.runfoo.run/runfoo/honkingversion/actions

### Setup Required (One-time)

Follow the complete setup guide in [FORGEJO_ACTIONS_SETUP.md](./FORGEJO_ACTIONS_SETUP.md):

1. **Set up Forgejo Runner** on nexus-vector
2. **Configure secrets** in Forgejo repository:
   - `DEPLOY_KEY`: SSH private key
   - `DEPLOY_HOST`: nexus-vector
   - `DEPLOY_USER`: root
3. **Test** by pushing a change to master

### Quick Setup

If you already have SSH access to nexus-vector:

```bash
# SSH into the deployment server
ssh root@nexus-vector

# Download and run the setup script
cd /root/ANTIGRAVITY/honkingversion
bash scripts/setup-forgejo-runner.sh

# Follow the prompts - you'll need:
# - Forgejo instance URL (https://git.runfoo.run)
# - Registration token from https://git.runfoo.run/admin/runners
```

### After Setup

Just push your changes:
```bash
git push origin master
```

Deployment happens automatically! View progress at:
https://git.runfoo.run/runfoo/honkingversion/actions

### Troubleshooting

See [FORGEJO_ACTIONS_SETUP.md](./FORGEJO_ACTIONS_SETUP.md) for detailed troubleshooting.

### Manual Deployment

To deploy manually to production:

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Navigate to project
cd ~/ANTIGRAVITY/honkingversion

# Pull latest code
git pull origin master

# Restart services
docker compose down
docker compose pull
docker compose up -d

# Check logs
docker compose logs -f api
docker compose logs -f web
```

## Database Seeding

### Initial Data Setup

1. **Seed from El Goose (Shows/Performances)**:
```bash
cd ~/ANTIGRAVITY/honkingversion
python api/seed_from_elgoose.py
```

This imports all Goose shows and performances from the El Goose API.

### Populate with Test Users and Reviews

2. **Seed Users and Reviews** (creates realistic user personas):
```bash
python api/seed_comprehensive.py
```

This creates:
- **Diverse User Personas**:
  - 15 Casuals (~8 votes/month)
  - 12 Hardcore fans (~25 votes/month)
  - 3 God-level fans (~40 votes/month)
  - 8 Rail riders (~35 votes/month)
  - 10 Run club members (~20 votes/month)
  - 7 Experts (~30 votes/month)
  - 9 Jam aficionados (~28 votes/month)
  - 5 Haters (~15 votes/month)

- **Historical Data**: 3 months of reviews and votes
- **Follow Relationships**: Users follow each other based on persona type
- **Realistic Engagement**: Rating distributions match user type

### Complete Setup Sequence

```bash
# 1. Start fresh database
docker compose down -v
docker compose up -d

# 2. Wait for API to be ready
sleep 10

# 3. Seed shows/performances from El Goose
docker compose exec api python seed_from_elgoose.py

# 4. Seed user personas and reviews
docker compose exec api python seed_comprehensive.py

# 5. Check stats
docker compose exec api python -c "
from database import get_session
from sqlmodel import select, func
from models import User, Vote

session = next(get_session())
user_count = session.exec(select(func.count(User.id))).one()
vote_count = session.exec(select(func.count(Vote.id))).one()
print(f'Users: {user_count}')
print(f'Votes: {vote_count}')
"
```

## Docker Compose Services

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v

# Restart a service
docker compose restart api
docker compose restart web
```

## Environment Variables

Create `.env` file in project root:

```env
# Database
DATABASE_URL=sqlite:///./database.db

# API
API_HOST=0.0.0.0
API_PORT=8000

# Web
NEXT_PUBLIC_API_URL=https://api.honkingversion.runfoo.run
INTERNAL_API_URL=http://api:8000
NEXTAUTH_SECRET=<generate-random-string>
```

## Monitoring

### Check API Health
```bash
curl https://api.honkingversion.runfoo.run/
```

### Check Web
```bash
curl https://honkingversion.runfoo.run/
```

### View Logs
```bash
# API logs
docker compose logs api

# Web logs
docker compose logs web

# Follow in real-time
docker compose logs -f
```

## Troubleshooting

### API Container Won't Start
```bash
docker compose logs api
```

Check for database migration issues or missing dependencies.

### Web Can't Connect to API
Verify `INTERNAL_API_URL` is correct and API is running:
```bash
docker compose exec web curl http://api:8000/
```

### Database Issues
Reset the database:
```bash
docker compose down -v
docker compose up -d
python api/seed_from_elgoose.py
python api/seed_comprehensive.py
```

## Architecture

```
honkingversion/
├── api/                    # FastAPI backend
│   ├── models.py          # SQLModel definitions
│   ├── database.py        # Database connection
│   ├── main.py            # FastAPI app
│   ├── routes/            # API endpoints
│   └── seed_*.py          # Data seeding scripts
├── web/                    # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages and layouts
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities
│   └── Dockerfile
├── docker-compose.yml     # Docker Compose config
└── .github/workflows/     # GitHub Actions CI/CD
```

## Database Schema

- **User**: Registered users
- **Show**: Concert information
- **Song**: Song metadata
- **SongPerformance**: Specific song at specific show
- **Vote**: User rating/review of performance
- **UserFollow**: User-to-user relationships
- **UserList**: Custom curated lists
- **Tags**: Performance/show tags

## Notes

- All times are stored in UTC
- Passwords are hashed with SHA-256
- Database file is SQLite by default (production should use PostgreSQL)
- API requires authentication for voting and list creation
