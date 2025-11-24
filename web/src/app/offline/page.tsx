'use client';

import { WifiOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ErrorLayout } from '@/components/errors/ErrorLayout';

export default function OfflinePage() {
  const router = useRouter();
  return (
    <ErrorLayout
      title="You’re Offline"
      message="No connection detected. You can still browse cached content; actions will sync when you’re back online."
      icon={<WifiOff className="w-10 h-10 text-[var(--accent-primary)]" aria-hidden />}
      actions={[
        { label: 'Check Connection', onClick: () => router.refresh() },
        { label: 'Home', href: '/', variant: 'secondary' },
      ]}
    >
      <p className="text-sm text-[var(--text-secondary)]">
        Tip: Some content may be outdated while offline.
      </p>
    </ErrorLayout>
  );
}
