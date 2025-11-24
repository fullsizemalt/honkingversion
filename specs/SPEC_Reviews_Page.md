# UX Specification: Reviews Page

**Route**: `/reviews`  
**Status**: Needs Implementation  
**Priority**: High - Core Feature  
**Last Updated**: 2025-11-24

---

## User Needs & Goals

### Primary Users
1. **Review Readers** - Fans reading detailed show retrospectives
2. **Review Writers** - Users sharing in-depth concert experiences
3. **Show Researchers** - Analysts studying reception patterns

### User Goals
- Read comprehensive show reviews from community
- Write detailed reviews of shows attended
- Discover highly-rated shows worth listening to
- Follow favorite reviewers
- Engage with reviews (reactions, comments)

---

## Content Strategy

### Core Content Elements
1. **Review Cards**:
   - Author profile (avatar, username, review count)
   - Show details (date, venue, tour)
   - Star rating (1-5)
   - Review excerpt (first 200 chars)
   - Engagement metrics (reactions, comments)
   - Timestamp

2. **Full Reviews**:
   - Complete review text (markdown support)
   - Individual song ratings
   - Embedded media (photos, audio links)
   - Tagged moments ("best jam", "emotional high")
   - Context tags (first show, milestone, special guest)

3. **Review Metadata**:
   - Attendance verification status
   - Review helpfulness score
   - Community badges (verified, top reviewer, frequent)

---

## Information Architecture

```
/reviews
├── Hero Section
│   ├── "Concert Reviews"
│   ├── "Read and share detailed show experiences"
│   └── CTA: "Write a Review" (if authenticated)
│
├── Featured Reviews Section
│   ├── Editor's picks
│   ├── Recent highlights
│   └── Most discussed
│
├── Filter & Sort Bar
│   ├── Filter by:
│   │   ├── Time period (date range)
│   │   ├── Tour
│   │   ├── Rating (4+ stars, etc.)
│   │   ├── Review length (brief, detailed, epic)
│   │   └── Has media (photos, audio)
│   ├── Sort by:
│   │   ├── Recent
│   │   ├── Popular (reactions)
│   │   ├── Highly rated
│   │   └── Most comments
│   └── View: List | Grid
│
├── Reviews Feed
│   ├── Review cards (infinite scroll)
│   ├── Sponsored/featured cards (optional)
│   └── Loading skeletons
│
└── Sidebar (desktop)
    ├── Top Reviewers This Month
    ├── Most Reviewed Shows
    └── Write Review CTA
```

---

## UI Components

### 1. ReviewCard (Feed View)
```typescript
interface ReviewCardProps {
  review: {
    id: number;
    author: User;
    show: Show;
    rating: number;
    excerpt: string;
    full_text: string;
    created_at: string;
    reactions_count: number;
    comments_count: number;
    has_media: boolean;
    is_verified_attendance: boolean;
    helpfulness_score: number;
  };
  onReact: (emoji: string) => void;
  onShare: () => void;
  onSave: () => void;
}
```

**Visual Design**:
- Clean card with show thumbnail
- Author byline with avatar
- Star rating prominently displayed
- Excerpt with "Read more" expansion
- Reaction bar (emoji reactions)
- Action menu (share, save, report)

### 2. ReviewComposer
```typescript
interface ReviewComposerProps {
  show: Show;
  onSubmit: (review: ReviewDraft) => void;
  onSaveDraft: (draft: ReviewDraft) => void;
  existingDraft?: ReviewDraft;
}
```

**Features**:
- Rich text editor (markdown support)
- Song-by-song ratings (optional)
- Photo upload
- Attendance verification prompt
- Tag suggestions (mood, highlights)
- Preview mode
- Auto-save drafts
- Word count indicator

### 3. ReviewDetail (Full Page View)
```typescript
interface ReviewDetailProps {
  review: FullReview;
  onReact: (emoji: string) => void;
  onComment: (text: string) => void;
}
```

**Layout**:
- Hero section with show details
- Author bio section
- Full review text (formatted markdown)
- Embedded media gallery
- Tag cloud
- Reaction buttons
- Comment thread
- Related reviews

---

## User Flows

### Flow 1: Read Reviews
```
User arrives at /reviews
  ↓
Sees featured/recent reviews
  ↓
Applies filter "5-star reviews from 2024"
  ↓
Clicks intriguing review card
  ↓
Reads full review on detail page
  ↓
Reacts with emoji, leaves comment
  ↓
Follows the author
```

### Flow 2: Write Review
```
User navigates from show page
  ↓
Clicks "Write Review"
  ↓
Redirected to /reviews/new?show=DATE
  ↓
Fills out review form (rating, text, tags)
  ↓
Previews review
  ↓
Submits
  ↓
Review published, shared to profile
  ↓
Prompt to share on social media
```

### Flow 3: Discover Shows via Reviews
```
Looking for highly-rated shows to listen to
  ↓
Filters by "5 stars only"
  ↓
Sorts by "Most reactions"
  ↓
Finds consensus great show
  ↓
Clicks show link from review
  ↓
Views show page with streaming links
```

---

## States & Edge Cases

### Empty States
1. **No reviews exist yet**:
   - "Be the first to review a show!"
   - Show recently attended shows as suggestions

2. **No reviews match filters**:
   - "No reviews match your criteria"
   - Suggest broadening filters
   - Show closest matches

3. **User has no reviews (profile view)**:
   - "Start reviewing shows you've attended"
   - Show attended shows awaiting review

### Loading States
- Skeleton cards while loading feed
- Progressive image loading
- "Loading more reviews" on scroll

### Error States
- Failed to submit: "Review saved as draft"
- Network error: Retry with cached draft
- Duplicate review: "You've already reviewed this show"

---

## Review Moderation

### Quality Standards
- Minimum length: 100 characters
- Spam detection (repeated phrases, external links)
- Profanity filter (with context awareness)
- Report system (abuse, spoilers, off-topic)

### Verification
- Attendance verification via:
  - Ticket stub upload
  - Location check-in (during show window)
  - Community vouching (3+ verified users confirm)

### Review Guidelines
- Respectful language required
- Constructive criticism encouraged
- No setlist spoilers without warning
- Attribution for media (photos, quotes)

---

## Engagement Features

### Reactions
- Emoji reactions: 🔥 (fire), ❤️ (love), 😮 (wow), 🎵 (musical), 🙌 (agree)
- Reaction counts shown
- User's reactions highlighted
- Most-reacted reviews promoted

### Comments
- Nested comment threads
- @mentions
- Markdown support
- Comment reactions
- Sort by: Recent, Popular

### Social Integration
- Share to Twitter/Facebook with preview card
- Copy link with OG tags
- Embed reviews on external sites
- RSS feed for reviews

---

## Performance Considerations

### Optimization
- Server-side rendering for SEO
- Progressive loading (reviews in viewport first)
- Image CDN with lazy loading
- Markdown parsed server-side
- Cached review excerpts
- Debounced filter updates

### Accessibility
- Semantic HTML (article, header, footer)
- Skip links for keyboard navigation
- Alt text for user avatars
- ARIA live regions for reactions
- High contrast text ratios
- Screen reader friendly review metadata

---

## Mobile Adaptations

### Mobile UX
- Swipe between reviews (Tinder-style option)
- Fixed "Write Review" FAB
- Bottom sheet for filters
- Pull-to-refresh
- Simplified composer (basic editor)
- Voice-to-text for drafting

### Responsive Layout
- Single column on mobile
- 2-column grid on tablet
- 3-column with sidebar on desktop

---

## Data Requirements

### API Endpoints
```typescript
GET /reviews
  - Params: show_id, tour_id, author_id, rating_min, time_range, has_media, sort, limit, offset
  - Returns: ReviewList + pagination metadata

GET /reviews/:id
  - Returns: Full review with comments, reactions, author profile

POST /reviews
  - Body: { show_id, rating, text, tags, media_urls }
  - Requires: Authentication, attendance verification
  - Returns: Created review

PUT /reviews/:id
  - Body: Partial review update
  - Requires: Author authentication

POST /reviews/:id/react
  - Body: { emoji }
  - Requires: Authentication

POST /reviews/:id/comments
  - Body: { text, parent_id? }
  - Requires: Authentication

GET /reviews/drafts
  - Returns: User's saved drafts
```

### Caching Strategy
- Review feed: 30s cache
- Individual review: 5min cache
- User drafts: No cache
- Reactions/comments: 10s cache
- Top reviewers: 1hr cache

---

## Success Metrics

### Engagement KPIs
- Reviews written per user
- Review completion rate (started → published)
- Average review length
- Reaction engagement rate
- Comment participation rate
- Return visits to reviews page

### Quality KPIs
- % reviews with verification
- Average helpfulness score
- Report rate (lower is better)
- Review edit rate

---

## Implementation Phases

### Phase 1 (MVP)
- Basic review creation (text + rating)
- Review feed with filters
- Individual review pages
- Reaction system (simple likes)

### Phase 2 (Enhanced)
- Rich text editor (markdown)
- Photo uploads
- Comment threads
- Attendance verification
- Advanced filters

### Phase 3 (Community)
- Top reviewers leaderboard
- Review badges/achievements
- Follower system for authors
- Review collections/playlists
- Review reminders (for attended shows)

---

## Open Questions for Architect

1. **Attendance Verification**: How important is verification vs. friction in writing reviews?
2. **Media Storage**: Where/how do we host uploaded photos?
3. **Moderation**: Manual review vs. automated + community flagging?
4. **Setlist Integration**: Should reviews include editable setlists?
5. **Review Ownership**: Can users delete old reviews or just edit?
6. **Monetization**: Featured reviews or reviews from sponsors?

---

**Next Steps**:
- Architect reviews specification
- Design mockups for review card & composer
- Implement MVP (Phase 1)
- Beta test with active community members
