'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';
import TagBadge from './TagBadge';
import { Tag } from '@/types/tag';

interface Props {
    type: 'show' | 'performance' | 'song';
    id: number;
}

export default function ItemTags({ type, id }: Props) {
    const { data: session } = useSession();
    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        const fetchTags = async () => {
            const headers: HeadersInit = {};
            if (session?.user?.accessToken) {
                headers['Authorization'] = `Bearer ${session.user.accessToken}`;
            }
            const res = await fetch(getApiEndpoint(`/tags/${type}/${id}`), { cache: 'no-store', headers });
            if (res.ok) {
                setTags(await res.json());
            }
        };
        fetchTags();
    }, [type, id, session?.user?.accessToken]);

    if (!tags.length) return null;

    return (
        <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
            ))}
        </div>
    );
}
