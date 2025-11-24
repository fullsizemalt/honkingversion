'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';
import ActivityFeed from '@/components/ActivityFeed';
import { Review } from '@/types';

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

export default function ActivityFeedSection() {
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
              'Authorization': `Bearer ${session?.user?.accessToken ?? ''}`
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
  );
}
