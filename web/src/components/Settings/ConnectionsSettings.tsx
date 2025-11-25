'use client';

import { useState, useEffect, ReactNode } from 'react';

interface OAuthConnection {
    id: string;
    provider: 'github' | 'google' | 'spotify' | 'apple';
    connected: boolean;
    email?: string;
    username?: string;
    connected_at?: string;
    last_used?: string;
}

export default function ConnectionsSettings() {
    const [connections, setConnections] = useState<OAuthConnection[]>([
        { id: 'github', provider: 'github', connected: false },
        { id: 'google', provider: 'google', connected: false },
        { id: 'spotify', provider: 'spotify', connected: false },
        { id: 'apple', provider: 'apple', connected: false },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [disconnecting, setDisconnecting] = useState<string | null>(null);

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            // Mock data
            setConnections([
                {
                    id: 'github',
                    provider: 'github',
                    connected: true,
                    username: 'honkfan42',
                    connected_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    last_used: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                { id: 'google', provider: 'google', connected: false },
                { id: 'spotify', provider: 'spotify', connected: false },
                { id: 'apple', provider: 'apple', connected: false },
            ]);
        } catch (err) {
            setError('Failed to load connections');
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (provider: string) => {
        try {
            // In production: window.location.href = `/api/auth/${provider}?redirect=/settings`
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to connect account');
        }
    };

    const handleDisconnect = async (provider: string) => {
        if (!confirm(`Disconnect your ${provider} account?`)) return;

        setDisconnecting(provider);
        try {
            // In production: await fetch(`/api/hv/settings/oauth/${provider}`, { method: 'DELETE' })
            setConnections(connections.map(c =>
                c.provider === provider ? { ...c, connected: false, email: undefined, username: undefined } : c
            ));
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to disconnect account');
        } finally {
            setDisconnecting(null);
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

    const providerInfo: Record<OAuthConnection['provider'], { name: string; description: string; scopes: string[]; icon: ReactNode }> = {
        github: {
            name: 'GitHub',
            description: 'Sign in with GitHub and import your repositories',
            scopes: ['user:email', 'read:user'],
            icon: <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs px-2 py-1 border border-[var(--border-subtle)] rounded">GH</span>
        },
        google: {
            name: 'Google',
            description: 'Sign in with Google and sync your calendar',
            scopes: ['email', 'profile'],
            icon: <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs px-2 py-1 border border-[var(--border-subtle)] rounded">G</span>
        },
        spotify: {
            name: 'Spotify',
            description: 'Connect your Spotify account and share playlists',
            scopes: ['user-read-private', 'playlist-modify-public'],
            icon: <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs px-2 py-1 border border-[var(--border-subtle)] rounded">SP</span>
        },
        apple: {
            name: 'Apple',
            description: 'Sign in with Apple and use Apple devices',
            scopes: ['email', 'name'],
            icon: <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs px-2 py-1 border border-[var(--border-subtle)] rounded">AP</span>
        }
    };

    return (
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded p-6">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] mb-6">
                Connected Accounts
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                    Account connection updated successfully!
                </div>
            )}

            <p className="text-sm text-[var(--text-secondary)] mb-6">
                Connect your social accounts to streamline login and enable additional features.
            </p>

            <div className="space-y-4">
                {connections.map((connection) => {
                    const info = providerInfo[connection.provider as keyof typeof providerInfo];
                    return (
                        <div key={connection.id} className="p-4 border border-[var(--border-subtle)] rounded">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl">{info.icon}</div>
                                    <div>
                                        <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-[var(--text-primary)]">
                                            {info.name}
                                        </h3>
                                        <p className="text-xs text-[var(--text-secondary)] mt-1">{info.description}</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-bold ${
                                    connection.connected
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {connection.connected ? 'CONNECTED' : 'NOT CONNECTED'}
                                </div>
                            </div>

                            {connection.connected && connection.username && (
                                <div className="text-xs text-[var(--text-tertiary)] mb-3">
                                    <p>Account: {connection.username}</p>
                                    {connection.connected_at && (
                                        <p>Connected: {new Date(connection.connected_at).toLocaleDateString()}</p>
                                    )}
                                    {connection.last_used && (
                                        <p>Last used: {new Date(connection.last_used).toLocaleString()}</p>
                                    )}
                                </div>
                            )}

                            {connection.connected && (
                                <div className="mb-3 p-3 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                                    <p className="text-xs text-[var(--text-secondary)] mb-2 font-bold">Permissions</p>
                                    <ul className="text-xs text-[var(--text-tertiary)] space-y-1">
                                        {info.scopes.map((scope) => (
                                            <li key={scope}>✓ {scope}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex gap-2">
                                {connection.connected ? (
                                    <button
                                        onClick={() => handleDisconnect(connection.provider)}
                                        disabled={disconnecting === connection.provider}
                                        className="px-4 py-2 text-sm bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 disabled:opacity-50 font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wider rounded"
                                    >
                                        {disconnecting === connection.provider ? 'Disconnecting...' : 'Disconnect'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleConnect(connection.provider)}
                                        className="px-4 py-2 text-sm bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:opacity-90 font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wider rounded"
                                    >
                                        Connect
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info Section */}
            <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
                <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-3">
                    Privacy & Security
                </h3>
                <p className="text-xs text-[var(--text-tertiary)]">
                    We only use your connected accounts for authentication and features you explicitly enable.
                    We never post on your behalf or access private data without permission.
                </p>
            </div>
        </div>
    );
}
