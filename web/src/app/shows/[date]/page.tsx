import { Show } from '@/types';
import VoteControl from '@/components/VoteControl';
import SetlistDisplay from '@/components/SetlistDisplay';
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

interface Performance {
    id: number
    song: {
        id: number
        name: string
        slug: string
    }
    position: number
    set_number: number
    notes?: string
}

async function getShow(date: string): Promise<ShowResponse | null> {
    const res = await fetch(getApiEndpoint(`/shows/${date}`), { cache: 'no-store' });
    if (!res.ok) {
        return null;
    }
    return res.json();
}

async function getPerformances(date: string): Promise<Performance[]> {
    try {
        const res = await fetch(getApiEndpoint(`/shows/${date}/performances`), { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        console.error('Failed to fetch performances:', e);
        return [];
    }
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

    const [votes, performances] = await Promise.all([
        getVotes(show.id),
        getPerformances(date)
    ]);

    const session = await getServerSession(authOptions);

    // Calculate average
    const averageRating = votes.length > 0
        ? (votes.reduce((acc, v) => acc + v.rating, 0) / votes.length).toFixed(1)
        : "N/A";

    // Find user's vote
    const userVote = session?.user?.id
        ? votes.find(v => v.user_id === session.user.id)
        : undefined;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Header */}
            <div className="border-b-2 border-[#333] bg-[#0a0a0a] py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#00d9ff]" />
                            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl font-bold text-[#f5f5f5] mb-2 uppercase tracking-tighter">
                                {show.date}
                            </h1>
                            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#a0a0a0] uppercase tracking-wider">
                                {show.venue || 'Unknown Venue'} · {show.location || 'Unknown Location'}
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-5xl font-black text-[#00d9ff]">
                                {averageRating}
                            </div>
                            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#707070]">
                                {votes.length} votes
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Setlist with voting */}
                    <div className="lg:col-span-2">
                        {performances.length > 0 ? (
                            <SetlistDisplay
                                showId={show.id}
                                showDate={show.date || date}
                                performances={performances}
                            />
                        ) : (
                            <div className="bg-[#1a1a1a] border border-[#333] p-6">
                                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#707070]">
                                    No performances found for this show.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <VoteControl
                            showId={show.id}
                            initialUserVote={userVote}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
