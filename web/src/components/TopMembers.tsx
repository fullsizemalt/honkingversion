"use client";

import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface TopMember {
    id: number;
    username: string;
    vote_count: number;
}

export default function TopMembers() {
    const [members, setMembers] = useState<TopMember[]>([]);

    useEffect(() => {
        fetch('http://localhost:8000/home/top-members?limit=5')
            .then(res => res.json())
            .then(data => setMembers(data))
            .catch(err => console.error(err));
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
