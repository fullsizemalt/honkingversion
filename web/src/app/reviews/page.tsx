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

    // Filter states
    const [filters, setFilters] = useState({
        songName: '',
        showDate: '',
        performanceId: '',
        venue: '',
        setNumber: '',
        tour: '',
        dayOfWeek: '',
        month: '',
        year: '',
        minRating: '',
        maxRating: '',
        reviewType: 'all',
        reviewer: '',
        recencyDays: '',
    });

    // Advanced filters visibility
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Track if filters are active
    const hasActiveFilters = Object.values(filters).some(v => v.trim() !== '') || filters.reviewType !== 'all';

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = new URLSearchParams();
                if (sortBy === 'rated') params.append('sort', 'rating');

                // Basic filters
                if (filters.songName) params.append('song_name', filters.songName);
                if (filters.showDate) params.append('show_date', filters.showDate);
                if (filters.performanceId) params.append('performance_id', filters.performanceId);
                if (filters.venue) params.append('venue', filters.venue);
                if (filters.setNumber) params.append('set_number', filters.setNumber);
                if (filters.tour) params.append('tour', filters.tour);

                // Chronological filters
                if (filters.dayOfWeek) params.append('day_of_week', filters.dayOfWeek);
                if (filters.month) params.append('month', filters.month);
                if (filters.year) params.append('year', filters.year);

                // Advanced filters
                if (filters.minRating) params.append('min_rating', filters.minRating);
                if (filters.maxRating) params.append('max_rating', filters.maxRating);
                if (filters.reviewType !== 'all') params.append('review_type', filters.reviewType);
                if (filters.reviewer) params.append('reviewer', filters.reviewer);
                if (filters.recencyDays) params.append('recency_days', filters.recencyDays);

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
    }, [sortBy, filters]);

    return (
        <>
            <PageHeader
                title="Reviews"
                description="Read and share detailed performance reviews"
                loggedInMessage="Share your thoughts on your favorite performances."
            />

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Sort Controls */}
                <div className="mb-8 flex flex-col gap-4">
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

                        <div className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-xs">
                            {reviews.length} review{reviews.length !== 1 ? 's' : ''} {hasActiveFilters && '(filtered)'}
                        </div>
                    </div>

                    {/* Quick Filter Presets */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilters({ ...filters, minRating: '5', maxRating: '5' })}
                            className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider"
                        >
                            ⭐ Best Rated (5★)
                        </button>
                        <button
                            onClick={() => setFilters({ ...filters, minRating: '4', maxRating: '' })}
                            className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider"
                        >
                            4★+
                        </button>
                        <button
                            onClick={() => setFilters({ ...filters, recencyDays: '7' })}
                            className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider"
                        >
                            Past Week
                        </button>
                        <button
                            onClick={() => setFilters({ ...filters, recencyDays: '30' })}
                            className="px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider"
                        >
                            Past Month
                        </button>
                    </div>

                    {/* Filters Section */}
                    <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 rounded">
                        <div className="mb-4">
                            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-3">
                                Filter Reviews
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {/* Song Filter */}
                                <div>
                                    <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                        Song Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Search song..."
                                        value={filters.songName}
                                        onChange={(e) => setFilters({ ...filters, songName: e.target.value })}
                                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                                    />
                                </div>

                                {/* Show Date Filter */}
                                <div>
                                    <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                        Show Date
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="YYYY-MM-DD"
                                        value={filters.showDate}
                                        onChange={(e) => setFilters({ ...filters, showDate: e.target.value })}
                                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                                    />
                                </div>

                                {/* Tour Filter */}
                                <div>
                                    <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                        Tour
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Tour name..."
                                        value={filters.tour}
                                        onChange={(e) => setFilters({ ...filters, tour: e.target.value })}
                                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                                    />
                                </div>

                                {/* Performance ID Filter */}
                                <div>
                                    <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                        Performance ID
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Performance ID..."
                                        value={filters.performanceId}
                                        onChange={(e) => setFilters({ ...filters, performanceId: e.target.value })}
                                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                                    />
                                </div>

                                {/* Venue Filter */}
                                <div>
                                    <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                        Venue
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Venue name..."
                                        value={filters.venue}
                                        onChange={(e) => setFilters({ ...filters, venue: e.target.value })}
                                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                                    />
                                </div>

                                {/* Set Number Filter */}
                                <div>
                                    <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                        Set
                                    </label>
                                    <select
                                        value={filters.setNumber}
                                        onChange={(e) => setFilters({ ...filters, setNumber: e.target.value })}
                                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                                    >
                                        <option value="">All Sets</option>
                                        <option value="1">Set 1</option>
                                        <option value="2">Set 2</option>
                                        <option value="3">Encore</option>
                                    </select>
                                </div>

                                {/* Day of Week Filter */}
                                <div>
                                    <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                        Day of Week
                                    </label>
                                    <select
                                        value={filters.dayOfWeek}
                                        onChange={(e) => setFilters({ ...filters, dayOfWeek: e.target.value })}
                                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                                    >
                                        <option value="">All Days</option>
                                        <option value="0">Sunday</option>
                                        <option value="1">Monday</option>
                                        <option value="2">Tuesday</option>
                                        <option value="3">Wednesday</option>
                                        <option value="4">Thursday</option>
                                        <option value="5">Friday</option>
                                        <option value="6">Saturday</option>
                                    </select>
                                </div>

                                {/* Month Filter */}
                                <div>
                                    <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                        Month
                                    </label>
                                    <select
                                        value={filters.month}
                                        onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                                    >
                                        <option value="">All Months</option>
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                </div>

                                {/* Year Filter */}
                                <div>
                                    <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                        Year
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="YYYY"
                                        value={filters.year}
                                        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            {/* Clear Filters Button */}
                            {hasActiveFilters && (
                                <button
                                    onClick={() => setFilters({ songName: '', showDate: '', performanceId: '', venue: '', setNumber: '', tour: '', dayOfWeek: '', month: '', year: '', minRating: '', maxRating: '', reviewType: 'all', reviewer: '', recencyDays: '' })}
                                    className="px-3 py-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider"
                                >
                                    Clear Filters
                                </button>
                            )}

                            {/* Advanced Filters Toggle */}
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="px-3 py-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider ml-2"
                            >
                                {showAdvanced ? '▼' : '▶'} Advanced
                            </button>
                        </div>

                        {/* Advanced Filters Section */}
                        {showAdvanced && (
                            <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-3">
                                    Advanced Filters
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {/* Rating Range */}
                                    <div>
                                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                            Min Rating
                                        </label>
                                        <select
                                            value={filters.minRating}
                                            onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                                            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                                        >
                                            <option value="">Any</option>
                                            <option value="1">1★+</option>
                                            <option value="2">2★+</option>
                                            <option value="3">3★+</option>
                                            <option value="4">4★+</option>
                                            <option value="5">5★</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                            Max Rating
                                        </label>
                                        <select
                                            value={filters.maxRating}
                                            onChange={(e) => setFilters({ ...filters, maxRating: e.target.value })}
                                            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                                        >
                                            <option value="">Any</option>
                                            <option value="1">1★</option>
                                            <option value="2">2★</option>
                                            <option value="3">3★</option>
                                            <option value="4">4★</option>
                                            <option value="5">5★</option>
                                        </select>
                                    </div>

                                    {/* Review Type */}
                                    <div>
                                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                            Review Type
                                        </label>
                                        <select
                                            value={filters.reviewType}
                                            onChange={(e) => setFilters({ ...filters, reviewType: e.target.value })}
                                            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                                        >
                                            <option value="all">All Reviews</option>
                                            <option value="detailed">Detailed Only</option>
                                            <option value="quick">Quick Takes</option>
                                        </select>
                                    </div>

                                    {/* Reviewer Filter */}
                                    <div>
                                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                            Reviewer
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Username..."
                                            value={filters.reviewer}
                                            onChange={(e) => setFilters({ ...filters, reviewer: e.target.value })}
                                            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                                        />
                                    </div>

                                    {/* Recency Filter */}
                                    <div>
                                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                            Recency
                                        </label>
                                        <select
                                            value={filters.recencyDays}
                                            onChange={(e) => setFilters({ ...filters, recencyDays: e.target.value })}
                                            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                                        >
                                            <option value="">All Time</option>
                                            <option value="7">Past Week</option>
                                            <option value="30">Past Month</option>
                                            <option value="90">Past 3 Months</option>
                                            <option value="365">Past Year</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
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
