'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getApiEndpoint } from '@/lib/api';
import { UserList } from '@/types/list';
import ListCard from '@/components/ListCard';
import { useSession } from 'next-auth/react';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function UserListsPage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;
    const { data: session } = useSession();
    const [lists, setLists] = useState<UserList[]>([]);
    const [loading, setLoading] = useState(true);

    const isOwner = session?.user?.name === username;

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const res = await fetch(getApiEndpoint(`/lists/user/${username}`));
                if (res.ok) {
                    const data = await res.json();
                    setLists(data);
                }
            } catch (error) {
                console.error('Failed to fetch lists', error);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchLists();
        }
    }, [username]);

    const handleDelete = async (listId: number) => {
        if (!confirm('Are you sure you want to delete this list?')) {
            return;
        }

        try {
            const res = await fetch(getApiEndpoint(`/lists/${listId}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`
                }
            });

            if (res.ok) {
                setLists(lists.filter(list => list.id !== listId));
            } else {
                alert('Failed to delete list.');
            }
        } catch (error) {
            console.error('Failed to delete list', error);
            alert('An unexpected error occurred while deleting the list.');
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link href={`/u/${username}`} className="text-[#a0a0a0] hover:text-[#f5f5f5]">
                            ← Back to Profile
                        </Link>
                        <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f5f5f5]">
                            {username}'s Lists
                        </h1>
                    </div>
                    {isOwner && (
                        <button
                            onClick={() => router.push('/lists/create')}
                            className="flex items-center gap-2 px-4 py-2 border border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-inverse)] transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider">Create New List</span>
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-[#a0a0a0]">Loading lists...</div>
                ) : lists.length > 0 ? (
                    <div className="grid gap-4">
                        {lists.map((list) => (
                            <div key={list.id} className="flex items-center gap-4">
                                <div className="flex-grow">
                                    <ListCard list={list} />
                                </div>
                                {isOwner && (
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => router.push(`/lists/${list.id}/edit`)} className="p-2 hover:text-[var(--accent-primary)]">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(list.id)} className="p-2 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-[#a0a0a0] mb-4">No lists created yet.</p>
                        {isOwner && (
                            <button
                                onClick={() => router.push('/lists/create')}
                                className="flex items-center gap-2 mx-auto px-4 py-2 border border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-inverse)] transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider">Create Your First List</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
