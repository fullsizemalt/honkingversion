'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getApiEndpoint } from '@/lib/api';
import { UserList } from '@/types/list';
import ListCard from '@/components/ListCard';

export default function UserListsPage() {
    const params = useParams();
    const username = params.username as string;
    const [lists, setLists] = useState<UserList[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href={`/u/${username}`} className="text-[#a0a0a0] hover:text-[#f5f5f5]">
                        ← Back to Profile
                    </Link>
                    <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f5f5f5]">
                        {username}'s Lists
                    </h1>
                </div>

                {loading ? (
                    <div className="text-[#a0a0a0]">Loading lists...</div>
                ) : lists.length > 0 ? (
                    <div className="grid gap-4">
                        {lists.map((list) => (
                            <ListCard key={list.id} list={list} username={username} />
                        ))}
                    </div>
                ) : (
                    <div className="text-[#a0a0a0]">No lists created yet.</div>
                )}
            </div>
        </div>
    );
}
