'use client'

import { useEffect, useState } from 'react'
import { getApiEndpoint } from '@/lib/api'
import { StatsResponse } from '@/types'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { BarChart } from '@/components/charts/BarChart'
import { TrendChart } from '@/components/charts/TrendChart'
import { VelocityBadge } from '@/components/VelocityBadge'

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
                        {stats.trending_performances.map((p, idx) => {
                            // Mock trend data for visualization since API doesn't return history yet
                            // In a real implementation, this would come from the API
                            const mockTrendData = Array.from({ length: 7 }, (_, i) => ({
                                timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
                                value: Math.max(10, Math.floor(Math.random() * 50) + (i * 5)) // Upward trend
                            }));

                            // Determine velocity based on index for demo purposes
                            const velocity = idx === 0 ? 'fast' : idx < 3 ? 'rising' : 'steady';

                            return (
                                <div key={p.performance_id} className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-4 last:border-none last:pb-0 group">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[var(--accent-primary)] font-bold">#{idx + 1}</span>
                                            <div className="font-bold truncate">{p.song_name}</div>
                                            <VelocityBadge velocity={velocity} />
                                        </div>
                                        <div className="text-xs text-[var(--text-secondary)] pl-6">{p.date} @ {p.venue}</div>
                                    </div>

                                    <div className="flex items-center gap-6 mt-3 md:mt-0">
                                        {/* Trend Chart */}
                                        <div className="hidden sm:block w-32 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
                                            <TrendChart
                                                data={mockTrendData}
                                                width={128}
                                                height={40}
                                                color={velocity === 'fast' ? '#ff6b35' : velocity === 'rising' ? '#1fc77b' : '#f7931e'}
                                                showDots={false}
                                            />
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] min-w-[140px] justify-end">
                                            <div className="text-right">
                                                <div className="text-[var(--text-primary)] font-bold">{p.votes_last_30d} votes</div>
                                                <div className="text-[10px] text-[var(--text-tertiary)]">Last 30d</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[var(--text-primary)] font-bold">{p.avg_rating ? p.avg_rating.toFixed(1) : '-'}</div>
                                                <div className="text-[10px] text-[var(--text-tertiary)]">Rating</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
