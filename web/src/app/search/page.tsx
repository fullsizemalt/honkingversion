'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getApiEndpoint } from '@/lib/api';

interface SearchResults {
    songs: Array<{
        name: string;
        slug: string;
        artist: string;
    }>;
    shows: Array<{
        date: string;
        venue: string;
        location: string;
    }>;
    venues: any[];
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState<SearchResults | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query) {
            const fetchResults = async () => {
                setLoading(true);
                try {
                    const res = await fetch(getApiEndpoint(`/search?q=${encodeURIComponent(query)}`));
                    if (res.ok) {
                        const data = await res.json();
                        setResults(data);
                    }
                } catch (error) {
                    console.error('Search failed', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchResults();
        }
    }, [query]);

    if (!query) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Search HonkingVersion</h1>
                <p className="text-[#aaa]">Enter a song, venue, or date to search.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">
                Results for <span className="text-[#00d9ff]">"{query}"</span>
            </h1>

            {loading ? (
                <div className="text-[#aaa]">Searching...</div>
            ) : (
                <div className="space-y-8">
                    {/* Songs Section */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 border-b border-[#333] pb-2">Songs</h2>
                        {results?.songs.length ? (
                            <div className="grid gap-2">
                                {results.songs.map((song) => (
                                    <Link
                                        key={song.slug}
                                        href={`/songs/${song.slug}`}
                                        className="block p-3 bg-[#111] rounded hover:bg-[#222] transition-colors"
                                    >
                                        <div className="font-bold">{song.name}</div>
                                        <div className="text-sm text-[#777]">{song.artist}</div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#777]">No songs found.</p>
                        )}
                    </section>

                    {/* Shows Section */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 border-b border-[#333] pb-2">Shows</h2>
                        {results?.shows.length ? (
                            <div className="grid gap-2">
                                {results.shows.map((show) => (
                                    <Link
                                        key={show.date}
                                        href={`/shows/${show.date}`}
                                        className="block p-3 bg-[#111] rounded hover:bg-[#222] transition-colors"
                                    >
                                        <div className="font-bold">{show.date}</div>
                                        <div className="text-sm text-[#aaa]">{show.venue}</div>
                                        <div className="text-xs text-[#777]">{show.location}</div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#777]">No shows found.</p>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}
