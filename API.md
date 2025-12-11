# Daily Two API Documentation

Base URL: `http://localhost:8000/api`

## Authentication

All authenticated endpoints require a JWT access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Auth Endpoints

#### Register
**POST** `/auth/register/`

Register a new user with an invitation token.

**Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "invitation_token": "uuid-token-here"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com",
    "is_admin": false,
    "date_joined": "2024-01-15T10:30:00Z"
  },
  "tokens": {
    "refresh": "refresh-token",
    "access": "access-token"
  }
}
```

#### Login
**POST** `/auth/login/`

**Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": { ... },
  "tokens": {
    "refresh": "refresh-token",
    "access": "access-token"
  }
}
```

#### Refresh Token
**POST** `/auth/refresh/`

**Body:**
```json
{
  "refresh": "refresh-token"
}
```

**Response:** `200 OK`
```json
{
  "access": "new-access-token"
}
```

#### Get Current User
**GET** `/auth/me/`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "username": "johndoe",
  "email": "john@example.com",
  "is_admin": false,
  "date_joined": "2024-01-15T10:30:00Z"
}
```

---

## Users

#### Get User Details
**GET** `/users/{user_id}/`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "username": "johndoe",
  "email": "john@example.com",
  "is_admin": false,
  "date_joined": "2024-01-15T10:30:00Z"
}
```

---

## Invitations (Admin Only)

#### Create Invitation
**POST** `/invitations/`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "email": "newuser@example.com"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "email": "newuser@example.com",
  "token": "invitation-token-uuid",
  "invited_by": "admin-user-id",
  "invited_by_username": "admin",
  "used": false,
  "used_by": null,
  "used_by_username": null,
  "created_at": "2024-01-15T10:30:00Z",
  "expires_at": "2024-01-22T10:30:00Z",
  "is_valid": true
}
```

#### List All Invitations
**GET** `/invitations/list/`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "token": "uuid",
    "used": false,
    "is_valid": true,
    ...
  }
]
```

#### Validate Invitation
**GET** `/invitations/validate/{token}/`

**Response:** `200 OK`
```json
{
  "valid": true,
  "email": "user@example.com"
}
```

---

## Tracks

#### List All Tracks (Grouped by Day)
**GET** `/tracks/`

**Headers:** `Authorization: Bearer <token>`

Returns tracks grouped by upload date in reverse chronological order.

**Response:** `200 OK`
```json
[
  {
    "date": "2024-01-15",
    "tracks": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "username": "johndoe",
        "campaign_name": "January Campaign",
        "title": "My Track",
        "file_url": "http://localhost:8000/media/tracks/...",
        "duration_seconds": "245.50",
        "upload_date": "2024-01-15",
        "uploaded_at": "2024-01-15T14:30:00Z",
        "status": "completed",
        "comment_count": 5
      }
    ]
  },
  {
    "date": "2024-01-14",
    "tracks": [ ... ]
  }
]
```

#### Upload Track
**POST** `/tracks/upload/`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Body (Form Data):**
- `title`: Track title
- `file`: Audio file (max 20MB)

**Accepted Audio Formats:**
- .mp3, .wav, .flac, .m4a, .aac, .ogg, .wma, .aiff, .ape

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "user": { ... },
  "campaign": { ... },
  "title": "My Track",
  "original_filename": "track.mp3",
  "file": "tracks/user-id/2024/01/15/uuid.mp3",
  "file_url": "http://localhost:8000/media/tracks/...",
  "duration_seconds": null,  // Will be set after transcoding
  "file_size_bytes": 5242880,
  "upload_date": "2024-01-15",
  "uploaded_at": "2024-01-15T14:30:00Z",
  "status": "pending",  // Changes to "processing" then "completed"
  "comment_count": 0
}
```

**Note:** The file will be automatically transcoded to 256kbps MP3 asynchronously.

#### Get Track Details
**GET** `/tracks/{track_id}/`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "user": { ... },
  "campaign": { ... },
  "title": "My Track",
  "file_url": "http://localhost:8000/media/tracks/...",
  "duration_seconds": "245.50",
  "status": "completed",
  "comment_count": 5,
  ...
}
```

#### Delete Track
**DELETE** `/tracks/{track_id}/`

**Headers:** `Authorization: Bearer <token>`

**Response:** `204 No Content`

**Note:** Only track owner or admin can delete. Deletes file and all comments.

#### Get User's Tracks (Artist Page)
**GET** `/tracks/user/{user_id}/`

**Headers:** `Authorization: Bearer <token>`

Returns all tracks by a specific user in reverse chronological order.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "username": "johndoe",
    "title": "Track 1",
    "file_url": "...",
    ...
  },
  ...
]
```

---

## Comments

#### List Track Comments
**GET** `/comments/track/{track_id}/`

**Headers:** `Authorization: Bearer <token>`

Returns all comments for a track, ordered by timestamp.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "track": "track-uuid",
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "username": "johndoe",
    "timestamp_seconds": "45.50",
    "comment_text": "Great drop here!",
    "created_at": "2024-01-15T15:00:00Z"
  },
  ...
]
```

#### Create Comment
**POST** `/comments/track/{track_id}/`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "track": "track-uuid",
  "timestamp_seconds": 45.50,
  "comment_text": "Great drop here!"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "track": "track-uuid",
  "user": { ... },
  "username": "johndoe",
  "timestamp_seconds": "45.50",
  "comment_text": "Great drop here!",
  "created_at": "2024-01-15T15:00:00Z"
}
```

#### Delete Comment
**DELETE** `/comments/{comment_id}/`

**Headers:** `Authorization: Bearer <token>`

**Response:** `204 No Content`

**Note:** Only comment author or admin can delete.

---

## Campaigns

#### List All Campaigns
**GET** `/campaigns/`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "January Campaign",
    "month": 1,
    "year": 2024,
    "created_at": "2024-01-01T00:00:00Z",
    "track_count": 45
  },
  ...
]
```

#### Get Campaign Details
**GET** `/campaigns/{campaign_id}/`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "January Campaign",
  "month": 1,
  "year": 2024,
  "created_at": "2024-01-01T00:00:00Z",
  "track_count": 45
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

---

## Notes

- All timestamps use ISO 8601 format with timezone (America/New_York, GMT-5)
- UUIDs are used for all primary keys
- Files are automatically transcoded to 256kbps MP3 after upload
- Campaigns are automatically created based on upload month/year
- Comments are automatically deleted when their track is deleted (CASCADE)
- Maximum file upload size: 20MB
