import React from 'react';
import { Performance } from '@/types';
import PerformanceVoteControl from '@/components/PerformanceVoteControl';

interface TopVersionProps {
    performance: Performance;
}

export default function TopVersion({ performance }: TopVersionProps) {
    const { avg_rating, vote_count, show, position, set_number, notes, id, song } = performance;
    return (
        <div className="bg-[#111] text-[#eee] p-6 shadow-lg border border-[#333] mb-6">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-3xl font-bold mb-3">
                Top Version
            </h2>
            <p className="text-sm text-[#aaa] mb-2">
                Show: {show?.date} – {show?.venue}, {show?.location}
            </p>
            <p className="text-sm text-[#aaa] mb-2">
                Set {set_number}, Position {position}
            </p>
            {notes && <p className="text-xs text-[#777] mb-3">{notes}</p>}
            <div className="flex items-center gap-4 mb-3">
                <span className="font-bold text-lg">Avg Rating: {avg_rating ?? 'N/A'}</span>
                <span className="text-sm">Votes: {vote_count}</span>
            </div>
            <PerformanceVoteControl performanceId={id} songName={song?.name} />
        </div>
    );
}
