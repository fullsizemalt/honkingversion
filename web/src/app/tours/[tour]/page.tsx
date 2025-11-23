import { getApiEndpoint } from '@/lib/api'
import Link from 'next/link'

interface TourDetail {
    tour: string
    show_count: number
    shows: {
        id: number
        date: string
        venue: string
        location: string
    }[]
}

async function fetchTour(tour: string): Promise<TourDetail | null> {
    const res = await fetch(getApiEndpoint(`/tours/${encodeURIComponent(tour)}`), { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
}

export default async function TourDetailPage({ params }: { params: { tour: string } }) {
    const data = await fetchTour(params.tour)

    if (!data) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 text-[#9ca3af]">
                Tour not found or empty.
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
                    {data.tour}
                </h1>
                <Link href="/tours" className="text-sm text-[#00d9ff] hover:text-white">Back to tours</Link>
            </div>
            <div className="text-sm text-[#9ca3af]">{data.show_count} shows</div>
            <div className="space-y-2">
                {data.shows.map((show) => (
                    <Link
                        key={show.id}
                        href={`/shows/${show.date}`}
                        className="block border border-[#333] bg-[#0f0f0f] p-3 hover:border-[#00d9ff]"
                    >
                        <div className="text-white font-semibold">{show.date}</div>
                        <div className="text-sm text-[#9ca3af]">{show.venue} — {show.location}</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
