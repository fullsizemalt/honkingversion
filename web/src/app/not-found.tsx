import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-6xl font-bold text-[var(--accent-primary)] mb-4 uppercase tracking-tight">
          404
        </h1>
        <p className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] mb-4 uppercase">
          Page Not Found
        </p>
        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[var(--text-secondary)] mb-8">
          The performance you're looking for couldn't be found. It might have been removed, or the link might be broken.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-block font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--accent-primary)] border border-[var(--accent-primary)] px-6 py-3 rounded-full hover:bg-[var(--accent-primary)] hover:text-[var(--text-inverse)] transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/shows"
            className="inline-block font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--text-secondary)] border border-[var(--border)] px-6 py-3 rounded-full hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            Explore Shows
          </Link>
        </div>
      </div>
    </div>
  );
}
