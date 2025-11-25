import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto p-4 min-h-screen">
            <div className="mb-8">
                <Link href="/" className="text-[var(--accent-tertiary)] hover:text-[var(--accent-primary)] transition-colors">
                    ← Back
                </Link>
            </div>

            <article className="space-y-8">
                <header>
                    <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold mb-4 text-[var(--text-primary)]">
                        About Honkingversion
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)]">
                        The ultimate community-driven database for Goose performances.
                    </p>
                </header>

                <section>
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-4 text-[var(--text-primary)]">
                        What is Honkingversion?
                    </h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                        Honkingversion is a community-driven platform dedicated to celebrating Goose performances. Each song in Goose's catalog has been performed countless times - in studios, on stages, at festivals, and everywhere in between. Our mission is to help fans discover, track, and rate their favorite versions of iconic songs.
                    </p>
                </section>

                <section>
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-4 text-[var(--text-primary)]">
                        Our Mission
                    </h2>
                    <ul className="space-y-3 text-[var(--text-secondary)]">
                        <li className="flex gap-3">
                            <span className="text-[var(--accent-primary)]">→</span>
                            <span>Help fans discover the definitive version of their favorite songs</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-[var(--accent-primary)]">→</span>
                            <span>Create a comprehensive, community-curated archive of performances</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-[var(--accent-primary)]">→</span>
                            <span>Connect Goose fans through shared musical appreciation</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-[var(--accent-primary)]">→</span>
                            <span>Preserve and celebrate the band's rich performance history</span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-4 text-[var(--text-primary)]">
                        How It Works
                    </h2>
                    <div className="space-y-4 text-[var(--text-secondary)]">
                        <p>
                            Browse our database of songs and their various performances. Each performance can be rated and voted on by the community. The version with the most community votes becomes the "Honking Version" - the definitive fan-favorite performance of that song.
                        </p>
                        <p>
                            Sign in to create your own lists, follow other fans, and track which shows you've attended. Your voting history helps us understand which performances resonate most with the community.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-4 text-[var(--text-primary)]">
                        Disclaimer
                    </h2>
                    <p className="text-[var(--text-secondary)] italic">
                        Honkingversion loves Goose but is in no way affiliated with The Organization or affiliated enterprises. All data is provided by our community and external music databases.
                    </p>
                </section>

                <section>
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-4 text-[var(--text-primary)]">
                        Get Started
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-4">
                        Ready to explore? Here are some ways to get involved:
                    </p>
                    <ul className="space-y-2 text-[var(--text-secondary)]">
                        <li>
                            <Link href="/songs" className="text-[var(--accent-tertiary)] hover:text-[var(--accent-primary)] transition-colors">
                                Browse Songs →
                            </Link>
                        </li>
                        <li>
                            <Link href="/shows" className="text-[var(--accent-tertiary)] hover:text-[var(--accent-primary)] transition-colors">
                                Explore Shows →
                            </Link>
                        </li>
                        <li>
                            <Link href="/performance-comparisons" className="text-[var(--accent-tertiary)] hover:text-[var(--accent-primary)] transition-colors">
                                View Trends →
                            </Link>
                        </li>
                    </ul>
                </section>
            </article>
        </div>
    );
}
