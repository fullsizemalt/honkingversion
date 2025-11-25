'use client';

import Link from "next/link";

const sections = [
    {
        title: "Songs",
        description: "Write community synopses for songs and their top versions.",
        href: "/songs",
        cta: "Browse songs"
    },
    {
        title: "Shows",
        description: "Add context and color to shows with notable performances.",
        href: "/shows",
        cta: "Browse shows"
    },
    {
        title: "Venues",
        description: "Document venue quirks, acoustics, and historic runs.",
        href: "/venues",
        cta: "Browse venues"
    },
    {
        title: "Tours",
        description: "Capture tour lore and thematic threads across dates.",
        href: "/tours",
        cta: "Browse tours"
    }
];

export default function WikiPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
                <header className="space-y-3 text-center">
                    <p className="text-xs tracking-[0.3em] uppercase text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)]">
                        Community Synopsis
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-space-grotesk)]">
                        Build the Goose Wiki
                    </h1>
                    <p className="text-[var(--text-secondary)] max-w-3xl mx-auto">
                        Use the synopsis blocks on songs, shows, venues, and tours to capture history, context, and lore. This page is your launchpad to the editable sections across the site.
                    </p>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sections.map((section) => (
                        <Link
                            key={section.title}
                            href={section.href}
                            className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 hover:border-[var(--accent-primary)] transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-space-grotesk)]">
                                    {section.title}
                                </h2>
                                <span className="text-[var(--accent-primary)] text-sm font-[family-name:var(--font-ibm-plex-mono)]">
                                    {section.cta} →
                                </span>
                            </div>
                            <p className="text-[var(--text-secondary)] text-sm">{section.description}</p>
                        </Link>
                    ))}
                </section>

                <section className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 space-y-3">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] font-[family-name:var(--font-space-grotesk)]">
                        How editing works
                    </h3>
                    <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-1 text-sm">
                        <li>Find a page with a “Community Synopsis” block (songs, shows, venues, tours).</li>
                        <li>Click “Edit” to add or update the synopsis (markdown supported).</li>
                        <li>Each save bumps the version and keeps an edit history to prevent conflicts.</li>
                        <li>Keep summaries concise and focused on why the entry matters.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
