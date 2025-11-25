import React from 'react';
import { Performance } from '@/types';
import PerformanceVoteControl from '@/components/PerformanceVoteControl';

interface TopVersionProps {
    performance: Performance;
}

export default function TopVersion({ performance }: TopVersionProps) {
    const { avg_rating, vote_count, show, position, set_number, notes, id, song } = performance;
    return (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-6 mb-8 space-y-4">
            <div>
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight">
                    Top Version
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                    <a href={`/shows/${show?.date}`} className="hover:text-[var(--accent-tertiary)] transition-colors">
                        {show?.date} – {show?.venue}, {show?.location}
                    </a>
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    Set {set_number}, Position {position}
                </p>
                {notes && <p className="text-xs text-[var(--text-tertiary)] mt-2 italic">{notes}</p>}
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-[var(--border-subtle)]">
                <div>
                    <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Average Rating</p>
                    <p className="text-4xl font-bold text-[var(--accent-tertiary)]">
                        {avg_rating?.toFixed(1) ?? 'N/A'}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Total Votes</p>
                    <p className="text-2xl font-bold text-[var(--text-secondary)]">{vote_count ?? 0}</p>
                </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)]">
                <PerformanceVoteControl performanceId={id} songName={song?.name} />
            </div>
        </div>
    );
}
