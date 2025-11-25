'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';
import TagBadge from '@/components/TagBadge';
import TagManager from '@/components/TagManager';
import { Tag } from '@/types/tag';

interface TaggedShow {
    id: number;
    date: string;
    venue: string;
    location: string;
}

interface TaggedPerformance {
    id: number;
    song_id: number;
    song_name: string;
    show_id: number;
    show_date: string;
    venue: string;
    location: string;
}

export default function TagsPage() {
    const { data: session } = useSession();
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTagManager, setShowTagManager] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | undefined>();
    const [filterTagId, setFilterTagId] = useState<number | null>(null);
    const [filterLoading, setFilterLoading] = useState(false);
    const [filterError, setFilterError] = useState<string | null>(null);
    const [taggedShows, setTaggedShows] = useState<TaggedShow[]>([]);
    const [taggedPerformances, setTaggedPerformances] = useState<TaggedPerformance[]>([]);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const headers: HeadersInit = {};
            if (session?.user?.accessToken) {
                headers['Authorization'] = `Bearer ${session.user.accessToken}`;
            }
            const res = await fetch(getApiEndpoint('/tags'), { headers });
            if (res.ok) {
                const data = await res.json();
                setTags(data);
            }
        } catch (error) {
            console.error('Failed to fetch tags', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (tagId: number) => {
        const accessToken = session?.user?.accessToken;
        if (!accessToken) return;
        if (!confirm('Are you sure you want to delete this tag?')) return;

        try {
            const res = await fetch(getApiEndpoint(`/tags/${tagId}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (res.ok) {
                setTags(tags.filter(t => t.id !== tagId));
            }
        } catch (error) {
            console.error('Failed to delete tag', error);
        }
    };

    const handleTagCreated = (newTag: Tag) => {
        setTags([...tags, newTag]);
    };

    const handleTagUpdated = (updated: Tag) => {
        setTags(tags.map((t) => (t.id === updated.id ? updated : t)));
    };

    const fetchFilteredItems = async (tagId: number) => {
        setFilterLoading(true);
        setFilterError(null);
        try {
            const headers: HeadersInit = {};
            if (session?.user?.accessToken) {
                headers['Authorization'] = `Bearer ${session.user.accessToken}`;
            }
            const [showsRes, performancesRes] = await Promise.all([
                fetch(getApiEndpoint(`/tags/${tagId}/shows`), { headers }),
                fetch(getApiEndpoint(`/tags/${tagId}/performances`), { headers }),
            ]);

            if (!showsRes.ok || !performancesRes.ok) {
                throw new Error('Failed to load tagged items');
            }

            setTaggedShows(await showsRes.json());
            setTaggedPerformances(await performancesRes.json());
        } catch (error) {
            console.error('Failed to fetch tagged items', error);
            setFilterError('Could not load items for this tag. Please try again.');
            setTaggedShows([]);
            setTaggedPerformances([]);
        } finally {
            setFilterLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#f5f5f5]">
                        Tag Management
                    </h1>
                    {session && (
                        <button
                            onClick={() => {
                                setEditingTag(undefined);
                                setShowTagManager(true);
                            }}
                            className="bg-[#ff6b35] text-[#0a0a0a] px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase hover:bg-[#f7931e]"
                        >
                            + Create Tag
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[#f5f5f5] mb-3">
                            All Tags
                        </h2>
                        {loading ? (
                            <div className="text-[#a0a0a0] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                                Loading tags...
                            </div>
                        ) : tags.length > 0 ? (
                            <div className="space-y-3">
                                {tags.map(tag => (
                                    <div
                                        key={tag.id}
                                        className="bg-[#1a1a1a] border border-[#333] p-4 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <TagBadge tag={tag} />
                                            <div className="flex-1">
                                                {tag.description && (
                                                    <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0]">
                                                        {tag.description}
                                                    </p>
                                                )}
                                                {tag.category && (
                                                    <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#707070] mt-1">
                                                        Category: {tag.category}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {session && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingTag(tag);
                                                        setShowTagManager(true);
                                                    }}
                                                    className="border border-[#333] text-[#a0a0a0] px-3 py-1 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase hover:border-[#ff6b35] hover:text-[#ff6b35]"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tag.id)}
                                                    className="border border-[#333] text-[#a0a0a0] px-3 py-1 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase hover:border-red-500 hover:text-red-500"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-[#a0a0a0] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                                No tags yet. {session && 'Create one to get started!'}
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold text-[#f5f5f5] mb-3">
                            Filter by Tag
                        </h2>
                        <div className="bg-[#1a1a1a] border border-[#333] p-4 space-y-4">
                            <div className="space-y-2">
                                <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0] uppercase tracking-[0.35em]">
                                    Choose a tag
                                </label>
                                <select
                                    value={filterTagId ?? ''}
                                    onChange={(e) => {
                                        const val = e.target.value ? Number(e.target.value) : null;
                                        setFilterTagId(val);
                                        if (val) {
                                            fetchFilteredItems(val);
                                        } else {
                                            setTaggedShows([]);
                                            setTaggedPerformances([]);
                                        }
                                    }}
                                    className="w-full bg-[#0f0f0f] border border-[#333] text-[#f5f5f5] px-3 py-2 text-sm"
                                >
                                    <option value="">Select a tag...</option>
                                    {tags.map((tag) => (
                                        <option key={tag.id} value={tag.id}>
                                            {tag.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {filterError && (
                                <div className="text-red-400 text-sm font-[family-name:var(--font-ibm-plex-mono)]">
                                    {filterError}
                                </div>
                            )}

                            {filterLoading && (
                                <div className="text-[#a0a0a0] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                                    Loading items...
                                </div>
                            )}

                            {!filterLoading && filterTagId && (
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg text-[#f5f5f5] mb-2">
                                            Shows
                                        </h3>
                                        {taggedShows.length ? (
                                            <ul className="space-y-2 text-sm">
                                                {taggedShows.map((show) => (
                                                    <li key={show.id} className="text-[#d1d5db]">
                                                        {show.date} — {show.venue} ({show.location})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-[#6b7280] text-sm">No shows have this tag yet.</p>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg text-[#f5f5f5] mb-2">
                                            Performances
                                        </h3>
                                        {taggedPerformances.length ? (
                                            <ul className="space-y-2 text-sm">
                                                {taggedPerformances.map((perf) => (
                                                    <li key={perf.id} className="text-[#d1d5db]">
                                                        {perf.song_name} — {perf.show_date} @ {perf.venue} ({perf.location})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-[#6b7280] text-sm">No performances have this tag yet.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <TagManager
                    isOpen={showTagManager}
                    onClose={() => setShowTagManager(false)}
                    onTagCreated={handleTagCreated}
                    onTagUpdated={handleTagUpdated}
                    editTag={editingTag}
                />
            </div>
        </div>
    );
}
