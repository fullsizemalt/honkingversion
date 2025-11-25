'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Star, Crown } from 'lucide-react';
import { getApiUrl } from '@/lib/api'
import { useToast } from './ToastContainer'
import HonkingVersionBadge from './HonkingVersionBadge'

interface HonkingVersionSelectorProps {
    songId: number
    performanceId: number
    isCurrentHonkingVersion?: boolean
    honkingVoteCount?: number
}

export default function HonkingVersionSelector({
    songId,
    performanceId,
    isCurrentHonkingVersion = false,
    honkingVoteCount = 0
}: HonkingVersionSelectorProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const { addToast } = useToast()
    const [loading, setLoading] = useState(false)
    const [isVoted, setIsVoted] = useState(isCurrentHonkingVersion)

    const handleVote = async () => {
        if (!session) {
            router.push('/auth/signin')
            return
        }

        setLoading(true)

        try {
            const apiUrl = getApiUrl()
            const res = await fetch(`${apiUrl}/honking-versions/song/${songId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.accessToken}`
                },
                body: JSON.stringify({
                    performance_id: performanceId
                })
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.detail || 'Failed to set honking version')
            }

            setIsVoted(true)
            addToast('This is now your honking version!', 'success')

            // Refresh page after short delay to show updates
            setTimeout(() => {
                router.refresh()
            }, 1500)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to set honking version'
            addToast(message, 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveVote = async () => {
        if (!session) {
            router.push('/auth/signin')
            return
        }

        setLoading(true)

        try {
            const apiUrl = getApiUrl()
            const res = await fetch(`${apiUrl}/honking-versions/song/${songId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.user.accessToken}`
                }
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.detail || 'Failed to remove honking version')
            }

            setIsVoted(false)
            addToast('Honking version removed', 'info')

            // Refresh page
            setTimeout(() => {
                router.refresh()
            }, 1500)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to remove honking version'
            addToast(message, 'error')
        } finally {
            setLoading(false)
        }
    }

    if (!session) {
        return (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-4">
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                    Sign in to vote for your honking version of this song
                </p>
                <button
                    onClick={() => router.push('/auth/signin')}
                    className="w-full px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-bold uppercase tracking-wider rounded hover:opacity-90 transition-opacity"
                >
                    Sign In to Vote
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <HonkingVersionBadge
                isHonkingVersion={isVoted}
                honkingVoteCount={honkingVoteCount}
            />

            <div className="flex gap-2">
                {!isVoted ? (
                    <button
                        onClick={handleVote}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-bold uppercase tracking-wider rounded hover:opacity-90 disabled:opacity-50 transition-opacity text-sm"
                    >
                        {loading ? 'Setting...' : <span className="flex items-center gap-2"><Crown className="w-4 h-4" /> This is The One</span>}
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleVote}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-bold uppercase tracking-wider rounded hover:opacity-90 disabled:opacity-50 transition-opacity text-sm"
                        >
                            {loading ? 'Updating...' : 'This is The One'}
                        </button>
                        <button
                            onClick={handleRemoveVote}
                            disabled={loading}
                            className="px-4 py-2 bg-[var(--border-subtle)] text-[var(--text-secondary)] font-bold uppercase tracking-wider rounded hover:bg-red-100 hover:text-red-700 disabled:opacity-50 transition-colors text-sm"
                        >
                            {loading ? 'Removing...' : 'Unvote'}
                        </button>
                    </>
                )}
            </div>

            <p className="text-xs text-[var(--text-tertiary)] text-center">
                You can only vote for one version per song, but you can change your vote anytime
            </p>
        </div>
    )
}
