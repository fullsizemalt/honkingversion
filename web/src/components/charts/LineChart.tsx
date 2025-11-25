'use client'
import React from 'react'

type LineChartProps = {
  series: { label: string; values: number[]; color?: string }[]
  height?: number
  width?: number
  showDots?: boolean
}

export function LineChart({
  series,
  height = 160,
  width = 320,
  showDots = false,
}: LineChartProps) {
  if (!series.length) return null
  const allValues = series.flatMap((s) => s.values)
  const max = Math.max(...allValues)
  const min = Math.min(...allValues)
  const range = max === min ? 1 : max - min
  const count = Math.max(...series.map((s) => s.values.length))

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-hidden>
      {/* axes */}
      <line x1={0} y1={height - 1} x2={width} y2={height - 1} stroke="var(--border-subtle)" strokeWidth={1} />
      <line x1={1} y1={0} x2={1} y2={height} stroke="var(--border-subtle)" strokeWidth={1} />
      {series.map((s, idx) => {
        const color = s.color || `hsl(${(idx * 60) % 360}, 70%, 55%)`
        const pts = s.values.map((v, i) => {
          const x = (i / Math.max(count - 1, 1)) * (width - 4) + 2
          const y = height - ((v - min) / range) * (height - 4) - 2
          return `${x},${y}`
        })
        return (
          <g key={s.label}>
            <polyline
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pts.join(' ')}
            />
            {showDots && s.values.map((v, i) => {
              const x = (i / Math.max(count - 1, 1)) * (width - 4) + 2
              const y = height - ((v - min) / range) * (height - 4) - 2
              return <circle key={`${s.label}-${i}`} cx={x} cy={y} r={3} fill={color} />
            })}
          </g>
        )
      })}
    </svg>
  )
}
