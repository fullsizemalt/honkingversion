'use client'

import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import SearchBar from './SearchBar'
import { NotificationBadge } from './notifications/Badge'

export default function Navbar() {
    const { data: session } = useSession()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95 backdrop-blur shadow-[0_8px_20px_rgba(15,23,42,0.08)] dark:bg-[var(--bg-primary)]/90">
            <div className="max-w-7xl mx-auto px-4">
                {/* Top Row */}
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Sharp geometric */}
                    <Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold tracking-tight hover:opacity-80 transition-opacity text-[var(--text-primary)]">
                        <span className="text-[var(--text-primary)]">HONKING</span>
                        <span className="text-[var(--accent-secondary)]">VERSION</span>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:flex">
                        <SearchBar />
                    </div>

                    {/* Auth & Theme */}
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        <NotificationBadge />
                        {session ? (
                            <div className="relative flex items-center gap-4">
                                <button
                                    onClick={() => setIsProfileMenuOpen((open) => !open)}
                                    className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent-primary)] text-[var(--text-inverse)] font-[family-name:var(--font-space-grotesk)] text-sm font-bold shadow-sm hover:shadow-md transition-shadow"
                                    aria-label="Profile menu"
                                >
                                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </button>

                                {isProfileMenuOpen && (
                                    <div
                                        className="absolute right-0 top-12 min-w-[180px] rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
                                        onMouseLeave={() => setIsProfileMenuOpen(false)}
                                    >
                                        <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
                                            <p className="text-[var(--text-primary)] font-semibold leading-tight">{session.user?.name || 'Account'}</p>
                                            <p className="text-[var(--text-secondary)] text-xs">{session.user?.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href="/settings"
                                                className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            >
                                                Settings
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setIsProfileMenuOpen(false)
                                                    signOut()
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-[var(--accent-primary)] hover:bg-[var(--bg-muted)] hover:text-[var(--accent-primary)]"
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/auth/signin"
                                className="border-2 border-[var(--accent-primary)] px-4 py-1.5 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-inverse)] transition-colors tracking-wide"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile Theme Toggle */}
                    <div className="flex md:hidden items-center mr-2">
                        <ThemeToggle />
                    </div>

                    {/* Mobile notifications */}
                    <div className="flex md:hidden items-center mr-2">
                        <NotificationBadge />
                    </div>

                    {/* Mobile Auth */}
                    <div className="flex md:hidden items-center mr-2">
                        {session ? (
                            <button
                                onClick={() => setIsProfileMenuOpen((open) => !open)}
                                className="flex items-center gap-2"
                                aria-label="Profile menu"
                            >
                                <div className="w-9 h-9 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-[var(--text-inverse)] font-[family-name:var(--font-space-grotesk)] text-sm font-bold">
                                    {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </button>
                        ) : (
                            <Link
                                href="/auth/signin"
                                className="px-3 py-1.5 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase text-[var(--accent-primary)] border border-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-inverse)] transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Bottom Row - Navigation Menu */}
                <div className="hidden md:flex gap-6 font-[family-name:var(--font-ibm-plex-mono)] text-[11px] uppercase tracking-[0.2em] border-t border-[var(--border-subtle)] py-3">
                    <Link href="/shows" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors py-1 border-b-2 border-transparent hover:border-[var(--accent-primary)]">Shows</Link>
                    <Link href="/songs" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors py-1 border-b-2 border-transparent hover:border-[var(--accent-primary)]">Songs</Link>
                    <Link href="/lists" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors py-1 border-b-2 border-transparent hover:border-[var(--accent-primary)]">Lists</Link>
                    <Link href="/reviews" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors py-1 border-b-2 border-transparent hover:border-[var(--accent-primary)]">Reviews</Link>
                    <Link href="/performance-comparisons" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors py-1 border-b-2 border-transparent hover:border-[var(--accent-primary)]">Trending</Link>
                    <Link href="/performances" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors py-1 border-b-2 border-transparent hover:border-[var(--accent-primary)]">Performances</Link>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                isMenuOpen && (
                    <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg-secondary)] shadow-[0_12px_32px_rgba(23,20,10,0.08)]">
                        <div className="px-4 py-3 space-y-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase">
                            <div className="py-2">
                                <SearchBar />
                            </div>
                            <Link href="/shows" className="block py-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] border-l-2 border-transparent hover:border-[var(--accent-primary)] pl-2">Shows</Link>
                            <Link href="/songs" className="block py-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] border-l-2 border-transparent hover:border-[var(--accent-primary)] pl-2">Songs</Link>
                            <Link href="/lists" className="block py-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] border-l-2 border-transparent hover:border-[var(--accent-primary)] pl-2">Lists</Link>
                            <Link href="/reviews" className="block py-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] border-l-2 border-transparent hover:border-[var(--accent-primary)] pl-2">Reviews</Link>
                            <Link href="/performance-comparisons" className="block py-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] border-l-2 border-transparent hover:border-[var(--accent-primary)] pl-2">Trending</Link>
                            <Link href="/performances" className="block py-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] border-l-2 border-transparent hover:border-[var(--accent-primary)] pl-2">Performances</Link>
                            {session ? (
                                <div className="space-y-1">
                                    <Link href="/profile" className="block py-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] border-l-2 border-transparent hover:border-[var(--accent-primary)] pl-2">
                                        Profile
                                    </Link>
                                    <Link href="/settings" className="block py-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] border-l-2 border-transparent hover:border-[var(--accent-primary)] pl-2">
                                        Settings
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="block w-full text-left py-2 text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] border-l-2 border-transparent hover:border-[var(--accent-primary)] pl-2"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <Link href="/auth/signin" className="block py-2 text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] border-l-2 border-[var(--accent-primary)] pl-2 font-bold">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div >
                )
            }
        </nav >
    )
}
