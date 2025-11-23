import React from 'react';
import { Song } from '@/types';

interface SongHeaderProps {
    song: Song;
}

export default function SongHeader({ song }: SongHeaderProps) {
    return (
        <div className="bg-[#0a0a0a] text-[#f5f5f5] p-6 rounded-lg shadow-md border border-[#333]">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl font-bold mb-2 uppercase tracking-tighter">
                {song.name}
            </h1>
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#a0a0a0] uppercase tracking-wider mb-1">
                {song.artist}
            </p>
            {song.debut_date && (
                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#707070]">
                    Debut: {song.debut_date}
                </p>
            )}
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#a0a0a0] mt-2">
                Times Played: {song.times_played ?? 0}
            </p>
        </div>
    );
}
