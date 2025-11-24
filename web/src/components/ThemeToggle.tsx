'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]"
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    )
}
