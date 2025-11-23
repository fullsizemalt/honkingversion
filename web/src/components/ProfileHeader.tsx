import { User } from '@/types';
import FollowButton from './FollowButton';

interface ProfileHeaderProps {
    user: User;
    isCurrentUser?: boolean;
    onFollow?: () => void; // Deprecated but kept for compatibility if needed
    isFollowing?: boolean;
}

export default function ProfileHeader({ user, isCurrentUser, isFollowing = false }: ProfileHeaderProps) {
    return (
        <div className="bg-[#1a1a1a] border border-[#333] p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-[#333] rounded-full flex items-center justify-center">
                        <span className="font-[family-name:var(--font-space-grotesk)] text-4xl text-[#f5f5f5] uppercase">
                            {user.username.slice(0, 2)}
                        </span>
                    </div>
                    <div>
                        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#f5f5f5] mb-2">
                            {user.username}
                        </h1>
                        <div className="flex gap-4 text-sm font-[family-name:var(--font-ibm-plex-mono)] text-[#a0a0a0]">
                            <div>
                                <span className="text-[#f5f5f5] font-bold">{user.stats?.shows_attended || 0}</span> Shows
                            </div>
                            <div>
                                <span className="text-[#f5f5f5] font-bold">{user.stats?.reviews_count || 0}</span> Reviews
                            </div>
                            <div>
                                <span className="text-[#f5f5f5] font-bold">{user.stats?.followers_count || 0}</span> Followers
                            </div>
                            <div>
                                <span className="text-[#f5f5f5] font-bold">{user.stats?.following_count || 0}</span> Following
                            </div>
                        </div>
                    </div>
                </div>

                {!isCurrentUser && (
                    <FollowButton username={user.username} initialIsFollowing={isFollowing} />
                )}

                {isCurrentUser && (
                    <button
                        className="px-6 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider bg-transparent border border-[#333] text-[#a0a0a0] hover:border-[#f5f5f5] hover:text-[#f5f5f5]"
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
}
