'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Music, MapPin, User as UserIcon } from 'lucide-react';

interface SearchResult {
    type: 'song' | 'show' | 'user';
    id: number;
    title: string;
    subtitle?: string;
    url: string;
}

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Debounced search
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (query.trim().length < 2) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        timeoutRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (response.ok) {
                    const results = await response.json();
                    setSuggestions(results);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [query]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim().length >= 2) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    const handleSuggestionClick = (result: SearchResult) => {
        router.push(result.url);
        setIsOpen(false);
        setQuery('');
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'song':
                return <Music className="w-4 h-4" />;
            case 'show':
                return <MapPin className="w-4 h-4" />;
            case 'user':
                return <UserIcon className="w-4 h-4" />;
            default:
                return null;
        }
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    placeholder="Search songs, shows, users..."
                    className="w-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] placeholder:text-[var(--text-tertiary)] transition-colors rounded-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    className="absolute right-0 top-0 h-full px-3 text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
                    aria-label="Search"
                >
                    {isLoading ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <Search className="w-5 h-5" />
                    )}
                </button>
            </form>

            {/* Autocomplete Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-sm shadow-lg z-50 overflow-hidden">
                    {suggestions.map((result, index) => (
                        <button
                            key={`${result.type}-${result.id}-${index}`}
                            onClick={() => handleSuggestionClick(result)}
                            className="w-full px-4 py-3 text-left hover:bg-[var(--bg-muted)] transition-colors border-b border-[var(--border-subtle)] last:border-b-0 flex items-start gap-3 group"
                        >
                            <div className="text-[var(--accent-primary)] mt-0.5 flex-shrink-0">
                                {getIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                                    {result.title}
                                </div>
                                {result.subtitle && (
                                    <div className="text-xs text-[var(--text-secondary)] truncate">
                                        {result.subtitle}
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No Results Message */}
            {isOpen && query.trim().length >= 2 && !isLoading && suggestions.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-sm shadow-lg z-50 px-4 py-3">
                    <p className="text-sm text-[var(--text-secondary)]">
                        No results for "{query}"
                    </p>
                </div>
            )}
        </div>
    );
}
