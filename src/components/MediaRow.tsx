import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { MediaCard } from './MediaCard';
import type { MediaItem } from '@/lib/types';

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  seeAllHref?: string;
}

/** Fila horizontal desplazable de tarjetas. */
export function MediaRow({ title, items, seeAllHref }: MediaRowProps) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-100 md:text-xl">{title}</h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-red-500"
          >
            Ver todo <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2 md:gap-4">
        {items.map((item) => (
          <div key={item.id} className="w-[150px] shrink-0 md:w-[180px]">
            <MediaCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
