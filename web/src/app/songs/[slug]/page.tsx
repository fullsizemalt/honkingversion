import React from 'react';
import { getApiEndpoint } from '@/lib/api';
import SongHeader from '@/components/SongHeader';
import TopVersion from '@/components/TopVersion';
import PerformanceTimeline from '@/components/PerformanceTimeline';

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
                {/* Header */}
                <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-10">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="mb-6">
                            <SongHeader song={song} />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-4">
                                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Total Performances</p>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{performances.length}</p>
                            </div>
                            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-4">
                                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Avg Rating</p>
                                <p className="text-2xl font-bold text-[var(--accent-tertiary)]">
                                    {avgOfAverages?.toFixed(1) ?? 'N/A'}
                                </p>
                            </div>
                            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-4">
                                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Rated Performances</p>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{ratingsCount}</p>
                            </div>
                            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-4">
                                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">First Played</p>
                                <p className="text-sm font-bold text-[var(--text-primary)]">
                                    {sortedPerformances[sortedPerformances.length - 1]?.show?.date || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 py-12">
                    {topVersion && (
                        <div className="mb-12">
                            <TopVersion performance={topVersion} />
                        </div>
                    )}

                    <div>
                        <div className="mb-6 pb-3 border-b border-[var(--border)]">
                            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight inline-block">
                                All Performances
                            </h2>
                            <span className="ml-4 font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                                {sortedPerformances.length} performances
                            </span>
                        </div>

                        {sortedPerformances.length > 0 ? (
                            <PerformanceTimeline performances={sortedPerformances} />
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
