import Link from 'next/link';

interface ListCardProps {
    list: {
        id: number;
        title: string;
        description?: string;
        username: string;
        show_count: number;
        created_at?: string;
    };
}

export default function ListCard({ list }: ListCardProps) {
    return (
        <Link href={`/lists/${list.id}`} className="block">
            <div className="border border-slate-700 rounded-lg p-6 hover:shadow-lg hover:border-orange-500/50 transition bg-white dark:bg-slate-900 h-full flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {list.title}
                </h3>
                {list.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
                        {list.description}
                    </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-slate-700">
                    <span className="font-medium">by {list.username}</span>
                    <span className="bg-slate-800 px-3 py-1 rounded-full text-xs">
                        {list.show_count} {list.show_count === 1 ? 'show' : 'shows'}
                    </span>
                </div>
            </div>
        </Link>
    );
}
