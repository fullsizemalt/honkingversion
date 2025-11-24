'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getApiEndpoint } from '@/lib/api';

interface SearchResult {
    type: 'show' | 'song' | 'user';
    id: number;
    title: string;
    subtitle?: string;
    url: string;
}

function SearchPageContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;

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
    }, [query]);

    if (!query) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="text-[#a0a0a0]">Enter a search term to begin.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f5f5f5] mb-8">
                    Search Results for "{query}"
                </h1>

                {loading ? (
                    <div className="text-[#a0a0a0]">Searching...</div>
                ) : results.length > 0 ? (
                    <div className="space-y-4">
                        {results.map((result, index) => (
                            <Link
                                key={`${result.type}-${result.id}-${index}`}
                                href={result.url}
                                className="block bg-[#1a1a1a] border border-[#333] p-4 hover:border-[#ff6b35] transition-colors group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[#f5f5f5] group-hover:text-[#ff6b35]">
                                            {result.title}
                                        </h3>
                                        {result.subtitle && (
                                            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#a0a0a0]">
                                                {result.subtitle}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-xs font-[family-name:var(--font-ibm-plex-mono)] text-[#707070] uppercase tracking-wider border border-[#333] px-2 py-1">
                                        {result.type}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-[#a0a0a0]">No results found.</div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="text-[#a0a0a0]">Loading search...</div>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}
