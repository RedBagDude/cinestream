'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play, Plus, Check, Info, Star } from 'lucide-react';
import { SmartImage } from './SmartImage';
import { imageUrl } from '@/lib/api';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import type { MediaItem } from '@/lib/types';

export function HeroCarousel({ items }: { items: MediaItem[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const addItem = useWatchlistStore((s) => s.addItem);
  const removeItem = useWatchlistStore((s) => s.removeItem);
  const watchItems = useWatchlistStore((s) => s.items);

  useEffect(() => {
    if (paused || items.length === 0) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [paused, items.length]);

  if (items.length === 0) return null;

  const item = items[index];
  const inList = watchItems.some((w) => w.id === item.id);
  const href =
    item.mediaType === 'movie' ? `/movie/${item.id}` : `/series/${item.id}`;

  const toggleList = () => {
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
    <section
      className="relative h-[70vh] min-h-[420px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0">
        <SmartImage
          src={imageUrl(item.backdropPath, 'w1280')}
          alt={item.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          fallback="/backdrop-placeholder.png"
        />
        <div className="backdrop-fade absolute inset-0" />
        <div className="backdrop-fade-side absolute inset-0" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-8">
          <div className="max-w-2xl animate-fade-in" key={item.id}>
            <div className="mb-3 flex items-center gap-3 text-sm text-zinc-300">
              <span className="flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 font-semibold text-white">
                <Star className="h-3.5 w-3.5 fill-white" />
                {item.voteAverage.toFixed(1)}
              </span>
              <span className="font-medium uppercase tracking-wider text-zinc-400">
                {item.mediaType === 'movie' ? 'Película' : 'Serie'}
              </span>
            </div>

            <h1 className="text-shadow text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              {item.title}
            </h1>

            <p className="text-shadow mt-4 line-clamp-3 max-w-xl text-sm text-zinc-200 md:text-base">
              {item.overview}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={href}
                className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-transform hover:scale-105"
              >
                <Play className="h-4 w-4 fill-zinc-950" /> Ver Tráiler
              </Link>
              <button
                onClick={toggleList}
                className="flex items-center gap-2 rounded-lg bg-zinc-800/70 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-transform hover:scale-105"
              >
                {inList ? (
                  <>
                    <Check className="h-4 w-4 text-red-500" /> En mi lista
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Mi lista
                  </>
                )}
              </button>
              <Link
                href={href}
                className="flex items-center gap-2 rounded-lg bg-zinc-800/70 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-transform hover:scale-105"
              >
                <Info className="h-4 w-4" /> Más info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 right-4 flex gap-2 md:right-8">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Ir al destacado ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-red-600' : 'w-2 bg-zinc-500/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
