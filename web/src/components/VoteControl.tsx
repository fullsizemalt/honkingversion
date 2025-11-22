'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getApiUrl } from '@/lib/api'

interface VoteControlProps {
    showId: number
    initialUserVote?: { rating: number, comment?: string }
    onVoteUpdate?: () => void
}

export default function VoteControl({ showId, initialUserVote, onVoteUpdate }: VoteControlProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const [rating, setRating] = useState(initialUserVote?.rating || 0)
    const [hoverRating, setHoverRating] = useState(0)
    const [loading, setLoading] = useState(false)

    const handleVote = async (value: number) => {
        if (!session) {
            router.push('/auth/signin')
            return
        }

        setLoading(true)
        try {
            const apiUrl = getApiUrl();
            const res = await fetch(`${apiUrl}/votes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.accessToken}`
                },
                body: JSON.stringify({
                    show_id: showId,
                    rating: value
                })
            })

            if (res.ok) {
                setRating(value)
                if (onVoteUpdate) onVoteUpdate()
                router.refresh()
            }
        } catch (error) {
            console.error('Failed to vote:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <h3 className="text-sm font-medium text-gray-400">Rate this Show</h3>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                        key={value}
                        disabled={loading}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleVote(value)}
                        className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${(hoverRating || rating) >= value
                            ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/20 scale-110'
                            : 'bg-slate-800 text-gray-500 hover:bg-slate-700'
                            }`}
                    >
                        {value}
                    </button>
                ))}
            </div>
            {rating > 0 && (
                <p className="text-xs text-green-400 mt-1">
                    You rated this show {rating}/10
                </p>
            )}
        </div>
    )
}
