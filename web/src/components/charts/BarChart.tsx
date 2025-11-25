'use client';

import React from 'react';

interface BarChartProps {
    data: {
        label: string;
        value: number;
        color?: string;
        href?: string;
    }[];
    height?: number;
    barHeight?: number;
    gap?: number;
    showValue?: boolean;
    valueFormatter?: (value: number) => string;
}

export function BarChart({
    data,
    barHeight = 32,
    gap = 12,
    showValue = true,
    valueFormatter = (v) => v.toLocaleString(),
}: BarChartProps) {
    if (!data.length) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    const totalHeight = data.length * (barHeight + gap);

    return (
        <div className="w-full" style={{ height: totalHeight }}>
            {data.map((item, index) => {
                const widthPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                const top = index * (barHeight + gap);

                return (
                    <div
                        key={index}
                        className="relative flex items-center group"
                        style={{
                            height: barHeight,
                            marginBottom: gap,
                        }}
                    >
                        {/* Label Overlay (Left aligned) */}
                        <div className="absolute left-2 z-10 text-xs font-bold text-[var(--text-inverse)] drop-shadow-md pointer-events-none truncate max-w-[70%]">
                            {item.label}
                        </div>

                        {/* Bar Background */}
                        <div className="absolute inset-0 bg-[var(--bg-muted)] rounded-sm overflow-hidden w-full">
                            {/* Bar Fill */}
                            <div
                                className="h-full transition-all duration-500 ease-out rounded-sm relative"
                                style={{
                                    width: `${widthPercentage}%`,
                                    backgroundColor: item.color || 'var(--accent-primary)',
                                    minWidth: '2px'
                                }}
                            />
                        </div>

                        {/* Value Label (Right aligned) */}
                        {showValue && (
                            <div className="absolute right-2 z-10 text-xs font-mono text-[var(--text-secondary)]">
                                {valueFormatter(item.value)}
                            </div>
                        )}

                        {/* Interactive Link Overlay */}
                        {item.href && (
                            <a
                                href={item.href}
                                className="absolute inset-0 z-20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] rounded-sm"
                                aria-label={`${item.label}: ${valueFormatter(item.value)}`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
