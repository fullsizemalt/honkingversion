'use client';

import Link from 'next/link';
import { User } from '@/types';
import FollowButton from './FollowButton';

interface UserCardProps {
    user: {
        id: number;
        username: string;
        display_name?: string;
        profile_picture_url?: string;
        bio?: string;
        is_following?: boolean;
    };
    showBio?: boolean;
}

export default function UserCard({ user, showBio = true }: UserCardProps) {
    return (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-4 flex items-center gap-4 transition-all hover:border-[var(--accent-primary)]/50">
            <Link href={`/u/${user.username}`} className="shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] p-0.5">
                    <div className="w-full h-full bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden">
                        {user.profile_picture_url ? (
                            <img
                                src={user.profile_picture_url}
                                alt={user.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)]">
                                {user.username.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <Link href={`/u/${user.username}`} className="truncate hover:text-[var(--accent-primary)] transition-colors">
                        <h3 className="font-bold text-[var(--text-primary)] truncate">
                            {user.display_name || user.username}
                        </h3>
                        <p className="text-xs text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] truncate">
                            @{user.username}
                        </p>
                    </Link>
                    <FollowButton username={user.username} initialIsFollowing={user.is_following} />
                </div>

                {showBio && user.bio && (
                    <p className="mt-2 text-sm text-[var(--text-secondary)] line-clamp-2">
                        {user.bio}
                    </p>
                )}
            </div>
        </div>
    );
}
