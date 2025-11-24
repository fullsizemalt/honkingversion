import Link from 'next/link';
import { Performance } from '@/types';

interface PerformanceCardProps {
    performance: Performance;
}

export default function PerformanceCard({ performance }: PerformanceCardProps) {
    const setName = performance.set_number === 3 ? 'ENC' : `S${performance.set_number}`;

    return (
        <Link href={`/performances/${performance.id}`} className="block group">
            <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-5 rounded-3xl hover:border-[var(--accent-primary)] hover:shadow-[0_25px_45px_rgba(20,20,20,0.08)] transition-all relative overflow-hidden h-full">
                {/* Sharp accent bar on left */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-primary)] opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Monospace metadata header */}
                <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-secondary)] mb-3 uppercase tracking-[0.35em] flex items-center justify-between">
                    <span>{setName} • #{performance.position}</span>
                    <span>{performance.show.date}</span>
                </div>

                {/* Bold song name */}
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors uppercase tracking-tight">
                    {performance.song.name}
                </h3>

                {/* Cover badge if applicable */}
                {performance.song.is_cover && performance.song.original_artist && (
                    <div className="inline-block px-2 py-0.5 bg-[var(--accent-purple)]/15 text-[var(--accent-purple)] font-[family-name:var(--font-ibm-plex-mono)] text-[9px] font-bold uppercase mb-2 rounded-full">
                        {performance.song.original_artist}
                    </div>
                )}

                {/* Venue in mono */}
                <div className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] mb-3">
                    <div className="font-medium text-[var(--text-primary)]">{performance.show.venue}</div>
                    <div className="text-[10px] text-[var(--text-tertiary)]">{performance.show.location}</div>
                </div>

                {/* Rating with sharp design */}
                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    {performance.avg_rating ? (
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-7 bg-[var(--accent-primary)] flex items-center justify-center font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold text-[var(--text-inverse)] rounded">
                                {performance.avg_rating}
                            </div>
                            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-tertiary)] tracking-[0.35em]">
                                ({performance.vote_count} {performance.vote_count === 1 ? 'vote' : 'votes'})
                            </span>
                        </div>
                    ) : (
                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-tertiary)] uppercase tracking-[0.35em]">
                            No votes yet
                        </span>
                    )}
                </div>

                {performance.notes && (
                    <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] font-[family-name:var(--font-ibm-plex-mono)] text-[10px] italic text-[var(--text-tertiary)]">
                        {performance.notes}
                    </div>
                )}
            </div>
        </Link>
    );
}
