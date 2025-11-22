import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Attribution',
    description: 'Credits and compliance information for the El Goose API',
};

export default function Attribution() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
            {/* Header */}
            <div className="border-b-2 border-[#333] bg-[#0a0a0a] py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#b565d8]" />
                        <h1 className="font-[family-name:var(--font-space-grotesk)] text-5xl font-bold text-[#f5f5f5] mb-2 uppercase tracking-tighter">
                            Attribution & Policy
                        </h1>
                        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0] uppercase tracking-wider">
                            Data sources and usage compliance
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* El Goose Attribution */}
                <section className="mb-12 border border-[#333] p-6 bg-[#1a1a1a]">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f5f5f5] mb-4 uppercase tracking-tight">
                        El Goose Data Attribution
                    </h2>

                    <div className="space-y-4 font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#d0d0d0]">
                        <p>
                            <strong>Honkingversion.net</strong> uses data provided by the{' '}
                            <a href="https://elgoose.net" target="_blank" rel="noopener noreferrer" className="text-[#ff6b35] hover:underline">
                                El Goose API
                            </a>
                            , a comprehensive database of Goose setlists, performances, and related information.
                        </p>

                        <div className="bg-[#0a0a0a] border border-[#333] p-4 rounded">
                            <p className="font-bold mb-2">El Goose API Details:</p>
                            <ul className="list-disc list-inside space-y-1 text-[#a0a0a0]">
                                <li>Base URL: <code className="text-[#00d9ff]">https://elgoose.net/api/v2</code></li>
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
                <section className="mb-12 border border-[#333] p-6 bg-[#1a1a1a]">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f5f5f5] mb-4 uppercase tracking-tight">
                        API Usage Policy
                    </h2>

                    <div className="space-y-4 font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#d0d0d0]">
                        <div>
                            <p className="font-bold mb-2 text-[#ff6b35]">Access & Authentication:</p>
                            <p className="text-[#a0a0a0]">
                                The El Goose API is publicly accessible and requires no authentication. No API key, token, or registration is necessary.
                            </p>
                        </div>

                        <div>
                            <p className="font-bold mb-2 text-[#ff6b35]">Usage Approach:</p>
                            <ul className="list-disc list-inside space-y-1 text-[#a0a0a0]">
                                <li>Honkingversion.net uses El Goose as a data source, not a service</li>
                                <li>Data is fetched server-side and displayed with proper attribution</li>
                                <li>All external links point back to El Goose for original source verification</li>
                                <li>No data modification or republishing without attribution</li>
                            </ul>
                        </div>

                        <div>
                            <p className="font-bold mb-2 text-[#ff6b35]">Responsible Use:</p>
                            <ul className="list-disc list-inside space-y-1 text-[#a0a0a0]">
                                <li>Queries are made with reasonable frequency and caching where possible</li>
                                <li>User-Agent headers identify requests as coming from Honkingversion</li>
                                <li>No automated mass scraping or harvesting of data</li>
                                <li>All usage is attributed back to El Goose</li>
                            </ul>
                        </div>

                        <div className="bg-[#0a0a0a] border border-[#333] p-4 rounded">
                            <p className="font-bold mb-2 text-[#00d9ff]">Policy Document:</p>
                            <p className="text-[#a0a0a0] text-xs">
                                For complete technical and legal details, see the{' '}
                                <code className="text-[#ff6b35]">API_USAGE_POLICY.md</code>
                                {' '}file in the project repository.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Compliance */}
                <section className="mb-12 border border-[#333] p-6 bg-[#1a1a1a]">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f5f5f5] mb-4 uppercase tracking-tight">
                        Compliance & Contact
                    </h2>

                    <div className="space-y-4 font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#d0d0d0]">
                        <p>
                            Honkingversion.net operates under the assumption that the publicly available El Goose API is intended for third-party usage
                            based on its public accessibility and lack of authentication requirements.
                        </p>

                        <p>
                            If you are affiliated with El Goose and have concerns about this usage, or if there are specific terms we should be aware of,
                            please contact us through the project repository or reach out directly.
                        </p>

                        <div className="bg-[#0a0a0a] border border-[#333] p-4 rounded">
                            <p className="font-bold mb-2 text-[#00d9ff]">Project Information:</p>
                            <p className="text-[#a0a0a0] text-xs">
                                Repository: <a href="https://git.runfoo.run/runfoo/honkingversion" target="_blank" rel="noopener noreferrer" className="text-[#ff6b35] hover:underline">git.runfoo.run/runfoo/honkingversion</a>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
