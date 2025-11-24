'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getApiUrl } from '@/lib/api'

interface PerformanceVoteControlProps {
    performanceId: number
    songName?: string
    compact?: boolean
    onVoteUpdate?: () => void
}

export default function PerformanceVoteControl({
    performanceId,
    songName = 'this performance',
    compact = false,
    onVoteUpdate
}: PerformanceVoteControlProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [loading, setLoading] = useState(false)
    const [avgRating, setAvgRating] = useState<number | null>(null)
    const [voteCount, setVoteCount] = useState(0)

    const fetchRating = useCallback(async () => {
        try {
            const apiUrl = getApiUrl()
            const res = await fetch(`${apiUrl}/performances/${performanceId}/rating`)
            if (res.ok) {
                const data = await res.json()
                setAvgRating(data.avg_rating)
                setVoteCount(data.vote_count)
                if (data.user_vote) {
                    setRating(data.user_vote)
                }
            }
        } catch (error) {
            console.error('Failed to fetch rating:', error)
        }
    }, [performanceId])

    useEffect(() => {
        fetchRating()
    }, [fetchRating])

    const handleVote = async (value: number) => {
        if (!session) {
            router.push('/auth/signin')
            return
        }

        setLoading(true)
        try {
            const apiUrl = getApiUrl()
            const res = await fetch(`${apiUrl}/performances/${performanceId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.accessToken}`
                },
                body: JSON.stringify({
                    rating: value
                })
            })

            if (res.ok) {
                setRating(value)
                await fetchRating() // Refresh ratings
                if (onVoteUpdate) onVoteUpdate()
            }
        } catch (error) {
            console.error('Failed to vote:', error)
        } finally {
            setLoading(false)
        }
    }

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                {avgRating !== null && (
                    <div className="flex items-center gap-1">
                        <span className="text-[var(--accent-tertiary)] font-bold text-sm">{avgRating}</span>
                        <span className="text-[var(--text-tertiary)] text-xs">({voteCount})</span>
                    </div>
                )}
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                        <button
                            key={value}
                            disabled={loading}
                            onMouseEnter={() => setHoverRating(value)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => handleVote(value)}
                            className={`w-6 h-6 rounded text-xs font-bold transition-all border ${(hoverRating || rating) >= value
                                ? 'bg-[color:rgba(0,168,210,0.18)] text-[var(--accent-tertiary)] border-[color:rgba(0,168,210,0.35)]'
                                : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)] border-[var(--border)] hover:border-[var(--accent-tertiary)]'
                                }`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3 p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl shadow-[0_15px_35px_rgba(23,20,10,0.08)]">
            <div className="flex items-center justify-between">
                <h4 className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] uppercase tracking-[0.35em]">
                    Rate {songName}
                </h4>
                {avgRating !== null && (
                    <div className="flex items-center gap-1">
                        <span className="text-[var(--accent-tertiary)] font-bold">{avgRating}</span>
                        <span className="text-[var(--text-tertiary)] text-xs">({voteCount} votes)</span>
                    </div>
                )}
            </div>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                        key={value}
                        disabled={loading}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleVote(value)}
                        className={`w-9 h-9 rounded-xl text-sm font-bold transition-all border ${(hoverRating || rating) >= value
                            ? 'bg-[color:rgba(0,168,210,0.18)] text-[var(--accent-tertiary)] scale-110 border-[color:rgba(0,168,210,0.35)]'
                            : 'bg-[var(--bg-muted)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border-[var(--border)]'
                            }`}
                    >
                        {value}
                    </button>
                ))}
            </div>
            {rating > 0 && (
                <p className="text-xs text-[var(--accent-tertiary)] font-[family-name:var(--font-ibm-plex-mono)]">
                    You rated this {rating}/10
                </p>
            )}
        </div>
    )
}
