import Link from 'next/link';
import { HeroCarousel } from '@/components/HeroCarousel';
import { MediaRow } from '@/components/MediaRow';
import {
  getHeroItems,
  getTrending,
  getTopRated,
  getUpcomingMovies,
  getPopular,
  getGenres,
} from '@/lib/api';

export default async function Home() {
  const [hero, trendingMovies, trendingTv, topRated, upcoming, popularTv, genres] =
    await Promise.all([
      getHeroItems(),
      getTrending('movie', 'week'),
      getTrending('tv', 'week'),
      getTopRated('movie'),
      getUpcomingMovies(),
      getPopular('tv'),
      getGenres('movie'),
    ]);

  return (
    <main className="pb-16">
      <HeroCarousel items={hero} />

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 md:px-8">
        {/* Filtro rápido por géneros */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-100 md:text-xl">
            Explora por género
          </h2>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
            {genres.slice(0, 14).map((g) => (
              <Link
                key={g.id}
                href={`/search?genre=${g.id}&type=movie`}
                className="shrink-0 rounded-full border border-zinc-700 px-4 py-1.5 text-sm text-zinc-300 transition-colors hover:border-red-600 hover:bg-red-600/10 hover:text-white"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </section>

        <MediaRow
          title="Tendencias de la semana"
          items={trendingMovies}
          seeAllHref="/search?sort=popularity.desc"
        />
        <MediaRow
          title="Series en tendencia"
          items={trendingTv}
          seeAllHref="/search?type=tv"
        />
        <MediaRow
          title="Mejor valoradas"
          items={topRated}
          seeAllHref="/search?type=movie&sort=vote_average.desc"
        />
        <MediaRow
          title="Estrenos recientes"
          items={upcoming}
          seeAllHref="/search?type=movie&sort=primary_release_date.desc"
        />
        <MediaRow
          title="Series populares"
          items={popularTv}
          seeAllHref="/search?type=tv&sort=popularity.desc"
        />
      </div>
    </main>
  );
}
