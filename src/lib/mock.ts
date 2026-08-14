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

// ── Datos deterministas para el "modo demo" (sin API key) ───────────────
// Catálogo real (títulos + sinopsis + reparto) con pósters descargados en
// public/mock/. Al añadir NEXT_PUBLIC_TMDB_API_KEY se usa TMDB en su lugar.

export const MOCK_GENRES: Genre[] = [
  { id: 28, name: 'Acción' },
  { id: 12, name: 'Aventura' },
  { id: 16, name: 'Animación' },
  { id: 35, name: 'Comedia' },
  { id: 80, name: 'Crimen' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasía' },
  { id: 27, name: 'Terror' },
  { id: 9648, name: 'Misterio' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Ciencia ficción' },
  { id: 53, name: 'Suspense' },
];

// [title, mediaType, genreIds, voteAverage, releaseDate, overview, tagline]
type Seed = [string, MediaType, number[], number, string, string, string];

const SEEDS: Seed[] = [
  ['Inception', 'movie', [878, 28, 53], 8.4, '2010-07-16', 'Un ladrón especializado en robar secretos del subconsciente acepta un encargo imposible: implantar una idea en la mente de un magnate.', 'Tu mente es el escenario del crimen.'],
  ['The Dark Knight', 'movie', [28, 80, 53], 8.5, '2008-07-18', 'Batman se enfrenta al Joker, un criminal anarquista que sume Gotham en el caos y lo obliga a cruzar límites morales.', 'Bienvenido a un mundo sin reglas.'],
  ['Interstellar', 'movie', [878, 18, 12], 8.6, '2014-11-07', 'En un futuro cercano, un grupo de exploradores viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.', 'La humanidad nació en la Tierra. Nunca estuvo destinada a morir aquí.'],
  ['The Matrix', 'movie', [878, 28], 8.2, '1999-03-31', 'Un hacker descubre que la realidad es una simulación y se une a una rebelión para liberar a la humanidad.', 'Bienvenido al desierto de lo real.'],
  ['Parasite', 'movie', [53, 18, 35], 8.5, '2019-05-30', 'Una familia pobre se infiltra en la vida de una familia adinerada, desencadenando una serie de consecuencias imprevisibles.', 'Actúa equivocado para encajar.'],
  ['The Godfather', 'movie', [80, 18], 8.7, '1972-03-24', 'La saga de la familia Corleone y la transferencia del poder de un patriarca mafioso a su hijo menor.', 'Una oferta que no podrás rechazar.'],
  ['Pulp Fiction', 'movie', [80, 53], 8.5, '1994-10-14', 'Historias entrelazadas de crimen, redención y violencia que convergen en el bajo mundo de Los Ángeles.', 'No sabes qué va a pasar hasta que pasa.'],
  ['Fight Club', 'movie', [18, 53], 8.4, '1999-10-15', 'Un oficinista insomne funda un club de peleas clandestino que pronto escapa a su control.', 'La primera regla es: no hables del club.'],
  ['Forrest Gump', 'movie', [18, 10749], 8.4, '1994-07-06', 'La vida extraordinaria de un hombre sencillo que, sin proponérselo, participa en los grandes momentos de la historia.', 'La vida es como una caja de bombones.'],
  ['Gladiator', 'movie', [28, 18, 12], 8.2, '2000-05-05', 'Un general romano traicionado se convierte en gladiador para vengarse del emperador que destruyó a su familia.', 'Un héroe renacerá.'],
  ['Dune', 'movie', [878, 12], 8.0, '2021-10-22', 'El heredero de una casa noble debe sobrevivir en el planeta más peligroso del universo y cumplir su destino.', 'El miedo es el asesino de la mente.'],
  ['Mad Max: Fury Road', 'movie', [28, 12, 878], 7.9, '2015-05-15', 'En un páramo postapocalíptico, un guerrero solitario y una fugitiva huyen de un tirano y su ejército.', '¿Qué fue del mundo?'],
  ['La La Land', 'movie', [10749, 35, 18], 8.0, '2016-12-09', 'Un pianista de jazz y una aspirante a actriz se enamoran en Los Ángeles mientras persiguen sus sueños.', 'Aquí están los soñadores.'],
  ['Get Out', 'movie', [27, 9648, 53], 7.7, '2017-02-24', 'Un joven afroamericano descubre un secreto perturbador cuando visita a la familia de su novia blanca.', 'Solo porque te invitaron, no significa que debas ir.'],
  ['A Quiet Place', 'movie', [27, 53, 878], 7.5, '2018-04-06', 'Una familia sobrevive en silencio absoluto mientras criaturas ciegas cazan por el más mínimo sonido.', 'Si te oyen, te cazan.'],
  ['The Shining', 'movie', [27, 9648], 8.4, '1980-05-23', 'Un escritor y su familia quedan aislados en un hotel encantado donde la locura acecha lentamente.', 'Solo trabajo y nada de juego.'],
  ['Whiplash', 'movie', [18], 8.5, '2014-10-10', 'Un joven baterista y un instructor implacable llevan la búsqueda de la perfección al límite.', 'El camino a la grandeza exige sacrificio.'],
  ['Spirited Away', 'movie', [16, 14, 12], 8.6, '2001-07-20', 'Una niña queda atrapada en un mundo de espíritus y debe trabajar en una casa de baños para salvar a sus padres.', 'No mires atrás.'],
  ['Coco', 'movie', [16, 14, 35], 8.4, '2017-11-22', 'Un niño viaja a la Tierra de los Muertos para descubrir los secretos de su legado musical.', 'La música es el recuerdo que nunca muere.'],
  ['Breaking Bad', 'tv', [80, 18, 53], 9.0, '2008-01-20', 'Un profesor de química se convierte en narcotraficante tras un diagnóstico terminal para asegurar el futuro de su familia.', 'Recuerda mi nombre.'],
  ['Game of Thrones', 'tv', [18, 14, 12], 8.9, '2011-04-17', 'Nobles familias luchan por el Trono de Hierro en un continente donde los inviernos duran años.', 'Se acerca el invierno.'],
  ['Stranger Things', 'tv', [878, 27, 9648], 8.7, '2016-07-15', 'Un grupo de niños descubre experimentos secretos del gobierno y una dimensión paralela en su pueblo.', 'Cosas más extrañas han pasado.'],
  ['Chernobyl', 'tv', [18, 53], 9.0, '2019-05-06', 'La historia real del desastre nuclear de 1986 y de quienes arriesgaron todo para contenerlo.', '¿Cuál es el coste de las mentiras?'],
  ['Dark', 'tv', [9648, 878, 53], 8.7, '2017-12-01', 'La desaparición de dos niños revela un entramado de secretos y viajes en el tiempo entre cuatro familias.', 'La pregunta no es dónde, sino cuándo.'],
  ['The Office', 'tv', [35], 8.5, '2005-03-24', 'Un documental sobre la vida cotidiana de los empleados de una oficina de venta de papel en Scranton.', 'Un lugar como cualquier otro... solo que peor.'],
];

const TAGLINES = new Map<number, string>(
  SEEDS.map((s, i) => [i + 1, s[6]]),
);

export const MOCK_MEDIA: MediaItem[] = SEEDS.map((seed, i) => {
  const id = i + 1;
  const [title, mediaType, genreIds, voteAverage, releaseDate, overview] = seed;
  return {
    id,
    mediaType,
    title,
    originalTitle: title,
    overview,
    posterPath: `/mock/poster-${id}.jpg`,
    backdropPath: `/mock/backdrop-${id}.jpg`,
    voteAverage,
    voteCount: Math.round(400 + voteAverage * 1800),
    genreIds,
    releaseDate,
  };
});

// [actor, personaje]
type CastTuple = [string, string];

const MOCK_CAST: Record<number, CastTuple[]> = {
  1: [
    ['Leonardo DiCaprio', 'Cobb'],
    ['Joseph Gordon-Levitt', 'Arthur'],
    ['Elliot Page', 'Ariadne'],
    ['Tom Hardy', 'Eames'],
    ['Marion Cotillard', 'Mal'],
  ],
  2: [
    ['Christian Bale', 'Bruce Wayne / Batman'],
    ['Heath Ledger', 'Joker'],
    ['Aaron Eckhart', 'Harvey Dent'],
    ['Michael Caine', 'Alfred'],
    ['Gary Oldman', 'Jim Gordon'],
  ],
  3: [
    ['Matthew McConaughey', 'Cooper'],
    ['Anne Hathaway', 'Brand'],
    ['Jessica Chastain', 'Murph'],
    ['Michael Caine', 'Prof. Brand'],
    ['Matt Damon', 'Mann'],
  ],
  4: [
    ['Keanu Reeves', 'Neo'],
    ['Laurence Fishburne', 'Morpheus'],
    ['Carrie-Anne Moss', 'Trinity'],
    ['Hugo Weaving', 'Agente Smith'],
    ['Joe Pantoliano', 'Cypher'],
  ],
  5: [
    ['Song Kang-ho', 'Kim Ki-taek'],
    ['Lee Sun-kyun', 'Park Dong-ik'],
    ['Cho Yeo-jeong', 'Choi Yeon-kyo'],
    ['Choi Woo-shik', 'Kim Ki-woo'],
    ['Park So-dam', 'Kim Ki-jung'],
  ],
  6: [
    ['Marlon Brando', 'Don Vito Corleone'],
    ['Al Pacino', 'Michael Corleone'],
    ['James Caan', 'Sonny Corleone'],
    ['Robert Duvall', 'Tom Hagen'],
    ['Diane Keaton', 'Kay Adams'],
  ],
  7: [
    ['John Travolta', 'Vincent Vega'],
    ['Samuel L. Jackson', 'Jules Winnfield'],
    ['Uma Thurman', 'Mia Wallace'],
    ['Bruce Willis', 'Butch Coolidge'],
    ['Ving Rhames', 'Marsellus Wallace'],
  ],
  8: [
    ['Edward Norton', 'El Narrador'],
    ['Brad Pitt', 'Tyler Durden'],
    ['Helena Bonham Carter', 'Marla Singer'],
    ['Meat Loaf', 'Robert Paulson'],
    ['Jared Leto', 'Angel Face'],
  ],
  9: [
    ['Tom Hanks', 'Forrest Gump'],
    ['Robin Wright', 'Jenny Curran'],
    ['Gary Sinise', 'Teniente Dan'],
    ['Sally Field', 'Sra. Gump'],
    ['Mykelti Williamson', 'Bubba'],
  ],
  10: [
    ['Russell Crowe', 'Máximo Décimo Meridio'],
    ['Joaquin Phoenix', 'Cómodo'],
    ['Connie Nielsen', 'Lucilla'],
    ['Oliver Reed', 'Próximo'],
    ['Djimon Hounsou', 'Juba'],
  ],
  11: [
    ['Timothée Chalamet', 'Paul Atreides'],
    ['Rebecca Ferguson', 'Lady Jessica'],
    ['Oscar Isaac', 'Duque Leto Atreides'],
    ['Zendaya', 'Chani'],
    ['Jason Momoa', 'Duncan Idaho'],
  ],
  12: [
    ['Tom Hardy', 'Max Rockatansky'],
    ['Charlize Theron', 'Imperator Furiosa'],
    ['Nicholas Hoult', 'Nux'],
    ['Hugh Keays-Byrne', 'Immortan Joe'],
    ['Zoë Kravitz', 'Toast the Knowing'],
  ],
  13: [
    ['Ryan Gosling', 'Sebastian Wilder'],
    ['Emma Stone', 'Mia Dolan'],
    ['John Legend', 'Keith'],
    ['Rosemarie DeWitt', 'Laura Wilder'],
    ['J.K. Simmons', 'Bill'],
  ],
  14: [
    ['Daniel Kaluuya', 'Chris Washington'],
    ['Allison Williams', 'Rose Armitage'],
    ['Bradley Whitford', 'Dean Armitage'],
    ['Catherine Keener', 'Missy Armitage'],
    ['Lil Rel Howery', 'Rod Williams'],
  ],
  15: [
    ['Emily Blunt', 'Evelyn Abbott'],
    ['John Krasinski', 'Lee Abbott'],
    ['Millicent Simmonds', 'Regan Abbott'],
    ['Noah Jupe', 'Marcus Abbott'],
    ['Cillian Murphy', 'Emmett'],
  ],
  16: [
    ['Jack Nicholson', 'Jack Torrance'],
    ['Shelley Duvall', 'Wendy Torrance'],
    ['Danny Lloyd', 'Danny Torrance'],
    ['Scatman Crothers', 'Dick Hallorann'],
  ],
  17: [
    ['Miles Teller', 'Andrew Neiman'],
    ['J.K. Simmons', 'Terence Fletcher'],
    ['Paul Reiser', 'Jim Neiman'],
    ['Melissa Benoist', 'Nicole'],
  ],
  18: [
    ['Rumi Hiiragi', 'Chihiro (voz)'],
    ['Miyu Irino', 'Haku (voz)'],
    ['Mari Natsuki', 'Yubaba (voz)'],
    ['Takashi Naito', 'Akio (voz)'],
  ],
  19: [
    ['Anthony Gonzalez', 'Miguel (voz)'],
    ['Gael García Bernal', 'Héctor (voz)'],
    ['Benjamin Bratt', 'Ernesto de la Cruz (voz)'],
    ['Ana Ofelia Murguía', 'Mamá Coco (voz)'],
  ],
  20: [
    ['Bryan Cranston', 'Walter White'],
    ['Aaron Paul', 'Jesse Pinkman'],
    ['Anna Gunn', 'Skyler White'],
    ['Dean Norris', 'Hank Schrader'],
    ['Bob Odenkirk', 'Saul Goodman'],
  ],
  21: [
    ['Emilia Clarke', 'Daenerys Targaryen'],
    ['Kit Harington', 'Jon Snow'],
    ['Peter Dinklage', 'Tyrion Lannister'],
    ['Lena Headey', 'Cersei Lannister'],
    ['Maisie Williams', 'Arya Stark'],
  ],
  22: [
    ['Millie Bobby Brown', 'Eleven'],
    ['Finn Wolfhard', 'Mike Wheeler'],
    ['David Harbour', 'Jim Hopper'],
    ['Winona Ryder', 'Joyce Byers'],
    ['Gaten Matarazzo', 'Dustin Henderson'],
  ],
  23: [
    ['Jared Harris', 'Valery Legasov'],
    ['Stellan Skarsgård', 'Boris Shcherbina'],
    ['Emily Watson', 'Ulana Khomyuk'],
    ['Jessie Buckley', 'Lyudmilla Ignatenko'],
  ],
  24: [
    ['Louis Hofmann', 'Jonas Kahnwald'],
    ['Lisa Vicari', 'Martha Nielsen'],
    ['Maja Schöne', 'Hannah Kahnwald'],
    ['Andreas Pietschmann', 'El Extranjero'],
    ['Karoline Eichhorn', 'Charlotte Doppler'],
  ],
  25: [
    ['Steve Carell', 'Michael Scott'],
    ['Rainn Wilson', 'Dwight Schrute'],
    ['John Krasinski', 'Jim Halpert'],
    ['Jenna Fischer', 'Pam Beesly'],
    ['B.J. Novak', 'Ryan Howard'],
  ],
};

export function getMockCredits(id: number): CastMember[] {
  const cast = MOCK_CAST[id] ?? [];
  return cast.map(([name, character], i) => ({
    id: id * 100 + i,
    name,
    character,
    profilePath: null,
  }));
}

export function getMockVideos(id: number): Video[] {
  return [
    {
      id: `${id}-trailer`,
      key: 'demo', // en modo demo no hay clave real de YouTube
      name: 'Tráiler oficial',
      site: 'YouTube',
      type: 'Trailer',
    },
  ];
}

export function getMockDetails(mediaType: MediaType, id: number): MediaDetails | null {
  const base = MOCK_MEDIA.find((m) => m.id === id && m.mediaType === mediaType);
  if (!base) return null;
  const genreObjects = base.genreIds
    .map((gid) => MOCK_GENRES.find((g) => g.id === gid))
    .filter(Boolean) as Genre[];
  return {
    ...base,
    tagline: TAGLINES.get(id) ?? '',
    status: 'Released',
    runtime: mediaType === 'movie' ? 90 + ((id * 13) % 70) : 42 + ((id * 7) % 20),
    genres: genreObjects,
    numberOfSeasons: mediaType === 'tv' ? 2 + (id % 4) : undefined,
    numberOfEpisodes: mediaType === 'tv' ? 8 + (id % 5) : undefined,
    homepage: '#',
  };
}

export function getMockSimilar(mediaType: MediaType, id: number): MediaItem[] {
  const base = MOCK_MEDIA.find((m) => m.id === id && m.mediaType === mediaType);
  if (!base) return [];
  return MOCK_MEDIA.filter(
    (m) =>
      m.id !== id &&
      m.genreIds.some((g) => base.genreIds.includes(g)),
  ).slice(0, 12);
}

export function searchMock(query: string): Paginated<MediaItem> {
  const q = query.toLowerCase().trim();
  if (!q) return { page: 1, totalPages: 1, totalResults: 0, results: [] };
  const results = MOCK_MEDIA.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.overview.toLowerCase().includes(q) ||
      m.genreIds.some((gid) =>
        MOCK_GENRES.find((g) => g.id === gid)?.name.toLowerCase().includes(q),
      ),
  );
  return {
    page: 1,
    totalPages: 1,
    totalResults: results.length,
    results,
  };
}

export function discoverMock(params: DiscoverParams): Paginated<MediaItem> {
  let results = MOCK_MEDIA.filter((m) => m.mediaType === params.mediaType);
  if (params.withGenres) {
    const ids = params.withGenres.split(',').map(Number);
    results = results.filter((m) => m.genreIds.some((g) => ids.includes(g)));
  }
  if (params.year) {
    results = results.filter((m) =>
      m.releaseDate.startsWith(String(params.year)),
    );
  }
  const sorted = [...results].sort((a, b) => {
    if (params.sortBy === 'vote_average.desc') return b.voteAverage - a.voteAverage;
    if (params.sortBy === 'primary_release_date.desc')
      return b.releaseDate.localeCompare(a.releaseDate);
    return b.voteCount - a.voteCount;
  });
  return {
    page: params.page ?? 1,
    totalPages: 1,
    totalResults: sorted.length,
    results: sorted,
  };
}
