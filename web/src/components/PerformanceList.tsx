import PerformanceCard from './PerformanceCard';
import { Performance } from '@/types';
import { getApiEndpoint } from '@/lib/api';

async function getRecentPerformances(): Promise<Performance[]> {
    try {
        const res = await fetch(getApiEndpoint('/performances/?limit=30'), {
            cache: 'no-store'
        });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error("Failed to fetch performances", e);
        return [];
    }
}

export default async function PerformanceList() {
    const performances = await getRecentPerformances();

    if (performances.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No performances found. Check that the API is running.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {performances.map((performance) => (
                <PerformanceCard key={performance.id} performance={performance} />
            ))}
        </div>
    );
}
