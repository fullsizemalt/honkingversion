'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';

interface ListFollowButtonProps {
    listId: number;
    initialIsFollowing: boolean;
    initialFollowerCount: number;
    isOwner: boolean;
}

export default function ListFollowButton({
    listId,
    initialIsFollowing,
    initialFollowerCount,
    isOwner
}: ListFollowButtonProps) {
    const { data: session } = useSession();
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [followerCount, setFollowerCount] = useState(initialFollowerCount);
    const [loading, setLoading] = useState(false);

    const handleToggleFollow = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) return;
        if (loading) return;

        setLoading(true);
        try {
            const method = isFollowing ? 'DELETE' : 'POST';
            const res = await fetch(getApiEndpoint(`/lists/${listId}/follow`), {
                method,
                headers: session.user?.accessToken
                    ? { 'Authorization': `Bearer ${session.user.accessToken}` }
                    : undefined,
            });

            if (res.ok) {
                setIsFollowing(!isFollowing);
                setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
            }
        } catch (error) {
            console.error('Failed to toggle follow:', error);
        } finally {
            setLoading(false);
        }
    };

    if (isOwner) return null;

    return (
        <button
            onClick={handleToggleFollow}
            disabled={!session || loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wider transition-all ${isFollowing
                    ? 'bg-[var(--accent-primary)] text-white border border-[var(--accent-primary)]'
                    : 'bg-transparent text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'
                } ${(!session || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <Heart className={`w-3 h-3 ${isFollowing ? 'fill-current' : ''}`} />
            {followerCount}
        </button>
    );
}
