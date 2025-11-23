'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ProfileHeader from "@/components/ProfileHeader"
import ActivityFeed from "@/components/ActivityFeed"
import { User, Review } from "@/types"

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
        } else if (status === "authenticated" && session?.user) {
            fetchUserData()
        }
    }, [status, session, router])

    const fetchUserData = async () => {
        try {
            // Fetch user data from API
            const userRes = await fetch('http://localhost:8000/users/me');
            if (!userRes.ok) {
                throw new Error('Failed to fetch user');
            }
            const userData = await userRes.json();
            setUser(userData);

            // Fetch user reviews
            if (userData.username) {
                const reviewsRes = await fetch(`http://localhost:8000/votes/user/${userData.username}`);
                if (reviewsRes.ok) {
                    const reviewsData = await reviewsRes.json();
                    setReviews(reviewsData);
                }
            }
        } catch (error) {
            console.error("Failed to fetch user data", error)
        } finally {
            setLoading(false)
        }
    }

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
                            <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] mb-4 uppercase">
                                Your Lists
                            </h3>
                            <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                                Coming soon...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
