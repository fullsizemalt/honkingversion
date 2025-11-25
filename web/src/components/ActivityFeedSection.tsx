'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';
import ActivityFeed from '@/components/ActivityFeed';
import { Review } from '@/types';

const PAGE_SIZE = 10;

export default function ActivityFeedSection() {
  const { data: session } = useSession();
  const [feedType, setFeedType] = useState<'community' | 'following'>('community');
  const [feedActivities, setFeedActivities] = useState<Review[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setFeedActivities([]);
    fetchFeed(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedType, session?.user?.accessToken]);

  const fetchFeed = async (reset = false) => {
    if (feedType === 'following' && !session) return;
    const offset = reset ? 0 : page * PAGE_SIZE;
    if (reset) setLoadingInitial(true);
    setLoadingFeed(true);
    try {
      const headers: HeadersInit = {};
      if (feedType === 'following' && session?.user?.accessToken) {
        headers['Authorization'] = `Bearer ${session.user.accessToken}`;
      }
      const endpoint =
        feedType === 'following'
          ? `/users/me/feed?limit=${PAGE_SIZE}&offset=${offset}`
          : `/feed/community?limit=${PAGE_SIZE}&offset=${offset}`;

      const res = await fetch(getApiEndpoint(endpoint), { headers });
      if (res.ok) {
        const data = await res.json();
        const newItems = reset ? data : [...feedActivities, ...data];
        setFeedActivities(newItems);
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch (error) {
      console.error('Failed to fetch feed', error);
    } finally {
      setLoadingFeed(false);
      setLoadingInitial(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed();
  };

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
        <ActivityFeed
          activities={feedActivities}
          title=""
          onLoadMore={hasMore ? handleLoadMore : undefined}
          hasMore={hasMore}
          loadingMore={loadingFeed && !loadingInitial}
          loadingInitial={loadingInitial}
        />
      )}
    </div>
  );
}
