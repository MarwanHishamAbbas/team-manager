import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timer if value changes before delay completes
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Re-run effect when value or delay changes

    return debouncedValue;
}

/**
 * Alternative hook that debounces a callback function
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @param deps - Dependencies array (like useCallback)
 * @returns The debounced callback function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number,
    deps: React.DependencyList = []
): T {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            // Clear existing timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // Set new timeout
            const newTimeoutId = setTimeout(() => {
                callback(...args);
                setTimeoutId(null);
            }, delay);

            setTimeoutId(newTimeoutId);
        },
        [callback, delay, ...deps]
    ) as T;

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    return debouncedCallback;
}
