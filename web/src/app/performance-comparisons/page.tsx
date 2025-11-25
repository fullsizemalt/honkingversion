'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getApiEndpoint } from '@/lib/api';

interface Performance {
    id: number;
    position: number;
    set_number: number;
    notes: string;
    song: {
        id: number;
        name: string;
        slug: string;
        is_cover: boolean;
        original_artist?: string;
    };
    show: {
        id: number;
        date: string;
        venue: string;
        location: string;
    };
    vote_count: number;
    avg_rating: number | null;
}

export default function PerformanceComparisonsPage() {
    const searchParams = useSearchParams();
    const initialIds = searchParams.get('ids') || '';
    const [perfIds, setPerfIds] = useState<string>(initialIds);
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialIds) {
            handleFetch(initialIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFetch = async (idsInput?: string) => {
        const raw = idsInput ?? perfIds;
        if (!raw.trim()) {
            setError('Enter at least one performance ID');
            return;
        }

        setLoading(true);
        setError(null);
        setPerformances([]);

        const ids = raw.split(',').map(id => id.trim()).filter(Boolean);
        const fetched: Performance[] = [];

        for (const id of ids) {
            try {
                const response = await fetch(getApiEndpoint(`/performances/${id}`));
                if (response.ok) {
                    const data = await response.json();
                    fetched.push(data);
                } else {
                    setError(`Performance ${id} not found`);
                }
            } catch (_error) {
                console.error("Failed to fetch performance", _error);
                setError(`Failed to load performance ${id}`);
            }
        }

        if (fetched.length > 0) {
            setPerformances(fetched);
        } else {
            setError('No performances found');
        }

        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold mb-6 text-[#f5f5f5]">
                Compare Performances
            </h1>

            <div className="mb-8 p-4 bg-[#1a1a1a] border border-[#ff6b35]">
                <p className="text-[#a0a0a0] mb-4">
                    Enter performance IDs separated by commas to compare them side-by-side. You can find performance IDs on show pages.
                </p>
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="e.g., 123, 456, 789"
                        value={perfIds}
                        onChange={e => setPerfIds(e.target.value)}
                        className="flex-1 bg-[#2a2a2a] text-[#f5f5f5] p-3 border border-[#a0a0a0] focus:border-[#ff6b35] outline-none"
                    />
                    <button
                        onClick={() => handleFetch()}
                        disabled={loading}
                        className="bg-[#ff6b35] text-[#0a0a0a] px-6 py-3 font-bold hover:bg-[#ff8c5a] disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Compare'}
                    </button>
                </div>
                <p className="text-xs text-[#a0a0a0]">
                    Tip: add `?ids=123,456` to the URL to deep link a comparison.
                </p>

                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {performances.length === 0 && !loading ? (
                <div className="p-4 bg-[#1a1a1a] border border-[#a0a0a0] text-center text-[#a0a0a0]">
                    <p>Enter performance IDs above to see a comparison.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b-2 border-[#ff6b35]">
                                <th className="bg-[#1a1a1a] text-[#ff6b35] p-3 text-left font-bold">Field</th>
                                {performances.map((perf, idx) => (
                                    <th
                                        key={perf.id}
                                        className="bg-[#1a1a1a] text-[#ff6b35] p-3 text-left font-bold border-l border-[#a0a0a0]"
                                    >
                                        Perf {idx + 1}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Song Name */}
                            <tr className="border-b border-[#a0a0a0]">
                                <td className="bg-[#1a1a1a] text-[#f5f5f5] font-bold p-3">Song</td>
                                {performances.map(perf => (
                                    <td key={perf.id} className="bg-[#2a2a2a] text-[#f5f5f5] p-3 border-l border-[#a0a0a0]">
                                        {perf.song.name}
                                        {perf.song.is_cover && (
                                            <span className="text-[#90ee90] text-xs ml-2">(cover)</span>
                                        )}
                                    </td>
                                ))}
                            </tr>

                            {/* Original Artist */}
                            {performances.some(p => p.song.original_artist) && (
                                <tr className="border-b border-[#a0a0a0]">
                                    <td className="bg-[#1a1a1a] text-[#f5f5f5] font-bold p-3">Original Artist</td>
                                    {performances.map(perf => (
                                        <td
                                            key={perf.id}
                                            className="bg-[#2a2a2a] text-[#a0a0a0] p-3 border-l border-[#a0a0a0]"
                                        >
                                            {perf.song.original_artist || '-'}
                                        </td>
                                    ))}
                                </tr>
                            )}

                            {/* Show Date */}
                            <tr className="border-b border-[#a0a0a0]">
                                <td className="bg-[#1a1a1a] text-[#f5f5f5] font-bold p-3">Date</td>
                                {performances.map(perf => (
                                    <td key={perf.id} className="bg-[#2a2a2a] text-[#f5f5f5] p-3 border-l border-[#a0a0a0]">
                                        {new Date(perf.show.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </td>
                                ))}
                            </tr>

                            {/* Venue */}
                            <tr className="border-b border-[#a0a0a0]">
                                <td className="bg-[#1a1a1a] text-[#f5f5f5] font-bold p-3">Venue</td>
                                {performances.map(perf => (
                                    <td key={perf.id} className="bg-[#2a2a2a] text-[#f5f5f5] p-3 border-l border-[#a0a0a0]">
                                        {perf.show.venue}
                                    </td>
                                ))}
                            </tr>

                            {/* Location */}
                            <tr className="border-b border-[#a0a0a0]">
                                <td className="bg-[#1a1a1a] text-[#f5f5f5] font-bold p-3">Location</td>
                                {performances.map(perf => (
                                    <td
                                        key={perf.id}
                                        className="bg-[#2a2a2a] text-[#a0a0a0] p-3 border-l border-[#a0a0a0]"
                                    >
                                        {perf.show.location}
                                    </td>
                                ))}
                            </tr>

                            {/* Set Number */}
                            <tr className="border-b border-[#a0a0a0]">
                                <td className="bg-[#1a1a1a] text-[#f5f5f5] font-bold p-3">Set</td>
                                {performances.map(perf => (
                                    <td key={perf.id} className="bg-[#2a2a2a] text-[#f5f5f5] p-3 border-l border-[#a0a0a0]">
                                        Set {perf.set_number}
                                    </td>
                                ))}
                            </tr>

                            {/* Position */}
                            <tr className="border-b border-[#a0a0a0]">
                                <td className="bg-[#1a1a1a] text-[#f5f5f5] font-bold p-3">Position</td>
                                {performances.map(perf => (
                                    <td key={perf.id} className="bg-[#2a2a2a] text-[#f5f5f5] p-3 border-l border-[#a0a0a0]">
                                        #{perf.position}
                                    </td>
                                ))}
                            </tr>

                            {/* Average Rating */}
                            <tr className="border-b border-[#a0a0a0]">
                                <td className="bg-[#1a1a1a] text-[#f5f5f5] font-bold p-3">Avg Rating</td>
                                {performances.map(perf => (
                                    <td key={perf.id} className="bg-[#2a2a2a] p-3 border-l border-[#a0a0a0]">
                                        {perf.avg_rating ? (
                                            <span className="text-[#90ee90] font-bold">{perf.avg_rating}/10</span>
                                        ) : (
                                            <span className="text-[#a0a0a0]">No votes</span>
                                        )}
                                    </td>
                                ))}
                            </tr>

                            {/* Vote Count */}
                            <tr className="border-b border-[#a0a0a0]">
                                <td className="bg-[#1a1a1a] text-[#f5f5f5] font-bold p-3">Votes</td>
                                {performances.map(perf => (
                                    <td key={perf.id} className="bg-[#2a2a2a] text-[#a0a0a0] p-3 border-l border-[#a0a0a0]">
                                        {perf.vote_count}
                                    </td>
                                ))}
                            </tr>

                            {/* Notes */}
                            {performances.some(p => p.notes) && (
                                <tr className="border-b border-[#a0a0a0]">
                                    <td className="bg-[#1a1a1a] text-[#f5f5f5] font-bold p-3">Notes</td>
                                    {performances.map(perf => (
                                        <td
                                            key={perf.id}
                                            className="bg-[#2a2a2a] text-[#a0a0a0] p-3 border-l border-[#a0a0a0] text-xs"
                                        >
                                            {perf.notes || '-'}
                                        </td>
                                    ))}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-8 p-4 bg-[#1a1a1a] border border-[#a0a0a0] text-sm text-[#a0a0a0]">
                <h3 className="font-bold text-[#f5f5f5] mb-2">How to Find Performance IDs</h3>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Navigate to a show page</li>
                    <li>Look at the setlist - each performance has an ID shown in parentheses</li>
                    <li>Enter those IDs in the input field above</li>
                    <li>Click "Compare" to see the side-by-side analysis</li>
                </ol>
            </div>
        </div>
    );
}
