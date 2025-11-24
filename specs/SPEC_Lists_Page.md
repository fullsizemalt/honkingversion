# UX Specification: Lists Landing Page

**Route**: `/lists`
**Status**: Needs Implementation
**Priority**: Medium - Community Feature
**Last Updated**: 2025-11-24

---

## User Needs & Goals

### Primary Users
1. **List Curators** - Users creating and maintaining show collections
2. **List Followers** - Users discovering shows through curated lists
3. **Completionists** - Fans tracking "must-hear" shows from community
4. **Music Explorers** - New fans using lists as listening guides

### User Goals
- Discover curated show collections
- Create and share personal show lists
- Follow popular and trending lists
- Collaborate on lists with community
- Track progress through lists
- Find lists by theme, era, or criteria

---

## Content Strategy

### Core Content Elements
1. **List Cards**:
   - List title
   - List description/tagline
   - List creator (avatar, username)
   - Show count
   - Follower count
   - Last updated timestamp
   - List thumbnail (collage of show posters)
   - List tags/categories
   - Privacy status (public, unlisted, private)
   - Collaborative indicator

2. **List Metadata**:
   - Creation date
   - Last modified date
   - Show count
   - Follower/subscriber count
   - Vote count (if votable list)
   - Category/theme
   - Era or date range
   - Collaborative status
   - Featured/editor's pick status

3. **List Statistics**:
   - Total shows in list
   - Date range (earliest → latest show)
   - Most common tour
   - Most common venue
   - Average show rating
   - Completion rate (for followers)

---

## Information Architecture

```
/lists
├── Hero Section
│   ├── "Lists"
│   ├── "Discover curated show collections"
│   └── Create List CTA (if authenticated)
│
├── Featured Lists Section
│   ├── Editor's picks
│   ├── Most followed
│   └── Recently updated
│
├── Filter & Sort Bar
│   ├── Filter by:
│   │   ├── Category (essential, era-specific, hidden gems, top-rated, etc.)
│   │   ├── Era/decade
│   │   ├── Creator (following, verified, community)
│   │   ├── List type (ranked, unranked, collaborative, personal)
│   │   └── Show count (compact <10, medium 10-50, extensive >50)
│   ├── Sort by:
│   │   ├── Popular (most followers)
│   │   ├── Recent (newly created)
│   │   ├── Updated (recently modified)
│   │   ├── Trending (gaining followers)
│   │   └── Alphabetical
│   └── View: Grid | List
│
├── Lists Feed
│   ├── List cards (paginated or infinite scroll)
│   ├── Category dividers (optional)
│   ├── Loading skeletons
│   └── "Load more" button
│
└── Sidebar (desktop)
    ├── Your Lists (if authenticated)
    │   ├── Created by you
    │   ├── Following
    │   └── Collaborative lists
    ├── List Categories
    │   └── Quick filter chips
    └── Create List CTA
```

---

## UI Components

### 1. ListCard (Feed View)
```typescript
interface ListCardProps {
  list: {
    id: number;
    title: string;
    description: string;
    creator: User;
    show_count: number;
    follower_count: number;
    created_at: string;
    updated_at: string;
    thumbnail_url?: string;
    category: string;
    tags: string[];
    privacy: 'public' | 'unlisted' | 'private';
    is_collaborative: boolean;
    is_featured: boolean;
    completion_percentage?: number;
  };
  onNavigate: () => void;
  onFollow?: () => void;
  isFollowing?: boolean;
  viewMode: 'grid' | 'list';
}
```

**Visual Design**:
- **Grid View**: Vertical card with thumbnail, title, creator, stats
- **List View**: Horizontal card with more details visible

**Card Elements**:
- List thumbnail (collage or featured image)
- List title (bold, prominent)
- Creator avatar and username
- Description preview (truncated)
- Show count badge
- Follower count
- Category badge
- Tags (chips)
- Updated timestamp
- Featured badge (if applicable)
- Collaborative indicator
- Follow/Unfollow button
- Completion progress (if following)
- Quick actions menu (share, save, report)

### 2. ListFilters
```typescript
interface ListFiltersProps {
  onFilterChange: (filters: ListFilters) => void;
  onSortChange: (sort: ListSortOption) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  activeFilters: ListFilters;
  availableCategories: string[];
}

interface ListFilters {
  categories: string[];
  eras: string[];
  creatorType: ('following' | 'verified' | 'community')[];
  listType: ('ranked' | 'unranked' | 'collaborative' | 'personal')[];
  showCountRange?: { min?: number; max?: number };
}

type ListSortOption = 'popular' | 'recent' | 'updated' | 'trending' | 'alphabetical';
```

**Desktop Layout**: Horizontal filter bar below hero
**Mobile Layout**: Bottom sheet with filter chips

### 3. ListDetail (Full Page)
```typescript
interface ListDetailProps {
  list: FullList;
  shows: Show[];
  onShowClick: (showId: number) => void;
  onFollow: () => void;
  onEdit?: () => void;
  onAddShow?: (showId: number) => void;
}

interface FullList {
  id: number;
  title: string;
  description: string;
  creator: User;
  collaborators?: User[];
  show_count: number;
  follower_count: number;
  created_at: string;
  updated_at: string;
  category: string;
  tags: string[];
  privacy: 'public' | 'unlisted' | 'private';
  is_collaborative: boolean;
  is_ranked: boolean;
  stats: {
    date_range?: { earliest: string; latest: string };
    most_common_tour?: string;
    most_common_venue?: string;
    average_show_rating: number;
    total_duration?: number;
  };
  shows: ListShow[];
  followers: User[];
  permissions: {
    can_edit: boolean;
    can_add_shows: boolean;
    can_reorder: boolean;
    can_delete: boolean;
  };
}

interface ListShow {
  show: Show;
  position?: number;
  added_by?: User;
  added_at: string;
  notes?: string;
}
```

**Layout**:
- Hero section with list title and creator
- List description
- Statistics overview
- Show list (ranked or unranked)
- Follower section
- Comments/discussions
- Related lists
- Social sharing

### 4. ListEditor (Create/Edit Mode)
```typescript
interface ListEditorProps {
  list?: FullList;
  onSave: (list: ListDraft) => void;
  onCancel: () => void;
}

interface ListDraft {
  title: string;
  description: string;
  category: string;
  tags: string[];
  privacy: 'public' | 'unlisted' | 'private';
  is_collaborative: boolean;
  is_ranked: boolean;
  shows: number[];
  show_notes?: { [showId: number]: string };
}
```

**Features**:
- Title and description fields
- Category selector
- Tag input (autocomplete)
- Privacy selector
- Collaborative toggle
- Ranked toggle
- Show search and add
- Drag-and-drop reordering (if ranked)
- Show notes (optional)
- Preview mode
- Save draft
- Publish

### 5. ListShowCard (Within List Detail)
```typescript
interface ListShowCardProps {
  show: Show;
  position?: number;
  addedBy?: User;
  notes?: string;
  onRemove?: () => void;
  onReorder?: (newPosition: number) => void;
  canEdit: boolean;
}
```

**Visual Design**:
- Rank number (if ranked list)
- Show thumbnail
- Show date and venue
- Show rating
- Added by (if collaborative)
- Show notes
- Remove button (if editable)
- Drag handle (if reorderable)

---

## User Flows

### Flow 1: Discover Lists
```
User arrives at /lists
  ↓
Sees featured lists section
  ↓
Browses "Editor's Picks"
  ↓
Finds interesting list: "Top 10 Shows of 1990s"
  ↓
Clicks list card → list detail page opens
  ↓
Reviews shows in list
  ↓
Clicks "Follow" to track list
  ↓
Shows added to personal queue
```

### Flow 2: Create New List
```
User authenticated, wants to share favorites
  ↓
Clicks "Create List" button
  ↓
List editor opens
  ↓
Enters title: "Hidden Gems of 2023"
  ↓
Writes description
  ↓
Selects category: "Hidden Gems"
  ↓
Searches for shows to add
  ↓
Adds 8 shows to list
  ↓
Reorders shows (ranked list)
  ↓
Sets privacy: Public
  ↓
Publishes list
  ↓
List appears in feed and on profile
```

### Flow 3: Collaborate on List
```
User invited to collaborate on list
  ↓
Opens list from notification
  ↓
Sees "Collaborative List" badge
  ↓
Reviews existing shows
  ↓
Clicks "Add Show" button
  ↓
Searches for show to suggest
  ↓
Adds show with note explaining choice
  ↓
Show added to list with "Added by [User]" attribution
  ↓
List owner receives notification
```

### Flow 4: Follow and Track List
```
User following list "Essential Phish Shows"
  ↓
Views list on profile sidebar
  ↓
Sees 3/50 shows completed
  ↓
Clicks list to view detail
  ↓
Sees completion progress bar
  ↓
Clicks next show in list
  ↓
Listens to show
  ↓
Marks show as "heard"
  ↓
Progress updates to 4/50
```

---

## States & Edge Cases

### Empty States
1. **No lists exist** (unlikely):
   - "No lists created yet"
   - Encourage creating first list

2. **No lists match filters**:
   - "No lists match your criteria"
   - Show current filter selections
   - "Clear filters" button
   - Suggest popular lists

3. **User has no lists** (authenticated):
   - "You haven't created any lists yet"
   - "Create your first list" CTA
   - Show followed lists

4. **Empty list (no shows)**:
   - "This list doesn't have any shows yet"
   - "Add your first show" button (if owner)

### Loading States
- Skeleton list cards while loading
- Progressive loading on scroll
- "Loading more lists" indicator
- Smooth transitions

### Error States
- Failed to load lists: Retry button with cached data
- Failed to load list detail: Fallback to basic info
- Failed to save list: Error message, draft saved locally
- Failed to follow: Error message, retry

### Special States
- **Private list**: Only visible to owner and collaborators
- **Unlisted list**: Accessible via direct link only
- **Archived list**: Read-only, no longer updated
- **Featured list**: Highlighted badge and positioning
- **Collaborative list**: Multiple contributor avatars

---

## List Categories

### Pre-Defined Categories
1. **Essential Listening** - Must-hear shows for newcomers
2. **Era-Specific** - Shows from particular decade or tour
3. **Hidden Gems** - Underrated shows
4. **Top Rated** - Community highest-rated shows
5. **Thematic** - Shows grouped by theme (acoustic, guests, special events)
6. **Venue-Specific** - Best shows at particular venues
7. **Song-Focused** - Shows featuring specific songs
8. **Personal Favorites** - User's personal top shows
9. **Chronological** - Shows in order (complete discography)
10. **Collaborative** - Community-curated collections

### Custom Categories
- Users can create custom categories
- Categories can be suggested for approval
- Popular custom categories promoted

---

## List Types

### Ranked Lists
- Shows ordered by preference (1, 2, 3...)
- Drag-and-drop reordering
- Position numbers displayed
- Voting on order (optional)

### Unranked Lists
- Shows in any order (typically chronological)
- No position numbers
- Alphabetical or date sorting

### Collaborative Lists
- Multiple users can add shows
- Attribution for each contribution
- Approval process (optional)
- Edit history

### Personal Lists
- Private or public
- Single owner
- Shareable via link

### Dynamic Lists
- Auto-updated based on criteria
- "Top 10 Rated Shows"
- "Recently Added Shows"
- "Shows I Haven't Heard"

---

## List Statistics & Analytics

### List Metrics Displayed
1. **Engagement Metrics**:
   - Follower count
   - View count
   - Share count
   - Comment count

2. **Content Metrics**:
   - Show count
   - Date range (earliest → latest)
   - Average show rating
   - Total listening time

3. **Completion Metrics** (for followers):
   - Shows heard
   - Completion percentage
   - Time to complete
   - Badges for completion

4. **Contribution Metrics** (collaborative):
   - Contributors count
   - Most active contributor
   - Recent additions
   - Pending suggestions

---

## Performance Considerations

### Optimization
- Server-side rendering for list feed
- Lazy load list thumbnails
- Cached list statistics (5min)
- Progressive loading on scroll
- Debounced search and filter updates
- Prefetch list details on hover
- Virtual scrolling for long lists

### Accessibility
- Semantic HTML (ordered/unordered lists)
- Keyboard navigation (arrow keys, tab)
- ARIA labels for list actions
- Screen reader descriptions
- Focus management in modals
- High contrast badges

---

## Mobile Adaptations

### Mobile UX
- Single column list cards
- Sticky filter chip bar
- Bottom sheet for filters
- Pull-to-refresh
- Simplified list editor
- Swipe actions (follow, share)
- Fixed "Create List" FAB

### Responsive Breakpoints
- **Mobile (<640px)**: Single column, compact cards
- **Tablet (640px-1024px)**: Two-column grid
- **Desktop (>1024px)**: Three-column grid + sidebar

### Mobile-Specific Features
- Tap card for quick preview
- Swipe to follow/unfollow
- Native share sheet
- Haptic feedback

---

## Data Requirements

### API Endpoints

```typescript
GET /lists
  - Params: category, era, creator_type, list_type, show_count_range, sort, limit, offset
  - Returns: ListsList + pagination metadata
  - Response:
    {
      lists: ListSummary[];
      pagination: { total: number; offset: number; limit: number };
      available_filters: {
        categories: string[];
        eras: string[];
      };
    }

GET /lists/:id
  - Returns: Full list with shows, followers, stats
  - Response: FullList

POST /lists
  - Body: ListDraft
  - Requires: Authentication
  - Returns: Created list

PUT /lists/:id
  - Body: Partial list update
  - Requires: Authentication, ownership or collaborator
  - Returns: Updated list

DELETE /lists/:id
  - Requires: Authentication, ownership
  - Returns: { success: boolean }

POST /lists/:id/shows
  - Body: { show_id: number; notes?: string }
  - Requires: Authentication, permission to edit
  - Returns: Updated list

DELETE /lists/:id/shows/:showId
  - Requires: Authentication, permission to edit
  - Returns: Updated list

POST /lists/:id/follow
  - Requires: Authentication
  - Returns: { success: boolean }

DELETE /lists/:id/follow
  - Requires: Authentication
  - Returns: { success: boolean }

GET /lists/:id/followers
  - Returns: User[] (followers of list)

GET /lists/user/:username
  - Returns: Lists created by user

GET /lists/following
  - Requires: Authentication
  - Returns: Lists followed by current user

GET /lists/featured
  - Returns: Editor's picks and featured lists

GET /lists/trending
  - Returns: Lists gaining followers recently
```

### Caching Strategy
- List feed: 2min cache
- Individual list: 5min cache
- List shows: 5min cache
- Featured lists: 10min cache
- Trending lists: 5min cache
- User lists: 1min cache

---

## List Detail Page

### URL Structure
- `/lists/:listId` - Full page list detail
- `/lists/:listId/edit` - Edit mode (if owner/collaborator)
- `/lists/:listId/followers` - List followers
- `/lists/new` - Create new list

### List Detail Content Sections
1. **Hero Section**:
   - List title (large)
   - Creator info (avatar, username, profile link)
   - Collaborators (if applicable)
   - Follow/Unfollow button
   - Share button
   - Edit button (if owner)

2. **Description Section**:
   - Full list description
   - Category badge
   - Tags
   - Creation/update timestamps
   - Privacy status

3. **Statistics Section**:
   - Show count
   - Follower count
   - Date range
   - Average rating
   - Total duration

4. **Shows Section**:
   - Show cards (ranked or chronological)
   - Position numbers (if ranked)
   - Show thumbnails
   - Show details (date, venue, rating)
   - Added by attribution (if collaborative)
   - Show notes
   - Remove button (if editable)

5. **Engagement Section**:
   - Comments/discussions
   - Follower list preview
   - Related lists
   - Social sharing options

6. **Completion Tracking** (if following):
   - Progress bar
   - Shows heard/total
   - Next show in list
   - Completion achievements

---

## Social & Engagement Features

### List Following
- Follow button on list cards and detail pages
- Followed lists appear in sidebar
- Notifications for list updates
- Track completion progress

### List Sharing
- Share to Twitter/Facebook
- Copy link with OG preview
- Embed lists on external sites
- QR code for list (mobile)

### List Discussions
- Comment threads on lists
- Suggest shows to add
- Discuss show order (ranked lists)
- @mentions in comments

### List Collaboration
- Invite collaborators
- Approval workflow for suggestions
- Edit history and attribution
- Role-based permissions

### List Achievements
- "List Creator" badge
- "Popular Curator" (100+ followers)
- "List Completionist" (finished 10 lists)
- "Collaborative Contributor"

---

## Success Metrics

### Engagement KPIs
- Lists created per user
- Lists followed per user
- Average list follower count
- List completion rate
- Comment participation rate
- Collaborative contributions

### Discovery KPIs
- Lists discovered via search
- Lists discovered via filters
- Shows discovered via lists
- Conversion to show views

### Quality KPIs
- Average shows per list
- List update frequency
- User retention on followed lists
- List curation quality ratings

---

## Implementation Phases

### Phase 1 (MVP)
- Basic list creation and editing
- List feed with filtering
- Individual list pages
- Show addition/removal
- Follow/unfollow functionality
- Grid and list views

### Phase 2 (Enhanced)
- Ranked lists with reordering
- Collaborative lists
- List categories and tags
- Advanced filters
- List search
- Completion tracking
- List comments

### Phase 3 (Community)
- Dynamic lists
- List recommendations
- Collaborative approval workflow
- List analytics dashboard
- List templates
- Bulk list operations
- List achievements and gamification

---

## Open Questions for Architect

1. **List Limits**: Max shows per list? Max lists per user?
2. **Collaboration Model**: How to handle conflicting edits? Version control?
3. **List Privacy**: Should unlisted lists be indexable by search engines?
4. **Dynamic Lists**: How to define criteria for auto-updating lists?
5. **List Voting**: Should ranked lists allow community voting on order?
6. **List Archival**: Automatically archive inactive lists? Criteria?
7. **List Templates**: Pre-defined templates for common list types?

---

**Next Steps**:
- Architect reviews specification
- Define list data model and relationships
- Design mockups for list cards and detail pages
- Implement MVP (Phase 1)
- Create list editor interface
- Set up follower/subscription system
