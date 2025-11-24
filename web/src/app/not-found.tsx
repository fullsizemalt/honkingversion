import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-6xl font-bold text-[#ff6b35] mb-4 uppercase tracking-tight">
          404
        </h1>
        <p className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--text-primary)] mb-4 uppercase">
          Page Not Found
        </p>
        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[#a0a0a0] mb-8">
          The performance you're looking for couldn't be found. It might have been removed, or the link might be broken.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-block font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[#ff6b35] border border-[#ff6b35] px-6 py-3 hover:bg-[#ff6b35] hover:text-[#0a0a0a] transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/shows"
            className="inline-block font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[#a0a0a0] border border-[#333] px-6 py-3 hover:border-[#ff6b35] hover:text-[#ff6b35] transition-colors"
          >
            Explore Shows
          </Link>
        </div>
      </div>
    </div>
  );
}
