import React from 'react';
import { Song } from '@/types';

interface SongHeaderProps {
    song: Song;
}

export default function SongHeader({ song }: SongHeaderProps) {
    const isCover = song.is_cover && song.original_artist;

    return (
        <div className="space-y-6">
            {/* Main Header */}
            <div className="space-y-3">
                <div className="flex items-start gap-3 flex-wrap">
                    <h1 className="font-[family-name:var(--font-space-grotesk)] text-5xl md:text-6xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
                        {song.name}
                    </h1>
                    {isCover && (
                        <div className="bg-[var(--accent-primary)] text-[var(--text-inverse)] px-3 py-1 rounded text-sm font-bold uppercase tracking-wider mt-2">
                            Cover
                        </div>
                    )}
                </div>

                {/* Artist Attribution */}
                <div className="space-y-2">
                    {isCover ? (
                        <>
                            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-tertiary)] uppercase tracking-[0.35em]">
                                Originally by
                            </p>
                            <p className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-[var(--accent-primary)]">
                                {song.original_artist}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-tertiary)] uppercase tracking-[0.35em]">
                                By
                            </p>
                            <p className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-[var(--text-primary)]">
                                {song.artist || 'Goose'}
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Song Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Times Played */}
                <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded p-4">
                    <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                        Times Played
                    </p>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">
                        {song.times_played ?? 0}
                    </p>
                </div>

                {/* Average Rating */}
                {song.avg_rating !== null && song.avg_rating !== undefined ? (
                    <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded p-4">
                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                            Avg Rating
                        </p>
                        <p className="text-3xl font-bold text-[var(--accent-tertiary)]">
                            {song.avg_rating.toFixed(1)}
                        </p>
                    </div>
                ) : (
                    <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded p-4">
                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                            Rating
                        </p>
                        <p className="text-lg font-semibold text-[var(--text-tertiary)]">
                            No ratings yet
                        </p>
                    </div>
                )}

                {/* Debut Date */}
                {song.debut_date && (
                    <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded p-4">
                        <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                            First Played
                        </p>
                        <p className="text-lg font-semibold text-[var(--text-primary)]">
                            {new Date(song.debut_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                )}

                {/* Song Type */}
                <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded p-4">
                    <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                        Type
                    </p>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">
                        {isCover ? 'Cover' : 'Original'}
                    </p>
                </div>
            </div>
        </div>
    );
}
