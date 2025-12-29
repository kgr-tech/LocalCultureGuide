import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for debouncing a value
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for memoizing expensive computations
 * Similar to useMemo but with additional caching
 */
export function useCache<T>(key: string, factory: () => T): T {
  const cache = useRef<Map<string, T>>(new Map());

  if (!cache.current.has(key)) {
    cache.current.set(key, factory());
  }

  return cache.current.get(key)!;
}

/**
 * Custom hook for tracking component mount status
 * Useful for preventing state updates on unmounted components
 */
export function useIsMounted(): () => boolean {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return () => isMounted.current;
}
