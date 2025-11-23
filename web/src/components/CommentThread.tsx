'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { getApiUrl } from '@/lib/api'
import { Comment } from '@/types'

interface CommentThreadProps {
    voteId: number
}

export default function CommentThread({ voteId }: CommentThreadProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const [comments, setComments] = useState<Comment[]>([])
    const [body, setBody] = useState('')
    const [replyTo, setReplyTo] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${getApiUrl()}/comments/vote/${voteId}`, { cache: 'no-store' })
                if (res.ok) {
                    const data = await res.json()
                    setComments(data)
                }
            } finally {
                setLoading(false)
            }
        }
        fetchComments()
    }, [voteId])

    const refresh = async () => {
        const res = await fetch(`${getApiUrl()}/comments/vote/${voteId}`, { cache: 'no-store' })
        if (res.ok) {
            setComments(await res.json())
        }
    }

    const handleSubmit = async () => {
        if (!session?.user?.accessToken) {
            router.push('/auth/signin')
            return
        }
        if (!body.trim()) return

        setSubmitting(true)
        try {
            const res = await fetch(`${getApiUrl()}/comments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.user.accessToken}`
                },
                body: JSON.stringify({
                    vote_id: voteId,
                    body,
                    parent_id: replyTo
                })
            })
            if (res.ok) {
                setBody('')
                setReplyTo(null)
                await refresh()
            }
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpvote = async (commentId: number) => {
        if (!session) {
            router.push('/auth/signin')
            return
        }
        await fetch(`${getApiUrl()}/comments/${commentId}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.accessToken}`
            },
            body: JSON.stringify({ is_upvote: true })
        })
        await refresh()
    }

    const renderComment = (comment: Comment, depth = 0) => (
        <div key={comment.id} className="border border-[#333] bg-[#0f0f0f] p-3 mb-2" style={{ marginLeft: depth * 12 }}>
            <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-[#9ca3af] font-[family-name:var(--font-ibm-plex-mono)]">
                    {comment.username}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
                    <button
                        className="text-[#00d9ff] hover:text-white"
                        onClick={() => handleUpvote(comment.id)}
                    >
                        ▲ {comment.upvotes}
                    </button>
                    <button
                        className="text-[#9ca3af] hover:text-white"
                        onClick={() => setReplyTo(comment.id)}
                    >
                        Reply
                    </button>
                </div>
            </div>
            <p className="text-sm text-[#f5f5f5] whitespace-pre-line">{comment.body}</p>
            {comment.replies && comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
    )

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-sm text-[#9ca3af] font-[family-name:var(--font-ibm-plex-mono)]">Comments</p>
                {loading && <span className="text-xs text-[#6b7280]">Loading…</span>}
            </div>

            <div className="space-y-2">
                {comments.map((comment) => renderComment(comment))}
                {comments.length === 0 && !loading && (
                    <p className="text-xs text-[#6b7280]">Be the first to comment.</p>
                )}
            </div>

            <div className="space-y-2">
                {replyTo && (
                    <div className="text-xs text-[#9ca3af]">
                        Replying to comment #{replyTo}{' '}
                        <button className="text-[#00d9ff]" onClick={() => setReplyTo(null)}>clear</button>
                    </div>
                )}
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Leave a comment"
                    className="w-full bg-[#0f0f0f] border border-[#333] rounded-md p-2 text-sm text-white focus:border-[#00d9ff] outline-none"
                    rows={3}
                />
                <button
                    onClick={handleSubmit}
                    disabled={submitting || !body.trim()}
                    className="px-3 py-2 text-sm bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-md disabled:opacity-50"
                >
                    {submitting ? 'Posting…' : 'Post Comment'}
                </button>
            </div>
        </div>
    )
}
