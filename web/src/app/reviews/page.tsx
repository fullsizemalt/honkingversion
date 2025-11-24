'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import ReviewCard from '@/components/ReviewCard';
import { Review } from '@/types';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'recent' | 'rated'>('recent');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = new URLSearchParams();
                if (sortBy === 'rated') params.append('sort', 'rating');

                const response = await fetch(`/api/hv/reviews?${params}`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch reviews');
                }

                const data = await response.json();
                setReviews(Array.isArray(data) ? data : data.items || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [sortBy]);

    return (
        <>
            <PageHeader
                title="Reviews"
                description="Read and share detailed performance reviews"
                loggedInMessage="Share your thoughts on your favorite performances."
            />

            <div className="max-w-7xl mx-auto px-4 py-12">
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
                            Highly Rated
                        </button>
                    </div>

                    <div className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-xs">
                        {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Reviews Feed */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 animate-pulse rounded"
                            />
                        ))}
                    </div>
                ) : error ? (
                    <div className="p-8 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded">
                        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            Error loading reviews: {error}
                        </p>
                    </div>
                ) : reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
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
