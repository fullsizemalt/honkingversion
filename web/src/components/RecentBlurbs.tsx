"use client";

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

interface RecentBlurb {
    id: number;
    user_id: number;
    username: string;
    blurb: string;
    rating: number;
    created_at: string;
    song_name: string;
    show_date: string;
}

export default function RecentBlurbs() {
    const [blurbs, setBlurbs] = useState<RecentBlurb[]>([]);

    useEffect(() => {
        fetch('http://localhost:8000/home/recent-blurbs?limit=5')
            .then(res => res.json())
            .then(data => setBlurbs(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border)]">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold mb-4 flex items-center gap-2 text-[var(--text-primary)]">
                <Star className="w-4 h-4 text-[var(--accent-primary)]" />
                Recent Blurbs
            </h3>
            <div className="space-y-4">
                {blurbs.map(blurb => (
                    <div key={blurb.id} className="border-b border-[var(--border-subtle)] last:border-0 pb-4 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm text-[var(--text-primary)]">{blurb.username}</span>
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-[var(--accent-primary)] text-[var(--accent-primary)]" />
                                <span className="text-xs font-bold text-[var(--text-primary)]">{blurb.rating}</span>
                            </div>
                        </div>
                        <p className="text-sm italic text-[var(--text-secondary)] mb-2">"{blurb.blurb}"</p>
                        <div className="text-xs text-[var(--text-tertiary)]">
                            on <span className="text-[var(--accent-primary)]">{blurb.song_name}</span> • {blurb.show_date}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
