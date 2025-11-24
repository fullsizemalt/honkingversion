'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function LoginButton() {
    const { data: session } = useSession()

    if (session) {
        return (
            <div className="flex items-center gap-4">
                <p>Signed in as {session.user?.email || session.user?.name}</p>
                <button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition"
                >
                    Sign out
                </button>
            </div>
        )
    }
    return (
        <div className="flex gap-2">
            <button
                onClick={() => signIn('credentials', { username: 'testuser', password: 'testpassword' })}
                className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-600 transition"
            >
                Test Login
            </button>
            <button
                onClick={() => signIn('reddit')}
                className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 transition"
            >
                Sign in with Reddit
            </button>
            <button
                onClick={() => signIn('google')}
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition"
            >
                Sign in with Google
            </button>
        </div>
    )
}
