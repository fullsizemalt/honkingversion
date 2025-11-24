'use client'

import { getApiEndpoint } from '@/lib/api';
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import ProfileHeader from "@/components/ProfileHeader"
import ActivityFeed from "@/components/ActivityFeed"
import ListCard from "@/components/ListCard"
import ListEditor from "@/components/ListEditor"
import { User, Review } from "@/types"
import { UserList } from "@/types/list"


export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [lists, setLists] = useState<UserList[]>([])
    const [loading, setLoading] = useState(true)
    const [showListEditor, setShowListEditor] = useState(false)

    const fetchUserData = useCallback(async () => {
        try {
            // Fetch user data from API
            const userRes = await fetch(getApiEndpoint('/users/me'), {
                headers: { 'Authorization': `Bearer ${session?.user?.accessToken}` }
            });
            if (!userRes.ok) {
                throw new Error('Failed to fetch user');
            }
            const userData = await userRes.json();
            setUser(userData);

            // Fetch user reviews
            if (userData.username) {
                const reviewsRes = await fetch(getApiEndpoint(`/votes/user/${userData.username}`));
                if (reviewsRes.ok) {
                    const reviewsData = await reviewsRes.json();
                    setReviews(reviewsData);
                }

                // Fetch user lists
                const listsRes = await fetch(getApiEndpoint(`/lists/user/${userData.username}`));
                if (listsRes.ok) {
                    const listsData = await listsRes.json();
                    const normalized = (listsData || []).map((l: any) => ({
                        ...l,
                        items: l.items || '[]',
                        list_type: l.list_type || 'shows',
                        user_id: l.user_id ?? 0,
                    }));
                    setLists(normalized);
                }
            }
        } catch (error) {
            console.error("Failed to fetch user data", error)
        } finally {
            setLoading(false)
        }
    }, [session?.user?.accessToken])

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
        } else if (status === "authenticated" && session?.user) {
            fetchUserData()
        }
    }, [status, session, router, fetchUserData])

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[var(--accent-primary)] animate-pulse">
                    LOADING PROFILE...
                </div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <ProfileHeader user={user} isCurrentUser={true} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <ActivityFeed activities={reviews} title="Your Recent Activity" />
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] uppercase">
                                    Your Lists
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowListEditor(true)}
                                        className="bg-[#ff6b35] text-[#0a0a0a] px-3 py-1 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase hover:bg-[#f7931e]"
                                    >
                                        + New
                                    </button>
                                    <a href={`/u/${user.username}/lists`} className="text-xs font-[family-name:var(--font-ibm-plex-mono)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] uppercase tracking-wider flex items-center">
                                        View All
                                    </a>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {lists.length > 0 ? (
                                    lists.slice(0, 3).map((list) => (
                                        <ListCard key={list.id} list={list} />
                                    ))
                                ) : (
                                    <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                                        No lists yet. Create one to get started!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <ListEditor
                    isOpen={showListEditor}
                    onClose={() => setShowListEditor(false)}
                    onListSaved={(newList) => {
                        const normalized: UserList = {
                            id: newList.id || 0,
                            user_id: (newList as any).user_id ?? user?.id ?? 0,
                            title: newList.title,
                            description: newList.description,
                            items: newList.items || '[]',
                            list_type: (newList.list_type as UserList['list_type']) || 'shows',
                            share_token: (newList as any).share_token ?? null,
                            is_public: (newList as any).is_public ?? true,
                            created_at: (newList as any).created_at || new Date().toISOString(),
                        };
                        setLists([normalized, ...lists]);
                        setShowListEditor(false);
                    }}
                />
            </div>
        </div>
    )
}
