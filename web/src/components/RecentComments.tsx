"use client";

import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';

interface RecentComment {
    id: number;
    user_id: number;
    username: string;
    body: string;
    created_at: string;
    song_name: string;
    show_date: string;
}

export default function RecentComments() {
    const [comments, setComments] = useState<RecentComment[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchComments = async () => {
            try {
                const res = await fetch(getApiEndpoint('/home/recent-comments?limit=5'), {
                    signal: controller.signal,
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch recent comments');
                }
                const data = await res.json();
                setComments(data);
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Error fetching recent comments', err);
                }
            }
        };

        fetchComments();
        return () => controller.abort();
    }, []);

    return (
        <div className="bg-[var(--bg-secondary)] p-6 border border-[var(--border)]">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
                <MessageSquare className="w-4 h-4 text-[var(--accent-primary)]" />
                Recent Comments
            </h3>
            <div className="space-y-4">
                {comments.map(comment => (
                    <div key={comment.id} className="border-b border-[var(--border-subtle)] last:border-0 pb-4 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm text-[var(--text-primary)]">{comment.username}</span>
                            <span className="text-xs text-[var(--text-tertiary)]">
                                {new Date(comment.created_at).toISOString().split('T')[0]}
                            </span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2">"{comment.body}"</p>
                        <div className="text-xs text-[var(--text-tertiary)]">
                            on <span className="text-[var(--accent-primary)]">{comment.song_name}</span> • {comment.show_date}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
