"use client";

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { getApiEndpoint } from '@/lib/api';
import Link from 'next/link';

export default function ExportPage() {
    const { data: session } = useSession();
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleDownload = async () => {
        setError('');
        if (!session?.user?.accessToken) {
            setError('Please sign in to download your export.');
            return;
        }
        setDownloading(true);
        try {
            const res = await fetch(getApiEndpoint('/export/me/csv'), {
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`,
                },
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to download export');
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'honkingversion_export.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (e: any) {
            setError(e.message || 'Failed to download export');
        } finally {
            setDownloading(false);
        }
    };

    if (!session) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold mb-6 text-[#f5f5f5]">
                    Export Your Data
                </h1>
                <p className="text-[#a0a0a0]">Please sign in to export your data.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold mb-6 text-[#f5f5f5]">
                Export Your Data
            </h1>

            <div className="mb-8 p-4 bg-[#1a1a1a] border border-[#ff6b35]">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[#ff6b35] mb-3">
                    Download Your Complete Data
                </h2>
                <p className="text-[#a0a0a0] mb-4">
                    Export a CSV file containing your complete HonkingVersion data. This includes your profile, all votes and ratings, shows you've attended, users you follow, and custom lists.
                </p>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-block bg-[#ff6b35] text-[#0a0a0a] px-6 py-3 font-[family-name:var(--font-ibm-plex-mono)] hover:bg-[#ff8c5a] font-bold disabled:opacity-60"
                >
                    {downloading ? 'Preparing…' : '⬇ Download CSV'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Link href="/export/instructions" className="block p-4 bg-[#1a1a1a] border border-[#a0a0a0] hover:border-[#ff6b35] transition">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[#f5f5f5] mb-2">
                        📖 Instructions
                    </h3>
                    <p className="text-[#a0a0a0] text-sm">
                        Learn what's included in your export and how to use it.
                    </p>
                </Link>

                <Link href="/export/glossary" className="block p-4 bg-[#1a1a1a] border border-[#a0a0a0] hover:border-[#ff6b35] transition">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[#f5f5f5] mb-2">
                        📚 Glossary
                    </h3>
                    <p className="text-[#a0a0a0] text-sm">
                        Reference guide for all fields in your CSV export.
                    </p>
                </Link>
            </div>

            <div className="p-4 bg-[#1a1a1a] border border-[#a0a0a0]">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[#f5f5f5] mb-3">
                    Why Export?
                </h2>
                <ul className="text-[#a0a0a0] space-y-2 text-sm">
                    <li>✓ Back up your voting history and preferences</li>
                    <li>✓ Analyze your own listening patterns and attendance</li>
                    <li>✓ Keep a record of your HonkingVersion activity</li>
                    <li>✓ Exercise your data rights</li>
                </ul>
            </div>
        </div>
    );
}
