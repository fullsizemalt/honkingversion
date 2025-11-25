'use client';

import { useState } from 'react';

export default function AccountSettings() {
    const [email, setEmail] = useState('');
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleEmailChange = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/hv/settings/account/email', {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    new_email: newEmail,
                    password: emailPassword,
                }),
            });

            if (response.ok) {
                setSuccess(true);
                setShowEmailModal(false);
                setNewEmail('');
                setEmailPassword('');
                setTimeout(() => setSuccess(false), 3000);
            } else {
                const data = await response.json();
                setError(data.detail || 'Failed to change email');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/hv/settings/account/password', {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            if (response.ok) {
                setSuccess(true);
                setShowPasswordModal(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setSuccess(false), 3000);
            } else {
                const data = await response.json();
                setError(data.detail || 'Failed to change password');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded p-6">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] mb-6">
                Account Settings
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                    Account updated successfully!
                </div>
            )}

            <div className="space-y-6">
                {/* Email Section */}
                <div className="pb-6 border-b border-[var(--border-subtle)]">
                    <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-3">
                        Email Address
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[var(--text-secondary)] text-sm">
                                {email || 'Not set'}
                            </p>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                Used for login and notifications
                            </p>
                        </div>
                        <button
                            onClick={() => setShowEmailModal(true)}
                            className="px-3 py-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider rounded"
                        >
                            Change Email
                        </button>
                    </div>
                </div>

                {/* Password Section */}
                <div>
                    <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-3">
                        Password
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[var(--text-secondary)] text-sm">
                                ••••••••
                            </p>
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                Last changed: Unknown
                            </p>
                        </div>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="px-3 py-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider rounded"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </div>

            {/* Email Change Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-6 max-w-md w-full">
                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] mb-4">
                            Change Email
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                    New Email
                                </label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={emailPassword}
                                    onChange={(e) => setEmailPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm rounded"
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button
                                    onClick={handleEmailChange}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-50 font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded"
                                >
                                    {loading ? 'Updating...' : 'Update Email'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowEmailModal(false);
                                        setError(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-6 max-w-md w-full">
                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] mb-4">
                            Change Password
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm rounded"
                                />
                            </div>
                            <div>
                                <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm rounded"
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button
                                    onClick={handlePasswordChange}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-50 font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setError(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
