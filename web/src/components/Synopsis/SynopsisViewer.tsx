'use client';

import { Edit, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SynopsisViewerProps {
    content: string;
    lastUpdatedBy?: {
        username: string;
    };
    lastUpdatedAt?: string;
    onEdit: () => void;
    canEdit: boolean;
}

const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays < 1) return 'Today';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

export default function SynopsisViewer({
    content,
    lastUpdatedBy,
    lastUpdatedAt,
    onEdit,
    canEdit
}: SynopsisViewerProps) {
    if (!content) {
        return (
            <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-8 text-center">
                <p className="text-[var(--text-secondary)] mb-4 font-[family-name:var(--font-space-grotesk)]">
                    No community synopsis yet.
                </p>
                {canEdit && (
                    <button
                        onClick={onEdit}
                        className="px-4 py-2 bg-[var(--accent-primary)] text-white font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider hover:bg-[var(--accent-primary)]/90 transition-colors"
                    >
                        Write the First Synopsis
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                    <Clock className="w-3 h-3" />
                    <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider">
                        Last edited {lastUpdatedAt ? getRelativeTime(lastUpdatedAt) : ''}
                        {lastUpdatedBy ? ` by ${lastUpdatedBy.username}` : ''}
                    </span>
                </div>

                {canEdit && (
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--accent-primary)]/80 transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider"
                    >
                        <Edit className="w-3 h-3" />
                        Edit
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none prose-sm prose-p:text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-a:text-[var(--accent-primary)]">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    );
}
