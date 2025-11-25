'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export default function AnalyticsListener() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        trackEvent('page_view');
    }, [pathname, searchParams]);

    return null;
}
