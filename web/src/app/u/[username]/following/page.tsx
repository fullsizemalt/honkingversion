import { Metadata } from 'next';
import { getApiEndpoint } from '@/lib/api';
import UserCard from '@/components/UserCard';
import PageHeader from '@/components/PageHeader';

interface Props {
    params: Promise<{
        username: string;
    }>;
}

async function getFollowing(username: string) {
    const res = await fetch(getApiEndpoint(`/follows/${username}/following`), {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch following');
    }

    return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params;
    return {
        title: `People followed by ${username} - Honkingversion`,
    };
}

export default async function FollowingPage({ params }: Props) {
    const { username } = await params;
    const following = await getFollowing(username);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
            <PageHeader
                title={`People followed by ${username}`}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: username, href: `/u/${username}` },
                    { label: 'Following', href: `/u/${username}/following` },
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {following.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[var(--border)] bg-[var(--bg-secondary)]/50">
                        <p className="text-[var(--text-secondary)]">Not following anyone yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {following.map((user: any) => (
                            <UserCard
                                key={user.id}
                                user={{
                                    ...user,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
