import { Suspense } from 'react';
import PerformanceComparisonsContent from './PerformanceComparisonsContent';

export default function PerformanceComparisonsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-[#a0a0a0]">Loading...</div>}>
            <PerformanceComparisonsContent />
        </Suspense>
    );
}
