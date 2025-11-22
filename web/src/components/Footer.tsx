import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-[#333] bg-[#0a0a0a] py-6 mt-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Navigation Links */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        <Link href="/shows" className="text-[#a0a0a0] hover:text-[#ff6b35] transition-colors text-xs font-[family-name:var(--font-ibm-plex-mono)]">Shows</Link>
                        <Link href="/songs" className="text-[#a0a0a0] hover:text-[#ff6b35] transition-colors text-xs font-[family-name:var(--font-ibm-plex-mono)]">Songs</Link>
                        <Link href="/lists" className="text-[#a0a0a0] hover:text-[#ff6b35] transition-colors text-xs font-[family-name:var(--font-ibm-plex-mono)]">Lists</Link>
                        <Link href="/attribution" className="text-[#a0a0a0] hover:text-[#ff6b35] transition-colors text-xs font-[family-name:var(--font-ibm-plex-mono)]">Attribution</Link>
                    </div>
                    <div className="text-[#a0a0a0] text-xs font-[family-name:var(--font-ibm-plex-mono)]">
                        © {new Date().getFullYear()} Honkingversion.net
                    </div>
                </div>

                {/* Attribution Notice */}
                <div className="border-t border-[#333] pt-4">
                    <div className="text-[#707070] text-[10px] font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wider">
                        Data provided by <a href="https://elgoose.net" target="_blank" rel="noopener noreferrer" className="text-[#ff6b35] hover:underline">El Goose</a>
                        {' • '}
                        <Link href="/attribution" className="text-[#ff6b35] hover:underline">See full attribution and usage policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
