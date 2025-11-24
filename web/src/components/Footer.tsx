"use client";

import Link from 'next/link';
import { useState } from 'react';
import FeedbackModal from './FeedbackModal';

export default function Footer() {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    return (
        <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] py-8 mt-16 text-[var(--text-secondary)]">
            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />

            <div className="max-w-7xl mx-auto px-4">
                {/* Navigation Links */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div className="flex flex-wrap gap-4 mb-4 md:mb-0 text-xs font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wide">
                        <Link href="/shows" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Shows</Link>
                        <Link href="/songs" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Songs</Link>
                        <Link href="/lists" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Lists</Link>
                        <Link href="/updates" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Updates</Link>
                        <button
                            onClick={() => setIsFeedbackOpen(true)}
                            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-left"
                        >
                            Report Issue
                        </button>
                        <Link href="/attribution" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Attribution</Link>
                    </div>
                    <div className="text-[10px] font-[family-name:var(--font-ibm-plex-mono)] tracking-[0.3em] uppercase text-[var(--text-tertiary)]">
                        © {new Date().getFullYear()} Honkingversion.runfoo.run
                    </div>
                </div>

                {/* Attribution Notice */}
                <div className="border-t border-[var(--border-subtle)] pt-4">
                    <div className="text-[var(--text-tertiary)] text-[10px] font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-[0.3em]">
                        Data provided by <a href="https://elgoose.net" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">El Goose</a>
                        {' • '}
                        <Link href="/attribution" className="text-[var(--accent-primary)] hover:underline">See full attribution and usage policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
