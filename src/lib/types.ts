// ── Modelos de datos de TMDB (tipado estricto) ──────────────────────────

export type MediaType = 'movie' | 'tv';

export interface Genre {
  id: number;
  name: string;
}

/** Ítem normalizado de película o serie usado en tarjetas y grillas. */
export interface MediaItem {
  id: number;
  mediaType: MediaType;
  title: string; // movie.title || tv.name
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  releaseDate: string; // release_date || first_air_date
}

/** Detalle completo para la vista de detalle. */
export interface MediaDetails extends MediaItem {
  tagline: string;
  status: string;
  runtime: number; // minutos (movie) o duración de episodio (tv)
  genres: Genre[];
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  homepage: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string; // 'YouTube' | 'Vimeo'
  type: string; // 'Trailer' | 'Teaser' | 'Clip'
}

export interface Paginated<T> {
  page: number;
  totalPages: number;
  totalResults: number;
  results: T[];
}

export type SortOption =
  | 'popularity.desc'
  | 'vote_average.desc'
  | 'primary_release_date.desc'
  | 'revenue.desc';

export interface DiscoverParams {
  mediaType: MediaType;
  sortBy?: SortOption;
  withGenres?: string; // comma-separated ids
  year?: number;
  page?: number;
}
