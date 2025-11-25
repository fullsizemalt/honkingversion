'use client';

import { useState, useEffect } from 'react';

interface Title {
    id: number;
    title_name: string;
    color: string;
    icon?: string;
}

interface TitleSelectorProps {
    username: string;
    currentTitleId?: number;
    onTitleChange?: () => void;
}

export default function TitleSelector({ username, currentTitleId, onTitleChange }: TitleSelectorProps) {
    const [titles, setTitles] = useState<Title[]>([]);
    const [selected, setSelected] = useState<number | undefined>(currentTitleId);

    useEffect(() => {
        async function fetchTitles() {
            const res = await fetch(`/api/profile/${username}/titles`);
            if (res.ok) {
                const data = await res.json();
                setTitles(data);
            }
        }
        fetchTitles();
    }, [username]);

    const handleChange = async (titleId: number | null) => {
        const id = titleId ?? null;
        await fetch(`/api/profile/${username}/title`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title_id: id })
        });
        setSelected(id ?? undefined);
        onTitleChange && onTitleChange();
    };

    return (
        <div className="inline-block ml-4">
            <select
                value={selected ?? ''}
                onChange={e => handleChange(e.target.value ? Number(e.target.value) : null)}
                className="border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded px-2 py-1"
            >
                <option value="">No Title</option>
                {titles.map(t => (
                    <option key={t.id} value={t.id}>
                        {t.title_name}
                    </option>
                ))}
            </select>
        </div>
    );
}
