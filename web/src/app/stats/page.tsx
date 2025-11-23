import { getApiEndpoint } from '@/lib/api'
import { StatsResponse } from '@/types'
import Link from 'next/link'

async function fetchStats(): Promise<StatsResponse | null> {
    try {
        const res = await fetch(getApiEndpoint('/stats'), { cache: 'no-store' })
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

export default async function StatsPage() {
    const stats = await fetchStats()

    if (!stats) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-10 text-[#9ca3af]">
                Failed to load stats.
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                    Community Stats
                </h1>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-[#333] bg-[#0f0f0f] p-4">
                    <h2 className="text-lg font-semibold text-white mb-3">Top Songs</h2>
                    <div className="space-y-2">
                        {stats.top_songs.map((s, idx) => (
                            <div key={s.slug} className="flex items-center justify-between text-sm text-[#e5e7eb]">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#9ca3af]">#{idx + 1}</span>
                                    <Link href={`/songs/${s.slug}`} className="hover:text-[#00d9ff]">{s.name}</Link>
                                </div>
                                <span className="text-[#9ca3af]">{s.plays} plays</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border border-[#333] bg-[#0f0f0f] p-4">
                    <h2 className="text-lg font-semibold text-white mb-3">Top Venues</h2>
                    <div className="space-y-2">
                        {stats.top_venues.map((v, idx) => (
                            <div key={`${v.venue}-${idx}`} className="flex items-center justify-between text-sm text-[#e5e7eb]">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#9ca3af]">#{idx + 1}</span>
                                    <span>{v.venue}</span>
                                </div>
                                <span className="text-[#9ca3af]">{v.show_count} shows</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border border-[#333] bg-[#0f0f0f] p-4">
                <h2 className="text-lg font-semibold text-white mb-3">Trending Performances (last 30d)</h2>
                <div className="space-y-2">
                    {stats.trending_performances.map((p) => (
                        <div key={p.performance_id} className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-[#e5e7eb] border-b border-[#1f2937] pb-2 last:border-none">
                            <div>
                                <div className="font-semibold">{p.song_name}</div>
                                <div className="text-[#9ca3af]">{p.date} @ {p.venue}</div>
                            </div>
                            <div className="flex items-center gap-4 text-[#9ca3af]">
                                <span>{p.votes_last_30d} votes</span>
                                <span>{p.avg_rating ? `${p.avg_rating.toFixed(1)} avg` : 'N/A'}</span>
                            </div>
                        </div>
                    ))}
                    {stats.trending_performances.length === 0 && (
                        <div className="text-sm text-[#9ca3af]">No recent activity.</div>
                    )}
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-[#333] bg-[#0f0f0f] p-4">
                    <h2 className="text-lg font-semibold text-white mb-3">Leaderboard: Votes Cast</h2>
                    <div className="space-y-2">
                        {stats.leaderboards.votes_cast.map((u, idx) => (
                            <div key={u.username} className="flex items-center justify-between text-sm text-[#e5e7eb]">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#9ca3af]">#{idx + 1}</span>
                                    <span>{u.username}</span>
                                </div>
                                <span className="text-[#9ca3af]">{u.votes} votes</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border border-[#333] bg-[#0f0f0f] p-4">
                    <h2 className="text-lg font-semibold text-white mb-3">Leaderboard: Followers</h2>
                    <div className="space-y-2">
                        {stats.leaderboards.followers.map((u, idx) => (
                            <div key={u.username} className="flex items-center justify-between text-sm text-[#e5e7eb]">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#9ca3af]">#{idx + 1}</span>
                                    <span>{u.username}</span>
                                </div>
                                <span className="text-[#9ca3af]">{u.followers} followers</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
