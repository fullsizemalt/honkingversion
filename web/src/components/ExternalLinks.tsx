import Link from 'next/link';

interface ExternalLinksProps {
  bandcamp_url?: string | null;
  nugs_url?: string | null;
}

export default function ExternalLinks({ bandcamp_url, nugs_url }: ExternalLinksProps) {
  if (!bandcamp_url && !nugs_url) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {bandcamp_url && (
        <a
          href={bandcamp_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/50 text-sm font-medium text-blue-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
          Bandcamp
        </a>
      )}
      {nugs_url && (
        <a
          href={nugs_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-900/30 hover:bg-orange-900/50 border border-orange-700/50 text-sm font-medium text-orange-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
          Nugs.tv
        </a>
      )}
    </div>
  );
}
