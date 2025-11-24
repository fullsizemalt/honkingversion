'use client';

import Link from 'next/link';
import { List, Lock, Users } from 'lucide-react';

interface UserList {
    id: number;
    title: string;
    description?: string;
    items: string;
    list_type: string;
    is_public: boolean;
    created_at: string;
}

interface ListsSectionProps {
    lists: UserList[];
    username: string;
}

export default function ListsSection({ lists, username }: ListsSectionProps) {
    const getItemCount = (items: string) => {
        try {
            return JSON.parse(items).length;
        } catch {
            return 0;
        }
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffDays < 1) return 'Today';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">
                    Lists
                </h3>
                <Link
                    href={`/u/${username}/lists`}
                    className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors"
                >
                    View All →
                </Link>
            </div>

            <div className="space-y-3">
                {lists.slice(0, 5).map((list, index) => (
                    <Link
                        key={list.id}
                        href={`/lists/${list.id}`}
                        className="group block border border-[var(--border-subtle)] p-4 hover:border-[var(--accent-primary)]/30 hover:bg-[var(--bg-muted)]/30 transition-all duration-200"
                        style={{
                            animationDelay: `${index * 50}ms`,
                            animation: 'slideIn 0.3s ease-out forwards',
                            opacity: 0
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[var(--accent-tertiary)]/10 text-[var(--accent-tertiary)] group-hover:bg-[var(--accent-tertiary)]/20 transition-colors">
                                <List className="w-4 h-4" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                                        {list.title}
                                    </h4>
                                    {!list.is_public && (
                                        <Lock className="w-3 h-3 text-[var(--text-tertiary)] flex-shrink-0" />
                                    )}
                                </div>

                                {list.description && (
                                    <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-1">
                                        {list.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wide">
                                    <span>{getItemCount(list.items)} items</span>
                                    <span>•</span>
                                    <span>{list.is_public ? 'Public' : 'Private'}</span>
                                    <span>•</span>
                                    <span>{getRelativeTime(list.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {lists.length === 0 && (
                    <div className="p-12 border border-[var(--border-subtle)] border-dashed text-center">
                        <Users className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
                        <p className="text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            No lists created yet.
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}
