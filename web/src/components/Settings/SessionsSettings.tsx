'use client';

import { useState, useEffect } from 'react';

interface Session {
    id: string;
    device_name: string;
    device_type: 'web' | 'mobile' | 'tablet' | 'unknown';
    browser: string;
    os: string;
    ip_address: string;
    last_activity: string;
    created_at: string;
    is_current: boolean;
}

export default function SessionsSettings() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [revoking, setRevoking] = useState<string | null>(null);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            // For now, mock sessions data
            // In production, this would fetch from /api/hv/settings/sessions
            setSessions([
                {
                    id: 'session-1',
                    device_name: 'Chrome on macOS',
                    device_type: 'web',
                    browser: 'Chrome 120',
                    os: 'macOS 12',
                    ip_address: '192.168.1.1',
                    last_activity: new Date().toISOString(),
                    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    is_current: true,
                },
                {
                    id: 'session-2',
                    device_name: 'Safari on iPhone',
                    device_type: 'mobile',
                    browser: 'Safari 17',
                    os: 'iOS 17',
                    ip_address: '192.168.1.50',
                    last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    is_current: false,
                },
            ]);
        } catch (err) {
            setError('Failed to load sessions');
        } finally {
            setLoading(false);
        }
    };

    const handleRevokeSession = async (sessionId: string) => {
        setRevoking(sessionId);
        try {
            // In production: await fetch(`/api/hv/settings/sessions/${sessionId}`, { method: 'DELETE' })
            setSessions(sessions.filter(s => s.id !== sessionId));
        } catch (err) {
            setError('Failed to revoke session');
        } finally {
            setRevoking(null);
        }
    };

    const handleRevokeAllOtherSessions = async () => {
        setRevoking('all-others');
        try {
            // In production: await fetch('/api/hv/settings/sessions/revoke-others', { method: 'POST' })
            setSessions(sessions.filter(s => s.is_current));
        } catch (err) {
            setError('Failed to revoke sessions');
        } finally {
            setRevoking(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-12 bg-[var(--bg-secondary)] rounded animate-pulse" />
                <div className="h-64 bg-[var(--bg-secondary)] rounded animate-pulse" />
            </div>
        );
    }

    const currentSession = sessions.find(s => s.is_current);
    const otherSessions = sessions.filter(s => !s.is_current);

    return (
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded p-6">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] mb-6">
                Active Sessions
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}

            <p className="text-sm text-[var(--text-secondary)] mb-6">
                Manage your active login sessions. You can sign out of any device here.
            </p>

            <div className="space-y-6">
                {/* Current Session */}
                {currentSession && (
                    <div className="pb-6 border-b border-[var(--border-subtle)]">
                        <div className="mb-4 p-4 bg-[var(--bg-primary)] border border-[var(--accent-primary)] rounded">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-[var(--text-primary)]">
                                        {currentSession.device_name}
                                    </h3>
                                    <p className="text-xs text-[var(--accent-primary)] font-semibold mt-1">
                                        Current Session
                                    </p>
                                </div>
                            </div>
                            <div className="text-xs text-[var(--text-tertiary)] space-y-1">
                                <p>Browser: {currentSession.browser}</p>
                                <p>OS: {currentSession.os}</p>
                                <p>IP Address: {currentSession.ip_address}</p>
                                <p>Signed in: {new Date(currentSession.created_at).toLocaleDateString()}</p>
                                <p>Last active: {new Date(currentSession.last_activity).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Sessions */}
                {otherSessions.length > 0 && (
                    <div>
                        <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-4">
                            Other Sessions ({otherSessions.length})
                        </h3>
                        <div className="space-y-3">
                            {otherSessions.map((session) => (
                                <div key={session.id} className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-[family-name:var(--font-space-grotesk)] font-semibold text-[var(--text-primary)]">
                                                {session.device_name}
                                            </h4>
                                        </div>
                                        <button
                                            onClick={() => handleRevokeSession(session.id)}
                                            disabled={revoking === session.id}
                                            className="px-3 py-1 text-xs bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 disabled:opacity-50 font-[family-name:var(--font-ibm-plex-mono)] rounded"
                                        >
                                            {revoking === session.id ? 'Revoking...' : 'Sign Out'}
                                        </button>
                                    </div>
                                    <div className="text-xs text-[var(--text-tertiary)] space-y-1">
                                        <p>Browser: {session.browser}</p>
                                        <p>OS: {session.os}</p>
                                        <p>IP Address: {session.ip_address}</p>
                                        <p>Signed in: {new Date(session.created_at).toLocaleDateString()}</p>
                                        <p>Last active: {new Date(session.last_activity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sign Out All Other Sessions */}
                        <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                            <button
                                onClick={handleRevokeAllOtherSessions}
                                disabled={revoking === 'all-others'}
                                className="px-4 py-2 text-sm bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 disabled:opacity-50 font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wider rounded"
                            >
                                {revoking === 'all-others' ? 'Signing out...' : 'Sign Out All Other Sessions'}
                            </button>
                            <p className="text-xs text-[var(--text-tertiary)] mt-2">
                                This will immediately end all other active sessions on different devices.
                            </p>
                        </div>
                    </div>
                )}

                {/* No Other Sessions */}
                {otherSessions.length === 0 && (
                    <div className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded text-center">
                        <p className="text-[var(--text-secondary)] text-sm">
                            You only have one active session. You're good!
                        </p>
                    </div>
                )}

                {/* Security Info */}
                <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                    <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-3">
                        Security
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)]">
                        If you don't recognize a session or believe your account has been compromised, change your password immediately.
                    </p>
                </div>
            </div>
        </div>
    );
}
