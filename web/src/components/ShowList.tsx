import ShowCard from './ShowCard';
import { Show } from '@/types';
import { getApiEndpoint } from '@/lib/api';

async function getRecentShows(): Promise<Show[]> {
    try {
        const res = await fetch(getApiEndpoint('/shows/'), { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error("Failed to fetch shows", e);
        return [];
    }
}

export default async function ShowList() {
    const shows = await getRecentShows();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {shows.filter(s => s.date).map((show) => (
                <ShowCard key={show.id} show={show} />
            ))}
        </div>
    );
}
