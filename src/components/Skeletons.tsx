import { cn } from '@/lib/utils';

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('w-full', className)}>
      <div className="aspect-[2/3] w-full animate-pulse rounded-lg bg-zinc-800" />
      <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
      <div className="mt-1.5 h-3 w-1/3 animate-pulse rounded bg-zinc-800" />
    </div>
  );
}

export function SkeletonRow({ count = 8 }: { count?: number }) {
  return (
    <div className="scrollbar-hide flex gap-3 overflow-hidden md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-[150px] shrink-0 md:w-[180px]">
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
