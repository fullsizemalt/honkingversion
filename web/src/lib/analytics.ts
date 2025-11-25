import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'hv_analytics_session_id';

export const getSessionId = (): string => {
    if (typeof window === 'undefined') return '';

    const existing = localStorage.getItem(SESSION_KEY);
    const sessionId = existing ?? uuidv4();
    if (!existing) {
        localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
};

export const trackEvent = async (
    eventType: string,
    metadata?: Record<string, any>
) => {
    if (typeof window === 'undefined') return;

    const sessionId = getSessionId();
    const path = window.location.pathname;

    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include auth token if available, but for now we rely on session_id
                // 'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                event_type: eventType,
                path,
                metadata,
                session_id: sessionId,
            }),
        });
    } catch (error) {
        console.error('Failed to track event:', error);
    }
};
