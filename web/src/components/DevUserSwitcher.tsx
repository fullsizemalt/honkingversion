'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Users, X, AlertCircle } from 'lucide-react';

/**
 * Dev-only component for quickly switching between test users
 * Only visible in development mode
 */

interface TestUser {
    username: string;
    password: string;
    role: string;
}

const TEST_USERS: TestUser[] = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'testuser', password: 'test123', role: 'user' },
    { username: 'poweruser', password: 'power123', role: 'power_user' },
    { username: 'mod', password: 'mod123', role: 'mod' },
];

export default function DevUserSwitcher() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [switching, setSwitching] = useState(false);
    const [devMode, setDevMode] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Check if dev mode is enabled
    useEffect(() => {
        const checkDevMode = () => {
            if (typeof window === 'undefined') return;
            const isDevMode = localStorage.getItem('devMode') === 'true';
            setDevMode(isDevMode);
        };

        checkDevMode();

        // Listen for storage changes (in case dev mode is toggled in another tab)
        window.addEventListener('storage', checkDevMode);
        return () => window.removeEventListener('storage', checkDevMode);
    }, []);

    // Only show when dev mode is active
    if (!devMode) {
        return null;
    }

    const switchUser = async (user: TestUser) => {
        setSwitching(true);
        setErrorMsg(null);
        try {
            // Sign out current user
            await signOut({ redirect: false });

            // Sign in as new user
            const res = await signIn('credentials', {
                username: user.username,
                password: user.password,
                redirect: false,
            });

            if (res?.error) {
                setErrorMsg('Quick login failed. Ensure dev users exist in the API.');
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to switch user:', error);
            setErrorMsg('Switch failed. Check credentials or API availability.');
        } finally {
            setSwitching(false);
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                title="Dev User Switcher"
            >
                <Users className="w-5 h-5" />
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl max-w-md w-full p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)]">
                                🔧 Dev User Switcher
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-[var(--bg-muted)] transition-colors"
                            >
                                <X className="w-5 h-5 text-[var(--text-secondary)]" />
                            </button>
                        </div>

                        {/* Current User */}
                        {session && (
                            <div className="mb-4 p-3 bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
                                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-1">
                                    Current User
                                </p>
                                <p className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--text-primary)]">
                                    {session.user?.name || 'Unknown'}
                                </p>
                            </div>
                        )}

                        {/* User List */}
                        <div className="space-y-2">
                            {TEST_USERS.map((user) => (
                                <button
                                    key={user.username}
                                    onClick={() => switchUser(user)}
                                    disabled={switching || session?.user?.name === user.username}
                                    className="w-full p-4 border border-[var(--border)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                                                {user.username}
                                            </p>
                                            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
                                                {user.role}
                                            </p>
                                        </div>
                                        {session?.user?.name === user.username && (
                                            <span className="px-2 py-1 text-xs font-bold bg-green-500/10 text-green-600">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Sign Out */}
                        {session && (
                            <button
                                onClick={() => signOut()}
                                className="w-full mt-4 p-3 border border-red-500/20 hover:border-red-500 hover:bg-red-500/5 transition-all duration-200 text-red-600 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider"
                            >
                                Sign Out
                            </button>
                        )}

                        {errorMsg && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-amber-400 font-[family-name:var(--font-ibm-plex-mono)]">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {/* Note */}
                        <p className="mt-4 text-xs text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] text-center">
                            Dev mode only • Not visible in production
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
