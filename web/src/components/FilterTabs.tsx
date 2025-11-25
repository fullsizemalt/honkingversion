'use client';

interface FilterTab {
    id: string;
    label: string;
}

interface FilterTabsProps {
    tabs: FilterTab[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export default function FilterTabs({ tabs, activeTab, onTabChange }: FilterTabsProps) {
    return (
        <div className="flex border-b border-[var(--border)] mb-6 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                        px-4 py-3 text-sm font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wider whitespace-nowrap transition-colors relative
                        ${activeTab === tab.id
                            ? 'text-[var(--text-primary)] font-bold'
                            : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                        }
                    `}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent-primary)]" />
                    )}
                </button>
            ))}
        </div>
    );
}
