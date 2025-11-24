'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { ErrorLayout } from '@/components/errors/ErrorLayout';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorId = error.digest || 'N/A';
  return (
    <ErrorLayout
      code="500"
      title="Something Went Wrong"
      message="We hit a snag processing your request. Please try again in a moment."
      icon={<AlertTriangle className="w-10 h-10 text-[var(--accent-primary)]" aria-hidden />}
      helpText={`Error ID: ${errorId}`}
      actions={[
        { label: 'Try Again', onClick: reset },
        { label: 'Go Home', href: '/', variant: 'secondary' },
        { label: 'Updates', href: '/updates', variant: 'secondary' },
      ]}
    >
      {error?.message && (
        <p className="text-sm text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)]">
          {error.message}
        </p>
      )}
    </ErrorLayout>
  );
}
