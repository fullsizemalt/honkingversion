import React from 'react';
import PerformanceVoteControl from '@/components/PerformanceVoteControl';
import PerformanceTags from './PerformanceTags';

interface PerformanceRowProps {
    performance: {
        id: number;
        avg_rating?: number | null;
        vote_count?: number;
        song?: { name: string };
        show: { date: string; venue: string; location: string };
        position?: number;
        set_number?: number;
        notes?: string;
    };
}

export default function PerformanceRow({ performance }: PerformanceRowProps) {
    const { id, avg_rating, vote_count, song, show, position, set_number, notes } = performance;
    return (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-4 space-y-3">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <p className="text-sm text-[var(--text-secondary)]">
                        <a href={`/shows/${show.date}`} className="hover:text-[var(--accent-tertiary)] transition-colors">
                            {show.date} – {show.venue}, {show.location}
                        </a>
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">Set {set_number}, Position {position}</p>
                    {notes && <p className="text-xs text-[var(--text-tertiary)] mt-2 italic">{notes}</p>}
                    <div className="mt-3">
                        <PerformanceTags performanceId={id} />
                    </div>
                </div>
                {avg_rating !== null && (
                    <div className="text-right">
                        <div className="text-2xl font-bold text-[var(--accent-tertiary)]">{avg_rating.toFixed(1)}</div>
                        <p className="text-xs text-[var(--text-tertiary)]">{vote_count ?? 0} votes</p>
                    </div>
                )}
            </div>
            <div className="pt-3 border-t border-[var(--border-subtle)]">
                <PerformanceVoteControl performanceId={id} songName={song?.name || 'Performance'} />
            </div>
        </div>
    );
}
