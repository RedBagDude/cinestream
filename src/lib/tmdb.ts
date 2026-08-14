import type {
  MediaType,
  MediaItem,
  MediaDetails,
  CastMember,
  Video,
  Paginated,
  DiscoverParams,
} from './types';

// ── Configuración ─────────────────────────────────────────────────────────
const BASE = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY ?? '';

export const isLive = API_KEY.length > 0;

/**
 * Resuelve la URL de una imagen TMDB. Acepta rutas relativas de TMDB
 * (`/abc123.jpg`) y rutas locales del modo demo (`/mock/...`).
 */
export function imageUrl(
  path: string | null,
  size: 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500',
): string {
  if (!path) return '/poster-placeholder.png';
  if (path.startsWith('/mock/')) return path; // recurso local del modo demo
  if (path.startsWith('http')) return path; // URL ya completa
  return `${IMG_BASE}/${size}${path}`; // ruta relativa de TMDB
}

interface RawTMDB {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
  release_date?: string;
  first_air_date?: string;
  media_type?: MediaType;
  runtime?: number;
  tagline?: string;
  status?: string;
  genres?: { id: number; name: string }[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  homepage?: string;
}

function normalizeMedia(raw: RawTMDB, fallbackType: MediaType): MediaItem {
  return {
    id: raw.id,
    mediaType: raw.media_type ?? fallbackType,
    title: raw.title ?? raw.name ?? 'Sin título',
    originalTitle: raw.original_title ?? raw.original_name ?? raw.title ?? '',
    overview: raw.overview ?? '',
    posterPath: raw.poster_path ?? null,
    backdropPath: raw.backdrop_path ?? null,
    voteAverage: raw.vote_average ?? 0,
    voteCount: raw.vote_count ?? 0,
    genreIds: raw.genre_ids ?? [],
    releaseDate: raw.release_date ?? raw.first_air_date ?? '',
  };
}

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'es-ES');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB error ${res.status}: ${url.pathname}`);
  return res.json() as Promise<T>;
}

// ── Endpoints ─────────────────────────────────────────────────────────────

export async function getTrending(
  mediaType: MediaType,
  timeWindow: 'day' | 'week' = 'week',
): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: RawTMDB[] }>(
    `/trending/${mediaType}/${timeWindow}`,
  );
  return data.results.map((r) => normalizeMedia(r, mediaType));
}

export async function getTopRated(mediaType: MediaType): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: RawTMDB[] }>(
    `/${mediaType}/top_rated`,
  );
  return data.results.map((r) => normalizeMedia(r, mediaType));
}

export async function getUpcomingMovies(): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: RawTMDB[] }>('/movie/upcoming');
  return data.results.map((r) => normalizeMedia(r, 'movie'));
}

export async function getPopular(mediaType: MediaType): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: RawTMDB[] }>(`/${mediaType}/popular`);
  return data.results.map((r) => normalizeMedia(r, mediaType));
}

export async function getDetails(
  mediaType: MediaType,
  id: number,
): Promise<MediaDetails> {
  const raw = await tmdbFetch<RawTMDB>(`/${mediaType}/${id}`, {
    append_to_response: 'credits,videos',
  });
  const base = normalizeMedia(raw, mediaType);
  return {
    ...base,
    tagline: raw.tagline ?? '',
    status: raw.status ?? '',
    runtime: raw.runtime ?? 0,
    genres: (raw.genres ?? []).map((g) => ({ id: g.id, name: g.name })),
    numberOfSeasons: raw.number_of_seasons,
    numberOfEpisodes: raw.number_of_episodes,
    homepage: raw.homepage ?? '',
  };
}

export async function getCredits(
  mediaType: MediaType,
  id: number,
): Promise<CastMember[]> {
  const data = await tmdbFetch<{
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  }>(`/${mediaType}/${id}/credits`);
  return (data.cast ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    character: c.character ?? '',
    profilePath: c.profile_path ?? null,
  }));
}

export async function getVideos(mediaType: MediaType, id: number): Promise<Video[]> {
  const data = await tmdbFetch<{
    results: { id: string; key: string; name: string; site: string; type: string }[];
  }>(`/${mediaType}/${id}/videos`);
  return data.results
    .filter((v) => v.site === 'YouTube')
    .map((v) => ({
      id: v.id,
      key: v.key,
      name: v.name ?? '',
      site: v.site,
      type: v.type ?? '',
    }));
}

export async function getSimilar(
  mediaType: MediaType,
  id: number,
): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: RawTMDB[] }>(
    `/${mediaType}/${id}/similar`,
  );
  return data.results.map((r) => normalizeMedia(r, mediaType));
}

export async function searchMulti(
  query: string,
  page = 1,
): Promise<Paginated<MediaItem>> {
  const data = await tmdbFetch<{
    page: number;
    total_pages: number;
    total_results: number;
    results: RawTMDB[];
  }>('/search/multi', { query, page, include_adult: 'false' });
  const results = data.results
    .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
    .map((r) => normalizeMedia(r, r.media_type as MediaType));
  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results,
  };
}

export async function discover(params: DiscoverParams): Promise<Paginated<MediaItem>> {
  const path = params.mediaType === 'movie' ? '/discover/movie' : '/discover/tv';
  const q: Record<string, string | number> = {
    page: params.page ?? 1,
    sort_by: params.sortBy ?? 'popularity.desc',
  };
  if (params.withGenres) q.with_genres = params.withGenres;
  if (params.year) {
    q[params.mediaType === 'movie' ? 'primary_release_year' : 'first_air_date_year'] =
      params.year;
  }
  const data = await tmdbFetch<{
    page: number;
    total_pages: number;
    total_results: number;
    results: RawTMDB[];
  }>(path, q);
  return {
    page: data.page,
    totalPages: data.total_pages,
    totalResults: data.total_results,
    results: data.results.map((r) => normalizeMedia(r, params.mediaType)),
  };
}

export async function getGenres(mediaType: MediaType): Promise<{ id: number; name: string }[]> {
  const data = await tmdbFetch<{ genres: { id: number; name: string }[] }>(
    `/genre/${mediaType}/list`,
  );
  return data.genres;
}
