'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { getApiEndpoint } from '@/lib/api';
import TagBadge from '@/components/TagBadge';
import { Sparkline } from '@/components/charts/Sparkline';
import PerformanceReviews from '@/components/PerformanceReviews';
import ExternalLinks from '@/components/ExternalLinks';

interface PerformanceDetail {
  id: number;
  position: number;
  set_number: number;
  notes: string | null;
  vote_count: number;
  avg_rating: number | null;
  bandcamp_url?: string | null;
  nugs_url?: string | null;
  song: {
    id: number;
    name: string;
    slug: string;
    is_cover: boolean;
    original_artist?: string | null;
  };
  show: {
    id: number;
    date: string;
    venue: string;
    location: string;
  };
}

export default function PerformanceDetailPage() {
  const params = useParams();
  const performanceId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [performance, setPerformance] = useState<PerformanceDetail | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!performanceId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(getApiEndpoint(`/performances/${performanceId}`), { cache: 'no-store' });
        if (!res.ok) {
          throw new Error('Performance not found');
        }
        const data = await res.json();
        setPerformance(data);
        const tagsRes = await fetch(getApiEndpoint(`/tags/performance/${performanceId}`), { cache: 'no-store' });
        if (tagsRes.ok) {
          const tagData = await tagsRes.json();
          setTags(tagData.map((t: any) => t.name));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load performance');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [performanceId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-10 w-48 bg-[var(--bg-muted)] animate-pulse mb-6" />
        <div className="h-32 w-full bg-[var(--bg-muted)] animate-pulse" />
      </div>
    );
  }

  if (error || !performance) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-[var(--text-secondary)]">
        <p>{error || 'Performance not found.'}</p>
      </div>
    );
  }

  const dateLabel = new Date(performance.show.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const normalizedVotes = performance.vote_count ? [0, performance.vote_count] : [];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-16">
      <PageHeader
        title={performance.song.name}
        description={`${performance.show.venue} • ${dateLabel}`}
        breadcrumbs={[
          { label: 'Performances', href: '/performances' },
          { label: performance.song.name, href: `/performances/${performance.id}` },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4">
        <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 mb-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--text-primary)]">
                {performance.song.name}
                {performance.song.is_cover && (
                  <span className="text-[var(--text-secondary)] text-sm ml-2">
                    (cover{performance.song.original_artist ? ` · ${performance.song.original_artist}` : ''})
                  </span>
                )}
              </h1>
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">
                {performance.show.venue} · {performance.show.location} · {dateLabel}
              </p>
            </div>
            <div className="text-right">
              {performance.avg_rating && (
                <div className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--accent-primary)]">
                  {performance.avg_rating.toFixed(1)}
                </div>
              )}
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] tracking-[0.35em]">
                {performance.vote_count} votes
              </div>
              {normalizedVotes.length > 0 && (
                <div className="mt-2">
                  <Sparkline
                    values={normalizedVotes}
                    width={120}
                    height={20}
                    stroke="var(--accent-primary)"
                    strokeWidth={3}
                  />
                </div>
              )}
            </div>
          </div>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((t) => (
                <TagBadge key={t} tag={{ id: 0, name: t, description: '' }} />
              ))}
            </div>
          )}

          {performance.notes && (
            <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">{performance.notes}</p>
          )}

          {(performance.bandcamp_url || performance.nugs_url) && (
            <div className="mt-6 p-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded">
              <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] mb-3 uppercase tracking-[0.2em]">
                📺 Listen
              </p>
              <ExternalLinks
                bandcamp_url={performance.bandcamp_url}
                nugs_url={performance.nugs_url}
              />
            </div>
          )}

          <div className="mt-6 flex gap-3 text-sm text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)]">
            <Link href={`/shows/${performance.show.date}`} className="text-[var(--accent-primary)] hover:underline">
              View show details
            </Link>
          </div>
        </div>

        <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] mb-4">Reviews</h2>
          <PerformanceReviews performanceId={Number(performance.id)} />
        </div>
      </div>
    </div>
  );
}
