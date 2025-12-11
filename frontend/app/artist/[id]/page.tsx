'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { tracksAPI, usersAPI } from '@/lib/api';
import type { User, TrackListItem } from '@/types';
import { TrackItem } from '@/components/track/TrackItem';
import { usePlayerStore } from '@/lib/store/usePlayerStore';

export default function ArtistPage() {
  const params = useParams();
  const userId = params.id as string;

  const [artist, setArtist] = useState<User | null>(null);
  const [tracks, setTracks] = useState<TrackListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { playAll } = usePlayerStore();

  useEffect(() => {
    loadArtistData();
  }, [userId]);

  const loadArtistData = async () => {
    try {
      setIsLoading(true);
      const [artistData, tracksData] = await Promise.all([
        usersAPI.getById(userId),
        tracksAPI.getByUser(userId),
      ]);
      setArtist(artistData);
      setTracks(tracksData);
    } catch (error) {
      console.error('Failed to load artist data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAll = () => {
    const completedTracks = tracks.filter((t) => t.status === 'completed');
    if (completedTracks.length > 0) {
      playAll(completedTracks as any);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Artist not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Artist Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">👤</span>
          <div>
            <h1 className="text-4xl font-bold text-text-primary">@{artist.username}</h1>
            <p className="text-text-secondary">
              Member since: {new Date(artist.date_joined).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-text-secondary">
          <span>{tracks.length} tracks uploaded</span>
        </div>
      </div>

      {/* Play All Button */}
      {tracks.length > 0 && (
        <button
          onClick={handlePlayAll}
          className="w-full mb-8 px-6 py-4 bg-surface border border-border rounded-lg hover:bg-opacity-80 transition flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🎵</span>
          <span className="text-text-primary font-medium text-lg">
            PLAY ALL (@{artist.username}'s tracks)
          </span>
        </button>
      )}

      {/* Tracks List */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          📅 TRACKS ({tracks.length})
        </h2>
        <div className="border-t border-border mb-4"></div>
      </div>

      {tracks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg">No tracks yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tracks.map((track) => (
            <TrackItem key={track.id} track={track} allTracks={tracks as any} />
          ))}
        </div>
      )}
    </div>
  );
}
