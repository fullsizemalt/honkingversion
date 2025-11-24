"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getApiEndpoint } from '@/lib/api';
import PageHeader from '@/components/PageHeader';

type Venue = {
    name: string;
    slug: string;
};

export default function VenuesPage() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const res = await fetch(getApiEndpoint('/venues'));
                if (res.ok) {
                    const data = await res.json();
                    setVenues(data);
                }
            } catch (e) {
                console.error('Failed to fetch venues', e);
            } finally {
                setLoading(false);
            }
        };
        fetchVenues();
    }, []);

    const filteredVenues = venues.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <PageHeader
                title="Venues"
                description="Explore shows by venue location"
                loggedInMessage="Browse venues and discover performances from your favorite locations."
            />

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Search Bar */}
                {!loading && venues.length > 0 && (
                    <div className="mb-8">
                        <input
                            type="text"
                            placeholder="Search venues..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)]"
                        />
                    </div>
                )}

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 animate-pulse rounded" />
                        ))}
                    </div>
                ) : filteredVenues.length === 0 ? (
                    <div className="p-12 border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded text-center">
                        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            {venues.length === 0 ? 'No venues available.' : 'No venues match your search.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredVenues.map((v) => (
                            <Link key={v.slug} href={`/venues/${v.slug}`} className="block group">
                                <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 rounded hover:border-[var(--accent-primary)] transition-colors">
                                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                                        {v.name}
                                    </h3>
                                    <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] uppercase tracking-wider mt-2">
                                        Browse shows at this venue
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
