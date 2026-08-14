'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Check, Eye, Star } from 'lucide-react';
import { SmartImage } from '@/components/SmartImage';
import { imageUrl } from '@/lib/api';
import { useWatchlistStore, type WatchlistItem } from '@/store/useWatchlistStore';
import { cn } from '@/lib/utils';

export function WatchlistCard({ item }: { item: WatchlistItem }) {
  const removeItem = useWatchlistStore((s) => s.removeItem);
  const toggleWatched = useWatchlistStore((s) => s.toggleWatched);

  const href =
    item.mediaType === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`;

  return (
    <div className="group relative">
      <Link href={href} className="block">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-900">
          <SmartImage
            src={imageUrl(item.posterPath, 'w342')}
            alt={item.title}
            fill
            sizes="200px"
            className={cn(
              'object-cover transition-all duration-300',
              item.watched && 'opacity-50 saturate-50',
            )}
          />
          {item.watched && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-emerald-400 backdrop-blur">
                <Eye className="h-3.5 w-3.5" /> Vista
              </span>
            </div>
          )}
        </div>
        <p className="mt-2 line-clamp-1 text-sm font-medium text-zinc-100">
          {item.title}
        </p>
        <p className="flex items-center gap-1 text-xs text-zinc-400">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {item.voteAverage.toFixed(1)} · {item.mediaType === 'movie' ? 'Película' : 'Serie'}
        </p>
      </Link>

      {/* Acciones */}
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => toggleWatched(item.id)}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-zinc-700 px-2 py-1.5 text-xs text-zinc-300 transition-colors hover:border-emerald-500 hover:text-emerald-400"
        >
          {item.watched ? (
            <>
              <Check className="h-3.5 w-3.5" /> Vista
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" /> Marcar vista
            </>
          )}
        </button>
        <button
          onClick={() => removeItem(item.id)}
          aria-label={`Eliminar ${item.title} de mi lista`}
          className="flex items-center justify-center rounded-lg border border-zinc-700 px-2.5 py-1.5 text-zinc-300 transition-colors hover:border-red-600 hover:text-red-500"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
