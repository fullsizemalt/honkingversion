'use client';

interface StatsCardProps {
    stats: {
        shows_attended: number;
        total_votes: number;
        lists_created: number;
        followers: number;
        following: number;
    };
}

export default function StatsCard({ stats }: StatsCardProps) {
    const statItems = [
        { label: 'Shows Attended', value: stats.shows_attended, color: 'var(--accent-primary)' },
        { label: 'Total Votes', value: stats.total_votes, color: 'var(--accent-secondary)' },
        { label: 'Lists Created', value: stats.lists_created, color: 'var(--accent-tertiary)' },
        { label: 'Followers', value: stats.followers, color: 'var(--text-primary)' },
        { label: 'Following', value: stats.following, color: 'var(--text-primary)' },
    ];

    return (
        <div className="border border-[var(--border)] bg-[var(--bg-secondary)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)] mb-6">
                Stats
            </h3>

            <div className="space-y-4">
                {statItems.map((item, index) => (
                    <div
                        key={item.label}
                        className="group transition-all duration-200 hover:translate-x-1"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors duration-200">
                                {item.label}
                            </span>
                            <span
                                className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold transition-all duration-200"
                                style={{ color: item.color }}
                            >
                                {item.value.toLocaleString()}
                            </span>
                        </div>
                        <div className="mt-2 h-1 bg-[var(--bg-muted)] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500 ease-out"
                                style={{
                                    width: `${Math.min((item.value / Math.max(...statItems.map(s => s.value))) * 100, 100)}%`,
                                    backgroundColor: item.color,
                                    opacity: 0.6
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
