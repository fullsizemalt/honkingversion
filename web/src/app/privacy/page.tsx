'use client'

import Link from 'next/link'
import PageHeader from '@/components/PageHeader'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-16">
      <PageHeader
        title="Privacy & Cookies"
        description="How we handle your data, cookies, and permissions."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy', href: '/privacy' }]}
      />

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 text-[var(--text-secondary)]">
        <Section title="What We Collect">
          <ul className="list-disc list-inside space-y-2">
            <li>Account: username, email, hashed password.</li>
            <li>Usage: votes, reviews, follows, attendance, lists.</li>
            <li>Device: IP, user agent (security, diagnostics).</li>
            <li>Optional: social links you add to your profile.</li>
          </ul>
        </Section>

        <Section title="How We Use It">
          <ul className="list-disc list-inside space-y-2">
            <li>Operate the app: auth, personalization, leaderboards, recommendations.</li>
            <li>Protect the service: abuse prevention, rate limiting, fraud detection.</li>
            <li>Improve features: aggregated analytics; data is not sold.</li>
          </ul>
        </Section>

        <Section title="Cookies & Storage">
          <ul className="list-disc list-inside space-y-2">
            <li>Essential: login sessions, CSRF.</li>
            <li>Preferences: theme, layout choices.</li>
            <li>Analytics (if enabled): anonymized usage trends; block via browser settings if you prefer.</li>
          </ul>
        </Section>

        <Section title="Permissions">
          <ul className="list-disc list-inside space-y-2">
            <li>Notifications: optional; used for follows, comments, system alerts. Disable in settings or your browser.</li>
            <li>Location: not required; we infer only from show/venue data you view or add.</li>
            <li>Social links: only if you choose to add them.</li>
          </ul>
        </Section>

        <Section title="Data Sharing">
          <ul className="list-disc list-inside space-y-2">
            <li>No sale of personal data.</li>
            <li>Vendors: hosting, logging, security, email (bound by DPAs).</li>
            <li>Aggregated stats may be shared without personal identifiers.</li>
          </ul>
        </Section>

        <Section title="Retention & Control">
          <ul className="list-disc list-inside space-y-2">
            <li>Edit your profile; delete reviews/comments where supported.</li>
            <li>Account deletion removes personal identifiers; aggregated data may persist.</li>
            <li>Contact us to request access or deletion.</li>
          </ul>
        </Section>

        <Section title="Contact">
          <p>If you have privacy questions or requests, contact the admins via support.</p>
          <div className="mt-3 text-sm text-[var(--text-tertiary)]">
            Need help? <Link href="/support" className="text-[var(--accent-primary)] hover:underline">Visit support</Link>
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6">
      <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] mb-3 uppercase tracking-[0.2em]">
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-[var(--text-secondary)]">{children}</div>
    </section>
  )
}
