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
  avg_rating?: number | null | undefined;
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

// Get heat color based on level for light + dark themes
const getHeatColor = (level: number): string => {
  switch (level) {
    case 3:
      return 'text-[var(--accent-primary)] bg-[color:rgba(255,107,53,0.12)] border border-[color:rgba(255,107,53,0.35)]';
    case 2:
      return 'text-[#c56a19] bg-[color:rgba(247,147,30,0.15)] border border-[color:rgba(247,147,30,0.35)]';
    case 1:
      return 'text-[#1c7c51] bg-[color:rgba(31,199,123,0.14)] border border-[color:rgba(31,199,123,0.25)]';
    default:
      return 'text-[var(--text-tertiary)] bg-[var(--bg-muted)] border border-[var(--border-subtle)]';
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
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-2">
            <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl font-bold text-[var(--text-primary)] uppercase tracking-tight">
              HONKINGVERSION
            </h1>
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)] mt-2 tracking-[0.3em] uppercase">
              explore the best live performances from Goose
            </p>
          </div>
          {!session && (
            <div className="mt-6 font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)] flex flex-wrap gap-2 items-center">
              <span>Please </span>
              <Link href="/auth/signin" className="text-[var(--accent-primary)] hover:underline">login</Link>
              <span> or </span>
              <Link href="/auth/register" className="text-[var(--accent-primary)] hover:underline">register</Link>
              <span>to vote on your favorite performances.</span>
            </div>
          )}
        </div>
      </div>

      {/* 3-Column Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Trending Performances */}
          <div className="border border-[var(--border)] bg-[var(--bg-secondary)] rounded-3xl p-6 shadow-[0_25px_45px_rgba(20,20,20,0.08)]">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--text-primary)] uppercase tracking-[0.35em] mb-6 flex items-center gap-2">
              <span>Trending</span>
              <span className="text-xs text-[var(--accent-primary)] tracking-normal">Last 30 Days</span>
            </h2>

            {loading ? (
              <p className="text-[var(--text-tertiary)] text-sm">Loading...</p>
            ) : trendingPerformances.length > 0 ? (
              <div className="space-y-4">
                {trendingPerformances.slice(0, 8).map((perf) => {
                  const heatLevel = getHeatLevel(perf.votes_last_30d, maxTrendingVotes);
                  const heatColor = getHeatColor(heatLevel);
                  const heatIndicator = getHeatIndicator(heatLevel);

                  return (
                    <div key={perf.performance_id} className="border border-[var(--border-subtle)] p-4 rounded-2xl hover:border-[var(--accent-primary)] hover:shadow-[0_20px_35px_rgba(17,17,26,0.08)] transition-all cursor-pointer group bg-[var(--bg-muted)]/60">
                      <div className="flex items-start gap-3">
                        <div className={`px-3 py-1 text-[11px] font-semibold tracking-widest rounded-full min-w-max ${heatColor}`}>
                          {heatIndicator}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-[family-name:var(--font-space-grotesk)] text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                            {perf.song_name}
                          </p>
                          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] mt-1 uppercase tracking-[0.35em]">
                            {perf.venue} • {perf.date}
                          </p>
                          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] mt-2">
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
          <div className="border border-[var(--border)] bg-[var(--bg-secondary)] rounded-3xl p-6 shadow-[0_25px_45px_rgba(20,20,20,0.08)]">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--text-primary)] uppercase tracking-[0.35em] mb-6 flex items-center gap-2">
              <span>Highest Rated</span>
            </h2>

            {loading ? (
              <p className="text-[var(--text-tertiary)] text-sm">Loading...</p>
            ) : topPerformances.length > 0 ? (
              <div className="space-y-4">
                {topPerformances.slice(0, 8).map((perf) => (
                  <div key={perf.id} className="border border-[var(--border-subtle)] p-4 rounded-2xl hover:border-[var(--accent-primary)] hover:shadow-[0_20px_35px_rgba(17,17,26,0.08)] transition-all cursor-pointer group bg-[var(--bg-muted)]/60">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-[family-name:var(--font-space-grotesk)] text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                          {perf.song_name}
                        </p>
                        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] mt-1 uppercase tracking-[0.35em]">
                          {perf.venue} • {perf.date}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--accent-primary)]">
                          {perf.avg_rating.toFixed(1)}
                        </p>
                        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-tertiary)] tracking-[0.35em]">
                          {perf.vote_count} votes
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--text-tertiary)] text-sm">No rated performances yet</p>
            )}
          </div>

          {/* Column 3: Community Leaderboard */}
          <div className="border border-[var(--border)] bg-[var(--bg-secondary)] rounded-3xl p-6 shadow-[0_25px_45px_rgba(20,20,20,0.08)]">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--text-primary)] uppercase tracking-[0.35em] mb-6">
              Community
            </h2>

            <div className="mb-8">
              <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] uppercase tracking-[0.35em] mb-4">
                Top Voters
              </h3>
              {loading ? (
                <p className="text-[var(--text-tertiary)] text-sm">Loading...</p>
              ) : topUsers.length > 0 ? (
                <div className="space-y-2">
                  {topUsers.slice(0, 10).map((user, idx) => (
                    <Link
                      key={user.username}
                      href={`/u/${user.username}`}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-muted)]/60 hover:bg-[var(--bg-muted)] transition-all border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] min-w-max">
                          #{idx + 1}
                        </span>
                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                          {user.username}
                        </span>
                      </div>
                      <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] transition-colors flex-shrink-0">
                        {user.votes}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-[var(--text-tertiary)] text-sm">No users yet</p>
              )}
            </div>

            {!session && (
              <div className="pt-6 border-t border-[var(--border-subtle)]">
                <Link
                  href="/auth/register"
                  className="block text-center font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--accent-primary)] border border-[var(--accent-primary)] p-3 rounded-full hover:bg-[var(--accent-primary)] hover:text-[var(--text-inverse)] transition-colors tracking-[0.3em]"
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
