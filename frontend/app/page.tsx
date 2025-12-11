'use client';

import { useEffect, useState } from 'react';
import { tracksAPI } from '@/lib/api';
import type { DailyTracksGroup } from '@/types';
import { DailySection } from '@/components/track/DailySection';
import { usePlayerStore } from '@/lib/store/usePlayerStore';
import { UploadModal } from '@/components/track/UploadModal';

export default function HomePage() {
  const [trackGroups, setTrackGroups] = useState<DailyTracksGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { playAll } = usePlayerStore();

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      setIsLoading(true);
      const data = await tracksAPI.getAll();
      setTrackGroups(data);
    } catch (error) {
      console.error('Failed to load tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAll = () => {
    // Flatten all tracks from all days
    const allTracks: any[] = [];
    trackGroups.forEach((group) => {
      group.tracks.forEach((track) => {
        if (track.status === 'completed') {
          allTracks.push(track);
        }
      });
    });

    if (allTracks.length > 0) {
      playAll(allTracks as any);
    }
  };

  const handleUploadSuccess = () => {
    loadTracks();
    setShowUploadModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">Daily Two</h1>
          <p className="text-text-secondary">Collaborative music player</p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition font-medium"
        >
          Upload ⬆
        </button>
      </div>

      {/* Play All Button */}
      {trackGroups.length > 0 && (
        <button
          onClick={handlePlayAll}
          className="w-full mb-8 px-6 py-4 bg-surface border border-border rounded-lg hover:bg-opacity-80 transition flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🎵</span>
          <span className="text-text-primary font-medium text-lg">PLAY ALL</span>
        </button>
      )}

      {/* Daily Sections */}
      {trackGroups.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg">No tracks yet. Be the first to upload!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {trackGroups.map((group) => (
            <DailySection key={group.date} group={group} />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
