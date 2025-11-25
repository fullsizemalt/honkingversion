'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getApiEndpoint } from '@/lib/api'

interface Review {
  id: number
  user: { username: string }
  performance?: { id: number; song_name: string }
  show?: { date: string; venue: string }
  rating: number
  blurb?: string | null
  created_at: string
}

export default function PerformanceReviews({ performanceId }: { performanceId: number }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(getApiEndpoint(`/votes?performance_id=${performanceId}&sort=recent&limit=10`), { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load reviews')
        const data = await res.json()
        setReviews(Array.isArray(data) ? data : data.items || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load reviews')
      } finally {
        setLoading(false)
      }
    }
    if (performanceId) fetchReviews()
  }, [performanceId])

  if (loading) return <div className="text-[var(--text-tertiary)] text-sm">Loading reviews…</div>
  if (error) return <div className="text-red-500 text-sm">{error}</div>
  if (!reviews.length) return <div className="text-[var(--text-secondary)] text-sm">No reviews yet.</div>

  return (
    <div className="space-y-3">
      {reviews.map((rev) => (
        <div key={rev.id} className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-3">
          <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)]">
            <span>@{rev.user.username}</span>
            <span>{new Date(rev.created_at).toLocaleDateString()}</span>
          </div>
          <div className="mt-1 text-sm text-[var(--text-primary)] font-semibold">{rev.rating.toFixed(1)}/10</div>
          {rev.blurb && <p className="text-[var(--text-secondary)] text-sm mt-1">{rev.blurb}</p>}
          {rev.show && (
            <Link href={`/shows/${rev.show.date}`} className="text-[var(--accent-primary)] text-xs mt-2 inline-block hover:underline">
              {rev.show.venue} • {rev.show.date}
            </Link>
          )}
        </div>
      ))}
    </div>
  )
}
