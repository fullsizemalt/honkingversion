'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getApiEndpoint } from '@/lib/api';
import TagSelector from './TagSelector';
import TagBadge from './TagBadge';
import { Tag } from '@/types/tag';

interface Props {
    performanceId: number;
}

export default function PerformanceTags({ performanceId }: Props) {
    const { data: session } = useSession();
    const router = useRouter();
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const accessToken = session?.user?.accessToken;

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch(getApiEndpoint(`/tags/performance/${performanceId}`), { cache: 'no-store' });
                if (res.ok) {
                    setTags(await res.json());
                }
            } finally {
                setLoading(false);
            }
        };
        fetchTags();
    }, [performanceId]);

    const ensureAuth = () => {
        if (!accessToken) {
            router.push('/auth/signin');
            return false;
        }
        return true;
    };

    const handleAddTag = async (tag: Tag) => {
        if (!ensureAuth()) return;
        const res = await fetch(getApiEndpoint(`/tags/performance/${performanceId}?tag_id=${tag.id}`), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (res.ok) {
            setTags((prev) => [...prev, tag]);
        }
    };

    const handleRemoveTag = async (tagId: number) => {
        if (!ensureAuth()) return;
        const res = await fetch(getApiEndpoint(`/tags/performance/${performanceId}/${tagId}`), {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (res.ok) {
            setTags((prev) => prev.filter((t) => t.id !== tagId));
        }
    };

    return (
        <div className="mt-2">
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                    <TagBadge key={tag.id} tag={tag} onRemove={accessToken ? () => handleRemoveTag(tag.id) : undefined} />
                ))}
                {loading && <span className="text-xs text-[#6b7280]">Loading tags…</span>}
                {!loading && tags.length === 0 && (
                    <span className="text-xs text-[#6b7280]">No tags yet.</span>
                )}
            </div>
            <TagSelector selectedTags={tags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />
        </div>
    );
}
