'use client'

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
    performances: Performance[]
}

export default function SetlistDisplay({ performances }: SetlistDisplayProps) {
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
                <div key={setNum} className="bg-[var(--bg-secondary)] border border-[var(--border)] p-6 shadow-[0_25px_45px_rgba(20,20,20,0.08)]">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] mb-4 uppercase tracking-[0.35em]">
                        {setNames[parseInt(setNum) - 1] || `Set ${setNum}`}
                    </h3>
                    <div className="space-y-3">
                        {setPerfs.map((perf) => (
                            <div
                                key={perf.id}
                                className="flex items-center justify-between gap-4 p-4 bg-[var(--bg-muted)] border border-[var(--border-subtle)] hover:border-[var(--accent-tertiary)] hover:shadow-[0_20px_35px_rgba(17,17,26,0.08)] transition-all"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-tertiary)] w-8">
                                        {perf.position}
                                    </span>
                                    <span className="font-[family-name:var(--font-space-grotesk)] text-[var(--text-primary)] font-semibold">
                                        {perf.song.name}
                                    </span>
                                    {perf.notes && (
                                        <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs text-[var(--text-secondary)] italic">
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
