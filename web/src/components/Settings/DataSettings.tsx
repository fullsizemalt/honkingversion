'use client';

import { useState } from 'react';

type ExportFormat = 'csv' | 'json';

export default function DataSettings() {
    const [exporting, setExporting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [exportFormat, setExportFormat] = useState<ExportFormat>('json');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const handleExportData = async () => {
        setExporting(true);
        setError(null);

        try {
            // In production: await fetch(`/api/hv/settings/export?format=${exportFormat}`)
            // Mock data export
            const mockData = {
                profile: {
                    id: 123,
                    username: 'honkfan42',
                    email: 'honkfan@example.com',
                    created_at: new Date().toISOString()
                },
                stats: {
                    total_votes: 456,
                    shows_attended: 12,
                    followers: 34,
                    following: 56
                },
                votes: [
                    { show_id: 1, rating: 9.5 },
                    { show_id: 2, rating: 8.0 }
                ]
            };

            let content: string;
            let filename: string;

            if (exportFormat === 'json') {
                content = JSON.stringify(mockData, null, 2);
                filename = 'honkingversion-export.json';
            } else {
                // CSV format
                const rows = [
                    ['Type', 'Field', 'Value'],
                    ['profile', 'id', mockData.profile.id.toString()],
                    ['profile', 'username', mockData.profile.username],
                    ['profile', 'email', mockData.profile.email],
                    ...mockData.votes.map((v, i) => ['vote', `show_${i}`, `${v.show_id}:${v.rating}`])
                ];
                content = rows.map(r => r.join(',')).join('\n');
                filename = 'honkingversion-export.csv';
            }

            // Download file
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to export data');
        } finally {
            setExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
            setError('Please type the confirmation text exactly');
            return;
        }

        setDeleting(true);
        setError(null);

        try {
            // In production: await fetch('/api/hv/settings/delete-account', { method: 'POST' })
            // Logout and redirect would happen after
            setSuccess(true);
            setTimeout(() => {
                // window.location.href = '/';
                setShowDeleteConfirm(false);
                setDeleteConfirmText('');
            }, 2000);
        } catch (err) {
            setError('Failed to delete account');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded p-6">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] mb-6">
                Data & Privacy
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                    {deleteConfirmText === 'DELETE MY ACCOUNT'
                        ? 'Your account deletion request has been processed.'
                        : 'Your data has been exported successfully!'}
                </div>
            )}

            <div className="space-y-6">
                {/* Export Data Section */}
                <div className="pb-6 border-b border-[var(--border-subtle)]">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] mb-2">
                        Export Your Data
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                        Download a copy of all your personal data in a portable format. This includes your profile,
                        votes, attendance history, and lists.
                    </p>

                    <div className="mb-4">
                        <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                            Export Format
                        </label>
                        <div className="space-y-2">
                            {(['json', 'csv'] as const).map((format) => (
                                <label key={format} className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="exportFormat"
                                        value={format}
                                        checked={exportFormat === format}
                                        onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                                        className="mr-3"
                                    />
                                    <span className="text-sm text-[var(--text-secondary)] uppercase font-bold">
                                        {format === 'json' && 'JSON - Structured format for data analysis'}
                                        {format === 'csv' && 'CSV - Spreadsheet-compatible format'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleExportData}
                        disabled={exporting}
                        className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-50 font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded"
                    >
                        {exporting ? 'Exporting...' : '⬇ Download My Data'}
                    </button>

                    <p className="text-xs text-[var(--text-tertiary)] mt-3">
                        Exports are generated on-demand and contain only your personal data. No log files or system data are included.
                    </p>
                </div>

                {/* Data Rights Section */}
                <div className="pb-6 border-b border-[var(--border-subtle)]">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] mb-2">
                        Your Data Rights
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                        As a user, you have rights under data protection laws like GDPR:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-[var(--text-tertiary)]">
                        <li><strong>Right to access:</strong> Download all your data (using export above)</li>
                        <li><strong>Right to rectification:</strong> Update your profile information</li>
                        <li><strong>Right to erasure:</strong> Delete your account and all associated data</li>
                        <li><strong>Right to data portability:</strong> Export in machine-readable format</li>
                        <li><strong>Right to object:</strong> Contact us to opt out of certain processing</li>
                    </ul>
                </div>

                {/* Delete Account Section */}
                <div>
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-red-600 mb-2">
                        Delete Your Account
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded"
                        >
                            Delete My Account
                        </button>
                    ) : (
                        <div className="p-4 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-700 font-bold mb-3">
                                ⚠️ This will permanently delete:
                            </p>
                            <ul className="list-disc list-inside text-sm text-red-700 mb-4 space-y-1">
                                <li>Your account and profile</li>
                                <li>All your votes and ratings</li>
                                <li>Your attendance history</li>
                                <li>Your custom lists</li>
                                <li>Your followers and following relationships</li>
                                <li>All personal data</li>
                            </ul>

                            <p className="text-sm text-red-700 mb-3">
                                To confirm, type <strong>DELETE MY ACCOUNT</strong> below:
                            </p>

                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="DELETE MY ACCOUNT"
                                className="w-full px-3 py-2 bg-white border border-red-300 text-red-700 placeholder-red-300 focus:outline-none focus:border-red-500 font-[family-name:var(--font-ibm-plex-mono)] text-sm rounded mb-3"
                            />

                            <div className="flex gap-2">
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={deleting || deleteConfirmText !== 'DELETE MY ACCOUNT'}
                                    className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded"
                                >
                                    {deleting ? 'Deleting...' : 'Permanently Delete Account'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeleteConfirmText('');
                                    }}
                                    className="px-4 py-2 bg-white border border-red-300 text-red-700 hover:bg-red-50 font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
