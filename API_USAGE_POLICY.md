# API Usage Policy - Honkingversion.net

**Last Updated**: November 22, 2025
**Status**: Active
**Scope**: El Goose API Integration

---

## Overview

Honkingversion.net is a fan site dedicated to the band Goose. This project uses the **El Goose API** as its primary data source for setlist information, performance history, and venue data.

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
Frontend → Next.js API Routes → El Goose API
```

- All API calls are made from the server (not from client browsers)
- Reduces exposure of direct external API calls
- Allows for caching and rate control

### Code Location
- **Client**: `/web/src/services/elgoose.py` (API client)
- **Routes**: `/api/routes/shows.py` (endpoint handlers)
- **Components**: Uses data from `/api/shows` endpoints

### Caching Strategy
- Server-side responses use `cache: 'no-store'` for dynamic data
- No aggressive or redundant API calls
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
- ❌ **No**: Automated mass scraping
- ❌ **No**: Data harvesting for external distribution
- ❌ **No**: Caching data for long-term offline use without attribution
- ✅ **Yes**: Displaying data with proper attribution
- ✅ **Yes**: Linking to original sources

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
Honkingversion.net operates under the reasonable assumption that:
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
- Public Attribution Page: https://honkingversion.net/attribution

---

## Related Documents

- [Attribution Page](./web/src/app/attribution/page.tsx) - User-facing attribution
- [El Goose Service](./api/services/elgoose.py) - Implementation details
- [Footer Component](./web/src/components/Footer.tsx) - Footer attribution
- [El Goose Official Site](https://elgoose.net) - Original source

---

## Version History

- **2025-11-22**: Initial policy document created
  - Comprehensive documentation of El Goose API usage
  - Clear attribution and compliance standards
  - Contact information for concerns or inquiries

---

**This policy is offered in good faith to demonstrate responsible and transparent use of the El Goose API. The Honkingversion.net team respects the work of the El Goose community and is committed to proper attribution and ethical API usage.**
