'use client';

import { useState, useEffect } from 'react';
import { Trophy, Award, Star, Zap, Lock } from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';

interface Badge {
    id: number;
    badge_name: string;
    badge_description?: string;
    badge_icon: string;
    unlock_criteria?: string;
    earned_at: string;
}

interface SystemBadge {
    id: string;
    name: string;
    description: string;
    icon: string;
    criteria: string;
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

export default function BadgeShowcase({ badges: userBadges, username }: BadgeShowcaseProps) {
    const [systemBadges, setSystemBadges] = useState<SystemBadge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSystemBadges = async () => {
            try {
                const res = await fetch(getApiEndpoint('/profile/badges/system'));
                if (res.ok) {
                    const data = await res.json();
                    setSystemBadges(data);
                }
            } catch (error) {
                console.error('Failed to fetch system badges:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSystemBadges();
    }, []);

    // Merge user badges with system badges to determine status
    const allBadges = systemBadges.map(sysBadge => {
        const earned = userBadges.find(ub => ub.badge_name === sysBadge.name);
        return {
            ...sysBadge,
            earned: !!earned,
            earnedAt: earned?.earned_at,
            userBadgeId: earned?.id
        };
    });

    // Sort: Earned first, then by ID
    const sortedBadges = [...allBadges].sort((a, b) => {
        if (a.earned && !b.earned) return -1;
        if (!a.earned && b.earned) return 1;
        return 0;
    });

    const displayBadges = sortedBadges.slice(0, 8); // Show 8 badges
    const hasMore = sortedBadges.length > 8;

    if (loading) return null;

    return (
        <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">
                    Badges
                </h3>
                {hasMore && (
                    <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
                        +{sortedBadges.length - 8} more
                    </span>
                )}
            </div>

            <div className="grid grid-cols-4 gap-2">
                {displayBadges.map((badge, index) => (
                    <div
                        key={badge.id}
                        className={`group relative aspect-square flex flex-col items-center justify-center p-2 border transition-all duration-200 cursor-default
                            ${badge.earned
                                ? 'border-[var(--border-subtle)] bg-[var(--bg-muted)]/30 hover:border-[var(--accent-primary)]/30 hover:bg-[var(--bg-muted)]/60'
                                : 'border-transparent bg-[var(--bg-primary)] opacity-50 grayscale hover:opacity-70'
                            }`}
                    >
                        {/* Badge Icon */}
                        <div className={`text-2xl mb-1 transition-transform duration-200 ${badge.earned ? 'group-hover:scale-110' : ''}`}>
                            {badge.icon}
                        </div>

                        {/* Locked Icon Overlay */}
                        {!badge.earned && (
                            <div className="absolute top-1 right-1 text-[var(--text-tertiary)] opacity-50">
                                <Lock className="w-3 h-3" />
                            </div>
                        )}

                        {/* Tooltip on Hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-48">
                            <div className="bg-[var(--bg-primary)] border border-[var(--border)] p-3 shadow-lg text-center">
                                <p className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold text-[var(--text-primary)] mb-1">
                                    {badge.name}
                                </p>
                                <p className="text-[10px] text-[var(--text-secondary)] mb-2 leading-tight">
                                    {badge.description}
                                </p>
                                {badge.earned ? (
                                    <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--accent-primary)] uppercase tracking-wide">
                                        Earned {getRelativeTime(badge.earnedAt!)}
                                    </p>
                                ) : (
                                    <div className="border-t border-[var(--border)] pt-2 mt-2">
                                        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-tertiary)] uppercase tracking-wide">
                                            Unlock: {badge.criteria}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
