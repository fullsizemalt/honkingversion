'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';

interface UserList {
    id?: number;
    title: string;
    description?: string;
    list_type?: 'shows' | 'performances' | 'songs';
    items?: any[];
}

interface ListEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onListSaved?: (list: UserList) => void;
    editList?: UserList;
}

export default function ListEditor({ isOpen, onClose, onListSaved, editList }: ListEditorProps) {
    const { data: session } = useSession();
    const [title, setTitle] = useState(editList?.title || '');
    const [description, setDescription] = useState(editList?.description || '');
    const [listType, setListType] = useState(editList?.list_type || 'shows');
    const [items, setItems] = useState<any[]>(Array.isArray(editList?.items) ? editList?.items ?? [] : []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editList) {
            setTitle(editList.title);
            setDescription(editList.description || '');
            setListType(editList.list_type || 'shows');
            setItems(Array.isArray(editList.items) ? editList.items : []);
        }
    }, [editList]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const accessToken = session?.user?.accessToken
        if (!accessToken) {
            setError('You must be logged in to create lists');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const listData = {
                title,
                description,
                list_type: listType,
                items
            };

            const url = editList
                ? getApiEndpoint(`/lists/${editList.id}`)
                : getApiEndpoint('/lists/');

            const method = editList ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(listData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Failed to save list');
            }

            const savedList = await res.json();
            onListSaved?.(savedList);
            onClose();

            // Reset form if creating new
            if (!editList) {
                setTitle('');
                setDescription('');
                setListType('shows');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 max-w-md w-full rounded-3xl shadow-[0_35px_55px_rgba(23,20,10,0.15)]">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] mb-4">
                    {editList ? 'Edit List' : 'Create New List'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-[0.35em]">
                            Items
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder={`Add ${listType.slice(0, -1)} ID`}
                                className="flex-1 bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-tertiary)]"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const val = (e.target as HTMLInputElement).value.trim();
                                        if (!val) return;
                                        setItems([...items, Number.isNaN(Number(val)) ? val : Number(val)]);
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setItems([])}
                                className="border border-[var(--border)] text-[var(--text-secondary)] px-3 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase rounded-lg hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                            >
                                Clear
                            </button>
                        </div>
                        {items.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {items.map((item, idx) => (
                                    <span
                                        key={`${item}-${idx}`}
                                        className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] text-xs rounded-full"
                                    >
                                        {String(item)}
                                        <button
                                            type="button"
                                            className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)]"
                                            onClick={() => setItems(items.filter((_, i) => i !== idx))}
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-[0.35em]">
                            List Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-tertiary)]"
                            placeholder="e.g., Best Shows of 2024"
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
                            className="w-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none resize-none placeholder:text-[var(--text-tertiary)]"
                            placeholder="Optional description..."
                        />
                    </div>

                    <div>
                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-[0.35em]">
                            List Type
                        </label>
                        <select
                            value={listType}
                            onChange={(e) => setListType(e.target.value as 'performances' | 'shows' | 'songs')}
                            className="w-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 rounded-lg focus:border-[var(--accent-primary)] focus:outline-none"
                        >
                            <option value="shows">Shows</option>
                            <option value="performances">Performances</option>
                            <option value="songs">Songs</option>
                        </select>
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
                            className="flex-1 bg-[var(--accent-primary)] text-[var(--text-inverse)] px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase rounded-full hover:bg-[var(--accent-secondary)] disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : editList ? 'Update List' : 'Create List'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-[var(--border)] text-[var(--text-secondary)] px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase rounded-full hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
