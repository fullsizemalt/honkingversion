import Link from 'next/link';
import { Lock } from 'lucide-react';
import { UserList } from '@/types/list';
import ListFollowButton from './ListFollowButton';

interface ListCardProps {
    list: UserList | (Partial<UserList> & { id: number; title: string; created_at?: string });
    showFollowButton?: boolean;
    isOwner?: boolean;
    initialFollowerCount?: number;
    initialIsFollowing?: boolean;
}

export default function ListCard({
    list,
    showFollowButton = false,
    isOwner = false,
    initialFollowerCount,
    initialIsFollowing
}: ListCardProps) {
    const itemCount = (() => {
        if (!list.items) return 0;
        if (Array.isArray(list.items)) return list.items.length;
        try {
            return JSON.parse(list.items).length;
        } catch {
            return 0;
        }
    })();

    return (
        <div className="group relative bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent-primary)] transition-colors">
            <Link href={`/lists/${list.id}`} className="block p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] pr-8">
                        {list.title}
                    </h3>
                    {list.is_public === false && (
                        <Lock className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
                    )}
                </div>

                {list.description && (
                    <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                        {list.description}
                    </p>
                )}

                <div className="flex items-center justify-between text-xs font-[family-name:var(--font-ibm-plex-mono)] text-[var(--text-tertiary)] uppercase tracking-wider">
                    <span>{itemCount} {list.list_type || 'items'}</span>
                    <span>{list.created_at ? new Date(list.created_at).toLocaleDateString() : ''}</span>
                </div>
            </Link>

            {showFollowButton && (
                <div className="absolute top-4 right-4 z-10">
                    <ListFollowButton
                        listId={list.id}
                        initialIsFollowing={initialIsFollowing ?? false}
                        initialFollowerCount={initialFollowerCount ?? 0}
                        isOwner={isOwner}
                    />
                </div>
            )}
        </div>
    );
}
