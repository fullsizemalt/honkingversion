import SongCard from '@/components/SongCard';
import { Song } from '@/types';
import { getApiEndpoint } from '@/lib/api';

async function getSongs(): Promise<Song[]> {
    try {
        const res = await fetch(getApiEndpoint('/songs/'), {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error("Failed to fetch songs", e);
        return [];
    }
}

export default async function SongsPage() {
    const songs = await getSongs();

    // Separate originals and covers
    const originals = songs.filter(s => !s.is_cover);
    const covers = songs.filter(s => s.is_cover);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Header */}
            <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="relative pl-4">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-tertiary)] rounded-full" />
                        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-2 uppercase tracking-tight">
                            SONGS
                        </h1>
                        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] uppercase tracking-[0.35em]">
                            Browse all Goose songs and their performances
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Originals */}
                {originals.length > 0 && (
                    <div className="mb-12">
                        <div className="mb-4 pb-2 border-b border-[var(--border)]">
                            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-[0.35em] inline-block">
                                Originals
                            </h2>
                            <span className="ml-3 font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)]">
                                ({originals.length})
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {originals.map((song) => (
                                <SongCard key={song.id} song={song} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Covers */}
                {covers.length > 0 && (
                    <div>
                        <div className="mb-4 pb-2 border-b border-[var(--border)]">
                            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-[0.35em] inline-block">
                                Covers
                            </h2>
                            <span className="ml-3 font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)]">
                                ({covers.length})
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {covers.map((song) => (
                                <SongCard key={song.id} song={song} />
                            ))}
                        </div>
                    </div>
                )}

                {songs.length === 0 && (
                    <div className="text-center py-12 border border-[var(--border)] bg-[var(--bg-secondary)] rounded-3xl">
                        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] uppercase tracking-[0.35em]">
                            No songs found. Check that the API is running.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
