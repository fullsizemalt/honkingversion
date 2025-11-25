/**
 * Custom hooks for Settings functionality
 * Provides reusable logic for settings components and operations
 */

import { useState, useCallback, useEffect } from 'react';
import type { SettingsComponentState, ValidationResult } from '@/types/settings';

/**
 * useSettingsState hook
 * Manages common settings component state (loading, saving, error, success)
 * Reduces duplicate state management across settings components
 */
export function useSettingsState() {
    const [state, setState] = useState<SettingsComponentState>({
        loading: true,
        saving: false,
        error: null,
        success: false
    });

    const setLoading = useCallback((loading: boolean) => {
        setState(prev => ({ ...prev, loading }));
    }, []);

    const setSaving = useCallback((saving: boolean) => {
        setState(prev => ({ ...prev, saving }));
    }, []);

    const setError = useCallback((error: string | null) => {
        setState(prev => ({ ...prev, error }));
    }, []);

    const setSuccess = useCallback((success: boolean) => {
        setState(prev => ({ ...prev, success }));
        if (success) {
            setTimeout(() => setSuccess(false), 3000);
        }
    }, []);

    return { ...state, setLoading, setSaving, setError, setSuccess };
}

/**
 * useFormValidation hook
 * Manages form validation logic with memoization
 */
export function useFormValidation<T extends Record<string, any>>(
    validators: Record<keyof T, (value: any) => string | null>
) {
    const validate = useCallback((data: T): ValidationResult => {
        const errors: Record<string, string> = {};
        let isValid = true;

        for (const [key, value] of Object.entries(data)) {
            const validator = validators[key as keyof T];
            if (validator) {
                const error = validator(value);
                if (error) {
                    errors[key] = error;
                    isValid = false;
                }
            }
        }

        return { isValid, errors };
    }, [validators]);

    return { validate };
}

/**
 * useFetch hook
 * Reusable data fetching with caching and error handling
 */
export function useFetch<T>(
    url: string,
    options?: RequestInit
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options?.headers
                    }
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const result = await response.json();
                if (isMounted) {
                    setData(result);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Unknown error');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [url, options]);

    const refetch = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [url, options]);

    return { data, loading, error, refetch };
}

/**
 * useLocalStorage hook
 * Manage component state with localStorage persistence
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
}

/**
 * useDebounce hook
 * Debounce values for API calls and expensive operations
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * useAsync hook
 * Manages async operations with error and loading states
 */
export function useAsync<T, E = string>(
    asyncFunction: () => Promise<T>,
    immediate = true
) {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<E | null>(null);

    const execute = useCallback(async () => {
        setStatus('pending');
        setData(null);
        setError(null);
        try {
            const response = await asyncFunction();
            setData(response);
            setStatus('success');
            return response;
        } catch (error) {
            setError(error as E);
            setStatus('error');
        }
    }, [asyncFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { execute, status, data, error };
}

/**
 * useBoolean hook
 * Simplified boolean state management with toggle
 */
export function useBoolean(initialValue = false) {
    const [value, setValue] = useState(initialValue);

    const toggle = useCallback(() => setValue(v => !v), []);
    const setTrue = useCallback(() => setValue(true), []);
    const setFalse = useCallback(() => setValue(false), []);

    return { value, toggle, setTrue, setFalse, setValue };
}

/**
 * usePrevious hook
 * Access previous value of a prop or state
 */
export function usePrevious<T>(value: T): T | undefined {
    const ref = useCallback(() => value, [value]);
    const prevRef = useCallback(ref, [ref]);

    useEffect(() => {
        prevRef();
    }, [prevRef]);

    return prevRef();
}

/**
 * useAsync hook combined with localStorage
 * Manages API calls with cached results
 */
export function useAsyncCached<T>(
    key: string,
    asyncFunction: () => Promise<T>,
    options?: { immediate?: boolean; ttl?: number }
) {
    const { immediate = true, ttl = 5 * 60 * 1000 } = options || {};
    const [cachedData, setCachedData] = useLocalStorage<{ data: T; timestamp: number } | null>(
        `cache_${key}`,
        null
    );

    const isCacheValid = useCallback(() => {
        if (!cachedData) return false;
        return Date.now() - cachedData.timestamp < ttl;
    }, [cachedData, ttl]);

    const { execute, status, data, error } = useAsync(asyncFunction, false);

    const load = useCallback(async () => {
        if (isCacheValid() && cachedData) {
            return cachedData.data;
        }

        const result = await execute();
        if (result) {
            setCachedData({ data: result, timestamp: Date.now() });
        }
        return result;
    }, [execute, isCacheValid, cachedData, setCachedData]);

    useEffect(() => {
        if (immediate) {
            load();
        }
    }, [immediate, load]);

    return {
        execute: load,
        status,
        data: cachedData?.data || data,
        error,
        invalidateCache: () => setCachedData(null)
    };
}
