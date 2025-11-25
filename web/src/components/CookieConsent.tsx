'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'hv-cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [consent, setConsent] = useState<'accepted' | 'rejected' | null>(null)

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (!saved) {
      setVisible(true)
    } else {
      try {
        const parsed = JSON.parse(saved)
        if (parsed === 'accepted' || parsed === 'rejected') {
          setConsent(parsed)
        } else {
          setVisible(true)
        }
      } catch {
        setVisible(true)
      }
    }
  }, [])

  const handleChoice = (choice: 'accepted' | 'rejected') => {
    setConsent(choice)
    setVisible(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(choice))
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 inset-x-0 flex justify-center px-4 z-50">
      <div className="max-w-4xl w-full border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[0_18px_38px_rgba(0,0,0,0.25)] p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 text-sm text-[var(--text-secondary)]">
        <div className="flex-1">
          We use essential cookies for login and site functionality. Optional analytics are disabled unless you accept. Read our{' '}
          <a href="/privacy" className="text-[var(--accent-primary)] hover:underline">Privacy & Cookies</a>.
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleChoice('rejected')}
            className="px-4 py-2 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
          >
            Reject
          </button>
          <button
            onClick={() => handleChoice('accepted')}
            className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-secondary)]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
