'use client';

import { Clock3 } from 'lucide-react';
import { ErrorLayout } from '@/components/errors/ErrorLayout';

export default function MaintenancePage() {
  const estimated = 'Back soon'; // Placeholder; wire to real status when available.
  return (
    <ErrorLayout
      code="503"
      title="Scheduled Maintenance"
      message="HonkingVersion is temporarily offline while we make upgrades."
      icon={<Clock3 className="w-10 h-10 text-[var(--accent-primary)]" aria-hidden />}
      helpText={`Estimated return: ${estimated}`}
      actions={[
        { label: 'Updates', href: '/updates' },
        { label: 'Home', href: '/', variant: 'secondary' },
      ]}
    >
      <p className="text-sm text-[var(--text-secondary)]">
        We’ll be back shortly. If this is unexpected, check the Updates page or contact support.
      </p>
    </ErrorLayout>
  );
}
