import type {
  MediaType,
  MediaItem,
  MediaDetails,
  CastMember,
  Video,
  Paginated,
  Genre,
  DiscoverParams,
} from './types';
import * as tmdb from './tmdb';
import * as mock from './mock';

/**
 * Capa de datos: usa TMDB cuando hay API key, y cae al modo demo (datos
 * locales deterministas) si no la hay o si una petición falla.
 */
async function withFallback<T>(
  live: () => Promise<T>,
  demo: () => T,
): Promise<T> {
  if (tmdb.isLive) {
    try {
      return await live();
    } catch {
      return demo();
    }
  }
  return demo();
}

export const isLive = tmdb.isLive;

export function imageUrl(
  path: string | null,
  size: 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500',
): string {
  return tmdb.imageUrl(path, size);
}

// ── Secciones de la home ──────────────────────────────────────────────────

export async function getTrending(
  mediaType: MediaType,
  timeWindow: 'day' | 'week' = 'week',
): Promise<MediaItem[]> {
  return withFallback(
    () => tmdb.getTrending(mediaType, timeWindow),
    () =>
      mock.MOCK_MEDIA.filter((m) => m.mediaType === mediaType).slice(0, 12),
  );
}

export async function getTopRated(mediaType: MediaType): Promise<MediaItem[]> {
  return withFallback(
    () => tmdb.getTopRated(mediaType),
    () =>
      mock.MOCK_MEDIA.filter((m) => m.mediaType === mediaType)
        .slice()
        .sort((a, b) => b.voteAverage - a.voteAverage)
        .slice(0, 12),
  );
}

export async function getUpcomingMovies(): Promise<MediaItem[]> {
  return withFallback(
    () => tmdb.getUpcomingMovies(),
    () =>
      mock.MOCK_MEDIA.filter((m) => m.mediaType === 'movie')
        .slice()
        .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
        .slice(0, 12),
  );
}

export async function getPopular(mediaType: MediaType): Promise<MediaItem[]> {
  return withFallback(
    () => tmdb.getPopular(mediaType),
    () =>
      mock.MOCK_MEDIA.filter((m) => m.mediaType === mediaType)
        .slice()
        .sort((a, b) => b.voteCount - a.voteCount)
        .slice(0, 12),
  );
}

export async function getHeroItems(): Promise<MediaItem[]> {
  return withFallback(
    () => tmdb.getTrending('movie', 'week'),
    () =>
      mock.MOCK_MEDIA.filter((m) => m.mediaType === 'movie')
        .slice()
        .sort((a, b) => b.voteAverage - a.voteAverage)
        .slice(0, 5),
  );
}

// ── Detalle ───────────────────────────────────────────────────────────────

export async function getDetails(
  mediaType: MediaType,
  id: number,
): Promise<MediaDetails | null> {
  return withFallback(
    async () => tmdb.getDetails(mediaType, id),
    () => mock.getMockDetails(mediaType, id),
  );
}

export async function getCredits(
  mediaType: MediaType,
  id: number,
): Promise<CastMember[]> {
  return withFallback(
    () => tmdb.getCredits(mediaType, id),
    () => mock.getMockCredits(id),
  );
}

export async function getVideos(
  mediaType: MediaType,
  id: number,
): Promise<Video[]> {
  return withFallback(
    () => tmdb.getVideos(mediaType, id),
    () => mock.getMockVideos(id),
  );
}

export async function getSimilar(
  mediaType: MediaType,
  id: number,
): Promise<MediaItem[]> {
  return withFallback(
    () => tmdb.getSimilar(mediaType, id),
    () => mock.getMockSimilar(mediaType, id),
  );
}

// ── Búsqueda y exploración ────────────────────────────────────────────────

export async function searchMulti(
  query: string,
  page = 1,
): Promise<Paginated<MediaItem>> {
  return withFallback(
    () => tmdb.searchMulti(query, page),
    () => mock.searchMock(query),
  );
}

export async function discover(params: DiscoverParams): Promise<Paginated<MediaItem>> {
  return withFallback(
    () => tmdb.discover(params),
    () => mock.discoverMock(params),
  );
}

export async function getGenres(mediaType: MediaType): Promise<Genre[]> {
  return withFallback(
    () => tmdb.getGenres(mediaType),
    () => mock.MOCK_GENRES,
  );
}
