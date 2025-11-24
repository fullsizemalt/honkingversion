import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Attribution',
    description: 'Credits and compliance information for the El Goose API',
};

export default function Attribution() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            {/* Header */}
            <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="relative pl-4">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-purple)]" />
                        <h1 className="font-[family-name:var(--font-space-grotesk)] text-5xl font-bold text-[var(--text-primary)] mb-2 uppercase tracking-tight">
                            Attribution & Policy
                        </h1>
                        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] uppercase tracking-[0.35em]">
                            Data sources and usage compliance
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* El Goose Attribution */}
                <section className="mb-12 border border-[var(--border)] p-6 bg-[var(--bg-secondary)] shadow-[0_20px_45px_rgba(20,20,20,0.08)]">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] mb-4 uppercase tracking-[0.35em]">
                        El Goose Data Attribution
                    </h2>

                    <div className="space-y-4 font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)]">
                        <p>
                            <strong>Honkingversion.runfoo.run</strong> uses data provided by the{' '}
                            <a href="https://elgoose.net" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">
                                El Goose API
                            </a>
                            , a comprehensive database of Goose setlists, performances, and related information.
                        </p>

                        <div className="bg-[var(--bg-muted)] border border-[var(--border-subtle)] p-4">
                            <p className="font-bold mb-2">El Goose API Details:</p>
                            <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)]">
                                <li>Base URL: <code className="text-[var(--accent-tertiary)]">https://elgoose.net/api/v2</code></li>
                                <li>Public API with no authentication required</li>
                                <li>Used for: Setlist data, performance history, venue information</li>
                                <li>Data Format: JSON</li>
                            </ul>
                        </div>

                        <p>
                            All song titles, setlist information, show dates, venues, and locations come directly from El Goose's public database.
                            We are grateful to the El Goose team for maintaining this resource and making it publicly accessible.
                        </p>
                    </div>
                </section>

                {/* Usage Policy */}
                <section className="mb-12 border border-[var(--border)] p-6 bg-[var(--bg-secondary)] shadow-[0_20px_45px_rgba(20,20,20,0.08)]">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] mb-4 uppercase tracking-[0.35em]">
                        API Usage Policy
                    </h2>

                    <div className="space-y-4 font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)]">
                        <div>
                            <p className="font-bold mb-2 text-[var(--accent-primary)]">Access & Authentication:</p>
                            <p className="text-[var(--text-secondary)]">
                                The El Goose API is publicly accessible and requires no authentication. No API key, token, or registration is necessary.
                            </p>
                        </div>

                        <div>
                            <p className="font-bold mb-2 text-[var(--accent-primary)]">Usage Approach:</p>
                            <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)]">
                                <li>Honkingversion.runfoo.run uses El Goose as a data source, not a service</li>
                                <li>Data is fetched server-side and displayed with proper attribution</li>
                                <li>All external links point back to El Goose for original source verification</li>
                                <li>No data modification or republishing without attribution</li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-bold mb-2 text-[var(--accent-primary)]">Responsible Use:</p>
                            <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)]">
                                <li>Queries are made with reasonable frequency and caching where possible</li>
                                <li>User-Agent headers identify requests as coming from Honkingversion</li>
                                <li>No automated mass scraping or harvesting of data</li>
                                <li>All usage is attributed back to El Goose</li>
                            </ul>
                        </div>

                        <div className="bg-[var(--bg-muted)] border border-[var(--border-subtle)] p-4">
                            <p className="font-bold mb-2 text-[var(--accent-tertiary)]">Policy Document:</p>
                            <p className="text-[var(--text-secondary)] text-xs">
                                For complete technical and legal details, see the{' '}
                                <code className="text-[var(--accent-primary)]">API_USAGE_POLICY.md</code>
                                {' '}file in the project repository.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Compliance */}
                <section className="mb-12 border border-[var(--border)] p-6 bg-[var(--bg-secondary)] shadow-[0_20px_45px_rgba(20,20,20,0.08)]">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] mb-4 uppercase tracking-[0.35em]">
                        Compliance & Contact
                    </h2>

                    <div className="space-y-4 font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)]">
                        <p>
                            Honkingversion.runfoo.run operates under the assumption that the publicly available El Goose API is intended for third-party usage
                            based on its public accessibility and lack of authentication requirements.
                        </p>

                        <p>
                            If you are affiliated with El Goose and have concerns about this usage, or if there are specific terms we should be aware of,
                            please contact us through the project repository or reach out directly.
                        </p>

                        <div className="bg-[var(--bg-muted)] border border-[var(--border-subtle)] p-4">
                            <p className="font-bold mb-2 text-[var(--accent-tertiary)]">Project Information:</p>
                            <p className="text-[var(--text-secondary)] text-xs">
                                Repository: <a href="https://git.runfoo.run/runfoo/honkingversion" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">git.runfoo.run/runfoo/honkingversion</a>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
