import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-[#333] bg-[#0a0a0a] py-4 mt-8">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[#a0a0a0] text-xs font-[family-name:var(--font-ibm-plex-mono)]">
                <div className="flex space-x-4 mb-2 md:mb-0">
                    <Link href="/shows" className="hover:text-[#ff6b35] transition-colors">Shows</Link>
                    <Link href="/songs" className="hover:text-[#ff6b35] transition-colors">Songs</Link>
                    <Link href="/lists" className="hover:text-[#ff6b35] transition-colors">Lists</Link>
                    <Link href="/attribution" className="hover:text-[#ff6b35] transition-colors">Attribution</Link>
                </div>
                <div>
                    © {new Date().getFullYear()} Honkingversion.net – All rights reserved.
                </div>
            </div>
        </footer>
    );
}
