import Link from 'next/link';
import { UserList } from '@/types/list';

interface ListCardProps {
    list: UserList;
    username?: string;
}

export default function ListCard({ list, username }: ListCardProps) {
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
        <Link
            href={`/lists/${list.id}`}
            className="block bg-[#1a1a1a] border border-[#333] p-4 hover:border-[#ff6b35] transition-colors group"
        >
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[#f5f5f5] group-hover:text-[#ff6b35] mb-2">
                {list.title}
            </h3>
            {list.description && (
                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#a0a0a0] mb-4 line-clamp-2">
                    {list.description}
                </p>
            )}
            <div className="flex items-center justify-between text-xs font-[family-name:var(--font-ibm-plex-mono)] text-[#707070] uppercase tracking-wider">
                <span>{itemCount} {list.list_type}</span>
                <span>{new Date(list.created_at).toLocaleDateString()}</span>
            </div>
        </Link>
    );
}
