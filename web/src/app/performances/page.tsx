'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import PerformanceCard from '@/components/PerformanceCard';
import { Performance } from '@/types';

export default function PerformancesPage() {
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'recent' | 'rated'>('recent');

    useEffect(() => {
        const fetchPerformances = async () => {
            try {
                setLoading(true);
                setError(null);

                const endpoint = sortBy === 'rated'
                    ? '/api/hv/performances/top-rated?limit=100'
                    : '/api/hv/performances?limit=100';

                const response = await fetch(endpoint, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch performances');
                }

                const data = await response.json();
                setPerformances(Array.isArray(data) ? data : data.items || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setPerformances([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformances();
    }, [sortBy]);

    return (
        <>
            <PageHeader
                title="Performances"
                description="Every version of every song, documented"
                loggedInMessage="Rate and review your favorite performances below."
            />

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Stats Bar */}
                <div className="mb-8 grid grid-cols-3 gap-4">
                    <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 rounded">
                        <div className="font-[family-name:var(--font-ibm-plex-mono)] text-2xl font-bold text-[var(--accent-primary)]">
                            {performances.length}
                        </div>
                        <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                            Performances
                        </div>
                    </div>
                    <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 rounded">
                        <div className="font-[family-name:var(--font-ibm-plex-mono)] text-2xl font-bold text-[var(--accent-secondary)]">
                            {new Set(performances.map(p => p.song.slug)).size}
                        </div>
                        <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                            Songs
                        </div>
                    </div>
                    <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 rounded">
                        <div className="font-[family-name:var(--font-ibm-plex-mono)] text-2xl font-bold text-[var(--accent-tertiary)]">
                            {new Set(performances.map(p => p.show.date)).size}
                        </div>
                        <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                            Shows
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSortBy('recent')}
                            className={`px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider transition-colors ${
                                sortBy === 'recent'
                                    ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)]'
                                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                            }`}
                        >
                            Recent
                        </button>
                        <button
                            onClick={() => setSortBy('rated')}
                            className={`px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider transition-colors ${
                                sortBy === 'rated'
                                    ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)]'
                                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                            }`}
                        >
                            Top Rated
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)]'
                                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                            }`}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)]'
                                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
                            }`}
                        >
                            List
                        </button>
                    </div>
                </div>

                {/* Performances Grid/List */}
                {loading ? (
                    <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}`}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 animate-pulse rounded"
                            />
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-8 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded">
                        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            Error loading performances: {error}
                        </p>
                    </div>
                ) : performances.length > 0 ? (
                    <div className={viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                        : 'space-y-4'
                    }>
                        {performances.map((performance) => (
                            <PerformanceCard key={performance.id} performance={performance} />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded text-center">
                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-secondary)] mb-2">
                            No performances yet
                        </h3>
                        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            Check back soon as we catalog more performances!
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
