import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Attribution',
    description: 'Credits and compliance information for the El Goose API',
};

export default function Attribution() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] p-8">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold mb-4">
                Attribution
            </h1>
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-base mb-2">
                This site uses data provided by the <a href="https://elgoose.net" target="_blank" rel="noopener noreferrer" className="text-[#ff6b35] underline">El Goose API</a>.
            </p>
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-base">
                All song, show, and performance information is sourced from El Goose. We thank the El Goose team for making this data publicly available.
            </p>
        </div>
    );
}
