'use client';

import { useRouter } from 'next/navigation';
import type { Genre, MediaType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  type: MediaType;
  genre: string;
  year: string;
  sort: string;
  genres: Genre[];
}

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularidad' },
  { value: 'vote_average.desc', label: 'Mejor valoradas' },
  { value: 'primary_release_date.desc', label: 'Más recientes' },
];

export function FilterBar({ type, genre, year, sort, genres }: FilterBarProps) {
  const router = useRouter();

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Tipo */}
      <div className="flex rounded-full border border-zinc-700 p-0.5">
        {(['movie', 'tv'] as MediaType[]).map((t) => (
          <button
            key={t}
            onClick={() => update('type', t)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              type === t ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white',
            )}
          >
            {t === 'movie' ? 'Películas' : 'Series'}
          </button>
        ))}
      </div>

      {/* Género */}
      <select
        value={genre}
        onChange={(e) => update('genre', e.target.value)}
        className="h-9 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-200 outline-none focus:border-red-600"
        aria-label="Filtrar por género"
      >
        <option value="">Todos los géneros</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      {/* Año */}
      <input
        type="number"
        value={year}
        onChange={(e) => update('year', e.target.value)}
        placeholder="Año"
        min={1900}
        max={2030}
        className="h-9 w-24 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-200 outline-none placeholder:text-zinc-500 focus:border-red-600"
        aria-label="Filtrar por año"
      />

      {/* Orden */}
      <select
        value={sort}
        onChange={(e) => update('sort', e.target.value)}
        className="h-9 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-200 outline-none focus:border-red-600"
        aria-label="Ordenar por"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
