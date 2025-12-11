import { create } from 'zustand';
import type { Track } from '@/types';

interface PlayerStore {
  // State
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;

  // Actions
  setCurrentTrack: (track: Track | null) => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  clearQueue: () => void;
  playTrack: (track: Track, queue?: Track[]) => void;
  playAll: (tracks: Track[], startIndex?: number) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Initial state
  currentTrack: null,
  queue: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,

  // Actions
  setCurrentTrack: (track) => set({ currentTrack: track }),

  setQueue: (tracks) => set({ queue: tracks }),

  addToQueue: (track) =>
    set((state) => ({
      queue: [...state.queue, track],
    })),

  playNext: () => {
    const { queue, currentTrack } = get();
    if (!currentTrack) return;

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex < queue.length - 1) {
      set({
        currentTrack: queue[currentIndex + 1],
        currentTime: 0,
        isPlaying: true,
      });
    }
  },

  playPrevious: () => {
    const { queue, currentTrack } = get();
    if (!currentTrack) return;

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex > 0) {
      set({
        currentTrack: queue[currentIndex - 1],
        currentTime: 0,
        isPlaying: true,
      });
    }
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  setVolume: (volume) => set({ volume }),

  clearQueue: () =>
    set({
      queue: [],
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    }),

  playTrack: (track, queue) => {
    const tracks = queue || [track];
    set({
      currentTrack: track,
      queue: tracks,
      isPlaying: true,
      currentTime: 0,
    });
  },

  playAll: (tracks, startIndex = 0) => {
    if (tracks.length === 0) return;

    set({
      currentTrack: tracks[startIndex],
      queue: tracks,
      isPlaying: true,
      currentTime: 0,
    });
  },
}));
