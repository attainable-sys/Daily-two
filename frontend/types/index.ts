// User types
export interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  date_joined: string;
}

// Auth types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  invitation_token: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

// Campaign types
export interface Campaign {
  id: string;
  name: string;
  month: number;
  year: number;
  created_at: string;
  track_count: number;
}

// Track types
export interface Track {
  id: string;
  user: User;
  campaign: Campaign | null;
  title: string;
  original_filename: string;
  file: string;
  file_url: string;
  duration_seconds: string | null;
  file_size_bytes: number;
  upload_date: string;
  uploaded_at: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  comment_count: number;
}

export interface TrackListItem {
  id: string;
  user_id: string;
  username: string;
  campaign_name: string | null;
  title: string;
  file_url: string;
  duration_seconds: string | null;
  upload_date: string;
  uploaded_at: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  comment_count: number;
}

export interface DailyTracksGroup {
  date: string;
  tracks: TrackListItem[];
}

// Comment types
export interface Comment {
  id: string;
  track: string;
  user: User;
  username: string;
  timestamp_seconds: string;
  comment_text: string;
  created_at: string;
}

export interface CreateCommentData {
  track: string;
  timestamp_seconds: number;
  comment_text: string;
}

// Player types
export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}
