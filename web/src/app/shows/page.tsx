'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Music, ChevronDown, X } from 'lucide-react';

interface Show {
    id: number;
    date: string;
    venue: string;
    location: string;
    notes?: string;
}

export default function ShowsPage() {
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedDecade, setSelectedDecade] = useState<string | null>(null);
    const [selectedVenueType, setSelectedVenueType] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchShows();
    }, []);

    const fetchShows = async () => {
        try {
            const response = await fetch('/api/shows');
            if (!response.ok) throw new Error('Failed to fetch shows');
            const data = await response.json();
            setShows(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load shows');
        } finally {
            setLoading(false);
        }
    };

    // Derive years and decades from shows
    const years = useMemo(() => {
        const yearSet = new Set(shows.map(s => s.date.split('-')[0]));
        return Array.from(yearSet).sort().reverse();
    }, [shows]);

    const decades = useMemo(() => {
        const decadeSet = new Set(
            shows.map(s => {
                const year = parseInt(s.date.split('-')[0]);
                return `${Math.floor(year / 10) * 10}s`;
            })
        );
        return Array.from(decadeSet).sort().reverse();
    }, [shows]);

    const venueTypes = useMemo(() => {
        const typeMap: Record<string, string> = {};
        shows.forEach(s => {
            const venue = s.venue.toLowerCase();
            let type = 'Other';
            if (venue.includes('amphith') || venue.includes('arena')) type = 'Arena';
            else if (venue.includes('theater') || venue.includes('theatre') || venue.includes('hall')) type = 'Theater/Hall';
            else if (venue.includes('festival')) type = 'Festival';
            else if (venue.includes('park')) type = 'Park';
            else if (venue.includes('garden')) type = 'Garden';
            else if (venue.includes('bar') || venue.includes('pub') || venue.includes('club')) type = 'Club/Bar';

            typeMap[type] = type;
        });
        return Object.values(typeMap).sort();
    }, [shows]);

    // Filter shows
    const filteredShows = useMemo(() => {
        return shows.filter(show => {
            // Year filter
            if (selectedYear && !show.date.startsWith(selectedYear)) return false;

            // Decade filter
            if (selectedDecade) {
                const year = show.date.split('-')[0];
                const decade = `${Math.floor(parseInt(year) / 10) * 10}s`;
                if (decade !== selectedDecade) return false;
            }

            // Venue type filter
            if (selectedVenueType) {
                const venue = show.venue.toLowerCase();
                let type = 'Other';
                if (venue.includes('amphith') || venue.includes('arena')) type = 'Arena';
                else if (venue.includes('theater') || venue.includes('theatre') || venue.includes('hall')) type = 'Theater/Hall';
                else if (venue.includes('festival')) type = 'Festival';
                else if (venue.includes('park')) type = 'Park';
                else if (venue.includes('garden')) type = 'Garden';
                else if (venue.includes('bar') || venue.includes('pub') || venue.includes('club')) type = 'Club/Bar';

                if (type !== selectedVenueType) return false;
            }

            // Search filter
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                if (
                    !show.venue.toLowerCase().includes(term) &&
                    !show.location.toLowerCase().includes(term) &&
                    !show.date.includes(term)
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [shows, selectedYear, selectedDecade, selectedVenueType, searchTerm]);

    const clearFilters = () => {
        setSelectedYear(null);
        setSelectedDecade(null);
        setSelectedVenueType(null);
        setSearchTerm('');
    };

    const hasActiveFilters = selectedYear || selectedDecade || selectedVenueType || searchTerm;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-[var(--text-secondary)]">Loading shows...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold mb-2 text-[var(--text-primary)]">
                        Shows
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Browse all Goose performances ({shows.length} total)
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by venue, location, or date..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] rounded-lg focus:outline-none focus:border-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm"
                    />
                </div>

                {/* Filters */}
                <div className="mb-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[var(--text-primary)]">Quick Filters</h3>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-xs text-[var(--accent-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
                            >
                                <X className="w-4 h-4" /> Clear Filters
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Year Filter */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-2">
                                Year
                            </label>
                            <select
                                value={selectedYear || ''}
                                onChange={(e) => {
                                    setSelectedYear(e.target.value || null);
                                    setSelectedDecade(null);
                                }}
                                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded focus:outline-none focus:border-[var(--accent-primary)] text-sm"
                            >
                                <option value="">All Years</option>
                                {years.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Decade Filter */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-2">
                                Decade
                            </label>
                            <select
                                value={selectedDecade || ''}
                                onChange={(e) => {
                                    setSelectedDecade(e.target.value || null);
                                    setSelectedYear(null);
                                }}
                                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded focus:outline-none focus:border-[var(--accent-primary)] text-sm"
                            >
                                <option value="">All Decades</option>
                                {decades.map(decade => (
                                    <option key={decade} value={decade}>
                                        {decade}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Venue Type Filter */}
                        <div>
                            <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-2">
                                Venue Type
                            </label>
                            <select
                                value={selectedVenueType || ''}
                                onChange={(e) => setSelectedVenueType(e.target.value || null)}
                                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded focus:outline-none focus:border-[var(--accent-primary)] text-sm"
                            >
                                <option value="">All Types</option>
                                {venueTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="mb-4 text-sm text-[var(--text-secondary)]">
                    Showing {filteredShows.length} of {shows.length} shows
                </div>

                {/* Shows List */}
                <div className="space-y-3">
                    {filteredShows.length === 0 ? (
                        <div className="text-center py-12 text-[var(--text-secondary)]">
                            No shows found. Try adjusting your filters.
                        </div>
                    ) : (
                        filteredShows.map(show => {
                            const date = new Date(show.date);
                            const formattedDate = date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            });

                            return (
                                <Link
                                    key={show.id}
                                    href={`/shows/${show.date}`}
                                    className="block p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg hover:border-[var(--accent-primary)] hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Calendar className="w-4 h-4 text-[var(--text-tertiary)]" />
                                                <span className="font-bold text-[var(--text-primary)]">
                                                    {formattedDate}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <MapPin className="w-4 h-4 text-[var(--accent-primary)]" />
                                                <span className="text-[var(--text-primary)]">
                                                    {show.venue}
                                                </span>
                                            </div>
                                            <div className="text-sm text-[var(--text-secondary)]">
                                                {show.location}
                                            </div>
                                        </div>
                                        <div className="text-[var(--accent-tertiary)]">
                                            <ChevronDown className="w-5 h-5 transform rotate-[-90deg]" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
