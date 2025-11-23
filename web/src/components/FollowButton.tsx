'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';

interface FollowButtonProps {
    username: string;
    initialIsFollowing?: boolean;
}

export default function FollowButton({ username, initialIsFollowing = false }: FollowButtonProps) {
    const { data: session } = useSession();
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkFollowing = async () => {
            if (!session?.accessToken) return;

            try {
                const res = await fetch(getApiEndpoint(`/follows/check/${username}`), {
                    headers: {
                        'Authorization': `Bearer ${session.accessToken}`
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
        if (!session?.accessToken) return;

        setLoading(true);
        try {
            const method = isFollowing ? 'DELETE' : 'POST';
            const res = await fetch(getApiEndpoint(`/follows/${username}`), {
                method,
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`
                }
            });

            if (res.ok) {
                setIsFollowing(!isFollowing);
            }
        } catch (error) {
            console.error('Failed to toggle follow', error);
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
                    ? 'border-[#333] text-[#a0a0a0] hover:border-[#ff6b35] hover:text-[#ff6b35]'
                    : 'border-[#ff6b35] bg-[#ff6b35] text-[#0a0a0a] hover:bg-[#f7931e]'
                }`}
        >
            {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
        </button>
    );
}
