'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clapperboard, Bookmark } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useWatchlistStore } from '@/store/useWatchlistStore';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/search?type=movie', label: 'Películas' },
  { href: '/search?type=tv', label: 'Series' },
  { href: '/search?sort=popularity.desc', label: 'Tendencias' },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const count = useWatchlistStore((s) => s.items.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/search')) return pathname === '/search';
    return false;
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-colors duration-300',
        scrolled
          ? 'glass border-b border-zinc-800'
          : 'bg-gradient-to-b from-zinc-950 to-transparent',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Clapperboard className="h-6 w-6 text-red-600" />
          <span className="text-lg font-extrabold tracking-tight text-zinc-100">
            Cine<span className="text-red-600">Stream</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm transition-colors',
                isActive(link.href)
                  ? 'bg-red-600 text-white'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="ml-auto hidden w-72 sm:block">
          <SearchBar />
        </div>

        {/* Watchlist */}
        <Link
          href="/watchlist"
          aria-label="Mi lista"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <Bookmark className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>

      {/* Search (mobile) */}
      <div className="px-4 pb-3 sm:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
