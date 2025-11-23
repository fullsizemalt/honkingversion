import { Review } from '@/types';
import ReviewCard from './ReviewCard';

interface ActivityFeedProps {
    activities: Review[];
    title?: string;
}

export default function ActivityFeed({ activities, title = "Recent Activity" }: ActivityFeedProps) {
    return (
        <div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[#f5f5f5] mb-4 uppercase tracking-tight">
                {title}
            </h3>
            <div className="space-y-4">
                {activities.map((activity) => (
                    <ReviewCard key={activity.id} review={activity} showContext={true} />
                ))}
                {activities.length === 0 && (
                    <div className="p-8 border border-[#333] border-dashed text-center">
                        <p className="text-[#707070] font-[family-name:var(--font-ibm-plex-mono)] text-sm">
                            No activity yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
