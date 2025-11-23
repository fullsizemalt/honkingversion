import ListCard from '@/components/ListCard';
import { getApiEndpoint } from '@/lib/api';
import CreateListButton from '@/components/CreateListButton';

export const dynamic = 'force-dynamic';

interface ListsData {
    id: number;
    title: string;
    description?: string;
    username: string;
    show_count: number;
    created_at?: string;
    items?: string | any[];
    list_type?: string;
}

async function getLists(): Promise<ListsData[]> {
    try {
        const res = await fetch(getApiEndpoint('/lists/'), { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error("Failed to fetch lists", e);
        return [];
    }
}

export default async function ListsPage() {
    const lists = await getLists();
    // Client components are discouraged here; keep this page server-rendered and delegate interactivity to ListEditor inside a client boundary.

    return (
        <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
            <main className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">User Lists</h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Discover curated collections of shows from the community
                        </p>
                    </div>
                    <CreateListButton />
                </div>

                {lists.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No lists yet. Be the first to create one!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lists.map((list) => (
                            <ListCard
                                key={list.id}
                                list={{
                                    ...list,
                                    items: list.items || '[]',
                                    list_type: (list.list_type as any) || 'shows',
                                    user_id: 0,
                                }}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
