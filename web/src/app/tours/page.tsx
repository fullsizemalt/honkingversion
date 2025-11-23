import { getApiEndpoint } from '@/lib/api'
import Link from 'next/link'

interface Tour {
    name: string
}

async function fetchTours(): Promise<Tour[]> {
    const res = await fetch(getApiEndpoint('/tours'), { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
}

export default async function ToursPage() {
    const tours = await fetchTours()

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
            <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">Browse by Tour</h1>
            <div className="space-y-2">
                {tours.length === 0 && (
                    <div className="text-sm text-[#9ca3af]">No tours recorded yet. Populate tour names in shows to enable browsing.</div>
                )}
                {tours.map((tour) => (
                    <Link
                        key={tour.name}
                        href={`/tours/${encodeURIComponent(tour.name)}`}
                        className="block border border-[#333] bg-[#0f0f0f] p-3 hover:border-[#00d9ff]"
                    >
                        <span className="text-white">{tour.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
