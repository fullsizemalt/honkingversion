'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';
import { Tag } from '@/types/tag';

interface TagManagerProps {
    isOpen: boolean;
    onClose: () => void;
    onTagCreated?: (tag: Tag) => void;
    editTag?: Tag;
}

export default function TagManager({ isOpen, onClose, onTagCreated, editTag }: TagManagerProps) {
    const { data: session } = useSession();
    const [name, setName] = useState(editTag?.name || '');
    const [color, setColor] = useState(editTag?.color || '#ff6b35');
    const [description, setDescription] = useState(editTag?.description || '');
    const [category, setCategory] = useState(editTag?.category || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const accessToken = session?.user?.accessToken
        if (!accessToken) {
            setError('You must be logged in to create tags');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const tagData = { name, color, description, category };
            const res = await fetch(getApiEndpoint('/tags/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(tagData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Failed to create tag');
            }

            const newTag = await res.json();
            onTagCreated?.(newTag);
            onClose();

            // Reset form
            setName('');
            setColor('#ff6b35');
            setDescription('');
            setCategory('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 max-w-md w-full shadow-[0_35px_55px_rgba(23,20,10,0.15)]">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] mb-4">
                    {editTag ? 'Edit Tag' : 'Create New Tag'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-[0.35em]">
                            Tag Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-tertiary)]"
                            placeholder="e.g., Type II Jam"
                        />
                    </div>

                    <div>
                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-[0.35em]">
                            Color *
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="h-10 w-20 bg-[var(--bg-muted)] border border-[var(--border)] cursor-pointer"
                            />
                            <input
                                type="text"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="flex-1 bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-tertiary)]"
                                placeholder="#ff6b35"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-[0.35em]">
                            Category
                        </label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-tertiary)]"
                            placeholder="e.g., Jam Type"
                        />
                    </div>

                    <div>
                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-[0.35em]">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 focus:border-[var(--accent-primary)] focus:outline-none resize-none placeholder:text-[var(--text-tertiary)]"
                            placeholder="Optional description..."
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 font-[family-name:var(--font-ibm-plex-mono)] text-xs">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[var(--accent-primary)] text-[var(--text-inverse)] px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase hover:bg-[var(--accent-secondary)] disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : editTag ? 'Update Tag' : 'Create Tag'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-[var(--border)] text-[var(--text-secondary)] px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
