# UX Specification: Admin Dashboard & Moderation Panel

**Route**: `/admin`
**Status**: Needs Implementation
**Priority**: Medium - Content Management & Moderation
**Last Updated**: 2025-11-24

---

## User Needs & Goals

### Primary Users
1. **Site Administrators** - Managing overall site operations
2. **Moderators** - Reviewing flagged content and user reports
3. **Content Managers** - Curating featured content
4. **Support Staff** - Helping users and resolving issues

### User Goals
- Monitor site health and activity
- Moderate user-generated content
- Manage user accounts and permissions
- Review and respond to reports
- Curate featured content
- Access analytics and insights
- Configure site settings

---

## Content Strategy

### Core Admin Functions

1. **Dashboard Overview**:
   - Site statistics (users, content, activity)
   - Recent activity feed
   - Pending moderation queue
   - Alert notifications
   - Quick actions

2. **Moderation**:
   - Content reports (reviews, comments, lists)
   - User reports (spam, abuse, harassment)
   - Flagged content review
   - Ban/suspend actions
   - Moderation log

3. **User Management**:
   - User list and search
   - User roles and permissions
   - Account actions (ban, suspend, verify)
   - User activity logs
   - Bulk actions

4. **Content Management**:
   - Review moderation
   - Comment moderation
   - List moderation
   - Tag management
   - Show data verification
   - Featured content curation

5. **Analytics**:
   - Traffic statistics
   - User engagement metrics
   - Content popularity
   - Trending analysis
   - Growth metrics

6. **System Settings**:
   - Site configuration
   - Feature flags
   - Maintenance mode
   - Rate limits
   - Email templates

---

## Information Architecture

```
/admin
├── Dashboard (Home)
│   ├── Stats Overview
│   ├── Recent Activity
│   ├── Moderation Queue
│   └── Quick Actions
│
├── Moderation (/admin/moderate)
│   ├── Reports Queue
│   ├── Flagged Content
│   ├── Pending Reviews
│   └── Moderation Log
│
├── Users (/admin/users)
│   ├── User List
│   ├── User Search
│   ├── User Detail
│   └── Bulk Actions
│
├── Content (/admin/content)
│   ├── Reviews
│   ├── Comments
│   ├── Lists
│   ├── Tags
│   └── Shows
│
├── Analytics (/admin/analytics)
│   ├── Overview
│   ├── Users
│   ├── Content
│   └── Trends
│
└── Settings (/admin/settings)
    ├── General
    ├── Features
    ├── Maintenance
    └── System
```

---

## UI Components

### 1. AdminDashboard (Overview)
```typescript
interface AdminDashboardProps {
  stats: SiteStats;
  recentActivity: Activity[];
  moderationQueue: ModerationItem[];
  alerts: Alert[];
}

interface SiteStats {
  users: {
    total: number;
    active_today: number;
    new_this_week: number;
  };
  content: {
    total_reviews: number;
    total_lists: number;
    total_votes: number;
  };
  moderation: {
    pending_reports: number;
    pending_reviews: number;
    flagged_content: number;
  };
  traffic: {
    page_views_today: number;
    unique_visitors_today: number;
    avg_session_duration: number;
  };
}
```

**Layout**:
- **Top Stats Row**: Cards with key metrics
- **Moderation Queue**: Pending items requiring action
- **Recent Activity**: Live feed of site activity
- **Alerts**: System alerts and warnings
- **Quick Actions**: Common admin tasks

**Widgets**:
- Active users (real-time count)
- Moderation queue size
- Recent registrations
- Trending content
- System health status

### 2. ModerationQueue
```typescript
interface ModerationQueueProps {
  reports: Report[];
  onApprove: (reportId: number) => void;
  onReject: (reportId: number) => void;
  onBan: (userId: number, reason: string, duration?: number) => void;
}

interface Report {
  id: number;
  type: 'review' | 'comment' | 'user' | 'list';
  target_id: number;
  target_content: string | object;
  reason: ReportReason;
  reporter: User;
  reported_user: User;
  created_at: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  assigned_to?: User;
}

type ReportReason =
  | 'spam'
  | 'harassment'
  | 'hate_speech'
  | 'inappropriate'
  | 'misinformation'
  | 'copyright'
  | 'other';
```

**Features**:
- **Filter by type**: Reviews, Comments, Users, Lists
- **Filter by reason**: Spam, Harassment, etc.
- **Sort by**: Date, Priority, Reporter reputation
- **Quick actions**: Approve, Reject, Delete, Ban
- **Batch processing**: Select multiple, bulk actions
- **Moderator notes**: Internal notes per report

**Report Card**:
- Report reason and description
- Reporter info (username, reputation)
- Reported content preview
- Reported user info
- Action buttons (Approve, Reject, Delete, Ban User)
- "View Full Content" link
- Moderator note field

### 3. UserManagement
```typescript
interface UserManagementProps {
  users: User[];
  onSearch: (query: string) => void;
  onFilter: (filters: UserFilters) => void;
  onUserAction: (userId: number, action: UserAction) => void;
}

interface UserFilters {
  role?: ('user' | 'moderator' | 'admin')[];
  status?: ('active' | 'banned' | 'suspended')[];
  created_after?: string;
  last_active_after?: string;
}

type UserAction =
  | { type: 'ban'; duration?: number; reason: string }
  | { type: 'suspend'; duration: number; reason: string }
  | { type: 'unban' }
  | { type: 'verify' }
  | { type: 'promote'; role: string }
  | { type: 'demote' }
  | { type: 'reset_password' }
  | { type: 'delete_account'; reason: string };
```

**User List Table**:
- Columns: Username, Email, Role, Status, Joined, Last Active, Actions
- Sortable columns
- Pagination
- Bulk select
- Export to CSV

**User Detail Page**:
- User profile information
- Activity summary (votes, reviews, lists)
- Moderation history
- Account actions
- Activity log
- Notes (internal)

**User Actions**:
- Ban user (permanent or temporary)
- Suspend user (temporary)
- Verify user (mark as trusted)
- Change user role
- Reset password (send email)
- Delete account (with confirmation)

### 4. ContentModeration
```typescript
interface ContentModerationProps {
  content: ContentItem[];
  contentType: 'reviews' | 'comments' | 'lists' | 'tags';
  onModerate: (contentId: number, action: ModerationAction) => void;
}

interface ContentItem {
  id: number;
  type: 'review' | 'comment' | 'list' | 'tag';
  content: string | object;
  author: User;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  flags_count: number;
  reports: Report[];
}

type ModerationAction =
  | { type: 'approve' }
  | { type: 'reject'; reason: string }
  | { type: 'delete'; reason: string }
  | { type: 'edit'; updates: object }
  | { type: 'flag'; reason: string };
```

**Tabs**:
- Reviews
- Comments
- Lists
- Tags
- Shows (data verification)

**Per-Tab Features**:
- Filter by status (pending, approved, flagged)
- Sort by date, reports, author
- Bulk actions
- Quick preview
- Full content view
- Edit capability

### 5. AnalyticsDashboard
```typescript
interface AnalyticsDashboardProps {
  timeRange: TimeRange;
  metrics: Analytics;
}

interface Analytics {
  traffic: {
    page_views: DataPoint[];
    unique_visitors: DataPoint[];
    bounce_rate: number;
    avg_session_duration: number;
  };
  users: {
    new_signups: DataPoint[];
    active_users: DataPoint[];
    retention_rate: number;
    churn_rate: number;
  };
  content: {
    new_reviews: DataPoint[];
    new_lists: DataPoint[];
    votes_cast: DataPoint[];
    engagement_rate: number;
  };
  popular: {
    top_pages: PageStats[];
    top_performances: Performance[];
    top_songs: Song[];
    top_users: User[];
  };
}

interface DataPoint {
  timestamp: string;
  value: number;
}
```

**Charts**:
- Line charts for time-series data
- Bar charts for comparisons
- Pie charts for distributions
- Trend indicators (up/down, percentage)

**Metrics Displayed**:
- Traffic (pageviews, visitors, bounce rate)
- User growth (signups, active, retention)
- Content creation (reviews, lists, votes)
- Engagement (comments, reactions, shares)
- Popular content (top performers)

**Time Ranges**:
- Last 24 hours
- Last 7 days
- Last 30 days
- Last 90 days
- Custom range

**Export**:
- Export data as CSV
- Schedule reports (daily/weekly email)

### 6. SystemSettings
```typescript
interface SystemSettingsProps {
  settings: SystemConfig;
  onUpdate: (settings: Partial<SystemConfig>) => void;
}

interface SystemConfig {
  site: {
    name: string;
    description: string;
    url: string;
    logo_url: string;
  };
  features: {
    registration_enabled: boolean;
    reviews_enabled: boolean;
    lists_enabled: boolean;
    comments_enabled: boolean;
  };
  moderation: {
    auto_approve_reviews: boolean;
    auto_approve_comments: boolean;
    profanity_filter: boolean;
    spam_detection: boolean;
  };
  limits: {
    max_review_length: number;
    max_list_size: number;
    rate_limit_per_hour: number;
  };
  maintenance: {
    enabled: boolean;
    message: string;
    allowed_ips: string[];
  };
}
```

**Settings Sections**:

**General**:
- Site name and description
- Logo and branding
- Contact information
- Social media links

**Features**:
- Feature flags (enable/disable features)
- Beta features
- Experimental features

**Moderation**:
- Auto-approval settings
- Spam filters
- Profanity filter
- Content flags thresholds

**Limits**:
- Rate limits
- Content size limits
- User limits

**Maintenance**:
- Maintenance mode toggle
- Maintenance message
- Whitelist IPs (for testing)

---

## User Flows

### Flow 1: Review Flagged Content
```
Moderator logs into admin panel
  ↓
Sees "5 Pending Reports" on dashboard
  ↓
Clicks to view moderation queue
  ↓
Reviews first report (spam review)
  ↓
Reads review content
  ↓
Checks reporter's history (reliable)
  ↓
Decides review is spam
  ↓
Clicks "Delete & Ban User"
  ↓
Enters ban reason
  ↓
Confirms action
  ↓
Review deleted, user banned
  ↓
Email notification sent to user
  ↓
Next report loaded
```

### Flow 2: Manage User Account
```
Admin needs to verify user
  ↓
Goes to Users section
  ↓
Searches for user by username
  ↓
Clicks user to view detail
  ↓
Reviews user activity (positive)
  ↓
Clicks "Verify User"
  ↓
Confirms action
  ↓
User marked as verified
  ↓
User receives verification badge
  ↓
Email notification sent to user
```

### Flow 3: Curate Featured Content
```
Content manager reviewing trending lists
  ↓
Goes to Content → Lists
  ↓
Filters by "Most Popular This Week"
  ↓
Finds high-quality list
  ↓
Opens list detail
  ↓
Reviews content (excellent)
  ↓
Clicks "Feature This List"
  ↓
List appears in Featured section
  ↓
Creator notified
```

### Flow 4: Enable Maintenance Mode
```
Admin planning system update
  ↓
Goes to Settings → Maintenance
  ↓
Toggles "Maintenance Mode" ON
  ↓
Enters maintenance message
  ↓
Adds own IP to whitelist
  ↓
Clicks "Save Changes"
  ↓
Site enters maintenance mode
  ↓
Public users see maintenance page
  ↓
Admin can still access site
```

---

## States & Edge Cases

### Empty States
1. **No pending reports**:
   - "All caught up! No reports to review"
   - Congratulations message

2. **No users found**:
   - "No users match your search"
   - Suggest broadening search

3. **No activity**:
   - "No recent activity"
   - Show when last activity occurred

### Loading States
- Skeleton tables while loading data
- Spinner on action buttons
- Progressive loading for large datasets
- "Processing..." on batch actions

### Error States
- **Action failed**: Error message, retry button
- **Permission denied**: "You don't have permission for this action"
- **Network error**: "Couldn't connect to server", retry
- **Validation error**: Inline form errors

### Special States
- **Batch action in progress**: Progress bar
- **Action requires confirmation**: Confirmation modal
- **User already banned**: "User is already banned"
- **Content already deleted**: "Content no longer exists"

---

## Permissions & Roles

### Role Hierarchy:
1. **Admin** - Full access to everything
2. **Moderator** - Content moderation, limited user actions
3. **Content Manager** - Content curation, no user management
4. **Support** - View-only access, can reset passwords

### Permissions Matrix:
```
Action                    | Admin | Moderator | Content Mgr | Support
-------------------------|-------|-----------|-------------|--------
View Dashboard           |   ✅   |     ✅     |      ✅      |   ✅
Moderate Content         |   ✅   |     ✅     |      ✅      |   ❌
Ban Users                |   ✅   |     ✅     |      ❌      |   ❌
Delete Accounts          |   ✅   |     ❌     |      ❌      |   ❌
Feature Content          |   ✅   |     ❌     |      ✅      |   ❌
View Analytics           |   ✅   |     ✅     |      ✅      |   ✅
Change Settings          |   ✅   |     ❌     |      ❌      |   ❌
Manage Users             |   ✅   |     ⚠️     |      ❌      |   ⚠️
Reset Passwords          |   ✅   |     ❌     |      ❌      |   ✅
```

---

## Security Considerations

### Access Control:
- Role-based access control (RBAC)
- Permission checks on every action
- Audit log for all admin actions
- Two-factor authentication required for admins

### Action Confirmation:
- Confirmation required for destructive actions
- Re-authentication for sensitive actions
- Moderator notes required for bans

### Audit Trail:
- Log all admin actions
- Who, what, when, why (reason)
- IP address tracking
- Searchable audit log

---

## Performance Considerations

### Optimization
- Server-side rendering for admin pages
- Pagination for large datasets
- Debounced search
- Cached statistics (5min)
- Background jobs for batch actions
- Virtual scrolling for long lists

### Accessibility
- Semantic HTML
- Keyboard shortcuts for common actions
- ARIA labels for actions
- Screen reader support
- High contrast mode
- Focus management in modals

---

## Mobile Adaptations

### Mobile Admin:
- **Not recommended** for full admin tasks
- **Dashboard only** optimized for mobile
- **Quick actions** available
- **Moderation** possible but limited
- **Analytics** view-only

### Responsive Design:
- Dashboard: Mobile-friendly
- Tables: Horizontal scroll
- Actions: Bottom sheet
- Moderation: Simplified view

---

## Data Requirements

### API Endpoints

```typescript
GET /admin/dashboard
  - Requires: Admin or Moderator role
  - Returns: Dashboard statistics and activity

GET /admin/moderation/queue
  - Params: type, status, sort, limit, offset
  - Requires: Admin or Moderator role
  - Returns: Moderation queue items

POST /admin/moderation/:reportId/resolve
  - Body: { action: 'approve' | 'reject' | 'delete', reason?: string }
  - Requires: Admin or Moderator role
  - Returns: Success

GET /admin/users
  - Params: search, role, status, sort, limit, offset
  - Requires: Admin role
  - Returns: User list

GET /admin/users/:id
  - Requires: Admin or Moderator role
  - Returns: User detail with activity

POST /admin/users/:id/action
  - Body: UserAction
  - Requires: Admin role (some actions require Admin only)
  - Returns: Success

GET /admin/content/:type
  - Params: type (reviews, comments, lists, tags), status, sort, limit, offset
  - Requires: Admin or Content Manager role
  - Returns: Content list

POST /admin/content/:id/moderate
  - Body: ModerationAction
  - Requires: Admin or Moderator role
  - Returns: Success

GET /admin/analytics
  - Params: time_range, metric_type
  - Requires: Admin role
  - Returns: Analytics data

GET /admin/settings
  - Requires: Admin role
  - Returns: System settings

PUT /admin/settings
  - Body: Partial system settings
  - Requires: Admin role
  - Returns: Updated settings

GET /admin/audit-log
  - Params: user_id, action_type, start_date, end_date, limit, offset
  - Requires: Admin role
  - Returns: Audit log entries
```

### Caching Strategy
- Dashboard stats: 5min cache
- Moderation queue: No cache (real-time)
- User list: 1min cache
- Content list: 1min cache
- Analytics: 15min cache
- Settings: 5min cache

---

## Success Metrics

### Moderation Efficiency:
- Average time to resolve report
- Reports resolved per moderator
- False positive rate
- User satisfaction with moderation

### System Health:
- Uptime percentage
- Error rate
- Response time
- Queue size (moderation backlog)

### Content Quality:
- Spam detection rate
- Moderation accuracy
- User report rate
- Content removal rate

---

## Implementation Phases

### Phase 1 (MVP)
- Admin dashboard (basic stats)
- Moderation queue (reports)
- User management (list, search, ban)
- Basic content moderation
- Simple analytics

### Phase 2 (Enhanced)
- Advanced analytics with charts
- Batch actions
- Audit log
- Featured content curation
- System settings
- Moderator notes

### Phase 3 (Advanced)
- Real-time dashboard updates
- Automated moderation tools
- ML-powered spam detection
- Advanced reporting
- Custom admin roles
- Scheduled reports

---

## Design Specifications

### Layout:
- **Sidebar**: 250px fixed, admin navigation
- **Header**: Admin actions, notifications, user menu
- **Content Area**: Max-width 1200px
- **Color Scheme**: Professional, distinct from public site

### Typography:
- Headers: Space Grotesk, bold
- Body: IBM Plex Mono
- Monospace for IDs/codes

### Colors:
- **Admin Theme**: Dark sidebar, light content area
- **Actions**: Red (destructive), Green (approve), Blue (edit)
- **Status**: Green (active), Red (banned), Yellow (flagged)

---

## Open Questions for Architect

1. **Moderation Workflow**: Single-step or multi-step approval process?
2. **User Appeals**: Allow users to appeal bans/deletions?
3. **Automated Moderation**: Implement ML-based spam detection?
4. **Audit Retention**: How long to keep audit logs?
5. **Admin Hierarchy**: Support sub-admins with limited permissions?
6. **Content Quarantine**: Quarantine vs. immediate deletion?
7. **Rate Limits**: Admin-specific rate limits or bypass?

---

**Next Steps**:
- Architect reviews specification
- Define admin role structure
- Design admin UI mockups
- Implement admin authentication
- Build moderation queue
- Create user management tools
