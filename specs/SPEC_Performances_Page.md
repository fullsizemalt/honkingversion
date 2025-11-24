# UX Specification: Performances Page

**Route**: `/performances`  
**Status**: Needs Implementation  
**Priority**: High - Core Feature  
**Last Updated**: 2025-11-24

---

## User Needs & Goals

### Primary Users
1. **Concert Explorers** - Fans discovering specific performances of songs
2. **Data Analysts** - Users comparing performance evolution across tours
3. **Completionists** - Fans tracking every variation of their favorite songs

### User Goals
- Browse all performances of specific songs across shows
- Compare different versions/arrangements
- See performance trends (rarities, debut/bust, frequency)
- Filter by tour, year, venue, setlist position
- Vote and review specific performances

---

## Content Strategy

### Core Content Elements
1. **Performance Cards** - Each showing:
   - Song name
   - Show date & venue
   - Tour context
   - Performance notes (guest, tease, segue)
   - Community rating
   - Vote count

2. **Rich Metadata**:
   - Performance debut/bust indicators
   - Rarity score (based on frequency)
   - Musical notes (teases, guests, transitions)
   - Recording availability (official/tape)

3. **Performance Analytics**:
   - "Times Played" counter
   - Tour distribution chart
   - Set position patterns
   - Gap analysis (shows since last played)

---

## Information Architecture

```
/performances
├── Hero Section
│   ├── Page title "Performances"
│   ├── Subtitle "Every version of every song, documented"
│   └── Quick stats (total performances, songs tracked)
│
├── Filter & Search Bar
│   ├── Search by song name
│   ├── Filter by tour (dropdown)
│   ├── Filter by year (range slider)
│   ├── Filter by venue
│   ├── Sort options (date, rating, rarity)
│   └── View toggle (list/grid/timeline)
│
├── Active Filters Display
│   └── Removable filter chips
│
├── Performance Feed
│   ├── Performance Cards (virtualized for performance)
│   ├── Infinite scroll or pagination
│   └── Loading states
│
└── Sidebar (optional, desktop only)
    ├── Featured Performances (editor picks)
    ├── Recently Added
    └── Most Debated (high vote activity)
```

---

## UI Components

### 1. PerformanceCard
```typescript
interface PerformanceCardProps {
  performance: {
    id: number;
    song_name: string;
    show_date: string;
    venue_name: string;
    tour_name?: string;
    notes?: string;
    rating: number;
    votes_count: number;
    is_debut: boolean;
    is_bust: boolean;
    rarity_score: number;
    has_guest?: string;
    has_tease?: string;
    segues_into?: string;
  };
  onVote: (voteType: 'up' | 'down') => void;
  onNavigate: () => void;
}
```

**Visual Design**:
- Card with hover lift effect
- Badge indicators for debut/bust/rarity
- Inline voting UI
- Quick action menu (bookmark, share, compare)

### 2. PerformanceFilters
```typescript
interface PerformanceFiltersProps {
  onFilterChange: (filters: Filters) => void;
  availableTours: Tour[];
  yearRange: [number, number];
  venues: Venue[];
}
```

**Interaction Pattern**:
- Collapsible on mobile
- Sticky on desktop
- Real-time filter count indicators
- Clear all button when filters active

### 3. PerformanceTimeline (Alternative View)
- Chronological visualization
- Tour-colored segments
- Zoom controls for dense date ranges
- Click to drill into specific show

---

## User Flows

### Flow 1: Discover Rare Performances
```
User arrives at /performances
  ↓
Sees featured rare performances
  ↓
Applies rarity filter "< 5 plays"
  ↓
Browses rare gems
  ↓
Clicks performance card
  ↓
Views show page with full performance context
```

### Flow 2: Track Song Evolution
```
Search for specific song (e.g., "Hungersite")
  ↓
See all performances timeline view
  ↓
Toggle to list view sorted by date
  ↓
Compare early vs. recent versions
  ↓
Vote on favorite versions
```

### Flow 3: Tour Analysis
```
Filter by specific tour (e.g., "Summer 2023")
  ↓
See all performances from that tour
  ↓
Sort by rating to find highlights
  ↓
Create list "Best of Summer 2023"
```

---

## States & Edge Cases

### Empty States
1. **No filters applied, no data**:
   - "No performances tracked yet"
   - CTA: "Help us document shows"

2. **Filters return no results**:
   - "No performances match your filters"
   - Show most similar results
   - "Clear filters" button

3. **Song never played**:
   - "This song hasn't been performed yet"
   - "Get notified when it debuts" (if authenticated)

### Loading States
- Skeleton cards while fetching
- Progressive loading for infinite scroll
- Filter loading indicators

### Error States
- Network error: Retry button
- Permission error: Explain authentication need
- Server error: Friendly message with support link

---

## Performance Considerations

### Optimization
- Virtual scrolling for large result sets (1000+ items)
- Image lazy loading for performance photos
- Debounced search input
- Cached filter options
- Service worker for offline filter state

### Accessibility
- Keyboard navigation for filters
- Screen reader announcements for filter changes
- Focus management when applying filters
- ARIA labels for vote buttons
- High contrast mode support

---

## Mobile Adaptations

### Mobile-Specific UX
- Bottom sheet for filters (not sidebar)
- Swipe gestures for navigation
- Simplified card layout (vertical stack)
- Fixed search bar at top
- Floating action button for "Add Performance"

### Responsive Breakpoints
- Mobile: < 768px (single column)
- Tablet: 768px-1024px (2 columns)
- Desktop: > 1024px (3 columns + sidebar)

---

## Data Requirements

### API Endpoints Needed
```typescript
GET /performances
  - Query params: song_id, tour_id, year_min, year_max, venue_id
  - Sort: date, rating, rarity, votes
  - Pagination: limit, offset
  - Returns: PerformanceList + metadata

GET /performances/:id
  - Returns: Full performance details

POST /performances/:id/vote
  - Body: { vote_type: 'up' | 'down' }
  - Requires auth

GET /performances/featured
  - Returns: Curated list of notable performances

GET /performances/filters
  - Returns: Available filter options (tours, venues, years)
```

### Data Freshness
- Performance list: Cache 60s
- Featured performances: Cache 5min
- Filter options: Cache 1hr
- User votes: Real-time (no cache)

---

## Success Metrics

### Engagement KPIs
- Average time on page
- Filter usage rate
- Vote participation rate
- Share/bookmark rate
- Return visitor rate

### Performance KPIs
- Page load time < 2s
- Time to interactive < 3s
- Smooth scrolling (60fps)
- Filter response time < 100ms

---

## Implementation Notes

### Phase 1 (MVP)
- Basic list view with search
- Essential filters (song, tour, year)
- Performance card with core data
- Voting functionality

### Phase 2 (Enhanced)
- Timeline visualization
- Advanced filters (rarity, guests, teases)
- Sidebar with featured content
- Infinite scroll

### Phase 3 (Power User)
- Performance comparison tool
- Export to CSV/playlist
- Saved filter presets
- Notification system for rare plays

---

## Open Questions for Architect

1. **Data Source**: How are performances being populated? Manual entry vs. automated?
2. **Recording Integration**: Do we link to streaming/downloads?
3. **User Contributions**: Can users submit/edit performance notes?
4. **Moderation**: How are performance details verified?
5. **Setlist Integration**: How does this relate to the Shows page?

---

**Next Steps**: 
- Review and approve specification
- Create wireframes/mockups
- Implement Phase 1
- User testing with beta group
