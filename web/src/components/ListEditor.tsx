'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';

type ListItem = {
    id: number;
    type: 'show' | 'song';
    label: string;
    date?: string;
    venue?: string;
    name?: string;
    artist?: string;
    slug?: string;
};

interface UserList {
    id?: number;
    title: string;
    description?: string;
    list_type?: 'shows' | 'performances' | 'songs';
    items?: any[];
    is_public?: boolean;
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
    const [listType, setListType] = useState<'shows' | 'performances' | 'songs'>((editList?.list_type as any) || 'shows');
    const [items, setItems] = useState<ListItem[]>(Array.isArray(editList?.items) ? (editList?.items as ListItem[]) ?? [] : []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isPublic, setIsPublic] = useState(editList?.is_public ?? true);
    const [showSearch, setShowSearch] = useState('');
    const [showSuggestion, setShowSuggestion] = useState<string | null>(null);
    const [recentShows, setRecentShows] = useState<ListItem[]>([]);
    const [allSongs, setAllSongs] = useState<ListItem[]>([]);
    const [filteredSongs, setFilteredSongs] = useState<ListItem[]>([]);

    useEffect(() => {
        if (editList) {
            setTitle(editList.title);
            setDescription(editList.description || '');
            setListType((editList.list_type as any) || 'shows');
            setItems(Array.isArray(editList.items) ? (editList.items as ListItem[]) : []);
            setIsPublic(editList.is_public ?? true);
        }
    }, [editList]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchRecentShows = async () => {
            try {
                const res = await fetch(getApiEndpoint('/shows/'));
                if (!res.ok) return;
                const data = await res.json();
                const normalized = (Array.isArray(data) ? data : []).map((s: any) => ({
                    id: s.id,
                    type: 'show' as const,
                    label: `${s.date} @ ${s.venue}`,
                    date: s.date,
                    venue: s.venue,
                }));
                normalized.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
                setRecentShows(normalized.slice(0, 20));
            } catch {
                // ignore
            }
        };

        const fetchSongs = async () => {
            try {
                const res = await fetch(getApiEndpoint('/songs/'));
                if (!res.ok) return;
                const data = await res.json();
                const normalized = (Array.isArray(data) ? data : []).map((s: any) => ({
                    id: s.id,
                    type: 'song' as const,
                    label: s.name,
                    name: s.name,
                    artist: s.artist,
                    slug: s.slug,
                }));
                normalized.sort((a, b) => a.label.localeCompare(b.label));
                setAllSongs(normalized);
            } catch {
                // ignore
            }
        };

        fetchRecentShows();
        fetchSongs();
    }, [isOpen]);

    useEffect(() => {
        if (listType === 'songs' && showSearch.trim()) {
            const term = showSearch.toLowerCase();
            setFilteredSongs(allSongs.filter((s) => s.label.toLowerCase().includes(term)).slice(0, 10));
        } else {
            setFilteredSongs([]);
        }
    }, [showSearch, listType, allSongs]);

    const addShowByDate = async () => {
        if (!showSearch.trim()) return;
        try {
            const res = await fetch(getApiEndpoint(`/shows/${showSearch.trim()}`));
            if (!res.ok) {
                setShowSuggestion('Show not found for that date');
                return;
            }
            const data = await res.json();
            const newItem: ListItem = {
                id: data.id,
                type: 'show',
                label: `${data.date} @ ${data.venue}`,
                date: data.date,
                venue: data.venue,
            };
            setItems((prev) => [...prev, newItem]);
            setShowSuggestion(null);
            setShowSearch('');
        } catch {
            setShowSuggestion('Error fetching show');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const accessToken = session?.user?.accessToken;
        if (!accessToken) {
            setError('You must be logged in to create lists');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const normalizedItems = items.map((item) => ({
                id: item.id,
                type: item.type,
                label: item.label,
                date: item.date,
                venue: item.venue,
                name: item.name,
                artist: item.artist,
                slug: item.slug,
            }));

            const listData = {
                title,
                description,
                list_type: listType,
                items: JSON.stringify(normalizedItems),
                is_public: isPublic,
            };

            const url = editList ? getApiEndpoint(`/lists/${editList.id}`) : getApiEndpoint('/lists/');
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

            if (!editList) {
                setTitle('');
                setDescription('');
                setListType('shows');
                setItems([]);
                setIsPublic(true);
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
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 max-w-xl w-full shadow-[0_35px_55px_rgba(23,20,10,0.15)]">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] mb-4">
                    {editList ? 'Edit List' : 'Create New List'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-[0.35em]">
                                List Title *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-tertiary)]"
                                placeholder="e.g., Best Shows of 2024"
                            />
                        </div>
                        <div>
                            <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-[0.35em]">
                                Visibility
                            </label>
                            <select
                                value={isPublic ? 'public' : 'private'}
                                onChange={(e) => setIsPublic(e.target.value === 'public')}
                                className="w-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 focus:border-[var(--accent-primary)] focus:outline-none"
                            >
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                            </select>
                            <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
                                Public lists can be shared; private lists are visible only to you.
                            </p>
                        </div>
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

                    {listType === 'shows' && (
                        <>
                            <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-[0.35em]">
                                Add Show by Date (YYYY-MM-DD)
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={showSearch}
                                    onChange={(e) => setShowSearch(e.target.value)}
                                    placeholder="2025-07-20"
                                    className="flex-1 bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-tertiary)]"
                                />
                                <button
                                    type="button"
                                    onClick={addShowByDate}
                                    className="border border-[var(--border)] text-[var(--text-secondary)] px-3 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                                >
                                    Add
                                </button>
                                {recentShows.length > 0 && (
                                    <select
                                        onChange={(e) => {
                                            const selected = recentShows.find((r) => r.id === Number(e.target.value));
                                            if (selected) {
                                                setItems((prev) => [...prev, selected]);
                                            }
                                        }}
                                        className="border border-[var(--border)] text-[var(--text-secondary)] px-2 py-2 text-xs bg-[var(--bg-muted)]"
                                    >
                                        <option value="">Recent shows...</option>
                                        {recentShows.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setItems([])}
                                    className="border border-[var(--border)] text-[var(--text-secondary)] px-3 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                                >
                                    Clear
                                </button>
                            </div>
                        </>
                    )}

                    {listType === 'songs' && (
                        <>
                            <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-[0.35em]">
                                Search Songs
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={showSearch}
                                    onChange={(e) => setShowSearch(e.target.value)}
                                    placeholder="Type song name..."
                                    className="flex-1 bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-tertiary)]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setItems([])}
                                    className="border border-[var(--border)] text-[var(--text-secondary)] px-3 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                                >
                                    Clear
                                </button>
                            </div>
                            {filteredSongs.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4 p-2 border border-[var(--border)] bg-[var(--bg-secondary)] max-h-40 overflow-y-auto">
                                    {filteredSongs.map((song) => (
                                        <button
                                            key={song.id}
                                            type="button"
                                            onClick={() => {
                                                if (!items.some((i) => i.id === song.id)) {
                                                    setItems((prev) => [...prev, song]);
                                                }
                                                setShowSearch('');
                                            }}
                                            className="px-2 py-1 bg-[var(--bg-muted)] hover:bg-[var(--accent-primary)] hover:text-white text-xs rounded transition-colors"
                                        >
                                            {song.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {showSuggestion && (
                        <p className="text-xs text-amber-400">{showSuggestion}</p>
                    )}

                    {items.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {items.map((item, idx) => (
                                <span
                                    key={`${item.id}-${idx}`}
                                    className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] text-xs"
                                >
                                    {item.label}
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

                    <div>
                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] mb-2 uppercase tracking-[0.35em]">
                            List Type
                        </label>
                        <select
                            value={listType}
                            onChange={(e) => setListType(e.target.value as 'performances' | 'shows' | 'songs')}
                            className="w-full bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 focus:border-[var(--accent-primary)] focus:outline-none"
                        >
                            <option value="shows">Shows</option>
                            <option value="songs">Songs</option>
                            <option value="performances" disabled>Performances (coming soon)</option>
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
                            className="flex-1 bg-[var(--accent-primary)] text-[var(--text-inverse)] px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase hover:bg-[var(--accent-secondary)] disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : editList ? 'Update List' : 'Create List'}
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
