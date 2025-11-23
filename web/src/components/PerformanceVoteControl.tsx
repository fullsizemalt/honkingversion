'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getApiUrl } from '@/lib/api'

interface PerformanceVoteControlProps {
    performanceId: number
    songName: string
    compact?: boolean
    onVoteUpdate?: () => void
}

export default function PerformanceVoteControl({
    performanceId,
    songName,
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

    useEffect(() => {
        fetchRating()
    }, [performanceId])

    const fetchRating = async () => {
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
    }

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
                        <span className="text-[#00d9ff] font-bold text-sm">{avgRating}</span>
                        <span className="text-[#707070] text-xs">({voteCount})</span>
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
                            className={`w-6 h-6 rounded text-xs font-bold transition-all ${(hoverRating || rating) >= value
                                    ? 'bg-[#00d9ff] text-[#0a0a0a]'
                                    : 'bg-[#333] text-[#707070] hover:bg-[#444]'
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
        <div className="flex flex-col gap-2 p-3 bg-[#1a1a1a] border border-[#333] rounded">
            <div className="flex items-center justify-between">
                <h4 className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0] uppercase tracking-wider">
                    Rate {songName}
                </h4>
                {avgRating !== null && (
                    <div className="flex items-center gap-1">
                        <span className="text-[#00d9ff] font-bold">{avgRating}</span>
                        <span className="text-[#707070] text-xs">({voteCount} votes)</span>
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
                        className={`w-8 h-8 rounded text-sm font-bold transition-all ${(hoverRating || rating) >= value
                                ? 'bg-[#00d9ff] text-[#0a0a0a] scale-110'
                                : 'bg-[#333] text-[#707070] hover:bg-[#444]'
                            }`}
                    >
                        {value}
                    </button>
                ))}
            </div>
            {rating > 0 && (
                <p className="text-xs text-[#00d9ff] font-[family-name:var(--font-ibm-plex-mono)]">
                    You rated this {rating}/10
                </p>
            )}
        </div>
    )
}
