'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Users, Heart } from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';
import ListCard from './ListCard';
import { UserList } from '@/types/list';

interface ListsSectionProps {
    lists: UserList[];
    username: string;
}

export default function ListsSection({ lists: initialLists, username }: ListsSectionProps) {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<'created' | 'followed'>('created');
    const [followedLists, setFollowedLists] = useState<UserList[]>([]);
    const [loadingFollowed, setLoadingFollowed] = useState(false);

    const isCurrentUser = (session?.user as any)?.username === username;

    useEffect(() => {
        if (activeTab === 'followed' && isCurrentUser && followedLists.length === 0) {
            const fetchFollowedLists = async () => {
                setLoadingFollowed(true);
                try {
                    const headers: HeadersInit = {};
                    if (session?.user?.accessToken) {
                        headers['Authorization'] = `Bearer ${session.user.accessToken}`;
                    }
                    const res = await fetch(getApiEndpoint('/lists/followed'), { headers });
                    if (res.ok) {
                        const data = await res.json();
                        setFollowedLists(data);
                    }
                } catch (error) {
                    console.error('Failed to fetch followed lists:', error);
                } finally {
                    setLoadingFollowed(false);
                }
            };
            fetchFollowedLists();
        }
    }, [activeTab, isCurrentUser, followedLists.length]);

    const displayLists = activeTab === 'created' ? initialLists : followedLists;

    return (
        <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setActiveTab('created')}
                        className={`font-[family-name:var(--font-space-grotesk)] text-sm font-bold uppercase tracking-[0.2em] transition-colors ${activeTab === 'created' ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                            }`}
                    >
                        Lists
                    </button>
                    {isCurrentUser && (
                        <button
                            onClick={() => setActiveTab('followed')}
                            className={`font-[family-name:var(--font-space-grotesk)] text-sm font-bold uppercase tracking-[0.2em] transition-colors ${activeTab === 'followed' ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                                }`}
                        >
                            Followed
                        </button>
                    )}
                </div>

                {activeTab === 'created' && (
                    <Link
                        href={`/u/${username}/lists`}
                        className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors"
                    >
                        View All →
                    </Link>
                )}
            </div>

            <div className="space-y-3">
                {loadingFollowed ? (
                    <div className="text-center py-8 text-[var(--text-tertiary)] animate-pulse">
                        Loading...
                    </div>
                ) : displayLists.length > 0 ? (
                    displayLists.slice(0, 5).map((list, index) => (
                        <div
                            key={list.id}
                            style={{
                                animationDelay: `${index * 50}ms`,
                                animation: 'slideIn 0.3s ease-out forwards',
                                opacity: 0
                            }}
                        >
                            <ListCard
                                list={list}
                                showFollowButton
                                isOwner={isCurrentUser && list.user_id === session?.user?.id}
                                initialFollowerCount={list.follower_count ?? 0}
                                initialIsFollowing={list.is_following ?? false}
                            />
                        </div>
                    ))
                ) : (
                    <div className="p-12 border border-[var(--border-subtle)] border-dashed text-center">
                        {activeTab === 'created' ? (
                            <>
                                <Users className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
                                <p className="text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                                    No lists created yet.
                                </p>
                            </>
                        ) : (
                            <>
                                <Heart className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
                                <p className="text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                                    You haven't followed any lists yet.
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}
