import Link from "next/link";
import { getApiEndpoint } from '@/lib/api';

interface UserSummary {
    id: number;
    username: string;
    created_at: string;
}

async function getFollowing(username: string): Promise<UserSummary[]> {
    try {
        const res = await fetch(getApiEndpoint(`/follows/${username}/following`), { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch following", error);
        return [];
    }
}

interface PageProps {
    params: Promise<{ username: string }>;
}

export default async function FollowingPage({ params }: PageProps) {
    const { username } = await params;
    const following = await getFollowing(username);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#f5f5f5] mb-8">
                    {username} is Following
                </h1>

                {following.length > 0 ? (
                    <div className="space-y-2">
                        {following.map((user) => (
                            <Link
                                key={user.id}
                                href={`/u/${user.username}`}
                                className="block bg-[#1a1a1a] border border-[#333] p-4 hover:border-[#ff6b35] transition-colors group"
                            >
                                <div className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[#f5f5f5] group-hover:text-[#ff6b35]">
                                    {user.username}
                                </div>
                                <div className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0]">
                                    Member since {new Date(user.created_at).toLocaleDateString()}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-[#a0a0a0] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                        Not following anyone yet.
                    </div>
                )}
            </div>
        </div>
    );
}
