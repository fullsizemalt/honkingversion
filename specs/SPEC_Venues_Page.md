# UX Specification: Venues Landing Page

**Route**: `/venues`
**Status**: Needs Implementation
**Priority**: High - Core Navigation Hub
**Last Updated**: 2025-11-24

---

## User Needs & Goals

### Primary Users
1. **Venue Enthusiasts** - Fans interested in iconic concert locations
2. **Geographic Explorers** - Travelers visiting venues on tours
3. **History Buffs** - Researchers studying venue significance
4. **Show Planners** - Fans tracking which venues they've attended

### User Goals
- Browse all venues where band has performed
- Discover iconic and legendary venues
- Find venues by location (city, state, country)
- See show history for specific venues
- Track personal venue attendance
- Compare venues by show count and ratings

---

## Content Strategy

### Core Content Elements
1. **Venue Cards**:
   - Venue name
   - Location (city, state/province, country)
   - Venue photo
   - Show count (total shows at venue)
   - Date range (first show → last show)
   - Venue capacity
   - Venue type (arena, theater, amphitheater, etc.)
   - Average show rating
   - Notable shows badge
   - Personal attendance count (if authenticated)

2. **Venue Metadata**:
   - Full address
   - Venue capacity
   - Opening/closing dates
   - Venue type/category
   - Historical significance
   - Nickname/alternate names
   - Current status (active, closed, renamed)

3. **Venue Statistics**:
   - Total shows performed
   - First/last show dates
   - Most played songs at venue
   - Highest rated shows
   - Notable debuts/performances
   - Years active (for this band)
   - Show frequency (shows per year)

---

## Information Architecture

```
/venues
├── Hero Section
│   ├── "Venues"
│   ├── "Explore every stage [BAND] has played"
│   └── Venue count badge
│
├── Map View Toggle
│   ├── Switch between List and Map views
│   └── Interactive map with venue pins
│
├── Filter & Sort Bar
│   ├── Filter by:
│   │   ├── Country
│   │   ├── State/Province
│   │   ├── City
│   │   ├── Venue type (arena, theater, amphitheater, stadium, etc.)
│   │   ├── Show count (1 show, 5+ shows, 10+ shows, 50+ shows)
│   │   ├── Status (active, closed, renamed)
│   │   ├── Decade of activity
│   │   └── Attendance (attended, not attended)
│   ├── Sort by:
│   │   ├── Alphabetical (A-Z)
│   │   ├── Show count (most shows)
│   │   ├── Highest rated
│   │   ├── Recently played
│   │   ├── First played
│   │   └── Capacity (largest first)
│   └── View: List | Grid | Map
│
├── Venues Feed
│   ├── Venue cards (paginated or infinite scroll)
│   ├── Country/region dividers (optional)
│   ├── Loading skeletons
│   └── Jump-to-location navigation
│
└── Sidebar (desktop)
    ├── Venues at a Glance
    │   ├── Total venues
    │   ├── Countries visited
    │   ├── Most played venue
    │   └── Newest venue
    ├── Iconic Venues
    │   └── Curated legendary venues
    └── Quick Location Jump
        └── Country/state selector
```

---

## UI Components

### 1. VenueCard (Feed View)
```typescript
interface VenueCardProps {
  venue: {
    id: number;
    name: string;
    city: string;
    state?: string;
    country: string;
    show_count: number;
    first_show_date: string;
    last_show_date: string;
    venue_type: string;
    capacity?: number;
    average_rating: number;
    notable_shows_count: number;
    user_attendance_count?: number;
    image_url?: string;
    status: 'active' | 'closed' | 'renamed';
    nickname?: string;
  };
  onNavigate: () => void;
  viewMode: 'list' | 'grid' | 'map';
}
```

**Visual Design**:
- **List View**: Horizontal card with venue photo, name, location, stats
- **Grid View**: Vertical card with large venue photo, location overlay
- **Map View**: Map pins with popup cards on click

**Card Elements**:
- Venue photo
- Venue name (bold)
- Location (city, state, country)
- Show count badge
- Date range (first → last show)
- Venue type badge
- Capacity (if available)
- Average rating (star display)
- Notable shows indicator
- Personal attendance badge
- Status indicator (closed/renamed)
- Quick actions (view shows, get directions)

### 2. VenueFilters
```typescript
interface VenueFiltersProps {
  onFilterChange: (filters: VenueFilters) => void;
  onSortChange: (sort: VenueSortOption) => void;
  onViewChange: (view: 'list' | 'grid' | 'map') => void;
  activeFilters: VenueFilters;
  availableCountries: string[];
  availableStates: { [country: string]: string[] };
  availableCities: { [state: string]: string[] };
}

interface VenueFilters {
  country?: string;
  state?: string;
  city?: string;
  venueTypes: string[];
  showCountThreshold?: number;
  status?: ('active' | 'closed' | 'renamed')[];
  decade?: string[];
  attendanceStatus?: 'attended' | 'not_attended';
}

type VenueSortOption = 'alphabetical' | 'show_count' | 'highest_rated' | 'recently_played' | 'first_played' | 'capacity';
```

**Desktop Layout**: Horizontal filter bar below hero
**Mobile Layout**: Bottom sheet with filter chips

**Cascading Location Filters**:
- Select country → enables state filter
- Select state → enables city filter
- Breadcrumb trail showing selection path

### 3. VenueDetail (Full Page)
```typescript
interface VenueDetailProps {
  venue: FullVenue;
  shows: Show[];
  onShowClick: (showId: number) => void;
  onGetDirections: () => void;
}

interface FullVenue {
  id: number;
  name: string;
  nickname?: string;
  address: {
    street?: string;
    city: string;
    state?: string;
    postal_code?: string;
    country: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  venue_type: string;
  capacity?: number;
  opening_year?: number;
  closing_year?: number;
  status: 'active' | 'closed' | 'renamed';
  renamed_to?: string;
  description?: string;
  stats: {
    show_count: number;
    first_show_date: string;
    last_show_date: string;
    unique_songs: number;
    total_performances: number;
    average_show_rating: number;
    average_setlist_length: number;
    years_active: number[];
  };
  highlights: {
    debuts: Performance[];
    notable_shows: Show[];
    most_played: Performance[];
    highest_rated_shows: Show[];
  };
  shows: Show[];
  user_attendance?: {
    shows_attended: number;
    first_show?: Show;
    last_show?: Show;
  };
  images: string[];
  external_links?: {
    website?: string;
    maps_url?: string;
    wikipedia?: string;
  };
}
```

**Layout**:
- Hero section with venue photo and location
- Venue details (address, capacity, type)
- Embedded map with pin
- Statistics dashboard
- Highlights section (debuts, notable shows, most played)
- Shows list (chronological)
- Venue history/context
- User attendance summary (if authenticated)
- Related venues (same city, same type)

### 4. VenueMap (Map View)
```typescript
interface VenueMapProps {
  venues: VenueSummary[];
  onVenueClick: (venueId: number) => void;
  center?: { latitude: number; longitude: number };
  zoom?: number;
  selectedVenue?: number;
}
```

**Visual Design**:
- Interactive map (OpenStreetMap or similar)
- Venue markers (pins or circles)
- Pin size indicates show count
- Pin color indicates activity (active/closed)
- Cluster pins when zoomed out
- Click pin → venue popup card
- Popup card has quick stats + "View Full Page" link

**Map Features**:
- Search by location
- Zoom controls
- Fit all venues in view
- Focus on specific country/region
- Filter map pins by venue type
- Show venue density heatmap (optional)

### 5. VenueComparison (Optional Feature)
```typescript
interface VenueComparisonProps {
  venues: number[];
  onCompare: () => void;
}
```

**Features**:
- Select multiple venues to compare
- Side-by-side statistics
- Show count comparison
- Rating comparison
- Capacity comparison
- Show frequency comparison

---

## User Flows

### Flow 1: Browse Venues by Location
```
User arrives at /venues
  ↓
Sees all venues sorted by show count
  ↓
Filters by "United States"
  ↓
Further filters by "New York"
  ↓
Sees venues in New York state
  ↓
Clicks Madison Square Garden
  ↓
Views venue detail with show history
  ↓
Clicks specific show → navigates to show page
```

### Flow 2: Explore Venues on Map
```
User interested in geographic distribution
  ↓
Switches to Map view
  ↓
Sees venues as pins on map
  ↓
Zooms into specific region
  ↓
Clicks venue pin → popup appears
  ↓
Reviews quick stats in popup
  ↓
Clicks "View Full Page" → venue detail opens
```

### Flow 3: Track Venue Attendance
```
User authenticated, viewing /venues
  ↓
Filters by "Attended" to see visited venues
  ↓
Sees 12/347 venues attended
  ↓
Sorts by "Show Count" to find bucket list venues
  ↓
Identifies legendary venue never attended
  ↓
Opens venue detail
  ↓
Reviews upcoming shows at venue (if any)
  ↓
Marks venue as "want to visit"
```

### Flow 4: Discover Iconic Venues
```
User new to band history
  ↓
Views "Iconic Venues" sidebar section
  ↓
Clicks featured venue (e.g., Red Rocks)
  ↓
Reads venue description and significance
  ↓
Sees 37 shows performed at venue
  ↓
Filters shows by "Highest Rated"
  ↓
Finds legendary show at venue
  ↓
Adds show to listening queue
```

---

## States & Edge Cases

### Empty States
1. **No venues exist** (unlikely, data seeding issue):
   - "Venue data is being loaded"
   - Contact support message

2. **No venues match filters**:
   - "No venues match your criteria"
   - Show current filter selections
   - "Clear filters" button
   - Suggest broadening search

3. **User has no venue attendance** (authenticated):
   - "Start tracking your venue attendance"
   - Show all venues with "Mark shows attended" CTA

### Loading States
- Skeleton venue cards while loading
- Progressive image loading for venue photos
- "Loading more venues" on pagination
- Map loading with spinner
- Smooth transitions between view modes

### Error States
- Failed to load venues: Retry button with cached data
- Failed to load venue detail: Fallback to basic info
- Failed to load map: Fall back to list view
- Image load failure: Venue type icon placeholder
- Geocoding failure: Show address without map

### Special States
- **Venue closed**: "This venue closed in [YEAR]" badge
- **Venue renamed**: "Now known as [NEW NAME]" with link
- **Incomplete venue data**: Show available fields, note gaps
- **No coordinates**: Hide map, show address only
- **Private/unlisted venue**: Special indicator for house concerts, etc.

---

## Venue Categorization

### Venue Types
1. **Arena** - Large indoor venues (10,000-20,000 capacity)
2. **Stadium** - Outdoor mega-venues (20,000+ capacity)
3. **Amphitheater** - Outdoor venues with covered seating (5,000-20,000)
4. **Theater** - Smaller indoor venues (500-5,000 capacity)
5. **Club** - Intimate venues (<500 capacity)
6. **Festival Grounds** - Multi-stage festival venues
7. **Outdoor Park** - Parks, gardens, open spaces
8. **Special Event** - Unconventional venues (rooftops, boats, etc.)

### Venue Significance Levels
- **Legendary** - Iconic venues with rich history (50+ shows)
- **Frequent** - Regular tour stops (20-49 shows)
- **Occasional** - Multiple visits (5-19 shows)
- **Rare** - Few visits (2-4 shows)
- **One-Time** - Single show only

### Geographic Scope
- International venues by country
- US venues by state
- Canadian venues by province
- European venues by country
- Other regions as applicable

---

## Venue Statistics & Analytics

### Venue Metrics Displayed
1. **Activity Metrics**:
   - Total shows
   - First/last show dates
   - Years active
   - Average shows per year
   - Most recent show

2. **Musical Metrics**:
   - Unique songs performed
   - Average setlist length
   - Song debuts at venue
   - Venue-specific bust-outs
   - Most played songs

3. **Reception Metrics**:
   - Average show rating
   - Highest rated show
   - Total reviews written
   - Most discussed show

4. **Venue Info**:
   - Capacity
   - Venue type
   - Opening/closing dates
   - Status (active/closed)

---

## Performance Considerations

### Optimization
- Server-side rendering for venue list
- Lazy load venue photos
- Cached venue statistics (1 hour)
- Progressive image loading
- Debounced filter updates
- Prefetch venue details on hover
- Map tile caching
- Cluster markers for performance

### Accessibility
- Semantic HTML (article for venue cards)
- Keyboard navigation (tab through venues, map controls)
- ARIA labels for venue statistics
- High contrast venue markers on map
- Screen reader descriptions of locations
- Focus management in map popups
- Alternative text for venue photos

---

## Mobile Adaptations

### Mobile UX
- Single column venue cards
- Sticky filter chip bar
- Bottom sheet for filters
- Pull-to-refresh
- Full-screen map mode
- Simplified venue detail view
- Fixed "Jump to Top" button
- Tap-to-call venue (if phone available)

### Responsive Breakpoints
- **Mobile (<640px)**: Single column, compact cards
- **Tablet (640px-1024px)**: Two-column grid, medium cards
- **Desktop (>1024px)**: Three-column grid + sidebar OR list view

### Mobile-Specific Features
- Tap venue photo for gallery
- Native map app integration
- Share venue location
- Get directions (Apple Maps / Google Maps)
- Haptic feedback on venue selection

---

## Data Requirements

### API Endpoints

```typescript
GET /venues
  - Params: country, state, city, venue_type, show_count_min, status, decade, attended, sort, limit, offset
  - Returns: VenueList + pagination metadata
  - Response:
    {
      venues: VenueSummary[];
      pagination: { total: number; offset: number; limit: number };
      available_filters: {
        countries: string[];
        states: { [country: string]: string[] };
        cities: { [state: string]: string[] };
        venue_types: string[];
      };
    }

GET /venues/:id
  - Returns: Full venue with shows, stats, highlights
  - Response: FullVenue

GET /venues/:id/shows
  - Params: sort (chronological, rating), limit, offset
  - Returns: ShowList for specific venue

GET /venues/:id/highlights
  - Returns: Venue highlights (debuts, notable shows, most played)
  - Response:
    {
      debuts: Performance[];
      notable_shows: Show[];
      most_played: { song: string; count: number; performances: Performance[] }[];
      highest_rated_shows: Show[];
    }

GET /venues/map
  - Params: country, state, venue_type, show_count_min (same filters as list)
  - Returns: Simplified venue data with coordinates for map rendering
  - Response:
    {
      venues: {
        id: number;
        name: string;
        coordinates: { latitude: number; longitude: number };
        show_count: number;
        status: string;
      }[];
    }

GET /venues/stats/summary
  - Returns: Global venue statistics
  - Response:
    {
      total_venues: number;
      countries_count: number;
      most_played_venue: VenueSummary;
      newest_venue: VenueSummary;
      average_shows_per_venue: number;
    }

GET /venues/search
  - Params: query (venue name or location), limit
  - Returns: Matching venues
  - Response: VenueSummary[]
```

### Caching Strategy
- Venue list: 5min cache
- Individual venue: 10min cache
- Venue shows: 5min cache
- Venue stats: 1hr cache
- Global summary: 1hr cache
- Map data: 10min cache

---

## Venue Detail Page

### URL Structure
- `/venues/:venueId` - Full page venue detail
- `/venues/:venueId/shows` - Show list for venue
- `/venues/:venueId/stats` - Detailed venue statistics
- `/venues/:venueId/highlights` - Venue highlights focus

### Venue Detail Content Sections
1. **Hero Banner**:
   - Large venue photo
   - Venue name overlay
   - Location (city, state, country)
   - Show count badge

2. **Overview Section**:
   - Full address
   - Venue type, capacity
   - Opening/closing dates
   - Status (active/closed/renamed)
   - Embedded map with pin
   - "Get Directions" button
   - External links (website, Wikipedia)

3. **Statistics Dashboard**:
   - Visual charts for metrics
   - Show count over time
   - Song frequency at venue
   - Rating distribution

4. **Highlights Section**:
   - Notable shows carousel
   - Debuts at venue
   - Most played songs
   - Highest rated shows
   - Venue-specific moments

5. **Shows List**:
   - Chronological show list
   - Show cards with date, tour, rating
   - Filter/search within venue shows
   - Link to individual show pages

6. **Venue History**:
   - Historical context
   - Venue significance
   - Memorable moments
   - Community stories

7. **Photo Gallery**:
   - Venue exterior/interior photos
   - Show photos from venue
   - User-contributed photos (optional)

8. **Related Venues**:
   - Same city venues
   - Same venue type
   - Similar capacity
   - Nearby venues

---

## Search & Discovery

### Search Functionality
- Search venues by name
- Search by city/state/country
- Search by venue type
- Search nearby venues (location-based)

### Discovery Features
- **"Iconic Venues"**: Most historically significant
- **"Frequent Stops"**: Venues with most shows
- **"Your Venues"**: Based on attendance history
- **"Bucket List Venues"**: Legendary venues to visit
- **"Recently Played"**: Venues with recent shows
- **"Hidden Gems"**: Small venues with great shows

---

## Social & Engagement Features

### Venue Tracking
- Mark venues as "visited" or "bucket list"
- Track attendance percentage per venue
- Share venue visit stats
- Create venue visit badges
- Compare venue visits with friends

### Venue Discussions
- Venue-level comment threads
- Share venue memories
- Venue tips (parking, acoustics, etc.)
- Rate venue experience (separate from show rating)

### Venue Challenges
- "Visit 10 venues" challenge
- "Coast to coast" geography challenge
- "Venue type completionist" badge

---

## Success Metrics

### Engagement KPIs
- Venues viewed per session
- Average time on venues page
- Filter usage rate
- Map interaction rate
- Venue detail page visits
- Show navigation from venue pages
- "Get Directions" click rate

### Discovery KPIs
- Venues discovered via map
- Venues discovered via filters
- Shows discovered via venue pages
- Search usage rate

### Quality KPIs
- Venue data completeness
- User-contributed venue info
- Venue photo coverage

---

## Implementation Phases

### Phase 1 (MVP)
- Basic venue list with essential info
- Alphabetical and show count sorting
- Simple filters (country, venue type)
- Venue detail pages
- Show list per venue
- Grid and list views

### Phase 2 (Enhanced)
- Map view with interactive pins
- Advanced filters (location cascade, decade)
- Venue statistics dashboard
- Highlights section
- Venue search
- Personal attendance tracking
- Get directions integration

### Phase 3 (Community)
- Venue discussions
- Venue visit challenges
- Social attendance comparison
- User-contributed venue photos
- Venue ratings (venue experience)
- Venue tips and recommendations
- Nearby venue suggestions

---

## Open Questions for Architect

1. **Venue Data Source**: Where does venue data come from? User-submitted or scraped?
2. **Geocoding**: Do we have coordinates for all venues? How to handle missing data?
3. **Venue Merges**: How to handle venue name changes/rebranding?
4. **Private Venues**: Show private/house concert venues publicly?
5. **Venue Photos**: Where to source venue photos? User uploads or external APIs?
6. **Map Provider**: Which map service to use? OpenStreetMap, Google Maps, Mapbox?
7. **Venue Verification**: How to verify venue details and prevent duplicates?

---

**Next Steps**:
- Architect reviews specification
- Define venue data model
- Implement venue geocoding solution
- Design mockups for venue cards and detail pages
- Implement MVP (Phase 1)
- Aggregate venue data from existing show data
