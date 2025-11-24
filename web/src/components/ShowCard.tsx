import Link from 'next/link';
import { Show } from '@/types';

interface ShowCardProps {
    show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
    return (
        <Link href={`/shows/${show.date}`} className="block">
            <div className="border border-slate-700 p-4 hover:shadow-lg hover:border-orange-500/50 transition bg-white dark:bg-slate-900">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{show.date}</h3>
                <p className="text-gray-700 dark:text-gray-200 font-medium">{show.venue}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{show.location}</p>
            </div>
        </Link>
    );
}
