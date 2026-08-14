'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Bookmark, Check } from 'lucide-react';
import { SmartImage } from './SmartImage';
import { imageUrl } from '@/lib/api';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import type { MediaItem } from '@/lib/types';
import { formatYear } from '@/lib/utils';

export function MediaCard({ item }: { item: MediaItem }) {
  const items = useWatchlistStore((s) => s.items);
  const addItem = useWatchlistStore((s) => s.addItem);
  const removeItem = useWatchlistStore((s) => s.removeItem);
  const inList = items.some((i) => i.id === item.id);

  const href =
    item.mediaType === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`;

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      removeItem(item.id);
    } else {
      addItem({
        id: item.id,
        mediaType: item.mediaType,
        title: item.title,
        posterPath: item.posterPath,
        backdropPath: item.backdropPath,
        voteAverage: item.voteAverage,
        addedAt: Date.now(),
        watched: false,
      });
    }
  };

  return (
    <Link href={href} className="group block w-full">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-900">
        <SmartImage
          src={imageUrl(item.posterPath, 'w342')}
          alt={`Póster de ${item.title}`}
          fill
          sizes="200px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* rating */}
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-amber-400 backdrop-blur">
          <Star className="h-3 w-3 fill-amber-400" />
          {item.voteAverage.toFixed(1)}
        </div>
        {/* add to list */}
        <button
          onClick={toggle}
          aria-label={inList ? 'Quitar de mi lista' : 'Añadir a mi lista'}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-all duration-200 hover:bg-red-600 group-hover:opacity-100 data-[in=true]:opacity-100"
          data-in={inList}
        >
          {inList ? (
            <Check className="h-4 w-4 text-red-500" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-medium text-zinc-100">
        {item.title}
      </p>
      <p className="text-xs text-zinc-400">
        {formatYear(item.releaseDate)}
        {item.mediaType === 'tv' && ' · Serie'}
      </p>
    </Link>
  );
}
