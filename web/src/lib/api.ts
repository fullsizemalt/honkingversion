/**
 * API utility for centralized API URL handling
 * Uses NEXT_PUBLIC_API_URL environment variable, defaults to localhost:8000
 */

export const getApiUrl = (): string => {
  // When running on the server (SSR/data fetching in Next.js) hit the docker
  // network URL directly. The browser should keep using the public URL.
  if (typeof window === 'undefined' && process.env.INTERNAL_API_URL) {
    return process.env.INTERNAL_API_URL;
  }

  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
};

export const getApiEndpoint = (path: string): string => {
  const baseUrl = getApiUrl();
  return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
};
