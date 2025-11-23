import React from 'react';
import PerformanceRow from '@/components/PerformanceRow';
import { Performance } from '@/types';

interface PerformanceTimelineProps {
    performances: Performance[];
}

export default function PerformanceTimeline({ performances }: PerformanceTimelineProps) {
    return (
        <div className="space-y-4">
            {performances.map((perf) => (
                <PerformanceRow key={perf.id} performance={perf} />
            ))}
        </div>
    );
}
