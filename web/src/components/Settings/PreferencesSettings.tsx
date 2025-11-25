'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useToast } from '@/components/ToastContainer';
import { Moon, Sun, Monitor } from 'lucide-react';

interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
}

export default function PreferencesSettings() {
    const { theme, setTheme } = useTheme();
    const { addToast } = useToast();
    const [preferences, setPreferences] = useState<UserPreferences>({
        theme: 'system',
        language: 'en',
        timezone: 'UTC',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPreferences();
    }, []);

    useEffect(() => {
        // Sync next-themes theme with preferences
        if (theme && theme !== preferences.theme) {
            setPreferences(prev => ({ ...prev, theme: theme as 'light' | 'dark' | 'system' }));
        }
    }, [theme, preferences.theme]);

    const fetchPreferences = async () => {
        try {
            // Fetch from localStorage for now (MVP)
            const stored = localStorage.getItem('userPreferences');
            if (stored) {
                const parsed = JSON.parse(stored);
                setPreferences(parsed);
                // Apply saved theme
                if (parsed.theme) {
                    setTheme(parsed.theme);
                }
            } else if (theme) {
                // Use next-themes default
                setPreferences(prev => ({ ...prev, theme: theme as 'light' | 'dark' | 'system' }));
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

        try {
            // Save to localStorage
            localStorage.setItem('userPreferences', JSON.stringify(preferences));

            // Apply theme using next-themes
            setTheme(preferences.theme);

            // Show success toast
            addToast('Preferences updated successfully!', 'success');
        } catch (err) {
            const message = 'An error occurred while saving';
            setError(message);
            addToast(message, 'error');
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

            <div className="space-y-6">
                {/* Theme Setting */}
                <div className="pb-6 border-b border-[var(--border-subtle)]">
                    <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-3">
                        Appearance
                    </h3>
                    <p className="text-xs text-[var(--text-tertiary)] mb-4">
                        Choose how the site looks. System preference follows your device settings.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label
                            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                preferences.theme === 'light'
                                    ? 'border-[var(--accent-primary)] bg-[var(--bg-muted)]'
                                    : 'border-[var(--border-subtle)] hover:border-[var(--border)]'
                            }`}
                        >
                            <input
                                type="radio"
                                name="theme"
                                value="light"
                                checked={preferences.theme === 'light'}
                                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as 'light' | 'dark' | 'system' })}
                                className="hidden"
                            />
                            <Sun className="w-5 h-5 text-yellow-500" />
                            <div>
                                <div className="font-bold text-sm text-[var(--text-primary)]">Light</div>
                                <div className="text-xs text-[var(--text-tertiary)]">Bright theme</div>
                            </div>
                        </label>

                        <label
                            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                preferences.theme === 'dark'
                                    ? 'border-[var(--accent-primary)] bg-[var(--bg-muted)]'
                                    : 'border-[var(--border-subtle)] hover:border-[var(--border)]'
                            }`}
                        >
                            <input
                                type="radio"
                                name="theme"
                                value="dark"
                                checked={preferences.theme === 'dark'}
                                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as 'light' | 'dark' | 'system' })}
                                className="hidden"
                            />
                            <Moon className="w-5 h-5 text-blue-500" />
                            <div>
                                <div className="font-bold text-sm text-[var(--text-primary)]">Dark</div>
                                <div className="text-xs text-[var(--text-tertiary)]">Dark theme</div>
                            </div>
                        </label>

                        <label
                            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                                preferences.theme === 'system'
                                    ? 'border-[var(--accent-primary)] bg-[var(--bg-muted)]'
                                    : 'border-[var(--border-subtle)] hover:border-[var(--border)]'
                            }`}
                        >
                            <input
                                type="radio"
                                name="theme"
                                value="system"
                                checked={preferences.theme === 'system'}
                                onChange={(e) => setPreferences({ ...preferences, theme: e.target.value as 'light' | 'dark' | 'system' })}
                                className="hidden"
                            />
                            <Monitor className="w-5 h-5 text-[var(--accent-primary)]" />
                            <div>
                                <div className="font-bold text-sm text-[var(--text-primary)]">System</div>
                                <div className="text-xs text-[var(--text-tertiary)]">Device setting</div>
                            </div>
                        </label>
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
