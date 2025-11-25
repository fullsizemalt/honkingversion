'use client';

import { useEffect, useState } from 'react';

interface PrivacyPreferences {
    profile_visibility: string;
    activity_visibility: string;
    show_attendance_public: boolean;
    allow_follows: boolean;
    allow_messages: string;
    show_stats: boolean;
    indexable: boolean;
}

export default function PrivacySettings() {
    const [preferences, setPreferences] = useState<PrivacyPreferences>({
        profile_visibility: 'public',
        activity_visibility: 'everyone',
        show_attendance_public: true,
        allow_follows: true,
        allow_messages: 'everyone',
        show_stats: true,
        indexable: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchPrivacySettings();
    }, []);

    const fetchPrivacySettings = async () => {
        try {
            const response = await fetch('/api/hv/settings/privacy', {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setPreferences(data);
            }
        } catch (err) {
            setError('Failed to load privacy settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/hv/settings/privacy', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError('Failed to save privacy settings');
            }
        } catch (err) {
            setError('An error occurred while saving');
        } finally {
            setSaving(false);
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

    return (
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded p-6">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] mb-6">
                Privacy Settings
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                    Privacy settings updated successfully!
                </div>
            )}

            <div className="space-y-6">
                {/* Profile Visibility */}
                <div className="pb-6 border-b border-[var(--border-subtle)]">
                    <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-3">
                        Profile Visibility
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)] mb-3">
                        Control who can view your profile
                    </p>
                    <div className="space-y-2">
                        {['public', 'unlisted', 'private'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="profile_visibility"
                                    value={option}
                                    checked={preferences.profile_visibility === option}
                                    onChange={(e) => setPreferences({ ...preferences, profile_visibility: e.target.value })}
                                    className="mr-3"
                                />
                                <span className="text-sm text-[var(--text-secondary)] capitalize">
                                    {option === 'public' && 'Public - Anyone can find and view your profile'}
                                    {option === 'unlisted' && 'Unlisted - Only people with direct link can view'}
                                    {option === 'private' && 'Private - Only followers can view your profile'}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Activity Visibility */}
                <div className="pb-6 border-b border-[var(--border-subtle)]">
                    <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-3">
                        Activity Visibility
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)] mb-3">
                        Who can see your activity and reviews
                    </p>
                    <div className="space-y-2">
                        {['everyone', 'followers', 'private'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="activity_visibility"
                                    value={option}
                                    checked={preferences.activity_visibility === option}
                                    onChange={(e) => setPreferences({ ...preferences, activity_visibility: e.target.value })}
                                    className="mr-3"
                                />
                                <span className="text-sm text-[var(--text-secondary)] capitalize">
                                    {option === 'everyone' && 'Everyone - All users can see your activity'}
                                    {option === 'followers' && 'Followers - Only followers can see your activity'}
                                    {option === 'private' && 'Private - Only you can see your activity'}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Message Permissions */}
                <div className="pb-6 border-b border-[var(--border-subtle)]">
                    <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-3">
                        Allow Messages From
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)] mb-3">
                        Who can send you direct messages
                    </p>
                    <div className="space-y-2">
                        {['everyone', 'followers', 'none'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="allow_messages"
                                    value={option}
                                    checked={preferences.allow_messages === option}
                                    onChange={(e) => setPreferences({ ...preferences, allow_messages: e.target.value })}
                                    className="mr-3"
                                />
                                <span className="text-sm text-[var(--text-secondary)] capitalize">
                                    {option === 'everyone' && 'Everyone - Any user can message you'}
                                    {option === 'followers' && 'Followers - Only followers can message you'}
                                    {option === 'none' && 'No one - Disable direct messages'}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Boolean Toggles */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)]">
                                Show Attendance Publicly
                            </h3>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                Display which shows you've attended
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.show_attendance_public}
                                onChange={(e) => setPreferences({ ...preferences, show_attendance_public: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[var(--border-subtle)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                        <div>
                            <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)]">
                                Allow Follows
                            </h3>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                Allow other users to follow you
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.allow_follows}
                                onChange={(e) => setPreferences({ ...preferences, allow_follows: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[var(--border-subtle)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                        <div>
                            <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)]">
                                Show Statistics
                            </h3>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                Display your viewing and attendance stats
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.show_stats}
                                onChange={(e) => setPreferences({ ...preferences, show_stats: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[var(--border-subtle)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                        <div>
                            <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)]">
                                Allow Search Indexing
                            </h3>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                Allow search engines to index your profile
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={preferences.indexable}
                                onChange={(e) => setPreferences({ ...preferences, indexable: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-[var(--border-subtle)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                        </label>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-2 pt-4 border-t border-[var(--border-subtle)]">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-50 transition-opacity font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
