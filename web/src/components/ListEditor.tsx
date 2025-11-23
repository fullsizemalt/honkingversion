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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] border border-[#333] p-6 max-w-md w-full mx-4">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f5f5f5] mb-4">
                    {editList ? 'Edit List' : 'Create New List'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0] mb-2 uppercase">
                            Items
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder={`Add ${listType.slice(0, -1)} ID`}
                                className="flex-1 bg-[#0a0a0a] border border-[#333] text-[#f5f5f5] px-3 py-2 focus:border-[#ff6b35] focus:outline-none"
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
                                className="border border-[#333] text-[#a0a0a0] px-3 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase hover:border-[#ff6b35] hover:text-[#ff6b35]"
                            >
                                Clear
                            </button>
                        </div>
                        {items.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {items.map((item, idx) => (
                                    <span
                                        key={`${item}-${idx}`}
                                        className="flex items-center gap-2 px-2 py-1 bg-[#0a0a0a] border border-[#333] text-[#f5f5f5] text-xs rounded"
                                    >
                                        {String(item)}
                                        <button
                                            type="button"
                                            className="text-[#ff6b35] hover:text-[#f7931e]"
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
                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0] mb-2 uppercase">
                            List Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-[#0a0a0a] border border-[#333] text-[#f5f5f5] px-3 py-2 focus:border-[#ff6b35] focus:outline-none"
                            placeholder="e.g., Best Shows of 2024"
                        />
                    </div>

                    <div>
                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0] mb-2 uppercase">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-[#0a0a0a] border border-[#333] text-[#f5f5f5] px-3 py-2 focus:border-[#ff6b35] focus:outline-none resize-none"
                            placeholder="Optional description..."
                        />
                    </div>

                    <div>
                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0] mb-2 uppercase">
                            List Type
                        </label>
                        <select
                            value={listType}
                            onChange={(e) => setListType(e.target.value as 'performances' | 'shows' | 'songs')}
                            className="w-full bg-[#0a0a0a] border border-[#333] text-[#f5f5f5] px-3 py-2 focus:border-[#ff6b35] focus:outline-none"
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
                            className="flex-1 bg-[#ff6b35] text-[#0a0a0a] px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase hover:bg-[#f7931e] disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : editList ? 'Update List' : 'Create List'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-[#333] text-[#a0a0a0] px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase hover:border-[#f5f5f5] hover:text-[#f5f5f5]"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
