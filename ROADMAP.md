# HonkingVersion Redevelopment & Front Page Planning

## Overview

This document outlines all missing and planned functionality for HonkingVersion, a social experience for voting on the best Goose performances. It includes a phased feature roadmap and detailed front page content inspired by headyversion.com but tailored for Goose fans.

***

## Phase 1 — Core Discovery (Highest Priority)

### 1. Individual Song Pages (/songs/[slug])
- Show song details and all performances ranked by rating
- Performance history timeline visualization
- Highlight "Top Version" clearly
- Provide links to listen/watch performances
- Backend API for `/songs/{slug}` and models ready; frontend missing

### 2. Performance Voting UI
- Voting controls on show pages for each individual song performance
- Real-time display of performance ratings
- Use `is_featured` to mark featured performances
- Backend vote endpoints and model ready; partial frontend

### 7. Search Functionality
- [x] Global search bar in navbar with autocomplete
- [x] Search results page listing shows, songs, and users
- [x] Backend search endpoints implemented; frontend complete

***

## Phase 2 — Social Features (High Priority)

### 3. User Following System
- Fully functional follow/unfollow buttons (profile header)
- Followers and following lists pages
- Activity feed displaying actions of followed users
- Accurate follower/following counts
- Backend supports users and follows; frontend needs completion

### 4. Tags System
- Tag creation, editing, and deletion UI
- Tag display with colors on performances and shows
- Filter performances/shows by tags (e.g., "Type II Jam", "Bustout")
- Backend models and relations exist; frontend missing

### 5. User Lists Create/Edit UI
- UI to create and edit custom lists of shows or performances
- Add/remove shows from lists with appropriate modals/forms
- Dedicated list detail pages at `/lists/[id]`
- Backend CRUD complete; frontend view-only currently

***

## Phase 3 — Enhanced Discovery

### 6. Shows Attended Tracking
- Allow users to mark shows as "attended"
- Display attended shows on user profiles
- Compute and display stats related to attendance
- Database model supports derivation; backend & frontend needed

### 8. Venue Pages
- List all venues on `/venues`
- Individual venue pages `/venues/[slug]`, with shows and stats
- Venue data exists in Show model; UI/backend missing

### 9. Performance Comparisons
- Side-by-side comparison UI for multiple versions
- Include audio/video links and stats (length, rating)
- Not implemented

### 10. Streaming Integration
- Embed or link Spotify, YouTube, Bandcamp, Nugs.net streams
- Not implemented

***

## Phase 4 — Engagement & Analytics

### 11. Comments on Reviews
- Allow comments on user reviews with nested replies
- Support upvoting comments
- Not implemented

### 12. Notifications
- Alerts for new followers, comments, and reviews
- Not implemented

### 13. Statistics Dashboard
- Display most-played songs, venue stats, trending performances
- User leaderboards
- Not implemented

### 14. Year/Tour Browsing
- Browse shows by year or tour
- Era comparisons and analysis
- Not implemented

### 15. Export/Share
- Export lists to external services (Spotify playlists, social media)
- Share functionality for lists and performances
- Not implemented

***

## HonkingVersion Front Page Planning (Goose-focused)

### Header / Introduction
- Title: "find the best versions of Goose songs"
- Tagline: "we're on the search for the dankest versions of Goose songs."
- Calls to action:
  - Please [login](/accounts/login/) or [register](/accounts/register/)
  - Get started by choosing a hot song below to begin your journey

### Hot Songs Section
Display popular Goose songs with links to their individual pages, e.g.:
- [Arcadia](/song/101/goose/arcadia/)
- [Indian River](/song/104/goose/indian-river/)
- [Apollo](/song/99/goose/apollo/)
- [Dark Storm](/song/120/goose/dark-storm/)
- Link: [View all songs](/search/all/?order=count)

### Get Involved Section
- Encourage users to [Sign up](/accounts/register/) to join the Goose fan community and share favorite versions.

### Leaderboard Section
Show top users and their contributions:
- [user123 — Birdsong Brigade +45892](/user_activity/user123/)
- [gooserules — Moonlight Magic +37860](/user_activity/gooserules/)
- [jamfan — Apollo Ace +34500](/user_activity/jamfan/)
- Additional leaderboard entries with links

### Hot Songs Repeated / New Submissions
- Repeat hot songs list for quick access
- Highlight recent Goose show submissions, e.g.:
  - [Indy Jam, Terminal 5, Nov 15, 2025](/submission/401/goose-indy-jam-terminal5-2025-11-15/)
  - [Arcadia, Red Rocks, Oct 14, 2025](/submission/399/goose-arcadia-redrocks-2025-10-14/)
  - [Apollo, The Anthem, Sept 22, 2025](/submission/395/goose-apollo-theanthem-2025-09-22/)
- Link: [More submissions](/submissions/)

### Recent Comments Section
Show recent Goose fan comments on performances:
- "[That Indy Jam blew my mind!](/submission/401/goose-indy-jam-terminal5-2025-11-15/?comment=70342)"
- "[Arcadia at Red Rocks is pure fire!](/submission/399/goose-arcadia-redrocks-2025-10-14/?comment=70340)"
- "[Loving the Apollo vibes here.](/submission/395/goose-apollo-theanthem-2025-09-22/?comment=70338)"
- Link: [More comments](/comments/)

### Footer Links
- Resources & Sponsors: [/resources]
- About page: [/about]

***

## Next Steps

- Prioritize Phase 1 core features to restore critical user-facing discovery and voting
- Develop detailed UI/UX designs and technical specs per feature in collaboration
- Use existing backend where present; extend backend and frontend incrementally
- Gradually integrate social and engagement features across Phases 2-4
- Build front page UI components reflecting Goose community content and calls to action
