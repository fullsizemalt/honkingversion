# UX Specification: Trending Page & Trend Visualization

**Route**: `/trending`
**Status**: Needs Implementation
**Priority**: High - Core Discovery Feature
**Last Updated**: 2025-11-24

---

## User Needs & Goals

### Primary Users
1. **Active Community Members** - Users discovering hot content and discussions
2. **New Users** - Fans finding popular entry points to explore
3. **Data Enthusiasts** - Users tracking community activity patterns
4. **Curators** - Users identifying content worth promoting

### User Goals
- Discover what's popular right now
- See trending performances, shows, songs, users
- Understand trend velocity (rising fast vs. steady popularity)
- Track how trends evolve over time
- Find community consensus on best content
- Identify emerging favorites before they peak

---

## Content Strategy

### Core Content Elements
1. **Trending Performances**:
   - Performance name (song + show)
   - Current vote count
   - Trend graph (votes over time)
   - Velocity indicator (votes/day)
   - Rating average
   - Ranking position

2. **Trending Shows**:
   - Show date and venue
   - View count trend
   - Rating trend
   - Discussion activity
   - List additions

3. **Trending Songs**:
   - Song name
   - Performance frequency spike
   - Search volume trend
   - Discussion mentions
   - Playlist additions

4. **Trending Lists**:
   - List title
   - Follower count trend
   - Recent activity
   - Creator info

5. **Trending Users**:
   - Username
   - Follower growth
   - Activity spike
   - Recent contributions

---

## Information Architecture

```
/trending
├── Hero Section
│   ├── "Trending Now"
│   ├── "Discover what's hot in the community"
│   └── Time range selector (24h, 7d, 30d)
│
├── Tab Navigation
│   ├── All (default)
│   ├── Performances
│   ├── Shows
│   ├── Songs
│   ├── Lists
│   └── People
│
├── Trending Feed
│   ├── Trend cards with sparkline graphs
│   ├── Rank badges (#1, #2, #3...)
│   ├── Velocity indicators (🔥 fast, 📈 rising, 💫 steady)
│   ├── Loading skeletons
│   └── Infinite scroll or pagination
│
└── Sidebar (desktop)
    ├── Trending Stats
    │   ├── Most active day
    │   ├── Biggest gainer
    │   └── Longest trending
    ├── Historical Trends
    │   └── "What was trending this week last year"
    └── Trend Alerts
        └── Subscribe to trend notifications
```

---

## TrendChart Component

### Core Component: Linear Sparkline Graph

```typescript
interface TrendChartProps {
  data: TrendDataPoint[];
  timeRange: '24h' | '7d' | '30d';
  variant: 'line' | 'area';
  color?: string;
  height?: number;
  width?: number;
  showAxes?: boolean;
  showDots?: boolean;
  animated?: boolean;
  className?: string;
}

interface TrendDataPoint {
  timestamp: string; // ISO date
  value: number;
  label?: string;
}
```

**Visual Design**:
- **Clean line graph** with smooth curves (not jagged)
- **Gradient area fill** (optional, subtle)
- **Minimal axes** (no labels by default for sparklines)
- **Responsive sizing** (adapts to container)
- **Hover interactions**:
  - Show exact value on hover
  - Highlight data point
  - Display timestamp
  - Crosshair indicator

**Color Coding**:
- **Green (#1fc77b)** - Upward trend, positive velocity
- **Orange (#f7931e)** - Neutral/mixed trend
- **Red (#ff4444)** - Downward trend (rare, for completion)
- **Blue (#4a90e2)** - Custom/default

**Variants**:

1. **Micro Sparkline** (inline, 60x20px):
   - No axes, no labels
   - Line only, no area fill
   - Minimal padding
   - Use: List items, cards

2. **Card Sparkline** (200x60px):
   - Light axes, no labels
   - Line with subtle area fill
   - Hover tooltip
   - Use: Trend cards, widgets

3. **Full Chart** (400x200px):
   - Full axes with labels
   - Line + area fill
   - Detailed tooltip
   - Zoom/pan interactions
   - Use: Detail pages, analytics

---

## UI Components

### 1. TrendCard (Feed View)
```typescript
interface TrendCardProps {
  item: TrendingItem;
  rank: number;
  onNavigate: () => void;
}

interface TrendingItem {
  id: number;
  type: 'performance' | 'show' | 'song' | 'list' | 'user';
  title: string;
  subtitle?: string;
  current_value: number;
  previous_value: number;
  trend_data: TrendDataPoint[];
  velocity: 'fast' | 'rising' | 'steady' | 'declining';
  time_on_trending: number; // days
  metadata: {
    rating?: number;
    vote_count?: number;
    follower_count?: number;
    // type-specific fields
  };
}
```

**Visual Design**:
- **Rank badge** (circular, prominent, top-left)
- **Title and subtitle** (bold title, lighter subtitle)
- **Trend graph** (prominent, 200x60px)
- **Velocity badge** ("🔥 Fast Rising", "📈 Rising", "💫 Steady")
- **Stats row** (current value, change percentage, time on trending)
- **Action button** (View, Listen, Follow)

**Layout**:
```
┌─────────────────────────────────────────┐
│ #1  [Title]                  🔥 Fast    │
│     [Subtitle]                           │
│                                          │
│     [━━━━━━ Trend Graph ━━━━━━━]       │
│                                          │
│     2,847 votes (+42%) · 3 days         │
│                           [View →]      │
└─────────────────────────────────────────┘
```

### 2. TrendFilters
```typescript
interface TrendFiltersProps {
  activeTab: TrendCategory;
  timeRange: TimeRange;
  onTabChange: (tab: TrendCategory) => void;
  onTimeRangeChange: (range: TimeRange) => void;
}

type TrendCategory = 'all' | 'performances' | 'shows' | 'songs' | 'lists' | 'people';
type TimeRange = '24h' | '7d' | '30d';
```

**Desktop Layout**: Horizontal tabs + time range selector
**Mobile Layout**: Dropdown selector

### 3. TrendChart (Reusable Component)
```typescript
import { Line } from 'recharts'; // or custom SVG implementation

function TrendChart({ data, variant, color, height, width, animated }: TrendChartProps) {
  // Linear gradient for area fill
  const gradientId = useId();

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path
        d={generateAreaPath(data)}
        fill={`url(#${gradientId})`}
      />

      {/* Line */}
      <path
        d={generateLinePath(data)}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points (optional) */}
      {showDots && data.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="3"
          fill={color}
        />
      ))}
    </svg>
  );
}
```

**CSS Styling**:
```css
.trend-chart {
  --trend-color-positive: #1fc77b;
  --trend-color-neutral: #f7931e;
  --trend-color-negative: #ff4444;

  transition: all 0.3s ease;
}

.trend-chart:hover {
  transform: scale(1.02);
}

.trend-line {
  stroke: var(--trend-color-positive);
  stroke-width: 2px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;

  /* Smooth animation */
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-line 1s ease-out forwards;
}

@keyframes draw-line {
  to {
    stroke-dashoffset: 0;
  }
}

.trend-area {
  fill: url(#trend-gradient);
  opacity: 0;
  animation: fade-in 0.5s ease-out 0.5s forwards;
}

@keyframes fade-in {
  to {
    opacity: 1;
  }
}
```

### 4. VelocityBadge
```typescript
interface VelocityBadgeProps {
  velocity: 'fast' | 'rising' | 'steady' | 'declining';
  percentChange: number;
}
```

**Visual Design**:
```typescript
const velocityConfig = {
  fast: {
    icon: '🔥',
    label: 'Fast Rising',
    color: 'text-[#ff6b35] bg-[#ff6b35]/10 border-[#ff6b35]/30',
    description: '+50% or more in 24h'
  },
  rising: {
    icon: '📈',
    label: 'Rising',
    color: 'text-[#1fc77b] bg-[#1fc77b]/10 border-[#1fc77b]/30',
    description: '+10-49% in 24h'
  },
  steady: {
    icon: '💫',
    label: 'Steady',
    color: 'text-[#f7931e] bg-[#f7931e]/10 border-[#f7931e]/30',
    description: '0-9% change'
  },
  declining: {
    icon: '📉',
    label: 'Cooling Off',
    color: 'text-[#707070] bg-[#707070]/10 border-[#707070]/30',
    description: 'Negative trend'
  }
};
```

---

## User Flows

### Flow 1: Discover Trending Performance
```
User arrives at /trending
  ↓
Sees #1 trending performance with graph
  ↓
Hovers over graph → sees daily vote breakdown
  ↓
Notices "🔥 Fast Rising" badge
  ↓
Clicks card → navigates to performance page
  ↓
Listens and votes
```

### Flow 2: Track Trend Over Time
```
User views trending performances
  ↓
Switches time range from "24h" to "30d"
  ↓
Graphs update to show longer trend
  ↓
Identifies performance that's been trending for weeks
  ↓
Clicks to investigate why
```

### Flow 3: Compare Trending Items
```
User browsing trending feed
  ↓
Sees #1 with steep upward graph
  ↓
Sees #2 with gradual upward graph
  ↓
Understands #1 is spiking, #2 is steady favorite
  ↓
Makes decision based on preference
```

---

## Integration Points

### Where to Use TrendChart Component:

1. **Home Page Widgets**:
   - Trending Performances widget (card sparklines)
   - Top Rated Performances (micro sparklines showing rating trend)
   - Community Activity (overall site activity graph)

2. **Trending Page**:
   - All trend cards (card sparklines)
   - Featured trends (full charts)

3. **Performance Detail Pages**:
   - Vote trend over time (full chart)
   - Rating trend (full chart)

4. **Song Detail Pages**:
   - Performance frequency over time (full chart)
   - Rating trend for song (full chart)

5. **User Profiles**:
   - Activity trend (micro sparkline)
   - Follower growth (card sparkline)

6. **Stats Page**:
   - All statistics can have trend graphs
   - Leaderboard position history (micro sparklines)

7. **Show Detail Pages**:
   - View count trend (micro sparkline)
   - Rating accumulation over time (card sparkline)

8. **List Detail Pages**:
   - Follower growth (card sparkline)
   - Activity trend (micro sparkline)

---

## States & Edge Cases

### Empty States
1. **No trending items**:
   - "Nothing trending right now"
   - Encourage voting and engagement

2. **Insufficient data for graph**:
   - Show placeholder or single data point
   - "Trend data being collected"

3. **New item (< 24h data)**:
   - Show partial graph
   - "New and trending" badge

### Loading States
- Skeleton trend cards with animated placeholders
- Skeleton graphs (pulsing lines)
- Progressive loading on scroll

### Error States
- Failed to load trend data: Retry button
- Graph render failure: Fall back to text stats
- Network error: Show cached data with staleness indicator

### Special States
- **Item just entered trending**: "New Entry" badge
- **Item leaving trending**: Grayed out, "Cooling Off"
- **Record-breaking trend**: Special badge, highlight
- **Returning trend**: "Back on Trending" badge

---

## Trend Calculation Algorithm

### Velocity Categories:
```typescript
function calculateVelocity(currentValue: number, previousValue: number, timeWindow: number): Velocity {
  const change = currentValue - previousValue;
  const percentChange = (change / previousValue) * 100;

  // Adjust for time window
  const dailyChange = (percentChange / timeWindow) * 1; // normalize to per-day

  if (dailyChange >= 50) return 'fast';
  if (dailyChange >= 10) return 'rising';
  if (dailyChange >= 0) return 'steady';
  return 'declining';
}
```

### Trending Score:
```typescript
function calculateTrendingScore(item: TrendingItem): number {
  const recentActivity = item.last_24h_value;
  const previousActivity = item.previous_24h_value;
  const velocity = recentActivity - previousActivity;
  const acceleration = velocity - (previousActivity - item.previous_48h_value);

  // Weighted score
  const score = (
    recentActivity * 1.0 +      // Current activity
    velocity * 2.0 +             // Growth rate
    acceleration * 3.0           // Acceleration (favors fast risers)
  );

  return score;
}
```

### Trend Data Collection:
- **Performances**: Vote count hourly snapshots
- **Shows**: View count + vote count hourly
- **Songs**: Search volume + performance count daily
- **Lists**: Follower count + view count hourly
- **Users**: Follower count + activity count daily

---

## Performance Considerations

### Optimization
- Server-side trend calculation (cached hourly)
- Pre-computed trend data for common time ranges
- SVG graphs (lightweight, scalable)
- Lazy load graphs (intersection observer)
- Debounced hover interactions
- Cached API responses (5min)

### Graph Rendering
- Use canvas for large datasets (>100 points)
- Use SVG for small datasets (<100 points)
- Simplify line paths (Douglas-Peucker algorithm)
- Animate on mount (stagger for lists)

### Accessibility
- Semantic HTML for trend cards
- ARIA labels for graphs ("Trend showing 42% increase")
- Keyboard navigation
- Screen reader descriptions of trends
- High contrast graph lines
- Focus indicators

---

## Mobile Adaptations

### Mobile UX
- Single column trend cards
- Horizontal scroll for tabs
- Bottom sheet for filters
- Pull-to-refresh
- Simplified graphs (fewer data points)
- Tap for detailed view

### Responsive Graph Sizing
- **Mobile (<640px)**: 150x40px sparklines
- **Tablet (640px-1024px)**: 200x60px sparklines
- **Desktop (>1024px)**: 250x80px sparklines

### Mobile-Specific Features
- Swipe between tabs
- Tap graph for full-screen detail
- Haptic feedback on interactions
- Share trending items

---

## Data Requirements

### API Endpoints

```typescript
GET /trending
  - Params: category (all, performances, shows, songs, lists, people), time_range (24h, 7d, 30d), limit, offset
  - Returns: TrendingList + metadata
  - Response:
    {
      trending_items: TrendingItem[];
      time_range: string;
      last_updated: string;
      pagination: { total: number; offset: number; limit: number };
    }

GET /trending/:type/:id/history
  - Params: type (performance, show, song, list, user), id (item ID), time_range
  - Returns: Detailed trend history
  - Response:
    {
      item: TrendingItem;
      history: TrendDataPoint[];
      statistics: {
        peak_value: number;
        peak_date: string;
        average_value: number;
        total_change: number;
        percent_change: number;
      };
    }

GET /trending/stats/summary
  - Returns: Global trending statistics
  - Response:
    {
      most_active_day: { date: string; total_activity: number };
      biggest_gainer: TrendingItem;
      longest_trending: TrendingItem;
      new_entries_count: number;
    }

POST /trending/subscribe
  - Body: { type: string; threshold: number; notification_method: string }
  - Requires: Authentication
  - Returns: Subscription confirmation
```

### Caching Strategy
- Trending list: 5min cache
- Trend history: 15min cache
- Trending stats: 30min cache
- Real-time updates: WebSocket (optional)

---

## Graph Library Options

### Recommendation: **Custom SVG Implementation**

**Pros**:
- Lightweight (~2KB)
- Full control over styling
- No dependencies
- Fast rendering
- Easy to customize

**Alternative: Recharts**

**Pros**:
- Feature-rich
- Well-documented
- Active maintenance
- Built-in responsiveness

**Cons**:
- Larger bundle (~50KB)
- Some customization limits

### Implementation Example (Custom SVG):
```typescript
function generateLinePath(data: TrendDataPoint[], width: number, height: number): string {
  if (data.length === 0) return '';

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((point.value - minValue) / range) * height;
    return { x, y };
  });

  // Generate smooth curve using bezier
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const curr = points[i];
    const prev = points[i - 1];
    const cpX = (prev.x + curr.x) / 2;
    path += ` Q ${cpX} ${prev.y}, ${curr.x} ${curr.y}`;
  }

  return path;
}
```

---

## Success Metrics

### Engagement KPIs
- Trending page views
- Time spent on trending page
- Click-through rate from trend cards
- Time range filter usage
- Graph interactions (hovers)

### Discovery KPIs
- Items discovered via trending
- Conversion to votes/follows
- New user acquisition via trending
- Social shares of trending items

### Quality KPIs
- Trend accuracy (user satisfaction)
- False positive rate
- Trend diversity (not dominated by one type)

---

## Implementation Phases

### Phase 1 (MVP)
- Basic trending page (performances only)
- Simple line graphs (SVG)
- 24h and 7d time ranges
- Velocity indicators
- No real-time updates

### Phase 2 (Enhanced)
- All content types (shows, songs, lists, people)
- Animated graphs
- Hover interactions
- 30d time range
- Historical comparisons

### Phase 3 (Advanced)
- Real-time updates (WebSocket)
- Predictive trends
- Personalized trending
- Trend alerts/notifications
- Export trend data
- Embeddable trend widgets

---

## Design Specifications

### Graph Aesthetics

**Line Styles**:
- **Stroke width**: 2px
- **Stroke cap**: round
- **Stroke join**: round
- **Smoothing**: Bezier curves (not jagged)

**Color Palette**:
```css
--trend-positive: #1fc77b;
--trend-neutral: #f7931e;
--trend-negative: #ff4444;
--trend-grid: rgba(160, 160, 160, 0.1);
--trend-tooltip-bg: rgba(26, 26, 26, 0.95);
```

**Animation Timing**:
- Line draw: 800ms ease-out
- Area fade: 500ms ease-out (300ms delay)
- Hover scale: 200ms ease
- Data point pulse: 1s infinite

**Grid Lines** (optional, for full charts):
- Horizontal only
- Every 25% of max value
- Dashed lines (2px dash, 4px gap)
- Low opacity (10%)

---

## Open Questions for Architect

1. **Trend Calculation**: Server-side or client-side? Frequency of updates?
2. **Data Retention**: How long to keep hourly snapshots? Aggregate older data?
3. **Real-time**: Implement WebSocket for live updates or polling?
4. **Personalization**: Show personalized trending based on user preferences?
5. **Graph Library**: Custom SVG or existing library (Recharts, Victory)?
6. **Caching**: Redis for trend calculations? Cache invalidation strategy?
7. **Historical Data**: Store full history or aggregated summaries?

---

**Next Steps**:
- Architect reviews specification
- Choose graph implementation approach
- Design trend calculation algorithm
- Implement TrendChart component
- Create trending page
- Integrate TrendChart across site
- Set up trend data collection pipeline
