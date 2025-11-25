'use client';

import { useState, useEffect } from 'react';

interface SecuritySettings {
    two_factor_enabled: boolean;
    two_factor_method: 'authenticator' | 'sms' | 'email' | null;
    backup_codes_generated: boolean;
    last_backup_codes_generated?: string;
}

export default function SecuritySettings() {
    const [settings, setSettings] = useState<SecuritySettings>({
        two_factor_enabled: false,
        two_factor_method: null,
        backup_codes_generated: false,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showSetupModal, setShowSetupModal] = useState(false);
    const [showBackupCodes, setShowBackupCodes] = useState(false);
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [verificationCode, setVerificationCode] = useState('');
    const [setupStep, setSetupStep] = useState<'select' | 'qr' | 'verify' | 'backup'>('select');
    const [selectedMethod, setSelectedMethod] = useState<'authenticator' | 'sms' | 'email'>('authenticator');
    const [qrCode, setQrCode] = useState('');

    useEffect(() => {
        fetchSecuritySettings();
    }, []);

    const fetchSecuritySettings = async () => {
        try {
            // Mock data for MVP
            setSettings({
                two_factor_enabled: false,
                two_factor_method: null,
                backup_codes_generated: false,
            });
        } catch (err) {
            setError('Failed to load security settings');
        } finally {
            setLoading(false);
        }
    };

    const handleStartSetup = () => {
        setShowSetupModal(true);
        setSetupStep('select');
    };

    const handleMethodSelect = (method: 'authenticator' | 'sms' | 'email') => {
        setSelectedMethod(method);
        setSetupStep('qr');
        // Mock QR code generation
        setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA');
    };

    const handleVerify = async () => {
        if (!verificationCode.trim()) {
            setError('Please enter the verification code');
            return;
        }

        // Mock verification
        if (verificationCode.length === 6) {
            const newCodes = Array.from({ length: 10 }, (_, i) =>
                `${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            );
            setBackupCodes(newCodes);
            setSettings({
                ...settings,
                two_factor_enabled: true,
                two_factor_method: selectedMethod,
                backup_codes_generated: true
            });
            setSetupStep('backup');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } else {
            setError('Invalid verification code');
        }
    };

    const handleDisable2FA = async () => {
        if (!confirm('Are you sure? This will disable two-factor authentication.')) return;

        setSaving(true);
        try {
            setSettings({
                ...settings,
                two_factor_enabled: false,
                two_factor_method: null
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to disable 2FA');
        } finally {
            setSaving(false);
        }
    };

    const handleRegenerateBackupCodes = async () => {
        if (!confirm('Regenerating codes will invalidate all existing backup codes.')) return;

        setSaving(true);
        try {
            const newCodes = Array.from({ length: 10 }, (_, i) =>
                `${Math.random().toString(36).substring(2, 8).toUpperCase()}`
            );
            setBackupCodes(newCodes);
            setShowBackupCodes(true);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to regenerate backup codes');
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadCodes = () => {
        const text = backupCodes.join('\n');
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', 'backup-codes.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
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
                Security
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                    Security settings updated successfully!
                </div>
            )}

            <div className="space-y-6">
                {/* 2FA Status */}
                <div className="pb-6 border-b border-[var(--border-subtle)]">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] mb-2">
                                Two-Factor Authentication
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-3">
                                {settings.two_factor_enabled
                                    ? `Enabled via ${settings.two_factor_method}`
                                    : 'Add an extra layer of security to your account'}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className={`inline-block px-3 py-1 rounded text-xs font-bold ${
                                settings.two_factor_enabled
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {settings.two_factor_enabled ? 'ENABLED' : 'DISABLED'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        {!settings.two_factor_enabled ? (
                            <button
                                onClick={handleStartSetup}
                                className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-50 font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded"
                            >
                                Enable 2FA
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowBackupCodes(!showBackupCodes)}
                                    className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded mr-2"
                                >
                                    View Backup Codes
                                </button>
                                <button
                                    onClick={handleRegenerateBackupCodes}
                                    disabled={saving}
                                    className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded mr-2"
                                >
                                    Regenerate Codes
                                </button>
                                <button
                                    onClick={handleDisable2FA}
                                    disabled={saving}
                                    className="px-4 py-2 bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 disabled:opacity-50 font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded"
                                >
                                    Disable 2FA
                                </button>
                            </>
                        )}
                    </div>

                    {showBackupCodes && backupCodes.length > 0 && (
                        <div className="mt-4 p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded">
                            <h4 className="font-bold text-[var(--text-primary)] mb-3">Backup Codes</h4>
                            <div className="bg-[#0a0a0a] p-3 font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#90ee90] mb-3 rounded">
                                {backupCodes.map((code, i) => (
                                    <div key={i}>{code}</div>
                                ))}
                            </div>
                            <button
                                onClick={handleDownloadCodes}
                                className="px-3 py-1 text-xs bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:opacity-90 font-[family-name:var(--font-ibm-plex-mono)] rounded"
                            >
                                Download Codes
                            </button>
                        </div>
                    )}
                </div>

                {/* Security Tips */}
                <div>
                    <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-3">
                        Security Tips
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-xs text-[var(--text-tertiary)]">
                        <li>Use a strong, unique password</li>
                        <li>Enable two-factor authentication for extra security</li>
                        <li>Keep your backup codes in a safe place</li>
                        <li>Review active sessions regularly</li>
                        <li>Never share your authentication codes with anyone</li>
                    </ul>
                </div>
            </div>

            {/* Setup Modal */}
            {showSetupModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-6 max-w-md w-full">
                        <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] mb-4">
                            Set Up Two-Factor Authentication
                        </h3>

                        {setupStep === 'select' && (
                            <div className="space-y-3">
                                <p className="text-sm text-[var(--text-secondary)] mb-4">Choose your authentication method</p>
                                {(['authenticator', 'sms', 'email'] as const).map((method) => (
                                    <button
                                        key={method}
                                        onClick={() => handleMethodSelect(method)}
                                        className="w-full p-3 text-left border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] rounded"
                                    >
                                        <div className="font-bold text-[var(--text-primary)] capitalize">{method}</div>
                                        <div className="text-xs text-[var(--text-tertiary)]">
                                            {method === 'authenticator' && 'Use an authenticator app like Google Authenticator'}
                                            {method === 'sms' && 'Receive codes via text message'}
                                            {method === 'email' && 'Receive codes via email'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {setupStep === 'qr' && (
                            <div className="space-y-3">
                                <p className="text-sm text-[var(--text-secondary)]">Scan this QR code with your authenticator app</p>
                                <div className="bg-white p-4 rounded flex items-center justify-center">
                                    <img src={qrCode} alt="QR Code" className="w-40 h-40" />
                                </div>
                                <button
                                    onClick={() => setSetupStep('verify')}
                                    className="w-full px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:opacity-90 font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase rounded"
                                >
                                    Next
                                </button>
                                <button
                                    onClick={() => setShowSetupModal(false)}
                                    className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {setupStep === 'verify' && (
                            <div className="space-y-3">
                                <p className="text-sm text-[var(--text-secondary)]">Enter the 6-digit code from your authenticator</p>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] rounded text-center text-2xl tracking-widest"
                                />
                                <button
                                    onClick={handleVerify}
                                    className="w-full px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:opacity-90 font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase rounded"
                                >
                                    Verify & Enable
                                </button>
                            </div>
                        )}

                        {setupStep === 'backup' && (
                            <div className="space-y-3">
                                <p className="text-sm text-[var(--text-secondary)] mb-3">Save your backup codes in a safe place</p>
                                <div className="bg-[var(--bg-primary)] p-3 font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#90ee90] rounded overflow-y-auto max-h-40">
                                    {backupCodes.map((code, i) => (
                                        <div key={i}>{code}</div>
                                    ))}
                                </div>
                                <button
                                    onClick={handleDownloadCodes}
                                    className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase rounded"
                                >
                                    Download Codes
                                </button>
                                <button
                                    onClick={() => setShowSetupModal(false)}
                                    className="w-full px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:opacity-90 font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase rounded"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
