"use client";

import { useApiData } from "@/hooks/use-api-data";
import dbService from "@/appwrite/database";

interface Category {
  $id: string;
  name: string;
  description?: string;
  image?: string;
}

interface UseCategoriesOptions {
  enabled?: boolean;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const { enabled = true } = options;

  const { data, loading, error } = useApiData(
    async () => {
      const result = await dbService.getAllCategories();
      const categories = result?.documents || [];
      return categories as Category[];
    },
    {
      cacheKey: "categories",
      enabled,
      cacheTTL: 10 * 60 * 1000,
    }
  );

  return {
    categories: data || [],
    loading,
    error,
  };
}
