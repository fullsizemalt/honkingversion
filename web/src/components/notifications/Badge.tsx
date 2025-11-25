'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';

export function NotificationBadge() {
  const { data: session } = useSession();
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const token = session?.user?.accessToken;
    if (!token) return;
    let active = true;
    const fetchCount = async () => {
      try {
        const res = await fetch(getApiEndpoint('/notifications'), {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        const unread = Array.isArray(data) ? data.filter((n) => !n.read_at).length : 0;
        setCount(unread);
      } catch {
        // ignore errors; badge will stay at previous value
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30 * 1000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [session?.user?.accessToken]);

  if (!session?.user) return null;

  return (
    <Link
      href="/notifications"
      className="relative inline-flex items-center justify-center p-2 rounded-full border border-[var(--border)] hover:border-[var(--accent-primary)] transition-colors"
      aria-label="Notifications"
    >
      <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] px-1 rounded-full bg-[var(--accent-primary)] text-[var(--text-inverse)] text-[10px] font-[family-name:var(--font-space-grotesk)] font-bold text-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
