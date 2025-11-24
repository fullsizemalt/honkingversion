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

    if (loading) return <p>Loading venues...</p>;

    return (
        <>
            <PageHeader
                title="Venues"
                description="Explore shows by venue location"
                loggedInMessage="Browse venues and discover performances from your favorite locations."
            />

            <div className="max-w-4xl mx-auto px-4 py-12">
                <ul className="space-y-3">
                    {venues.map((v) => (
                        <li key={v.slug} className="border-b border-[var(--border-subtle)] pb-2">
                            <Link href={`/venues/${v.slug}`} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                                {v.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
