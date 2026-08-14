import { notFound } from 'next/navigation';
import { MediaDetail } from '@/components/MediaDetail';
import { getDetails, getCredits, getVideos, getSimilar } from '@/lib/api';

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seriesId = Number(id);
  if (!Number.isFinite(seriesId)) notFound();

  const [details, credits, videos, similar] = await Promise.all([
    getDetails('tv', seriesId),
    getCredits('tv', seriesId),
    getVideos('tv', seriesId),
    getSimilar('tv', seriesId),
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
