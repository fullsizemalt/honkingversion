'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getApiUrl } from '@/lib/api'

interface Props {
    token: string
    onSuccess?: () => void
}

export default function MarkAllReadButton({ token, onSuccess }: Props) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleClick = async () => {
        setLoading(true)
        try {
            await fetch(`${getApiUrl()}/notifications/read-all`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            onSuccess?.()
            router.refresh()
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="px-3 py-2 border border-[#333] text-sm text-white hover:border-[#00d9ff] disabled:opacity-50"
        >
            {loading ? 'Marking…' : 'Mark all read'}
        </button>
    )
}
