# UX Specification: Enhanced Error & System Pages

**Routes**: `/not-found`, `/error`, `/maintenance`, `/rate-limited`, `/offline`
**Status**: Partial Implementation (404 & Error exist, others missing)
**Priority**: Medium - User Experience & Reliability
**Last Updated**: 2025-11-24

---

## User Needs & Goals

### Primary Users
1. **Lost Users** - Can't find what they're looking for
2. **Error-Affected Users** - Experiencing technical issues
3. **Rate-Limited Users** - Hit API limits
4. **Offline Users** - No internet connection (PWA)
5. **Maintenance-Window Users** - Site temporarily down

### User Goals
- Understand what went wrong
- Find alternative ways to accomplish task
- Get back to working part of site
- Know when issue will be resolved
- Contact support if needed

---

## Content Strategy

### Core Principles

1. **Be Helpful**:
   - Clear explanation of what happened
   - Suggest next steps
   - Provide alternatives

2. **Be Human**:
   - Friendly, not technical jargon
   - Empathetic tone
   - Appropriate to context

3. **Be Actionable**:
   - Clear CTAs
   - Working links
   - Search functionality

4. **Maintain Brand**:
   - Consistent design
   - On-brand copy
   - Visual elements

---

## Error Pages

### 1. 404 - Page Not Found

**Current Status**: Exists (34 lines, basic)

**Enhancement Needed**:

```typescript
interface NotFoundPageProps {
  path: string; // Attempted URL
  referrer?: string; // Where user came from
  suggestions?: SearchResult[]; // Similar pages
}
```

**Enhanced Features**:
- **Smart Suggestions**: Similar pages based on URL
- **Search Bar**: "Can't find what you're looking for? Search:"
- **Popular Links**: Most visited pages
- **Helpful Context**: "The [type] you're looking for doesn't exist"
- **Report Broken Link**: If came from internal referrer

**Content**:
```
🔍 404 - Page Not Found

The [performance/show/list/page] you're looking for couldn't be found.

It may have been:
- Moved to a new location
- Deleted by its creator
- Never existed (typo in URL?)

📍 Try These Instead:
[Search Bar]

Popular Pages:
→ Browse Performances
→ Explore Shows
→ View Trending
→ Go Home

Came from our site?
[Report Broken Link]
```

**Visual Design**:
- Large "404" number (animated)
- Magnifying glass icon
- Search bar (prominent)
- Card-style popular links
- Breadcrumb showing attempted path

---

### 2. 500 - Server Error

**Current Status**: Exists (47 lines, basic)

**Enhancement Needed**:

```typescript
interface ErrorPageProps {
  error: Error;
  errorId?: string; // For support reference
  retryAction?: () => void;
}
```

**Enhanced Features**:
- **Error ID**: Unique reference for support
- **Retry Button**: Try action again
- **Report Issue**: Send error report
- **Status Page Link**: Check overall site status
- **Estimated Resolution**: If known issue

**Content**:
```
⚠️ Something Went Wrong

We encountered an unexpected error while processing your request.

Error ID: [ABC123XYZ]
Don't worry - our team has been notified.

What you can do:
→ [Try Again] Wait a moment and retry
→ [Go Home] Return to homepage
→ [Check Status] See if others are affected

Still having issues?
Contact support with Error ID: ABC123XYZ
```

**Visual Design**:
- Warning icon (not scary)
- Error ID in monospace font
- Copy error ID button
- Retry button (prominent)
- Support contact info

**Technical Details**:
- Log error to monitoring service
- Generate unique error ID
- Display user-friendly message (hide stack trace)
- Offer retry with exponential backoff

---

### 3. 503 - Maintenance Mode

**Current Status**: MISSING

**Route**: `/maintenance`

```typescript
interface MaintenancePageProps {
  maintenanceInfo: {
    message: string;
    estimated_end?: string;
    reason?: string;
    updates_url?: string;
  };
}
```

**Features**:
- **Clear Status**: "We're currently down for maintenance"
- **Estimated Time**: When we'll be back
- **Progress Updates**: Link to status page
- **Subscribe**: Get notified when back online
- **Emergency Contact**: Support email for critical issues

**Content**:
```
🛠️ Scheduled Maintenance

HonkingVersion is currently offline for scheduled maintenance.

We're working on:
[Brief description of what's being updated/fixed]

Estimated Return: [Date/Time]

Want to know when we're back?
[Enter Email] [Notify Me]

Updates: [Status Page Link]

Emergency Contact: support@honkingversion.net
```

**Visual Design**:
- Construction/tools icon
- Progress bar or animation
- Countdown timer (if specific time)
- Email signup form
- Social media links for updates

**Technical Details**:
- Configurable via admin panel
- Whitelist admin IPs (can still access)
- Display at application level (not just route)
- Static HTML page (no backend required)

---

### 4. 429 - Rate Limited

**Current Status**: MISSING

**Route**: `/rate-limited`

```typescript
interface RateLimitPageProps {
  limit: {
    max_requests: number;
    window: string; // "per hour", "per day"
    reset_at: string; // ISO timestamp
  };
  currentUsage: number;
}
```

**Features**:
- **Explanation**: Why rate limiting exists
- **Current Status**: How many requests you've made
- **Reset Time**: When limit resets
- **Upgrade Options**: If applicable
- **Tips**: How to avoid hitting limit

**Content**:
```
⏱️ Slow Down There!

You've reached the rate limit for this action.

Your limit: [100] requests per [hour]
Current usage: [100] / [100]

Your limit resets: [15 minutes]

Why rate limits?
We use rate limits to ensure fair usage and protect
against abuse. Thanks for understanding!

Tips:
→ Space out your requests
→ Use search instead of browsing
→ Consider upgrading for higher limits

[View API Limits] [Contact Support]
```

**Visual Design**:
- Timer icon
- Progress bar showing usage
- Countdown to reset
- Clear, not punitive tone
- Links to documentation

**Technical Details**:
- Show from API responses (429 status)
- Display remaining quota
- Countdown timer to reset
- Suggest retry-after header value

---

### 5. Offline - No Connection (PWA)

**Current Status**: MISSING

**Route**: `/offline` (PWA fallback)

```typescript
interface OfflinePageProps {
  cachedPages?: string[]; // Pages available offline
  queuedActions?: Action[]; // Actions to sync when online
}
```

**Features**:
- **Status**: You're offline
- **Available Content**: What can still be accessed
- **Queued Actions**: Actions waiting to sync
- **Retry Button**: Check connection again
- **Offline Tips**: What you can do offline

**Content**:
```
📡 You're Offline

No internet connection detected.

What you can still do:
→ View recently visited pages
→ Browse cached content
→ Explore your saved lists

Your actions will sync when you're back online:
[List of queued actions]

[Check Connection]

Tip: Some content may be outdated while offline.
```

**Visual Design**:
- Offline icon (broken signal)
- List of cached pages
- Sync queue indicator
- Retry button
- Tips for offline usage

**Technical Details**:
- Service Worker implementation
- Cache recent pages
- Queue mutations for sync
- Background sync when online
- Detect connection status

---

### 6. 403 - Forbidden / Unauthorized

**Current Status**: MISSING

**Route**: `/forbidden` or `/unauthorized`

```typescript
interface ForbiddenPageProps {
  requiredPermission?: string;
  reason?: 'not_logged_in' | 'insufficient_permissions' | 'banned';
}
```

**Features**:
- **Clear Message**: What permission is missing
- **Action Steps**: How to gain access
- **Login Prompt**: If not logged in
- **Contact Support**: If believe error

**Content**:
```
🔒 Access Denied

You don't have permission to access this page.

[If not logged in]
You need to be logged in to view this content.
[Sign In] [Create Account]

[If insufficient permissions]
This page requires [admin/moderator] permissions.

[If banned]
Your account has been restricted.
Contact support for more information.
```

---

## Shared Components

### 1. ErrorLayout
```typescript
interface ErrorLayoutProps {
  title: string;
  icon: string;
  message: string;
  actions: ErrorAction[];
  helpText?: string;
  children?: React.ReactNode;
}

interface ErrorAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant: 'primary' | 'secondary';
}
```

**Consistent Layout**:
- Centered content
- Large icon/error code
- Clear title
- Descriptive message
- Action buttons
- Help text/links

### 2. SearchBar (for 404)
```typescript
interface ErrorSearchProps {
  placeholder: string;
  onSearch: (query: string) => void;
  suggestions?: string[];
}
```

### 3. CountdownTimer
```typescript
interface CountdownTimerProps {
  targetTime: string; // ISO timestamp
  onComplete?: () => void;
  label?: string;
}
```

---

## User Flows

### Flow 1: User Hits 404
```
User clicks broken link
  ↓
404 page loads
  ↓
Sees "Page not found" message
  ↓
Views suggested similar pages
  ↓
Clicks suggestion → navigates away
  OR
Uses search bar → finds correct page
  OR
Reports broken link (if internal referrer)
```

### Flow 2: User Encounters Error
```
User submits form
  ↓
Server error occurs
  ↓
Error page displays with error ID
  ↓
User copies error ID
  ↓
Clicks "Try Again"
  ↓
Success! (or contacts support with error ID)
```

### Flow 3: User Hits Rate Limit
```
User making many requests
  ↓
Rate limit exceeded
  ↓
Rate limit page displays
  ↓
Sees reset timer: "15 minutes"
  ↓
User waits or explores other content
  ↓
Timer expires
  ↓
User retries successfully
```

### Flow 4: Maintenance Window
```
User visits site during maintenance
  ↓
Maintenance page displays
  ↓
Sees estimated completion time
  ↓
Enters email for notification
  ↓
Confirms subscription
  ↓
Receives email when site is back
  ↓
Returns to site
```

---

## States & Edge Cases

### Error States
- **Multiple errors**: Show most recent/relevant
- **Error during error page**: Fallback to static HTML
- **No error details**: Generic friendly message

### Loading States
- Retry button shows spinner while retrying
- Search shows loading while fetching results
- Countdown timer updates smoothly

### Success States
- Retry successful: Redirect to intended page
- Search successful: Navigate to result
- Connection restored: Sync queued actions

### Special States
- **Repeated errors**: Suggest contacting support
- **Known issues**: Show status banner
- **Scheduled maintenance**: Pre-warn users (banner before maintenance)

---

## Design Specifications

### Visual Consistency
- Use brand colors and fonts
- Consistent icon style
- Match public site theme
- Responsive design

### Typography
- Error codes: Space Grotesk, 96px, bold
- Titles: Space Grotesk, 32px, bold
- Body: IBM Plex Mono, 16px
- Monospace for error IDs

### Colors
- **404**: Blue/neutral (informational)
- **500**: Orange (warning, not scary)
- **503**: Purple (maintenance)
- **429**: Yellow (slow down)
- **Offline**: Gray (neutral)

### Animations
- Subtle entrance animations
- Loading spinners
- Countdown timers
- Pulsing connection indicator

---

## Technical Implementation

### Error Handling Strategy

```typescript
// Client-side error boundary
<ErrorBoundary
  fallback={(error) => <ErrorPage error={error} />}
  onError={(error, errorInfo) => {
    // Log to monitoring service
    logError(error, errorInfo);
  }}
>
  <App />
</ErrorBoundary>

// Server-side error handling
app.use((err, req, res, next) => {
  const errorId = generateErrorId();
  logError(err, errorId, req);

  res.status(err.status || 500).render('error', {
    errorId,
    message: err.message || 'Internal Server Error'
  });
});
```

### Rate Limiting

```typescript
// Express middleware
app.use('/api', rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    res.status(429).render('rate-limited', {
      limit: { max_requests: 100, window: 'hour' },
      reset_at: req.rateLimit.resetTime
    });
  }
}));
```

### Maintenance Mode

```typescript
// Middleware to check maintenance mode
app.use((req, res, next) => {
  if (isMaintenanceMode() && !isWhitelistedIP(req.ip)) {
    return res.status(503).render('maintenance', {
      maintenanceInfo: getMaintenanceInfo()
    });
  }
  next();
});
```

---

## Accessibility

### ARIA Labels
- Error messages: `role="alert"`
- Status messages: `aria-live="polite"`
- Error codes: `aria-label="Error code [CODE]"`

### Keyboard Navigation
- All actions keyboard accessible
- Focus trapped in retry/action buttons
- Logical tab order

### Screen Readers
- Descriptive error messages
- Announce when retry succeeds/fails
- Countdown timer updates

---

## Mobile Adaptations

### Responsive Design
- Single column layout
- Larger touch targets
- Simplified error messages
- Mobile-optimized search
- Native browser back button support

### Mobile-Specific Features
- Tap to copy error ID
- Native share for error reports
- Pull-to-refresh for retry
- Haptic feedback on actions

---

## SEO & Indexing

### Meta Tags
- `robots: noindex, nofollow` for error pages
- Appropriate HTTP status codes
- Canonical URL for redirects

### Structured Data
- No structured data on error pages
- Maintain robots.txt accessibility

---

## Analytics & Monitoring

### Track Error Pages
- Page views by error type
- Error frequency over time
- Most common 404 paths (fix broken links)
- User actions on error pages (retry, navigate, search)

### Alerts
- Spike in 500 errors
- High 404 rate
- Maintenance mode enabled

---

## Success Metrics

### User Recovery
- % users who navigate away successfully
- % users who use search on 404
- % users who retry successfully
- Average time on error page

### Error Reduction
- 404 rate (lower is better)
- 500 rate (lower is better)
- Broken link reports
- Error ID references in support tickets

---

## Implementation Phases

### Phase 1 (MVP)
- Enhanced 404 page (search, suggestions)
- Enhanced 500 page (error ID, retry)
- Maintenance page (basic)
- Rate limit page (basic)

### Phase 2 (Enhanced)
- Smart 404 suggestions (ML)
- Error reporting system
- Maintenance notification system
- Offline page (PWA)
- Countdown timers

### Phase 3 (Advanced)
- Predictive error prevention
- Contextual help on errors
- Automatic retry with backoff
- Status page integration
- Real-time error tracking

---

## Open Questions for Architect

1. **Error Logging**: Which service (Sentry, LogRocket, etc.)?
2. **Status Page**: Separate status page or integrated?
3. **Maintenance Scheduling**: Auto-enable maintenance mode?
4. **Rate Limits**: Per-IP, per-user, or both?
5. **PWA**: Full PWA implementation or just offline page?
6. **Error IDs**: Format and generation strategy?
7. **User Notifications**: Email on maintenance start/end?

---

**Next Steps**:
- Architect reviews specification
- Enhance existing 404 and error pages
- Create maintenance page
- Implement rate limiting page
- Add offline support (PWA)
- Set up error tracking and monitoring
