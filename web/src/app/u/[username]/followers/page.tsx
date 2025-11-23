import { notFound } from "next/navigation";
import Link from "next/link";
import { getApiEndpoint } from '@/lib/api';

interface UserSummary {
    id: number;
    username: string;
    created_at: string;
}

async function getFollowers(username: string): Promise<UserSummary[]> {
    try {
        const res = await fetch(getApiEndpoint(`/follows/${username}/followers`), { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch followers", error);
        return [];
    }
}

interface PageProps {
    params: Promise<{ username: string }>;
}

export default async function FollowersPage({ params }: PageProps) {
    const { username } = await params;
    const followers = await getFollowers(username);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[#f5f5f5] mb-8">
                    {username}'s Followers
                </h1>

                {followers.length > 0 ? (
                    <div className="space-y-2">
                        {followers.map((user) => (
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
                        No followers yet.
                    </div>
                )}
            </div>
        </div>
    );
}
