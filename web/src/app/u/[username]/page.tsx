import { notFound } from "next/navigation";
import ProfileHeader from "@/components/ProfileHeader";
import ActivityFeed from "@/components/ActivityFeed";
import { getApiEndpoint } from '@/lib/api';
import { User, Review } from "@/types";

// Mock data fetcher (replace with API call)
async function getUser(username: string): Promise<User | null> {
    try {
        const res = await fetch(getApiEndpoint(`/ users / ${username} `), { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Failed to fetch user", error);
        return null;
    }
}

async function getUserReviews(username: string): Promise<Review[]> {
    try {
        const res = await fetch(getApiEndpoint(`/ votes / user / ${username} `), { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch user reviews", error);
        return [];
    }
}

interface PageProps {
    params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params;
    const user = await getUser(username);

    if (!user) {
        notFound();
    }

    const reviews = await getUserReviews(username);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <ProfileHeader user={user} isCurrentUser={false} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ActivityFeed activities={reviews} title={`${user.username} 's Activity`} />
                    </div >

                    <div className="lg:col-span-1">
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6">
                            <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] mb-4 uppercase">
                                Stats
                            </h3>
                            <div className="space-y-4 font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Shows Attended</span>
                                    <span className="text-[var(--text-primary)] font-bold">{user.stats?.shows_attended}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--text-secondary)]">Reviews Written</span>
                                    <span className="text-[var(--text-primary)] font-bold">{user.stats?.reviews_count}</span>
                                </div>
                                <div className="border-t border-[var(--border)] pt-4 mt-4">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Member Since</span>
                                        <span className="text-[var(--text-primary)]">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
}
