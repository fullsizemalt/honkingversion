/**
 * API utility for centralized API URL handling
 * Uses NEXT_PUBLIC_API_URL environment variable, defaults to localhost:8000
 */

export const getApiUrl = (): string => {
  // Server-side (SSR / Next API routes) should talk to the internal Docker network
  if (typeof window === 'undefined') {
    if (process.env.INTERNAL_API_URL) {
      return process.env.INTERNAL_API_URL;
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  // In the browser, always route through our local proxy path so we avoid CORS/TLS drama.
  return process.env.NEXT_PUBLIC_BROWSER_API_URL || '/api/hv';
};

export const getApiEndpoint = (path: string): string => {
  const baseUrl = getApiUrl();
  return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
};
