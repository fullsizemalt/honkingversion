'use client';

import Link from 'next/link';
import { getApiEndpoint } from '@/lib/api';
import { use } from 'react';

interface Show {
  id: number;
  date: string;
  location: string;
  elgoose_id?: string;
}

interface VenueData {
  name: string;
  slug: string;
  stats: {
    show_count: number;
  };
  shows: Show[];
}

async function fetchVenue(slug: string): Promise<VenueData | null> {
  const res = await fetch(getApiEndpoint(`/venues/${encodeURIComponent(slug)}`), {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default function VenueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // React 19 `use` unwraps the params promise in client components.
  const { slug } = use(params);
  const venuePromise = fetchVenue(slug);
  const venue = use(venuePromise);

  if (!venue) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold mb-6 text-[#f5f5f5]">
          Venue Not Found
        </h1>
        <p className="text-[#a0a0a0] mb-4">The venue you requested could not be found.</p>
        <Link href="/venues" className="text-[#ff6b35] hover:underline">
          ← Back to venues
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <Link href="/venues" className="text-[#ff6b35] hover:underline text-sm mb-4 inline-block">
          ← Back to venues
        </Link>
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold mb-4 text-[#f5f5f5]">
          {venue.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-[#1a1a1a] border border-[#ff6b35]">
          <div className="text-[#ff6b35] font-bold text-2xl">{venue.stats.show_count}</div>
          <div className="text-[#a0a0a0] text-sm">
            {venue.stats.show_count === 1 ? 'Show' : 'Shows'}
          </div>
        </div>

        {venue.shows.length > 0 && (
          <>
            <div className="p-4 bg-[#1a1a1a] border border-[#a0a0a0]">
              <div className="text-[#90ee90] font-bold text-2xl">
                {new Set(venue.shows.map((s) => s.location)).size}
              </div>
              <div className="text-[#a0a0a0] text-sm">Locations</div>
            </div>

            <div className="p-4 bg-[#1a1a1a] border border-[#a0a0a0]">
              <div className="text-[#90ee90] font-bold text-2xl">
                {
                  new Set(
                    venue.shows.map((s) => {
                      const dateObj = new Date(s.date);
                      return dateObj.getFullYear();
                    }),
                  ).size
                }
              </div>
              <div className="text-[#a0a0a0] text-sm">Years</div>
            </div>
          </>
        )}
      </div>

      <div>
        <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f5f5f5] mb-4">
          All Shows at {venue.name}
        </h2>

        {venue.shows.length === 0 ? (
          <p className="text-[#a0a0a0]">No shows found at this venue.</p>
        ) : (
          <div className="space-y-2">
            {[...venue.shows]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((show) => {
                const dateObj = new Date(show.date);
                const dateStr = dateObj.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <Link
                    key={show.id}
                    href={`/shows/${show.date}`}
                    className="block p-3 bg-[#1a1a1a] border border-[#a0a0a0] hover:border-[#ff6b35] transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">
                          {dateStr}
                        </div>
                        <div className="text-[#a0a0a0] text-sm">{show.location}</div>
                      </div>
                      <div className="text-[#ff6b35] text-sm">View Show →</div>
                    </div>
                  </Link>
                );
              })}
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-[#1a1a1a] border border-[#a0a0a0]">
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[#f5f5f5] mb-2">
          About This Venue
        </h3>
        <p className="text-[#a0a0a0] text-sm">
          {venue.name} has hosted {venue.stats.show_count} Goose{' '}
          {venue.stats.show_count === 1 ? 'performance' : 'performances'}. Click on any show above to see the setlist
          and vote on individual performances.
        </p>
      </div>
    </div>
  );
}
