'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { ErrorLayout } from '@/components/errors/ErrorLayout';

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <ErrorLayout
      code="404"
      title="Page Not Found"
      message="The page you’re looking for couldn’t be found. It may have moved, been removed, or never existed."
      actions={[
        { label: 'Go Home', href: '/' },
        { label: 'Explore Shows', href: '/shows', variant: 'secondary' },
        { label: 'Trending', href: '/trending', variant: 'secondary' },
      ]}
      helpText={pathname ? `Attempted path: ${pathname}` : undefined}
    >
      <div className="mt-4 flex flex-col gap-3">
        <form
          onSubmit={onSearch}
          className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full px-4 py-3"
        >
          <Search className="w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for shows, songs, venues, performances..."
            className="flex-1 bg-transparent outline-none text-[var(--text-primary)] text-sm"
          />
          <button
            type="submit"
            className="text-[var(--accent-primary)] font-[family-name:var(--font-space-grotesk)] text-sm font-bold hover:opacity-80"
          >
            Search
          </button>
        </form>
        <div className="flex flex-wrap justify-center gap-2 text-sm text-[var(--text-secondary)]">
          <Link href="/performances" className="underline-offset-4 hover:underline">
            Browse Performances
          </Link>
          <span>•</span>
          <Link href="/songs" className="underline-offset-4 hover:underline">
            Explore Songs
          </Link>
          <span>•</span>
          <Link href="/years" className="underline-offset-4 hover:underline">
            View Years
          </Link>
          <span>•</span>
          <Link href="/lists" className="underline-offset-4 hover:underline">
            Community Lists
          </Link>
        </div>
      </div>
    </ErrorLayout>
  );
}
