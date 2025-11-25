'use client';

import React from 'react';

export type VelocityType = 'fast' | 'rising' | 'steady' | 'declining';

interface VelocityBadgeProps {
    velocity: VelocityType;
    className?: string;
}

const velocityConfig = {
    fast: {
        icon: '🔥',
        label: 'Fast Rising',
        className: 'text-[#ff6b35] bg-[#ff6b35]/10 border-[#ff6b35]/30',
    },
    rising: {
        icon: '📈',
        label: 'Rising',
        className: 'text-[#1fc77b] bg-[#1fc77b]/10 border-[#1fc77b]/30',
    },
    steady: {
        icon: '💫',
        label: 'Steady',
        className: 'text-[#f7931e] bg-[#f7931e]/10 border-[#f7931e]/30',
    },
    declining: {
        icon: '📉',
        label: 'Cooling',
        className: 'text-[var(--text-tertiary)] bg-[var(--bg-muted)] border-[var(--border)]',
    }
};

export function VelocityBadge({ velocity, className = '' }: VelocityBadgeProps) {
    const config = velocityConfig[velocity] || velocityConfig.steady;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wide border ${config.className} ${className}`}>
            <span role="img" aria-label={config.label} className="text-xs">{config.icon}</span>
            {config.label}
        </span>
    );
}
