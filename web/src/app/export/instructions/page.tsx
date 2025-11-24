'use client';

export default function InstructionsPage() {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold mb-6 text-[#f5f5f5]">
                Export Instructions
            </h1>

            <div className="space-y-6 text-[#a0a0a0]">
                <section>
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#ff6b35] mb-3">
                        What's Included in Your Export?
                    </h2>
                    <p className="mb-3">
                        Your data export is a CSV file containing the following information about your HonkingVersion account:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mb-4">
                        <li><strong>Profile Information:</strong> Your account ID, username, email, and account creation date</li>
                        <li><strong>Votes & Ratings:</strong> All performance ratings and show votes you've submitted, with scores (1-10)</li>
                        <li><strong>Attended Shows:</strong> Complete list of shows you've marked as attended, with dates</li>
                        <li><strong>Following:</strong> All users you follow on HonkingVersion</li>
                        <li><strong>Followers:</strong> All users following your account</li>
                        <li><strong>Custom Lists:</strong> Your user-created lists, including titles, descriptions, and items</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#ff6b35] mb-3">
                        How to Download
                    </h2>
                    <ol className="list-decimal list-inside space-y-2 mb-4">
                        <li>Go to <a href="/export" className="text-[#ff6b35] hover:underline">/export</a></li>
                        <li>Make sure you're signed in to your account</li>
                        <li>Click the "Download CSV" button</li>
                        <li>Your browser will automatically download a file named <code className="bg-[#1a1a1a] px-2 py-1 text-[#90ee90]">user_[ID]_data.csv</code></li>
                    </ol>
                </section>

                <section>
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#ff6b35] mb-3">
                        Understanding the CSV Format
                    </h2>
                    <p className="mb-3">
                        The CSV file uses a simple three-column format that's easy to parse:
                    </p>
                    <div className="bg-[#1a1a1a] p-4 mb-4 font-[family-name:var(--font-ibm-plex-mono)] text-sm overflow-x-auto">
                        <div>section | field | value</div>
                        <div>--------|-------|-------</div>
                        <div>profile | username | yourname</div>
                        <div>vote | show | 123:8</div>
                        <div>vote | performance | 456:9</div>
                    </div>
                    <p className="mb-3">
                        <strong>Section:</strong> The category of data (profile, vote, attended_show, etc.)
                    </p>
                    <p className="mb-3">
                        <strong>Field:</strong> The specific field within that section
                    </p>
                    <p>
                        <strong>Value:</strong> The actual data. For votes, the format is ID:RATING (e.g., "123:8" means show/performance ID 123 with a rating of 8)
                    </p>
                </section>

                <section>
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#ff6b35] mb-3">
                        Data Sections Explained
                    </h2>

                    <div className="bg-[#1a1a1a] p-4 mb-4">
                        <h3 className="font-bold text-[#f5f5f5] mb-2">Profile</h3>
                        <p>Your account metadata: ID, username, email, and creation timestamp</p>
                    </div>

                    <div className="bg-[#1a1a1a] p-4 mb-4">
                        <h3 className="font-bold text-[#f5f5f5] mb-2">Vote</h3>
                        <p>Rating entries with format "id:rating". The "target" field indicates whether it's a show vote or performance vote.</p>
                        <p className="text-sm mt-2 text-[#90ee90]">Example: vote | show | 101:8.5</p>
                    </div>

                    <div className="bg-[#1a1a1a] p-4 mb-4">
                        <h3 className="font-bold text-[#f5f5f5] mb-2">Attended Show</h3>
                        <p>Shows you've marked as attended, including the date you marked them.</p>
                        <p className="text-sm mt-2 text-[#90ee90]">Example: attended_show | show_id | 42</p>
                    </div>

                    <div className="bg-[#1a1a1a] p-4 mb-4">
                        <h3 className="font-bold text-[#f5f5f5] mb-2">Following / Followers</h3>
                        <p>Users you follow and users who follow you, listed by username.</p>
                        <p className="text-sm mt-2 text-[#90ee90]">Example: following | username | honkfan42</p>
                    </div>

                    <div className="bg-[#1a1a1a] p-4 mb-4">
                        <h3 className="font-bold text-[#f5f5f5] mb-2">List</h3>
                        <p>Your custom lists with title, description, and JSON-formatted items.</p>
                        <p className="text-sm mt-2 text-[#90ee90]">Example: list | title | My Favorite Red Rocks Shows</p>
                    </div>
                </section>

                <section>
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#ff6b35] mb-3">
                        Common Uses
                    </h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Backup:</strong> Keep a local copy of your voting history</li>
                        <li><strong>Analysis:</strong> Import into Excel or Python to analyze your listening patterns</li>
                        <li><strong>Portability:</strong> Transfer your data if you switch platforms</li>
                        <li><strong>Record-keeping:</strong> Maintain a permanent record of your shows attended</li>
                        <li><strong>Data rights:</strong> Exercise your right to access your personal data</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#ff6b35] mb-3">
                        Privacy & Security
                    </h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Your export is generated on-demand when you click the button</li>
                        <li>It only includes data from your own account</li>
                        <li>The file downloads directly to your computer</li>
                        <li>We never store or log your exported data</li>
                        <li>Treat your CSV like you'd treat any file with personal information</li>
                    </ul>
                </section>

                <section>
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#ff6b35] mb-3">
                        Need Help?
                    </h2>
                    <p>
                        Check out the <a href="/export/glossary" className="text-[#ff6b35] hover:underline">Glossary</a> for detailed definitions of each field and section type.
                    </p>
                </section>
            </div>
        </div>
    );
}
