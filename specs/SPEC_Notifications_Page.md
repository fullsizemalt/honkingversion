# UX Specification: Notifications Page

**Route**: `/notifications`
**Status**: Needs Implementation
**Priority**: Medium - User Engagement Feature
**Last Updated**: 2025-11-24

---

## User Needs & Goals

### Primary Users
1. **Active Community Members** - Users engaging with content and following others
2. **Content Creators** - Users who post reviews, lists, and comments
3. **Social Users** - Users tracking friends' activity and interactions
4. **Completionists** - Users following shows, tours, and songs

### User Goals
- Stay updated on relevant activity and interactions
- See responses to their content (comments, reactions)
- Track activity from followed users
- Get notified of important events (new shows, tour announcements)
- Manage notification preferences
- Reduce notification fatigue

---

## Content Strategy

### Core Notification Types

#### Social Notifications
1. **Follower Activity**:
   - New follower
   - Someone you follow posted a review
   - Someone you follow created a list
   - Someone you follow attended a show

2. **Content Engagement**:
   - Comment on your review
   - Reaction to your review
   - Reply to your comment
   - Someone voted on your list
   - Someone added to your list

3. **Mentions & Tags**:
   - Tagged in a comment
   - Mentioned in a review
   - Tagged in a photo (future feature)

#### Content Notifications
4. **Show & Tour Updates**:
   - New show added for tracked tour
   - Show date changed
   - Show ratings threshold reached
   - Setlist posted for attended show

5. **Song & Performance**:
   - Tracked song performed (rare song alert)
   - New performance of favorite song
   - Song debut announcement
   - Song bust-out after gap

6. **List & Collection**:
   - List you follow updated
   - List you're subscribed to has new shows
   - Collaborative list you're part of edited

#### System Notifications
7. **Achievement & Milestones**:
   - New badge earned
   - Milestone reached (100 shows attended)
   - Level up in community rank
   - Anniversary (member for X years)

8. **Administrative**:
   - Moderation action on your content
   - Policy updates
   - Feature announcements
   - Community guidelines reminders

---

## Information Architecture

```
/notifications
├── Header Section
│   ├── "Notifications" title
│   ├── Mark all as read button
│   ├── Settings gear icon
│   └── Unread count badge
│
├── Filter Tabs
│   ├── All (default)
│   ├── Unread
│   ├── Social (followers, mentions, engagement)
│   ├── Content (shows, songs, lists)
│   ├── Achievements
│   └── System
│
├── Notifications Feed
│   ├── Notification cards (chronological)
│   ├── Group similar notifications
│   ├── Timestamp indicators
│   ├── Loading skeletons
│   └── Infinite scroll or pagination
│
└── Empty States
    ├── No notifications message
    ├── No unread notifications
    └── Filtered view empty
```

---

## UI Components

### 1. NotificationCard
```typescript
interface NotificationCardProps {
  notification: {
    id: string;
    type: NotificationType;
    actor?: User;
    actors?: User[];
    target?: {
      type: 'review' | 'comment' | 'list' | 'show' | 'song' | 'performance';
      id: number;
      title: string;
    };
    action: string;
    content?: string;
    created_at: string;
    read: boolean;
    link: string;
  };
  onMarkAsRead: () => void;
  onDelete: () => void;
  onClick: () => void;
}

type NotificationType =
  | 'new_follower'
  | 'review_comment'
  | 'review_reaction'
  | 'comment_reply'
  | 'list_vote'
  | 'mention'
  | 'show_update'
  | 'song_performance'
  | 'achievement'
  | 'system';
```

**Visual Design**:
- **Unread**: Bold text, colored background accent, unread indicator dot
- **Read**: Normal text, subtle background
- **Grouped**: Multiple avatars, "(+3 others)" indicator

**Card Elements**:
- Actor avatar(s) (user who triggered notification)
- Notification text with action (e.g., "John commented on your review")
- Target content preview (review excerpt, comment text)
- Timestamp (relative: "2m ago", "1h ago", "Yesterday")
- Unread indicator (blue dot)
- Action buttons (mark as read, delete)
- Click entire card to navigate to target

### 2. NotificationFilters
```typescript
interface NotificationFiltersProps {
  activeFilter: NotificationFilter;
  unreadCounts: { [key in NotificationFilter]: number };
  onFilterChange: (filter: NotificationFilter) => void;
}

type NotificationFilter = 'all' | 'unread' | 'social' | 'content' | 'achievements' | 'system';
```

**Desktop Layout**: Horizontal tab bar below header
**Mobile Layout**: Horizontal scrolling tabs or dropdown selector

**Tab Display**:
- Tab label
- Unread count badge (if any)
- Active tab highlighted

### 3. NotificationSettings (Modal/Page)
```typescript
interface NotificationSettingsProps {
  settings: NotificationPreferences;
  onSave: (settings: NotificationPreferences) => void;
}

interface NotificationPreferences {
  email_notifications: {
    enabled: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
    types: NotificationType[];
  };
  push_notifications: {
    enabled: boolean;
    types: NotificationType[];
  };
  in_app_notifications: {
    enabled: boolean;
    types: NotificationType[];
  };
  digest_settings: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time: string;
  };
  do_not_disturb: {
    enabled: boolean;
    start_time?: string;
    end_time?: string;
  };
}
```

**Settings Sections**:
1. **Notification Channels**:
   - Email notifications (on/off, frequency)
   - Push notifications (on/off)
   - In-app notifications (on/off)

2. **Notification Types**:
   - Checkboxes for each notification type
   - Grouped by category (Social, Content, Achievements, System)
   - Master toggles per category

3. **Digest Settings**:
   - Daily/weekly digest toggle
   - Preferred time for digest
   - Content preferences

4. **Do Not Disturb**:
   - Enable/disable
   - Schedule (start/end time)
   - Exceptions (important notifications only)

### 4. NotificationGrouping
```typescript
interface NotificationGroupProps {
  notifications: Notification[];
  groupKey: string;
  onExpand: () => void;
}
```

**Grouping Logic**:
- Group similar notifications (e.g., "5 people liked your review")
- Show primary actors (first 3 avatars)
- Expandable to see all
- Time-based grouping (within 24 hours)

**Visual Design**:
- Stacked avatars
- Summary text: "John, Sarah, and 3 others liked your review"
- Expand icon
- Clicking expands to show individual notifications

### 5. NotificationBadge (Global UI)
```typescript
interface NotificationBadgeProps {
  unreadCount: number;
  onClick: () => void;
}
```

**Display Locations**:
- Header navigation (bell icon)
- Mobile bottom nav
- Badge shows unread count
- Animated pulse for new notifications
- Click opens notifications dropdown or page

---

## User Flows

### Flow 1: Check Notifications
```
User sees notification badge (5 unread)
  ↓
Clicks notification icon
  ↓
Notifications dropdown/page opens
  ↓
Scans unread notifications
  ↓
Clicks notification card
  ↓
Navigates to target content (review, comment, etc.)
  ↓
Notification marked as read automatically
  ↓
Returns to notifications page
```

### Flow 2: Manage Notification Overload
```
User overwhelmed by notifications
  ↓
Opens notification settings
  ↓
Disables email notifications for comments
  ↓
Enables daily digest instead
  ↓
Sets "Do Not Disturb" for 10 PM - 8 AM
  ↓
Saves settings
  ↓
Notification volume reduced
```

### Flow 3: Respond to Engagement
```
User receives notification: "John commented on your review"
  ↓
Clicks notification
  ↓
Navigates to review page, scrolls to John's comment
  ↓
Reads comment and replies
  ↓
Returns to notifications
  ↓
Notification shows as read
```

### Flow 4: Track Rare Song Performance
```
User tracking rare song "Example Song"
  ↓
Song gets performed at show
  ↓
Receives notification: "Example Song was performed!"
  ↓
Clicks notification
  ↓
Navigates to performance page
  ↓
Reviews setlist and performance details
  ↓
Adds show to listening queue
```

---

## States & Edge Cases

### Empty States
1. **No notifications ever**:
   - "You don't have any notifications yet"
   - Explanation of what notifications are
   - Encourage engagement

2. **All caught up**:
   - "You're all caught up!"
   - Positive reinforcement message
   - Last notification timestamp

3. **Filtered view empty**:
   - "No [filter type] notifications"
   - Suggest checking other filters
   - "View All" button

### Loading States
- Skeleton notification cards while loading
- Progressive loading on scroll
- "Loading more" indicator
- Smooth fade-in for new notifications

### Error States
- Failed to load notifications: Retry button
- Failed to mark as read: Local state update, silent retry
- Failed to delete: Error message, undo option
- Network error: Show cached notifications

### Special States
- **Real-time updates**: New notification appears at top with animation
- **Bulk actions**: Select multiple, mark all as read
- **Archived notifications**: Hide old notifications after 30 days
- **Notification limits**: Show only last 1000, link to older in settings

---

## Notification Delivery

### Delivery Channels
1. **In-App**:
   - Badge on bell icon
   - Notification dropdown
   - Full notifications page

2. **Email**:
   - Instant emails for important notifications
   - Daily/weekly digest emails
   - Formatted HTML emails with CTA buttons

3. **Push Notifications** (future):
   - Browser push (desktop/mobile)
   - Mobile app push
   - Short, actionable message

### Notification Timing
- **Instant**: Follower activity, mentions, comments
- **Batched**: Multiple reactions, group activity (every 15 min)
- **Digest**: Daily summary at preferred time
- **Do Not Disturb**: Queue notifications during quiet hours

### Notification Priority
1. **High Priority** (always notify):
   - Mentions and tags
   - Comments on your content
   - Moderation actions

2. **Medium Priority** (respect settings):
   - Reactions and votes
   - Follower activity
   - Content updates

3. **Low Priority** (digest only):
   - System announcements
   - Feature updates
   - Achievements

---

## Notification Grouping & Aggregation

### Grouping Rules
- **Time window**: Group similar notifications within 24 hours
- **Same actor**: Multiple actions by same user on same target
- **Same type**: Multiple users doing same action (likes, votes)
- **Same target**: Multiple actions on same content

### Examples:
- ❌ "John liked your review. Sarah liked your review. Mike liked your review."
- ✅ "John, Sarah, and Mike liked your review."

- ❌ "New show added. New show added. New show added."
- ✅ "3 new shows added for Summer Tour 2024."

### Ungrouping:
- User can expand groups to see individual notifications
- Each notification in group clickable
- Mark group as read marks all

---

## Performance Considerations

### Optimization
- Server-sent events for real-time notifications
- Cached notification counts
- Paginated notification loading
- Debounced mark-as-read API calls
- Lazy load notification details
- Background sync for offline support

### Accessibility
- Semantic HTML (list for notifications)
- Keyboard navigation (arrow keys, Enter to open)
- ARIA labels for notification types
- Screen reader announcements for new notifications
- Focus management when opening/closing
- High contrast unread indicators

---

## Mobile Adaptations

### Mobile UX
- Full-screen notifications page
- Bottom nav badge
- Pull-to-refresh
- Swipe actions (mark as read, delete)
- Bottom sheet for settings
- Haptic feedback for actions

### Responsive Breakpoints
- **Mobile (<640px)**: Single column, compact cards
- **Tablet (640px-1024px)**: Wider cards, more preview text
- **Desktop (>1024px)**: Sidebar or dedicated page, richer content

### Mobile-Specific Features
- Swipe right to mark as read
- Swipe left to delete
- Long press for bulk select
- Native share for notification content

---

## Data Requirements

### API Endpoints

```typescript
GET /notifications
  - Params: filter (all, unread, social, content, achievements, system), limit, offset
  - Returns: NotificationList + unread counts
  - Response:
    {
      notifications: Notification[];
      pagination: { total: number; offset: number; limit: number };
      unread_counts: {
        total: number;
        social: number;
        content: number;
        achievements: number;
        system: number;
      };
    }

GET /notifications/unread-count
  - Returns: Total unread count for badge
  - Response: { count: number }

PUT /notifications/:id/read
  - Marks notification as read
  - Response: { success: boolean }

PUT /notifications/mark-all-read
  - Marks all notifications as read
  - Response: { success: boolean; count: number }

DELETE /notifications/:id
  - Deletes notification
  - Response: { success: boolean }

GET /notifications/settings
  - Returns: User's notification preferences
  - Response: NotificationPreferences

PUT /notifications/settings
  - Body: NotificationPreferences
  - Updates user's notification preferences
  - Response: { success: boolean }

WebSocket /notifications/stream
  - Real-time notification delivery
  - Server-sent events or WebSocket connection
```

### Caching Strategy
- Notification list: No cache (always fresh)
- Unread count: 10s cache
- Notification settings: 5min cache
- Mark as read: Optimistic UI update

---

## Notification Preferences

### Default Settings
- In-app notifications: All enabled
- Email notifications: Digest (daily)
- Push notifications: Disabled (opt-in)
- Do Not Disturb: Disabled

### Granular Controls
Per notification type, user can choose:
- **In-app**: On/Off
- **Email**: On/Off
- **Push**: On/Off

### Bulk Controls
- Disable all social notifications
- Disable all content notifications
- Disable all except high priority
- Pause all for X days

---

## Notification Templates

### Social Notification Examples
- "{user} started following you"
- "{user} commented on your review of {show}"
- "{user} and {N} others liked your review"
- "{user} mentioned you in a comment"
- "{user} added to your list '{list_name}'"

### Content Notification Examples
- "New show added: {show_name} on {date}"
- "{song_name} was performed for the first time in {X} years!"
- "Setlist posted for {show_name}"
- "{tour_name} has {N} new shows"

### Achievement Notification Examples
- "You've earned the '{badge_name}' badge!"
- "Milestone reached: {count} shows attended!"
- "You're now a Level {level} member!"

### System Notification Examples
- "New feature: Check out {feature_name}!"
- "Community guidelines updated"
- "Your review was featured on the homepage!"

---

## Success Metrics

### Engagement KPIs
- Notification click-through rate
- Time to read notifications
- Notification preferences usage
- Digest open rate
- Notification dismissal rate

### System KPIs
- Notification delivery latency
- Unread count accuracy
- Real-time update reliability
- Email delivery rate
- Push notification opt-in rate

### Quality KPIs
- Notification relevance (user feedback)
- Notification fatigue indicators
- Settings adjustment frequency
- Do Not Disturb usage

---

## Implementation Phases

### Phase 1 (MVP)
- Basic in-app notifications
- Notification types: followers, comments, reactions
- Mark as read functionality
- Basic notification settings
- Unread count badge

### Phase 2 (Enhanced)
- Email notifications and digests
- Notification grouping
- Notification filters (social, content, etc.)
- Advanced settings (Do Not Disturb)
- Real-time notification delivery
- Bulk actions (mark all as read)

### Phase 3 (Community)
- Push notifications (browser and mobile)
- Smart notification batching
- Notification snooze
- Notification preferences recommendations
- Social notification insights
- Notification analytics dashboard

---

## Open Questions for Architect

1. **Real-Time Delivery**: Use WebSockets, Server-Sent Events, or polling?
2. **Notification Storage**: How long to retain notifications? Archive strategy?
3. **Email Service**: What email provider? Transactional vs. marketing?
4. **Push Notifications**: Implement in Phase 1 or later? Which service?
5. **Notification Limits**: Cap notifications per user? Rate limiting?
6. **Privacy**: Can users see who viewed their notifications?
7. **Moderation**: How to handle notification spam or abuse?

---

**Next Steps**:
- Architect reviews specification
- Define notification data model and storage
- Design mockups for notification cards and settings
- Implement MVP (Phase 1)
- Set up email notification infrastructure
- Configure real-time delivery mechanism
