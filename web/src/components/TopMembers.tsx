"use client";

import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';

interface TopMember {
    id: number;
    username: string;
    vote_count: number;
}

export default function TopMembers() {
    const [members, setMembers] = useState<TopMember[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchMembers = async () => {
            try {
                const res = await fetch(getApiEndpoint('/home/top-members?limit=5'), {
                    signal: controller.signal,
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch top members');
                }
                const data = await res.json();
                setMembers(data);
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Error fetching top members', err);
                }
            }
        };

        fetchMembers();
        return () => controller.abort();
    }, []);

    return (
        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border)]">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
                <Trophy className="w-4 h-4 text-[var(--accent-primary)]" />
                Top Members
            </h3>
            <div className="space-y-3">
                {members.map((member, index) => (
                    <div key={member.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold w-5 h-5 flex items-center justify-center rounded-full ${index < 3 ? 'bg-[var(--accent-primary)] text-[var(--text-inverse)]' : 'bg-[var(--bg-muted)] text-[var(--text-secondary)]'}`}>
                                {index + 1}
                            </span>
                            <span className="font-medium text-sm text-[var(--text-primary)]">{member.username}</span>
                        </div>
                        <span className="text-xs font-mono text-[var(--text-tertiary)]">{member.vote_count} votes</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
