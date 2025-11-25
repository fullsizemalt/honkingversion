# Honkingversion Collaboration Workflow

## Overview

This is a **multi-agent collaborative development system** with two parallel branches and a task management system. Multiple Claude agents (codex, Gemini, Antigravity) work simultaneously on different features.

## Architecture

```
/Users/ten/ANTIGRAVITY/
├── honkingversion/          ← MAIN PRODUCTION BRANCH
│   ├── master              ← Live code deployed to production
│   ├── feature/*           ← Feature branches
│   ├── todo.json           ← Shared task list with locks
│   ├── claim_task.sh       ← Lock system for task assignment
│   ├── complete_task.sh
│   └── merge_from_hv3.sh   ← One-way sync from experimental
│
└── hv3/                     ← EXPERIMENTAL BRANCH
    ├── master              ← Bleeding edge features
    ├── feature/*           ← New experimental features
    └── merge_to_hv3.sh     ← Sync from honkingversion
```

## Two-Branch System

### honkingversion/ (Production)
- **Purpose:** Stable, tested, production-ready code
- **Deployed to:** https://honkingversion.runfoo.run
- **Audience:** End users
- **Change frequency:** Stable, reviewed changes only
- **Branch strategy:** master + feature branches
- **Merge from:** hv3 (one-way, selective)

### hv3/ (Experimental)
- **Purpose:** Rapid prototyping, testing new features
- **Deployment:** Internal test environment only
- **Audience:** Developers, testing new ideas
- **Change frequency:** Fast, experimental changes
- **Branch strategy:** master + feature branches
- **Merge from:** honkingversion (to stay in sync)

**Key Rule:** hv3 is a **one-way lab**. Proven features flow FROM hv3 TO honkingversion, never the reverse.

## Task Management System

### Task Lifecycle

```
PENDING → CLAIMED (in-progress) → COMPLETED
```

### Task File: todo.json

Each task has:
```json
{
  "id": "13",
  "description": "Add test app factory to avoid global FastAPI metadata collisions",
  "status": "pending",           // pending | in-progress | completed
  "agent": null                  // Agent name when claimed
}
```

### Task Locking (Concurrent Safety)

The system uses file locks to prevent merge conflicts when multiple agents update `todo.json`:

```bash
# Claim a task
./claim_task.sh "13" "Claude Code"

# Complete a task
./complete_task.sh "13"

# Add a new task
./add_task.sh "New feature description"
```

**How it works:**
1. Script creates `.lock` file
2. Waits if lock exists (other agent updating)
3. Updates todo.json
4. Removes lock
5. If interrupted, lock is cleaned up automatically

### Example: Claiming Work

```bash
# Agent sees pending task
cat todo.json | grep -A2 '"status": "pending"'

# Agent claims it (marks as in-progress, assigns themselves)
./claim_task.sh "13" "CodexBot"

# Agent works...
# When done:
./complete_task.sh "13"
```

## Feature Branch Strategy

### Active Feature Branches (as of Nov 24, 2024)

**In honkingversion:**
- `feature/compare-ux` - Performance comparisons UI
- `feature/settings-phase2` - User settings system
- `feature/tours-years-venues-songs-lists-pages` - Main feature branch
- `chore/bootstrap-and-build` - Infrastructure

**In hv3:**
- `feature/tags-system` - Phase 2 Tags UI
- `feature/user-lists` - Create/edit lists
- `feature/search-integration` - Search features

### Branching Rules

1. **Feature branches** created from master of respective repo
2. **Commit frequently** - Small, logical commits
3. **PR/review before merge** - Never force push to master
4. **Update todo.json** - Mark task complete when merged

## Synchronization: Merging Between Branches

### hv3 → honkingversion (Proven Features)

**What:** One-way merge of tested features from hv3 to honkingversion

**When:**
- Feature is fully tested in hv3
- Tests pass
- No conflicts with honkingversion

**How:**

```bash
cd /Users/ten/ANTIGRAVITY/honkingversion

# 1. Review what's different
git log master..../Users/ten/ANTIGRAVITY/hv3/master --oneline

# 2. Merge script (semi-automated)
bash merge_from_hv3.sh

# 3. Manually verify
git status
git diff

# 4. Commit and test
git add .
git commit -m "feat: Merge Phase 2 Tags System from hv3"
npm run build
pytest api/tests/

# 5. Push to origin
git push origin master
```

**The merge script does:**
- Copies specific files from hv3
- Updates API imports to use centralized handlers
- Applies sed replacements for hardcoded URLs
- Requires manual review before commit

### honkingversion → hv3 (Keeping in Sync)

**What:** Keep hv3 up-to-date with honkingversion's fixes

**When:** When critical fixes land in honkingversion

**How:**

```bash
cd /Users/ten/ANTIGRAVITY/hv3

# 1. Pull latest from honkingversion master
git fetch /Users/ten/ANTIGRAVITY/honkingversion master

# 2. Merge into hv3 master
git merge FETCH_HEAD

# 3. Resolve conflicts (hv3 experimental code stays)
git add .
git commit -m "Merge honkingversion fixes into hv3"
```

## Current Active Agents & Their Work

Based on todo.json and commit history:

| Agent | Task | Status | Focus |
|-------|------|--------|-------|
| **codex** | Task 8: Performance comparisons | in-progress | UI scaffolding, deep links, tags |
| **Gemini** | Task 2: Follow system | in-progress | Claim/unfollow buttons, followers page |
| **Antigravity** | Task 3: Tags UI | in-progress | Create/edit tags, filter UI |
| **Antigravity** | Task 4: Attendance | in-progress | Mark attended shows, heatmap (DONE) |
| **Claude Code** | Task 10: Tests | completed | Fixed SQLAlchemy relationships |
| **Claude Code** | Task 12: Git hygiene | completed | Added cleanup scripts |

## Coordination Between Agents

### Real-time Communication

**Use cases:**
- Agent A finished Task 10 (tests fixed)
- Agent B can now work on Task 13 (test app factory)

**Current blockers:**
- Postgres migration broke tests (codex fixing in test env)
- Once fixed, can merge hv3 features

### Avoiding Conflicts

1. **Check todo.json** - Who's working on what?
2. **Different files when possible** - Agent A edits settings.py, Agent B edits votes.py
3. **Different features when possible** - Performance comparisons vs Tags system
4. **Use branches** - Each feature on its own branch, merge when ready
5. **Lock system** - todo.json updates are atomic via locks

## Deployment Pipeline

### Development → Testing → Production

```
Local dev (your machine)
    ↓
honkingversion/master (git push)
    ↓
GitHub Actions / Forgejo Actions (builds Docker)
    ↓
Test environment (docker compose on server)
    ↓
Production (https://honkingversion.runfoo.run)
```

### Current Status (Nov 24, 2024)

- **Latest master:** `1f2b144` (chore: move API default to Postgres)
- **Test env:** Building (Postgres fix by codex)
- **Production:** Last tested Nov 24 17:25 UTC
- **Deployment time:** ~5 minutes from git push

## Agents: How to Work on This Project

### When You Start

1. **Check git status:**
   ```bash
   cd /Users/ten/ANTIGRAVITY/honkingversion
   git branch
   git status
   ```

2. **Look at todo.json:**
   ```bash
   cat todo.json | jq '.[] | select(.status == "pending")'
   ```

3. **Claim a task:**
   ```bash
   ./claim_task.sh "13" "Your Agent Name"
   ```

4. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### While Working

- **Commit frequently** - Small, logical commits
- **Write descriptive commit messages** - What & why, not just what
- **Test locally** - Run pytest, npm run build
- **Check for conflicts** - git status, git diff

### When You Finish

1. **Complete the task:**
   ```bash
   ./complete_task.sh "13"
   ```

2. **Push to remote:**
   ```bash
   git push origin feature/your-feature-name
   git push origin master  # If feature merged
   ```

3. **Wait for deployment** - Check git.runfoo.run/actions

4. **Verify in production** - https://honkingversion.runfoo.run

## Common Scenarios

### Scenario 1: Using hv3 as a Testing Ground

```bash
# Work on experimental feature in hv3
cd /Users/ten/ANTIGRAVITY/hv3
git checkout -b feature/experimental-ui
# ... make changes ...
git commit -m "feat: experimental UI changes"

# Test thoroughly
npm run build
pytest api/tests/

# Once proven, merge to honkingversion
cd /Users/ten/ANTIGRAVITY/honkingversion
bash merge_from_hv3.sh
```

### Scenario 2: Critical Fix in honkingversion

```bash
# Fix bug in honkingversion
cd /Users/ten/ANTIGRAVITY/honkingversion
git checkout -b fix/critical-bug
# ... fix ...
git commit -m "fix: critical bug"
git push origin fix/critical-bug

# Merge to master and deploy
# Then sync to hv3
cd /Users/ten/ANTIGRAVITY/hv3
git fetch /Users/ten/ANTIGRAVITY/honkingversion master
git merge FETCH_HEAD
```

### Scenario 3: Coordinating Between Agents

**Agent A (codex) is working on Performance Comparisons:**
```bash
cd /Users/ten/ANTIGRAVITY/honkingversion
git checkout -b feature/compare-ux
# ... edits web/src/app/performance-comparisons/page.tsx ...
```

**Agent B (Gemini) is working on Follow System:**
```bash
cd /Users/ten/ANTIGRAVITY/honkingversion
git checkout -b feature/follow-system
# ... edits web/src/components/FollowButton.tsx ...
```

**No conflicts!** Different files, can merge independently.

## Environment Variables & Configuration

### For Local Development

```bash
# .env.local (web)
NEXT_PUBLIC_API_URL=http://localhost:8000
INTERNAL_API_URL=http://localhost:8000

# api/.env (backend)
DATABASE_URL=sqlite:///./honkingversion.db  # ← Local dev
# OR
DATABASE_URL=postgresql+psycopg2://user:pass@localhost:5432/honkingversion
```

### For Docker/Production

```bash
# docker-compose.yml or .env
DATABASE_URL=postgresql+psycopg2://honking:honking@postgres:5432/honkingversion
NEXTAUTH_SECRET=<generated>
```

## Troubleshooting

### "todo.json is locked"

**Cause:** Another agent is updating it

**Solution:** Wait 1-2 seconds, try again. If stuck for >30s, file a new issue.

### Merge conflicts between branches

**Cause:** Same file edited in both branches

**Solution:**
```bash
git status  # See conflicts
# Edit conflicted files
git add .
git commit -m "Merge: resolve conflicts in X"
```

### Tests failing after merge

**Cause:** Code from hv3 doesn't match honkingversion's setup

**Solution:**
1. Check git diff for what changed
2. Run locally to reproduce
3. File new task if not fixable

### Can't push to remote

**Cause:** Authentication or remote tracking

**Solution:**
```bash
git remote -v  # Check remote URL
git branch -vv  # Check tracking
git push origin master  # Explicit
```

## Key Files for Agents

| File | Purpose | Edit When |
|------|---------|-----------|
| `todo.json` | Shared task list | Never manually - use scripts |
| `claim_task.sh` | Claim tasks | Run, don't edit |
| `complete_task.sh` | Mark done | Run, don't edit |
| `merge_from_hv3.sh` | Merge features | Run when promoting hv3 features |
| `DEPLOYMENT.md` | Deployment docs | Reference for deployment |
| `AGENT_DEPLOY.md` | Server deployment | For production deployment |

## Future Improvements

1. **Automated conflict detection** - Alert when branches diverge
2. **Merge automation** - Auto-merge if tests pass
3. **Branch protection rules** - Require reviews before merge to master
4. **Automated deployments** - From master push → test → production
5. **Per-agent workspaces** - Prevent accidental edits to another's work

---

**Last Updated:** November 24, 2024
**By:** Claude Code
**Version:** 1.0

