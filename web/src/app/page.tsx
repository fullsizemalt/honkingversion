import PerformanceList from "@/components/PerformanceList";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="border-b-2 border-[#333] bg-[#0a0a0a] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative">
            {/* Sharp accent bar */}
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#ff6b35]" />

            <h1 className="font-[family-name:var(--font-space-grotesk)] text-5xl md:text-6xl font-bold text-[#f5f5f5] mb-3 uppercase tracking-tighter">
              HONKINGVERSION
            </h1>
            <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[#a0a0a0] uppercase tracking-wider">
              The definitive Goose performance archive
            </p>
          </div>

          {/* Stats bar */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="border border-[#333] p-4 hover:border-[#ff6b35] transition-colors">
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-3xl font-bold text-[#ff6b35]">230</div>
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[#a0a0a0] uppercase tracking-wider mt-1">Performances</div>
            </div>
            <div className="border border-[#333] p-4 hover:border-[#00d9ff] transition-colors">
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-3xl font-bold text-[#00d9ff]">23</div>
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[#a0a0a0] uppercase tracking-wider mt-1">Songs</div>
            </div>
            <div className="border border-[#333] p-4 hover:border-[#b565d8] transition-colors">
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-3xl font-bold text-[#b565d8]">15</div>
              <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[#a0a0a0] uppercase tracking-wider mt-1">Shows</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[#f5f5f5] uppercase tracking-tight">
            Recent Performances
          </h2>
          <div className="font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-[#a0a0a0] uppercase tracking-wider">
            Sorted by date
          </div>
        </div>
        <PerformanceList />
      </div>
    </div>
  );
}
