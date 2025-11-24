import PageHeader from '@/components/PageHeader';

export default function ReviewsPage() {
    return (
        <>
            <PageHeader
                title="Reviews"
                description="Read and share detailed performance reviews"
                loggedInMessage="Share your thoughts on your favorite performances."
            />
            <div className="max-w-7xl mx-auto px-4 py-12">
                <p className="text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)]">
                    Coming soon...
                </p>
            </div>
        </>
    )
}
