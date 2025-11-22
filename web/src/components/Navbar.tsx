'use client'

import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"
import { useState } from 'react'

export default function Navbar() {
    const { data: session } = useSession()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="bg-[#0a0a0a] border-b-2 border-[#ff6b35] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-14">
                    {/* Logo - Sharp geometric */}
                    <Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
                        <span className="text-[#f5f5f5]">HONKING</span>
                        <span className="text-[#ff6b35]">VERSION</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-6 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider">
                        <Link href="/shows" className="text-[#a0a0a0] hover:text-[#ff6b35] transition-colors py-1 border-b-2 border-transparent hover:border-[#ff6b35]">Shows</Link>
                        <Link href="/attribution" className="text-[#a0a0a0] hover:text-[#ff6b35] transition-colors py-1 border-b-2 border-transparent hover:border-[#ff6b35]">Attribution</Link>
                        <Link href="/songs" className="text-[#a0a0a0] hover:text-[#ff6b35] transition-colors py-1 border-b-2 border-transparent hover:border-[#ff6b35]">
                            Songs
                        </Link>
                        <Link href="/lists" className="text-[#a0a0a0] hover:text-[#ff6b35] transition-colors py-1 border-b-2 border-transparent hover:border-[#ff6b35]">
                            Lists
                        </Link>
                    </div>

                    {/* Auth */}
                    <div className="hidden md:block">
                        {session ? (
                            <div className="flex items-center gap-4">
                                <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0]">
                                    {session.user?.name}
                                </span>
                                <button
                                    onClick={() => signOut()}
                                    className="border border-[#333] px-3 py-1.5 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-[#f5f5f5] transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button className="border-2 border-[#ff6b35] px-4 py-1.5 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase text-[#ff6b35] hover:bg-[#ff6b35] hover:text-[#0a0a0a] transition-colors">
                                <Link href="/auth/signin">Sign In</Link>
                            </button>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-[#a0a0a0] hover:text-[#ff6b35]"
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
            </div>

            {/* Mobile Menu */}
            {
                isMenuOpen && (
                    <div className="md:hidden border-t border-[#333] bg-[#0a0a0a]">
                        <div className="px-4 py-3 space-y-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase">
                            <Link href="/shows" className="block py-2 text-[#a0a0a0] hover:text-[#ff6b35] border-l-2 border-transparent hover:border-[#ff6b35] pl-2">Shows</Link>
                            <Link href="/attribution" className="block py-2 text-[#a0a0a0] hover:text-[#ff6b35] border-l-2 border-transparent hover:border-[#ff6b35] pl-2">Attribution</Link>
                            {session ? (
                                <button
                                    onClick={() => signOut()}
                                    className="block w-full text-left py-2 text-[#a0a0a0] hover:text-[#ff6b35] border-l-2 border-transparent hover:border-[#ff6b35] pl-2"
                                >
                                    Sign Out ({session.user?.name})
                                </button>
                            ) : (
                                <Link href="/auth/signin" className="block py-2 text-[#ff6b35] hover:text-[#f7931e] border-l-2 border-[#ff6b35] pl-2 font-bold">
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
