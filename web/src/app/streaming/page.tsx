'use client';

import Link from 'next/link';

interface StreamingService {
    name: string;
    url: string;
    description: string;
    color: string;
}

const streamingServices: StreamingService[] = [
    {
        name: 'Spotify',
        url: 'https://open.spotify.com/search/goose',
        description: 'Stream full shows and songs on Spotify. Search for Goose shows and create playlists.',
        color: '#1DB954',
    },
    {
        name: 'Apple Music',
        url: 'https://music.apple.com/search?term=goose',
        description: 'Listen to Goose on Apple Music. Available on all Apple devices with offline download.',
        color: '#FC3C44',
    },
    {
        name: 'YouTube',
        url: 'https://www.youtube.com/search?q=goose+live',
        description: 'Watch full live performances on YouTube. Many shows have official and fan recordings.',
        color: '#FF0000',
    },
    {
        name: 'Nugs.net',
        url: 'https://www.nugs.net/live-music-concerts/goose',
        description: 'Purchase and stream official Goose live recordings. High-quality audio and video.',
        color: '#FF6B35',
    },
    {
        name: 'Bandcamp',
        url: 'https://bandcamp.com/search?q=goose',
        description: 'Discover Goose music on Bandcamp. Support artists directly.',
        color: '#4A9CFF',
    },
    {
        name: 'Internet Archive',
        url: 'https://archive.org/search.php?query=goose&mediatype=audio',
        description: 'Browse archived Goose shows. Community recordings and metadata.',
        color: '#4A90E2',
    },
];

export default function StreamingPage() {
    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold mb-4 text-[#f5f5f5]">
                Listen & Watch Goose Live
            </h1>

            <p className="text-[#a0a0a0] mb-8 max-w-2xl">
                Goose music is available on many streaming platforms. Whether you're looking for official releases, live
                performances, or rare recordings, you'll find them here.
            </p>

            {/* Streaming Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                {streamingServices.map(service => (
                    <a
                        key={service.name}
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-6 bg-[#1a1a1a] border border-[#a0a0a0] hover:border-[#ff6b35] transition group"
                    >
                        <div
                            className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] text-sm font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wide"
                            style={{ color: service.color }}
                        >
                            {service.name.slice(0, 2)}
                        </div>
                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[#f5f5f5] mb-2 group-hover:text-[#ff6b35] transition">
                            {service.name}
                        </h3>
                        <p className="text-[#a0a0a0] text-sm mb-4">{service.description}</p>
                        <div className="text-[#ff6b35] text-sm font-bold">Visit →</div>
                    </a>
                ))}
            </div>

            {/* Tips & Guides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                <div className="p-6 bg-[#1a1a1a] border border-[#ff6b35]">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#ff6b35] mb-4">
                        Finding Your Favorite Show
                    </h2>
                    <ul className="space-y-2 text-[#a0a0a0] text-sm">
                        <li>✓ Search by venue name (e.g., "Red Rocks")</li>
                        <li>✓ Search by date (e.g., "Goose 2024-11-23")</li>
                        <li>✓ Search by song name + "live"</li>
                        <li>✓ Check the <Link href="/venues" className="text-[#ff6b35] hover:underline">venues</Link> page for popular venues</li>
                        <li>✓ Browse show pages for direct streaming links</li>
                    </ul>
                </div>

                <div className="p-6 bg-[#1a1a1a] border border-[#90ee90]">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#90ee90] mb-4">
                        About Goose
                    </h2>
                    <p className="text-[#a0a0a0] text-sm mb-3">
                        Goose is an American rock band known for their improvisational live performances and jam-oriented
                        rock sound. The band regularly tours and their shows are documented across multiple streaming platforms.
                    </p>
                    <p className="text-[#a0a0a0] text-sm">
                        All music is available through official channels and legal streaming services.
                    </p>
                </div>
            </div>

            {/* Recommended For Discovery */}
            <div className="p-6 bg-[#1a1a1a] border border-[#a0a0a0] mb-12">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f5f5f5] mb-4">
                    Recommendations by Use Case
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-bold text-[#ff6b35] mb-2">Best for Full Show Listening</h3>
                        <p className="text-[#a0a0a0] text-sm mb-2">
                            Nugs.net and Internet Archive have complete setlists and high-quality recordings of full shows.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-[#ff6b35] mb-2">Best for Discovery</h3>
                        <p className="text-[#a0a0a0] text-sm mb-2">
                            Spotify and Apple Music make it easy to find specific songs, create playlists, and discover similar
                            artists.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-[#ff6b35] mb-2">Best for Video</h3>
                        <p className="text-[#a0a0a0] text-sm mb-2">
                            YouTube has the largest collection of live performance videos, both official and fan-recorded.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-[#ff6b35] mb-2">Best for High-Quality Audio</h3>
                        <p className="text-[#a0a0a0] text-sm mb-2">
                            Nugs.net offers lossless audio downloads for audiophiles. Bandcamp also supports high-quality
                            downloads.
                        </p>
                    </div>
                </div>
            </div>

            {/* Links & Resources */}
            <div className="p-6 bg-[#1a1a1a] border border-[#a0a0a0]">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f5f5f5] mb-4">
                    Additional Resources

                </h2>

                <div className="space-y-2 text-[#a0a0a0] text-sm">
                    <p>
                        <strong>Find Shows:</strong>{' '}
                        <Link href="/search" className="text-[#ff6b35] hover:underline">
                            Search
                        </Link>
                        {' '}for shows by date, venue, or location
                    </p>
                    <p>
                        <strong>Browse by Venue:</strong>{' '}
                        <Link href="/venues" className="text-[#ff6b35] hover:underline">
                            Explore venues
                        </Link>
                        {' '}and all shows at each location
                    </p>
                    <p>
                        <strong>Vote & Rate:</strong>{' '}
                        <Link href="/search" className="text-[#ff6b35] hover:underline">
                            Rate performances
                        </Link>
                        {' '}on HonkingVersion to help others find the best versions
                    </p>
                    <p>
                        <strong>Create Lists:</strong> Save your favorite shows and performances to personalized lists
                    </p>
                </div>
            </div>
        </div>
    );
}
