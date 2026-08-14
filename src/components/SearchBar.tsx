'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { imageUrl } from '@/lib/api';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import type { MediaItem } from '@/lib/types';

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const addSearch = useWatchlistStore((s) => s.addSearch);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults((data.results as MediaItem[]) ?? []);
        setOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    addSearch(q);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className={`relative ${className ?? ''}`}>
      <form onSubmit={submit} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            if (v.trim().length < 2) {
              setResults([]);
              setOpen(false);
            }
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Buscar películas o series…"
          className="h-9 w-full rounded-full border border-zinc-700 bg-zinc-900/80 pl-9 pr-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-red-600"
          aria-label="Buscar películas o series"
        />
      </form>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
          {results.slice(0, 6).map((r) => {
            const href =
              r.mediaType === 'movie' ? `/movie/${r.id}` : `/series/${r.id}`;
            return (
              <Link
                key={r.id}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border-b border-zinc-800 px-3 py-2.5 transition-colors last:border-0 hover:bg-zinc-800"
              >
                <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-zinc-800">
                  <Image
                    src={imageUrl(r.posterPath, 'w185')}
                    alt={r.title}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-medium text-zinc-100">
                    {r.title}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {r.mediaType === 'movie' ? 'Película' : 'Serie'} ·{' '}
                    {r.releaseDate?.slice(0, 4) || '—'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
