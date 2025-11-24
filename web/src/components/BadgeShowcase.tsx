'use client';

import { Trophy, Award, Star, Zap } from 'lucide-react';

interface Badge {
    id: number;
    badge_name: string;
    badge_description?: string;
    badge_icon: string;
    unlock_criteria?: string;
    earned_at: string;
}

interface BadgeShowcaseProps {
    badges: Badge[];
    username: string;
}

const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
};

export default function BadgeShowcase({ badges, username }: BadgeShowcaseProps) {
    const displayBadges = badges.slice(0, 6);
    const hasMore = badges.length > 6;

    return (
        <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">
                    Badges
                </h3>
                {hasMore && (
                    <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
                        +{badges.length - 6} more
                    </span>
                )}
            </div>

            {badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                    {displayBadges.map((badge, index) => (
                        <div
                            key={badge.id}
                            className="group relative p-4 border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/30 bg-[var(--bg-muted)]/30 hover:bg-[var(--bg-muted)]/60 transition-all duration-200 cursor-pointer"
                            style={{
                                animationDelay: `${index * 75}ms`,
                                animation: 'popIn 0.4s ease-out forwards',
                                opacity: 0
                            }}
                        >
                            {/* Badge Icon */}
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                                {badge.badge_icon}
                            </div>

                            {/* Badge Name */}
                            <h4 className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold text-[var(--text-primary)] mb-1 line-clamp-1">
                                {badge.badge_name}
                            </h4>

                            {/* Earned Date */}
                            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
                                {getRelativeTime(badge.earned_at)}
                            </p>

                            {/* Tooltip on Hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-3 shadow-lg min-w-[200px]">
                                    <p className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold text-[var(--text-primary)] mb-1">
                                        {badge.badge_name}
                                    </p>
                                    {badge.badge_description && (
                                        <p className="text-xs text-[var(--text-secondary)] mb-2">
                                            {badge.badge_description}
                                        </p>
                                    )}
                                    {badge.unlock_criteria && (
                                        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">
                                            {badge.unlock_criteria}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 border border-[var(--border-subtle)] border-dashed text-center">
                    <Trophy className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
                    <p className="text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                        No badges earned yet.
                    </p>
                </div>
            )}

            <style jsx>{`
                @keyframes popIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
