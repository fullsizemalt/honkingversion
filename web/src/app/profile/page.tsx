'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getApiEndpoint } from '@/lib/api';
import ProfileHeader from '@/components/ProfileHeader';
import StatsCard from '@/components/StatsCard';
import ActivityFeed from '@/components/ActivityFeed';
import ListsSection from '@/components/ListsSection';
import BadgeShowcase from '@/components/BadgeShowcase';

interface ProfileData {
    user: {
        id: number;
        username: string;
        display_name?: string;
        bio?: string;
        profile_picture_url?: string;
        role: string;
        created_at: string;
        social_links?: {
            bluesky?: string;
            instagram?: string;
            custom_url?: string;
        };
    };
    stats: {
        shows_attended: number;
        total_votes: number;
        lists_created: number;
        followers: number;
        following: number;
    };
    selected_title?: {
        title_name: string;
        color: string;
        icon?: string;
    } | null;
    badges: any[];
    recent_activity: any[];
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [lists, setLists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activityFilter, setActivityFilter] = useState('all');
    const [activityPage, setActivityPage] = useState(0);
    const [hasMoreActivity, setHasMoreActivity] = useState(true);
    const [loadingMoreActivity, setLoadingMoreActivity] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
            return;
        }

        if (status === 'authenticated' && session?.user?.name) {
            fetchProfileData(session.user.name);
        }
    }, [status, session, router]);

    const fetchProfileData = async (username: string) => {
        try {
            // Fetch profile data
            const profileRes = await fetch(getApiEndpoint(`/profile/${username}`));
            if (profileRes.ok) {
                const data = await profileRes.json();
                setProfileData(data);
            }

            // Fetch user lists
            const listsRes = await fetch(getApiEndpoint(`/lists/user/${username}`));
            if (listsRes.ok) {
                const listsData = await listsRes.json();
                setLists(listsData || []);
            }
        } catch (error) {
            console.error('Failed to fetch profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchActivity = async (username: string, filter: string, page: number = 0) => {
        try {
            if (page > 0) setLoadingMoreActivity(true);

            const offset = page * 20;
            const res = await fetch(getApiEndpoint(`/profile/${username}/activity?filter=${filter}&offset=${offset}&limit=20`));

            if (res.ok) {
                const data = await res.json();

                if (data.length < 20) {
                    setHasMoreActivity(false);
                } else {
                    setHasMoreActivity(true);
                }

                setProfileData(prev => {
                    if (!prev) return null;

                    // If page 0, replace. If page > 0, append.
                    const newActivity = page === 0 ? data : [...prev.recent_activity, ...data];

                    // Deduplicate just in case
                    const uniqueActivity = Array.from(new Map(newActivity.map((item: any) => [item.id, item])).values());

                    return { ...prev, recent_activity: uniqueActivity };
                });
            }
        } catch (error) {
            console.error('Failed to fetch activity:', error);
        } finally {
            setLoadingMoreActivity(false);
        }
    };

    const handleFilterChange = (filter: string) => {
        setActivityFilter(filter);
        setActivityPage(0);
        setHasMoreActivity(true);
        if (profileData?.user?.username) {
            fetchActivity(profileData.user.username, filter, 0);
        }
    };

    const handleLoadMoreActivity = () => {
        if (profileData?.user?.username) {
            const nextPage = activityPage + 1;
            setActivityPage(nextPage);
            fetchActivity(profileData.user.username, activityFilter, nextPage);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="text-center">
                    <div className="inline-block w-8 h-8 border-4 border-[var(--accent-primary)] border-t-transparent animate-spin mb-4"></div>
                    <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-tertiary)]">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <p className="text-[var(--text-secondary)]">Profile not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Profile Header */}
            <ProfileHeader
                user={profileData.user}
                selectedTitle={profileData.selected_title}
                isCurrentUser={true}
            />

            {/* Three-Column Layout */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar - Stats */}
                    <div className="lg:col-span-3 space-y-6">
                        <StatsCard stats={profileData.stats} />
                        <BadgeShowcase
                            badges={profileData.badges || []}
                            username={profileData.user.username}
                        />
                    </div>

                    {/* Main Content - Activity Feed */}
                    <div className="lg:col-span-6">
                        <ActivityFeed
                            activities={profileData.recent_activity}
                            title="Your Recent Activity"
                            currentFilter={activityFilter}
                            onFilterChange={handleFilterChange}
                            onLoadMore={handleLoadMoreActivity}
                            hasMore={hasMoreActivity}
                            loadingMore={loadingMoreActivity}
                        />
                    </div>

                    {/* Right Sidebar - Lists */}
                    <div className="lg:col-span-3 space-y-6">
                        <ListsSection
                            lists={lists}
                            username={profileData.user.username}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
