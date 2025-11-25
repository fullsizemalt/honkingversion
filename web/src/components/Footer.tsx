"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import FeedbackModal from './FeedbackModal';
import { ExternalLink, Wrench, Check } from 'lucide-react';

export default function Footer() {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [tapCount, setTapCount] = useState(0);
    const [devMode, setDevMode] = useState(false);

    // Check if dev mode is already enabled
    useEffect(() => {
        const isDevMode = localStorage.getItem('devMode') === 'true';
        setDevMode(isDevMode);
    }, []);

    // Handle secret tap gesture
    const handleSecretTap = () => {
        const newCount = tapCount + 1;
        setTapCount(newCount);

        if (newCount === 7) {
            const newDevMode = !devMode;
            setDevMode(newDevMode);
            localStorage.setItem('devMode', String(newDevMode));

            // Show toast notification
            const message = newDevMode ? <span className="flex items-center gap-2"><Wrench className="w-4 h-4" /> Dev mode activated!</span> : <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Dev mode deactivated</span>;
            alert(message);

            setTapCount(0);
        }

        // Reset tap count after 2 seconds of inactivity
        setTimeout(() => setTapCount(0), 2000);
    };

    return (
        <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)] mt-24">
            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />

            {/* Secret tap area for dev mode */}
            <div
                className="max-w-7xl mx-auto px-6 py-16"
                onClick={handleSecretTap}
                style={{ cursor: tapCount > 0 ? 'pointer' : 'default' }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                                HONKING<span className="text-[var(--accent-secondary)]">VERSION</span>
                            </span>
                        </Link>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm">
                            The ultimate community-driven database for Goose performances.
                            Track, rate, and discover the best versions of your favorite songs.
                        </p>
                        <div className="flex gap-4">
                            {/* Social placeholders if needed, or just keep it clean */}
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-6">
                            Explore
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link href="/shows" className="text-[var(--text-secondary)] hover:text-[var(--accent-tertiary)] transition-colors">
                                    Shows
                                </Link>
                            </li>
                            <li>
                                <Link href="/songs" className="text-[var(--text-secondary)] hover:text-[var(--accent-tertiary)] transition-colors">
                                    Songs
                                </Link>
                            </li>
                            <li>
                                <Link href="/lists" className="text-[var(--text-secondary)] hover:text-[var(--accent-tertiary)] transition-colors">
                                    Lists
                                </Link>
                            </li>
                            <li>
                                <Link href="/streaming" className="text-[var(--text-secondary)] hover:text-[var(--accent-tertiary)] transition-colors">
                                    Streaming
                                </Link>
                            </li>
                            {/* Reviews not yet implemented as a top-level route, omitting to avoid 404 */}
                        </ul>
                    </div>

                    {/* Analysis */}
                    <div>
                        <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-6">
                            Analysis
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link href="/performance-comparisons" className="text-[var(--text-secondary)] hover:text-[var(--accent-tertiary)] transition-colors">
                                    Trends
                                </Link>
                            </li>
                            <li>
                                <Link href="/venues" className="text-[var(--text-secondary)] hover:text-[var(--accent-tertiary)] transition-colors">
                                    Geographical
                                </Link>
                            </li>
                            <li>
                                <Link href="/years" className="text-[var(--text-secondary)] hover:text-[var(--accent-tertiary)] transition-colors">
                                    Temporal
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Community & Site */}
                    <div>
                        <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-6">
                            Community
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <a href="https://www.goosetheband.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-tertiary)] transition-colors">
                                    Official Site <ExternalLink className="w-3 h-3 opacity-50" />
                                </a>
                            </li>
                            <li>
                                <a href="https://elgoose.net/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-tertiary)] transition-colors">
                                    ElGoose.net <ExternalLink className="w-3 h-3 opacity-50" />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.reddit.com/r/GoosetheBand/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-tertiary)] transition-colors">
                                    Subreddit <ExternalLink className="w-3 h-3 opacity-50" />
                                </a>
                            </li>
                            <li>
                                <a href="https://community.wysterialane.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-tertiary)] transition-colors">
                                    Wysteria Lane <ExternalLink className="w-3 h-3 opacity-50" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-6 text-xs font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wide text-[var(--text-tertiary)]">
                            <Link href="/updates" className="hover:text-[var(--text-primary)] transition-colors">
                                Updates
                            </Link>
                            <button onClick={() => setIsFeedbackOpen(true)} className="hover:text-[var(--text-primary)] transition-colors">
                                Report Issue
                            </button>
                            <Link href="/attribution" className="hover:text-[var(--text-primary)] transition-colors">
                                Attribution
                            </Link>
                        </div>
                        <p className="text-[10px] font-[family-name:var(--font-ibm-plex-mono)] text-[var(--text-tertiary)] italic normal-case tracking-normal max-w-md">
                            Honkingversion loves Goose but is in no way affiliated with The Organization or affiliated enterprises.
                        </p>
                    </div>

                    <div className="text-[10px] font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-[0.2em] text-[var(--text-tertiary)] text-right">
                        <p className="mb-2">
                            Data provided by <a href="https://elgoose.net" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">El Goose</a>
                        </p>
                        <p>
                            © {new Date().getFullYear()} Honkingversion.runfoo.run
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
