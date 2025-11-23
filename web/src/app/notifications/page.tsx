import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getApiEndpoint } from '@/lib/api'
import { Notification } from '@/types'
import MarkAllReadButton from '@/components/MarkAllReadButton'

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

export default async function NotificationsPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.accessToken) {
        redirect('/auth/signin')
    }

    const notifications = await fetchNotifications(session.user.accessToken)

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                    Notifications
                </h1>
                <MarkAllReadButton token={session.user.accessToken} />
            </div>

            <div className="space-y-3">
                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className={`p-4 border ${n.read_at ? 'border-[#222]' : 'border-[#00d9ff]'} bg-[#0f0f0f]`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-white font-[family-name:var(--font-ibm-plex-mono)]">
                                <span className="text-[#00d9ff] mr-2 uppercase text-xs">{n.type}</span>
                                {n.actor_username ? `${n.actor_username} ` : ''}on {n.object_type} #{n.object_id}
                            </div>
                            <div className="text-[10px] text-[#6b7280]">
                                {new Date(n.created_at).toLocaleString()}
                            </div>
                        </div>
                        {!n.read_at && (
                            <div className="text-[10px] text-[#9ca3af] mt-1">Unread</div>
                        )}
                    </div>
                ))}
                {notifications.length === 0 && (
                    <div className="p-6 border border-dashed border-[#333] text-center text-[#9ca3af] text-sm">
                        No notifications yet.
                    </div>
                )}
            </div>
        </div>
    )
}
