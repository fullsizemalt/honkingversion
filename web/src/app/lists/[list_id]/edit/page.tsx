'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import { UserList } from '@/types/list';

export default function EditListPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const listId = params.list_id;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!listId || !session) return;

        const fetchList = async () => {
            try {
                const res = await fetch(getApiEndpoint(`/lists/${listId}`), {
                    headers: {
                        'Authorization': `Bearer ${session.user.accessToken}`
                    }
                });
                if (res.ok) {
                    const list: UserList = await res.json();
                    setTitle(list.title);
                    setDescription(list.description || '');
                    setIsPublic(list.is_public);
                } else {
                    setError('Failed to fetch list data.');
                }
            } catch (err) {
                setError('An unexpected error occurred.');
            }
        };

        fetchList();
    }, [listId, session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            setError('You must be logged in to edit a list.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(getApiEndpoint(`/lists/${listId}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.accessToken}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    is_public: isPublic,
                    // Note: 'items' and 'list_type' are not editable in this form
                })
            });

            if (res.ok) {
                router.push(`/u/${session.user.name}/lists`);
            } else {
                const errorData = await res.json();
                setError(errorData.detail || 'Failed to update list.');
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <PageHeader title="Edit List" />

            <div className="max-w-2xl mx-auto px-4 py-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-[var(--text-secondary)]">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)]">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] sm:text-sm"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            id="isPublic"
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="h-4 w-4 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)] border-gray-300 rounded"
                        />
                        <label htmlFor="isPublic" className="ml-2 block text-sm text-[var(--text-secondary)]">
                            Make this list public
                        </label>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)] disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
