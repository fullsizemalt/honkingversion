'use client';

import { useEffect, useState } from 'react';

interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
}

export default function PreferencesSettings() {
    const [preferences, setPreferences] = useState<UserPreferences>({
        theme: 'system',
        language: 'en',
        timezone: 'UTC',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try {
            // Fetch from localStorage for now (MVP)
            const stored = localStorage.getItem('userPreferences');
            if (stored) {
                setPreferences(JSON.parse(stored));
            }
        } catch (err) {
            setError('Failed to load preferences');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            // Save to localStorage for now (MVP)
            localStorage.setItem('userPreferences', JSON.stringify(preferences));

            // Apply theme immediately
            if (preferences.theme !== 'system') {
                document.documentElement.setAttribute('data-theme', preferences.theme);
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
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
                <div className="h-48 bg-[var(--bg-secondary)] rounded animate-pulse" />
            </div>
        );
    }

    return (
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded p-6">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] mb-6">
                Preferences
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                    Preferences updated successfully!
                </div>
            )}

            <div className="space-y-6">
                {/* Theme Setting */}
                <div className="pb-6 border-b border-[var(--border-subtle)]">
                    <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-3">
                        Theme
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)] mb-3">
                        Choose how the site looks
                    </p>
                    <div className="space-y-2">
                        {['light', 'dark', 'system'].map((option) => (
                            <label key={option} className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="theme"
                                    value={option}
                                    checked={preferences.theme === option}
                                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as 'light' | 'dark' | 'system' })}
                                    className="mr-3"
                                />
                                <span className="text-sm text-[var(--text-secondary)] capitalize">
                                    {option === 'light' && 'Light - Bright theme'}
                                    {option === 'dark' && 'Dark - Dark theme'}
                                    {option === 'system' && 'System - Follow device settings'}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Language Setting */}
                <div className="pb-6 border-b border-[var(--border-subtle)]">
                    <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-3">
                        Language
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)] mb-3">
                        Select your preferred language
                    </p>
                    <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm rounded"
                    >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="it">Italiano</option>
                        <option value="ja">日本語</option>
                    </select>
                    <p className="text-xs text-[var(--text-tertiary)] mt-2">
                        Note: Full translation support coming soon
                    </p>
                </div>

                {/* Timezone Setting */}
                <div className="pb-6 border-b border-[var(--border-subtle)]">
                    <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-3">
                        Timezone
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)] mb-3">
                        Set your timezone for show dates and notifications
                    </p>
                    <select
                        value={preferences.timezone}
                        onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm rounded"
                    >
                        <optgroup label="UTC">
                            <option value="UTC">UTC / GMT</option>
                        </optgroup>
                        <optgroup label="Americas">
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        </optgroup>
                        <optgroup label="Europe">
                            <option value="Europe/London">London (GMT)</option>
                            <option value="Europe/Paris">Paris (CET)</option>
                            <option value="Europe/Berlin">Berlin (CET)</option>
                        </optgroup>
                        <optgroup label="Asia">
                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                            <option value="Asia/Shanghai">Shanghai (CST)</option>
                            <option value="Asia/Hong_Kong">Hong Kong (HKT)</option>
                        </optgroup>
                        <optgroup label="Australia">
                            <option value="Australia/Sydney">Sydney (AEDT)</option>
                            <option value="Australia/Melbourne">Melbourne (AEDT)</option>
                        </optgroup>
                    </select>
                </div>

                {/* Save Button */}
                <div className="flex gap-2 pt-4">
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
