# Daily Two - Music Player Homepage

A collaborative music sharing platform where users upload daily tracks that are organized chronologically and played like a media player.

## Features

- **Daily Playlist System**: Tracks organized by day with newest uploads at the top
- **Reverse Chronological Playback**: Play all tracks or individual user's tracks
- **Email-Based Invitations**: Admin-controlled user registration
- **Timestamp Comments**: Comment on specific moments in tracks (like SoundCloud)
- **Monthly Campaigns**: Tracks tagged with monthly campaign names
- **Audio Transcoding**: Automatic conversion to 256kbps MP3
- **Artist Pages**: Individual pages for each user with their uploaded tracks

## Tech Stack

### Backend
- **Django 4.2** - Web framework
- **Django REST Framework** - API
- **PostgreSQL** - Database
- **Celery + Redis** - Async task processing
- **FFmpeg** - Audio transcoding
- **JWT** - Authentication

### Frontend (Coming Soon)
- **Next.js** - React framework
- **Tailwind CSS** - Styling
- **Howler.js** - Audio playback
- **WaveSurfer.js** - Waveform visualization

## Setup Instructions

### Prerequisites

1. **Python 3.11+**
2. **PostgreSQL 12+**
3. **Redis** (for Celery)
4. **FFmpeg** (for audio transcoding)

### Installation

1. **Clone the repository**
   ```bash
   cd /home/user/Daily-two
   ```

2. **Backend Setup**
   ```bash
   cd backend

   # Create virtual environment
   python3 -m venv venv
   source venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Database Setup**
   ```bash
   # Start PostgreSQL (if not running)
   sudo service postgresql start

   # Create database
   sudo -u postgres psql -c "CREATE DATABASE dailytwo;"
   sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE dailytwo TO postgres;"
   ```

4. **Configure Environment**
   ```bash
   # Copy environment file
   cp .env.example .env

   # Edit .env with your settings if needed
   nano .env
   ```

5. **Run Migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start Redis** (in a separate terminal)
   ```bash
   redis-server
   ```

8. **Start Celery Worker** (in a separate terminal)
   ```bash
   cd backend
   source venv/bin/activate
   celery -A config worker -l info
   ```

9. **Start Development Server**
   ```bash
   python manage.py runserver
   ```

10. **Access Admin Panel**
    - URL: http://localhost:8000/admin
    - Login with superuser credentials

## Project Structure

```
Daily-two/
├── backend/
│   ├── config/          # Django settings and configuration
│   ├── users/           # User management and invitations
│   ├── tracks/          # Track uploads and audio processing
│   ├── comments/        # Timestamp-based comments
│   ├── campaigns/       # Monthly campaign management
│   ├── media/           # Uploaded files (created automatically)
│   ├── manage.py
│   └── requirements.txt
├── frontend/            # Next.js frontend (coming soon)
└── README.md
```

## API Endpoints (Coming Soon)

- `POST /api/auth/login/` - Login
- `POST /api/auth/register/` - Register with invitation token
- `GET /api/tracks/` - List all tracks (grouped by day)
- `POST /api/tracks/` - Upload track
- `DELETE /api/tracks/:id/` - Delete track
- `GET /api/tracks/:id/comments/` - Get track comments
- `POST /api/comments/` - Add timestamp comment
- `GET /api/users/:id/tracks/` - Get user's tracks
- `POST /api/invitations/` - Send invitation (admin only)

## Development Workflow

### Sending Invitations (Admin Only)

1. Login to admin panel
2. Go to Invitations
3. Click "Add Invitation"
4. Enter email address
5. Email will be sent with registration link

### Uploading Tracks

1. Login to the platform
2. Click "Upload Track"
3. Select audio file (any format, max 20MB)
4. File will be automatically transcoded to 256kbps MP3
5. Track appears on homepage grouped by upload day

### Commenting on Tracks

1. Click on a track to view
2. Click on the waveform at desired timestamp
3. Enter comment text
4. Comment will appear as a marker on the timeline
5. Comments auto-popup when playhead reaches them

## Timezone

The platform uses **America/New_York (GMT-5)** timezone for day grouping.

## File Storage

- Development: Local filesystem in `backend/media/`
- Production: Configure cloud storage (S3, etc.) as needed

## Contributing

This is a custom project. Please coordinate with the project owner before making changes.

## License

Private project - All rights reserved
