# HonkingVersion API Documentation

Complete API reference for HonkingVersion - A Goose music database and community platform.

## Quick Start

### Authentication

All endpoints that require authentication use Bearer token authentication via JWT:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" https://api.honkingversion.runfoo.run/users/me
```

### Base URLs

- **Production:** `https://api.honkingversion.runfoo.run`
- **Development:** `http://localhost:8000`

### OpenAPI/Swagger Specification

The complete API specification is available in OpenAPI 3.0 format:

- **File:** `openapi.yaml`
- **Interactive Docs (in development):** Will be available at `/docs`

## API Endpoints Overview

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Users
- `GET /users/me` - Get current user profile
- `GET /users/{username}` - Get public user profile

### Shows
- `GET /shows` - List all shows (paginated)
- `GET /shows/{date}` - Get show details by date

### Songs
- `GET /songs` - List all songs (paginated)
- `GET /songs/{slug}` - Get song details
- `GET /songs/{slug}/performances` - Get all performances of a song

### Venues
- `GET /venues` - List all venues (paginated)
- `GET /venues/{slug}` - Get venue details and shows

### Performances
- Performance data is accessed through show and song endpoints

### Votes & Reviews
- `GET /votes` - List votes/reviews with filtering
- `POST /votes` - Create a new vote/review
- `PUT /votes/{vote_id}` - Update a vote
- `DELETE /votes/{vote_id}` - Delete a vote

### Attended Shows
- `GET /attended` - Get user's attended shows
- `POST /attended` - Mark a show as attended

### Lists
- `GET /lists` - List public lists
- `POST /lists` - Create a new list
- `GET /lists/{list_id}` - Get list details
- `PUT /lists/{list_id}` - Update a list
- `DELETE /lists/{list_id}` - Delete a list

### Follows
- `POST /follows/{username}` - Follow a user
- `DELETE /follows/{username}` - Unfollow a user

### Settings
- `GET /settings/profile` - Get profile settings
- `PUT /settings/profile` - Update profile settings
- `PUT /settings/account/email` - Change email
- `PUT /settings/account/password` - Change password
- `GET /settings/privacy` - Get privacy settings
- `PUT /settings/privacy` - Update privacy settings

### Notifications
- `GET /notifications` - Get user notifications
- `POST /notifications/{notification_id}/mark-read` - Mark notification as read

### Export
- `GET /export/me/csv` - Export user data as CSV

## Common Patterns

### Pagination

Most list endpoints support pagination:

```bash
GET /shows?skip=0&limit=50
```

- **skip:** Number of items to skip (default: 0)
- **limit:** Maximum items to return (default: 50, max: 100)

### Filtering

Filter endpoints by query parameters:

```bash
GET /votes?min_rating=8&max_rating=10&show_id=123
```

Available filters vary by endpoint - see OpenAPI spec for details.

### Response Format

All responses are JSON with the following structure:

**Success (2xx):**
```json
{
  "data": { ... },
  "status": "success"
}
```

**Error (4xx/5xx):**
```json
{
  "detail": "Error message",
  "status": "error"
}
```

### Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created
- **204 No Content** - Successful deletion
- **400 Bad Request** - Invalid input
- **401 Unauthorized** - Missing or invalid authentication
- **404 Not Found** - Resource not found
- **422 Unprocessable Entity** - Validation error
- **500 Internal Server Error** - Server error

## Data Models

### User
```json
{
  "id": 1,
  "username": "honkfan42",
  "email": "honkfan@example.com",
  "display_name": "Honk Fan",
  "bio": "Goose enthusiast",
  "profile_picture_url": "https://...",
  "created_at": "2024-01-15T10:30:00Z",
  "followers_count": 42,
  "following_count": 35,
  "is_verified": true
}
```

### Show
```json
{
  "id": 123,
  "date": "2024-07-20",
  "venue": "Red Rocks Amphitheatre",
  "location": "Morrison, CO",
  "setlist": [
    {
      "set_number": 1,
      "song": {...},
      "performance_id": 456
    }
  ],
  "attendees_count": 1500,
  "average_rating": 9.2
}
```

### Song
```json
{
  "id": 1,
  "name": "Lizards",
  "slug": "lizards",
  "is_cover": false,
  "original_artist": null,
  "first_appearance": "2015-03-14",
  "times_performed": 145,
  "average_rating": 8.7
}
```

### Vote/Review
```json
{
  "id": 789,
  "user_id": 1,
  "target_type": "show",
  "target_id": 123,
  "rating": 9.5,
  "review_text": "Amazing setlist, great energy",
  "created_at": "2024-07-21T15:30:00Z",
  "updated_at": "2024-07-21T15:30:00Z"
}
```

## Authentication Examples

### Register a New User
```bash
curl -X POST https://api.honkingversion.runfoo.run/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "user@example.com",
    "password": "SecurePassword123"
  }'
```

### Login
```bash
curl -X POST https://api.honkingversion.runfoo.run/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "SecurePassword123"
  }'
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {...}
}
```

### Using the Token
```bash
curl -H "Authorization: Bearer eyJhbGc..." \
  https://api.honkingversion.runfoo.run/users/me
```

## Common Use Cases

### Get All Shows by a Venue
```bash
curl https://api.honkingversion.runfoo.run/venues/red-rocks
```

### Search Votes by Rating
```bash
curl "https://api.honkingversion.runfoo.run/votes?min_rating=8&max_rating=10"
```

### Create a Vote
```bash
curl -X POST https://api.honkingversion.runfoo.run/votes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "target_type": "show",
    "target_id": 123,
    "rating": 9.5,
    "review_text": "Amazing show!"
  }'
```

### Get Personal Attended Shows
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.honkingversion.runfoo.run/attended
```

### Create a List
```bash
curl -X POST https://api.honkingversion.runfoo.run/lists \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Best Red Rocks Shows",
    "description": "My favorite shows at Red Rocks",
    "list_type": "shows",
    "items": "[123, 456, 789]",
    "is_public": true
  }'
```

## Error Handling

All errors follow a consistent format:

```json
{
  "detail": "Description of what went wrong",
  "status": "error"
}
```

### Common Errors

| Error | Status | Description |
|-------|--------|-------------|
| Invalid credentials | 401 | Username/password combination incorrect |
| User already exists | 400 | Email or username already registered |
| Not authenticated | 401 | Missing or invalid Bearer token |
| Resource not found | 404 | Show, song, user, etc. not found |
| Invalid input | 400 | Required field missing or invalid format |

## Rate Limiting

(To be implemented) Current implementation has no rate limiting.

## Versioning

API version: **1.0.0**

Breaking changes will increment the major version number.

## Support

For issues or questions:
- Report issues at https://github.com/anthropics/honkingversion/issues
- Contact: support@honkingversion.runfoo.run

## Related Documentation

- [Frontend API Integration Guide](../web/docs/API_INTEGRATION.md)
- [Database Schema](./models.py)
- [Authentication Implementation](./routes/auth.py)
