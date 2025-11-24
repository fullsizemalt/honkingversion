'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'
import { getApiEndpoint } from '@/lib/api'

interface Tour {
    name: string
}

export default function ToursPage() {
    const [tours, setTours] = useState<Tour[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await fetch(getApiEndpoint('/tours'), { cache: 'no-store' })
                if (res.ok) {
                    const data = await res.json()
                    setTours(data)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchTours()
    }, [])

    return (
        <>
            <PageHeader
                title="Tours"
                description="Explore Goose's concert tours and performances"
                loggedInMessage="Browse tours and discover performances across different tours."
            />
            <div className="max-w-7xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 animate-pulse" />
                        ))}
                    </div>
                ) : tours.length === 0 ? (
                    <div className="p-12 border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-center">
                        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            No tours recorded yet. Populate tour names in shows to enable browsing.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tours.map((tour) => (
                            <Link
                                key={tour.name}
                                href={`/tours/${encodeURIComponent(tour.name)}`}
                                className="block group"
                            >
                                <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 hover:border-[var(--accent-primary)] transition-colors">
                                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-2">
                                        {tour.name}
                                    </h3>
                                    <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                                        Browse shows and performances
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
