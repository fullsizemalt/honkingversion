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
    const [error, setError] = useState<string | null>(null);

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
                setError('Could not update attendance');
            } finally {
                setLoading(false);
            }
        };

    if (!session) {
        return (
            <a
                href="/auth/signin"
                className="border-[var(--border)] border px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] inline-flex items-center gap-2"
            >
                Sign in to mark attendance
            </a>
        );
    }

    return (
        <div className="space-y-1">
            <button
                onClick={toggleAttendance}
                disabled={loading}
                className={`border px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase transition-colors ${attended
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-secondary)]'
                        : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]'
                    } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Loading...' : attended ? '✓ I Was There!' : 'I Was There?'}
            </button>
            {error && (
                <p className="text-[var(--accent-secondary)] text-xs font-[family-name:var(--font-ibm-plex-mono)]">
                    {error}
                </p>
            )}
        </div>
    );
}
