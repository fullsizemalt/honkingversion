'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';
import { useToast } from './ToastContainer';

interface FollowButtonProps {
    username: string;
    initialIsFollowing?: boolean;
}

export default function FollowButton({ username, initialIsFollowing = false }: FollowButtonProps) {
    const { data: session } = useSession();
    const { addToast } = useToast();
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkFollowing = async () => {
            const token = session?.user?.accessToken;
            if (!token) return;

            try {
                const res = await fetch(getApiEndpoint(`/follows/check/${username}`), {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setIsFollowing(data.is_following);
                }
            } catch (error) {
                console.error('Failed to check following status', error);
            }
        };

        checkFollowing();
    }, [session, username]);

    const toggleFollow = async () => {
        const token = session?.user?.accessToken;
        if (!token) return;

        setLoading(true);
        try {
            const method = isFollowing ? 'DELETE' : 'POST';
            const res = await fetch(getApiEndpoint(`/follows/${username}`), {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setIsFollowing(!isFollowing);
                const message = isFollowing ? `Unfollowed ${username}` : `Now following ${username}`;
                addToast(message, 'success');
            } else {
                addToast(`Failed to ${isFollowing ? 'unfollow' : 'follow'} ${username}`, 'error');
            }
        } catch (error) {
            console.error('Failed to toggle follow', error);
            addToast('Failed to update follow status', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!session) return null;

    return (
        <button
            onClick={toggleFollow}
            disabled={loading}
            className={`border px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase transition-colors ${isFollowing
                    ? 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'
                    : 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-secondary)]'
                }`}
        >
            {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
        </button>
    );
}
