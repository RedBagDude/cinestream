'use client';

import React, { useState } from 'react';
import { Play, Plus, Check, Star, Clock, Calendar } from 'lucide-react';
import { SmartImage } from './SmartImage';
import { TrailerModal } from './TrailerModal';
import { CastCard } from './CastCard';
import { MediaRow } from './MediaRow';
import { imageUrl } from '@/lib/api';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import { formatRuntime } from '@/lib/utils';
import type { MediaDetails, CastMember, Video, MediaItem } from '@/lib/types';

interface MediaDetailProps {
  details: MediaDetails;
  credits: CastMember[];
  videos: Video[];
  similar: MediaItem[];
}

export function MediaDetail({
  details,
  credits,
  videos,
  similar,
}: MediaDetailProps) {
  const [trailer, setTrailer] = useState<Video | null>(null);
  const addItem = useWatchlistStore((s) => s.addItem);
  const removeItem = useWatchlistStore((s) => s.removeItem);
  const items = useWatchlistStore((s) => s.items);
  const inList = items.some((i) => i.id === details.id);

  const trailerVideo =
    videos.find((v) => v.type === 'Trailer') ?? videos[0] ?? null;

  const toggleList = () => {
    if (inList) {
      removeItem(details.id);
    } else {
      addItem({
        id: details.id,
        mediaType: details.mediaType,
        title: details.title,
        posterPath: details.posterPath,
        backdropPath: details.backdropPath,
        voteAverage: details.voteAverage,
        addedAt: Date.now(),
        watched: false,
      });
    }
  };

  const year = details.releaseDate ? details.releaseDate.slice(0, 4) : '';

  return (
    <main className="pb-16">
      {/* Banner */}
      <div className="relative h-[60vh] min-h-[420px] w-full">
        <SmartImage
          src={imageUrl(details.backdropPath, 'original')}
          alt={details.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          fallback="/backdrop-placeholder.png"
        />
        <div className="backdrop-fade absolute inset-0" />
        <div className="backdrop-fade-side absolute inset-0" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
            <h1 className="text-shadow text-4xl font-extrabold text-white md:text-6xl">
              {details.title}
            </h1>
            {details.tagline && (
              <p className="mt-2 text-sm italic text-zinc-300">{details.tagline}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-300">
              <span className="flex items-center gap-1 font-semibold text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
                {details.voteAverage.toFixed(1)}
              </span>
              {year && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {year}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {formatRuntime(details.runtime)}
              </span>
              {details.mediaType === 'tv' && details.numberOfSeasons && (
                <span>{details.numberOfSeasons} temporadas</span>
              )}
              {details.genres.length > 0 && (
                <span className="text-zinc-400">
                  {details.genres.map((g) => g.name).join(' · ')}
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => trailerVideo && setTrailer(trailerVideo)}
                disabled={!trailerVideo}
                className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-transform hover:scale-105 disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-zinc-950" /> Ver Tráiler
              </button>
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
                    <Plus className="h-4 w-4" /> Añadir a mi lista
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mt-8 flex flex-col gap-8 md:flex-row">
          {/* Poster */}
          <div className="hidden w-56 shrink-0 md:block">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-zinc-800 shadow-2xl">
              <SmartImage
                src={imageUrl(details.posterPath, 'w500')}
                alt={`Póster de ${details.title}`}
                fill
                sizes="224px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-zinc-100">Sinopsis</h2>
            <p className="mt-2 max-w-3xl leading-relaxed text-zinc-300">
              {details.overview || 'Sin sinopsis disponible.'}
            </p>

            {credits.length > 0 && (
              <>
                <h2 className="mt-8 text-xl font-bold text-zinc-100">
                  Reparto principal
                </h2>
                <div className="scrollbar-hide mt-4 flex gap-4 overflow-x-auto pb-2">
                  {credits.map((c) => (
                    <CastCard key={c.id} cast={c} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-10">
            <MediaRow title="Recomendados similares" items={similar} />
          </div>
        )}
      </div>

      <TrailerModal video={trailer} onClose={() => setTrailer(null)} />
    </main>
  );
}
