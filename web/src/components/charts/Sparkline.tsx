'use client'
import React from 'react'

type SparklineProps = {
  values: number[]
  stroke?: string
  strokeWidth?: number
  height?: number
  width?: number
}

// Minimal sparkline for inline trend display
export function Sparkline({
  values,
  stroke = 'currentColor',
  strokeWidth = 2,
  height = 24,
  width = 80,
}: SparklineProps) {
  if (!values.length) return null
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max === min ? 1 : max - min
  const points = values.map((v, i) => {
    const x = (i / Math.max(values.length - 1, 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  })

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-hidden>
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(' ')}
      />
    </svg>
  )
}
