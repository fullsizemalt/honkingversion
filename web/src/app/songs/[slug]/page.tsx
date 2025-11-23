import React from 'react';
import { getApiEndpoint } from '@/lib/api';
import SongHeader from '@/components/SongHeader';
import TopVersion from '@/components/TopVersion';
import PerformanceTimeline from '@/components/PerformanceTimeline';

import { Song, Performance } from '@/types';

interface SongData extends Song {
    performances: Performance[];
}

export default async function SongPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    try {
        const songRes = await fetch(getApiEndpoint(`/songs/${slug}`), { cache: 'no-store' });

        if (!songRes.ok) {
            return (
                <section className="max-w-4xl mx-auto p-4 text-center">
                    <h1 className="text-2xl font-bold mb-4">Song not found</h1>
                    <p>Please check the URL or choose a different song.</p>
                </section>
            );
        }
        const song: SongData = await songRes.json();

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

        const topVersion = performances
            .filter((p) => p.avg_rating !== null && p.avg_rating !== undefined)
            .sort((a, b) => (b.avg_rating! - a.avg_rating!))[0];

        return (
            <section className="max-w-4xl mx-auto p-4">
                <SongHeader song={song} />
                {topVersion && <TopVersion performance={topVersion} />}
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl font-bold mt-8 mb-4">
                    All Performances
                </h2>
                <PerformanceTimeline performances={performances} />
            </section>
        );
    } catch (err) {
        console.error('Error loading song page', err);
        return (
            <section className="max-w-4xl mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Error loading song</h1>
                <p>Something went wrong. Please try again later.</p>
            </section>
        );
    }

}
