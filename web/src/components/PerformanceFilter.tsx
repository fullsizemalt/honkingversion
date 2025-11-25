'use client'

import { useState, useMemo } from 'react'
import PerformanceTimeline from './PerformanceTimeline'
import { Performance } from '@/types'

interface PerformanceFilterProps {
    performances: Performance[]
}

type SortOption = 'recent' | 'oldest' | 'highest-rated' | 'lowest-rated' | 'most-voted'

export default function PerformanceFilter({ performances }: PerformanceFilterProps) {
    const [sortBy, setSortBy] = useState<SortOption>('recent')
    const [showRatedOnly, setShowRatedOnly] = useState(false)

    const filteredAndSorted = useMemo(() => {
        let filtered = performances

        // Filter by rating status
        if (showRatedOnly) {
            filtered = filtered.filter(p => p.avg_rating !== null && p.avg_rating !== undefined)
        }

        // Sort
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.show?.date || '').getTime() - new Date(a.show?.date || '').getTime()
                case 'oldest':
                    return new Date(a.show?.date || '').getTime() - new Date(b.show?.date || '').getTime()
                case 'highest-rated':
                    return (b.avg_rating || 0) - (a.avg_rating || 0)
                case 'lowest-rated':
                    return (a.avg_rating || 0) - (b.avg_rating || 0)
                case 'most-voted':
                    return (b.vote_count || 0) - (a.vote_count || 0)
                default:
                    return 0
            }
        })

        return sorted
    }, [performances, sortBy, showRatedOnly])

    return (
        <div className="space-y-6">
            {/* Filter Controls */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                            Sort By
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-tertiary)] transition-colors"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest-rated">Highest Rated</option>
                            <option value="lowest-rated">Lowest Rated</option>
                            <option value="most-voted">Most Voted</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showRatedOnly}
                                onChange={(e) => setShowRatedOnly(e.target.checked)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm font-semibold text-[var(--text-primary)]">
                                Show Rated Only ({filteredAndSorted.length})
                            </span>
                        </label>
                    </div>
                </div>

                {filteredAndSorted.length !== performances.length && (
                    <p className="text-xs text-[var(--text-tertiary)]">
                        Showing {filteredAndSorted.length} of {performances.length} performances
                    </p>
                )}
            </div>

            {/* Performances List */}
            {filteredAndSorted.length > 0 ? (
                <PerformanceTimeline performances={filteredAndSorted} />
            ) : (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-8 text-center">
                    <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                        No performances match your filters.
                    </p>
                </div>
            )}
        </div>
    )
}
