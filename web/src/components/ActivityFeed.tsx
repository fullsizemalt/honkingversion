'use client';

import { useState } from 'react';
import { MessageSquare, Star, FileText, ThumbsUp } from 'lucide-react';

interface Activity {
    id: number;
    user_id: number;
    rating?: number;
    blurb?: string;
    full_review?: string;
    created_at: string;
    performance?: {
        song: { name: string };
        show: { date: string; venue: string };
    };
}

interface ActivityFeedProps {
    activities: Activity[];
    title?: string;
}

const getActivityIcon = (activity: Activity) => {
    if (activity.full_review) return <FileText className="w-4 h-4" />;
    if (activity.blurb) return <MessageSquare className="w-4 h-4" />;
    if (activity.rating) return <Star className="w-4 h-4" />;
    return <ThumbsUp className="w-4 h-4" />;
};

const getActivityType = (activity: Activity) => {
    if (activity.full_review) return 'Review';
    if (activity.blurb) return 'Blurb';
    if (activity.rating) return 'Vote';
    return 'Activity';
};

const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

export default function ActivityFeed({ activities, title = "Recent Activity" }: ActivityFeedProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    return (
        <div className="border border-[var(--border)] bg-[var(--bg-secondary)] rounded-2xl p-6 shadow-sm">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)] mb-6">
                {title}
            </h3>

            <div className="space-y-3">
                {activities.map((activity, index) => (
                    <div
                        key={activity.id}
                        className="group border border-[var(--border-subtle)] rounded-xl p-4 hover:border-[var(--accent-primary)]/30 hover:bg-[var(--bg-muted)]/30 transition-all duration-200 cursor-pointer"
                        onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                        style={{
                            animationDelay: `${index * 50}ms`,
                            animation: 'fadeIn 0.3s ease-out forwards',
                            opacity: 0
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] group-hover:bg-[var(--accent-primary)]/20 transition-colors">
                                {getActivityIcon(activity)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--accent-primary)]">
                                        {getActivityType(activity)}
                                    </span>
                                    {activity.rating && (
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-[var(--accent-secondary)] text-[var(--accent-secondary)]" />
                                            <span className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--accent-secondary)]">
                                                {activity.rating}/10
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {activity.performance && (
                                    <p className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--text-primary)] mb-1 truncate">
                                        {activity.performance.song.name}
                                    </p>
                                )}

                                {activity.performance && (
                                    <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] uppercase tracking-wide">
                                        {activity.performance.show.venue} • {activity.performance.show.date}
                                    </p>
                                )}

                                {/* Content Preview */}
                                {(activity.blurb || activity.full_review) && (
                                    <p className={`mt-2 text-sm text-[var(--text-secondary)] ${expandedId === activity.id ? '' : 'line-clamp-2'}`}>
                                        {activity.full_review || activity.blurb}
                                    </p>
                                )}
                            </div>

                            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] whitespace-nowrap">
                                {getRelativeTime(activity.created_at)}
                            </span>
                        </div>
                    </div>
                ))}

                {activities.length === 0 && (
                    <div className="p-12 border border-[var(--border-subtle)] border-dashed rounded-xl text-center">
                        <p className="text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            No activity yet.
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
