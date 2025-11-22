import { Show } from '@/types';
import VoteControl from '@/components/VoteControl';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { notFound } from 'next/navigation';
import { getApiEndpoint } from '@/lib/api';

interface ShowResponse extends Partial<Show> {
    setlist?: string;
    id: number; // Ensure ID is present
}

interface Vote {
    rating: number;
    user_id: number;
}

async function getShow(date: string): Promise<ShowResponse | null> {
    const res = await fetch(getApiEndpoint(`/shows/${date}`), { cache: 'no-store' });
    if (!res.ok) {
        return null;
    }
    return res.json();
}

async function getVotes(showId: number): Promise<Vote[]> {
    try {
        const res = await fetch(getApiEndpoint(`/votes/show/${showId}`), { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        return [];
    }
}

export default async function ShowPage({ params }: { params: Promise<{ date: string }> }) {
    const { date } = await params;
    const show = await getShow(date);

    if (!show) {
        notFound();
    }

    const votes = await getVotes(show.id);
    const session = await getServerSession(authOptions);

    // Calculate average
    const averageRating = votes.length > 0
        ? (votes.reduce((acc, v) => acc + v.rating, 0) / votes.length).toFixed(1)
        : "N/A";

    // Find user's vote
    const userVote = session?.user?.id
        ? votes.find(v => v.user_id === session.user.id)
        : undefined;

    // Handle inconsistent API response (DB vs External API)
    const setlistContent = show.setlist || show.setlist_data || "No setlist available";

    return (
        <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
            <main className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Goose - {show.date}</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">{show.venue || 'Unknown Venue'} - {show.location || 'Unknown Location'}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-5xl font-black bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                            {averageRating}
                        </div>
                        <p className="text-sm text-gray-500">{votes.length} votes</p>
                    </div>
                </div>

                <VoteControl
                    showId={show.id}
                    initialUserVote={userVote}
                // Server component can't pass functions like this, but we'll handle updates via router.refresh() in the client component
                />

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md whitespace-pre-wrap font-mono border border-slate-700">
                    {setlistContent}
                </div>
            </main>
        </div>
    );
}
