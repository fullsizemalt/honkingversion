import { Metadata } from 'next';
import { getApiEndpoint } from '@/lib/api';
import UserCard from '@/components/UserCard';
import PageHeader from '@/components/PageHeader';

interface Props {
    params: {
        username: string;
    };
}

async function getFollowers(username: string) {
    const res = await fetch(getApiEndpoint(`/follows/${username}/followers`), {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch followers');
    }

    return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = params;
    return {
        title: `Followers of ${username} - Honkingversion`,
    };
}

export default async function FollowersPage({ params }: Props) {
    const { username } = params;
    const followers = await getFollowers(username);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pb-20">
            <PageHeader
                title={`Followers of ${username}`}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: username, href: `/u/${username}` },
                    { label: 'Followers', href: `/u/${username}/followers` },
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {followers.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-[var(--border)] bg-[var(--bg-secondary)]/50">
                        <p className="text-[var(--text-secondary)]">No followers yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {followers.map((user: any) => (
                            <UserCard
                                key={user.id}
                                user={{
                                    ...user,
                                    // We might need to fetch "is_following" status for each user if the API doesn't return it
                                    // For now, the FollowButton handles its own state check
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
