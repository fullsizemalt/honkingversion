import React from 'react';
import { Song } from '@/types';

interface SongHeaderProps {
    song: Song;
}

export default function SongHeader({ song }: SongHeaderProps) {
    return (
        <div className="bg-[var(--bg-secondary)] text-[var(--text-primary)] p-6 shadow-[0_35px_55px_rgba(23,20,10,0.12)] border border-[var(--border)]">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl font-bold mb-2 uppercase tracking-tight">
                {song.name}
            </h1>
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)] uppercase tracking-[0.35em] mb-1">
                {song.artist}
            </p>
            {song.debut_date && (
                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)]">
                    Debut: {song.debut_date}
                </p>
            )}
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)] mt-2">
                Times Played: {song.times_played ?? 0}
            </p>
        </div>
    );
}
