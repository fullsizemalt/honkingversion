import React from 'react'
import { Performance } from '@/types'

interface PerformanceStatsProps {
    performances: Performance[]
}

export default function PerformanceStats({ performances }: PerformanceStatsProps) {
    // Calculate statistics
    const ratedPerfs = performances.filter(p => p.avg_rating !== null && p.avg_rating !== undefined)
    const totalVotes = performances.reduce((sum, p) => sum + (p.vote_count || 0), 0)
    const avgRating = ratedPerfs.length > 0
        ? ratedPerfs.reduce((sum, p) => sum + (p.avg_rating || 0), 0) / ratedPerfs.length
        : null
    const highestRated = ratedPerfs.length > 0
        ? Math.max(...ratedPerfs.map(p => p.avg_rating || 0))
        : null
    const lowestRated = ratedPerfs.length > 0
        ? Math.min(...ratedPerfs.map(p => p.avg_rating || 0))
        : null

    // Venue frequency
    const venueCount: Record<string, number> = {}
    performances.forEach(p => {
        if (p.show?.venue) {
            venueCount[p.show.venue] = (venueCount[p.show.venue] || 0) + 1
        }
    })
    const topVenues = Object.entries(venueCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)

    // Year distribution
    const yearCount: Record<string, number> = {}
    performances.forEach(p => {
        if (p.show?.date) {
            const year = new Date(p.show.date).getFullYear().toString()
            yearCount[year] = (yearCount[year] || 0) + 1
        }
    })
    const years = Object.entries(yearCount)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))

    return (
        <div className="space-y-6">
            <div className="pb-3 border-b border-[var(--border)]">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight">
                    Performance Statistics
                </h2>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Performances */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-4">
                    <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Total Performances</p>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{performances.length}</p>
                </div>

                {/* Total Votes */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-4">
                    <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Total Votes</p>
                    <p className="text-3xl font-bold text-[var(--accent-tertiary)]">{totalVotes}</p>
                </div>

                {/* Rated Performances */}
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-4">
                    <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Rated Perf.</p>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{ratedPerfs.length}</p>
                    {performances.length > 0 && (
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                            {Math.round((ratedPerfs.length / performances.length) * 100)}% rated
                        </p>
                    )}
                </div>

                {/* Average Rating */}
                {avgRating !== null ? (
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-4">
                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Avg Rating</p>
                        <p className="text-3xl font-bold text-[var(--accent-tertiary)]">{avgRating.toFixed(1)}</p>
                        {highestRated && lowestRated && (
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                {lowestRated.toFixed(1)} – {highestRated.toFixed(1)}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-4">
                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Avg Rating</p>
                        <p className="text-lg font-semibold text-[var(--text-tertiary)]">No ratings</p>
                    </div>
                )}
            </div>

            {/* Top Venues */}
            {topVenues.length > 0 && (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-6 space-y-4">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] uppercase tracking-tight">
                        Most Frequent Venues
                    </h3>
                    <div className="space-y-3">
                        {topVenues.map(([venue, count], index) => (
                            <div key={venue} className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] last:border-b-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-sm font-bold text-[var(--text-inverse)]">
                                        {index + 1}
                                    </div>
                                    <p className="text-[var(--text-primary)] font-semibold">{venue}</p>
                                </div>
                                <span className="text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                                    {count} {count === 1 ? 'show' : 'shows'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Year Distribution */}
            {years.length > 0 && (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-6 space-y-4">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] uppercase tracking-tight">
                        Performance History
                    </h3>
                    <div className="space-y-3">
                        {years.map(([year, count]) => (
                            <div key={year} className="flex items-center justify-between">
                                <p className="text-[var(--text-primary)] font-semibold">{year}</p>
                                <div className="flex items-center gap-3 flex-1 ml-4">
                                    <div className="flex-1 bg-[var(--bg-primary)] rounded h-6 overflow-hidden">
                                        <div
                                            className="bg-[var(--accent-tertiary)] h-full transition-all"
                                            style={{
                                                width: `${(count / Math.max(...years.map(y => y[1]))) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <span className="text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm w-12 text-right">
                                        {count}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
