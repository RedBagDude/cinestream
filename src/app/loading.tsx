import { SkeletonRow } from '@/components/Skeletons';

export default function Loading() {
  return (
    <main className="pb-16">
      <div className="h-[70vh] w-full animate-pulse bg-zinc-900" />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-8">
        <div className="h-6 w-48 animate-pulse rounded bg-zinc-800" />
        <SkeletonRow count={8} />
        <div className="h-6 w-48 animate-pulse rounded bg-zinc-800" />
        <SkeletonRow count={8} />
      </div>
    </main>
  );
}
