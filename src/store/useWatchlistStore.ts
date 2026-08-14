'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MediaType } from '@/lib/types';

export interface WatchlistItem {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  addedAt: number;
  watched: boolean;
}

interface WatchlistState {
  items: WatchlistItem[];
  searchHistory: string[];
  addItem: (item: WatchlistItem) => void;
  removeItem: (id: number) => void;
  toggleWatched: (id: number) => void;
  addSearch: (q: string) => void;
  clearHistory: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      items: [],
      searchHistory: [],
      addItem: (item) =>
        set((s) =>
          s.items.some((i) => i.id === item.id)
            ? s
            : { items: [item, ...s.items] },
        ),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      toggleWatched: (id) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, watched: !i.watched } : i,
          ),
        })),
      addSearch: (q) =>
        set((s) => ({
          searchHistory: [q, ...s.searchHistory.filter((h) => h !== q)].slice(0, 10),
        })),
      clearHistory: () => set({ searchHistory: [] }),
    }),
    { name: 'movies-watchlist' },
  ),
);
