'use client';

import { Lock } from 'lucide-react';
import Link from 'next/link';
import { ErrorLayout } from '@/components/errors/ErrorLayout';

export default function ForbiddenPage() {
  return (
    <ErrorLayout
      code="403"
      title="Access Denied"
      message="You don’t have permission to view this page. Sign in or switch to an account with the right permissions."
      icon={<Lock className="w-10 h-10 text-[var(--accent-primary)]" aria-hidden />}
      actions={[
        { label: 'Sign In', href: '/auth/signin' },
        { label: 'Home', href: '/', variant: 'secondary' },
      ]}
      helpText="If you believe this is an error, contact support with the URL you tried to access."
    >
      <p className="text-sm text-[var(--text-secondary)]">
        Need access? Request it from an admin or return to a page you can view.
      </p>
      <p className="text-xs text-[var(--text-tertiary)] mt-2">
        Looking for public pages? Try{" "}
        <Link href="/shows" className="underline underline-offset-4">
          Shows
        </Link>
        ,{" "}
        <Link href="/performances" className="underline underline-offset-4">
          Performances
        </Link>{" "}
        or{" "}
        <Link href="/trending" className="underline underline-offset-4">
          Trending
        </Link>
        .
      </p>
    </ErrorLayout>
  );
}
