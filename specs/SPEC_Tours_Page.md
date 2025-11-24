# UX Specification: Tours Landing Page

**Route**: `/tours`
**Status**: Needs Implementation
**Priority**: High - Core Navigation Hub
**Last Updated**: 2025-11-24

---

## User Needs & Goals

### Primary Users
1. **Tour Historians** - Fans studying touring patterns and evolution
2. **Show Collectors** - Completionists tracking attendance by tour
3. **Era Explorers** - Listeners discovering distinct musical periods
4. **Setlist Analysts** - Researchers comparing tour setlists

### User Goals
- Browse all tours chronologically or by significance
- Understand each tour's character and highlights
- Navigate to specific shows within tours
- Compare tours across eras
- Discover tours matching specific criteria
- Track personal attendance by tour

---

## Content Strategy

### Core Content Elements
1. **Tour Cards**:
   - Tour name/identifier
   - Year/date range
   - Number of shows
   - Geographic scope (venues, cities, countries)
   - Era/band lineup
   - Tour poster/visual (if available)
   - Notable features (debuts, bust-outs, guests)
   - Average show rating
   - Personal attendance count (if authenticated)

2. **Tour Metadata**:
   - Start/end dates
   - Total shows performed
   - Cities/venues visited
   - Unique songs performed
   - Average setlist length
   - Special characteristics (acoustic sets, themed shows)
   - Tour legs/phases

3. **Tour Statistics**:
   - Most played songs
   - Rarest performances
   - Guest appearances
   - Tour-specific debuts
   - Final performances on tour

---

## Information Architecture

```
/tours
├── Hero Section
│   ├── "Concert Tours"
│   ├── "Explore every tour from [BAND] history"
│   └── Tour count badge
│
├── Filter & Sort Bar
│   ├── Filter by:
│   │   ├── Decade (1980s, 1990s, 2000s, etc.)
│   │   ├── Era (classic lineup, modern era, etc.)
│   │   ├── Tour type (stadium, theater, festival, acoustic)
│   │   ├── Geographic scope (US, Europe, World)
│   │   └── Attendance (attended, not attended)
│   ├── Sort by:
│   │   ├── Chronological (newest first)
│   │   ├── Chronological (oldest first)
│   │   ├── Show count (most shows)
│   │   ├── Highest rated
│   │   └── Alphabetical
│   └── View: List | Grid | Timeline
│
├── Tours Feed
│   ├── Tour cards (paginated or infinite scroll)
│   ├── Era dividers ("1990s" heading between decades)
│   ├── Loading skeletons
│   └── Jump-to-decade navigation
│
└── Sidebar (desktop)
    ├── Tours at a Glance
    │   ├── Total tours
    │   ├── Total shows
    │   ├── Most active year
    │   └── Longest tour
    ├── Featured Tours
    │   └── Curated highlights
    └── Tour Timeline Minimap
        └── Visual decade overview
```

---

## UI Components

### 1. TourCard (Feed View)
```typescript
interface TourCardProps {
  tour: {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    show_count: number;
    cities_count: number;
    countries_count: number;
    average_rating: number;
    poster_url?: string;
    era?: string;
    notable_features: string[];
    unique_songs_count: number;
    user_attendance_count?: number;
  };
  onNavigate: () => void;
  onTrack?: () => void;
  viewMode: 'list' | 'grid' | 'timeline';
}
```

**Visual Design**:
- **List View**: Horizontal card with poster thumbnail, details, and stats
- **Grid View**: Vertical card with large poster, essential info overlay
- **Timeline View**: Chronological positioning with year markers

**Card Elements**:
- Tour poster or era-themed visual
- Tour name (bold, prominent)
- Date range badge
- Show count and geography badges
- Average rating (star display)
- Notable features tags (debuts, guests, themes)
- Personal attendance indicator (if authenticated)
- Quick actions (view shows, track tour)

### 2. TourFilters
```typescript
interface TourFiltersProps {
  onFilterChange: (filters: TourFilters) => void;
  onSortChange: (sort: TourSortOption) => void;
  onViewChange: (view: 'list' | 'grid' | 'timeline') => void;
  activeFilters: TourFilters;
  availableDecades: string[];
  availableEras: string[];
}

interface TourFilters {
  decades: string[];
  eras: string[];
  tourTypes: ('stadium' | 'theater' | 'festival' | 'acoustic')[];
  geography: ('us' | 'europe' | 'world')[];
  attendanceStatus?: 'attended' | 'not_attended';
}

type TourSortOption = 'newest' | 'oldest' | 'show_count' | 'highest_rated' | 'alphabetical';
```

**Desktop Layout**: Horizontal filter bar below hero
**Mobile Layout**: Bottom sheet with filter chips

### 3. TourDetail (Modal/Page)
```typescript
interface TourDetailProps {
  tour: FullTour;
  shows: Show[];
  onShowClick: (showId: number) => void;
  onTrackTour: () => void;
}

interface FullTour {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  description?: string;
  show_count: number;
  stats: {
    unique_songs: number;
    total_performances: number;
    cities_count: number;
    countries_count: number;
    average_setlist_length: number;
    average_show_rating: number;
  };
  highlights: {
    debuts: Performance[];
    bust_outs: Performance[];
    guests: string[];
    most_played: Performance[];
  };
  shows: Show[];
  user_attendance?: {
    shows_attended: number;
    first_show?: Show;
    last_show?: Show;
  };
}
```

**Layout**:
- Hero section with tour poster and key stats
- Tour description/context
- Statistics dashboard
- Highlights section (debuts, guests, most played)
- Shows list (chronological)
- User attendance summary (if authenticated)

### 4. TourTimeline (Timeline View)
```typescript
interface TourTimelineProps {
  tours: Tour[];
  onTourClick: (tourId: number) => void;
  highlightedDecades?: string[];
}
```

**Visual Design**:
- Horizontal timeline with decade markers
- Tour bubbles positioned by date
- Bubble size indicates show count
- Color coding by era or tour type
- Interactive hover for quick info
- Click to expand tour details

---

## User Flows

### Flow 1: Browse Tours by Era
```
User arrives at /tours
  ↓
Sees chronological tour list (newest first)
  ↓
Filters by "1990s" decade
  ↓
Switches to Timeline view
  ↓
Hovers over tour bubble → quick stats popup
  ↓
Clicks tour → tour detail modal opens
  ↓
Reviews highlights and show count
  ↓
Clicks "View All Shows" → navigates to tour's shows
```

### Flow 2: Track Personal Tour Attendance
```
User authenticated, viewing /tours
  ↓
Sees tours with attendance badges (3/15 shows)
  ↓
Filters by "Not Attended" to discover gaps
  ↓
Finds tour never attended
  ↓
Opens tour detail
  ↓
Reviews show dates and venues
  ↓
Marks interest in attending future similar tour
```

### Flow 3: Compare Tours
```
User researching band's evolution
  ↓
Switches to Grid view
  ↓
Opens two tour details in separate tabs
  ↓
Compares stats (show count, setlist diversity, ratings)
  ↓
Notes differences in era characteristics
  ↓
Navigates to specific shows for deeper comparison
```

### Flow 4: Discover Significant Tours
```
User new to band's history
  ↓
Sorts by "Highest Rated"
  ↓
Sees featured tours section (editor picks)
  ↓
Reads tour descriptions highlighting significance
  ↓
Clicks tour with highest average rating
  ↓
Identifies highly-rated shows within tour
  ↓
Adds shows to listening queue
```

---

## States & Edge Cases

### Empty States
1. **No tours exist** (unlikely, data seeding issue):
   - "Tour data is being loaded"
   - Contact support message

2. **No tours match filters**:
   - "No tours match your criteria"
   - Show current filter selections
   - "Clear filters" button
   - Suggest broadening search

3. **User has no tour attendance** (authenticated):
   - "Start tracking your tour attendance"
   - Show all tours with "Mark shows attended" CTA

### Loading States
- Skeleton tour cards while loading
- Progressive image loading for posters
- "Loading more tours" on pagination
- Smooth transitions between view modes

### Error States
- Failed to load tours: Retry button with cached data
- Failed to load tour detail: Fallback to basic info
- Image load failure: Era-themed placeholder

### Special States
- **Incomplete tour data**: Show available fields, note gaps
- **Active/ongoing tour**: Special "Current Tour" badge
- **Cancelled/postponed tour**: Status indicator with explanation
- **Multi-leg tour**: Expandable sections per leg

---

## Tour Categorization

### Tour Types
1. **Stadium Tours** - Large outdoor venues, extensive production
2. **Theater Tours** - Intimate venues, acoustic-focused
3. **Festival Circuits** - Multi-band events, limited shows
4. **Residencies** - Extended runs in single venue
5. **Special Event Tours** - Anniversary, reunion, tribute tours

### Tour Eras (Band-Specific)
- Define based on band lineup changes
- Musical style shifts
- Significant career milestones
- Example: "Classic Era (1983-1995)", "Modern Era (2009-Present)"

### Geographic Scope
- **Regional**: Single country or region
- **National**: Multi-state/province tours
- **International**: Multiple countries
- **World Tour**: Global reach across continents

---

## Tour Statistics & Analytics

### Tour Metrics Displayed
1. **Scale Metrics**:
   - Total shows
   - Total cities/venues
   - Countries visited
   - Date span

2. **Musical Metrics**:
   - Unique songs performed
   - Average setlist length
   - Song debuts count
   - Bust-outs count
   - Guest appearances count

3. **Reception Metrics**:
   - Average show rating (community)
   - Total reviews written
   - Most discussed show
   - Highest rated show

4. **Rarity Metrics**:
   - Tour-exclusive songs
   - One-time performances
   - Rarity score (based on performance distribution)

---

## Performance Considerations

### Optimization
- Server-side rendering for initial tour list
- Lazy load tour posters
- Virtual scrolling for large tour lists
- Cached tour statistics (1 hour)
- Progressive image loading
- Debounced filter updates
- Prefetch tour details on hover

### Accessibility
- Semantic HTML (article for tour cards)
- Keyboard navigation (tab through tours, arrow keys in timeline)
- ARIA labels for tour statistics
- High contrast poster overlays
- Screen reader descriptions of tour scope
- Focus management in modals

---

## Mobile Adaptations

### Mobile UX
- Single column tour cards
- Sticky filter chip bar
- Swipeable tour cards (optional)
- Pull-to-refresh
- Bottom sheet for filters
- Simplified tour detail view
- Fixed "Jump to Top" button

### Responsive Breakpoints
- **Mobile (<640px)**: Single column, compact cards
- **Tablet (640px-1024px)**: Two-column grid, medium cards
- **Desktop (>1024px)**: Three-column grid + sidebar OR list view

### Mobile-Specific Features
- Tap poster for quick preview
- Swipe left/right to navigate decades
- Haptic feedback on tour selection
- Native share sheet for tour links

---

## Data Requirements

### API Endpoints

```typescript
GET /tours
  - Params: decade, era, tour_type, geography, attended, sort, limit, offset
  - Returns: TourList + pagination metadata
  - Response:
    {
      tours: Tour[];
      pagination: { total: number; offset: number; limit: number };
      available_filters: {
        decades: string[];
        eras: string[];
        tour_types: string[];
      };
    }

GET /tours/:id
  - Returns: Full tour with shows, stats, highlights
  - Response: FullTour

GET /tours/:id/shows
  - Params: sort (chronological, rating), limit, offset
  - Returns: ShowList for specific tour

GET /tours/:id/highlights
  - Returns: Tour highlights (debuts, guests, most played)
  - Response:
    {
      debuts: Performance[];
      bust_outs: Performance[];
      guests: { name: string; shows: Show[] }[];
      most_played: { song: string; count: number; performances: Performance[] }[];
    }

GET /tours/stats/summary
  - Returns: Global tour statistics
  - Response:
    {
      total_tours: number;
      total_shows: number;
      most_active_year: { year: number; tour_count: number };
      longest_tour: Tour;
      average_tour_length: number;
    }
```

### Caching Strategy
- Tour list: 5min cache
- Individual tour: 10min cache
- Tour shows: 5min cache
- Tour stats: 1hr cache
- Global summary: 1hr cache

---

## Tour Detail Page

### URL Structure
- `/tours/:tourId` - Full page tour detail
- `/tours/:tourId/shows` - Show list for tour
- `/tours/:tourId/stats` - Detailed tour statistics

### Tour Detail Content Sections
1. **Hero Banner**:
   - Tour poster (full width)
   - Tour name overlay
   - Date range and show count

2. **Overview Section**:
   - Tour description/context
   - Key facts (start/end, geography, show count)
   - User attendance summary (if authenticated)

3. **Statistics Dashboard**:
   - Visual charts for metrics
   - Song frequency distribution
   - Geographic map of tour stops
   - Rating trends over tour dates

4. **Highlights Section**:
   - Carousel of notable moments
   - Debuts, bust-outs, guests
   - Most played songs
   - Highest rated shows

5. **Shows List**:
   - Chronological show list
   - Show cards with date, venue, rating
   - Filter/search within tour shows
   - Link to individual show pages

6. **Related Tours**:
   - Same era tours
   - Similar tour types
   - Previous/next tours chronologically

---

## Search & Discovery

### Search Functionality
- Search tours by name
- Search by year range
- Search by venue/city
- Search by song (tours where song was played)

### Discovery Features
- **"Tours for You"**: Based on attendance history
- **"Highest Rated Tours"**: Community favorites
- **"Complete a Tour"**: Tours where user attended some shows
- **"Era Explorer"**: Guided tour through band's history

---

## Social & Engagement Features

### Tour Tracking
- Mark tours as "attended" or "interested"
- Track attendance percentage per tour
- Share tour attendance stats
- Create tour attendance badges

### Tour Discussions
- Tour-level comment threads
- Share favorite tour memories
- Tag friends who attended tour
- Compare attendance with friends

### Tour Challenges
- "Complete the tour" challenge (attend all shows)
- "Era completionist" badge
- "Tour historian" achievements

---

## Success Metrics

### Engagement KPIs
- Tours viewed per session
- Average time on tours page
- Filter usage rate
- Tour detail page visits
- Show navigation from tour pages
- Personal attendance tracking usage

### Discovery KPIs
- Tours discovered via search
- Tours discovered via filters
- Shows discovered via tour pages
- Conversion to show page views

### Quality KPIs
- Tour data completeness
- User-contributed tour information
- Tour description quality ratings

---

## Implementation Phases

### Phase 1 (MVP)
- Basic tour list with essential info
- Chronological display
- Simple filters (decade, era)
- Tour detail pages
- Show list per tour
- Grid and list views

### Phase 2 (Enhanced)
- Timeline view
- Advanced filters (tour type, geography)
- Tour statistics dashboard
- Highlights section
- Tour search
- Personal attendance tracking

### Phase 3 (Community)
- Tour discussions
- Tour tracking challenges
- Social attendance comparison
- User-contributed tour descriptions
- Tour photo galleries
- Tour setlist patterns analysis

---

## Open Questions for Architect

1. **Tour Data Structure**: How are tours defined? By official tour names or date ranges?
2. **Tour Naming**: Official names vs. community names vs. date ranges?
3. **Tour Legs**: Should multi-leg tours be treated as one tour or multiple?
4. **Attendance Verification**: How to verify tour attendance (vs. individual shows)?
5. **Tour Descriptions**: User-generated or editor-curated?
6. **Tour Posters**: Where to source poster images? User uploads?
7. **Historical Data**: How far back does tour data go? Completeness?

---

**Next Steps**:
- Architect reviews specification
- Define tour data model
- Design mockups for tour cards and detail pages
- Implement MVP (Phase 1)
- Seed tour data from existing show data
