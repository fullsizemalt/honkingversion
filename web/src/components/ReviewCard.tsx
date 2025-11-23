import Link from 'next/link';
import { Review } from '@/types';

interface ReviewCardProps {
    review: Review;
    showContext?: boolean; // If true, show "Review for [Show/Song]"
}

export default function ReviewCard({ review, showContext = false }: ReviewCardProps) {
    const date = new Date(review.created_at).toLocaleDateString();

    return (
        <div className="border border-[#333] bg-[#1a1a1a] p-4 hover:border-[#00d9ff] transition-colors group">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#333] rounded-full flex items-center justify-center">
                        <span className="font-[family-name:var(--font-space-grotesk)] text-xs text-[#f5f5f5] uppercase">
                            {review.user.username.slice(0, 2)}
                        </span>
                    </div>
                    <div>
                        <Link href={`/u/${review.user.username}`} className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#f5f5f5] hover:text-[#00d9ff] transition-colors">
                            {review.user.username}
                        </Link>
                        <div className="text-[10px] text-[#707070] font-[family-name:var(--font-ibm-plex-mono)]">
                            {date}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[#00d9ff]">
                        {review.rating}
                    </span>
                    <span className="text-[#707070] text-xs">/10</span>
                </div>
            </div>

            import TagBadge from './TagBadge';

            // ...

            {showContext && (review.show || review.performance) && (
                <div className="mb-3 pb-3 border-b border-[#333]">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <span className="text-[#707070] text-xs uppercase tracking-wider mr-2">Reviewing:</span>
                            {review.show ? (
                                <Link href={`/shows/${review.show.date}`} className="text-[#f5f5f5] hover:text-[#00d9ff] font-[family-name:var(--font-space-grotesk)]">
                                    {review.show.date} @ {review.show.venue}
                                </Link>
                            ) : (
                                <Link href={`/songs/${review.performance?.song.slug}`} className="text-[#f5f5f5] hover:text-[#00d9ff] font-[family-name:var(--font-space-grotesk)]">
                                    {review.performance?.song.name} ({review.performance?.show.date})
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Tags Display */}
                    {(review.performance?.tags && review.performance.tags.length > 0) && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {review.performance.tags.map(tag => (
                                <TagBadge key={tag.id} tag={tag} />
                            ))}
                        </div>
                    )}
                    {(review.show?.tags && review.show.tags.length > 0) && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {review.show.tags.map(tag => (
                                <TagBadge key={tag.id} tag={tag} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {review.blurb && (
                <p className="text-[#a0a0a0] text-sm mb-2 italic">
                    "{review.blurb}"
                </p>
            )}

            {review.full_review && (
                <p className="text-[#f5f5f5] text-sm leading-relaxed">
                    {review.full_review}
                </p>
            )}
        </div>
    );
}
