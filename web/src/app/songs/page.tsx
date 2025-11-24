'use client';

import { useEffect, useState } from 'react';
import SongCard from '@/components/SongCard';
import { Song } from '@/types';
import { getApiEndpoint } from '@/lib/api';
import PageHeader from '@/components/PageHeader';

export default function SongsPage() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSongs = async () => {
            try {
                const res = await fetch(getApiEndpoint('/songs/'), {
                    cache: 'no-store'
                });
                if (res.ok) {
                    const data = await res.json();
                    setSongs(data);
                }
            } catch (e) {
                console.error("Failed to fetch songs", e);
            } finally {
                setLoading(false);
            }
        };
        getSongs();
    }, []);

    // Separate originals and covers
    const originals = songs.filter(s => !s.is_cover);
    const covers = songs.filter(s => s.is_cover);

    return (
        <>
            <PageHeader
                title="Songs"
                description="Browse all Goose songs and their performances"
                loggedInMessage="Explore original songs and covers performed by Goose."
            />

            <div className="max-w-7xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Originals */}
                        {originals.length > 0 && (
                            <div className="mb-12">
                                <div className="mb-6 pb-3 border-b border-[var(--border)]">
                                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight inline-block">
                                        Originals
                                    </h2>
                                    <span className="ml-4 font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                                        {originals.length} songs
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {originals.map((song) => (
                                        <SongCard key={song.id} song={song} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Covers */}
                        {covers.length > 0 && (
                            <div>
                                <div className="mb-6 pb-3 border-b border-[var(--border)]">
                                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight inline-block">
                                        Covers
                                    </h2>
                                    <span className="ml-4 font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                                        {covers.length} songs
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {covers.map((song) => (
                                        <SongCard key={song.id} song={song} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {songs.length === 0 && (
                            <div className="p-12 border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-center">
                                <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                                    No songs found. Check that the API is running.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
