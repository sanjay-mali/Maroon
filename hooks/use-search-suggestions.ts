"use client";

import { useState, useEffect } from "react";
import { useApiData } from "@/hooks/use-api-data";
import dbService from "@/appwrite/database";

interface Product {
  $id: string;
  id?: string;
  name: string;
  images: string[];
  price: number;
  disabled?: boolean;
}

interface UseSearchSuggestionsResult {
  searchResults: Product[];
  loading: boolean;
  error: string | null;
  searchValue: string;
  setSearchValue: (value: string) => void;
  debouncedValue: string;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
}

export function useSearchSuggestions(
  initialValue: string = ""
): UseSearchSuggestionsResult {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const { data, loading, error } = useApiData<Product[]>(
    async () => {
      if (debouncedValue.trim().length === 0) {
        return [];
      }

      try {
        // Using existing service method with optimized parameters
        const res = await dbService.getAllProductsNotDisabled(1, 10);
        const docs = res?.documents || [];

        // Client-side filtering based on search term
        return docs.filter((p: Product) =>
          p.name?.toLowerCase().includes(debouncedValue.toLowerCase())
        ) as Product[];
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        return [];
      }
    },
    {
      cacheKey: "searchSuggestions",
      params: { query: debouncedValue },
      enabled: debouncedValue.length > 0,
      cacheTTL: 2 * 60 * 1000, // 2 minutes cache for search suggestions
    }
  );

  return {
    searchResults: data || [],
    loading,
    error,
    searchValue,
    setSearchValue,
    debouncedValue,
    showDropdown,
    setShowDropdown,
  };
}
