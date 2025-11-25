'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getApiEndpoint } from "@/lib/api";
import { StatsResponse } from "@/types";
import RecentComments from "@/components/RecentComments";
import TopMembers from "@/components/TopMembers";
import RecentBlurbs from "@/components/RecentBlurbs";
import PageHeader from "@/components/PageHeader";

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
  return '▮'.repeat(Math.max(1, level));
};

export default function Home() {
  const { data: session } = useSession();
  const [trendingPerformances, setTrendingPerformances] = useState<TrendingPerformance[]>([]);
  const [topPerformances, setTopPerformances] = useState<TopPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxTrendingVotes, setMaxTrendingVotes] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats for trending and user leaderboard
        const statsRes = await fetch(getApiEndpoint('/stats/'));
        if (statsRes.ok) {
          const stats: StatsResponse = await statsRes.json();
          console.log("Stats data:", stats);
          const trending = stats.trending_performances || [];
          setTrendingPerformances(trending);
          if (trending.length > 0) {
            setMaxTrendingVotes(Math.max(...trending.map(p => p.votes_last_30d)));
          }
        }

        // Fetch all performances for top-rated
        const perfRes = await fetch(getApiEndpoint('/performances/top-rated?limit=12&min_votes=3'));
        if (perfRes.ok) {
          const perfs = await perfRes.json();
          console.log("Top performances data:", perfs);
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
              song_name: p.song?.name || 'Unknown',
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
      <PageHeader
        title="HONKINGVERSION"
        description="explore the best live performances from Goose"
        loggedInMessage="Welcome back! Browse trending and top-rated performances below."
      />

      {/* 3-Column Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Trending Performances */}
          <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-[0_25px_45px_rgba(20,20,20,0.08)]">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--text-primary)] uppercase tracking-[0.35em] mb-6 flex items-center gap-2">
              <span>Trending</span>
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
                    <div key={perf.performance_id} className="border border-[var(--border-subtle)] p-4 hover:border-[var(--accent-primary)] hover:shadow-[0_20px_35px_rgba(17,17,26,0.08)] transition-all cursor-pointer group bg-[var(--bg-muted)]/60">
                      <div className="flex items-start gap-3">
                        <div className={`px-3 py-1 text-[11px] font-semibold tracking-widest min-w-max ${heatColor}`}>
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
          <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-[0_25px_45px_rgba(20,20,20,0.08)]">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--text-primary)] uppercase tracking-[0.35em] mb-6 flex items-center gap-2">
              <span>Highest Rated</span>
            </h2>

            {loading ? (
              <p className="text-[var(--text-tertiary)] text-sm">Loading...</p>
            ) : topPerformances.length > 0 ? (
              <div className="space-y-4">
                {topPerformances.slice(0, 8).map((perf) => (
                  <div key={perf.id} className="border border-[var(--border-subtle)] p-4 hover:border-[var(--accent-primary)] hover:shadow-[0_20px_35px_rgba(17,17,26,0.08)] transition-all cursor-pointer group bg-[var(--bg-muted)]/60">
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
          <div className="flex flex-col gap-8">
            <TopMembers />

            {!session && (
              <div className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6 shadow-[0_25px_45px_rgba(20,20,20,0.08)]">
                <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-[var(--text-primary)] uppercase tracking-[0.35em] mb-6">
                  Join Us
                </h2>
                <Link
                  href="/auth/register"
                  className="block text-center font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--accent-primary)] border border-[var(--accent-primary)] p-3 hover:bg-[var(--accent-primary)] hover:text-[var(--text-inverse)] transition-colors tracking-[0.3em]"
                >
                  JOIN THE COMMUNITY
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* New Row: Blurbs and Comments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <RecentBlurbs />
          <RecentComments />
        </div>
      </div>
    </div>
  );
}
