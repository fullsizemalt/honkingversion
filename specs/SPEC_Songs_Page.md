# UX Specification: Songs Landing Page

**Route**: `/songs`
**Status**: Needs Implementation
**Priority**: High - Core Navigation Hub
**Last Updated**: 2025-11-24

---

## User Needs & Goals

### Primary Users
1. **Song Enthusiasts** - Fans tracking favorite songs across performances
2. **Setlist Analysts** - Researchers studying song performance patterns
3. **Rarity Hunters** - Collectors seeking rare song performances
4. **Music Historians** - Analysts studying song evolution over time

### User Goals
- Browse entire song catalog
- Discover rare and frequently played songs
- Track performance history for specific songs
- Compare song statistics and ratings
- Find best performances of favorite songs
- Discover songs never heard before

---

## Content Strategy

### Core Content Elements
1. **Song Cards**:
   - Song name
   - Artist/composer (if cover)
   - Times played (performance count)
   - First/last performance dates
   - Performance frequency indicator
   - Average rating across performances
   - Rarity score
   - Notable performances count
   - Song tags (original, cover, debut, retired, etc.)
   - Personal tracking (heard/not heard)

2. **Song Metadata**:
   - Original artist (if cover)
   - Album appearance
   - Song debut date
   - Last played date (if retired)
   - Performance count
   - Performance frequency (% of shows)
   - Song duration (typical)
   - Musical key
   - Song themes/tags

3. **Song Statistics**:
   - Total performances
   - Performance frequency trend
   - Years active
   - Average rating
   - Highest rated performance
   - Most recent performance
   - Rarity score
   - Debut/bust-out context

---

## Information Architecture

```
/songs
├── Hero Section
│   ├── "Songs"
│   ├── "Explore [BAND]'s complete catalog"
│   └── Song count badge
│
├── Filter & Sort Bar
│   ├── Filter by:
│   │   ├── Frequency (common, occasional, rare, very rare, one-time)
│   │   ├── Type (original, cover, tease, jam)
│   │   ├── Era (by decade or tour)
│   │   ├── Status (active, retired, debut recent)
│   │   ├── Album (if applicable)
│   │   ├── Rating (4+ stars only, etc.)
│   │   └── Personal (heard, not heard)
│   ├── Sort by:
│   │   ├── Alphabetical (A-Z)
│   │   ├── Times played (most to least)
│   │   ├── Highest rated
│   │   ├── Rarest first
│   │   ├── Recently played
│   │   ├── Recently debuted
│   │   └── Longest gap since played
│   └── View: List | Grid | Stats Table
│
├── Songs Feed
│   ├── Song cards (paginated or infinite scroll)
│   ├── Alphabet jump navigation (A, B, C...)
│   ├── Loading skeletons
│   └── Quick search bar
│
└── Sidebar (desktop)
    ├── Songs at a Glance
    │   ├── Total songs
    │   ├── Active songs
    │   ├── Retired songs
    │   ├── Covers vs. originals
    │   └── Most played song
    ├── Featured Songs
    │   ├── Recent debuts
    │   ├── Recent bust-outs
    │   └── Trending songs
    └── Rarity Distribution
        └── Chart showing frequency tiers
```

---

## UI Components

### 1. SongCard (Feed View)
```typescript
interface SongCardProps {
  song: {
    id: number;
    name: string;
    artist?: string;
    is_cover: boolean;
    times_played: number;
    first_performance_date: string;
    last_performance_date: string;
    average_rating: number;
    rarity_score: number;
    frequency_percentage: number;
    status: 'active' | 'retired';
    notable_performances_count: number;
    tags: string[];
    user_heard?: boolean;
  };
  onNavigate: () => void;
  onToggleHeard?: () => void;
  viewMode: 'list' | 'grid' | 'table';
}
```

**Visual Design**:
- **List View**: Horizontal card with song name, stats, and badges
- **Grid View**: Vertical card with song name prominently displayed
- **Table View**: Spreadsheet-style row with sortable columns

**Card Elements**:
- Song name (bold, large)
- Artist (if cover, smaller text)
- Times played badge
- Rarity indicator (color-coded)
- Frequency percentage
- Average rating (star display)
- Status badge (active/retired)
- Date range (first → last)
- Notable performances count
- Personal tracking checkbox
- Quick actions (view performances, stats)

### 2. SongFilters
```typescript
interface SongFiltersProps {
  onFilterChange: (filters: SongFilters) => void;
  onSortChange: (sort: SongSortOption) => void;
  onViewChange: (view: 'list' | 'grid' | 'table') => void;
  activeFilters: SongFilters;
  availableDecades: string[];
  availableAlbums: string[];
}

interface SongFilters {
  frequencyTiers: ('common' | 'occasional' | 'rare' | 'very_rare' | 'one_time')[];
  songTypes: ('original' | 'cover' | 'tease' | 'jam')[];
  eras: string[];
  status: ('active' | 'retired')[];
  albums: string[];
  minRating?: number;
  heardStatus?: 'heard' | 'not_heard';
}

type SongSortOption = 'alphabetical' | 'times_played' | 'highest_rated' | 'rarest' | 'recently_played' | 'recently_debuted' | 'longest_gap';
```

**Desktop Layout**: Horizontal filter bar below hero
**Mobile Layout**: Bottom sheet with filter chips

**Frequency Tiers Definition**:
- **Common**: Played in >50% of shows
- **Occasional**: Played in 10-50% of shows
- **Rare**: Played in 1-10% of shows
- **Very Rare**: Played in <1% of shows
- **One-Time**: Played exactly once

### 3. SongDetail (Full Page)
```typescript
interface SongDetailProps {
  song: FullSong;
  performances: Performance[];
  onPerformanceClick: (performanceId: number) => void;
}

interface FullSong {
  id: number;
  name: string;
  artist?: string;
  is_cover: boolean;
  album?: string;
  description?: string;
  times_played: number;
  first_performance_date: string;
  last_performance_date: string;
  stats: {
    average_rating: number;
    highest_rated_performance: Performance;
    frequency_percentage: number;
    rarity_score: number;
    total_minutes_played: number;
    average_duration: number;
    years_active: number[];
    tours_played: string[];
  };
  trends: {
    frequency_over_time: { year: number; count: number }[];
    rating_over_time: { year: number; average: number }[];
    gap_analysis: {
      longest_gap_days: number;
      current_gap_days: number;
      average_gap_days: number;
    };
  };
  performances: Performance[];
  notable_performances: Performance[];
  context: {
    debut_context?: string;
    retirement_context?: string;
    historical_notes?: string[];
  };
  related_songs: Song[];
  user_tracking?: {
    times_heard: number;
    favorite: boolean;
    notes?: string;
  };
}
```

**Layout**:
- Hero section with song name and key stats
- Performance frequency chart (over time)
- Statistics dashboard
- Notable performances section
- Full performance history (chronological)
- Gap analysis (time between performances)
- Related songs
- User tracking/notes (if authenticated)

### 4. SongStatsTable (Table View)
```typescript
interface SongStatsTableProps {
  songs: SongSummary[];
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
  onRowClick: (songId: number) => void;
}
```

**Columns**:
- Song name
- Artist (if cover)
- Times played
- First played
- Last played
- Frequency %
- Avg rating
- Rarity score
- Status

**Features**:
- Sortable columns
- Sticky header on scroll
- Row click to song detail
- Export to CSV (optional)

### 5. SongTrendChart
```typescript
interface SongTrendChartProps {
  songId: number;
  data: { year: number; count: number }[];
  type: 'frequency' | 'rating';
}
```

**Visual Design**:
- Line chart showing song performance over time
- X-axis: Years
- Y-axis: Performance count or rating
- Highlight significant events (debut, gap, bust-out)
- Interactive tooltips on hover

---

## User Flows

### Flow 1: Discover Rare Songs
```
User arrives at /songs
  ↓
Sorts by "Rarest First"
  ↓
Sees one-time and very rare songs
  ↓
Filters by "Not Heard" (personal tracking)
  ↓
Finds rare song never heard
  ↓
Clicks song card → song detail page
  ↓
Views single performance of rare song
  ↓
Clicks performance → navigates to show page
  ↓
Adds show to listening queue
```

### Flow 2: Track Favorite Song
```
User searching for favorite song
  ↓
Uses quick search bar to find song
  ↓
Clicks song card → song detail opens
  ↓
Reviews all 87 performances
  ↓
Sorts performances by "Highest Rated"
  ↓
Identifies best-rated performance
  ↓
Marks song as "Favorite"
  ↓
Adds notes about favorite version
```

### Flow 3: Analyze Song Evolution
```
Music researcher studying song
  ↓
Opens song detail page
  ↓
Views frequency trend chart
  ↓
Notices song played heavily in 1990s
  ↓
Sees 10-year gap (2000-2010)
  ↓
Reads retirement/bust-out context
  ↓
Compares early vs. recent performances
  ↓
Downloads performance data (export)
```

### Flow 4: Complete Song Catalog
```
Completionist user tracking songs
  ↓
Filters by "Not Heard"
  ↓
Sees 234 songs never heard
  ↓
Sorts by "Most Played" (prioritize common ones)
  ↓
Opens song detail for common unheard song
  ↓
Reviews recent performances
  ↓
Marks song as "Heard" after listening
  ↓
Tracks progress toward hearing all songs
```

---

## States & Edge Cases

### Empty States
1. **No songs exist** (unlikely, data seeding issue):
   - "Song data is being loaded"
   - Contact support message

2. **No songs match filters**:
   - "No songs match your criteria"
   - Show current filter selections
   - "Clear filters" button
   - Suggest broadening search

3. **User has no tracked songs** (authenticated):
   - "Start tracking songs you've heard"
   - Show all songs with tracking CTA

### Loading States
- Skeleton song cards while loading
- "Loading more songs" on pagination
- Chart loading spinners
- Smooth transitions between view modes

### Error States
- Failed to load songs: Retry button with cached data
- Failed to load song detail: Fallback to basic info
- Chart render failure: Show table fallback

### Special States
- **Song retired**: "Last played [DATE]" with retirement context
- **Song debuted recently**: "Debuted [DATE]" badge
- **Song bust-out**: "Returned after [X] year gap" badge
- **One-time only**: Special "Unicorn" indicator
- **Incomplete data**: Show available fields, note gaps

---

## Song Categorization

### Frequency Tiers
1. **Common** (>50% of shows) - Setlist staples
2. **Occasional** (10-50%) - Regular rotation
3. **Rare** (1-10%) - Special occasions
4. **Very Rare** (<1%) - Extremely rare
5. **One-Time** (1 performance) - Unicorns

### Song Types
- **Original** - Band's original composition
- **Cover** - Other artist's song
- **Tease** - Brief snippet/quote
- **Jam** - Extended instrumental
- **Medley** - Part of song combination
- **Acoustic** - Stripped-down version
- **Soundcheck** - Pre-show performance

### Song Status
- **Active** - Played in recent tours
- **Retired** - No longer performed
- **Hiatus** - Long gap but not retired
- **Debut** - Recently introduced
- **Bust-out** - Recently returned after gap

---

## Song Statistics & Analytics

### Song Metrics Displayed
1. **Performance Metrics**:
   - Total performances
   - Frequency percentage
   - First/last played
   - Years active
   - Current gap (days since last played)

2. **Quality Metrics**:
   - Average rating
   - Highest rated performance
   - Total reviews
   - Rating trend

3. **Rarity Metrics**:
   - Rarity score (0-100)
   - One-time performances
   - Longest gap between plays
   - Current gap status

4. **Context Metrics**:
   - Tours played
   - Venues played
   - Notable performances count
   - Song position (opener, closer, encore)

---

## Performance Considerations

### Optimization
- Server-side rendering for song list
- Cached song statistics (1 hour)
- Progressive loading for large lists
- Debounced search and filter updates
- Prefetch song details on hover
- Virtual scrolling for table view
- Chart data caching

### Accessibility
- Semantic HTML (table for table view)
- Keyboard navigation (arrow keys in table, tab through cards)
- ARIA labels for song statistics
- Screen reader descriptions of rarity levels
- High contrast rarity indicators
- Focus management in modals
- Alt text for chart visualizations

---

## Mobile Adaptations

### Mobile UX
- Single column song cards
- Sticky filter chip bar
- Bottom sheet for filters
- Pull-to-refresh
- Simplified song detail view
- Collapsible statistics sections
- Fixed "Jump to Top" button
- Swipeable alphabet navigator

### Responsive Breakpoints
- **Mobile (<640px)**: Single column, compact cards
- **Tablet (640px-1024px)**: Two-column grid
- **Desktop (>1024px)**: Three-column grid + sidebar OR table view

### Mobile-Specific Features
- Tap song card for quick preview
- Swipe actions (mark as heard, favorite)
- Haptic feedback on interactions
- Native share sheet for song links

---

## Data Requirements

### API Endpoints

```typescript
GET /songs
  - Params: frequency_tier, song_type, era, status, album, min_rating, heard_status, sort, search, limit, offset
  - Returns: SongList + pagination metadata
  - Response:
    {
      songs: SongSummary[];
      pagination: { total: number; offset: number; limit: number };
      available_filters: {
        frequency_tiers: string[];
        song_types: string[];
        eras: string[];
        albums: string[];
      };
    }

GET /songs/:id
  - Returns: Full song with performances, stats, trends
  - Response: FullSong

GET /songs/:id/performances
  - Params: sort (chronological, rating), limit, offset
  - Returns: PerformanceList for specific song

GET /songs/:id/stats
  - Returns: Detailed song statistics and trends
  - Response:
    {
      basic_stats: {...};
      trends: {
        frequency_over_time: {...}[];
        rating_over_time: {...}[];
      };
      gap_analysis: {...};
      notable_performances: Performance[];
    }

GET /songs/:id/related
  - Returns: Related songs (same album, similar frequency, etc.)
  - Response: Song[]

GET /songs/search
  - Params: query (song name or artist), limit
  - Returns: Matching songs
  - Response: SongSummary[]

GET /songs/stats/summary
  - Returns: Global song statistics
  - Response:
    {
      total_songs: number;
      active_songs: number;
      retired_songs: number;
      most_played_song: SongSummary;
      rarest_songs: SongSummary[];
      frequency_distribution: { tier: string; count: number }[];
    }

POST /songs/:id/tracking
  - Body: { heard: boolean; favorite: boolean; notes?: string }
  - Requires: Authentication
  - Returns: Updated tracking status
```

### Caching Strategy
- Song list: 5min cache
- Individual song: 10min cache
- Song performances: 5min cache
- Song stats: 1hr cache
- Global summary: 1hr cache
- Search results: 1min cache

---

## Song Detail Page

### URL Structure
- `/songs/:songId` - Full page song detail
- `/songs/:songId/performances` - Performance list for song
- `/songs/:songId/stats` - Detailed song statistics
- `/songs/:songId/history` - Song history timeline

### Song Detail Content Sections
1. **Hero Banner**:
   - Song name (large)
   - Artist (if cover)
   - Times played badge
   - Rarity badge
   - Favorite button (if authenticated)

2. **Overview Section**:
   - Song description
   - Key facts (debut, last played, frequency)
   - Album info
   - Song tags
   - User tracking status

3. **Statistics Dashboard**:
   - Performance count over time chart
   - Rating trend chart
   - Gap analysis visualization
   - Frequency heatmap (by year/tour)

4. **Notable Performances**:
   - Highest rated
   - Most recent
   - Debut performance
   - Longest version
   - Special versions (acoustic, guest, etc.)

5. **Performance History**:
   - Chronological performance list
   - Performance cards with date, venue, rating
   - Filter/search within performances
   - Link to individual performance/show pages

6. **Gap Analysis**:
   - Longest gap between performances
   - Current gap (if not recently played)
   - Average gap between performances
   - Timeline of significant gaps

7. **Song Context**:
   - Debut context and story
   - Retirement context (if retired)
   - Notable bust-outs
   - Historical significance

8. **Related Songs**:
   - Songs from same album
   - Songs with similar frequency
   - Songs often played together
   - Cover versions by other artists

---

## Search & Discovery

### Search Functionality
- Autocomplete song search
- Search by song name
- Search by original artist (covers)
- Search by lyrics (optional, advanced)
- Fuzzy matching for typos

### Discovery Features
- **"Hidden Gems"**: Rare songs with high ratings
- **"Due for Return"**: Retired songs with potential for bust-out
- **"Recently Debuted"**: New additions to catalog
- **"Your Song Journey"**: Based on tracking history
- **"Complete Your Catalog"**: Unheard songs to discover
- **"Trending Songs"**: Most-viewed or most-discussed recently

---

## Social & Engagement Features

### Song Tracking
- Mark songs as "heard" or "not heard"
- Favorite songs list
- Personal song notes
- Track listening progress
- Share song statistics

### Song Discussions
- Song-level comment threads
- Share favorite performances
- Debate best version
- Song meaning discussions

### Song Challenges
- "Hear all songs" challenge
- "Catch a rare song live" achievement
- "Song historian" badge

---

## Success Metrics

### Engagement KPIs
- Songs viewed per session
- Average time on songs page
- Filter usage rate
- Search usage rate
- Song detail page visits
- Performance navigation from song pages
- Personal tracking usage

### Discovery KPIs
- Songs discovered via search
- Songs discovered via filters
- Rare songs discovered
- Performances discovered via song pages

### Quality KPIs
- Song data completeness
- User tracking engagement
- Song discussion participation

---

## Implementation Phases

### Phase 1 (MVP)
- Basic song list with essential info
- Alphabetical and frequency sorting
- Simple filters (frequency tier, type)
- Song detail pages
- Performance list per song
- Grid and list views

### Phase 2 (Enhanced)
- Table view with sortable columns
- Advanced filters (era, status, rating)
- Song statistics dashboard
- Trend charts
- Notable performances section
- Song search with autocomplete
- Personal tracking (heard/not heard)

### Phase 3 (Community)
- Song discussions
- Favorite songs system
- Song challenges
- Gap analysis and predictions
- Social tracking comparison
- User-contributed song notes
- Performance recommendations

---

## Open Questions for Architect

1. **Song Data Structure**: How are songs stored? Separate from performances?
2. **Cover Attribution**: How to handle cover songs? Link to original artist?
3. **Song Variations**: How to handle different versions (acoustic, electric, extended)?
4. **Medleys**: Are songs in medleys tracked separately or as one performance?
5. **Teases**: Include teases as separate song entries or tag on main song?
6. **Song Duration**: Calculate from performance data or manual entry?
7. **Rarity Score**: How is rarity calculated? Just frequency or weighted?

---

**Next Steps**:
- Architect reviews specification
- Define song data model
- Implement song aggregation from performance data
- Design mockups for song cards and detail pages
- Implement MVP (Phase 1)
- Create rarity scoring algorithm
