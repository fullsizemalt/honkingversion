import React from 'react'
import { Play, Crown } from 'lucide-react';
import { Performance } from '@/types'
import PerformanceVoteControl from './PerformanceVoteControl'
import HonkingVersionBadge from './HonkingVersionBadge'
import Link from 'next/link'

interface TopVersionsProps {
    performances: Performance[]
    maxVersions?: number
}

export default function TopVersions({ performances, maxVersions = 5 }: TopVersionsProps) {
    // Filter for rated performances and sort by rating
    const ratedPerfs = performances
        .filter(p => p.avg_rating !== null && p.avg_rating !== undefined)
        .sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0))
        .slice(0, maxVersions)

    if (ratedPerfs.length === 0) {
        return null
    }

    const topTwoIds = ratedPerfs.slice(0, 2).map((p) => p.id)

    return (
        <div className="space-y-6">
            <div className="pb-3 border-b border-[var(--border)]">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight">
                    Top Versions
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Highest-rated performances of this song
                </p>
                {topTwoIds.length === 2 && (
                    <Link
                        href={`/performance-comparisons?ids=${topTwoIds.join(',')}`}
                        className="text-xs text-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] hover:underline"
                    >
                        Compare top 2
                    </Link>
                )}
            </div>

            <div className="grid gap-4">
                {ratedPerfs.map((perf, index) => (
                    <div
                        key={perf.id}
                        className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-6 space-y-4"
                    >
                        {/* Rank Badge and Rating */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                {/* Rank Badge */}
                                <div className="flex-shrink-0">
                                    {index === 0 ? (
                                        <div className="w-10 h-10 rounded-full bg-[var(--accent-tertiary)] flex items-center justify-center">
                                            <span className="font-bold text-[var(--text-inverse)]"><Crown className="w-4 h-4" /></span>
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-[var(--border-subtle)] flex items-center justify-center">
                                            <span className="font-bold text-[var(--text-primary)]">#{index + 1}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Show Details */}
                                <div className="flex-1">
                                    <a
                                        href={`/shows/${perf.show?.date}`}
                                        className="text-lg font-semibold text-[var(--text-primary)] hover:text-[var(--accent-tertiary)] transition-colors"
                                    >
                                        {perf.show?.date}
                                    </a>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        {perf.show?.venue}, {perf.show?.location}
                                    </p>
                                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                        Set {perf.set_number}, Position {perf.position}
                                        {perf.notes && ` • ${perf.notes}`}
                                    </p>
                                </div>
                            </div>

                            {/* Rating Display and Honking Badge */}
                            <div className="text-right flex-shrink-0 space-y-2">
                                <div className="flex justify-end">
                                    <Link
                                        href={`/performance-comparisons?ids=${perf.id}`}
                                        className="text-[var(--accent-primary)] text-xs font-[family-name:var(--font-ibm-plex-mono)] hover:underline"
                                    >
                                        Compare
                                    </Link>
                                </div>
                                <div className="text-4xl font-bold text-[var(--accent-tertiary)]">
                                    {perf.avg_rating?.toFixed(1)}
                                </div>
                                <p className="text-xs text-[var(--text-tertiary)]">
                                    {perf.vote_count} {perf.vote_count === 1 ? 'vote' : 'votes'}
                                </p>
                                {perf.is_honking_version && (
                                    <HonkingVersionBadge
                                        compact={true}
                                        isHonkingVersion={true}
                                        honkingVoteCount={perf.honking_vote_count}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Honking Version Info or Vote Control */}
                        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                            {perf.is_honking_version && (
                                <div className="p-3 bg-[var(--accent-primary)] bg-opacity-10 border border-[var(--accent-primary)] border-opacity-30 rounded text-center">
                                    <p className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-wider">
                                        <span className="flex items-center gap-2"><Crown className="w-4 h-4" /> THE HONKING VERSION</span>
                                    </p>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                                        {perf.honking_vote_count ?? 0} {perf.honking_vote_count === 1 ? 'person' : 'people'} voted this as "the one"
                                    </p>
                                </div>
                            )}
                            <PerformanceVoteControl
                                performanceId={perf.id}
                                songName={perf.song?.name || 'Performance'}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
