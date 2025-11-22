import { notFound } from 'next/navigation';
import ShowCard from '@/components/ShowCard';
import { getApiEndpoint } from '@/lib/api';

interface ListDetail {
    id: number;
    title: string;
    description?: string;
    username: string;
    user_id: number;
    shows: Array<{
        id: number;
        date: string;
        venue: string;
        location: string;
    }>;
    created_at?: string;
}

async function getList(id: string): Promise<ListDetail | null> {
    try {
        const res = await fetch(getApiEndpoint(`/lists/${id}`), { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export default async function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const list = await getList(id);

    if (!list) {
        notFound();
    }

    return (
        <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
            <main className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">{list.title}</h1>
                    {list.description && (
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                            {list.description}
                        </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Created by <span className="font-medium text-orange-500">{list.username}</span>
                        {' • '}
                        {list.shows.length} {list.shows.length === 1 ? 'show' : 'shows'}
                    </p>
                </div>

                {list.shows.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            This list is empty
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {list.shows.map((show) => (
                            <ShowCard key={show.id} show={show} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
