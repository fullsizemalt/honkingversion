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
    if (!res.ok) {
        const detail = await res.text().catch(() => '')
        throw new Error(detail || `Failed to fetch notifications (${res.status})`)
    }
    return res.json()
}

export default function NotificationsPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [banner, setBanner] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
    const grouped = notifications.reduce<Record<string, { first: Notification; count: number }>>((acc, n) => {
        const key = `${n.type}-${n.object_type}-${n.object_id}`
        if (!acc[key]) {
            acc[key] = { first: n, count: 1 }
        } else {
            acc[key].count += 1
        }
        return acc
    }, {})
    const groupedList = Object.values(grouped)
        .sort((a, b) => new Date(b.first.created_at).getTime() - new Date(a.first.created_at).getTime())

    useEffect(() => {
        if (!session?.user?.accessToken) {
            router.push('/auth/signin')
            return
        }

        let active = true
        const loadNotifications = async (showLoading?: boolean) => {
            if (showLoading) setLoading(true)
            setError(null)
            try {
                const data = await fetchNotifications(session.user.accessToken || '')
                if (!active) return
                setNotifications(data)
                setLastUpdated(new Date())
            } catch (err) {
                if (!active) return
                const message = err instanceof Error ? err.message : 'Unable to load notifications.'
                setError(message)
            } finally {
                if (active) setLoading(false)
            }
        }
        loadNotifications()
        const id = setInterval(loadNotifications, 30000)
        return () => {
            active = false
            clearInterval(id)
        }
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
                        {lastUpdated && (
                            <p className="text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] text-xs mt-1">
                                Last updated {lastUpdated.toLocaleTimeString()}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                if (session?.user?.accessToken) {
                                    // force a foreground refresh and show spinner
                                    const load = async () => {
                                        setLoading(true)
                                        setError(null)
                                        try {
                                            const data = await fetchNotifications(session.user.accessToken || '')
                                            setNotifications(data)
                                            setLastUpdated(new Date())
                                        } catch (err) {
                                            const message = err instanceof Error ? err.message : 'Unable to load notifications.'
                                            setError(message)
                                        } finally {
                                            setLoading(false)
                                        }
                                    }
                                    load()
                                }
                            }}
                            className="text-sm font-[family-name:var(--font-space-grotesk)] border border-[var(--border-strong)] px-3 py-1 rounded hover:border-[var(--accent-primary)] transition-colors"
                            disabled={loading}
                        >
                            {loading ? 'Refreshing…' : 'Refresh'}
                        </button>
                        <Link
                            href="/notifications/settings"
                            className="text-sm text-[var(--accent-primary)] underline underline-offset-4 font-[family-name:var(--font-space-grotesk)]"
                        >
                            Preferences
                        </Link>
                        {unreadCount > 0 && session?.user?.accessToken && (
                            <MarkAllReadButton
                                token={session.user.accessToken}
                                onSuccess={() => {
                                    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })))
                                    setBanner('All notifications marked as read.')
                                    setTimeout(() => setBanner(null), 2000)
                                }}
                            />
                        )}
                    </div>
                </div>

                {banner && (
                    <div className="mb-4 p-3 border border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/5 rounded font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                        {banner}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-3 border border-[var(--accent-danger)] text-[var(--accent-danger)] bg-[var(--accent-danger)]/5 rounded font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                        {error}
                    </div>
                )}

                {/* Notifications List */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 animate-pulse" />
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-center">
                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-secondary)] mb-2">
                            No notifications
                        </h3>
                        <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            Follow users to get notified about their activity.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {groupedList.map(({ first, count }) => (
                            <div
                                key={`${first.type}-${first.object_type}-${first.object_id}`}
                                className={`p-4 border transition-colors ${first.read_at
                                    ? 'border-[var(--border-subtle)] bg-[var(--bg-secondary)]'
                                    : 'border-[var(--accent-primary)] bg-[var(--bg-secondary)]'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-[var(--text-primary)] font-[family-name:var(--font-ibm-plex-mono)]">
                                        <span className={`${first.read_at ? 'text-[var(--text-tertiary)]' : 'text-[var(--accent-primary)]'} mr-2 uppercase text-xs font-bold`}>
                                            {first.type}
                                        </span>
                                        {first.actor_username ? `${first.actor_username} ` : ''}on {first.object_type} #{first.object_id}
                                        {count > 1 && (
                                            <span className="ml-2 text-[var(--text-tertiary)] text-xs">
                                                +{count - 1} similar
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-[var(--text-tertiary)]">
                                        {new Date(first.created_at).toLocaleString()}
                                    </div>
                                </div>
                                {!first.read_at && (
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
