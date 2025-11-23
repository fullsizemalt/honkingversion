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
            if (!session?.accessToken) return;

            try {
                const res = await fetch(getApiEndpoint(`/attended/check/${showId}`), {
                    headers: {
                        'Authorization': `Bearer ${session.accessToken}`
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
        if (!session?.accessToken) return;

        setLoading(true);
        try {
            const method = attended ? 'DELETE' : 'POST';
            const res = await fetch(getApiEndpoint(`/attended/${showId}`), {
                method,
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`
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
            className={`border px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase transition-colors ${attended
                    ? 'border-[#ff6b35] bg-[#ff6b35] text-[#0a0a0a] hover:bg-[#f7931e]'
                    : 'border-[#333] text-[#a0a0a0] hover:border-[#ff6b35] hover:text-[#ff6b35]'
                }`}
        >
            {loading ? 'Loading...' : attended ? '✓ I Was There!' : 'I Was There?'}
        </button>
    );
}
