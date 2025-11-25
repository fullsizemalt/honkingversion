'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { getApiEndpoint } from '@/lib/api';
import { UserList } from '@/types/list';
import { Show, Performance } from '@/types';
import ItemTags from '@/components/ItemTags';
import ListEditor from '@/components/ListEditor';
import ListFollowButton from '@/components/ListFollowButton';

export default function ListDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tokenParam = searchParams.get('token');
    const { data: session } = useSession();
    const id = params.id as string;
    const [list, setList] = useState<UserList | null>(null);
    const [loading, setLoading] = useState(true);
    const [showListEditor, setShowListEditor] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [shareToken, setShareToken] = useState<string | null>(null);
    const [sharing, setSharing] = useState(false);
    const [itemDetails, setItemDetails] = useState<any[]>([]);
    const [followerCount, setFollowerCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const res = await fetch(getApiEndpoint(`/lists/${id}${tokenParam ? `?token=${tokenParam}` : ''}`));
                if (res.ok) {
                    const data = await res.json();
                    setList(data);

                    // Check if current user is owner
                    if (session?.user?.id) {
                        setIsOwner(data.user_id === session.user.id);
                    }
                    if (data.share_token) {
                        setShareToken(data.share_token);
                    }
                    setFollowerCount(data.follower_count || 0);
                    setIsFollowing(data.is_following || false);
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
    }, [id, session, tokenParam]);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!list?.items) {
                setItemDetails([]);
                return;
            }
            const itemsArray = Array.isArray(list.items)
                ? list.items
                : (() => {
                    try {
                        return JSON.parse(list.items as string);
                    } catch {
                        return [];
                    }
                })();

            const results: any[] = [];
            for (const raw of itemsArray) {
                const itemId = typeof raw === 'object' && raw?.id ? raw.id : raw;
                const label = typeof raw === 'object' && raw?.label ? raw.label : null;
                try {
                    if (list.list_type === 'shows') {
                        const res = await fetch(getApiEndpoint(`/shows/id/${itemId}`), { cache: 'no-store' });
                        if (res.ok) {
                            results.push({ type: 'show', data: await res.json(), id: itemId, label });
                            continue;
                        }
                    } else if (list.list_type === 'performances') {
                        const res = await fetch(getApiEndpoint(`/performances/${itemId}`), { cache: 'no-store' });
                        if (res.ok) {
                            results.push({ type: 'performance', data: await res.json(), id: itemId, label });
                            continue;
                        }
                    } else if (list.list_type === 'songs') {
                        const res = await fetch(getApiEndpoint(`/songs/id/${itemId}`), { cache: 'no-store' });
                        if (res.ok) {
                            results.push({ type: 'song', data: await res.json(), id: itemId, label });
                            continue;
                        }
                    }
                } catch (e) {
                    console.error('Failed to fetch item detail', e);
                }
                results.push({ type: 'unknown', id: itemId, label });
            }
            setItemDetails(results);
        };
        fetchDetails();
    }, [list]);

    const handleDelete = async () => {
        if (!session?.user?.accessToken || !confirm('Are you sure you want to delete this list?')) return;

        try {
            const res = await fetch(getApiEndpoint(`/lists/${id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session.user.accessToken}`
                }
            });

            if (res.ok) {
                router.push('/profile');
            }
        } catch (error) {
            console.error('Failed to delete list', error);
        }
    };

    const handleShare = async () => {
        if (!session?.user?.accessToken) {
            router.push('/auth/signin');
            return;
        }
        setSharing(true);
        try {
            const res = await fetch(getApiEndpoint(`/lists/${id}/share`), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.user.accessToken}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setShareToken(data.share_token);
            }
        } catch (error) {
            console.error('Failed to share list', error);
        } finally {
            setSharing(false);
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

    const parsedItems: any[] = (() => {
        if (!list.items) return [];
        if (Array.isArray(list.items)) return list.items;
        try {
            return JSON.parse(list.items as string);
        } catch (e) {
            console.error('Failed to parse list items', e);
            return [];
        }
    })();

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
                            {!isOwner && (
                                <div className="ml-4">
                                    <ListFollowButton
                                        listId={list.id}
                                        initialIsFollowing={isFollowing}
                                        initialFollowerCount={followerCount}
                                        isOwner={false}
                                    />
                                </div>
                            )}
                            {isOwner && (
                                <div className="flex flex-col gap-2 ml-4">
                                <div className="flex gap-2">
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
                                <div className="flex gap-2 items-center">
                                    <button
                                        onClick={handleShare}
                                        disabled={sharing}
                                        className="border border-[#333] text-[#a0a0a0] px-3 py-1 font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase hover:border-[#00d9ff] hover:text-white disabled:opacity-50"
                                    >
                                        {shareToken ? 'Regenerate Link' : 'Share Link'}
                                    </button>
                                    {shareToken && (
                                        <>
                                            <span className="text-xs text-[#9ca3af]">Token ready</span>
                                            <a
                                                href={`/lists/${id}?token=${shareToken}`}
                                                className="text-xs text-[#00d9ff] underline"
                                                target="_blank"
                                            >
                                                Open link
                                            </a>
                                            <a
                                                href={`${getApiEndpoint(`/export/list/${id}`)}?token=${shareToken}`}
                                                className="text-xs text-[#9ca3af] underline"
                                                target="_blank"
                                            >
                                                Export CSV
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-sm font-[family-name:var(--font-ibm-plex-mono)] text-[#707070]">
                        <span>{parsedItems.length} items</span>
                        <span>•</span>
                        <span>Created {new Date(list.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {itemDetails.length > 0 ? (
                        itemDetails.map((entry, index) => {
                            if (entry.type === 'show') {
                                const s = entry.data as Show;
                                return (
                                    <Link key={index} href={`/shows/${s.date}`} className="block bg-[#1a1a1a] border border-[#333] p-4 text-[#f5f5f5] hover:border-[#00d9ff]">
                                        <div className="font-semibold">{s.date} @ {s.venue}</div>
                                        <div className="text-sm text-[#9ca3af]">{s.location}</div>
                                        <ItemTags type="show" id={s.id!} />
                                    </Link>
                                );
                            }
                            if (entry.type === 'performance') {
                                const p = entry.data as Performance;
                                return (
                                    <div key={index} className="bg-[#1a1a1a] border border-[#333] p-4 text-[#f5f5f5]">
                                        <div className="font-semibold">{p.song.name}</div>
                                        <div className="text-sm text-[#9ca3af]">{p.show.date} @ {p.show.venue}</div>
                                        <div className="text-xs text-[#6b7280]">Set {p.set_number} • Position {p.position}</div>
                                        <ItemTags type="performance" id={p.id} />
                                    </div>
                                );
                            }
                            if (entry.type === 'song') {
                                const sg = entry.data as any;
                                return (
                                    <Link key={index} href={`/songs/${sg.slug}`} className="block bg-[#1a1a1a] border border-[#333] p-4 text-[#f5f5f5] hover:border-[#00d9ff]">
                                        <div className="font-semibold">{sg.name}</div>
                                        {sg.artist && <div className="text-xs text-[#9ca3af]">{sg.artist}</div>}
                                    </Link>
                                );
                            }
                            return (
                                <div key={index} className="bg-[#1a1a1a] border border-[#333] p-4 text-[#f5f5f5]">
                                    {entry.label || `Item ID: ${entry.id}`}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-[#a0a0a0] italic">This list is empty.</div>
                    )}
                </div>

                <ListEditor
                    isOpen={showListEditor}
                    onClose={() => setShowListEditor(false)}
                    onListSaved={(updatedList) => {
                        const normalizedItems =
                            typeof updatedList.items === 'string'
                                ? updatedList.items
                                : JSON.stringify(updatedList.items ?? []);
                        setList((prev) => {
                            const next: UserList = {
                                ...(prev || ({} as UserList)),
                                ...updatedList,
                                list_type:
                                    (updatedList.list_type as UserList['list_type']) ||
                                    (prev?.list_type ?? 'shows'),
                                items: normalizedItems,
                            };
                            return next;
                        });
                        setShowListEditor(false);
                    }}
                    editList={{
                        ...list,
                        items: parsedItems,
                        list_type: (list.list_type as 'shows' | 'performances' | 'songs' | undefined) || 'shows',
                    }}
                />
            </div>
        </div>
    );
}
