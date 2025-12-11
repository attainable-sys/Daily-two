'use client';

import type { DailyTracksGroup } from '@/types';
import { TrackItem } from './TrackItem';

interface Props {
  group: DailyTracksGroup;
}

export function DailySection({ group }: Props) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if today
    if (date.toDateString() === today.toDateString()) {
      return 'TODAY';
    }

    // Check if yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'YESTERDAY';
    }

    // Otherwise return formatted date
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="animate-fadeIn">
      {/* Date Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">📅</span>
        <h2 className="text-xl font-bold text-text-primary">{formatDate(group.date)}</h2>
      </div>

      <div className="border-t border-border mb-4"></div>

      {/* Tracks */}
      <div className="space-y-4">
        {group.tracks.map((track) => (
          <TrackItem key={track.id} track={track} allTracks={group.tracks as any} />
        ))}
      </div>
    </div>
  );
}
