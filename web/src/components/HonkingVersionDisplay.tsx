'use client'

import React, { useState } from 'react'
import { Crown } from 'lucide-react';
import Link from 'next/link'
import { HonkingVersionData, Performance } from '@/types'
import HonkingVersionBadge from './HonkingVersionBadge'
import HonkingVersionSelector from './HonkingVersionSelector'

interface HonkingVersionDisplayProps {
    honkingVersionData: HonkingVersionData | null
    songId: number
    performances: Performance[]
}

export default function HonkingVersionDisplay({
    honkingVersionData,
    songId,
    performances
}: HonkingVersionDisplayProps) {
    const [showVotingDialog, setShowVotingDialog] = useState(false)

    if (!honkingVersionData || !honkingVersionData.honking_version) {
        return (
            <div className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary)] bg-opacity-5 border-l-4 border-[var(--accent-primary)] rounded p-8 text-center space-y-4">
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--accent-primary)]">
                    <span className="flex items-center gap-2"><Crown className="w-5 h-5" /> The Honking Version</span>
                </h3>
                <p className="text-[var(--text-secondary)]">
                    This song hasn't been voted on yet. Be the first to crown the definitive version!
                </p>
                <button
                    onClick={() => setShowVotingDialog(true)}
                    className="inline-block px-6 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity"
                >
                    Vote for The One
                </button>
            </div>
        )
    }

    const honkingPerf = honkingVersionData.honking_version
    const honkingPerformance = performances.find(p => p.id === honkingPerf.performance_id)

    if (!honkingPerformance) {
        return null
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-[var(--accent-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] rounded-lg overflow-hidden border border-[var(--accent-primary)] border-opacity-50">
                {/* Header */}
                <div className="bg-[var(--accent-primary)] text-[var(--text-inverse)] px-6 py-4">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold uppercase tracking-tight">
                        <span className="flex items-center gap-2"><Crown className="w-4 h-4" /> The Honking Version</span>
                    </h2>
                    <p className="text-sm opacity-90 mt-1">
                        {honkingPerf.honking_votes} {honkingPerf.honking_votes === 1 ? 'person' : 'people'} voted this as the definitive version
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 bg-[var(--bg-secondary)] space-y-4">
                    {/* Show Details */}
                    <div className="space-y-2">
                        <Link
                            href={`/shows/${honkingPerformance.show?.date}`}
                            className="text-lg font-semibold text-[var(--accent-primary)] hover:underline transition-colors"
                        >
                            {honkingPerformance.show?.date}
                        </Link>
                        <p className="text-sm text-[var(--text-secondary)]">
                            {honkingPerformance.show?.venue}, {honkingPerformance.show?.location}
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)]">
                            Set {honkingPerformance.set_number}, Position {honkingPerformance.position}
                        </p>
                    </div>

                    {/* Performance Notes */}
                    {honkingPerformance.notes && (
                        <div className="pt-3 border-t border-[var(--border-subtle)]">
                            <p className="text-sm text-[var(--text-secondary)] italic">
                                "{honkingPerformance.notes}"
                            </p>
                        </div>
                    )}

                    {/* Stats Row */}
                    <div className="pt-3 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-4">
                        {honkingPerformance.avg_rating !== null && honkingPerformance.avg_rating !== undefined && (
                            <div>
                                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                                    Rating
                                </p>
                                <p className="text-xl font-bold text-[var(--accent-tertiary)]">
                                    {honkingPerformance.avg_rating.toFixed(1)}
                                </p>
                            </div>
                        )}
                        <div>
                            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                                Votes
                            </p>
                            <p className="text-xl font-bold text-[var(--text-primary)]">
                                {honkingPerformance.vote_count || 0}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                                Honked
                            </p>
                            <p className="text-xl font-bold text-[var(--accent-primary)]">
                                {honkingPerf.honking_votes}
                            </p>
                        </div>
                    </div>

                    {/* Vote Button */}
                    <div className="pt-4 border-t border-[var(--border-subtle)]">
                        <button
                            onClick={() => setShowVotingDialog(true)}
                            className="w-full px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity text-sm"
                        >
                            Change Your Vote
                        </button>
                    </div>
                </div>
            </div>

            {/* Voting Dialog Modal */}
            {showVotingDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] mb-4">
                            <span className="flex items-center gap-2"><Crown className="w-4 h-4" /> Vote for The Honking Version</span>
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-6">
                            Which performance best exemplifies this song? Choose the one that captures its true essence.
                        </p>

                        <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto">
                            {performances.map(perf => (
                                <button
                                    key={perf.id}
                                    onClick={() => {
                                        // Selector handles the actual voting
                                        setShowVotingDialog(false)
                                    }}
                                    className={`w-full p-3 rounded border transition-all text-left ${perf.is_honking_version
                                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] bg-opacity-10'
                                        : 'border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                                        }`}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-[var(--text-primary)]">
                                                {perf.show?.date}
                                            </p>
                                            <p className="text-xs text-[var(--text-tertiary)]">
                                                {perf.show?.venue}
                                            </p>
                                        </div>
                                        {perf.is_honking_version && (
                                            <div className="text-[var(--accent-primary)] text-lg">✓</div>
                                        )}
                                    </div>
                                    {perf.honking_vote_count !== undefined && perf.honking_vote_count > 0 && (
                                        <p className="text-xs text-[var(--accent-primary)] font-bold mt-1">
                                            {perf.honking_vote_count} honks
                                        </p>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Voting component - user selects a perf, then we show HonkingVersionSelector */}
                        <div className="space-y-4 p-4 bg-[var(--bg-primary)] rounded border border-[var(--border-subtle)]">
                            <p className="text-xs text-[var(--text-tertiary)]">
                                Select a performance above, then confirm your vote below.
                            </p>
                            <HonkingVersionSelector
                                songId={songId}
                                performanceId={honkingPerf.performance_id}
                                isCurrentHonkingVersion={true}
                            />
                        </div>

                        <button
                            onClick={() => setShowVotingDialog(false)}
                            className="w-full mt-4 px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-bold uppercase tracking-wider rounded hover:border-[var(--accent-primary)] transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
