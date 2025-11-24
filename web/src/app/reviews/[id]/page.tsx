'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadLocalReviews, mockReviews } from '@/lib/mockReviews';
import { Review } from '@/types';
import ReviewCard from '@/components/ReviewCard';

function getReviewById(id: number): Review | undefined {
  const locals = loadLocalReviews();
  return [...locals, ...mockReviews].find((r) => r.id === id);
}

export default async function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  const review = Number.isFinite(id) ? getReviewById(id) : undefined;
  if (!review) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--text-primary)]">
            Review Detail
          </h1>
          <p className="text-[var(--text-secondary)] text-sm font-[family-name:var(--font-ibm-plex-mono)]">
            Posted {new Date(review.created_at).toLocaleString()}
          </p>
        </div>
        <Link
          href="/reviews"
          className="text-[var(--accent-primary)] text-sm font-[family-name:var(--font-space-grotesk)] underline underline-offset-4"
        >
          Back to reviews
        </Link>
      </div>

      <ReviewCard review={review} showContext />
    </div>
  );
}
