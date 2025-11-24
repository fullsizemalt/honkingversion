import PageHeader from '@/components/PageHeader';

export default function PerformancesPage() {
    return (
        <>
            <PageHeader
                title="Top Performances"
                description="Browse the highest-rated live performances"
                loggedInMessage="Rate and review your favorite performances below."
            />
            <div className="max-w-7xl mx-auto px-4 py-12">
                <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)]">
                    Coming soon...
                </p>
            </div>
        </>
    )
}
