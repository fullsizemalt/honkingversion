'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import ListEditor from './ListEditor'

export default function CreateListButton() {
    const { data: session } = useSession()
    const [open, setOpen] = useState(false)

    if (!session?.user) {
        return null
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="bg-[#ff6b35] text-[#0a0a0a] px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase hover:bg-[#f7931e]"
            >
                + Create List
            </button>
            <ListEditor
                isOpen={open}
                onClose={() => setOpen(false)}
                onListSaved={() => {
                    setOpen(false)
                    // rely on route refresh for now
                    window.location.reload()
                }}
            />
        </>
    )
}
