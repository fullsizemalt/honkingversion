# Honking Version Cache Architecture

## Overview

The honking version feature uses **persistent denormalized caching** to achieve O(1) lookups and ensure cache survives deployments. This document explains the design, implementation, and maintenance procedures.

## Design Goals

1. **Performance**: Fast O(1) lookups for current honking version
2. **Persistence**: Cache survives deployments (stored in database)
3. **Consistency**: Cache stays in sync with actual vote data
4. **Robustness**: Automatic detection and fixing of inconsistencies

## Cache Architecture

### Denormalized Fields

#### Song Model
```python
current_honking_performance_id: Optional[int]  # FK to SongPerformance - the winning perf
current_honking_vote_count: int               # Vote count of the winner
honking_version_updated_at: Optional[datetime] # When cache was last updated
```

#### SongPerformance Model
```python
honking_vote_count: int                # How many users voted this perf as honking version
honking_votes_updated_at: Optional[datetime] # When cache was last updated
```

### Why This Design?

- **No external cache dependency**: Values stored in SQLite, not Redis
- **Single source of truth**: Database is authoritative
- **Fast reads**: No aggregation queries needed for winning performance
- **Deployment-safe**: Survives container restarts and scaling events
- **Simple transactions**: All cache updates happen in-band with vote changes

## Cache Maintenance

### Automatic Updates

Cache is updated **transactionally** whenever a honking version vote is created/updated/deleted:

1. **Vote Created**:
   - Increment the new performance's `honking_vote_count`
   - Recalculate song's winning performance

2. **Vote Changed**:
   - Decrement old performance's `honking_vote_count`
   - Increment new performance's `honking_vote_count`
   - Recalculate song's winning performance

3. **Vote Deleted**:
   - Decrement performance's `honking_vote_count`
   - Recalculate song's winning performance

### Service: HonkingCacheService

Located in `api/services/honking_cache.py`, provides:

```python
# Update a specific performance's cache
recalculate_performance_cache(session, performance_id) -> int

# Find and update the song's winning performance
recalculate_song_cache(session, song_id) -> Tuple[Optional[int], int]

# Called after vote creation
on_honking_vote_created(session, honking_vote)

# Called after vote change
on_honking_vote_changed(session, old_perf_id, new_honking_vote)

# Called after vote deletion
on_honking_vote_deleted(session, song_id, performance_id)

# Verify cache consistency (debugging)
verify_cache_consistency(session, song_id) -> bool

# Rebuild entire cache from scratch
rebuild_all_cache(session) -> Tuple[songs_updated, perfs_updated]
```

## API Endpoints

All endpoints use cached values for reads:

### GET /honking-versions/song/{song_id}
- **Performance**: O(1) lookup for current honking version
- **Returns**: Cached winner + all vote breakdown + user's vote
- **Includes**: `cache_timestamp` showing when cache was last updated

### GET /honking-versions/performance/{performance_id}
- **Performance**: O(1) lookup for vote count
- **Returns**: Cached vote count
- **Includes**: `cache_timestamp`

### POST /honking-versions/song/{song_id}
- **Creates/updates** user's honking vote
- **Automatically updates** cache transactionally
- **Error handling**: Rolls back cache update if it fails

### DELETE /honking-versions/song/{song_id}
- **Deletes** user's honking vote
- **Automatically updates** cache transactionally
- **Error handling**: Rolls back cache update if it fails

## Data Consistency

### Transaction Safety

All cache updates happen in the same transaction as the vote change:

```python
# Vote creation
session.add(honking_vote)
session.commit()                    # Vote is now persistent

HonkingCacheService.on_honking_vote_created(session, honking_vote)
session.commit()                    # Cache updated
```

If the cache update fails, the entire operation fails and is rolled back.

### Verification

Use `verify_cache_consistency()` to check if cache matches actual data:

```python
from services.honking_cache import HonkingCacheService

is_consistent = HonkingCacheService.verify_cache_consistency(session, song_id)
if not is_consistent:
    logger.warning(f"Cache is out of sync for song {song_id}")
```

### Repair

If inconsistencies are detected, use the backfill script:

```bash
# Verify without making changes
python backfill_honking_cache.py --verify-only

# Rebuild cache from scratch
python backfill_honking_cache.py

# It will:
# 1. Recalculate all performance vote counts
# 2. Recalculate all song winning performances
# 3. Run verification pass
# 4. Report any remaining inconsistencies
```

## Migration Steps

### 1. Apply Database Migration
```bash
# The migration creates the cache columns with defaults
sqlite3 api/database.db < api/migrations/2025_11_24_honking_version_denormalization.sql
```

### 2. Backfill Cache
```bash
source venv/bin/activate
python api/backfill_honking_cache.py
```

This will populate cache columns with values from existing votes.

### 3. Deploy New Code
- Deploy updated models.py
- Deploy updated honking_versions.py
- Deploy new HonkingCacheService

All future vote changes will automatically maintain cache.

## Performance Characteristics

### Before (Without Cache)
- Get honking version: O(N) - Count query on all votes
- Get all performances with votes: O(N) - Group aggregate query

### After (With Cache)
- Get honking version: O(1) - Single field lookup on Song
- Get all performances with votes: O(N) - Still needs group query for breakdown
- Get performance vote count: O(1) - Single field lookup on SongPerformance

### Query Impact
- **GET /honking-versions/song/{song_id}**:
  - Before: Main query (COUNT/GROUP), user vote query
  - After: Main query (GROUP - unchanged), cached winner in response

The main query still needs the GROUP BY breakdown, but the **winning performance is now O(1)** instead of requiring aggregate computation.

## Monitoring

### Check Cache Timestamps
The API includes `cache_timestamp` in responses to see when cache was last updated:

```json
{
  "song_id": 123,
  "honking_version": {...},
  "cache_timestamp": "2025-11-24T18:00:00"
}
```

If timestamps are stale, cache might not be updating properly.

### Log Monitoring
Watch for:
- `Cache updated after honking vote`: Normal operation
- `Failed to update cache`: Indicates a problem
- `Cache inconsistency detected`: Need to run backfill

## Troubleshooting

### Inconsistent Cache

**Symptom**: Vote counts don't match, wrong winning performance

**Solution**:
```bash
python api/backfill_honking_cache.py --verify-only
python api/backfill_honking_cache.py
```

### Cache Not Updating After Vote

**Symptom**: Vote created but cache unchanged

**Check**:
1. Verify HonkingCacheService is imported in honking_versions.py
2. Check logs for "Failed to update cache" errors
3. Verify database migration was applied

### Missing Cache Columns

**Symptom**: AttributeError for `honking_vote_count` or similar

**Solution**: Apply the migration
```bash
sqlite3 api/database.db < api/migrations/2025_11_24_honking_version_denormalization.sql
```

## Future Optimizations

1. **Add indexes** on `(song_id, current_honking_performance_id)` if querying by both
2. **Batch updates** for high-volume scenarios
3. **Cache refresh hooks** if adding Redis later
4. **Materialized view** of top performances by votes

## Testing Cache Consistency

```python
from sqlmodel import Session
from database import engine
from services.honking_cache import HonkingCacheService

with Session(engine) as session:
    # Test a specific song
    is_consistent = HonkingCacheService.verify_cache_consistency(session, song_id=1)

    # Rebuild all cache
    songs, perfs = HonkingCacheService.rebuild_all_cache(session)
    print(f"Rebuilt {songs} songs and {perfs} performances")
```

---

**Created**: 2025-11-24
**Architecture**: Denormalized persistent cache in SQLite
**Status**: Production-ready
