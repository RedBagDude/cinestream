import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { FilterBar } from '@/components/FilterBar';
import { MediaCard } from '@/components/MediaCard';
import { getGenres, searchMulti, discover } from '@/lib/api';
import type { MediaItem, SortOption } from '@/lib/types';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? '').trim();
  const type = sp.type === 'tv' ? 'tv' : 'movie';
  const genre = sp.genre ?? '';
  const year = sp.year ?? '';
  const sort = (sp.sort ?? 'popularity.desc') as SortOption;
  const page = Number(sp.page ?? '1') || 1;

  const genres = await getGenres(type);

  let items: MediaItem[] = [];
  let totalPages = 1;
  let totalResults = 0;

  if (q) {
    const data = await searchMulti(q, page);
    items = data.results;
    totalPages = data.totalPages;
    totalResults = data.totalResults;
  } else {
    const data = await discover({
      mediaType: type,
      sortBy: sort,
      withGenres: genre || undefined,
      year: year ? Number(year) : undefined,
      page,
    });
    items = data.results;
    totalPages = data.totalPages;
    totalResults = data.totalResults;
  }

  const heading = q
    ? `Resultados para “${q}”`
    : type === 'movie'
      ? 'Películas'
      : 'Series';

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    params.set('type', type);
    if (genre) params.set('genre', genre);
    if (year) params.set('year', year);
    params.set('sort', sort);
    if (p > 1) params.set('page', String(p));
    return `/search?${params.toString()}`;
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <h1 className="text-2xl font-extrabold text-zinc-100 md:text-3xl">
        {heading}
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        {totalResults > 0
          ? `${totalResults} resultado${totalResults === 1 ? '' : 's'}`
          : ''}
      </p>

      <div className="mt-6">
        <FilterBar
          type={type}
          genre={genre}
          year={year}
          sort={sort}
          genres={genres}
        />
      </div>

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center">
          <SearchX className="h-12 w-12 text-zinc-600" />
          <p className="text-lg font-semibold text-zinc-200">
            No se encontraron resultados
          </p>
          <p className="max-w-sm text-sm text-zinc-400">
            Prueba con otro término de búsqueda o ajusta los filtros de género y
            año.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link
              href={buildHref(page - 1)}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-red-600"
            >
              ← Anterior
            </Link>
          )}
          <span className="text-sm text-zinc-400">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildHref(page + 1)}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-red-600"
            >
              Siguiente →
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
