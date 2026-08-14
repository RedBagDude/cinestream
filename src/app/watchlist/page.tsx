'use client';

import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { WatchlistCard } from '@/components/WatchlistCard';
import { useWatchlistStore } from '@/store/useWatchlistStore';

export default function WatchlistPage() {
  const items = useWatchlistStore((s) => s.items);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <h1 className="text-2xl font-extrabold text-zinc-100 md:text-3xl">
        Mi Lista
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        {items.length === 0
          ? 'Aún no has guardado ningún título.'
          : `${items.length} título${items.length === 1 ? '' : 's'} guardado${items.length === 1 ? '' : 's'}.`}
      </p>

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center">
          <Bookmark className="h-12 w-12 text-zinc-600" />
          <p className="text-lg font-semibold text-zinc-200">
            Tu lista está vacía
          </p>
          <p className="max-w-sm text-sm text-zinc-400">
            Guarda películas y series con el icono de marcador para verlas más
            tarde.
          </p>
          <Link
            href="/"
            className="mt-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <WatchlistCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}
