'use client';

import { useEffect, useState } from 'react';
import { getApiEndpoint } from '@/lib/api';
import TagBadge from './TagBadge';
import { Tag } from '@/types/tag';

interface Props {
    type: 'show' | 'performance';
    id: number;
}

export default function ItemTags({ type, id }: Props) {
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        const fetchTags = async () => {
            const res = await fetch(getApiEndpoint(`/tags/${type}/${id}`), { cache: 'no-store' });
            if (res.ok) {
                setTags(await res.json());
            }
        };
        fetchTags();
    }, [type, id]);

    if (!tags.length) return null;

    return (
        <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
            ))}
        </div>
    );
}
