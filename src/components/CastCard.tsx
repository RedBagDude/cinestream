import { SmartImage } from './SmartImage';
import { imageUrl } from '@/lib/api';
import type { CastMember } from '@/lib/types';

export function CastCard({ cast }: { cast: CastMember }) {
  const initials = cast.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');

  return (
    <div className="w-[110px] shrink-0 text-center">
      <div className="relative aspect-square w-full overflow-hidden rounded-full bg-zinc-800 ring-2 ring-zinc-800">
        {cast.profilePath ? (
          <SmartImage
            src={imageUrl(cast.profilePath, 'w185')}
            alt={cast.name}
            fill
            sizes="110px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900 text-lg font-bold text-zinc-200">
            {initials}
          </div>
        )}
      </div>
      <p className="mt-2 line-clamp-1 text-sm font-medium text-zinc-100">
        {cast.name}
      </p>
      <p className="line-clamp-1 text-xs text-zinc-500">{cast.character}</p>
    </div>
  );
}
