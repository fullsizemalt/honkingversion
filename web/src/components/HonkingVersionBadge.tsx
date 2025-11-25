'use client'

import React from 'react'
import { Crown } from 'lucide-react';

interface HonkingVersionBadgeProps {
    honkingVoteCount?: number
    isHonkingVersion?: boolean
    compact?: boolean
}

export default function HonkingVersionBadge({
    honkingVoteCount,
    isHonkingVersion,
    compact = false
}: HonkingVersionBadgeProps) {
    if (!isHonkingVersion && (!honkingVoteCount || honkingVoteCount === 0)) {
        return null
    }

    if (compact) {
        return (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--accent-primary)] text-[var(--text-inverse)] rounded text-xs font-bold">
                {isHonkingVersion && <span className="flex items-center gap-1"><Crown className="w-3 h-3" /> HONK</span>}
                {honkingVoteCount !== undefined && honkingVoteCount > 0 && (
                    <span>({honkingVoteCount})</span>
                )}
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary)] bg-opacity-10 border-l-4 border-[var(--accent-primary)] rounded">
            <div className="text-2xl"><Crown className="w-8 h-8" /></div>
            <div className="flex-1">
                {isHonkingVersion && (
                    <div>
                        <p className="text-sm font-bold text-[var(--accent-primary)] uppercase tracking-wider">
                            The Honking Version
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                            The community voted this as the definitive version of this song
                        </p>
                    </div>
                )}
                {honkingVoteCount !== undefined && honkingVoteCount > 0 && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                        <span className="font-bold text-[var(--accent-primary)]">{honkingVoteCount}</span> {honkingVoteCount === 1 ? 'person' : 'people'} voted this as their honking version
                    </p>
                )}
            </div>
        </div>
    )
}
