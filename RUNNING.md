# Running Daily Two - Complete Guide

## ✅ What's Been Built

### Backend (Django + PostgreSQL)
- ✅ User authentication with JWT
- ✅ Email-based invitations
- ✅ Track upload with auto-transcoding to 256kbps MP3
- ✅ Monthly campaign tagging
- ✅ Timestamp comments system
- ✅ RESTful API endpoints
- ✅ Admin panel for user management

### Frontend (Next.js + React)
- ✅ Dark theme UI with Tailwind CSS
- ✅ Login/Register pages
- ✅ Homepage with daily track feed
- ✅ Media player with Howler.js
- ✅ Upload modal with drag & drop
- ✅ Artist pages with playlists
- ✅ Responsive design

---

## 🚀 Quick Start (Running Everything)

### Prerequisites Check

```bash
# Check PostgreSQL
psql --version

# Check Redis
redis-cli ping

# Check FFmpeg
ffmpeg -version

# Check Node.js
node --version

# Check Python
python3 --version
```

### 1. Start PostgreSQL

```bash
# Start PostgreSQL service
sudo service postgresql start

# Create database (first time only)
sudo -u postgres psql -c "CREATE DATABASE dailytwo;"
sudo -u postgres psql -c "ALTER DATABASE dailytwo OWNER TO postgres;"
```

### 2. Start Redis

```bash
# Start Redis server
redis-server

# Or as a service
sudo service redis-server start
```

### 3. Backend Setup (First Time Only)

```bash
cd /home/user/Daily-two/backend

# Activate virtual environment
source venv/bin/activate

# Run migrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser
# Username: admin
# Email: admin@example.com
# Password: (choose a password)
```

### 4. Start Backend (Django + Celery)

**Terminal 1 - Django Server:**
```bash
cd /home/user/Daily-two/backend
source venv/bin/activate
python manage.py runserver
```
→ Backend running at: http://localhost:8000

**Terminal 2 - Celery Worker:**
```bash
cd /home/user/Daily-two/backend
source venv/bin/activate
celery -A config worker -l info
```
→ Handles audio transcoding

### 5. Frontend Setup (First Time Only)

```bash
cd /home/user/Daily-two/frontend

# Install dependencies
npm install
```

### 6. Start Frontend

**Terminal 3 - Next.js:**
```bash
cd /home/user/Daily-two/frontend
npm run dev
```
→ Frontend running at: http://localhost:3000

---

## 🎯 Using the Application

### 1. Access Admin Panel

1. Go to http://localhost:8000/admin
2. Login with superuser credentials
3. Navigate to **Invitations** → **Add Invitation**
4. Enter an email address (e.g., `test@example.com`)
5. Save (invitation will be printed to console)
6. Copy the invitation token from the console

### 2. Register a New User

1. Go to http://localhost:3000/register
2. Paste the invitation token
3. Choose username and password
4. Click "Create Account"

### 3. Upload Music

1. Login at http://localhost:3000
2. Click **"Upload ⬆"** button
3. Enter track title
4. Drag & drop an MP3/WAV/FLAC file
5. Click **"Upload 🚀"**
6. Track will show "Processing..." while transcoding
7. After ~30 seconds, track becomes playable

### 4. Listen to Music

1. On homepage, click **"🎵 PLAY ALL"** to queue everything
2. Or click **▶** button on individual tracks
3. Use fixed player bar at bottom for controls:
   - ⏮ Previous track
   - ⏯ Play/Pause
   - ⏭ Next track
   - 🔊 Volume control

### 5. Artist Pages

1. Click any **@username** link
2. View all tracks by that artist
3. Click **"PLAY ALL"** to queue their tracks

---

## 📂 Project Structure

```
Daily-two/
├── backend/                    # Django backend
│   ├── manage.py
│   ├── config/                # Settings, URLs
│   ├── users/                 # Auth, invitations
│   ├── tracks/                # Upload, transcoding
│   ├── comments/              # Timestamp comments
│   ├── campaigns/             # Monthly campaigns
│   ├── media/                 # Uploaded files
│   └── requirements.txt
│
├── frontend/                   # Next.js frontend
│   ├── app/                   # Pages (login, register, home, artist)
│   ├── components/            # Reusable components
│   │   ├── auth/             # Auth provider
│   │   ├── layout/           # Navbar
│   │   ├── player/           # Now playing bar
│   │   └── track/            # Track items, upload modal
│   ├── lib/
│   │   ├── api/              # API client
│   │   └── store/            # Zustand stores
│   ├── types/                # TypeScript types
│   └── package.json
│
├── README.md
├── SETUP.md
├── API.md
├── DESIGN.md
└── RUNNING.md (this file)
```

---

## 🎨 Features Working

### ✅ Implemented
- User authentication (JWT tokens)
- Email invitations
- Track upload & auto-transcoding
- Daily track feed (reverse chronological)
- Media player with queue management
- Artist pages
- Campaign tagging (auto-created monthly)
- Delete tracks (own tracks only)
- Responsive dark theme UI

### ⏳ Still TODO (Next Phase)
- Full waveform visualization (WaveSurfer.js)
- Timestamp comments with auto-popup
- Track detail page with comments
- Click-to-comment on waveform
- Real-time comment notifications

---

## 🔧 Troubleshooting

### Backend Issues

**Database connection error:**
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Restart if needed
sudo service postgresql restart
```

**Celery not processing:**
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# Restart Celery worker
celery -A config worker -l info
```

**Port already in use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
python manage.py runserver 8001
```

### Frontend Issues

**API connection error:**
```bash
# Check backend is running
curl http://localhost:8000/api/auth/login/

# Check .env.local
cat frontend/.env.local
# Should contain: NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Build errors:**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### Audio Playback Issues

**Tracks won't play:**
- Check file transcoding completed (status should be "completed")
- Check browser console for errors
- Try a different browser (Chrome/Firefox recommended)
- Check file permissions on media directory

**CORS errors:**
- Backend CORS is configured for `http://localhost:3000`
- If using different port, update `backend/.env` → `FRONTEND_URL`

---

## 🧪 Testing

### Test User Registration Flow

```bash
# 1. Create invitation (in admin panel)
# 2. Copy token from console output
# 3. Visit http://localhost:3000/register?token=<TOKEN>
# 4. Complete registration
# 5. Should redirect to homepage
```

### Test Upload & Playback

```bash
# 1. Login
# 2. Upload an MP3 file
# 3. Wait ~30 seconds for transcoding
# 4. Track should show waveform and be playable
# 5. Check Celery logs for transcoding status
```

### Test API Endpoints

```bash
# Login and get token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "yourpassword"}'

# Copy access token, then:
TOKEN="<your-token>"

# List tracks
curl http://localhost:8000/api/tracks/ \
  -H "Authorization: Bearer $TOKEN"

# Get current user
curl http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Monitoring

### Check Backend Logs

```bash
# Django server logs (Terminal 1)
# Watch for requests and errors

# Celery worker logs (Terminal 2)
# Watch for transcoding tasks:
# [2024-12-11 05:00:00,000: INFO/MainProcess] Task tracks.tasks.transcode_audio_to_mp3
```

### Check Database

```bash
# Connect to database
psql -U postgres -d dailytwo

# Useful queries:
SELECT COUNT(*) FROM tracks;
SELECT COUNT(*) FROM users;
SELECT title, status FROM tracks ORDER BY uploaded_at DESC LIMIT 10;
```

### Check Media Files

```bash
# List uploaded tracks
ls -lh backend/media/tracks/

# Check file sizes
du -sh backend/media/
```

---

## 🎉 Success Checklist

- [ ] PostgreSQL running
- [ ] Redis running
- [ ] Django server running (port 8000)
- [ ] Celery worker running
- [ ] Next.js server running (port 3000)
- [ ] Can access admin panel
- [ ] Can create invitations
- [ ] Can register new user
- [ ] Can login
- [ ] Can upload track
- [ ] Track transcodes successfully
- [ ] Can play music
- [ ] Media player controls work
- [ ] Can view artist pages

---

## 📝 Quick Commands Reference

```bash
# Start everything (use separate terminals)
cd backend && source venv/bin/activate && python manage.py runserver
cd backend && source venv/bin/activate && celery -A config worker -l info
cd frontend && npm run dev

# Stop everything
# Press Ctrl+C in each terminal

# Reset database (DANGER - deletes all data)
cd backend && python manage.py flush

# Create new superuser
cd backend && python manage.py createsuperuser

# Check backend health
curl http://localhost:8000/admin/

# Check frontend health
curl http://localhost:3000/
```

---

## 🚀 What's Next?

The app is fully functional! To add the remaining features:

1. **Full Waveform View**: Implement WaveSurfer.js on track detail page
2. **Timestamp Comments**: Add comment markers on waveform
3. **Auto-Popup Comments**: Trigger comments during playback
4. **Comment Creation**: Click waveform to add comments

See **DESIGN.md** for UI mockups and **API.md** for API endpoints.

---

**Enjoy your music! 🎵**
