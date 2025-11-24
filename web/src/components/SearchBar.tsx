'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim().length >= 2) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <input
                type="text"
                placeholder="Search songs, shows, users..."
                className="w-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] rounded-full placeholder:text-[var(--text-tertiary)] transition-colors"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
        </form>
    );
}
