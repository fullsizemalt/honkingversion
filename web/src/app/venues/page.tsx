import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getApiEndpoint } from '@/lib/api';

type Venue = {
    name: string;
    slug: string;
};

export default function VenuesPage() {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const res = await fetch(getApiEndpoint('/venues'));
                if (res.ok) {
                    const data = await res.json();
                    setVenues(data);
                }
            } catch (e) {
                console.error('Failed to fetch venues', e);
            } finally {
                setLoading(false);
            }
        };
        fetchVenues();
    }, []);

    if (loading) return <p>Loading venues...</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold mb-6 text-[#f5f5f5]">
                Venues
            </h1>
            <ul className="space-y-3">
                {venues.map((v) => (
                    <li key={v.slug} className="border-b border-[#333] pb-2">
                        <Link href={`/venues/${v.slug}`} className="text-[#a0a0a0] hover:text-[#ff6b35]">
                            {v.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
