# API Usage Policy - Honkingversion.runfoo.run

**Last Updated**: November 22, 2025
**Status**: Active
**Scope**: El Goose API Integration

---

## Overview

Honkingversion.runfoo.run is a fan site dedicated to the band Goose. This project uses the **El Goose API** as its primary data source for setlist information, performance history, and venue data.

This document outlines:
- The rationale for using the El Goose API
- How the API is used responsibly
- Attribution and compliance standards
- Contact information for concerns

---

## El Goose API Details

### Endpoint
- **Base URL**: https://elgoose.net/api/v2
- **Access**: Public (no authentication required)
- **Format**: JSON
- **Documentation**: https://elgoose.net/api/docs/

### Endpoints Used

1. **Setlist Lookup by Date**
   - Path: `/setlists/showdate/{YYYY-MM-DD}.json`
   - Usage: Fetch setlist data for a specific performance date
   - Example: https://elgoose.net/api/v2/setlists/showdate/2024-11-22.json

2. **Show Links by ID**
   - Path: `/links/show_id/{show_id}.json`
   - Usage: Fetch related links (audio, video, etc.) for a show
   - Example: https://elgoose.net/api/v2/links/show_id/12345.json

---

## Justification for Use

### Public API Status
The El Goose API is publicly accessible at https://elgoose.net/api/v2 with:
- ✅ No authentication required
- ✅ No API key needed
- ✅ No rate limit warnings in documentation
- ✅ No terms of service blocking third-party usage

### Design Pattern
Based on these characteristics, the API is reasonably interpreted as intended for public third-party use.

### Data Source Choice
El Goose was selected because:
1. **Authoritative**: Maintained by the Goose fan community
2. **Comprehensive**: Covers setlists from Goose's entire history
3. **Reliable**: Actively maintained and updated
4. **Publicly Available**: Accessible without barriers

---

## Usage Implementation

### Architecture

**Server-Side Integration**
```
Frontend → Next.js API Routes → Local Database
                                    ↓
                          (on-demand) El Goose API
```

- All API calls are made from the server (not from client browsers)
- Data is stored in local database to minimize repeated API calls
- On-demand fetching prevents the need for aggressive bulk scraping
- Allows for caching and rate control

### Population Strategy

#### Option 1: Bulk Initial Population (Recommended for Full History)
For accessing the entire Goose history:

```bash
# Populate last year of shows
python api/seed_from_elgoose.py

# Or specify custom date range
python api/seed_from_elgoose.py --start 2016-01-01 --end 2024-12-31

# Or limit for testing
python api/seed_from_elgoose.py --limit 50
```

**Rationale for Bulk Scrape:**
- El Goose API provides public access with no authentication
- One-time population is a reasonable use of the API
- Iterating through historical dates (one per request) is minimal load
- Data is cached locally, eliminating future API calls

**Implementation:**
- Script: `api/seed_from_elgoose.py`
- Validates and parses El Goose API responses
- Creates Show, Song, and SongPerformance records
- Logs progress and statistics

#### Option 2: On-Demand Population (Automatic, Zero Setup)
Shows are automatically fetched and cached when users request them:

1. User visits `/shows/2024-11-22`
2. API checks local database
3. If not found, fetches from El Goose API
4. Populates database with show data
5. Returns to user (subsequent requests use cache)

**Benefits:**
- No setup required
- Minimal API load (only requested shows)
- Database grows organically with user activity
- Can be combined with bulk scraping for coverage

**Implementation:**
- Module: `api/services/show_fetcher.py`
- Route: `api/routes/shows.py` (uses `ShowFetcher.get_or_fetch_show()`)
- Handles concurrent requests gracefully

### Code Location
- **Bulk Scraper**: `/api/seed_from_elgoose.py` (one-time population)
- **Show Fetcher**: `/api/services/show_fetcher.py` (on-demand population)
- **Routes**: `/api/routes/shows.py` (endpoint handlers)
- **Components**: Uses data from `/api/shows` endpoints

### Caching Strategy
- Initial population (bulk scrape): Single API call per show
- On-demand: Minimal calls (only requested shows, one per show)
- Local database caching: All subsequent access is from database
- No client-side caching of external data
- Reasonable request frequency aligned with user activity

---

## Responsible Usage Standards

### Request Practices
1. **Identification**: Requests identify themselves with appropriate User-Agent headers
2. **Rate Limiting**: No intentional high-frequency or batch requests
3. **Frequency**: API calls made only when user requests data
4. **Caching**: Results cached client-side to reduce redundant calls

### Data Handling
1. **No Modification**: Data is displayed as-is without alteration
2. **Attribution**: All data is attributed back to El Goose
3. **Linking**: External links point to El Goose for source verification
4. **No Republishing**: Data is not redistributed or repackaged

### Scraping Policy

**One-Time Bulk Population (Authorized):**
- ✅ **Yes**: Single bulk scrape to populate historical database
- ✅ **Rationale**: Public API, no authentication, one-time operation
- ✅ **Scope**: Historical Goose shows (date range based)
- ✅ **Frequency**: One-time only during setup
- ✅ **Implementation**: `api/seed_from_elgoose.py`

**Ongoing On-Demand Fetching (Minimal Load):**
- ✅ **Yes**: Fetch shows as users request them
- ✅ **Rationale**: Lazy population, minimal API pressure
- ✅ **Load**: One request per unique show requested
- ✅ **Caching**: Data stored locally, no repeated API calls
- ✅ **Implementation**: `api/services/show_fetcher.py`

**Prohibited Practices:**
- ❌ **No**: Repeated/aggressive scraping of the same shows
- ❌ **No**: Mass data harvesting for external distribution
- ❌ **No**: Caching data long-term for offline use without attribution
- ❌ **No**: Using El Goose data in competing services without permission

---

## Attribution

### Public Attribution
All pages using El Goose data include:
1. **Footer Attribution** (on every page)
   - Link to El Goose website
   - Link to this attribution page
2. **Attribution Page** (`/attribution`)
   - Detailed API information
   - Usage policy overview
   - Contact information

### Code Attribution
- Comments in source code identify El Goose as the data source
- Repository includes this policy document
- Git history preserves attribution information

---

## Legal Compliance

### Assumptions
Honkingversion.runfoo.run operates under the reasonable assumption that:
1. Public, unauthenticated APIs are intended for third-party use
2. The El Goose API's lack of restrictions indicates approval for responsible use
3. Proper attribution satisfies any implicit licensing requirements

### Risk Assessment
- **Low Risk**: Using a publicly available, free API with proper attribution
- **Transparency**: Clear documentation of usage available to El Goose team
- **Respectful Use**: No aggressive scraping, minimal load, proper attribution

### Dispute Resolution
If El Goose or its team has concerns about this usage:
1. This document provides clear intent and practice
2. Usage is entirely attributable and can be modified
3. Project repository is public and accessible for review
4. Contact: Through project repository or direct outreach

---

## Contact & Concerns

If you are affiliated with El Goose and have:
- Questions about this usage
- Concerns about the integration
- Specific terms we should be aware of
- Requests for changes

**Please reach out:**
- Project Repository: https://git.runfoo.run/runfoo/honkingversion
- Public Attribution Page: https://honkingversion.runfoo.run/attribution

---

## Related Documents

- [Attribution Page](./web/src/app/attribution/page.tsx) - User-facing attribution
- [El Goose Service](./api/services/elgoose.py) - Implementation details
- [Footer Component](./web/src/components/Footer.tsx) - Footer attribution
- [El Goose Official Site](https://elgoose.net) - Original source

---

## Deployment & Setup

### First-Time Setup

When deploying Honkingversion to a new environment:

```bash
# 1. Install dependencies
pip install -r api/requirements.txt

# 2. Create database tables
python -c "from api.database import create_db_and_tables; create_db_and_tables()"

# 3. Populate initial data (choose one approach)

# Option A: Populate last year of shows (recommended for full feature set)
python api/seed_from_elgoose.py

# Option B: Populate entire history (2016-2024, may take 5-10 minutes)
python api/seed_from_elgoose.py --start 2016-01-01 --end 2024-12-31

# Option C: Start empty and let on-demand fetching populate as users browse
# (No action required - shows will be fetched automatically)

# 4. Start the API server
uvicorn api.main:app --reload
```

### Production Considerations

- **Database Size**: Full Goose history (~1500 shows) = ~20MB database
- **API Load**: One-time bulk scrape uses ~1500 API requests over 30-60 minutes
- **On-Demand**: After bulk scrape, El Goose API is only called for new shows
- **Network**: Bulk scrape should run on server (not from user requests)
- **Monitoring**: Check logs during bulk scrape for any failed fetches

## Version History

- **2025-11-22**: Added bulk scraping and on-demand fetching strategies
  - `api/seed_from_elgoose.py`: Bulk population script
  - `api/services/show_fetcher.py`: On-demand fetcher module
  - Updated routes to support automatic population
  - Documented both approaches in policy
  - Added deployment instructions

- **2025-11-22**: Initial policy document created
  - Comprehensive documentation of El Goose API usage
  - Clear attribution and compliance standards
  - Contact information for concerns or inquiries

---

**This policy is offered in good faith to demonstrate responsible and transparent use of the El Goose API. The Honkingversion.runfoo.run team respects the work of the El Goose community and is committed to proper attribution and ethical API usage.**
