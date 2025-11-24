'use client';

import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { PrefsForm } from '@/components/notifications/PrefsForm';

export default function NotificationSettingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <PageHeader
        title="Notification Settings"
        description="Control how and when you get notified."
        loggedInMessage="Adjust email, in-app, and digest preferences."
      />

      <div className="flex justify-end">
        <Link
          href="/notifications"
          className="text-sm text-[var(--accent-primary)] underline underline-offset-4 font-[family-name:var(--font-space-grotesk)]"
        >
          Back to notifications
        </Link>
      </div>

      <PrefsForm />
    </div>
  );
}
