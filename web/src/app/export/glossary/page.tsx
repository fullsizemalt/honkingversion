'use client';

export default function GlossaryPage() {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold mb-6 text-[#f5f5f5]">
                Export Data Glossary
            </h1>

            <p className="text-[#a0a0a0] mb-8">
                Reference guide for all fields and sections in your HonkingVersion data export CSV file.
            </p>

            <div className="space-y-6">
                {/* PROFILE SECTION */}
                <section className="border-l-4 border-[#ff6b35] pl-4">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#ff6b35] mb-4">
                        🔤 PROFILE
                    </h2>
                    <p className="text-[#a0a0a0] mb-4">
                        Your account information and basic metadata.
                    </p>

                    <div className="space-y-3">
                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">id</div>
                            <p className="text-[#a0a0a0] text-sm">Your unique HonkingVersion user ID number (integer)</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">username</div>
                            <p className="text-[#a0a0a0] text-sm">Your account username (string, unique)</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">email</div>
                            <p className="text-[#a0a0a0] text-sm">Your registered email address (string, unique)</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">created_at</div>
                            <p className="text-[#a0a0a0] text-sm">Account creation date/time in ISO 8601 format (e.g., 2024-03-15T10:30:00)</p>
                        </div>
                    </div>
                </section>

                {/* VOTE SECTION */}
                <section className="border-l-4 border-[#ff6b35] pl-4">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#ff6b35] mb-4">
                        ⭐ VOTE
                    </h2>
                    <p className="text-[#a0a0a0] mb-4">
                        Your ratings and votes on shows and individual performances.
                    </p>

                    <div className="space-y-3">
                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">section = "vote"</div>
                            <p className="text-[#a0a0a0] text-sm">Indicates this is a vote entry</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">field = "show" or "performance"</div>
                            <p className="text-[#a0a0a0] text-sm">
                                Type of item being voted on:
                                <br />
                                • "show" = entire show (setlist)
                                <br />
                                • "performance" = individual song performance
                            </p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">value = "id:rating"</div>
                            <p className="text-[#a0a0a0] text-sm">
                                Format: [ID]:[RATING]
                                <br />
                                • ID: The show or performance ID number
                                <br />
                                • RATING: Your rating (1-10 scale)
                                <br />
                                <span className="text-[#90ee90]">Example: 12345:8.5</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* ATTENDED SHOW SECTION */}
                <section className="border-l-4 border-[#ff6b35] pl-4">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#ff6b35] mb-4">
                        🎫 ATTENDED_SHOW
                    </h2>
                    <p className="text-[#a0a0a0] mb-4">
                        Shows you've marked as attended in person.
                    </p>

                    <div className="space-y-3">
                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">section = "attended_show"</div>
                            <p className="text-[#a0a0a0] text-sm">Indicates this is an attendance record</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">field = "show_id" or "attended_at"</div>
                            <p className="text-[#a0a0a0] text-sm">
                                • "show_id" = the ID of the show
                                <br />
                                • "attended_at" = when you marked it attended
                            </p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">value</div>
                            <p className="text-[#a0a0a0] text-sm">
                                For show_id: the show ID number
                                <br />
                                For attended_at: timestamp in ISO 8601 format
                            </p>
                        </div>
                    </div>
                </section>

                {/* FOLLOWING SECTION */}
                <section className="border-l-4 border-[#ff6b35] pl-4">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#ff6b35] mb-4">
                        👥 FOLLOWING
                    </h2>
                    <p className="text-[#a0a0a0] mb-4">
                        Users you are following on HonkingVersion.
                    </p>

                    <div className="space-y-3">
                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">section = "following"</div>
                            <p className="text-[#a0a0a0] text-sm">Indicates this is a "following" entry</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">field = "username"</div>
                            <p className="text-[#a0a0a0] text-sm">The username of the user you follow</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">value</div>
                            <p className="text-[#a0a0a0] text-sm">The username (string)</p>
                        </div>
                    </div>
                </section>

                {/* FOLLOWER SECTION */}
                <section className="border-l-4 border-[#ff6b35] pl-4">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#ff6b35] mb-4">
                        👤 FOLLOWER
                    </h2>
                    <p className="text-[#a0a0a0] mb-4">
                        Users who are following you on HonkingVersion.
                    </p>

                    <div className="space-y-3">
                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">section = "follower"</div>
                            <p className="text-[#a0a0a0] text-sm">Indicates this is a "follower" entry</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">field = "username"</div>
                            <p className="text-[#a0a0a0] text-sm">The username of the user following you</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">value</div>
                            <p className="text-[#a0a0a0] text-sm">The username (string)</p>
                        </div>
                    </div>
                </section>

                {/* LIST SECTION */}
                <section className="border-l-4 border-[#ff6b35] pl-4">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#ff6b35] mb-4">
                        📋 LIST
                    </h2>
                    <p className="text-[#a0a0a0] mb-4">
                        Your custom user-created lists of shows and performances.
                    </p>

                    <div className="space-y-3">
                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">section = "list"</div>
                            <p className="text-[#a0a0a0] text-sm">Indicates this is a list entry</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">field = "title", "description", or "items"</div>
                            <p className="text-[#a0a0a0] text-sm">
                                • "title" = the name of your list
                                <br />
                                • "description" = optional description you wrote
                                <br />
                                • "items" = the shows/performances in the list (JSON format)
                            </p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">value</div>
                            <p className="text-[#a0a0a0] text-sm">
                                For title/description: text string
                                <br />
                                For items: JSON array (e.g., [123, 456, 789])
                            </p>
                        </div>
                    </div>
                </section>

                {/* DATA TYPES */}
                <section className="border-l-4 border-[#90ee90] pl-4">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#90ee90] mb-4">
                        📊 Data Types Reference
                    </h2>

                    <div className="space-y-3">
                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">Integer</div>
                            <p className="text-[#a0a0a0] text-sm">Whole numbers (e.g., 42, 12345, 1)</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">String</div>
                            <p className="text-[#a0a0a0] text-sm">Text (e.g., "honkfan42", "My Favorite Shows")</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">Rating (1-10)</div>
                            <p className="text-[#a0a0a0] text-sm">Decimal numbers from 1.0 to 10.0 (e.g., 8.5)</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">ISO 8601 Timestamp</div>
                            <p className="text-[#a0a0a0] text-sm">Date and time in standard format: YYYY-MM-DDTHH:MM:SS</p>
                        </div>

                        <div className="bg-[#1a1a1a] p-3 rounded">
                            <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[#90ee90] font-bold">JSON Array</div>
                            <p className="text-[#a0a0a0] text-sm">List of items in brackets: [1, 2, 3] or ["item1", "item2"]</p>
                        </div>
                    </div>
                </section>

                {/* RATING SCALE */}
                <section className="border-l-4 border-[#90ee90] pl-4">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#90ee90] mb-4">
                        🎯 Rating Scale
                    </h2>
                    <div className="bg-[#1a1a1a] p-4 rounded space-y-2">
                        <div className="flex justify-between"><span>10</span><span>Perfect / Must Listen</span></div>
                        <div className="flex justify-between"><span>9</span><span>Excellent / Top Tier</span></div>
                        <div className="flex justify-between"><span>8</span><span>Very Good / Highly Recommended</span></div>
                        <div className="flex justify-between"><span>7</span><span>Good / Worth Your Time</span></div>
                        <div className="flex justify-between"><span>6</span><span>Above Average / Solid</span></div>
                        <div className="flex justify-between"><span>5</span><span>Average / Decent</span></div>
                        <div className="flex justify-between"><span>4</span><span>Below Average</span></div>
                        <div className="flex justify-between"><span>3</span><span>Poor</span></div>
                        <div className="flex justify-between"><span>2</span><span>Very Poor</span></div>
                        <div className="flex justify-between"><span>1</span><span>Terrible / Skip It</span></div>
                    </div>
                </section>

                {/* TIPS */}
                <section className="border-l-4 border-[#90ee90] pl-4">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#90ee90] mb-4">
                        💡 Tips
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-[#a0a0a0]">
                        <li>Open your CSV in Excel, Google Sheets, or any spreadsheet app for easy viewing</li>
                        <li>Use the "filter" feature in your spreadsheet to find specific sections</li>
                        <li>Copy the ratings column to analyze your voting patterns</li>
                        <li>Import into Python/R for advanced data analysis</li>
                        <li>Each row is independent — the three-column format makes it easy to process</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
