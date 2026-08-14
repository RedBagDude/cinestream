import { notFound } from 'next/navigation';
import { MediaDetail } from '@/components/MediaDetail';
import { getDetails, getCredits, getVideos, getSimilar } from '@/lib/api';

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movieId = Number(id);
  if (!Number.isFinite(movieId)) notFound();

  const [details, credits, videos, similar] = await Promise.all([
    getDetails('movie', movieId),
    getCredits('movie', movieId),
    getVideos('movie', movieId),
    getSimilar('movie', movieId),
  ]);
  if (!details) notFound();

  return (
    <MediaDetail
      details={details}
      credits={credits}
      videos={videos}
      similar={similar}
    />
  );
}
