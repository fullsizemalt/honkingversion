'use client'

import { useEffect, useState } from 'react'
import { getApiEndpoint } from '@/lib/api'
import { StatsResponse } from '@/types'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { BarChart } from '@/components/charts/BarChart'

async function fetchStats(): Promise<StatsResponse | null> {
    try {
        const res = await fetch(getApiEndpoint('/stats'), { cache: 'no-store' })
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

export default function StatsPage() {
    const [stats, setStats] = useState<StatsResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const loadStats = async () => {
            const data = await fetchStats()
            if (data) {
                setStats(data)
            } else {
                setError(true)
            }
            setLoading(false)
        }
        loadStats()
    }, [])

    if (loading) {
        return (
            <>
                <PageHeader
                    title="Trending"
                    description="Community activity and performance trends"
                />
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)]">
                        Loading stats...
                    </div>
                </div>
            </>
        )
    }

    if (!stats || error) {
        return (
            <>
                <PageHeader
                    title="Trending"
                    description="Community activity and performance trends"
                />
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="p-8 border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            Failed to load stats. Please try again later.
                        </p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <PageHeader
                title="Trending"
                description="Community activity and performance trends"
                loggedInMessage="Discover what's trending in the community."
            />
            <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                        <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight">Top Songs</h2>
                        <BarChart
                            data={stats.top_songs.slice(0, 5).map(s => ({
                                label: s.name,
                                value: s.plays,
                                href: `/songs/${s.slug}`,
                                color: 'var(--accent-primary)'
                            }))}
                            valueFormatter={(v) => `${v} plays`}
                        />
                        <div className="mt-4 text-right">
                            <Link href="/songs" className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] hover:underline">View All Songs →</Link>
                        </div>
                    </div>

                    <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                        <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight">Top Venues</h2>
                        <BarChart
                            data={stats.top_venues.slice(0, 5).map(v => ({
                                label: v.venue,
                                value: v.show_count,
                                color: 'var(--accent-secondary)'
                            }))}
                            valueFormatter={(v) => `${v} shows`}
                        />
                        <div className="mt-4 text-right">
                            <Link href="/venues" className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] hover:underline">View All Venues →</Link>
                        </div>
                    </div>
                </section>

                <section className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight">Trending Performances (Last 30 Days)</h2>
                    <div className="space-y-4">
                        {stats.trending_performances.map((p) => (
                            <div key={p.performance_id} className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4 last:border-none last:pb-0">
                                <div>
                                    <div className="font-bold">{p.song_name}</div>
                                    <div className="text-xs text-[var(--text-secondary)] mt-1">{p.date} @ {p.venue}</div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] mt-2 md:mt-0 font-[family-name:var(--font-ibm-plex-mono)]">
                                    <span>{p.votes_last_30d} votes</span>
                                    <span>{p.avg_rating ? `${p.avg_rating.toFixed(1)}/10` : 'N/A'}</span>
                                </div>
                            </div>
                        ))}
                        {stats.trending_performances.length === 0 && (
                            <div className="text-sm text-[var(--text-secondary)]">No recent activity.</div>
                        )}
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                        <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight">Most Active Voters</h2>
                        <div className="space-y-3">
                            {stats.leaderboards.votes_cast.map((u, idx) => (
                                <div key={u.username} className="flex items-center justify-between text-sm text-[var(--text-primary)]">
                                    <div className="flex items-center gap-3">
                                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[var(--text-secondary)] font-bold">#{idx + 1}</span>
                                        <span>{u.username}</span>
                                    </div>
                                    <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)]">{u.votes} votes</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                        <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight">Most Followed Users</h2>
                        <div className="space-y-3">
                            {stats.leaderboards.followers.map((u, idx) => (
                                <div key={u.username} className="flex items-center justify-between text-sm text-[var(--text-primary)]">
                                    <div className="flex items-center gap-3">
                                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[var(--text-secondary)] font-bold">#{idx + 1}</span>
                                        <span>{u.username}</span>
                                    </div>
                                    <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)]">{u.followers} followers</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
