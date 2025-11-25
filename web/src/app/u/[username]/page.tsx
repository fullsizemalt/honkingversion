'use client';
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/ProfileHeader";
import PublicActivityFeed from "@/components/PublicActivityFeed";
import ListCard from "@/components/ListCard";
import BadgeShowcase from "@/components/BadgeShowcase";
import { getApiEndpoint } from '@/lib/api';
import { User, Review } from "@/types";
import { UserList } from "@/types/list";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { LineChart } from "@/components/charts/LineChart";

// Mock data fetcher (replace with API call)
async function getUser(username: string): Promise<User | null> {
    try {
        const res = await fetch(getApiEndpoint(`/users/${username}`), { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Failed to fetch user", error);
        return null;
    }
}

async function getUserReviews(username: string): Promise<Review[]> {
    try {
        const res = await fetch(getApiEndpoint(`/votes/user/${username}`), { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch user reviews", error);
        return [];
    }
}

async function getUserLists(username: string): Promise<UserList[]> {
    try {
        const res = await fetch(getApiEndpoint(`/lists/user/${username}`), { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch user lists", error);
        return [];
    }
}

interface AttendedShow {
    show_id: number;
    date: string;
    venue: string;
    location: string;
    created_at: string;
}

async function getUserAttendedShows(username: string): Promise<AttendedShow[]> {
    try {
        const res = await fetch(getApiEndpoint(`/attended/user/${username}`), { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error("Failed to fetch attended shows", error);
        return [];
    }
}

interface Badge {
    id: number;
    badge_name: string;
    badge_description?: string;
    badge_icon: string;
    unlock_criteria?: string;
    earned_at: string;
}

async function getUserBadges(username: string): Promise<Badge[]> {
    try {
        const res = await fetch(getApiEndpoint(`/profile/${username}`), { cache: 'no-store' });
        if (!res.ok) return [];
        const data = await res.json();
        return data.badges || [];
    } catch (error) {
        console.error("Failed to fetch user badges", error);
        return [];
    }
}

type PageParams = { username: string };
type PageProps = { params?: Promise<PageParams> };

export default function PublicProfilePage({ params }: PageProps) {
    const { data: session } = useSession();
    const [username, setUsername] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [lists, setLists] = useState<UserList[]>([]);
    const [attendedShows, setAttendedShows] = useState<AttendedShow[]>([]);
    const [badges, setBadges] = useState<Badge[]>([]);

    const reviewActivity = useMemo(() => {
        if (!reviews.length) return [];
        // bucket reviews into last 8 weeks
        const now = new Date();
        const buckets = Array(8).fill(0);
        reviews.forEach((rev) => {
            const d = new Date(rev.created_at);
            const diffWeeks = Math.floor((now.getTime() - d.getTime()) / (7 * 24 * 60 * 60 * 1000));
            if (diffWeeks >= 0 && diffWeeks < buckets.length) {
                buckets[buckets.length - diffWeeks - 1] += 1;
            }
        });
        return buckets;
    }, [reviews]);

    useEffect(() => {
        const fetchData = async () => {
            const resolvedParams = params ? await Promise.resolve(params) : { username: '' };
            const usernameValue = resolvedParams.username;
            setUsername(usernameValue);

            const userData = await getUser(usernameValue);
            if (!userData) {
                notFound();
                return;
            }
            setUser(userData);
            setReviews(await getUserReviews(usernameValue));
            setLists(await getUserLists(usernameValue));
            setAttendedShows(await getUserAttendedShows(usernameValue));
            setBadges(await getUserBadges(usernameValue));
        };
        fetchData();
    }, [params]);

    if (!user || !username) {
        return <div>Loading...</div>; // Or a proper loading skeleton
    }

    const isCurrentUser = session?.user?.name === username;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <ProfileHeader user={user} isCurrentUser={isCurrentUser} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <PublicActivityFeed
                            initialActivities={reviews}
                            username={user.username}
                            title={`${user.username}'s Activity`}
                        />
                    </div >

                    <div className="lg:col-span-1">
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 mb-8">
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
                                <div className="flex justify-between">
                                    <a href={`/u/${user.username}/followers`} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Followers</a>
                                    <span className="text-[var(--text-primary)] font-bold">{user.stats?.followers_count ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <a href={`/u/${user.username}/following`} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Following</a>
                                    <span className="text-[var(--text-primary)] font-bold">{user.stats?.following_count ?? 0}</span>
                                </div>
                                <div className="border-t border-[var(--border)] pt-4 mt-4">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--text-secondary)]">Member Since</span>
                                        <span className="text-[var(--text-primary)]">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                {reviewActivity.length > 0 && (
                                    <div className="border-t border-[var(--border)] pt-4 mt-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[var(--text-secondary)]">Review Activity</span>
                                            <span className="text-[var(--text-primary)] font-bold">last 8 wks</span>
                                        </div>
                                        <LineChart
                                            series={[{ label: "Reviews", values: reviewActivity, color: "var(--accent-primary)" }]}
                                            height={72}
                                            width={220}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <BadgeShowcase
                            badges={badges}
                            username={user.username}
                        />

                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] uppercase">
                                    Lists
                                </h3>
                                <a href={`/u/${user.username}/lists`} className="text-xs font-[family-name:var(--font-ibm-plex-mono)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] uppercase tracking-wider">
                                    View All
                                </a>
                            </div>
                            <div className="space-y-4">
                                {lists.length > 0 ? (
                                    lists.slice(0, 3).map((list) => (
                                        <ListCard key={list.id} list={list} />
                                    ))
                                ) : (
                                    <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                                        No lists yet.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Attended Shows */}
                        {attendedShows.length > 0 && (
                            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 mt-8">
                                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] mb-4 uppercase">
                                    Shows Attended ({attendedShows.length})
                                </h3>
                                <div className="space-y-2">
                                    {attendedShows.slice(0, 5).map((show) => (
                                        <a
                                            key={show.show_id}
                                            href={`/shows/${show.date}`}
                                            className="block bg-[#1a1a1a] border border-[#333] p-3 hover:border-[#ff6b35] transition-colors group"
                                        >
                                            <div className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[#f5f5f5] group-hover:text-[#ff6b35]">
                                                {show.date}
                                            </div>
                                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0]">
                                                {show.venue} · {show.location}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
