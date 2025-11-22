/**
 * API utility for centralized API URL handling
 * Uses NEXT_PUBLIC_API_URL environment variable, defaults to localhost:8000
 */

export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
};

export const getApiEndpoint = (path: string): string => {
  const baseUrl = getApiUrl();
  return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
};
