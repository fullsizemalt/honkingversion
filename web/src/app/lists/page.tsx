'use client';

import { useEffect, useState } from 'react';
import ListCard from '@/components/ListCard';
import { getApiEndpoint } from '@/lib/api';
import CreateListButton from '@/components/CreateListButton';
import PageHeader from '@/components/PageHeader';

interface ListsData {
    id: number;
    title: string;
    description?: string;
    username: string;
    show_count: number;
    created_at?: string;
    items?: string | any[];
    list_type?: string;
    follower_count?: number;
    is_following?: boolean;
}

export default function ListsPage() {
    const [lists, setLists] = useState<ListsData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLists = async () => {
            try {
                const res = await fetch(getApiEndpoint('/lists/'), { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setLists(data);
                }
            } catch (e) {
                console.error("Failed to fetch lists", e);
            } finally {
                setLoading(false);
            }
        };
        getLists();
    }, []);

    return (
        <>
            <PageHeader
                title="Lists"
                description="Discover curated collections of shows from the community"
                loggedInMessage="Create your own lists or explore lists from other users."
            />

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header with Create Button */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider">
                            {lists.length} list{lists.length !== 1 ? 's' : ''} available
                        </p>
                    </div>
                    <CreateListButton />
                </div>

                {/* Lists Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 animate-pulse" />
                        ))}
                    </div>
                ) : lists.length === 0 ? (
                    <div className="p-12 border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-center">
                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-secondary)] mb-2">
                            No lists yet
                        </h3>
                        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            Be the first to create a curated list!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lists.map((list) => (
                            <ListCard
                                key={list.id}
                                list={{
                                    ...list,
                                    items: list.items || '[]',
                                    list_type: (list.list_type as any) || 'shows',
                                    user_id: 0,
                                }}
                                showFollowButton
                                isOwner={false}
                                initialFollowerCount={list.follower_count ?? 0}
                                initialIsFollowing={list.is_following ?? false}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
