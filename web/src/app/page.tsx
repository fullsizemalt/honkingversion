'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getApiEndpoint } from "@/lib/api";
import { StatsResponse } from "@/types";

interface TrendingPerformance {
  performance_id: number;
  song_name: string;
  date: string;
  venue: string;
  votes_last_30d: number;
  avg_rating: number | null;
}

interface TopPerformance {
  id: number;
  song_name: string;
  date: string;
  venue: string;
  avg_rating: number;
  vote_count: number;
}

// Calculate heat level (0-3) based on vote velocity
const getHeatLevel = (votes: number, maxVotes: number): number => {
  if (maxVotes === 0) return 0;
  const ratio = votes / maxVotes;
  if (ratio >= 0.7) return 3;
  if (ratio >= 0.4) return 2;
  if (ratio >= 0.1) return 1;
  return 0;
};

// Get heat color based on level
const getHeatColor = (level: number): string => {
  switch (level) {
    case 3:
      return 'text-red-500 bg-red-950';
    case 2:
      return 'text-orange-400 bg-orange-950';
    case 1:
      return 'text-yellow-400 bg-yellow-950';
    default:
      return 'text-gray-400 bg-gray-900';
  }
};

// Get heat indicator visual
const getHeatIndicator = (level: number): string => {
  return '🔥'.repeat(Math.max(1, level));
};

export default function Home() {
  const { data: session } = useSession();
  const [trendingPerformances, setTrendingPerformances] = useState<TrendingPerformance[]>([]);
  const [topPerformances, setTopPerformances] = useState<TopPerformance[]>([]);
  const [topUsers, setTopUsers] = useState<Array<{ username: string; votes: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [maxTrendingVotes, setMaxTrendingVotes] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats for trending and user leaderboard
        const statsRes = await fetch(getApiEndpoint('/stats'));
        if (statsRes.ok) {
          const stats: StatsResponse = await statsRes.json();
          const trending = stats.trending_performances || [];
          setTrendingPerformances(trending);
          if (trending.length > 0) {
            setMaxTrendingVotes(Math.max(...trending.map(p => p.votes_last_30d)));
          }
          setTopUsers((stats.leaderboards?.votes_cast || []).slice(0, 10));
        }

        // Fetch all performances for top-rated
        const perfRes = await fetch(getApiEndpoint('/performances/?limit=100'));
        if (perfRes.ok) {
          const perfs = await perfRes.json();
          // Filter and sort by rating
          const topRated = perfs
            .filter((p: any) => p.avg_rating && p.vote_count && p.vote_count > 0)
            .sort((a: any, b: any) => {
              const aRating = a.avg_rating || 0;
              const bRating = b.avg_rating || 0;
              return bRating - aRating;
            })
            .slice(0, 10)
            .map((p: any) => ({
              id: p.id,
              song_name: p.performance?.song?.name || 'Unknown',
              date: p.show?.date || 'Unknown',
              venue: p.show?.venue || 'Unknown',
              avg_rating: p.avg_rating || 0,
              vote_count: p.vote_count || 0
            }));
          setTopPerformances(topRated);
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
      {/* Hero Section */}
      <div className="border-b-2 border-[#333] bg-[var(--bg-primary)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-2">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl font-bold text-[var(--text-primary)] uppercase tracking-tight">
              HONKINGVERSION
            </h1>
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#a0a0a0] mt-2">
              explore the best live performances from Goose
            </p>
          </div>
          {!session && (
            <div className="mt-4 font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#a0a0a0]">
              <span>Please </span>
              <Link href="/auth/signin" className="text-[#ff6b35] hover:underline">login</Link>
              <span> or </span>
              <Link href="/auth/register" className="text-[#ff6b35] hover:underline">register</Link>
              <span> to vote on your favorite performances.</span>
            </div>
          )}
        </div>
      </div>

      {/* 3-Column Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Trending Performances */}
          <div className="border border-[#333] bg-[#0f0f0f] p-6">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] uppercase tracking-tight mb-6 flex items-center gap-2">
              <span>Trending</span>
              <span className="text-sm text-[#ff6b35]">Last 30 Days</span>
            </h2>

            {loading ? (
              <p className="text-[#707070] text-sm">Loading...</p>
            ) : trendingPerformances.length > 0 ? (
              <div className="space-y-4">
                {trendingPerformances.slice(0, 8).map((perf, idx) => {
                  const heatLevel = getHeatLevel(perf.votes_last_30d, maxTrendingVotes);
                  const heatColor = getHeatColor(heatLevel);
                  const heatIndicator = getHeatIndicator(heatLevel);

                  return (
                    <div key={perf.performance_id} className={`border border-[#333] p-3 hover:border-[#ff6b35] transition-colors cursor-pointer group`}>
                      <div className="flex items-start gap-3">
                        <div className={`px-2 py-1 text-xs font-bold ${heatColor} rounded min-w-max`}>
                          {heatIndicator}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[#f5f5f5] group-hover:text-[#ff6b35] transition-colors truncate">
                            {perf.song_name}
                          </p>
                          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#707070] mt-1">
                            {perf.venue} • {perf.date}
                          </p>
                          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0] mt-2">
                            {perf.votes_last_30d} votes
                            {perf.avg_rating && ` • ${perf.avg_rating.toFixed(1)}/10`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[#707070] text-sm">No trending performances yet</p>
            )}
          </div>

          {/* Column 2: Top Rated Performances */}
          <div className="border border-[#333] bg-[#0f0f0f] p-6">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] uppercase tracking-tight mb-6 flex items-center gap-2">
              <span>Highest Rated</span>
            </h2>

            {loading ? (
              <p className="text-[#707070] text-sm">Loading...</p>
            ) : topPerformances.length > 0 ? (
              <div className="space-y-4">
                {topPerformances.slice(0, 8).map((perf) => (
                  <div key={perf.id} className="border border-[#333] p-3 hover:border-[#ff6b35] transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[#f5f5f5] group-hover:text-[#ff6b35] transition-colors truncate">
                          {perf.song_name}
                        </p>
                        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#707070] mt-1">
                          {perf.venue} • {perf.date}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[#ff6b35]">
                          {perf.avg_rating.toFixed(1)}
                        </p>
                        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#707070]">
                          {perf.vote_count} votes
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#707070] text-sm">No rated performances yet</p>
            )}
          </div>

          {/* Column 3: Community Leaderboard */}
          <div className="border border-[#333] bg-[#0f0f0f] p-6">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] uppercase tracking-tight mb-6">
              Community
            </h2>

            <div className="mb-8">
              <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0] uppercase tracking-wider mb-4">
                Top Voters
              </h3>
              {loading ? (
                <p className="text-[#707070] text-sm">Loading...</p>
              ) : topUsers.length > 0 ? (
                <div className="space-y-2">
                  {topUsers.slice(0, 10).map((user, idx) => (
                    <Link
                      key={user.username}
                      href={`/u/${user.username}`}
                      className="flex items-center justify-between p-2 hover:bg-[#1a1a1a] transition-colors border border-transparent hover:border-[#333] group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#707070] min-w-max">
                          #{idx + 1}
                        </span>
                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#a0a0a0] group-hover:text-[#ff6b35] transition-colors truncate">
                          {user.username}
                        </span>
                      </div>
                      <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#707070] group-hover:text-[#ff6b35] transition-colors flex-shrink-0">
                        {user.votes}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-[#707070] text-sm">No users yet</p>
              )}
            </div>

            {!session && (
              <div className="pt-6 border-t border-[#333]">
                <Link
                  href="/auth/register"
                  className="block text-center font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[#ff6b35] border border-[#ff6b35] p-3 hover:bg-[#ff6b35] hover:text-[#0a0a0a] transition-colors"
                >
                  JOIN THE COMMUNITY
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
