"use client";

import { useApiData, PRODUCTS_CACHE } from "@/hooks/use-api-data";
import dbService from "@/appwrite/database";

// Helper function to prefetch products
export async function prefetchProducts(options: UseProductsOptions = {}) {
  const { filter = null, limit = 8, page = 1, categoryId = null } = options;

  try {
    let result;

    if (filter === "featured") {
      result = await dbService.getFeaturedProducts(page, limit);
    } else if (filter === "new") {
      result = await dbService.getNewProducts(page, limit);
    } else if (categoryId) {
      result = await dbService.getProductsByCategory(categoryId, page, limit);
    } else {
      result = await dbService.getAllProductsNotDisabled(page, limit);
    }

    const products = result && result.documents ? result.documents : [];

    const data = {
      products: products.map((p: any) => ({ id: p.$id || p.id, ...p })),
      total: result ? result.total : 0,
    };

    // Cache the result
    const cacheKey = categoryId
      ? `products-category-${categoryId}`
      : filter
      ? `products-${filter}`
      : "products";

    PRODUCTS_CACHE[
      `${cacheKey}:${JSON.stringify({ filter, limit, page, categoryId })}`
    ] = {
      data,
      timestamp: Date.now(),
      params: JSON.stringify({ filter, limit, page, categoryId }),
    };

    return data;
  } catch (error) {
    console.error("Error prefetching products:", error);
    throw error;
  }
}

interface UseProductsOptions {
  filter?: "featured" | "new" | null;
  limit?: number;
  page?: number;
  enabled?: boolean;
  categoryId?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const {
    filter = null,
    limit = 8,
    page = 1,
    enabled = true,
    categoryId = null,
  } = options;
  // Use the generic API data hook with specific product fetching logic
  const { data, loading, error } = useApiData(
    async (params) => {
      let result;

      // Get products with server-side filtering
      if (params.filter === "featured") {
        result = await dbService.getFeaturedProducts(params.page, params.limit);
      } else if (params.filter === "new") {
        result = await dbService.getNewProducts(params.page, params.limit);
      } else if (params.categoryId) {
        result = await dbService.getProductsByCategory(
          params.categoryId,
          params.page,
          params.limit
        );
      } else {
        result = await dbService.getAllProductsNotDisabled(
          params.page,
          params.limit
        );
      }

      // Process the results
      let products = result && result.documents ? result.documents : [];

      // Map $id to id for all products for consistency
      return {
        products: products.map((p: any) => ({ id: p.$id || p.id, ...p })),
        total: result ? result.total : 0,
      };
    },
    {
      cacheKey: categoryId
        ? `products-category-${categoryId}`
        : filter
        ? `products-${filter}`
        : "products",
      cacheTTL: 10 * 60 * 1000, // 10 minutes for products
      enabled,
      params: { filter, limit, page, categoryId },
    }
  );

  return {
    products: data?.products || [],
    total: data?.total || 0,
    loading,
    error,
  };
}
