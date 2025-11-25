import React from 'react';
import PerformanceVoteControl from '@/components/PerformanceVoteControl';
import HonkingVersionBadge from '@/components/HonkingVersionBadge';
import PerformanceTags from './PerformanceTags';
import Link from 'next/link';

interface PerformanceRowProps {
    performance: {
        id: number;
        avg_rating?: number | null;
        vote_count?: number;
        honking_vote_count?: number;
        is_honking_version?: boolean;
        song?: { name: string };
        show: { date: string; venue: string; location: string };
        position?: number;
        set_number?: number;
        notes?: string;
    };
}

export default function PerformanceRow({ performance }: PerformanceRowProps) {
    const { id, avg_rating, vote_count, honking_vote_count, is_honking_version, song, show, position, set_number, notes } = performance;

    // Determine quality badge
    let qualityBadge = null;
    if (avg_rating !== null && avg_rating !== undefined) {
        if (avg_rating >= 8.5) {
            qualityBadge = { label: '★ Exceptional', color: 'bg-[#ffd700] text-[#1a1a1a]' };
        } else if (avg_rating >= 7.5) {
            qualityBadge = { label: '★ Excellent', color: 'bg-[var(--accent-tertiary)] text-[var(--text-inverse)]' };
        } else if (avg_rating >= 6.5) {
            qualityBadge = { label: '★ Great', color: 'bg-[var(--accent-primary)] text-[var(--text-inverse)]' };
        } else if (avg_rating >= 5.0) {
            qualityBadge = { label: '✓ Good', color: 'bg-[var(--border-subtle)] text-[var(--text-primary)]' };
        }
    }

    return (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-4 space-y-3 hover:border-[var(--accent-tertiary)] transition-colors">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                    {/* Show Link */}
                    <p className="text-sm text-[var(--text-secondary)] font-semibold">
                        <a href={`/shows/${show.date}`} className="hover:text-[var(--accent-tertiary)] transition-colors">
                            {show.date}
                        </a>
                    </p>

                    {/* Venue and Location */}
                    <p className="text-xs text-[var(--text-tertiary)]">
                        {show.venue}, {show.location}
                    </p>

                    {/* Set and Position */}
                    <p className="text-xs text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)]">
                        Set {set_number} • Position {position}
                    </p>

                    {/* Notes */}
                    {notes && (
                        <p className="text-xs text-[var(--text-tertiary)] italic border-l-2 border-[var(--accent-primary)] pl-2">
                            {notes}
                        </p>
                    )}

                    {/* Tags */}
                    <div className="mt-2">
                        <PerformanceTags performanceId={id} />
                    </div>
                </div>

                {/* Right Side: Rating and Badge */}
                <div className="text-right flex-shrink-0 space-y-2">
                    <div className="flex justify-end">
                        <Link
                            href={`/performance-comparisons?ids=${id}`}
                            className="text-[var(--accent-primary)] text-xs font-[family-name:var(--font-ibm-plex-mono)] hover:underline"
                        >
                            Compare
                        </Link>
                    </div>
                    {/* Rating */}
                    {avg_rating !== null && avg_rating !== undefined && (
                        <div>
                            <div className="text-2xl font-bold text-[var(--accent-tertiary)]">
                                {avg_rating.toFixed(1)}
                            </div>
                            <p className="text-xs text-[var(--text-tertiary)]">
                                {vote_count ?? 0} {vote_count === 1 ? 'vote' : 'votes'}
                            </p>
                        </div>
                    )}

                    {/* Quality Badge */}
                    {qualityBadge && (
                        <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${qualityBadge.color}`}>
                            {qualityBadge.label}
                        </div>
                    )}

                    {/* Honking Version Badge */}
                    {is_honking_version && (
                        <HonkingVersionBadge
                            compact={true}
                            isHonkingVersion={true}
                            honkingVoteCount={honking_vote_count}
                        />
                    )}
                </div>
            </div>

            {/* Honking Version Info or Vote Control */}
            <div className="pt-3 border-t border-[var(--border-subtle)] space-y-3">
                {is_honking_version && (
                    <div className="p-3 bg-[var(--accent-primary)] bg-opacity-10 border border-[var(--accent-primary)] border-opacity-30 rounded text-center">
                        <p className="text-xs font-bold text-[var(--accent-primary)] uppercase tracking-wider">
                            🦆 THE HONKING VERSION
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                            {honking_vote_count ?? 0} {honking_vote_count === 1 ? 'person' : 'people'} voted this as "the one"
                        </p>
                    </div>
                )}
                <PerformanceVoteControl performanceId={id} songName={song?.name || 'Performance'} />
            </div>
        </div>
    );
}
