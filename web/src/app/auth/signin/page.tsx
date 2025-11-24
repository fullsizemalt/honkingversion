'use client'

import { signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignIn() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showDevLogin, setShowDevLogin] = useState(false)

    // Check for dev mode on mount
    useEffect(() => {
        const isDevMode = localStorage.getItem('devMode') === 'true';
        setShowDevLogin(isDevMode);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await signIn("credentials", {
                username,
                password,
                redirect: false,
            })

            if (res?.error) {
                setError("Invalid username or password")
            } else {
                router.push("/")
                router.refresh()
            }
        } catch (_err) {
            console.error("Sign in failed", _err)
            setError("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const quickLogin = async (user: string, pass: string) => {
        setLoading(true);
        setError("");
        try {
            const res = await signIn("credentials", {
                username: user,
                password: pass,
                redirect: false,
            });
            if (res?.error) {
                setError("Quick login failed");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (_err) {
            setError("Quick login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-slate-900 p-8 shadow-2xl border border-slate-800">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Or{' '}
                        <Link href="/auth/signup" className="font-medium text-orange-500 hover:text-orange-400 transition-colors">
                            create a new account
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="-space-y-px shadow-sm">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="relative block w-full-t-md border-0 bg-slate-800 py-1.5 text-white ring-1 ring-inset ring-slate-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 px-3"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full-b-md border-0 bg-slate-800 py-1.5 text-white ring-1 ring-inset ring-slate-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 px-3"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-900/20 py-2 border border-red-900/50">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center bg-gradient-to-r from-orange-500 to-pink-600 px-3 py-2 text-sm font-semibold text-white hover:from-orange-600 hover:to-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                </form>

                {/* Dev Mode Quick Login */}
                {showDevLogin && (
                    <div className="mt-6 p-4 bg-purple-900/20 border border-purple-500/30">
                        <p className="text-xs font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wider text-purple-400 mb-3 text-center">
                            🔧 Quick Login (Dev Mode)
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => quickLogin('testuser', 'test123')}
                                disabled={loading}
                                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white transition-colors disabled:opacity-50"
                            >
                                User
                            </button>
                            <button
                                onClick={() => quickLogin('poweruser', 'power123')}
                                disabled={loading}
                                className="px-3 py-2 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/50 text-xs font-semibold text-blue-300 transition-colors disabled:opacity-50"
                            >
                                Power
                            </button>
                            <button
                                onClick={() => quickLogin('admin', 'admin123')}
                                disabled={loading}
                                className="px-3 py-2 bg-orange-900/30 hover:bg-orange-900/50 border border-orange-700/50 text-xs font-semibold text-orange-300 transition-colors disabled:opacity-50"
                            >
                                Admin
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-slate-900 px-2 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            onClick={() => signIn('google')}
                            className="flex w-full items-center justify-center bg-slate-800 px-3 py-1.5 text-white hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 transition-colors border border-slate-700"
                        >
                            <span className="text-sm font-semibold">Google</span>
                        </button>
                        <button
                            onClick={() => signIn('reddit')}
                            className="flex w-full items-center justify-center bg-slate-800 px-3 py-1.5 text-white hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 transition-colors border border-slate-700"
                        >
                            <span className="text-sm font-semibold">Reddit</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
