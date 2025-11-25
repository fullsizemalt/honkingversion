import Link from 'next/link';
import { Song } from '@/types';

interface SongCardProps {
    song: Song;
}

export default function SongCard({ song }: SongCardProps) {
    const isCover = song.is_cover && song.original_artist;

    return (
        <Link
            href={`/songs/${song.slug}`}
            className="block group h-full"
        >
            <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-5 hover:bg-[var(--bg-muted)] hover:border-[var(--accent-tertiary)] transition-all h-full space-y-4">
                {/* Header with Song Name and Badge */}
                <div className="space-y-2">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-tertiary)] transition-colors uppercase tracking-tight">
                        {song.name}
                    </h3>

                    {/* Cover Badge */}
                    {isCover && (
                        <div className="inline-flex items-center gap-1">
                            <div className="inline-block px-2.5 py-1 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-[family-name:var(--font-ibm-plex-mono)] text-[10px] font-bold uppercase tracking-wider">
                                Cover
                            </div>
                            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)]">
                                {song.original_artist}
                            </p>
                        </div>
                    )}
                </div>

                {/* Artist Attribution for Originals */}
                {!isCover && song.artist && (
                    <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
                        By {song.artist}
                    </p>
                )}

                {/* Stats */}
                <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                    {/* Times Played */}
                    <div className="flex items-center justify-between">
                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
                            Played
                        </span>
                        <span className="font-bold text-[var(--text-primary)]">
                            {song.times_played ?? 0}
                        </span>
                    </div>

                    {/* Rating */}
                    {song.avg_rating !== null && song.avg_rating !== undefined ? (
                        <div className="flex items-center justify-between">
                            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
                                Avg Rating
                            </span>
                            <span className="font-bold text-[var(--accent-tertiary)]">
                                {song.avg_rating.toFixed(1)}/10
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
                                Rating
                            </span>
                            <span className="text-xs text-[var(--text-tertiary)]">No ratings</span>
                        </div>
                    )}
                </div>

                {/* Debut Date Footer */}
                {song.debut_date && (
                    <div className="pt-2 border-t border-[var(--border-subtle)]">
                        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
                            Debut: {new Date(song.debut_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        </p>
                    </div>
                )}
            </div>
        </Link>
    );
}
