'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';
import SynopsisViewer from './SynopsisViewer';
import SynopsisEditor from './SynopsisEditor';

interface SynopsisSectionProps {
    objectType: 'song' | 'show' | 'venue' | 'tour';
    objectId: number;
    title?: string;
}

interface SynopsisData {
    content: string;
    version: number;
    last_updated_at: string | null;
    last_updated_by: {
        username: string;
    } | null;
}

export default function SynopsisSection({ objectType, objectId, title = "Community Synopsis" }: SynopsisSectionProps) {
    const { data: session } = useSession();
    const [data, setData] = useState<SynopsisData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSynopsis = async () => {
        try {
            const res = await fetch(getApiEndpoint(`/synopsis/${objectType}/${objectId}`));
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (err) {
            console.error('Failed to fetch synopsis:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSynopsis();
    }, [objectType, objectId]);

    const handleSave = async (content: string, summary: string) => {
        if (!session || !data) return;

        setIsSaving(true);
        setError(null);

        try {
            const res = await fetch(getApiEndpoint(`/synopsis/${objectType}/${objectId}`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    version: data.version,
                    change_summary: summary
                })
            });

            if (res.ok) {
                const updatedData = await res.json();
                setData(updatedData);
                setIsEditing(false);
            } else if (res.status === 409) {
                setError('Conflict: This synopsis has been modified by another user. Please refresh and try again.');
            } else {
                setError('Failed to save changes. Please try again.');
            }
        } catch (err) {
            console.error('Failed to save synopsis:', err);
            setError('Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="animate-pulse h-32 bg-[var(--bg-secondary)] border border-[var(--border)]" />;
    }

    return (
        <div className="space-y-4">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)]">
                {title}
            </h3>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                </div>
            )}

            {isEditing ? (
                <SynopsisEditor
                    initialContent={data?.content || ''}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                    isSaving={isSaving}
                />
            ) : (
                <SynopsisViewer
                    content={data?.content || ''}
                    lastUpdatedBy={data?.last_updated_by || undefined}
                    lastUpdatedAt={data?.last_updated_at || undefined}
                    onEdit={() => setIsEditing(true)}
                    canEdit={!!session}
                />
            )}
        </div>
    );
}
