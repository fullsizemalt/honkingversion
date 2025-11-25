'use client';

import React, { useId } from 'react';

export interface TrendDataPoint {
    timestamp: string;
    value: number;
    label?: string;
}

interface TrendChartProps {
    data: TrendDataPoint[];
    color?: string;
    height?: number;
    width?: number;
    showDots?: boolean;
    animated?: boolean;
    className?: string;
}

export function TrendChart({
    data,
    color = '#1fc77b', // Default positive green
    height = 60,
    width = 200,
    showDots = false,
    animated = true,
    className = '',
}: TrendChartProps) {
    const gradientId = useId();

    if (!data || data.length < 2) return null;

    // 1. Calculate scales
    const values = data.map(d => d.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    // Add some padding to the range so points aren't on the absolute edge
    const paddingY = height * 0.1;
    const effectiveHeight = height - paddingY * 2;

    const getX = (index: number) => (index / (data.length - 1)) * width;
    const getY = (value: number) => {
        const normalized = (value - minValue) / range;
        // Invert Y because SVG 0 is top
        return height - paddingY - (normalized * effectiveHeight);
    };

    const points = data.map((d, i) => ({ x: getX(i), y: getY(d.value) }));

    // 2. Generate Smooth Path (Catmull-Rom or simple Bezier)
    // Simple Bezier strategy: Control points based on previous/next points
    const generateSmoothPath = (pts: { x: number; y: number }[]) => {
        if (pts.length === 0) return '';
        let d = `M ${pts[0].x} ${pts[0].y}`;

        for (let i = 1; i < pts.length; i++) {
            const curr = pts[i];
            const prev = pts[i - 1];

            // Simple smoothing: control point X is halfway between
            const cp1x = prev.x + (curr.x - prev.x) / 2;
            const cp1y = prev.y;
            const cp2x = prev.x + (curr.x - prev.x) / 2;
            const cp2y = curr.y;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
        }
        return d;
    };

    const linePath = generateSmoothPath(points);

    // 3. Generate Area Path (close the loop)
    const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

    return (
        <div className={`trend-chart-container ${className}`} style={{ width, height }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} overflow="visible">
                <defs>
                    <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area Fill */}
                <path
                    d={areaPath}
                    fill={`url(#${gradientId})`}
                    className={animated ? 'animate-fade-in' : ''}
                    style={{ opacity: animated ? 0 : 1, animationFillMode: 'forwards' }}
                />

                {/* Line */}
                <path
                    d={linePath}
                    stroke={color}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={animated ? 'animate-draw-line' : ''}
                    strokeDasharray={1000} // Arbitrary large number for dash offset animation
                    strokeDashoffset={animated ? 1000 : 0}
                />

                {/* Dots */}
                {showDots && points.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="3"
                        fill={color}
                        className={animated ? 'animate-fade-in' : ''}
                        style={{ animationDelay: `${0.5 + (i * 0.05)}s` }}
                    />
                ))}
            </svg>

            <style jsx>{`
                .animate-draw-line {
                    animation: drawLine 1.5s ease-out forwards;
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out 0.5s forwards;
                }

                @keyframes drawLine {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes fadeIn {
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
