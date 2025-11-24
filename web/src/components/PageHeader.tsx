'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface PageHeaderProps {
    title: string;
    description: string;
    loggedInMessage?: string;
}

export default function PageHeader({ title, description, loggedInMessage }: PageHeaderProps) {
    const { data: session } = useSession();

    return (
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-2">
                    <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl font-bold text-[var(--text-primary)] uppercase tracking-tight">
                        {title}
                    </h1>
                    <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)] mt-2 tracking-[0.3em] uppercase">
                        {description}
                    </p>
                </div>
                {!session ? (
                    <div className="mt-6 flex flex-wrap gap-3 items-center">
                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)]">Please</span>
                        <Link
                            href="/auth/signin"
                            className="px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase tracking-wider text-[var(--text-inverse)] bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] transition-colors rounded-full shadow-sm"
                        >
                            Login
                        </Link>
                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)]">or</span>
                        <Link
                            href="/auth/register"
                            className="px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] border-2 border-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-inverse)] transition-colors rounded-full"
                        >
                            Register
                        </Link>
                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)]">to vote on your favorite performances.</span>
                    </div>
                ) : loggedInMessage ? (
                    <p className="mt-6 font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)]">
                        {loggedInMessage}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
