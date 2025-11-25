'use client';

import { useState } from 'react';
import { MessageSquare, Star, FileText, ThumbsUp, User as UserIcon, Loader2 } from 'lucide-react';
import FilterTabs from './FilterTabs';

interface ActivityPerformance {
    song?: { name: string; slug?: string };
    show?: { date: string; venue: string; location?: string };
    song_name?: string;
    song_slug?: string;
    show_date?: string;
    venue?: string;
    location?: string;
}

interface ActivityShow {
    date: string;
    venue: string;
    location?: string;
}

interface Activity {
    id: number;
    user_id?: number;
    user?: {
        id: number;
        username: string;
    };
    rating?: number;
    blurb?: string;
    full_review?: string;
    created_at: string;
    performance?: ActivityPerformance;
    show?: ActivityShow;
}

interface ActivityFeedProps {
    activities: Activity[];
    title?: string;
    currentFilter?: string;
    onFilterChange?: (filter: string) => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
    loadingMore?: boolean;
    loadingInitial?: boolean;
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
    if (activity.rating !== undefined && activity.rating !== null) return 'Vote';
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

export default function ActivityFeed({
    activities,
    title = "Recent Activity",
    currentFilter,
    onFilterChange,
    onLoadMore,
    hasMore = false,
    loadingMore = false,
    loadingInitial = false
}: ActivityFeedProps) {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [internalFilter, setInternalFilter] = useState('all');

    const activeFilter = currentFilter || internalFilter;

    const handleFilterChange = (id: string) => {
        if (onFilterChange) {
            onFilterChange(id);
        } else {
            setInternalFilter(id);
        }
    };

    // Filter activities based on selected filter (only if no external handler)
    const displayActivities = onFilterChange ? activities : activities.filter(activity => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'votes') return activity.rating !== undefined && activity.rating !== null && !activity.blurb && !activity.full_review;
        if (activeFilter === 'blurbs') return Boolean(activity.blurb);
        if (activeFilter === 'reviews') return Boolean(activity.full_review);
        return true;
    });

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'votes', label: 'Votes' },
        { id: 'blurbs', label: 'Blurbs' },
        { id: 'reviews', label: 'Reviews' },
    ];

    return (
        <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-sm">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)] mb-4">
                {title}
            </h3>

            <FilterTabs
                tabs={tabs}
                activeTab={activeFilter}
                onTabChange={handleFilterChange}
            />

            <div className="space-y-3">
                {loadingInitial && (
                    <div className="flex items-center justify-center py-6 text-[var(--text-secondary)]">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Loading activity...
                    </div>
                )}

                {displayActivities.map((activity, index) => (
                    <div
                        key={activity.id}
                        className="group border border-[var(--border-subtle)] p-4 hover:border-[var(--accent-primary)]/30 hover:bg-[var(--bg-muted)]/30 transition-all duration-200 cursor-pointer"
                        onClick={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
                        style={{
                            animationDelay: `${index * 50}ms`,
                            animation: 'fadeIn 0.3s ease-out forwards',
                            opacity: 0
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] group-hover:bg-[var(--accent-primary)]/20 transition-colors rounded">
                                {getActivityIcon(activity)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--accent-primary)] text-[11px] font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wide">
                                        {getActivityType(activity)}
                                    </span>
                                    {activity.rating !== undefined && activity.rating !== null && (
                                        <span className="px-2 py-0.5 rounded-full bg-[var(--accent-secondary)]/15 text-[var(--accent-secondary)] text-[11px] font-[family-name:var(--font-ibm-plex-mono)]">
                                            {activity.rating}/10
                                        </span>
                                    )}
                                    {activity.user && (
                                        <span className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                                            <UserIcon className="w-3 h-3" />
                                            @{activity.user.username}
                                        </span>
                                    )}
                                </div>

                                {activity.performance && (
                                    <p className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--text-primary)] mb-1 truncate">
                                        {activity.performance.song?.name || activity.performance.song_name || 'Performance'}
                                    </p>
                                )}

                                {(activity.performance?.show || activity.performance?.show_date || activity.show) && (
                                    <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] uppercase tracking-wide">
                                        {activity.performance?.show?.venue || activity.performance?.venue || activity.show?.venue} • {activity.performance?.show?.date || activity.performance?.show_date || activity.show?.date}
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

                {!loadingInitial && displayActivities.length === 0 && (
                    <div className="p-12 border border-[var(--border-subtle)] border-dashed text-center">
                        <p className="text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            No {activeFilter !== 'all' ? activeFilter : 'activity'} yet.
                        </p>
                    </div>
                )}
            </div>

            {hasMore && onLoadMore && (
                <div className="mt-6 text-center">
                    <button
                        onClick={onLoadMore}
                        disabled={loadingMore}
                        className="px-6 py-2 border border-[var(--border)] text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingMore ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}

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
        </div >
    );
}
