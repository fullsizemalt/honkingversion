# Missing Features & Pages Analysis

**Date**: 2025-11-24
**Branch**: feature/page-content-specs
**Status**: Features identified from specs vs. current implementation

---

## 🔍 Analysis Summary

This document identifies features that are **specified in UX specs** but **not yet implemented** in the codebase, plus critical edge pages and admin functionality that should be considered.

---

## 1. Missing Core Features (Specified but Not Implemented)

### A. Review System
**Status**: Page exists but placeholder ("Coming soon...")
**Spec**: SPEC_Reviews_Page.md (430 lines)

**Missing Components**:
1. **ReviewComposer** - Rich text editor for writing reviews
   - Markdown support
   - Song-by-song ratings
   - Photo upload
   - Attendance verification prompt
   - Tag suggestions
   - Preview mode
   - Auto-save drafts
   - Word count indicator

2. **ReviewCard** - Feed display of reviews
   - Author byline with avatar
   - Star rating display
   - Excerpt with "Read more"
   - Reaction bar (emoji reactions)
   - Action menu (share, save, report)

3. **ReviewDetail** - Full review page
   - Full review text (formatted markdown)
   - Embedded media gallery
   - Tag cloud
   - Reaction buttons
   - Comment thread
   - Related reviews

4. **Review Moderation System**
   - Quality standards (min 100 chars)
   - Spam detection
   - Profanity filter
   - Report system
   - Attendance verification

**Missing Routes**:
- `/reviews` - Reviews landing page
- `/reviews/new?show=DATE` - Create review
- `/reviews/:id` - Individual review detail
- `/reviews/:id/edit` - Edit review

---

### B. Notification System
**Status**: Page exists but minimal (64 lines)
**Spec**: SPEC_Notifications_Page.md (504 lines)

**Missing Components**:
1. **NotificationSettings** - Granular preference control
   - Email notification settings
   - Push notification settings
   - In-app notification settings
   - Digest settings (daily/weekly)
   - Do Not Disturb scheduling
   - Per-notification-type toggles

2. **NotificationGrouping** - Smart notification aggregation
   - Group similar notifications
   - "John, Sarah, and 3 others liked your review"
   - Expandable groups

3. **NotificationBadge** - Global unread indicator
   - Header bell icon with count
   - Real-time updates
   - Animated pulse for new notifications

**Missing Features**:
- Email notifications
- Push notifications (browser/mobile)
- Real-time delivery (WebSocket/SSE)
- Notification grouping
- Mark all as read
- Bulk actions
- Notification preferences page

**Missing Routes**:
- `/notifications/settings` - Notification preferences
- WebSocket endpoint for real-time updates

---

### C. List System
**Status**: Partial implementation
**Spec**: SPEC_Lists_Page.md (637 lines)

**Missing Components**:
1. **ListEditor** - Create/edit interface
   - Title and description fields
   - Category selector
   - Tag input (autocomplete)
   - Privacy selector
   - Collaborative toggle
   - Ranked toggle
   - Show search and add
   - Drag-and-drop reordering
   - Show notes
   - Preview mode
   - Save draft

2. **CollaborativeList** features
   - Multi-user editing
   - Contributor attribution
   - Approval workflow
   - Edit history

3. **List Discovery** features
   - Featured lists section
   - Trending lists
   - List search
   - Advanced filters

**Missing Features**:
- List creation/editing interface
- Collaborative lists
- Ranked lists with drag-and-drop
- List categories and filtering
- List following/subscribing
- Completion tracking
- List discussions

**Missing Routes**:
- `/lists/new` - Create new list
- `/lists/:id/edit` - Edit list

---

### D. Performance Hub
**Status**: Page exists but placeholder ("Coming soon...")
**Spec**: SPEC_Performances_Page.md (385 lines)

**Missing Components**:
1. **PerformanceCard** - Feed display
   - Song name and show info
   - Rarity indicator
   - Vote buttons inline
   - Quick actions (compare, save)

2. **PerformanceFilters** - Advanced filtering
   - Song filter
   - Tour filter
   - Year filter
   - Rarity filter
   - Rating filter

3. **PerformanceTimeline** - Chronological view
   - Visual timeline
   - Filter by song/year
   - Navigate to specific dates

**Missing Routes**:
- `/performances` - Performances landing page
- `/performances/:id` - Individual performance detail

---

### E. Hub Pages (Specified but Not Implemented)

**Tours Hub** - SPEC_Tours_Page.md
- Status: Minimal (36 lines)
- Missing: Tour cards, filtering, tour detail pages, timeline view

**Years Hub** - SPEC_Years_Page.md
- Status: Minimal (36 lines)
- Missing: Year cards, statistics, year detail pages, timeline view

**Venues Hub** - SPEC_Venues_Page.md
- Status: Minimal (57 lines)
- Missing: Venue cards, map view, venue detail pages, filtering

**Songs Hub** - SPEC_Songs_Page.md
- Status: Exists but basic
- Missing: Frequency tiers, rarity indicators, trend charts, song detail with history

---

### F. Trending System
**Status**: Partial (home page has trending widget)
**Spec**: SPEC_Trending_Page.md (791 lines)

**Missing Components**:
1. **TrendChart** - Reusable line graph component
   - Micro sparkline (60x20px)
   - Card sparkline (200x60px)
   - Full chart (400x200px)
   - Smooth animations
   - Hover interactions

2. **TrendCard** - Trending item display
   - Rank badge
   - Trend graph integrated
   - Velocity indicator
   - Stats row

3. **VelocityBadge** - Visual velocity indicator
   - Fast rising (🔥 → linear graph)
   - Rising (📈 → linear graph)
   - Steady (💫 → linear graph)

**Missing Routes**:
- `/trending` - Trending page with all categories
- API endpoints for trend history

---

## 2. Missing Edge Pages

### A. Error & System Pages
**Current Status**:
- ✅ `/not-found` (404) - EXISTS (34 lines, basic)
- ✅ `/error` - EXISTS (47 lines, basic)
- ❌ **Maintenance Page** - MISSING
- ❌ **Rate Limit Page** - MISSING
- ❌ **Offline Page** - MISSING (PWA)
- ❌ **Loading States** - Global loading component

**Recommendations**:
- Create maintenance mode page (`/maintenance`)
- Create rate limit exceeded page (`/rate-limited`)
- Create offline fallback (PWA support)
- Enhance 404 with suggestions (search, popular pages)

---

### B. User Account Pages
**Current Status**:
- ✅ `/profile` - Own profile (140 lines)
- ✅ `/u/[username]` - Public profiles (173 lines)
- ❌ **Settings Page** - MISSING
- ❌ **Account Settings** - MISSING
- ❌ **Privacy Settings** - MISSING
- ❌ **Profile Edit** - MISSING
- ❌ **Email Preferences** - MISSING

**Missing Routes**:
- `/settings` or `/account/settings` - General settings
- `/settings/profile` - Edit profile
- `/settings/account` - Account management
- `/settings/privacy` - Privacy controls
- `/settings/notifications` - Notification preferences (links to Notifications settings)
- `/settings/data` - Data export/deletion

---

### C. Admin & Moderation Pages
**Current Status**: NONE EXIST

**Missing Pages**:
1. **Admin Dashboard** (`/admin`)
   - Site statistics
   - Recent activity
   - Moderation queue
   - User management
   - Content management

2. **Moderation Panel** (`/admin/moderate`)
   - Review reports
   - User reports
   - Comment moderation
   - Tag moderation
   - Show data verification

3. **User Management** (`/admin/users`)
   - User list
   - User roles
   - Ban/suspend users
   - User activity logs

4. **Content Moderation** (`/admin/content`)
   - Review moderation
   - Comment moderation
   - List moderation
   - Tag moderation

5. **Analytics Dashboard** (`/admin/analytics`)
   - Traffic statistics
   - User engagement metrics
   - Content popularity
   - Trend analysis

6. **System Settings** (`/admin/settings`)
   - Site configuration
   - Feature flags
   - Maintenance mode
   - Rate limits

---

## 3. Component-Level Missing Features

### A. Reusable Components Specified but Not Created

1. **TrendChart Component** (SPEC_Trending_Page.md)
   - Linear sparkline graphs
   - Three size variants
   - Animated rendering
   - Color-coded trends
   - **Use across site**: Home, Trending, Detail pages

2. **ReviewComposer Component** (SPEC_Reviews_Page.md)
   - Rich text editor
   - Markdown preview
   - Media upload
   - Draft auto-save

3. **ListEditor Component** (SPEC_Lists_Page.md)
   - Drag-and-drop ordering
   - Show search and add
   - Collaborative features

4. **NotificationSettings Component** (SPEC_Notifications_Page.md)
   - Granular toggles
   - Channel preferences
   - Do Not Disturb scheduler

5. **MapView Component** (SPEC_Venues_Page.md)
   - Interactive map
   - Venue pins
   - Clustering
   - Popup cards

6. **YearTimeline Component** (SPEC_Years_Page.md)
   - Horizontal timeline
   - Activity indicators
   - Interactive year markers

7. **TourTimeline Component** (SPEC_Tours_Page.md)
   - Tour bubble visualization
   - Era color coding
   - Interactive hover

---

### B. Shared UI Components Needed

1. **MarkdownEditor**
   - Used by: Reviews, Comments, Lists
   - Features: Preview, toolbar, shortcuts

2. **MediaUploader**
   - Used by: Reviews, Profile, Lists
   - Features: Drag-drop, crop, preview

3. **AdvancedSearch**
   - Multi-field search
   - Filter builder
   - Saved searches

4. **DataTable**
   - Sortable columns
   - Pagination
   - Export functionality
   - Used by: Admin pages, Stats

5. **ConfirmDialog**
   - Reusable confirmation modal
   - Used across: Delete actions, destructive operations

6. **EmptyState**
   - Consistent empty state design
   - Call-to-action
   - Illustration/icon

---

## 4. Authentication & Authorization Gaps

### Missing Auth Features:

1. **Email Verification**
   - Verify email on signup
   - Resend verification email
   - Email change verification

2. **Password Reset Flow**
   - Forgot password
   - Reset token validation
   - Password strength requirements

3. **Two-Factor Authentication**
   - Setup 2FA
   - Recovery codes
   - 2FA login flow

4. **Social Login** (Optional)
   - OAuth providers
   - Link/unlink social accounts

5. **Session Management**
   - Active sessions list
   - Remote logout
   - Device management

6. **Role-Based Access Control**
   - User roles (admin, moderator, user)
   - Permission system
   - Protected routes

---

## 5. API Gaps (Specified but Not Implemented)

Based on specs, these API endpoints are defined but may not exist:

### Reviews API:
- `GET /reviews` - List reviews
- `GET /reviews/:id` - Get review
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review
- `POST /reviews/:id/react` - React to review
- `POST /reviews/:id/comments` - Comment on review

### Notifications API:
- `GET /notifications` - Get notifications
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/mark-all-read` - Mark all as read
- `GET /notifications/settings` - Get preferences
- `PUT /notifications/settings` - Update preferences
- `WebSocket /notifications/stream` - Real-time updates

### Lists API (Partial):
- `POST /lists` - Create list
- `PUT /lists/:id` - Update list
- `POST /lists/:id/shows` - Add show to list
- `DELETE /lists/:id/shows/:showId` - Remove show
- `POST /lists/:id/follow` - Follow list
- `DELETE /lists/:id/follow` - Unfollow list

### Trending API:
- `GET /trending` - Get trending items
- `GET /trending/:type/:id/history` - Get trend history
- `GET /trending/stats/summary` - Trending stats

### Tours/Years/Venues/Songs APIs:
- Multiple endpoints defined in each spec

---

## 6. Data & Backend Infrastructure Gaps

### Specified but May Not Exist:

1. **Trend Data Collection**
   - Hourly snapshots of votes/activity
   - Trend calculation pipeline
   - Velocity computation

2. **Notification System**
   - Notification queue
   - Email service integration
   - Push notification service
   - Real-time delivery mechanism

3. **Media Storage**
   - Image upload and storage
   - CDN integration
   - Image optimization

4. **Search Infrastructure**
   - Full-text search
   - Search indexing
   - Autocomplete service

5. **Caching Layer**
   - Redis for caching
   - Cache invalidation strategies
   - Configured per endpoint

6. **Rate Limiting**
   - Per-user rate limits
   - API throttling
   - DDoS protection

---

## 7. Mobile & PWA Features

### Missing PWA Features:
- ❌ **Service Worker** - Offline support
- ❌ **Web App Manifest** - Install prompt
- ❌ **Push Notifications** - Mobile notifications
- ❌ **Offline Fallback** - Cached pages
- ❌ **Background Sync** - Queue actions offline

---

## 8. Analytics & Monitoring

### Missing Analytics:
- ❌ **User Analytics** - Pageviews, sessions, bounce rate
- ❌ **Performance Monitoring** - Load times, errors
- ❌ **Error Tracking** - Sentry/similar integration
- ❌ **Engagement Metrics** - Votes, reviews, list follows
- ❌ **Search Analytics** - Popular searches, no-results queries

---

## 9. Priority Ranking

### 🔴 High Priority (Core Features):
1. **User Settings Page** - Critical for user experience
2. **Review System** - Core content creation
3. **Notification Settings** - User control over alerts
4. **List Editor** - Core feature completion
5. **TrendChart Component** - Visual enhancement across site

### 🟠 Medium Priority (Enhanced UX):
1. **Admin Panel** - Content moderation
2. **Hub Page Implementations** (Tours, Years, Venues, Songs full features)
3. **Advanced Search** - Discovery improvement
4. **Profile Editing** - User customization
5. **Email Verification** - Security

### 🟡 Lower Priority (Nice-to-Have):
1. **PWA Features** - Mobile enhancement
2. **2FA** - Additional security
3. **Social Login** - Convenience
4. **Analytics Dashboard** - Insights
5. **Advanced Moderation Tools**

---

## 10. Recommended Specs to Create

### A. User Settings Page Spec
**Route**: `/settings`
**Priority**: High
**Reason**: Critical user-facing feature, referenced across multiple specs

**Should Include**:
- Profile settings (edit profile)
- Account settings (email, password)
- Privacy settings (visibility, data)
- Notification preferences (link to Notifications settings)
- Data management (export, delete account)

### B. Admin Dashboard Spec
**Route**: `/admin`
**Priority**: Medium
**Reason**: Essential for content moderation and site management

**Should Include**:
- Dashboard overview
- Moderation queue
- User management
- Content management
- Analytics
- System settings

### C. Maintenance & Error Pages Spec
**Routes**: `/maintenance`, `/rate-limited`, `/offline`
**Priority**: Medium
**Reason**: Critical for site reliability and user communication

**Should Include**:
- Maintenance mode page
- Rate limit page
- Offline fallback
- Enhanced 404 with search

---

## 11. Next Steps

### Immediate Actions:
1. **Create User Settings Page Spec** - Fill critical gap
2. **Create Admin Dashboard Spec** - Enable moderation
3. **Prioritize feature implementation** with architect
4. **Review API readiness** - Ensure backend supports spec features

### Documentation:
1. Update PAGE_AUDIT.md with this analysis
2. Create implementation roadmap
3. Define MVP vs. Enhanced vs. Advanced features for each

### Development:
1. Implement TrendChart component (reusable across site)
2. Build User Settings page (high priority)
3. Implement Review system (core feature)
4. Build Admin panel (moderation needs)

---

**Analysis Complete**
**Total Specs Reviewed**: 10
**Total Missing Features Identified**: 50+
**Critical Pages Missing**: 3 (Settings, Admin, Maintenance)
**Reusable Components Needed**: 13
