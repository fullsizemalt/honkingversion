import React from 'react';
import { getApiEndpoint } from '@/lib/api';
import SongHeader from '@/components/SongHeader';
import TopVersions from '@/components/TopVersions';
import PerformanceFilter from '@/components/PerformanceFilter';
import PerformanceStats from '@/components/PerformanceStats';
import SongTags from '@/components/SongTags';

import { Performance } from '@/types';

export default async function SongPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    try {
        const songRes = await fetch(getApiEndpoint(`/songs/${slug}`), { cache: 'no-store' });

        if (!songRes.ok) {
            return (
                <section className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--text-primary)] mb-4">
                        Song not found
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Please check the URL or choose a different song.
                    </p>
                </section>
            );
        }
        const song = await songRes.json();

        const perfRes = await fetch(getApiEndpoint(`/songs/${slug}/performances`), { cache: 'no-store' });
        const rawPerformances = perfRes.ok ? await perfRes.json() : [];
        const performances: Performance[] = rawPerformances.map((p: any) => ({
            ...p,
            song: {
                id: song.id,
                name: song.name,
                slug: song.slug,
                is_cover: song.is_cover,
                original_artist: song.original_artist
            }
        }));

        // Sort performances by date descending (most recent first)
        const sortedPerformances = [...performances].sort((a, b) => {
            const dateA = new Date(a.show?.date || '');
            const dateB = new Date(b.show?.date || '');
            return dateB.getTime() - dateA.getTime();
        });

        const topVersion = performances
            .filter((p) => p.avg_rating !== null && p.avg_rating !== undefined)
            .sort((a, b) => (b.avg_rating! - a.avg_rating!))[0];

        // Calculate aggregate stats
        const ratingsCount = performances.filter(p => p.avg_rating !== null && p.avg_rating !== undefined).length;
        const avgOfAverages = ratingsCount > 0
            ? performances
                .filter(p => p.avg_rating !== null)
                .reduce((sum, p) => sum + (p.avg_rating || 0), 0) / ratingsCount
            : null;

        return (
            <>
                {/* Header Section */}
                <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <SongHeader song={song} />

                        {/* Tags */}
                        {song.id && (
                            <div className="mt-8">
                                <SongTags songId={song.id} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
                    {/* Top Versions Section */}
                    {performances.length > 0 && (
                        <TopVersions performances={performances} maxVersions={5} />
                    )}

                    {/* Performance Statistics */}
                    {performances.length > 0 && (
                        <PerformanceStats performances={performances} />
                    )}

                    {/* All Performances Section */}
                    <div className="space-y-6">
                        <div className="pb-3 border-b border-[var(--border)]">
                            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight inline-block">
                                All Performances
                            </h2>
                            <span className="ml-4 font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                                {sortedPerformances.length} total
                            </span>
                        </div>

                        {sortedPerformances.length > 0 ? (
                            <PerformanceFilter performances={sortedPerformances} />
                        ) : (
                            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-8 text-center">
                                <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                                    No performances found for this song.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    } catch (err) {
        console.error('Error loading song page', err);
        return (
            <section className="max-w-7xl mx-auto px-4 py-12 text-center">
                <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--text-primary)] mb-4">
                    Error loading song
                </h1>
                <p className="text-[var(--text-secondary)]">
                    Something went wrong. Please try again later.
                </p>
            </section>
        );
    }

}
