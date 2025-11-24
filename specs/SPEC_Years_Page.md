# UX Specification: Years Landing Page

**Route**: `/years`
**Status**: Needs Implementation
**Priority**: High - Core Navigation Hub
**Last Updated**: 2025-11-24

---

## User Needs & Goals

### Primary Users
1. **Timeline Explorers** - Fans browsing band's history chronologically
2. **Era Researchers** - Analysts studying year-over-year evolution
3. **Anniversary Seekers** - Fans celebrating milestone years
4. **Completionists** - Collectors tracking shows by year

### User Goals
- Browse all active years in band's history
- Understand each year's significance and character
- Navigate to shows from specific years
- Compare years across decades
- Discover milestone years and anniversaries
- Track personal attendance by year

---

## Content Strategy

### Core Content Elements
1. **Year Cards**:
   - Year number (large, prominent)
   - Show count for that year
   - Unique venues visited
   - Tour(s) during that year
   - Notable events (debuts, farewells, milestones)
   - Average show rating
   - Representative photo/poster
   - Personal attendance count (if authenticated)

2. **Year Metadata**:
   - Total shows performed
   - Date range (first show → last show)
   - Tours during year
   - Cities/venues visited
   - Unique songs performed
   - Notable lineup changes
   - Historical context (band milestones, music releases)

3. **Year Statistics**:
   - Most played songs that year
   - Year-specific debuts
   - Final performances that year
   - Guest appearances
   - Average setlist length
   - Show frequency (shows per month)

---

## Information Architecture

```
/years
├── Hero Section
│   ├── "Years"
│   ├── "Explore [BAND]'s history year by year"
│   └── Year range badge (e.g., "1983-2024")
│
├── Filter & Sort Bar
│   ├── Filter by:
│   │   ├── Decade (1980s, 1990s, 2000s, etc.)
│   │   ├── Show count (active years: 10+ shows, 50+ shows, 100+ shows)
│   │   ├── Tour status (on tour, off tour)
│   │   ├── Milestones (debuts, lineup changes, anniversaries)
│   │   └── Attendance (attended shows, not attended)
│   ├── Sort by:
│   │   ├── Chronological (newest first)
│   │   ├── Chronological (oldest first)
│   │   ├── Show count (most shows)
│   │   ├── Highest rated
│   │   └── Most debuts
│   └── View: List | Grid | Timeline
│
├── Years Feed
│   ├── Year cards (all years visible or paginated)
│   ├── Decade dividers ("1990s" heading)
│   ├── Loading skeletons
│   └── Jump-to-decade navigation
│
└── Sidebar (desktop)
    ├── Years at a Glance
    │   ├── Total active years
    │   ├── Most active year
    │   ├── First/last show dates
    │   └── Current year stats (if active)
    ├── Milestone Years
    │   └── Featured anniversary years
    └── Year Timeline Minimap
        └── Visual representation with activity levels
```

---

## UI Components

### 1. YearCard (Feed View)
```typescript
interface YearCardProps {
  year: {
    year: number;
    show_count: number;
    first_show_date: string;
    last_show_date: string;
    venues_count: number;
    cities_count: number;
    tours: string[];
    average_rating: number;
    notable_events: string[];
    unique_songs_count: number;
    debuts_count: number;
    user_attendance_count?: number;
    representative_image_url?: string;
  };
  onNavigate: () => void;
  viewMode: 'list' | 'grid' | 'timeline';
}
```

**Visual Design**:
- **List View**: Horizontal card with year prominently displayed, stats in rows
- **Grid View**: Vertical card with large year number, key stats overlay
- **Timeline View**: Year positioned on horizontal timeline with activity indicator

**Card Elements**:
- Year number (extra large, bold)
- Show count badge
- Date range (first → last show)
- Tour names
- Notable events tags (debuts, milestones)
- Average rating (star display)
- Personal attendance indicator
- Representative photo (if available)
- Quick actions (view shows, view stats)

### 2. YearFilters
```typescript
interface YearFiltersProps {
  onFilterChange: (filters: YearFilters) => void;
  onSortChange: (sort: YearSortOption) => void;
  onViewChange: (view: 'list' | 'grid' | 'timeline') => void;
  activeFilters: YearFilters;
  availableDecades: string[];
}

interface YearFilters {
  decades: string[];
  showCountThreshold?: number;
  tourStatus?: 'on_tour' | 'off_tour';
  hasMilestones?: boolean;
  attendanceStatus?: 'attended' | 'not_attended';
}

type YearSortOption = 'newest' | 'oldest' | 'show_count' | 'highest_rated' | 'most_debuts';
```

**Desktop Layout**: Horizontal filter bar below hero
**Mobile Layout**: Bottom sheet with filter chips

### 3. YearDetail (Full Page)
```typescript
interface YearDetailProps {
  year: FullYear;
  shows: Show[];
  onShowClick: (showId: number) => void;
}

interface FullYear {
  year: number;
  show_count: number;
  first_show_date: string;
  last_show_date: string;
  description?: string;
  stats: {
    unique_songs: number;
    total_performances: number;
    venues_count: number;
    cities_count: number;
    countries_count: number;
    average_setlist_length: number;
    average_show_rating: number;
    shows_per_month: number;
  };
  tours: Tour[];
  highlights: {
    debuts: Performance[];
    final_performances: Performance[];
    most_played: Performance[];
    guests: string[];
    milestone_events: string[];
  };
  shows: Show[];
  user_attendance?: {
    shows_attended: number;
    first_show?: Show;
    last_show?: Show;
  };
  context: {
    band_milestones?: string[];
    album_releases?: string[];
    lineup_changes?: string[];
    historical_notes?: string[];
  };
}
```

**Layout**:
- Hero section with year number and key stats
- Timeline visualization (shows throughout the year)
- Tours during that year
- Statistics dashboard
- Highlights section (debuts, guests, most played)
- Shows list (chronological)
- Historical context section
- User attendance summary (if authenticated)

### 4. YearTimeline (Timeline View)
```typescript
interface YearTimelineProps {
  years: YearSummary[];
  onYearClick: (year: number) => void;
  highlightedDecades?: string[];
}
```

**Visual Design**:
- Horizontal timeline spanning all years
- Year markers with decade dividers
- Bar height indicates show count
- Color intensity shows activity level
- Interactive hover for quick stats
- Click to navigate to year detail

### 5. YearComparison (Optional Feature)
```typescript
interface YearComparisonProps {
  years: number[];
  onCompare: (year1: number, year2: number) => void;
}
```

**Features**:
- Select multiple years to compare
- Side-by-side statistics
- Show count comparison
- Setlist diversity comparison
- Notable events comparison

---

## User Flows

### Flow 1: Browse Years Chronologically
```
User arrives at /years
  ↓
Sees all years in reverse chronological order
  ↓
Scrolls through timeline view
  ↓
Notices particularly active year (100+ shows)
  ↓
Clicks year card → year detail page opens
  ↓
Reviews tours, highlights, and shows
  ↓
Clicks specific show → navigates to show detail
```

### Flow 2: Discover Milestone Years
```
User exploring band history
  ↓
Filters by "Milestone Years"
  ↓
Sees years with notable events highlighted
  ↓
Finds 10th anniversary year
  ↓
Opens year detail
  ↓
Reads historical context and band milestones
  ↓
Discovers special anniversary shows
  ↓
Adds shows to listening queue
```

### Flow 3: Track Personal Attendance by Year
```
User authenticated, viewing /years
  ↓
Sees years with attendance badges (15/47 shows)
  ↓
Sorts by "Most Shows" to find active years
  ↓
Identifies year with high attendance
  ↓
Opens year detail
  ↓
Reviews which shows attended vs. missed
  ↓
Shares year attendance stats on profile
```

### Flow 4: Research Era Evolution
```
Music researcher studying band evolution
  ↓
Switches to Timeline view
  ↓
Observes patterns (active years, quiet years)
  ↓
Filters by decade to focus analysis
  ↓
Opens several year details in tabs
  ↓
Compares setlist diversity and song debuts
  ↓
Notes stylistic shifts between eras
```

---

## States & Edge Cases

### Empty States
1. **No years exist** (unlikely, data seeding issue):
   - "Show data is being loaded"
   - Contact support message

2. **No years match filters**:
   - "No years match your criteria"
   - Show current filter selections
   - "Clear filters" button
   - Suggest broadening search

3. **User has no attendance in any year** (authenticated):
   - "Start tracking your show attendance"
   - Show all years with "Mark shows attended" CTA

### Loading States
- Skeleton year cards while loading
- Progressive image loading
- "Loading more years" on pagination
- Smooth transitions between view modes

### Error States
- Failed to load years: Retry button with cached data
- Failed to load year detail: Fallback to basic info
- Image load failure: Decade-themed placeholder

### Special States
- **Current year** (ongoing): Special "Current Year" badge, live updates
- **Inactive years** (no shows): Grayed out, note explaining hiatus
- **Partial year data**: Show available fields, note data gaps
- **Future years**: Not shown or marked as "Upcoming"

---

## Year Categorization

### Activity Levels
1. **Very Active** (100+ shows) - Major touring year
2. **Active** (50-99 shows) - Standard touring year
3. **Moderate** (10-49 shows) - Limited touring, selective dates
4. **Light** (1-9 shows) - Sparse activity, special events only
5. **Inactive** (0 shows) - Hiatus year, no performances

### Milestone Types
- **Formation Years** - Band inception, first shows
- **Anniversary Years** - 10th, 20th, 25th, etc.
- **Breakthrough Years** - Major commercial/critical success
- **Transition Years** - Lineup changes, stylistic shifts
- **Final Tours** - Farewell tours, retirement years
- **Reunion Years** - Return after hiatus

---

## Year Statistics & Analytics

### Year Metrics Displayed
1. **Activity Metrics**:
   - Total shows
   - Shows per month (average)
   - Active months
   - Tours during year
   - Geographic reach

2. **Musical Metrics**:
   - Unique songs performed
   - Average setlist length
   - Song debuts count
   - Final performances count
   - Guest appearances count

3. **Reception Metrics**:
   - Average show rating
   - Total reviews written
   - Most discussed show
   - Highest rated show

4. **Touring Metrics**:
   - Cities visited
   - Venues visited
   - Countries visited
   - Miles traveled (if calculable)

---

## Performance Considerations

### Optimization
- Server-side rendering for year list
- Lazy load year images
- Cached year statistics (1 hour)
- Progressive image loading
- Debounced filter updates
- Prefetch year details on hover
- Virtual scrolling for timeline view

### Accessibility
- Semantic HTML (article for year cards)
- Keyboard navigation (arrow keys in timeline, tab through years)
- ARIA labels for year statistics
- High contrast year numbers
- Screen reader descriptions of activity levels
- Focus management in modals

---

## Mobile Adaptations

### Mobile UX
- Single column year cards
- Sticky filter chip bar
- Swipeable year cards (optional)
- Pull-to-refresh
- Bottom sheet for filters
- Simplified year detail view
- Fixed "Jump to Current Year" button

### Responsive Breakpoints
- **Mobile (<640px)**: Single column, compact cards
- **Tablet (640px-1024px)**: Two-column grid, medium cards
- **Desktop (>1024px)**: Three-column grid + sidebar OR list view

### Mobile-Specific Features
- Tap year for quick preview
- Swipe left/right to navigate years
- Haptic feedback on year selection
- Native share sheet for year links

---

## Data Requirements

### API Endpoints

```typescript
GET /years
  - Params: decade, show_count_min, has_milestones, attended, sort, limit, offset
  - Returns: YearList + metadata
  - Response:
    {
      years: YearSummary[];
      pagination: { total: number; offset: number; limit: number };
      available_filters: {
        decades: string[];
        activity_levels: string[];
      };
      date_range: { first_year: number; last_year: number };
    }

GET /years/:year
  - Returns: Full year with shows, stats, highlights, context
  - Response: FullYear

GET /years/:year/shows
  - Params: sort (chronological, rating), limit, offset
  - Returns: ShowList for specific year

GET /years/:year/highlights
  - Returns: Year highlights (debuts, guests, most played)
  - Response:
    {
      debuts: Performance[];
      final_performances: Performance[];
      guests: { name: string; shows: Show[] }[];
      most_played: { song: string; count: number; performances: Performance[] }[];
      milestone_events: string[];
    }

GET /years/:year/tours
  - Returns: Tours active during that year
  - Response: Tour[]

GET /years/stats/summary
  - Returns: Global year statistics
  - Response:
    {
      total_years: number;
      active_years: number;
      most_active_year: { year: number; show_count: number };
      total_shows: number;
      average_shows_per_year: number;
    }

GET /years/compare
  - Params: years[] (array of years to compare)
  - Returns: Comparison data for selected years
  - Response:
    {
      years: FullYear[];
      comparison_metrics: {
        show_counts: number[];
        unique_songs: number[];
        debuts: number[];
        average_ratings: number[];
      };
    }
```

### Caching Strategy
- Year list: 5min cache
- Individual year: 10min cache
- Year shows: 5min cache
- Year stats: 1hr cache
- Global summary: 1hr cache
- Current year: 30s cache (live updates)

---

## Year Detail Page

### URL Structure
- `/years/:year` - Full page year detail
- `/years/:year/shows` - Show list for year
- `/years/:year/stats` - Detailed year statistics
- `/years/:year/highlights` - Year highlights focus

### Year Detail Content Sections
1. **Hero Banner**:
   - Large year number
   - Date range (first → last show)
   - Show count badge
   - Activity level indicator

2. **Overview Section**:
   - Year description/context
   - Key facts (tours, geography, show count)
   - User attendance summary (if authenticated)

3. **Timeline Visualization**:
   - Monthly show distribution
   - Interactive calendar view
   - Tour segments highlighted
   - Click dates to view shows

4. **Statistics Dashboard**:
   - Visual charts for metrics
   - Song frequency distribution
   - Geographic map of year's shows
   - Month-over-month activity

5. **Highlights Section**:
   - Carousel of notable moments
   - Debuts and final performances
   - Guest appearances
   - Most played songs
   - Highest rated shows

6. **Tours Section**:
   - List of tours during year
   - Tour date ranges within year
   - Link to tour detail pages

7. **Shows List**:
   - Chronological show list
   - Show cards with date, venue, rating
   - Filter/search within year
   - Link to individual show pages

8. **Historical Context**:
   - Band milestones that year
   - Album releases
   - Lineup changes
   - Cultural/historical context

9. **Related Years**:
   - Previous/next year navigation
   - Similar activity level years
   - Same decade years

---

## Search & Discovery

### Search Functionality
- Search by year number
- Search by date range
- Search by event (album release, lineup change)
- Search by tour (years when tour was active)

### Discovery Features
- **"Your Active Years"**: Years with highest personal attendance
- **"Milestone Years"**: Anniversary and breakthrough years
- **"Most Active Years"**: Years with most shows
- **"Hidden Gems"**: Underrated years with high ratings
- **"Complete the Year"**: Years where user attended some shows

---

## Social & Engagement Features

### Year Tracking
- Mark years as "favorite"
- Track attendance percentage per year
- Share year attendance stats
- Create year attendance badges
- Compare years with friends

### Year Discussions
- Year-level comment threads
- Share favorite year memories
- Tag friends who attended shows that year
- Compare attendance statistics

### Year Challenges
- "Complete the year" challenge
- "Decade completionist" badge
- "Era expert" achievements

---

## Success Metrics

### Engagement KPIs
- Years viewed per session
- Average time on years page
- Filter usage rate
- Year detail page visits
- Show navigation from year pages
- Personal attendance tracking usage

### Discovery KPIs
- Years discovered via filters
- Shows discovered via year pages
- Tours discovered via year pages
- Conversion to show/tour views

### Quality KPIs
- Year data completeness
- User engagement with historical context
- Year comparison feature usage

---

## Implementation Phases

### Phase 1 (MVP)
- Basic year list with essential info
- Chronological display
- Simple filters (decade)
- Year detail pages
- Show list per year
- Grid and list views

### Phase 2 (Enhanced)
- Timeline view with activity levels
- Advanced filters (activity level, milestones)
- Year statistics dashboard
- Highlights section
- Historical context
- Personal attendance tracking

### Phase 3 (Community)
- Year comparison tool
- Year discussions
- Year tracking challenges
- Social attendance comparison
- Interactive calendar view
- Year-over-year trend analysis

---

## Open Questions for Architect

1. **Year Range**: What's the earliest year with show data? Latest?
2. **Inactive Years**: How to handle years with no shows? Display or hide?
3. **Current Year**: How often to update current year stats? Real-time?
4. **Historical Context**: Where does context data come from? Editor-curated?
5. **Year Boundaries**: Calendar year (Jan-Dec) or band's touring season?
6. **Comparison Limits**: Max number of years to compare at once?
7. **Data Completeness**: How to indicate partial year data?

---

**Next Steps**:
- Architect reviews specification
- Define year data model and aggregation logic
- Design mockups for year cards and detail pages
- Implement MVP (Phase 1)
- Aggregate year statistics from existing show data
