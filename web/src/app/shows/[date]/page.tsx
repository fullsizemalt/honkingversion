import { Show } from '@/types';
import VoteControl from '@/components/VoteControl';
import SetlistDisplay from '@/components/SetlistDisplay';
import AttendedButton from '@/components/AttendedButton';
import ShowTags from '@/components/ShowTags';
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
    } catch (_error) {
        console.error('Failed to fetch performances:', _error);
        return [];
    }
}

async function getVotes(showId: number): Promise<Vote[]> {
    try {
        const res = await fetch(getApiEndpoint(`/votes/show/${showId}`), { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (_error) {
        console.error('Failed to fetch votes', _error);
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
            <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="relative pl-4">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-tertiary)] rounded-full" />
                            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-2 uppercase tracking-tight">
                                {show.date}
                            </h1>
                            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)] uppercase tracking-[0.35em]">
                                {show.venue || 'Unknown Venue'} · {show.location || 'Unknown Location'}
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-5xl font-black text-[var(--accent-tertiary)]">
                                {averageRating}
                            </div>
                            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)]">
                                {votes.length} votes
                            </p>
                            <div className="mt-2 w-full min-w-[220px]">
                                <ShowTags showId={show.id} />
                            </div>
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
                            <SetlistDisplay performances={performances} />
                        ) : (
                            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 rounded-3xl">
                                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-tertiary)]">
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
                        <AttendedButton showId={show.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
