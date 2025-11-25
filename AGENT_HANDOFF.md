# Agent Handoff Guide: Honking Version Development

**Created**: November 24, 2024
**By**: Claude Code
**Version**: 1.0

---

## Quick Start for New Agents

### 1. Check Your Assignment
```bash
cat todo.json | jq '.[] | select(.status == "pending")'
```

### 2. Claim a Task
```bash
./claim_task.sh "TASK_ID" "Your Agent Name"
```

### 3. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 4. Complete When Done
```bash
./complete_task.sh "TASK_ID"
```

---

## System Architecture Overview

### What Is Honking Version?

A feature in honkingversion.runfoo.run that lets users vote on their preferred performance of a song. This answers the question: **"Which performance do fans love most?"**

**Core Concept:**
- Each song has multiple performances (studio, live versions, remixes, etc.)
- Users vote for which performance they prefer
- The winning performance (most votes) is displayed as the "honking version"
- Cache stores vote counts and winner info efficiently

**Key Files:**
- Models: `api/models.py` → `HonkingVersion` class
- API: `api/routes/honking_versions.py` → 5 endpoints for voting
- Frontend: `web/src/components/honking/` → UI components
- Cache Service: `api/services/honking_cache.py` → Persistent cache logic
- Documentation: `api/HONKING_CACHE_ARCHITECTURE.md` → Technical deep-dive

### Database Design

**Three Related Tables:**

1. **HonkingVersion** (vote records)
   - One row per vote
   - Fields: `id`, `user_id`, `song_id`, `performance_id`, `created_at`
   - Tracks: Which user voted for which performance of which song

2. **Song** (denormalized cache)
   - New fields (added via migration):
     - `current_honking_performance_id` - FK to winning performance
     - `current_honking_vote_count` - Vote count of winner
     - `honking_version_updated_at` - When cache was last updated

3. **SongPerformance** (denormalized cache)
   - New fields (added via migration):
     - `honking_vote_count` - Total votes for this performance
     - `honking_votes_updated_at` - When cache was last updated

**Why Denormalized?** O(1) lookups on "what's the winning performance" instead of COUNT queries. Survives deployments (no external cache).

---

## Current System State (as of Nov 24, 2024)

### ✅ What's Working

1. **Honking Version Feature (Complete)**
   - [x] Database models and migration
   - [x] 5 API endpoints (list, get, vote, update, delete)
   - [x] Frontend components (Badge, Selector, Display, Page)
   - [x] Song page integration
   - [x] Persistent denormalized cache
   - [x] Cache verification tools

2. **Core Infrastructure**
   - [x] git workflow with branches
   - [x] Task management with locking
   - [x] Basic seeding (100 shows)
   - [x] Tests passing (7/7 in test_settings.py)

3. **Recent Improvements**
   - [x] Fixed SQLAlchemy relationship ambiguity
   - [x] Enhanced .gitignore (removed 100+ MB of cache)
   - [x] Created setup and cleanup scripts
   - [x] Comprehensive documentation

### ⚠️ Critical Blocker: Postgres Migration

**Issue**: Recent commit `1f2b144` changed the default DATABASE_URL from SQLite to PostgreSQL.

**Impact**:
```
Local development: ❌ Broken (psycopg2 not installed, no Postgres running)
Testing: ❌ Broken (tests expect SQLite)
Docker/Production: ✅ Works (Postgres in docker-compose)
```

**Status**: codex is fixing this in test environment

**Workaround** (temporary):
```bash
# For local dev, set environment variable
export DATABASE_URL="sqlite:///./honkingversion.db"
npm run dev  # Will use SQLite instead
```

**Root Cause**: Database URL hardcoded in `api/database.py:18`

**Solution Needed**:
- Allow environment-based selection
- Default to SQLite for local dev
- Use Postgres only when DATABASE_URL explicitly set or in Docker

---

## Active Development Tasks

### By Agent (from todo.json)

| Task ID | Description | Agent | Status | Branch |
|---------|-------------|-------|--------|--------|
| 2 | Follow system UI + lists CRUD | Gemini | in-progress | feature/follow-system |
| 3 | Tags UI: create/edit, filter by tag | Antigravity | in-progress | feature/tags-system |
| 4 | Attendance: mark attended, stats | Antigravity | in-progress | feature/attendance |
| 7 | Settings polish & tests | Gemini | in-progress | feature/settings-phase2 |
| 8 | Performance comparisons UI | codex | in-progress | feature/compare-ux |
| 13 | Test app factory (avoid metadata collisions) | — | pending | — |
| 14 | Pre-commit/CI checks for cached files | — | pending | — |
| 15 | Task logging hygiene | — | pending | — |
| 16 | Cache/seed isolation | — | pending | — |

### Dependencies & Blockers

```
codex's Postgres fix (Task 8)
    ↓
Unblock all testing
    ↓
Merge hv3 features if needed (DEPRECATED - skip)
    ↓
Tasks 13-16 (test infrastructure improvements)
```

**Current Blocker**: codex fixing Postgres issue

---

## Git Workflow Reference

### Clone & Setup
```bash
cd /Users/ten/ANTIGRAVITY/honkingversion
git status
npm install
pip install -r api/requirements.txt
```

### Create a Feature Branch
```bash
git checkout master
git pull origin master
git checkout -b feature/your-descriptive-name
```

### Work on Your Task
```bash
# Make changes
git add api/something.py web/src/something.tsx
git commit -m "feat: description of what changed and why"

# Test locally
npm run build      # Frontend build
pytest api/tests/  # Run tests (if Postgres fix is done)

# Repeat until task is complete
```

### Push & Merge
```bash
git push origin feature/your-descriptive-name

# Then merge via git interface or:
git checkout master
git merge feature/your-descriptive-name
git push origin master

# Mark task complete
./complete_task.sh "TASK_ID"
```

### Avoid Force Pushes
- ❌ **Never** `git push --force` or `git push -f`
- ❌ **Never** `git reset --hard` on shared branches
- ✅ Use `git revert` to undo public commits
- ✅ Use `git merge` to resolve conflicts

---

## Testing Setup

### Run Tests (after Postgres fix)
```bash
# Install dependencies first
pip install -r api/requirements.txt

# Run all tests
pytest api/tests/

# Run specific test file
pytest api/tests/test_settings.py

# Run with verbose output
pytest -v api/tests/

# Run specific test function
pytest api/tests/test_settings.py::test_user_settings_get
```

### Test Database
- Uses SQLite in memory (or configured via DATABASE_URL)
- No need to create tables (models.py handles it)
- No Postgres required for testing

### Known Test Issues
1. **Postgres migration broken**: Tests expect SQLite, but default DATABASE_URL is Postgres
   - **Fix Status**: codex working on this
   - **Workaround**: `export DATABASE_URL="sqlite:///./test.db"` before running pytest

2. **Cache columns**: If migration not run, honking cache columns don't exist
   - **Fix**: Run `python api/backfill_honking_cache.py --verify-only` after migration
   - **Backfill**: Run full backfill after deploying migration to production

---

## Deployment Pipeline

### Development → Testing → Production

```
1. Make changes locally
       ↓
2. git commit && git push to master
       ↓
3. GitHub Actions / Forgejo Actions triggers
       ↓
4. Builds Docker image (api + web)
       ↓
5. Deploys to test environment (docker-compose)
       ↓
6. Tests run
       ↓
7. If passing → Deploys to production (honkingversion.runfoo.run)
```

### Check Deployment Status
- GitHub Actions: https://github.com/anthropics/claude-code/actions
- Or Forgejo: https://git.runfoo.run/runfoo/honkingversion/actions
- Last deployment: Check git log for most recent commit

### Deployment Time
- ~5 minutes from git push to live

### Docker Deployment Configuration
**docker-compose.yml** uses:
- Postgres for database (not SQLite)
- NextAuth for auth (NEXTAUTH_SECRET required)
- Environment variables from `.env` file

---

## Honking Cache System

### How It Works (2-minute overview)

1. **User votes on a performance**
   ```
   POST /api/honking-versions
   Body: {user_id, song_id, performance_id}
   ```

2. **API creates HonkingVersion record**
   ```sql
   INSERT INTO honking_version (user_id, song_id, performance_id) VALUES (...)
   ```

3. **Cache service updates counts**
   ```python
   HonkingCacheService.on_honking_vote_created(session, honking_vote)
   # Updates:
   # - SongPerformance.honking_vote_count += 1
   # - Song.current_honking_performance_id (if new winner)
   # - Song.current_honking_vote_count (if new winner)
   ```

4. **Response includes cached values**
   ```json
   {
     "id": "perf-123",
     "honking_vote_count": 42,
     "honking_votes_updated_at": "2024-11-24T12:34:56Z",
     "is_current_honking_version": true
   }
   ```

5. **Frontend displays winner**
   ```
   🎙️ Honking Version: Live Version 2 (42 votes)
   ```

### Cache Consistency

All updates are **transactional**—if the cache update fails, the entire vote is rolled back.

Verify cache consistency:
```python
from api.services.honking_cache import HonkingCacheService
from api.database import engine, Session

with Session(engine) as session:
    is_consistent = HonkingCacheService.verify_cache_consistency(session, song_id=123)
    print(f"Cache valid: {is_consistent}")
```

Rebuild cache from scratch (after migration or corruption):
```bash
cd api
python -c "
from database import engine, Session
from services.honking_cache import HonkingCacheService

with Session(engine) as session:
    songs_updated, perfs_updated = HonkingCacheService.rebuild_all_cache(session)
    print(f'Updated {songs_updated} songs, {perfs_updated} performances')
"
```

### Cache Fields (Database Schema)

**Song table:**
- `current_honking_performance_id` (INT, FK) - Which performance won
- `current_honking_vote_count` (INT) - How many votes
- `honking_version_updated_at` (DATETIME) - When calculated

**SongPerformance table:**
- `honking_vote_count` (INT) - Votes for this performance
- `honking_votes_updated_at` (DATETIME) - When calculated

---

## SQLAlchemy Relationship Fix (Critical)

### The Problem
When we added `current_honking_performance_id` (FK to SongPerformance), SQLAlchemy couldn't figure out which FK the `Song.performances` relationship should use:
- Option 1: SongPerformance.song_id
- Option 2: SongPerformance.current_honking_performance_id (ambiguous!)

Result: `InvalidRequestError: Could not determine join condition`

### The Solution
Explicitly specify which FK to use:

```python
# In Song model
performances: List["SongPerformance"] = Relationship(
    back_populates="song",
    sa_relationship_kwargs={
        "foreign_keys": "SongPerformance.song_id"
    }
)

# In SongPerformance model
song: Song = Relationship(
    back_populates="performances",
    sa_relationship_kwargs={
        "foreign_keys": "SongPerformance.song_id"
    }
)
```

**Key Points:**
- Only needed because we added a second FK to the same table
- Applied to both sides of the relationship
- All 7 tests now pass ✅

---

## Common Development Patterns

### Pattern 1: Adding a New Feature

```bash
# 1. Create branch
git checkout -b feature/new-feature

# 2. Create models
# Edit api/models.py - add fields, relationships

# 3. Create migration
# Create api/migrations/YYYY_MM_DD_description.sql

# 4. Create API endpoints
# Create api/routes/new_feature.py

# 5. Hook up routes
# Edit api/main.py - add router

# 6. Add frontend
# Create web/src/components/NewFeature.tsx
# Create web/src/app/new-feature/page.tsx

# 7. Test locally
npm run dev
# Visit http://localhost:3000/new-feature
# Check Network tab for API calls

# 8. Run tests
pytest api/tests/

# 9. Commit and push
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### Pattern 2: Fixing a Bug

```bash
# 1. Create branch from master
git checkout master
git pull
git checkout -b fix/bug-description

# 2. Reproduce the bug
# Add failing test case

# 3. Fix the code
# Make minimal changes to fix the issue

# 4. Verify fix
pytest api/tests/test_bug.py

# 5. Commit with "fix:" prefix
git commit -m "fix: description of what was wrong and how it's fixed"
git push origin fix/bug-description

# 6. Merge to master
git checkout master
git merge fix/bug-description
./complete_task.sh "TASK_ID"
```

### Pattern 3: Coordinating with Another Agent

**Scenario**: Agent A is editing `settings.py`, Agent B is editing `votes.py`

**Solution**: Different files = no conflicts. Both can work independently and merge.

**Conflict Case**: Both agents edit the same file

**Solution**:
```bash
# After git merge, resolve conflicts
git status  # Shows conflicted files
# Edit conflicted file, remove <<<< >>>> markers
git add conflicted_file.py
git commit -m "Merge: resolve conflicts with Agent A's work"
git push origin master
```

---

## Performance Considerations

### Honking Vote Lookups

**Without Cache:**
```sql
SELECT perf_id, COUNT(*) as vote_count
FROM honking_version
WHERE song_id = 123
GROUP BY perf_id
ORDER BY vote_count DESC
LIMIT 1
-- ⏱️ ~50ms (slow, especially with many votes)
```

**With Cache:**
```sql
SELECT current_honking_performance_id, current_honking_vote_count
FROM song
WHERE id = 123
-- ⏱️ <1ms (instant lookup)
```

### Index Lookups

Added indexes for:
- `honking_vote_count` on SongPerformance (for "most voted" queries)
- `current_honking_performance_id` on Song (for FK lookups)

---

## Helpful Scripts

### Development Setup
```bash
bash scripts/setup-dev.sh
# Creates venv, installs deps, cleans old databases
```

### Clean Cache & Test Data
```bash
bash scripts/clean-cache.sh
# Removes .db files, .pytest_cache, Python artifacts
```

### Run Tests
```bash
cd api
pytest tests/
```

### Seed Database
```bash
cd api
python seed.py  # Adds 100 shows, 1000 performances, users, votes
```

---

## Documentation Map

| Document | Purpose |
|----------|---------|
| `COLLABORATION_WORKFLOW.md` | Multi-agent coordination, branching, task management |
| `AGENT_HANDOFF.md` | This file - system overview, quick start, common patterns |
| `api/HONKING_CACHE_ARCHITECTURE.md` | Deep technical dive on cache design and performance |
| `.env.example` | Example environment variables |
| `docker-compose.yml` | Production deployment config |
| `api/models.py` | SQLModel definitions for all database tables |
| `api/routes/honking_versions.py` | API endpoint implementation |

---

## Debugging Tips

### "Tests are failing: ModuleNotFoundError: psycopg2"
**Cause**: DATABASE_URL default is Postgres, but tests expect SQLite
**Fix**: Set environment variable
```bash
export DATABASE_URL="sqlite:///./test.db"
pytest api/tests/
```

### "Cache shows wrong vote count"
**Step 1**: Verify cache consistency
```python
from api.services.honking_cache import HonkingCacheService
from api.database import Session, engine

with Session(engine) as session:
    is_ok = HonkingCacheService.verify_cache_consistency(session, song_id=123)
    print(f"Valid: {is_ok}")
```

**Step 2**: If invalid, rebuild
```bash
cd api
python -c "
from database import engine, Session
from services.honking_cache import HonkingCacheService

with Session(engine) as session:
    HonkingCacheService.rebuild_all_cache(session)
"
```

### "Migration didn't apply"
**Check migration status**:
```bash
# SQLite
sqlite3 honkingversion.db ".tables"
sqlite3 honkingversion.db "PRAGMA table_info(song);"

# Postgres
psql -U honking -d honkingversion -c "\d song"
```

**Apply manually**:
```bash
sqlite3 honkingversion.db < api/migrations/2025_11_24_honking_version_denormalization.sql
```

### "Relationship error: Could not determine join condition"
**This is fixed** in current code. If you see this:
1. Check that models.py has explicit `foreign_keys` in Relationships
2. If not, apply the fix from section "SQLAlchemy Relationship Fix"

---

## Task Claiming & Management

### Check Pending Tasks
```bash
cat todo.json | jq '.[] | select(.status == "pending")'
```

### Claim a Task
```bash
./claim_task.sh "13" "Your Agent Name"
# Updates todo.json atomically with file lock
```

### Check Who's Working on What
```bash
cat todo.json | jq '.[] | select(.status == "in-progress")'
```

### Complete a Task
```bash
./complete_task.sh "13"
# Marks task complete, no agent assigned
```

### Lock System Safety
- File lock prevents concurrent modifications
- Lock auto-cleans if script interrupted (trap handler)
- Wait max 30 seconds for lock (error if longer)
- Safe for 10+ concurrent agents

---

## Contact & Support

**If you get stuck:**

1. **Check COLLABORATION_WORKFLOW.md** - Multi-agent coordination
2. **Check HONKING_CACHE_ARCHITECTURE.md** - Cache deep-dive
3. **Check task comments** - Previous agents may have notes
4. **Check git log** - Recent commits show what was done
5. **Run tests** - `pytest -v` gives immediate feedback
6. **Check .env.example** - Required environment variables

**Key Contacts** (based on todo.json):
- **codex**: Performance comparisons, postgres migration fix
- **Gemini**: Follow system, lists, settings
- **Antigravity**: Tags, attendance, user features

---

## Success Checklist for Tasks

Before marking a task complete:

- [ ] Tests pass locally (`pytest api/tests/`)
- [ ] No git conflicts
- [ ] Code committed with clear message
- [ ] Feature branch merged to master
- [ ] Pushed to remote
- [ ] Documentation updated (README, comments if complex)
- [ ] Task marked complete via `./complete_task.sh`

---

**Last Updated**: November 24, 2024
**Maintained By**: Claude Code
**Version**: 1.0
