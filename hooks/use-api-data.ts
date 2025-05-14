"use client";

import { useState, useEffect, useCallback } from "react";

// In-memory cache for API responses
interface CacheItem<T> {
  data: T;
  timestamp: number;
  params: string;
}

const API_CACHE: Record<string, CacheItem<any>> = {};
// Separate product cache for global access across components
export const PRODUCTS_CACHE: Record<string, CacheItem<any>> = {};
const CACHE_TTL = 5 * 60 * 1000;

interface UseApiDataOptions {
  cacheKey: string;
  cacheTTL?: number; // milliseconds
  enabled?: boolean;
  params?: any;
  forceRefresh?: boolean;
}

export function useApiData<T>(
  fetchFn: (params?: any) => Promise<T>,
  options: UseApiDataOptions
) {
  const {
    cacheKey,
    cacheTTL = CACHE_TTL,
    enabled = true,
    params = {},
    forceRefresh = false,
  } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify(params);
  const fullCacheKey = `${cacheKey}:${paramsKey}`;

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use in-memory cache only
        if (!forceRefresh) {
          const cached = API_CACHE[fullCacheKey];
          if (
            cached &&
            Date.now() - cached.timestamp < cacheTTL &&
            cached.params === paramsKey
          ) {
            setData(cached.data);
            setLoading(false);
            return;
          }
        }

        // Otherwise, fetch fresh data
        const result = await fetchFn(params);
        const now = Date.now();
        API_CACHE[fullCacheKey] = { data: result, timestamp: now, params: paramsKey };
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enabled, fullCacheKey, fetchFn, cacheTTL, paramsKey, forceRefresh]);

  // Function to manually refetch data
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(params);
      const now = Date.now();
      API_CACHE[fullCacheKey] = { data: result, timestamp: now, params: paramsKey };
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [fetchFn, fullCacheKey, params, paramsKey]);

  return { data, loading, error, refetch };
}

// Helper function to manually clear cache
export function clearApiCache(cacheKey?: string) {
  if (cacheKey) {
    // Clear specific cache entries that start with the key
    Object.keys(API_CACHE).forEach((key) => {
      if (key.startsWith(`${cacheKey}:`)) {
        delete API_CACHE[key];
      }
    });
  } else {
    // Clear all cache
    Object.keys(API_CACHE).forEach((key) => {
      delete API_CACHE[key];
    });
  }
}
