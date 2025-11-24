import { getApiEndpoint } from '@/lib/api'
import Link from 'next/link'

interface ShowItem {
    id: number
    date: string
    venue: string
    location: string
}

async function fetchShows(year: string): Promise<ShowItem[]> {
    const res = await fetch(getApiEndpoint(`/shows/years/${year}`), { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
}

export default async function YearDetailPage({ params }: { params: Promise<{ year: string }> }) {
    const { year } = await params
    const shows = await fetchShows(year)

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                    Shows in {year}
                </h1>
                <Link href="/years" className="text-sm text-[#00d9ff] hover:text-white">Back to years</Link>
            </div>
            <div className="space-y-2">
                {shows.map((show) => (
                    <Link
                        key={show.id}
                        href={`/shows/${show.date}`}
                        className="block border border-[#333] bg-[#0f0f0f] p-3 hover:border-[#00d9ff]"
                    >
                        <div className="text-white font-semibold">{show.date}</div>
                        <div className="text-sm text-[#9ca3af]">{show.venue} — {show.location}</div>
                    </Link>
                ))}
                {shows.length === 0 && (
                    <div className="text-sm text-[#9ca3af]">No shows found for this year.</div>
                )}
            </div>
        </div>
    )
}
