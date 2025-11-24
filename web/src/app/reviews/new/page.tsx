'use client';

import PageHeader from '@/components/PageHeader';
import { ReviewComposer } from '@/components/reviews/ReviewComposer';

export default function NewReviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <PageHeader
        title="Write a Review"
        description="Share your take on a show or performance. Minimum 60 characters; keep it constructive."
        loggedInMessage="Your review will appear in the feed after saving."
      />
      <ReviewComposer />
    </div>
  );
}
