# Future Features Specification

This document outlines three major feature sets for future implementation (Phase 4+).

---

## Feature 1: Performance Nicknames ("City Songs")

### Overview
Allow community members to suggest, moderate, and approve alternative titles for notable performances. Examples: "Milwaukee Madhuvan", "Indy Tumble", "Tahoe Tweezer".

### User Roles & Permissions

#### Power Users
- Can suggest nicknames for any performance
- Suggestions go into moderation queue
- Can upvote/downvote existing suggestions

#### Moderators
- Review nickname suggestions
- Approve or reject suggestions
- Can edit suggested nicknames before approval
- Cannot see private user data

#### Admins
- All moderator permissions
- Can make approved nicknames "permanent"
- Can remove permanent status
- Cannot see private user data

#### God Mode User
- Full system access (disabled by default)
- Can see all data including private
- Must explicitly enable god mode for each session
- All god mode actions are logged

### Database Schema

```sql
-- Performance nicknames table
CREATE TABLE performance_nicknames (
    id INTEGER PRIMARY KEY,
    performance_id INTEGER NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'suggested', 'approved', 'permanent', 'rejected'
    suggested_by INTEGER NOT NULL, -- user_id
    suggested_at TIMESTAMP NOT NULL,
    approved_by INTEGER, -- user_id (moderator)
    approved_at TIMESTAMP,
    made_permanent_by INTEGER, -- user_id (admin)
    made_permanent_at TIMESTAMP,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    FOREIGN KEY (performance_id) REFERENCES song_performances(id),
    FOREIGN KEY (suggested_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (made_permanent_by) REFERENCES users(id)
);

-- Nickname votes (for community voting)
CREATE TABLE nickname_votes (
    id INTEGER PRIMARY KEY,
    nickname_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    vote_type VARCHAR(10) NOT NULL, -- 'up' or 'down'
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (nickname_id) REFERENCES performance_nicknames(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(nickname_id, user_id)
);
```

### API Endpoints

```
POST   /nicknames/                    - Suggest a nickname (power users)
GET    /nicknames/performance/{id}    - Get all nicknames for a performance
POST   /nicknames/{id}/vote           - Vote on a suggested nickname
GET    /nicknames/pending              - Get pending suggestions (moderators)
PUT    /nicknames/{id}/approve         - Approve a nickname (moderators)
PUT    /nicknames/{id}/reject          - Reject a nickname (moderators)
PUT    /nicknames/{id}/permanent       - Make permanent (admins)
DELETE /nicknames/{id}                 - Remove nickname (admins)
```

### UI Components

#### For All Users
- Display approved/permanent nicknames alongside song names
- Example: "Madhuvan (Milwaukee Madhuvan)"
- Tooltip showing nickname origin and approval date

#### For Power Users
- "Suggest Nickname" button on performance rows
- Modal with nickname input and optional description
- View their suggested nicknames and status

#### For Moderators
- Moderation queue page (`/moderation/nicknames`)
- Review suggestions with context (show date, venue, performance details)
- Approve/reject/edit buttons
- See community votes on suggestions

#### For Admins
- Additional "Make Permanent" button on approved nicknames
- Nickname management page with all statuses
- Ability to remove permanent status

### Workflow

1. **Suggestion**: Power user suggests "Milwaukee Madhuvan" for a specific Madhuvan performance
2. **Community Vote**: Other users can upvote/downvote the suggestion
3. **Moderation**: Moderator reviews, sees it has 50 upvotes, approves it
4. **Display**: Nickname now shows as "Madhuvan (Milwaukee Madhuvan)" on that performance
5. **Permanence**: Admin sees it's widely used, makes it permanent (can't be removed by moderators)

---

## Feature 2: Performance Sequences (Transitions & Medleys)

### Overview
Link individual performances into sequences to document transitions, medleys, and couplings. Examples: "Seekers > Tumble", "Arcadia > Borne > Arcadia", "Hot Tea > Yeti".

### Database Schema

```sql
-- Performance sequences
CREATE TABLE performance_sequences (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- e.g., "Seekers > Tumble"
    description TEXT, -- Context about the transition
    show_id INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (show_id) REFERENCES shows(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Sequence members (ordered)
CREATE TABLE sequence_performances (
    id INTEGER PRIMARY KEY,
    sequence_id INTEGER NOT NULL,
    performance_id INTEGER NOT NULL,
    position INTEGER NOT NULL, -- Order in sequence (1, 2, 3...)
    transition_type VARCHAR(50), -- 'segue', 'tease', 'jam', 'medley'
    notes TEXT, -- Optional notes about this transition
    FOREIGN KEY (sequence_id) REFERENCES performance_sequences(id),
    FOREIGN KEY (performance_id) REFERENCES song_performances(id),
    UNIQUE(sequence_id, position)
);
```

### API Endpoints

```
POST   /sequences/                     - Create a sequence
GET    /sequences/{id}                 - Get sequence details
PUT    /sequences/{id}                 - Update sequence
DELETE /sequences/{id}                 - Delete sequence
POST   /sequences/{id}/performances    - Add performance to sequence
DELETE /sequences/{id}/performances/{perf_id} - Remove from sequence
GET    /shows/{date}/sequences         - Get all sequences for a show
GET    /sequences/featured             - Get featured sequences
```

### UI Components

#### Setlist Display
- Visual indicator for sequences: "Seekers **>** Tumble"
- Clicking the ">" opens sequence detail modal
- Highlight sequences with subtle background color

#### Sequence Detail Page (`/sequences/[id]`)
- Sequence name and description
- List of performances in order with transition types
- Individual voting still visible for each performance
- Aggregate stats (total length, average rating)
- Notes about the significance

#### Create Sequence Modal
- Select performances from setlist (checkbox multi-select)
- Drag to reorder
- Set transition types between songs
- Add description/notes

### Features

- **Voting**: Users vote on individual performances, not the sequence
- **Stats**: Sequence shows aggregate data (avg rating, total length)
- **Context**: Rich description field for explaining significance
- **Featured**: Admins can feature notable sequences
- **Discovery**: Browse sequences by transition type or rating

### Example Use Cases

1. **Epic Jam**: "Seekers > Tumble" - 45-minute transition at Red Rocks
2. **Medley**: "Hot Tea > Yeti > Hot Tea" - Rare sandwich
3. **Tease**: "Arcadia (w/ Borne tease)" - Notable tease during jam
4. **Coupling**: "Madhuvan > Tumble" - Common pairing

---

## Feature 3: Granular Privacy System

### Overview
Users have fine-grained control over what data is visible to others. Private data is obfuscated but still contributes to aggregate scores with reduced weight if significant.

### Privacy Levels

#### Per-Item Privacy Settings
Users can make private:
- Individual vote/rating (obfuscated: "User voted" vs "User gave 4.5 stars")
- Individual review text
- List membership (list exists but items hidden)
- Show attendance
- Following/followers lists
- Activity feed items

#### Privacy Options
- **Public**: Fully visible to everyone
- **Friends**: Visible to followed users only
- **Private**: Obfuscated or hidden

### Database Schema

```sql
-- Add privacy fields to existing tables
ALTER TABLE votes ADD COLUMN is_private BOOLEAN DEFAULT FALSE;
ALTER TABLE user_lists ADD COLUMN privacy VARCHAR(20) DEFAULT 'public'; -- 'public', 'friends', 'private'
ALTER TABLE user_show_attendance ADD COLUMN is_private BOOLEAN DEFAULT FALSE;
ALTER TABLE user_follows ADD COLUMN is_private BOOLEAN DEFAULT FALSE;

-- User privacy settings
CREATE TABLE user_privacy_settings (
    user_id INTEGER PRIMARY KEY,
    default_vote_privacy VARCHAR(20) DEFAULT 'public',
    default_list_privacy VARCHAR(20) DEFAULT 'public',
    default_attendance_privacy VARCHAR(20) DEFAULT 'public',
    show_following BOOLEAN DEFAULT TRUE,
    show_followers BOOLEAN DEFAULT TRUE,
    show_activity_feed BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- God mode audit log
CREATE TABLE god_mode_log (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    action VARCHAR(255) NOT NULL,
    accessed_user_id INTEGER,
    accessed_data_type VARCHAR(100),
    timestamp TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (accessed_user_id) REFERENCES users(id)
);
```

### Privacy Rules

#### For Private Votes
- **Display**: "User voted on this performance" (no rating shown)
- **Aggregation**: Vote counts toward average with 0.5x weight if it significantly impacts score
- **Threshold**: If private vote would change average by >0.3 points, apply reduced weight
- **Activity Feed**: No announcement of private votes

#### For Private Lists
- **Display**: List title visible, items hidden
- **Count**: Shows "X items" but not what they are
- **Access**: Only owner can see items

#### For Private Attendance
- **Display**: Not shown on profile or show attendee lists
- **Stats**: Counts toward user's total but not publicly visible

#### For Private Following
- **Display**: Follower/following counts may be hidden
- **Lists**: `/u/{username}/followers` shows "This user's followers are private"

### God Mode

#### Activation
- Must be explicitly enabled per session
- Requires additional authentication
- Auto-disables after 1 hour
- Shows prominent banner: "GOD MODE ACTIVE"

#### Capabilities
- View all private data
- See obfuscated ratings
- Access private lists
- View private activity

#### Logging
- All god mode actions logged
- Log includes: user, action, accessed data, timestamp, IP
- Logs are immutable and auditable
- Monthly god mode usage reports

### API Endpoints

```
GET    /users/me/privacy               - Get user's privacy settings
PUT    /users/me/privacy               - Update privacy settings
PUT    /votes/{id}/privacy             - Toggle vote privacy
PUT    /lists/{id}/privacy             - Change list privacy
GET    /admin/god-mode/enable          - Enable god mode (requires auth)
POST   /admin/god-mode/disable         - Disable god mode
GET    /admin/god-mode/logs            - View god mode audit logs
```

### UI Components

#### Privacy Settings Page (`/settings/privacy`)
- Toggle switches for each privacy option
- Default privacy levels for new content
- Explanation of obfuscation and weighting
- "Make all votes private" bulk action

#### Per-Item Privacy Controls
- Lock icon on each vote/review/list
- Click to toggle privacy
- Visual indicator (🔒) for private items
- Tooltip explaining privacy level

#### God Mode UI
- Prominent red banner when active
- "Disable God Mode" button always visible
- Warning before accessing private data
- Activity log visible to god mode user

### Privacy Weighting Algorithm

```python
def calculate_weighted_average(votes):
    public_votes = [v for v in votes if not v.is_private]
    private_votes = [v for v in votes if v.is_private]
    
    # Calculate public average
    if public_votes:
        public_avg = sum(v.rating for v in public_votes) / len(public_votes)
    else:
        public_avg = 0
    
    # Check if private votes significantly impact score
    total_avg = sum(v.rating for v in votes) / len(votes)
    impact = abs(total_avg - public_avg)
    
    if impact > 0.3:  # Significant impact threshold
        # Apply reduced weight to private votes
        weighted_sum = sum(v.rating for v in public_votes)
        weighted_sum += sum(v.rating * 0.5 for v in private_votes)
        weighted_count = len(public_votes) + (len(private_votes) * 0.5)
        return weighted_sum / weighted_count
    else:
        # Private votes don't significantly impact, use full weight
        return total_avg
```

---

## Implementation Priority

These features should be implemented in the following order:

1. **Granular Privacy System** (Foundation)
   - Required for other features to respect privacy
   - Establishes user trust
   - Relatively independent of other features

2. **Performance Nicknames**
   - Builds on existing performance data
   - Requires moderation system
   - Enhances community engagement

3. **Performance Sequences**
   - Most complex feature
   - Requires mature performance voting system
   - Benefits from established community

## Technical Considerations

### Performance
- Cache nickname lookups
- Index sequence queries by show_id
- Lazy-load private data checks

### Security
- Rate limit god mode activation
- Encrypt god mode logs
- Implement IP-based access controls
- Regular privacy audit reports

### UX
- Clear privacy indicators
- Easy bulk privacy controls
- Transparent obfuscation explanations
- Prominent god mode warnings

---

## Success Metrics

### Performance Nicknames
- Number of suggestions per month
- Approval rate
- Community engagement (votes on suggestions)
- Usage of approved nicknames in discussions

### Performance Sequences
- Sequences created per show
- Featured sequence views
- User engagement with sequence pages
- Discovery through sequence browsing

### Privacy System
- Privacy settings adoption rate
- Private content percentage
- God mode usage frequency
- User trust metrics (surveys)
