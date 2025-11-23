'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { getApiEndpoint } from '@/lib/api';
import { UserList } from '@/types/list';
import ListEditor from '@/components/ListEditor';

export default function ListDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const id = params.id as string;
    const [list, setList] = useState<UserList | null>(null);
    const [loading, setLoading] = useState(true);
    const [showListEditor, setShowListEditor] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const res = await fetch(getApiEndpoint(`/lists/${id}`));
                if (res.ok) {
                    const data = await res.json();
                    setList(data);

                    // Check if current user is owner
                    if (session?.user?.id) {
                        setIsOwner(data.user_id === session.user.id);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch list', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchList();
        }
    }, [id, session]);

    const handleDelete = async () => {
        if (!session?.accessToken || !confirm('Are you sure you want to delete this list?')) return;

        try {
            const res = await fetch(getApiEndpoint(`/lists/${id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`
                }
            });

            if (res.ok) {
                router.push('/profile');
            }
        } catch (error) {
            console.error('Failed to delete list', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="text-[#a0a0a0]">Loading list...</div>
            </div>
        );
    }

    if (!list) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="text-[#a0a0a0]">List not found.</div>
            </div>
        );
    }

    const items = list.items ? JSON.parse(list.items) : [];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-[#f5f5f5] mb-2">
                                {list.title}
                            </h1>
                            {list.description && (
                                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[#a0a0a0] mb-4">
                                    {list.description}
                                </p>
                            )}
                        </div>
                        {isOwner && (
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => setShowListEditor(true)}
                                    className="border border-[#333] text-[#a0a0a0] px-3 py-1 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase hover:border-[#ff6b35] hover:text-[#ff6b35]"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="border border-[#333] text-[#a0a0a0] px-3 py-1 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase hover:border-red-500 hover:text-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-sm font-[family-name:var(--font-ibm-plex-mono)] text-[#707070]">
                        <span>{items.length} items</span>
                        <span>•</span>
                        <span>Created {new Date(list.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {items.length > 0 ? (
                        items.map((itemId: number, index: number) => (
                            <div key={index} className="bg-[#1a1a1a] border border-[#333] p-4 text-[#f5f5f5]">
                                {/* Placeholder for item details - would need to fetch item data */}
                                Item ID: {itemId}
                            </div>
                        ))
                    ) : (
                        <div className="text-[#a0a0a0] italic">This list is empty.</div>
                    )}
                </div>

                <ListEditor
                    isOpen={showListEditor}
                    onClose={() => setShowListEditor(false)}
                    onListSaved={(updatedList) => {
                        setList(updatedList);
                        setShowListEditor(false);
                    }}
                    editList={list}
                />
            </div>
        </div>
    );
}
