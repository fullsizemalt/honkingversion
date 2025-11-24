'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getApiEndpoint } from "@/lib/api";
import { Song, StatsResponse, Review } from "@/types";

export default function Home() {
  const { data: session } = useSession();
  const [hotSongs, setHotSongs] = useState<Song[]>([]);
  const [topUsers, setTopUsers] = useState<Array<{ username: string; votes: number }>>([]);
  const [recentPerformances, setRecentPerformances] = useState<Review[]>([]);
  const [recentComments, setRecentComments] = useState<Array<{ id: number; body: string; username: string; created_at: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats for hot songs and leaderboard
        const statsRes = await fetch(getApiEndpoint('/stats'));
        if (statsRes.ok) {
          const stats: StatsResponse = await statsRes.json();
          setHotSongs(
            (stats.top_songs || []).slice(0, 4).map(song => ({
              name: song.name,
              slug: song.slug,
              times_played: song.plays
            }))
          );
          setTopUsers((stats.leaderboards?.votes_cast || []).slice(0, 8));
        }

        // Fetch recent performances
        const perfRes = await fetch(getApiEndpoint('/performances/?limit=20'));
        if (perfRes.ok) {
          const perfs = await perfRes.json();
          setRecentPerformances(perfs.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch homepage data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Login/Register CTA */}
      {!session && (
        <div className="bg-[#1a1a1a] border-b border-[#333] py-4">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#a0a0a0]">
              Please <Link href="/auth/signin" className="text-[#ff6b35] hover:underline">login</Link> or{" "}
              <Link href="/auth/register" className="text-[#ff6b35] hover:underline">register</Link>.
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="border-b-2 border-[#333] bg-[var(--bg-primary)] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 uppercase tracking-tight">
            HONKINGVERSION
          </h1>
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-lg text-[#a0a0a0] mb-6">
            find the best versions of goose songs
          </p>
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#707070] mb-8">
            we're on the search for the dankest versions of goose songs.
          </p>
          <Link href="/songs" className="inline-block font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[#ff6b35] border-b-2 border-[#ff6b35] pb-1 hover:opacity-70 transition-opacity">
            GET STARTED
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hot Songs */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight mb-6">
            choose a hot song below to get started on your heady journey.
          </h2>
          <div className="space-y-2 mb-6">
            {hotSongs.length > 0 ? (
              hotSongs.map((song) => (
                <Link
                  key={song.slug}
                  href={`/songs/${song.slug}`}
                  className="block font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#a0a0a0] hover:text-[#ff6b35] transition-colors py-2 border-l-2 border-transparent hover:border-[#ff6b35] pl-2"
                >
                  {song.name}
                </Link>
              ))
            ) : (
              <p className="text-[#707070] text-sm">Loading songs...</p>
            )}
          </div>
          <Link href="/songs" className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#ff6b35] hover:underline uppercase tracking-wider">
            view all songs
          </Link>
        </section>

        {/* Get Involved */}
        <section className="mb-16 border-t border-[#333] pt-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight mb-4">
            get involved.
          </h2>
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#a0a0a0] mb-4">
            sign up and join our community of goose enthusiasts. we'd love to hear your favorite versions.
          </p>
          {!session && (
            <Link href="/auth/register" className="inline-block font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[#ff6b35] border-b-2 border-[#ff6b35] pb-1 hover:opacity-70 transition-opacity">
              SIGN UP
            </Link>
          )}
        </section>

        {/* Leaderboard */}
        <section className="mb-16 border-t border-[#333] pt-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight mb-6">
            leader board.
          </h2>
          <div className="space-y-3">
            {topUsers.length > 0 ? (
              topUsers.map((user) => (
                <div key={user.username} className="flex items-center justify-between font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                  <Link
                    href={`/u/${user.username}`}
                    className="text-[#a0a0a0] hover:text-[#ff6b35] transition-colors"
                  >
                    {user.username}
                  </Link>
                  <span className="text-[#ff6b35]">+{user.votes}</span>
                </div>
              ))
            ) : (
              <p className="text-[#707070] text-sm">Loading leaderboard...</p>
            )}
          </div>
        </section>

        {/* Hot Songs (Repeated) */}
        <section className="mb-16 border-t border-[#333] pt-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight mb-6">
            hot songs
          </h2>
          <div className="space-y-2">
            {hotSongs.length > 0 ? (
              hotSongs.map((song) => (
                <Link
                  key={`repeat-${song.slug}`}
                  href={`/songs/${song.slug}`}
                  className="block font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#a0a0a0] hover:text-[#ff6b35] transition-colors py-2 border-l-2 border-transparent hover:border-[#ff6b35] pl-2"
                >
                  {song.name}
                </Link>
              ))
            ) : (
              <p className="text-[#707070] text-sm">Loading songs...</p>
            )}
          </div>
        </section>

        {/* New Submissions */}
        <section className="mb-16 border-t border-[#333] pt-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight mb-6">
            new submissions
          </h2>
          <div className="space-y-3">
            {recentPerformances.length > 0 ? (
              recentPerformances.map((perf) => (
                <div key={perf.id} className="font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                  <Link
                    href={`/shows/${perf.show?.date}`}
                    className="text-[#a0a0a0] hover:text-[#ff6b35] transition-colors"
                  >
                    {perf.performance?.song.name}, {perf.show?.venue}, {perf.show?.date}
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-[#707070] text-sm">Loading submissions...</p>
            )}
          </div>
          <Link href="/shows" className="inline-block mt-4 font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#ff6b35] hover:underline uppercase tracking-wider">
            more submissions
          </Link>
        </section>

        {/* Recent Comments */}
        <section className="border-t border-[#333] pt-12">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight mb-6">
            recent comments
          </h2>
          <div className="space-y-3">
            {recentPerformances.length > 0 ? (
              recentPerformances.slice(0, 3).map((perf) => (
                <div key={`comment-${perf.id}`} className="font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                  <p className="text-[#a0a0a0] italic mb-1">"{perf.blurb}"</p>
                  <p className="text-[#707070] text-xs">— {perf.user.username}</p>
                </div>
              ))
            ) : (
              <p className="text-[#707070] text-sm">Loading comments...</p>
            )}
          </div>
          <Link href="/shows" className="inline-block mt-4 font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#ff6b35] hover:underline uppercase tracking-wider">
            more comments
          </Link>
        </section>
      </div>
    </div>
  );
}
