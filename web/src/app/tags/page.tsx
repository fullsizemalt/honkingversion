'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';
import TagBadge from '@/components/TagBadge';
import TagManager from '@/components/TagManager';

interface Tag {
    id: number;
    name: string;
    color: string;
    description?: string;
    category?: string;
}

export default function TagsPage() {
    const { data: session } = useSession();
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTagManager, setShowTagManager] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | undefined>();

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const res = await fetch(getApiEndpoint('/tags'));
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

                <TagManager
                    isOpen={showTagManager}
                    onClose={() => setShowTagManager(false)}
                    onTagCreated={handleTagCreated}
                    editTag={editingTag}
                />
            </div>
        </div>
    );
}
