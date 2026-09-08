import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { isLive } from '@/lib/api';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CineStream — Películas y Series',
  description:
    'Explora, busca y gestiona películas y series con datos de The Movie Database (TMDB).',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={inter.variable} data-scroll-behavior="smooth">
      <body>
        <Navbar />
        {children}
        {!isLive && (
          <div className="pointer-events-none fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-amber-500/40 bg-zinc-900/90 px-4 py-1.5 text-xs font-medium text-amber-400 shadow-lg backdrop-blur">
            Modo demo — añade tu clave de TMDB en{' '}
            <code className="font-mono">.env.local</code> para datos reales
          </div>
        )}
      </body>
    </html>
  );
}

// maintainer: periodic housekeeping sync (2026-09-08)