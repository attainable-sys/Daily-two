'use client';

import Link from 'next/link';
import { usePlayerStore } from '@/lib/store/usePlayerStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { tracksAPI } from '@/lib/api';
import type { TrackListItem, Track } from '@/types';
import { useState } from 'react';

interface Props {
  track: TrackListItem;
  allTracks: Track[];
}

export function TrackItem({ track, allTracks }: Props) {
  const { currentTrack, isPlaying, playTrack, setIsPlaying } = usePlayerStore();
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const isCurrentTrack = currentTrack?.id === track.id;
  const isOwnTrack = user?.id === track.user_id;

  const handlePlay = () => {
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      playTrack(track as any, allTracks);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this track? This will also delete all comments.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await tracksAPI.delete(track.id);
      window.location.reload(); // Refresh to show updated list
    } catch (error) {
      console.error('Failed to delete track:', error);
      alert('Failed to delete track');
      setIsDeleting(false);
    }
  };

  const formatDuration = (seconds: string | null) => {
    if (!seconds) return '--:--';
    const secs = parseFloat(seconds);
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div
      className={`group p-4 bg-surface rounded-lg border hover:border-accent transition ${
        isCurrentTrack ? 'border-accent' : 'border-border'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Play Button */}
        <button
          onClick={handlePlay}
          disabled={track.status !== 'completed'}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition ${
            track.status !== 'completed'
              ? 'bg-gray-600 cursor-not-allowed'
              : isCurrentTrack
              ? 'bg-accent text-white'
              : 'bg-border text-text-primary hover:bg-accent hover:text-white'
          }`}
          title={track.status !== 'completed' ? 'Processing...' : isCurrentTrack && isPlaying ? 'Pause' : 'Play'}
        >
          {track.status === 'processing' ? (
            <span className="text-xs">⏳</span>
          ) : isCurrentTrack && isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/track/${track.id}`}
              className="font-medium text-text-primary hover:text-accent transition truncate"
            >
              {track.title}
            </Link>
            {track.status === 'processing' && (
              <span className="text-xs text-text-secondary">(processing...)</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span>by</span>
            <Link
              href={`/artist/${track.user_id}`}
              className="hover:text-accent transition"
            >
              @{track.username}
            </Link>
          </div>
        </div>

        {/* Duration & Meta */}
        <div className="text-right">
          <div className="text-text-primary font-medium mb-1">
            {formatDuration(track.duration_seconds)}
          </div>
          <div className="text-xs text-text-secondary space-x-2">
            <span>💬 {track.comment_count}</span>
            <span>•</span>
            <span>{formatTimeAgo(track.uploaded_at)}</span>
          </div>
        </div>

        {/* Delete Button (own tracks only) */}
        {isOwnTrack && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="opacity-0 group-hover:opacity-100 transition px-3 py-1 text-sm text-error hover:bg-error hover:bg-opacity-10 rounded"
            title="Delete track"
          >
            {isDeleting ? '...' : 'Delete'}
          </button>
        )}
      </div>

      {/* Waveform Placeholder (simplified for now) */}
      {track.status === 'completed' && (
        <div className="mt-3 h-12 bg-border rounded flex items-center gap-0.5 px-2">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-accent opacity-30 rounded"
              style={{
                height: `${Math.random() * 70 + 30}%`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
