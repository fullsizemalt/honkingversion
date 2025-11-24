'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader'
import Link from 'next/link'
import { getApiEndpoint } from '@/lib/api'

export default function YearsPage() {
    const [years, setYears] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const res = await fetch(getApiEndpoint('/shows/years'), { cache: 'no-store' })
                if (res.ok) {
                    const data = await res.json()
                    setYears(data.sort((a: string, b: string) => b.localeCompare(a)))
                }
            } finally {
                setLoading(false)
            }
        }
        fetchYears()
    }, [])

    return (
        <>
            <PageHeader
                title="Years"
                description="Browse shows and performances by year"
                loggedInMessage="Select a year to explore all shows and performances from that time."
            />
            <div className="max-w-7xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 animate-pulse" />
                        ))}
                    </div>
                ) : years.length === 0 ? (
                    <div className="p-12 border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-center">
                        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            No years available.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {years.map((year) => (
                            <Link
                                key={year}
                                href={`/years/${year}`}
                                className="block group"
                            >
                                <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-center hover:border-[var(--accent-primary)] transition-colors group">
                                    <div className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                                        {year}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
