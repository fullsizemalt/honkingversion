'use client';

import { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Tooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';
import { getApiEndpoint } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface HeatmapData {
    date: string;
    count: number;
    venue: string;
    show_id: number;
}

interface AttendanceHeatmapProps {
    username: string;
}

export default function AttendanceHeatmap({ username }: AttendanceHeatmapProps) {
    const [data, setData] = useState<HeatmapData[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(getApiEndpoint(`/profile/${username}/attendance/heatmap`));
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error('Failed to fetch heatmap data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username]);

    if (loading) {
        return <div className="animate-pulse h-32 bg-[var(--bg-muted)] rounded"></div>;
    }

    if (data.length === 0) {
        return (
            <div className="p-6 text-center border border-[var(--border-subtle)] border-dashed rounded text-[var(--text-tertiary)] text-sm">
                No attendance history yet.
            </div>
        );
    }

    // Calculate date range (last 365 days)
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);

    return (
        <div className="attendance-heatmap-container">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-primary)] mb-4">
                Attendance History
            </h3>
            <div className="overflow-x-auto pb-2">
                <div className="min-w-[600px]">
                    <CalendarHeatmap
                        startDate={startDate}
                        endDate={today}
                        values={data}
                        classForValue={(value) => {
                            if (!value) {
                                return 'color-empty';
                            }
                            return `color-scale-${Math.min(value.count, 4)}`;
                        }}
                        tooltipDataAttrs={(value: any) => {
                            if (!value || !value.date) {
                                return null;
                            }
                            return {
                                'data-tooltip-id': 'heatmap-tooltip',
                                'data-tooltip-content': `${value.date}: ${value.venue}`,
                            };
                        }}
                        onClick={(value) => {
                            if (value && value.show_id) {
                                router.push(`/shows/${value.date}`);
                            }
                        }}
                    />
                </div>
            </div>
            <Tooltip id="heatmap-tooltip" />

            <style jsx global>{`
                .attendance-heatmap-container .react-calendar-heatmap text {
                    font-size: 10px;
                    fill: var(--text-tertiary);
                    font-family: var(--font-ibm-plex-mono);
                }
                .attendance-heatmap-container .react-calendar-heatmap .color-empty {
                    fill: var(--bg-muted);
                }
                .attendance-heatmap-container .react-calendar-heatmap .color-scale-1 { fill: var(--accent-primary); opacity: 0.4; }
                .attendance-heatmap-container .react-calendar-heatmap .color-scale-2 { fill: var(--accent-primary); opacity: 0.6; }
                .attendance-heatmap-container .react-calendar-heatmap .color-scale-3 { fill: var(--accent-primary); opacity: 0.8; }
                .attendance-heatmap-container .react-calendar-heatmap .color-scale-4 { fill: var(--accent-primary); opacity: 1; }
                
                .attendance-heatmap-container .react-calendar-heatmap rect:hover {
                    stroke: var(--text-primary);
                    stroke-width: 1px;
                }
            `}</style>
        </div>
    );
}
