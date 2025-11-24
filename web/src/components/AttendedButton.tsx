'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getApiEndpoint } from '@/lib/api';

interface AttendedButtonProps {
    showId: number;
}

export default function AttendedButton({ showId }: AttendedButtonProps) {
    const { data: session } = useSession();
    const [attended, setAttended] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkAttendance = async () => {
            const token = session?.user?.accessToken;
            if (!token) return;

            try {
                const res = await fetch(getApiEndpoint(`/attended/check/${showId}`), {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setAttended(data.attended);
                }
            } catch (error) {
                console.error('Failed to check attendance', error);
            }
        };

        checkAttendance();
    }, [session, showId]);

    const toggleAttendance = async () => {
        const token = session?.user?.accessToken;
        if (!token) return;

        setLoading(true);
        try {
            const method = attended ? 'DELETE' : 'POST';
            const res = await fetch(getApiEndpoint(`/attended/${showId}`), {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setAttended(!attended);
            }
        } catch (error) {
            console.error('Failed to toggle attendance', error);
        } finally {
            setLoading(false);
        }
    };

    if (!session) return null;

    return (
        <button
            onClick={toggleAttendance}
            disabled={loading}
            className={`border px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase transition-colors rounded-full ${attended
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-secondary)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'
                }`}
        >
            {loading ? 'Loading...' : attended ? '✓ I Was There!' : 'I Was There?'}
        </button>
    );
}
