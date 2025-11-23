'use client';

import PerformanceList from "@/components/PerformanceList";
import ActivityFeed from "@/components/ActivityFeed";
import { Review } from "@/types";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getApiEndpoint } from "@/lib/api";

// Mock data for homepage activity (fallback/initial)
const recentActivity: Review[] = [
  {
    id: 101,
    user: { id: 3, username: "GooseFan1", created_at: "2023-01-01" },
    rating: 10,
    blurb: "Incredible energy!",
    created_at: new Date().toISOString(),
    show: { id: 201, date: "2023-10-06", venue: "Red Rocks", location: "Morrison, CO" }
  },
  {
    id: 102,
    user: { id: 4, username: "HonkHonk", created_at: "2023-02-01" },
    rating: 9,
    blurb: "Solid first set, second set was fire.",
    created_at: new Date().toISOString(),
    show: { id: 202, date: "2023-10-05", venue: "Red Rocks", location: "Morrison, CO" }
  }
];

export default function Home() {
  const { data: session } = useSession();
  const [feedType, setFeedType] = useState<'community' | 'following'>('community');
  const [feedActivities, setFeedActivities] = useState<Review[]>(recentActivity);
  const [loadingFeed, setLoadingFeed] = useState(false);

  useEffect(() => {
    if (feedType === 'following' && session) {
      const fetchFollowingFeed = async () => {
        setLoadingFeed(true);
        try {
          const res = await fetch(getApiEndpoint('/users/me/feed'), {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setFeedActivities(data);
          }
        } catch (error) {
          console.error('Failed to fetch following feed', error);
        } finally {
          setLoadingFeed(false);
        }
      };
      fetchFollowingFeed();
    } else {
      setFeedActivities(recentActivity);
    }
  }, [feedType, session]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <div className="border-b-2 border-[var(--border)] bg-[var(--bg-primary)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative">
            {/* Sharp accent bar */}
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[var(--accent-primary)]" />

            <h1 className="font-[family-name:var(--font-space-grotesk)] text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-3 uppercase tracking-tighter">
              HONKINGVERSION
            </h1>
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-secondary)] uppercase tracking-wider">
              The definitive Goose performance archive
            </p>
          </div>

          {/* Stats bar */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="border border-[var(--border)] p-4 hover:border-[var(--accent-primary)] transition-colors">
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-3xl font-bold text-[var(--accent-primary)]">230</div>
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">Performances</div>
            </div>
            <div className="border border-[var(--border)] p-4 hover:border-[var(--accent-tertiary)] transition-colors">
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-3xl font-bold text-[var(--accent-tertiary)]">23</div>
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">Songs</div>
            </div>
            <div className="border border-[var(--border)] p-4 hover:border-[var(--accent-purple)] transition-colors">
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-3xl font-bold text-[var(--accent-purple)]">15</div>
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">Shows</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Recent Performances */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] uppercase tracking-tight">
                Recent Performances
              </h2>
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
                Sorted by date
              </div>
            </div>
            <PerformanceList />
          </div>

          {/* Right Column: Community Activity */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setFeedType('community')}
                className={`font-[family-name:var(--font-space-grotesk)] text-xl font-bold uppercase tracking-tight ${feedType === 'community' ? 'text-[var(--text-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                Community
              </button>
              {session && (
                <button
                  onClick={() => setFeedType('following')}
                  className={`font-[family-name:var(--font-space-grotesk)] text-xl font-bold uppercase tracking-tight ${feedType === 'following' ? 'text-[var(--text-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  Following
                </button>
              )}
            </div>

            {loadingFeed ? (
              <div className="text-[var(--text-secondary)]">Loading feed...</div>
            ) : (
              <ActivityFeed activities={feedActivities} title="" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
