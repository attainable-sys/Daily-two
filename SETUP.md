# Daily Two - Complete Setup Guide

This guide will walk you through setting up the Daily Two music player platform from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+**
- **PostgreSQL 12+**
- **Redis** (for Celery task queue)
- **FFmpeg** (for audio transcoding)
- **Node.js 18+** (for frontend, when ready)

### Installing Prerequisites

#### On Ubuntu/Debian:
```bash
# Update package list
sudo apt update

# Install Python
sudo apt install python3.11 python3.11-venv python3-pip

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Redis
sudo apt install redis-server

# Install FFmpeg
sudo apt install ffmpeg

# Install Node.js (for frontend)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

#### On macOS (with Homebrew):
```bash
# Install Python
brew install python@3.11

# Install PostgreSQL
brew install postgresql@14
brew services start postgresql@14

# Install Redis
brew install redis
brew services start redis

# Install FFmpeg
brew install ffmpeg

# Install Node.js
brew install node
```

---

## Backend Setup

### 1. Clone the Repository

```bash
cd /home/user/Daily-two
```

### 2. Set Up Python Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Python Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your preferred settings
nano .env
```

**Key environment variables:**
```env
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=dailytwo
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Timezone (GMT-5)
TIME_ZONE=America/New_York

# Media
MEDIA_ROOT=/home/user/Daily-two/backend/media
MAX_UPLOAD_SIZE=20971520  # 20MB in bytes

# Email (Console backend for development)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 5. Set Up PostgreSQL Database

```bash
# Start PostgreSQL (if not already running)
sudo service postgresql start

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE dailytwo;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE dailytwo TO postgres;
ALTER DATABASE dailytwo OWNER TO postgres;
\q
EOF
```

**Or manually:**
```bash
sudo -u postgres psql
```
```sql
CREATE DATABASE dailytwo;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE dailytwo TO postgres;
ALTER DATABASE dailytwo OWNER TO postgres;
\q
```

### 6. Run Database Migrations

```bash
source venv/bin/activate
python manage.py migrate
```

Expected output:
```
Running migrations:
  Applying campaigns.0001_initial... OK
  Applying users.0001_initial... OK
  Applying tracks.0001_initial... OK
  Applying tracks.0002_initial... OK
  Applying comments.0001_initial... OK
  Applying comments.0002_initial... OK
  Applying comments.0003_initial... OK
  ...
```

### 7. Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

Follow the prompts:
```
Username: admin
Email: admin@example.com
Password: ********
Password (again): ********
```

### 8. Create Media Directory

```bash
mkdir -p media/tracks
```

---

## Running the Application

You'll need **3 terminal windows** to run the full stack:

### Terminal 1: Django Development Server

```bash
cd /home/user/Daily-two/backend
source venv/bin/activate
python manage.py runserver
```

Server will start at: **http://localhost:8000**

### Terminal 2: Redis Server

```bash
# Start Redis
redis-server
```

Or if installed as a service:
```bash
sudo service redis-server start
```

### Terminal 3: Celery Worker

```bash
cd /home/user/Daily-two/backend
source venv/bin/activate
celery -A config worker -l info
```

This handles audio transcoding tasks asynchronously.

---

## Testing the Setup

### 1. Access Admin Panel

- URL: http://localhost:8000/admin
- Login with superuser credentials created earlier

### 2. Send an Invitation

1. Login to admin panel
2. Navigate to **Invitations**
3. Click **Add Invitation**
4. Enter an email address
5. Save

The invitation will be printed to the console (since we're using console email backend).

### 3. Test API Endpoints

#### Check Health
```bash
curl http://localhost:8000/api/auth/me/
# Should return 401 Unauthorized (expected, no token)
```

#### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your-admin-password"
  }'
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    ...
  },
  "tokens": {
    "refresh": "...",
    "access": "..."
  }
}
```

#### Upload a Track

```bash
# Save the access token from login
TOKEN="your-access-token"

curl -X POST http://localhost:8000/api/tracks/upload/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Test Track" \
  -F "file=@/path/to/audio.mp3"
```

#### List Tracks
```bash
curl http://localhost:8000/api/tracks/ \
  -H "Authorization: Bearer $TOKEN"
```

---

## Troubleshooting

### PostgreSQL Connection Error

**Error:** `connection refused`

**Solution:**
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start if not running
sudo service postgresql start

# Check connection
psql -U postgres -d dailytwo
```

### Redis Connection Error

**Error:** `Error 111 connecting to localhost:6379`

**Solution:**
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Start if not running
redis-server
# Or: sudo service redis-server start
```

### FFmpeg Not Found

**Error:** `ffmpeg: command not found`

**Solution:**
```bash
# Install FFmpeg
sudo apt install ffmpeg  # Ubuntu/Debian
brew install ffmpeg      # macOS

# Verify installation
ffmpeg -version
```

### Celery Not Processing Tasks

**Error:** Audio files not transcoding

**Solution:**
```bash
# Check Celery worker is running
# Should see: [2024-01-15 14:30:00,000: INFO/MainProcess] Connected to redis://localhost:6379/0

# Restart Celery worker
# Press Ctrl+C to stop, then:
celery -A config worker -l info
```

### Permission Denied on Media Directory

**Error:** `Permission denied: 'media/tracks/'`

**Solution:**
```bash
# Create directory with correct permissions
mkdir -p media/tracks
chmod 755 media/tracks
```

### Migration Conflicts

**Error:** `Conflicting migrations detected`

**Solution:**
```bash
# Reset migrations (development only!)
rm -rf users/migrations/0*.py
rm -rf tracks/migrations/0*.py
rm -rf comments/migrations/0*.py
rm -rf campaigns/migrations/0*.py

# Recreate migrations
python manage.py makemigrations
python manage.py migrate
```

---

## Production Deployment

### Environment Variables for Production

```env
DEBUG=False
SECRET_KEY=<generate-strong-secret-key>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Use production database
DB_PASSWORD=<strong-password>

# Use production email backend
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Celery with production Redis
CELERY_BROKER_URL=redis://localhost:6379/0
```

### Collect Static Files

```bash
python manage.py collectstatic
```

### Use Production Server

```bash
# Install gunicorn (already in requirements.txt)
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Set Up Supervisor/Systemd

Create systemd service files for:
1. Django (Gunicorn)
2. Celery Worker
3. Redis (if not using system service)

---

## Next Steps

1. ✅ Backend API is complete and functional
2. ⏳ Frontend (Next.js) - Coming next
3. ⏳ Media player with waveform visualization
4. ⏳ Timestamp comment system with auto-popup
5. ⏳ Homepage with daily groupings
6. ⏳ Artist pages

---

## Development Tips

### Useful Commands

```bash
# Check migrations
python manage.py showmigrations

# Create a new migration
python manage.py makemigrations

# Run tests (when added)
python manage.py test

# Django shell
python manage.py shell

# Create sample data
python manage.py shell
>>> from users.models import User
>>> from campaigns.models import Campaign
>>> # Create test data...
```

### Database Management

```bash
# Backup database
pg_dump dailytwo > backup.sql

# Restore database
psql dailytwo < backup.sql

# Reset database (development only!)
python manage.py flush
```

### Celery Monitoring

```bash
# Monitor Celery tasks
celery -A config inspect active
celery -A config inspect stats
```

---

## Support

For issues or questions:
- Check the [API Documentation](API.md)
- Review [README.md](README.md)
- Check Django logs and Celery output
