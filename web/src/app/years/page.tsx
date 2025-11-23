import { getApiEndpoint } from '@/lib/api'
import Link from 'next/link'

async function fetchYears(): Promise<string[]> {
    try {
        const res = await fetch(getApiEndpoint('/shows/years'), { cache: 'no-store' })
        if (!res.ok) return []
        return res.json()
    } catch {
        return []
    }
}

export default async function YearsPage() {
    const years = await fetchYears()

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
            <h1 className="text-3xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">Browse by Year</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {years.map((year) => (
                    <Link
                        key={year}
                        href={`/years/${year}`}
                        className="border border-[#333] bg-[#0f0f0f] text-center py-4 text-lg text-white hover:border-[#00d9ff]"
                    >
                        {year}
                    </Link>
                ))}
                {years.length === 0 && (
                    <div className="text-[#9ca3af] text-sm">No years available.</div>
                )}
            </div>
        </div>
    )
}
