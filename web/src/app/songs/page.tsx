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
        <div className="min-h-screen">
            {/* Header */}
            <div className="border-b-2 border-[#333] bg-[#0a0a0a] py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#00d9ff]" />
                        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl font-bold text-[#f5f5f5] mb-2 uppercase tracking-tighter">
                            SONGS
                        </h1>
                        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0] uppercase tracking-wider">
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
                        <div className="mb-4 pb-2 border-b border-[#333]">
                            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f5f5f5] uppercase tracking-tight inline-block">
                                Originals
                            </h2>
                            <span className="ml-3 font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0]">
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
                        <div className="mb-4 pb-2 border-b border-[#333]">
                            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f5f5f5] uppercase tracking-tight inline-block">
                                Covers
                            </h2>
                            <span className="ml-3 font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0]">
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
                    <div className="text-center py-12 border border-[#333] bg-[#1a1a1a]">
                        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#707070] uppercase tracking-wider">
                            No songs found. Check that the API is running.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
