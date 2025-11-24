'use client';

import { Hourglass } from 'lucide-react';
import { ErrorLayout } from '@/components/errors/ErrorLayout';

const RESET_MINUTES = 15;
const LIMIT = 100;
const WINDOW = 'hour';

export default function RateLimitedPage() {
  return (
    <ErrorLayout
      code="429"
      title="Slow Down There"
      message="You’ve hit the request limit. This keeps things fast and fair for everyone."
      icon={<Hourglass className="w-10 h-10 text-[var(--accent-primary)]" aria-hidden />}
      helpText={`Limit: ${LIMIT} per ${WINDOW} · Resets in ~${RESET_MINUTES} minutes`}
      actions={[
        { label: 'Try Again', href: '/' },
        { label: 'View API Limits', href: '/updates', variant: 'secondary' },
      ]}
    >
      <div className="text-sm text-[var(--text-secondary)] space-y-1">
        <p>Tips: space out requests, prefer search over brute browsing, retry after the window resets.</p>
      </div>
    </ErrorLayout>
  );
}
