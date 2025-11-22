import Link from 'next/link';
import { Song } from '@/types';

interface SongCardProps {
    song: Song;
}

export default function SongCard({ song }: SongCardProps) {
    return (
        <Link
            href={`/songs/${song.slug}`}
            className="block group"
        >
            <div className="border border-[#333] bg-[#1a1a1a] p-4 hover:bg-[#252525] transition-colors h-full">
                {/* Song name - big and bold */}
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[#f5f5f5] group-hover:text-[#ff6b35] transition-colors mb-3 uppercase tracking-tight">
                    {song.name}
                </h3>

                {/* Cover badge if applicable */}
                {song.is_cover && song.original_artist && (
                    <div className="inline-block px-2 py-1 bg-[#b565d8] font-[family-name:var(--font-ibm-plex-mono)] text-[9px] font-bold uppercase mb-3">
                        {song.original_artist}
                    </div>
                )}

                {/* Stats in monospace */}
                <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[11px] text-[#a0a0a0] space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="text-[#ff6b35]">▸</span>
                        <span>Played {song.times_played} {song.times_played === 1 ? 'time' : 'times'}</span>
                    </div>
                    {song.avg_rating && (
                        <div className="flex items-center gap-2">
                            <span className="text-[#ffd700]">★</span>
                            <span>Avg rating: {song.avg_rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {song.debut_date && (
                    <div className="mt-3 pt-3 border-t border-[#333] font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[#707070] uppercase tracking-wider">
                        Debut: {song.debut_date}
                    </div>
                )}
            </div>
        </Link>
    );
}
