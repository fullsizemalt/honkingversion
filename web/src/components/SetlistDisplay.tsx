'use client'

import { useState } from 'react'
import PerformanceVoteControl from './PerformanceVoteControl'

interface Performance {
    id: number
    song: {
        id: number
        name: string
        slug: string
    }
    position: number
    set_number: number
    notes?: string
}

interface SetlistDisplayProps {
    showId: number
    showDate: string
    performances: Performance[]
}

export default function SetlistDisplay({ showId, showDate, performances }: SetlistDisplayProps) {
    // Group performances by set
    const sets = performances.reduce((acc, perf) => {
        const setNum = perf.set_number || 1
        if (!acc[setNum]) acc[setNum] = []
        acc[setNum].push(perf)
        return acc
    }, {} as Record<number, Performance[]>)

    const setNames = ['Set 1', 'Set 2', 'Set 3', 'Encore']

    return (
        <div className="space-y-6">
            {Object.entries(sets).map(([setNum, setPerfs]) => (
                <div key={setNum} className="bg-[#1a1a1a] border border-[#333] p-6">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[#f5f5f5] mb-4 uppercase tracking-tight">
                        {setNames[parseInt(setNum) - 1] || `Set ${setNum}`}
                    </h3>
                    <div className="space-y-3">
                        {setPerfs.map((perf) => (
                            <div
                                key={perf.id}
                                className="flex items-center justify-between gap-4 p-3 bg-[#0a0a0a] border border-[#333] hover:border-[#00d9ff] transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#707070] w-6">
                                        {perf.position}
                                    </span>
                                    <span className="font-[family-name:var(--font-space-grotesk)] text-[#f5f5f5] font-medium">
                                        {perf.song.name}
                                    </span>
                                    {perf.notes && (
                                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[#a0a0a0] italic">
                                            {perf.notes}
                                        </span>
                                    )}
                                </div>
                                <PerformanceVoteControl
                                    performanceId={perf.id}
                                    songName={perf.song.name}
                                    compact={true}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
