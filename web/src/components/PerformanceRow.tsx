import React from 'react';
import PerformanceVoteControl from '@/components/PerformanceVoteControl';

interface PerformanceRowProps {
    performance: {
        id: number;
        avg_rating?: number | null;
        vote_count?: number;
        show: { date: string; venue: string; location: string };
        position?: number;
        set_number?: number;
        notes?: string;
    };
}

export default function PerformanceRow({ performance }: PerformanceRowProps) {
    const { id, avg_rating, vote_count, show, position, set_number, notes } = performance;
    return (
        <div className="bg-[#111] text-[#ddd] p-4 rounded-md border border-[#333] mb-3">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-[#aaa]">Show: {show.date} – {show.venue}, {show.location}</p>
                    <p className="text-xs text-[#777]">Set {set_number}, Position {position}</p>
                    {notes && <p className="text-xs text-[#555] mt-1">{notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{avg_rating ?? '—'}</span>
                    <span className="text-xs text-[#aaa]">({vote_count ?? 0})</span>
                </div>
            </div>
            <PerformanceVoteControl performanceId={id} initialRating={avg_rating} />
        </div>
    );
}
