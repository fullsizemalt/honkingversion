'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-6xl font-bold text-[var(--accent-primary)] mb-4 uppercase tracking-tight">
          Error
        </h1>
        <p className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] mb-4 uppercase">
          Something Went Wrong
        </p>
        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[var(--text-secondary)] mb-2">
          {error.message || 'An unexpected error occurred'}
        </p>
        {error.digest && (
          <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[var(--text-tertiary)] text-xs mb-8">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-block font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--accent-primary)] border border-[var(--accent-primary)] px-6 py-3 rounded-full hover:bg-[var(--accent-primary)] hover:text-[var(--text-inverse)] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-block font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--text-secondary)] border border-[var(--border)] px-6 py-3 rounded-full hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
