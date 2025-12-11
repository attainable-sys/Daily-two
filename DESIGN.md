# Daily Two - Frontend Design & UX

This document outlines the visual design, layout, and user experience for the Daily Two music player frontend.

## Design Philosophy

**Minimal, Music-First Interface**
- Clean, distraction-free design focused on the music
- Dark theme (like SoundCloud/Spotify) for reduced eye strain
- Waveform-centric interaction
- Prominent playback controls
- Clear visual hierarchy for daily groupings

---

## Color Scheme

```
Background:     #0F0F0F (Near black)
Surface:        #1A1A1A (Dark gray)
Border:         #2A2A2A (Medium gray)
Text Primary:   #FFFFFF (White)
Text Secondary: #A0A0A0 (Light gray)
Accent:         #FF4500 (Orange-red, SoundCloud style)
Success:        #1DB954 (Spotify green)
Error:          #FF3B30 (Red)
```

---

## Page Layouts

### 1. Homepage (Main Feed)

```
┌─────────────────────────────────────────────────────────────┐
│  DAILY TWO                                    🔔  [@username]│
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🎵  PLAY ALL                                     Upload ⬆   │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📅 TODAY - January 15, 2025                                 │
│  ─────────────────────────────────────────────────────────  │
│                                                               │
│  ▶  Track Title One                          by @username1   │
│      [━━━━━━━━━━━━━━━━━●━━━━━] 2:34 / 3:45                 │
│      💬 5 comments  •  2 hours ago                           │
│                                                               │
│  ▶  Another Great Track                      by @username2   │
│      [━━━━━━━━━━━━━━━━━━━━━━] 0:00 / 4:12                 │
│      💬 12 comments  •  3 hours ago                          │
│                                                               │
│  ▶  Awesome Beat                             by @username3   │
│      [━━━━━━━━━━━━━━━━━━━━━━] 0:00 / 2:58                 │
│      💬 3 comments  •  5 hours ago                           │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📅 YESTERDAY - January 14, 2025                             │
│  ─────────────────────────────────────────────────────────  │
│                                                               │
│  ▶  Cool Vibes                               by @username4   │
│      [━━━━━━━━━━━━━━━━━━━━━━] 0:00 / 3:22                 │
│      💬 8 comments  •  1 day ago                             │
│                                                               │
│  ▶  Night Dreams                             by @username1   │
│      [━━━━━━━━━━━━━━━━━━━━━━] 0:00 / 5:01                 │
│      💬 15 comments  •  1 day ago                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🎵 NOW PLAYING                                      │    │
│  │  Track Title One - @username1                       │    │
│  │  [━━━━━━━━━━━━●━━━━━━━━━━━━━] 2:34 / 3:45        │    │
│  │  ⏮  ⏯  ⏭     🔊 ▬▬▬▬▬▬●▬▬▬                       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Fixed "Now Playing" bar at bottom (always visible)
- Daily sections in reverse chronological order (newest at top)
- "PLAY ALL" button starts queue from top track
- Each track has individual play button
- Waveform preview for each track (simplified bars)
- Hover reveals delete button (for your own tracks)

---

### 2. Track Detail View (With Full Waveform)

When clicking on a track or the waveform preview:

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Feed                                  🔔  [@user] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Track Title One                                             │
│  by @username1  •  uploaded 2 hours ago  •  January Campaign │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │        ╱╲    ╱╲╱╲                ╱╲                      │ │
│  │   ╱╲  ╱  ╲  ╱    ╲  ╱╲    ╱╲   ╱  ╲  ╱╲                │ │
│  │  ╱  ╲╱    ╲╱      ╲╱  ╲  ╱  ╲╱    ╲╱  ╲  ╱╲           │ │
│  │ ╱                   ╲  ╲╱      ╲        ╲╱  ╲          │ │
│  │                                                           │ │
│  │ ▼                 ▼              ▼                        │ │
│  │ 💬                💬             💬                       │ │
│  │ 0:23              1:45           2:58                     │ │
│  │                                                           │ │
│  │ ─────────────────●──────────────────────────────────────│ │
│  │ 2:34 / 3:45                                               │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ⏮  ⏯  ⏭     🔊 ▬▬▬▬▬▬●▬▬▬                               │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  💬 COMMENTS (5)                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                               │
│  @username2  at 0:23                            2 hours ago  │
│  "Love this intro! 🔥"                                       │
│                                                               │
│  @username3  at 1:45                            1 hour ago   │
│  "That drop is insane"                           [Delete]    │
│                                                               │
│  @username4  at 2:58                            30 min ago   │
│  "Perfect outro"                                             │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Click on the waveform to add a comment...           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Full-size waveform visualization (WaveSurfer.js)
- Comment markers (💬) appear on timeline at exact timestamps
- **Click waveform at any point** → Opens comment input at that timestamp
- **As track plays**, comments auto-popup when playhead reaches them
- Hover over comment marker to preview
- Playback controls integrated below waveform

---

### 3. Comment Popup (Auto-appears during playback)

When playhead reaches a comment timestamp:

```
                  ┌────────────────────────┐
                  │  @username2  at 0:23   │
                  │  "Love this intro! 🔥" │
                  └────────────────────────┘
                              ▼
        ╱╲    ╱╲╱╲                ╱╲
   ╱╲  ╱  ╲  ╱    ╲  ╱╲    ╱╲   ╱  ╲  ╱╲
  ╱  ╲╱    ╲╱      ╲╱  ╲  ╱  ╲╱    ╲╱  ╲  ╱╲
 ╱                   ╲  ╲╱      ╲        ╲╱  ╲
                      ●
```

**Behavior:**
- Popup appears 0.5 seconds before playhead reaches comment
- Stays visible for 3 seconds
- Fades out smoothly
- User can click comment marker to view anytime
- User can dismiss early by clicking [×]

---

### 4. Add Comment Interface

When user clicks on waveform:

```
│  ╱╲    ╱╲╱╲                ╱╲                              │
│ ╱  ╲  ╱    ╲  ╱╲    ╱╲   ╱  ╲  ╱╲                         │
│╱    ╲╱      ╲╱  ╲  ╱  ╲╱    ╲╱  ╲  ╱╲                    │
│                  ●                                          │
│                  │                                          │
│   ┌──────────────┴──────────────────────────────┐          │
│   │  💬 Add comment at 1:45                      │          │
│   │  ┌──────────────────────────────────────┐   │          │
│   │  │ What do you think about this part?   │   │          │
│   │  └──────────────────────────────────────┘   │          │
│   │                                              │          │
│   │              [Cancel]  [Post Comment]        │          │
│   └──────────────────────────────────────────────┘          │
```

**Behavior:**
- Popup appears at click position on waveform
- Shows exact timestamp (e.g., "1:45.32")
- Auto-focuses textarea
- Press ESC to cancel, Enter to submit
- After posting, comment marker appears immediately

---

### 5. Artist Page

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                                          🔔  [@user] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  👤 @username1                                               │
│  ─────────────────────────────────────────────────────────  │
│  Member since: January 2025  •  15 tracks uploaded           │
│                                                               │
│  🎵  PLAY ALL (@username1's tracks)                          │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📅 TRACKS (15) - Reverse Chronological                      │
│  ─────────────────────────────────────────────────────────  │
│                                                               │
│  ▶  Track Title One                          January 15      │
│      [━━━━━━━━━━━━━━━━━●━━━━━] 2:34 / 3:45                 │
│      💬 5 comments  •  January Campaign                      │
│                                                               │
│  ▶  Night Dreams                             January 14      │
│      [━━━━━━━━━━━━━━━━━━━━━━] 0:00 / 5:01                 │
│      💬 15 comments  •  January Campaign                     │
│                                                               │
│  ▶  Morning Vibes                            January 13      │
│      [━━━━━━━━━━━━━━━━━━━━━━] 0:00 / 3:30                 │
│      💬 7 comments  •  January Campaign                      │
│                                                               │
│  ...                                                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- User profile header with stats
- "PLAY ALL" queues all user's tracks
- Reverse chronological order (newest first)
- Shows campaign tags
- Click username anywhere to navigate here

---

### 6. Upload Track Modal

Triggered by "Upload ⬆" button:

```
        ┌──────────────────────────────────────────┐
        │  Upload New Track                    [×] │
        ├──────────────────────────────────────────┤
        │                                          │
        │  Track Title                             │
        │  ┌────────────────────────────────────┐  │
        │  │ My Awesome Track                   │  │
        │  └────────────────────────────────────┘  │
        │                                          │
        │  Audio File                              │
        │  ┌────────────────────────────────────┐  │
        │  │                                    │  │
        │  │     📁  Drop file here or click    │  │
        │  │                                    │  │
        │  │     Supported: MP3, WAV, FLAC...   │  │
        │  │     Max size: 20MB                 │  │
        │  │                                    │  │
        │  └────────────────────────────────────┘  │
        │                                          │
        │  ℹ️  Will be transcoded to 256kbps MP3  │
        │                                          │
        │                   [Cancel]  [Upload 🚀]  │
        └──────────────────────────────────────────┘
```

**Upload Flow:**
1. User selects file (drag & drop or click)
2. Shows file name + size
3. Click "Upload 🚀"
4. Progress bar appears
5. Success: "Processing..." message
6. Track appears in feed with status "Processing"
7. Auto-refreshes when transcoding completes

---

### 7. Authentication Pages

#### Login Page

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                                                               │
│                      🎵  DAILY TWO                            │
│                                                               │
│              A collaborative music player                     │
│                                                               │
│              ┌───────────────────────────┐                    │
│              │  Username                 │                    │
│              │  ┌─────────────────────┐  │                    │
│              │  │                     │  │                    │
│              │  └─────────────────────┘  │                    │
│              │                           │                    │
│              │  Password                 │                    │
│              │  ┌─────────────────────┐  │                    │
│              │  │ •••••••••••         │  │                    │
│              │  └─────────────────────┘  │                    │
│              │                           │                    │
│              │      [Login]              │                    │
│              │                           │                    │
│              │  Have an invitation?      │                    │
│              │  Register here →          │                    │
│              └───────────────────────────┘                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

#### Registration Page

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                      🎵  DAILY TWO                            │
│                                                               │
│              Create Your Account                              │
│                                                               │
│              ┌───────────────────────────┐                    │
│              │  Invitation Token         │                    │
│              │  ┌─────────────────────┐  │                    │
│              │  │ [Auto-filled]       │  │                    │
│              │  └─────────────────────┘  │                    │
│              │  ✓ Valid for: user@...    │                    │
│              │                           │                    │
│              │  Username                 │                    │
│              │  ┌─────────────────────┐  │                    │
│              │  │                     │  │                    │
│              │  └─────────────────────┘  │                    │
│              │                           │                    │
│              │  Email                    │                    │
│              │  ┌─────────────────────┐  │                    │
│              │  │ user@example.com    │  │                    │
│              │  └─────────────────────┘  │                    │
│              │                           │                    │
│              │  Password                 │                    │
│              │  ┌─────────────────────┐  │                    │
│              │  │ •••••••••••         │  │                    │
│              │  └─────────────────────┘  │                    │
│              │  Min 8 characters         │                    │
│              │                           │                    │
│              │      [Create Account]     │                    │
│              │                           │                    │
│              │  Already have account?    │                    │
│              │  Login here →             │                    │
│              └───────────────────────────┘                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## User Interactions & Flows

### 1. Listening to Music (Main Use Case)

**Scenario: User visits homepage**

```
1. User lands on homepage
   → Sees daily sections with today's uploads at top

2. User clicks "🎵 PLAY ALL"
   → Queue loads all tracks in reverse chronological order
   → First track starts playing
   → "Now Playing" bar appears at bottom
   → Waveform shows progress

3. As track plays, comment markers approach
   → 0.5 seconds before comment, popup appears
   → "💬 @username2: 'Love this intro! 🔥'"
   → Popup fades after 3 seconds

4. User clicks track to see details
   → Full waveform view opens
   → All comments listed below
   → Can scroll through comments

5. User clicks waveform at 1:23
   → Comment input popup appears
   → User types: "Great transition here"
   → Presses Enter to post
   → Comment marker appears instantly

6. User clicks Next (⏭)
   → Moves to next track in queue
   → Comments auto-popup during playback
```

### 2. Uploading Music

**Scenario: Artist uploads new track**

```
1. User clicks "Upload ⬆"
   → Modal appears

2. User enters title: "My New Beat"
   → Drags MP3 file into dropzone

3. User clicks "Upload 🚀"
   → Progress bar: "Uploading... 45%"
   → Success: "Processing your track..."
   → Modal closes

4. Track appears in feed with status "Processing"
   → Shows waveform placeholder
   → "⏳ Transcoding to MP3..."

5. After 30 seconds (Celery task completes)
   → Status changes to "Completed"
   → Waveform renders
   → Play button becomes active
   → Automatic campaign tag: "January Campaign"
```

### 3. Exploring Artist Pages

**Scenario: User discovers new artist**

```
1. User sees interesting track in feed
   → Clicks "@username1"

2. Artist page opens
   → Shows all 15 tracks by @username1
   → Ordered newest to oldest
   → "PLAY ALL" button at top

3. User clicks "PLAY ALL"
   → Queue loads all artist's tracks
   → Starts playing from newest
   → Can navigate through with Next/Prev
```

---

## Responsive Design

### Desktop (1200px+)
- Full layout as shown above
- Waveform takes full width
- Comments in sidebar (track detail view)

### Tablet (768px - 1199px)
- Slightly narrower waveform
- Comments below waveform
- "Now Playing" bar remains fixed

### Mobile (< 768px)
- Simplified waveform (smaller height)
- Stack all elements vertically
- "Now Playing" bar sticks to bottom
- Hamburger menu for navigation

---

## Technology Stack (Frontend)

**Framework:** Next.js 14 (App Router)
**Styling:** Tailwind CSS
**Audio Player:** Howler.js
**Waveform:** WaveSurfer.js
**State Management:** React Context + Zustand
**HTTP Client:** Axios
**Forms:** React Hook Form
**Animations:** Framer Motion

---

## Key Design Decisions

### 1. Why Dark Theme?
- Reduces eye strain during long listening sessions
- Industry standard for music apps (Spotify, SoundCloud)
- Makes waveforms and UI elements pop visually

### 2. Why Waveform-Centric?
- Visual representation helps users navigate long tracks
- Natural place to anchor timestamp comments
- Familiar pattern from SoundCloud (users know how to interact)

### 3. Why Fixed "Now Playing" Bar?
- Always accessible playback controls
- User never loses context while browsing
- Mimics Spotify/YouTube Music UX

### 4. Why Auto-Popup Comments?
- Main feature differentiator (timestamp comments)
- Encourages discovery of community reactions
- Creates "shared listening experience"

### 5. Why Daily Groupings?
- Clear temporal organization
- Encourages daily participation
- Easy to see "what's new today"

---

## Next Steps

Once you approve this design, I'll build:

1. **Next.js Project Setup** - Install dependencies, configure Tailwind
2. **Authentication Pages** - Login/register with JWT
3. **Homepage Layout** - Daily feed with track list
4. **Media Player Component** - Howler.js integration
5. **Waveform Component** - WaveSurfer.js with comment markers
6. **Comment System** - Auto-popup, click-to-comment
7. **Artist Pages** - User-specific playlists
8. **Upload Modal** - File upload with progress

**Estimated build time:** 3-4 hours for core functionality

Ready to proceed? Any design changes you'd like to make?
