'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import ReviewCard from '@/components/ReviewCard';
import { Review } from '@/types';
import { loadLocalReviews, mockReviews, saveLocalReviews } from '@/lib/mockReviews';

type SortBy = 'recent' | 'rated';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [sortBy, setSortBy] = useState<SortBy>('recent');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const locals = loadLocalReviews();
        const merged = [...locals, ...mockReviews];
        setReviews(merged);
        setLoading(false);
    }, []);

    const sorted = useMemo(() => {
        if (sortBy === 'rated') {
            return [...reviews].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        }
        return [...reviews].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }, [reviews, sortBy]);

    const clearLocal = () => {
        saveLocalReviews([]);
        setReviews([...mockReviews]);
    };

    return (
        <>
            <PageHeader
                title="Reviews"
                description="Read and share detailed performance reviews"
                loggedInMessage="Share your thoughts on your favorite performances."
            />

            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-end">
                    <Link
                        href="/reviews/new"
                        className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] rounded font-[family-name:var(--font-space-grotesk)] text-sm font-bold hover:opacity-90"
                    >
                        Write a Review
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
                            Highly Rated
                        </button>
                    </div>

                    <div className="flex items-center gap-3 text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-xs">
                        <span>{sorted.length} review{sorted.length !== 1 ? 's' : ''}</span>
                        <button
                            onClick={clearLocal}
                            className="underline underline-offset-4 hover:text-[var(--accent-primary)]"
                        >
                            Clear local drafts
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 animate-pulse rounded"
                            />
                        ))}
                    </div>
                ) : sorted.length > 0 ? (
                    <div className="space-y-4">
                        {sorted.map((review) => (
                            <ReviewCard key={review.id} review={review} showContext={true} />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded text-center">
                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-secondary)] mb-2">
                            No reviews yet
                        </h3>
                        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            Be the first to share your thoughts on a performance!
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
