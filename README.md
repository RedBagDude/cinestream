# CineStream — Películas y Series

Plataforma cinematográfica para explorar, buscar y gestionar películas y series con
datos de **The Movie Database (TMDB v3)**, en un diseño oscuro con acentos rojos y
glassmorphism.

> Catálogo de tendencias, búsqueda en tiempo real y watchlist persistente — con modo
> demo determinista que funciona sin API key.

## ✨ Features

- 🔍 **Búsqueda en tiempo real** con historial de búsquedas persistente.
- ⭐ **Watchlist** con Zustand (+ persist) — guarda tus títulos favoritos.
- 🎬 **Catálogo de tendencias** — películas y series del momento, detalles completos y trailers.
- 🧩 **Modo demo determinista** — si no hay `NEXT_PUBLIC_TMDB_API_KEY`, usa un catálogo local de títulos reales para que la app sea testeable sin clave.
- 🌗 **Diseño dark glassmorphic** — acentos rojos, glassmorphism y transiciones suaves.

## 🛠️ Stack

- **Next.js 16** (App Router, Server Components) + **TypeScript**
- **Tailwind CSS** — estilos utility-first
- **Zustand** (+ persist) — watchlist e historial
- **lucide-react** — iconografía
- **TMDB API v3** — cliente modular con tipado estricto

## 🚀 Instalación

```bash
npm install
npm run dev
# → http://localhost:3000
```

Para usar datos reales de TMDB, crea un archivo `.env.local`:

```bash
NEXT_PUBLIC_TMDB_API_KEY=tu_api_key_aqui
```

Sin esta clave, la app funciona en modo demo con un catálogo local.

## 📁 Estructura

```
src/
├── app/           # App Router (páginas de películas, series, búsqueda)
├── components/    # tarjetas, grids, watchlist
├── lib/           # cliente TMDB (tmdb.ts) + capa API con fallback demo
├── store/         # Zustand (watchlist, historial)
└── types/         # tipos TMDB
```

## 📝 Licencia

MIT
