import Link from 'next/link';
import { Performance } from '@/types';

interface PerformanceCardProps {
    performance: Performance;
}

export default function PerformanceCard({ performance }: PerformanceCardProps) {
    const setName = performance.set_number === 3 ? 'ENC' : `S${performance.set_number}`;

    return (
        <Link
            href={`/performances/${performance.id}`}
            className="block group"
        >
            <div className="border border-[#333] bg-[#1a1a1a] p-4 hover:border-[#ff6b35] transition-colors relative overflow-hidden h-full">
                {/* Sharp accent bar on left */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Monospace metadata header */}
                <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[#a0a0a0] mb-3 uppercase tracking-widest flex items-center justify-between">
                    <span>{setName} • #{performance.position}</span>
                    <span>{performance.show.date}</span>
                </div>

                {/* Bold song name */}
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[#f5f5f5] mb-2 group-hover:text-[#ff6b35] transition-colors uppercase tracking-tight">
                    {performance.song.name}
                </h3>

                {/* Cover badge if applicable */}
                {performance.song.is_cover && performance.song.original_artist && (
                    <div className="inline-block px-2 py-0.5 bg-[#b565d8] font-[family-name:var(--font-ibm-plex-mono)] text-[9px] font-bold uppercase mb-2">
                        {performance.song.original_artist}
                    </div>
                )}

                {/* Venue in mono */}
                <div className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0] mb-3">
                    <div className="font-medium text-[#f5f5f5]">{performance.show.venue}</div>
                    <div className="text-[10px]">{performance.show.location}</div>
                </div>

                {/* Rating with sharp design */}
                <div className="pt-3 border-t border-[#333] flex items-center justify-between">
                    {performance.avg_rating ? (
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-7 bg-[#ff6b35] flex items-center justify-center font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold text-[#0a0a0a]">
                                {performance.avg_rating}
                            </div>
                            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[#707070]">
                                ({performance.vote_count} {performance.vote_count === 1 ? 'vote' : 'votes'})
                            </span>
                        </div>
                    ) : (
                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[#707070] uppercase">
                            No votes yet
                        </span>
                    )}
                </div>

                {performance.notes && (
                    <div className="mt-2 pt-2 border-t border-[#222] font-[family-name:var(--font-ibm-plex-mono)] text-[10px] italic text-[#707070]">
                        {performance.notes}
                    </div>
                )}
            </div>
        </Link>
    );
}
