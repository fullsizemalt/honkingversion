'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { getApiEndpoint } from '@/lib/api'
import { Notification } from '@/types'
import MarkAllReadButton from '@/components/MarkAllReadButton'
import PageHeader from '@/components/PageHeader'

async function fetchNotifications(token: string): Promise<Notification[]> {
    const res = await fetch(getApiEndpoint('/notifications'), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
}

export default function NotificationsPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!session?.user?.accessToken) {
            router.push('/auth/signin')
            return
        }

        const loadNotifications = async () => {
            const data = await fetchNotifications(session.user.accessToken || '')
            setNotifications(data)
            setLoading(false)
        }
        loadNotifications()
    }, [session, router])

    if (!session) {
        return null
    }

    const unreadCount = notifications.filter(n => !n.read_at).length

    return (
        <>
            <PageHeader
                title="Notifications"
                description="Stay updated with activity from users you follow"
                loggedInMessage="View your notifications and activity."
            />

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header with Action Button */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider">
                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/notifications/settings"
                            className="text-sm text-[var(--accent-primary)] underline underline-offset-4 font-[family-name:var(--font-space-grotesk)]"
                        >
                            Preferences
                        </Link>
                        {unreadCount > 0 && session?.user?.accessToken && (
                            <MarkAllReadButton token={session.user.accessToken} />
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 animate-pulse rounded" />
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded text-center">
                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-secondary)] mb-2">
                            No notifications
                        </h3>
                        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            Follow users to get notified about their activity.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`p-4 border transition-colors ${n.read_at
                                        ? 'border-[var(--border-subtle)] bg-[var(--bg-secondary)]'
                                        : 'border-[var(--accent-primary)] bg-[var(--bg-secondary)]'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-ibm-plex-mono)]">
                                        <span className={`${n.read_at ? 'text-[var(--text-tertiary)]' : 'text-[var(--accent-primary)]'} mr-2 uppercase text-xs font-bold`}>
                                            {n.type}
                                        </span>
                                        {n.actor_username ? `${n.actor_username} ` : ''}on {n.object_type} #{n.object_id}
                                    </div>
                                    <div className="text-[10px] text-[var(--text-tertiary)]">
                                        {new Date(n.created_at).toLocaleString()}
                                    </div>
                                </div>
                                {!n.read_at && (
                                    <div className="text-[10px] text-[var(--accent-primary)] mt-2 font-bold uppercase">
                                        Unread
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
