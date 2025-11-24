# UX Specification: User Settings Page

**Route**: `/settings`
**Status**: Needs Implementation
**Priority**: Critical - Core User Feature
**Last Updated**: 2025-11-24

---

## User Needs & Goals

### Primary Users
1. **All Authenticated Users** - Everyone needs account management
2. **Privacy-Conscious Users** - Users controlling data visibility
3. **Active Community Members** - Users customizing experience
4. **New Users** - Setting up their account preferences

### User Goals
- Edit profile information and appearance
- Manage account security (password, email)
- Control privacy and data visibility
- Configure notification preferences
- Manage connected accounts and sessions
- Export or delete personal data
- Customize site experience

---

## Content Strategy

### Core Settings Categories

1. **Profile Settings**:
   - Display name
   - Username
   - Bio/description
   - Profile picture
   - Social links
   - Custom title selection
   - Badge display preferences

2. **Account Settings**:
   - Email address
   - Password change
   - Two-factor authentication
   - Active sessions
   - Connected accounts (OAuth)

3. **Privacy Settings**:
   - Profile visibility (public, unlisted, private)
   - Activity visibility
   - Show attendance visibility
   - List visibility defaults
   - Review visibility defaults
   - Who can follow you
   - Who can message you

4. **Notification Settings**:
   - Email notifications
   - Push notifications
   - In-app notifications
   - Digest preferences
   - Do Not Disturb
   - Per-notification-type toggles

5. **Preferences**:
   - Theme (light, dark, auto)
   - Language
   - Timezone
   - Date format
   - Default sort orders
   - Autoplay settings

6. **Data & Privacy**:
   - Download your data
   - Delete account
   - Clear history
   - Manage cookies
   - Privacy policy
   - Terms of service

---

## Information Architecture

```
/settings
├── Navigation Sidebar
│   ├── Profile
│   ├── Account
│   ├── Privacy
│   ├── Notifications
│   ├── Preferences
│   └── Data & Privacy
│
└── Main Content Area
    ├── Section Header
    ├── Settings Form
    ├── Action Buttons
    └── Help Text
```

---

## UI Components

### 1. SettingsLayout
```typescript
interface SettingsLayoutProps {
  children: React.ReactNode;
  activeSection: SettingsSection;
}

type SettingsSection = 'profile' | 'account' | 'privacy' | 'notifications' | 'preferences' | 'data';
```

**Layout Structure**:
- Fixed sidebar navigation (desktop)
- Top tabs or dropdown (mobile)
- Content area with section title
- Save/Cancel buttons sticky at bottom

### 2. ProfileSettings
```typescript
interface ProfileSettingsProps {
  user: User;
  onSave: (updates: ProfileUpdate) => Promise<void>;
}

interface ProfileUpdate {
  display_name?: string;
  username?: string;
  bio?: string;
  profile_picture?: File;
  social_links?: {
    twitter?: string;
    instagram?: string;
    custom_url?: string;
  };
  selected_title_id?: number | null;
}
```

**Fields**:
- **Display Name** - Text input, max 50 chars
- **Username** - Text input, unique, lowercase, 3-20 chars
- **Bio** - Textarea, max 500 chars, markdown support
- **Profile Picture** - Image upload, crop tool, max 5MB
- **Social Links** - Text inputs with validation
- **Selected Title** - Dropdown of earned titles
- **Badge Display** - Checkboxes for visible badges

**Validation**:
- Username availability check (debounced)
- URL validation for social links
- Image size and format check
- Display name profanity filter

### 3. AccountSettings
```typescript
interface AccountSettingsProps {
  user: User;
  onEmailChange: (newEmail: string) => Promise<void>;
  onPasswordChange: (oldPassword: string, newPassword: string) => Promise<void>;
  on2FAToggle: (enabled: boolean) => Promise<void>;
}
```

**Sections**:

**Email Management**:
- Current email display
- Change email button → modal
- Email verification status
- Resend verification link

**Password Management**:
- Change password button → modal
- Requires current password
- Password strength indicator
- Confirm new password

**Two-Factor Authentication**:
- Enable/disable toggle
- QR code setup (if enabling)
- Recovery codes download
- Backup authentication methods

**Active Sessions**:
- List of active sessions
- Device, location, last active
- "Sign out" button per session
- "Sign out all other sessions"

**Connected Accounts**:
- OAuth providers (Google, Twitter, etc.)
- Connect/disconnect buttons
- Last used timestamp

### 4. PrivacySettings
```typescript
interface PrivacySettingsProps {
  settings: PrivacyPreferences;
  onUpdate: (settings: Partial<PrivacyPreferences>) => Promise<void>;
}

interface PrivacyPreferences {
  profile_visibility: 'public' | 'unlisted' | 'private';
  activity_visibility: 'everyone' | 'followers' | 'private';
  show_attendance_public: boolean;
  list_default_visibility: 'public' | 'unlisted' | 'private';
  review_default_visibility: 'public' | 'unlisted' | 'private';
  allow_follows: boolean;
  allow_messages: 'everyone' | 'followers' | 'none';
  show_stats: boolean;
  indexable: boolean;
}
```

**Settings**:
- **Profile Visibility**: Who can see your profile
- **Activity Visibility**: Who can see your activity
- **Show Attendance**: Make attended shows public
- **List Default**: Default visibility for new lists
- **Review Default**: Default visibility for new reviews
- **Allow Follows**: Let others follow you
- **Allow Messages**: Who can message you
- **Show Stats**: Display stats on profile
- **Search Indexing**: Allow search engines to index profile

**Visual Design**:
- Radio buttons for visibility options
- Toggle switches for boolean settings
- Help text explaining each option
- Privacy level indicators (🔓 Public, 🔒 Private)

### 5. NotificationSettings
```typescript
interface NotificationSettingsProps {
  settings: NotificationPreferences;
  onUpdate: (settings: Partial<NotificationPreferences>) => Promise<void>;
}

interface NotificationPreferences {
  email: {
    enabled: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
    types: NotificationType[];
  };
  push: {
    enabled: boolean;
    types: NotificationType[];
  };
  in_app: {
    enabled: boolean;
    types: NotificationType[];
  };
  digest: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time: string; // HH:MM format
  };
  do_not_disturb: {
    enabled: boolean;
    start_time: string;
    end_time: string;
  };
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

**Layout**:
- Master toggles per channel (Email, Push, In-App)
- Frequency selector (instant, daily digest, weekly digest)
- Notification type checkboxes grouped by category
- Do Not Disturb time picker
- Test notification button

**Categories**:
- **Social** - Followers, mentions, engagement
- **Content** - Shows, songs, lists
- **Achievements** - Badges, milestones
- **System** - Updates, announcements

### 6. PreferencesSettings
```typescript
interface PreferencesSettingsProps {
  preferences: UserPreferences;
  onUpdate: (preferences: Partial<UserPreferences>) => Promise<void>;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  date_format: 'US' | 'ISO' | 'EU';
  default_sort: {
    performances: string;
    shows: string;
    lists: string;
  };
  autoplay: boolean;
  reduce_motion: boolean;
  compact_mode: boolean;
}
```

**Settings**:
- **Theme**: Light, Dark, Auto (system)
- **Language**: Dropdown of supported languages
- **Timezone**: Searchable timezone selector
- **Date Format**: MM/DD/YYYY, YYYY-MM-DD, DD/MM/YYYY
- **Default Sorts**: Per-content-type sort preference
- **Autoplay**: Auto-play media on pages
- **Reduce Motion**: Accessibility option
- **Compact Mode**: Denser UI layout

### 7. DataPrivacySettings
```typescript
interface DataPrivacySettingsProps {
  onExport: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  onClearHistory: () => Promise<void>;
}
```

**Actions**:
- **Download Your Data** - Export all user data (JSON)
- **Delete Account** - Permanent account deletion
- **Clear Browsing History** - Clear viewed pages
- **Manage Cookies** - Cookie preferences
- **Privacy Policy** - Link to policy
- **Terms of Service** - Link to terms

**Delete Account Flow**:
1. Click "Delete Account"
2. Confirmation modal with warnings
3. Enter password to confirm
4. Type "DELETE" to confirm
5. 30-day grace period before permanent deletion
6. Email notification sent

---

## User Flows

### Flow 1: Edit Profile
```
User navigates to /settings
  ↓
Clicks "Profile" in sidebar (default)
  ↓
Edits display name and bio
  ↓
Uploads new profile picture
  ↓
Crops and adjusts image
  ↓
Clicks "Save Changes"
  ↓
Success notification
  ↓
Changes reflected on profile
```

### Flow 2: Change Password
```
User in Account settings
  ↓
Clicks "Change Password"
  ↓
Modal opens
  ↓
Enters current password
  ↓
Enters new password (strength indicator shows)
  ↓
Confirms new password
  ↓
Clicks "Update Password"
  ↓
Success, signed out of other sessions
  ↓
Email notification sent
```

### Flow 3: Configure Privacy
```
User in Privacy settings
  ↓
Sets "Profile Visibility" to "Unlisted"
  ↓
Disables "Show Attendance Public"
  ↓
Sets "Allow Messages" to "Followers Only"
  ↓
Clicks "Save Changes"
  ↓
Privacy settings updated
  ↓
Profile now unlisted, not in search
```

### Flow 4: Setup Notification Preferences
```
User in Notification settings
  ↓
Disables email notifications
  ↓
Enables daily digest instead
  ↓
Unchecks "System" notification type
  ↓
Enables Do Not Disturb (10 PM - 8 AM)
  ↓
Clicks "Save Preferences"
  ↓
Notification settings updated
  ↓
Test notification sent
```

### Flow 5: Download Data
```
User in Data & Privacy settings
  ↓
Clicks "Download Your Data"
  ↓
Confirmation modal
  ↓
Enters password to confirm
  ↓
Export request queued
  ↓
Email sent when ready (may take hours)
  ↓
Download link in email (expires in 7 days)
```

---

## States & Edge Cases

### Empty States
1. **No profile picture**:
   - Show placeholder avatar
   - "Upload Photo" prompt

2. **No social links**:
   - Empty fields with placeholders
   - "Add social links" helper text

3. **No active sessions**:
   - Show current session only
   - "You're only signed in here"

### Loading States
- Skeleton forms while loading settings
- Spinner on save button during update
- Progressive loading for images
- Disabled form during save

### Error States
- **Username taken**: Inline error, suggest alternatives
- **Invalid email**: Format validation error
- **Weak password**: Strength indicator, requirements list
- **Upload failed**: Error message, retry button
- **Network error**: "Couldn't save changes" with retry

### Special States
- **Unsaved changes**: Warning before leaving page
- **Email unverified**: Banner with "Verify Email" button
- **2FA not setup**: Security recommendation banner
- **Account pending deletion**: Warning banner with "Cancel Deletion"

---

## Validation Rules

### Profile Validation:
- **Username**: 3-20 chars, alphanumeric + underscore/hyphen, unique
- **Display Name**: 1-50 chars, no special restrictions
- **Bio**: Max 500 chars, markdown allowed
- **Profile Picture**: Max 5MB, JPEG/PNG/WebP, min 200x200px
- **Social URLs**: Valid URL format, HTTPS preferred

### Account Validation:
- **Email**: Valid email format, unique, verification required
- **Password**: Min 8 chars, at least one uppercase, one number, one special char
- **2FA Code**: 6 digits, TOTP format

### Privacy Validation:
- No specific validation, all options are valid selections

---

## Security Considerations

### Authentication:
- Require current password for sensitive changes (email, password, 2FA)
- Re-authenticate after 30 minutes of inactivity
- Rate limit password change attempts
- Session invalidation on password change

### Data Protection:
- Encrypted storage for sensitive data
- Secure file upload (virus scan)
- CSRF protection on all forms
- Audit log for account changes

### Privacy:
- Clear communication about data usage
- Opt-in for data sharing
- Easy data export and deletion
- GDPR compliance

---

## Performance Considerations

### Optimization
- Lazy load settings sections
- Debounced form saves
- Optimistic UI updates
- Cached settings data (1min)
- Progressive image upload
- Async validation

### Accessibility
- Semantic HTML (form elements)
- Keyboard navigation (tab order)
- ARIA labels for all inputs
- Focus management in modals
- Screen reader descriptions
- High contrast mode support
- Form validation announcements

---

## Mobile Adaptations

### Mobile UX
- Top tabs instead of sidebar
- Bottom sheet for modals
- Full-screen image cropper
- Native file picker
- Simplified layouts
- Sticky save button

### Responsive Breakpoints
- **Mobile (<640px)**: Tabs, single column
- **Tablet (640px-1024px)**: Collapsible sidebar
- **Desktop (>1024px)**: Fixed sidebar, two-column layout

### Mobile-Specific Features
- Touch-friendly controls
- Swipe between sections
- Native share for export
- Biometric authentication (Touch ID, Face ID)

---

## Data Requirements

### API Endpoints

```typescript
GET /settings/profile
  - Returns: User profile settings
  - Response: ProfileSettings

PUT /settings/profile
  - Body: Partial profile updates
  - Requires: Authentication
  - Returns: Updated profile

POST /settings/profile/picture
  - Body: FormData with image file
  - Requires: Authentication
  - Returns: Profile picture URL

GET /settings/account
  - Returns: Account settings (email, 2FA status, sessions)
  - Response: AccountSettings

PUT /settings/account/email
  - Body: { new_email: string; password: string }
  - Requires: Authentication, password verification
  - Returns: Success, verification email sent

PUT /settings/account/password
  - Body: { current_password: string; new_password: string }
  - Requires: Authentication
  - Returns: Success, invalidates other sessions

POST /settings/account/2fa/enable
  - Returns: QR code, secret, recovery codes

POST /settings/account/2fa/disable
  - Body: { code: string }
  - Requires: 2FA code
  - Returns: Success

GET /settings/account/sessions
  - Returns: List of active sessions
  - Response: Session[]

DELETE /settings/account/sessions/:id
  - Requires: Authentication
  - Returns: Success

GET /settings/privacy
  - Returns: Privacy preferences
  - Response: PrivacyPreferences

PUT /settings/privacy
  - Body: Partial privacy updates
  - Requires: Authentication
  - Returns: Updated privacy settings

GET /settings/notifications
  - Returns: Notification preferences
  - Response: NotificationPreferences

PUT /settings/notifications
  - Body: Partial notification updates
  - Requires: Authentication
  - Returns: Updated notification settings

GET /settings/preferences
  - Returns: User preferences
  - Response: UserPreferences

PUT /settings/preferences
  - Body: Partial preference updates
  - Requires: Authentication
  - Returns: Updated preferences

POST /settings/data/export
  - Requires: Authentication, password verification
  - Returns: Export request ID, email notification queued

POST /settings/data/delete-account
  - Body: { password: string; confirmation: "DELETE" }
  - Requires: Authentication, password verification
  - Returns: Deletion scheduled (30-day grace period)

POST /settings/data/cancel-deletion
  - Requires: Authentication
  - Returns: Account deletion cancelled
```

### Caching Strategy
- Settings data: No cache (always fresh)
- Profile picture: CDN cache (1 year)
- Active sessions: 30s cache
- Timezone list: 1 day cache (static data)

---

## Success Metrics

### Engagement KPIs
- % users who visit settings
- Settings sections visited
- Average time in settings
- Profile completion rate
- Settings save rate

### Feature Adoption
- 2FA adoption rate
- Privacy controls usage
- Notification preference customization
- Theme preference distribution

### Quality KPIs
- Settings save success rate
- Validation error rate
- Support tickets related to settings
- User satisfaction with settings

---

## Implementation Phases

### Phase 1 (MVP)
- Profile settings (name, bio, picture)
- Account settings (email, password)
- Basic privacy controls
- Notification link (to existing notifications page)
- Basic layout and navigation

### Phase 2 (Enhanced)
- Full privacy controls
- Notification preferences (integrated)
- Preferences (theme, language, timezone)
- Active sessions management
- Username change

### Phase 3 (Advanced)
- Two-factor authentication
- Connected accounts (OAuth)
- Data export and deletion
- Advanced privacy options
- Audit log of changes

---

## Design Specifications

### Layout:
- **Desktop**: 300px fixed sidebar + content area
- **Mobile**: Full-width content with top navigation
- **Max width**: 800px for content area

### Form Styling:
- Labels above inputs
- Helper text below inputs
- Inline validation (on blur)
- Success/error states with icons
- Consistent spacing (24px between sections)

### Colors:
- **Success**: #1fc77b (green)
- **Error**: #ff4444 (red)
- **Warning**: #f7931e (orange)
- **Info**: #4a90e2 (blue)

### Typography:
- Section headers: Space Grotesk, 24px, bold
- Field labels: IBM Plex Mono, 12px, uppercase
- Input text: Space Grotesk, 16px
- Helper text: IBM Plex Mono, 12px, secondary color

---

## Open Questions for Architect

1. **Username Changes**: Allow username changes? How often? Redirect old URLs?
2. **2FA**: Required for admins? Which TOTP apps supported?
3. **OAuth Providers**: Which social login providers to support?
4. **Data Export**: What format (JSON, CSV, ZIP)? How long to keep?
5. **Account Deletion**: Immediate or grace period? What happens to content?
6. **Email Verification**: Required for signup or optional? Re-verify on email change?
7. **Session Management**: Max concurrent sessions? Automatic timeout?

---

**Next Steps**:
- Architect reviews specification
- Design mockups for settings pages
- Implement settings layout and navigation
- Build individual settings sections
- Integrate with existing profile and notification systems
