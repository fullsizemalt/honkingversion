import PageHeader from '@/components/PageHeader';

/**
 * Standard Page Template for HonkingVersion
 * 
 * Use this template when creating new pages to ensure consistency.
 * 
 * Key components:
 * 1. PageHeader - Shows title, description, and auth CTAs
 * 2. Main content area - Your page-specific content
 * 
 * Props for PageHeader:
 * - title: Page title (e.g., "Shows", "Songs")
 * - description: Brief description in uppercase mono font
 * - loggedInMessage: Optional message shown to logged-in users
 */

export default function TemplatePage() {
    return (
        <>
            <PageHeader
                title="PAGE TITLE"
                description="Brief description of this page's purpose"
                loggedInMessage="Optional message for logged-in users."
            />

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Your page content goes here */}
                <p className="text-[var(--text-secondary)]">
                    Page content...
                </p>
            </div>
        </>
    );
}
