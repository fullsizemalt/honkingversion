import { getApiEndpoint } from './api';

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options;

    let url = getApiEndpoint(endpoint);

    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, value);
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type') && !(init.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const config: RequestInit = {
        ...init,
        headers,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
            // If JSON parsing fails, use status text
            errorMessage = response.statusText;
        }
        throw new ApiError(response.status, errorMessage);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const apiClient = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),

    put: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),

    patch: <T>(endpoint: string, body: unknown, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
        request<T>(endpoint, { ...options, method: 'DELETE' }),
};
