'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SettingsNav from '@/components/Settings/SettingsNav';
import ProfileSettings from '@/components/Settings/ProfileSettings';
import AccountSettings from '@/components/Settings/AccountSettings';
import PrivacySettings from '@/components/Settings/PrivacySettings';

type SettingsSection = 'profile' | 'account' | 'privacy';

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                    Loading settings...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--text-primary)] mb-2">
                        Settings
                    </h1>
                    <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                        Manage your account, privacy, and preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <SettingsNav activeSection={activeSection} onSectionChange={setActiveSection} />
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeSection === 'profile' && <ProfileSettings />}
                        {activeSection === 'account' && <AccountSettings />}
                        {activeSection === 'privacy' && <PrivacySettings />}
                    </div>
                </div>
            </div>
        </div>
    );
}
