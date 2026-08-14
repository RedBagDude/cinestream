'use client';

import { useEffect } from 'react';
import { X, Play } from 'lucide-react';
import { isLive } from '@/lib/api';
import type { Video } from '@/lib/types';

export function TrailerModal({
  video,
  onClose,
}: {
  video: Video | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!video) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [video, onClose]);

  if (!video) return null;

  const showIframe = isLive && video.key !== 'demo';

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Reproductor de tráiler"
    >
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl">
        {showIframe ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0`}
            title={video.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/20">
              <Play className="h-8 w-8 fill-red-600 text-red-600" />
            </span>
            <p className="text-lg font-semibold text-white">{video.name}</p>
            <p className="max-w-md text-sm text-zinc-400">
              En modo demo no hay clave de YouTube. Añade{' '}
              <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-red-400">
                NEXT_PUBLIC_TMDB_API_KEY
              </code>{' '}
              en <code className="rounded bg-zinc-800 px-1.5 py-0.5">.env.local</code>{' '}
              para reproducir el tráiler real.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          aria-label="Cerrar reproductor"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-red-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
