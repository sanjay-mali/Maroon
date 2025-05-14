"use client";

import { useEffect, useState } from 'react';
import { useApiData } from '@/hooks/use-api-data';
import dbService from '@/appwrite/database';

interface UseSearchProductsOptions {
  categoryName?: string | null;
  search?: string | null;
  enabled?: boolean;
}

export function useSearchProducts(options: UseSearchProductsOptions = {}) {
  const { categoryName, search, enabled = true } = options;
  
  // Create a stable cache key based on search params
  const searchKey = search ? `search-${search}` : '';
  const categoryKey = categoryName ? `category-${categoryName}` : '';
  const cacheKey = `products-${categoryKey}-${searchKey}`.replace(/\s+/g, '-').toLowerCase();
  
  const { data, loading, error } = useApiData(
    async (params) => {
      let result;
      
      if (params.categoryName) {
        // Get products by category name
        const cats = await dbService.getAllCategories(1, 100);
        const decodedName = decodeURIComponent(params.categoryName)
          .trim()
          .toLowerCase();
        const match = cats.documents.find(
          (cat: any) => cat.name.trim().toLowerCase() === decodedName
        );
        
        if (match) {
          result = await dbService.getProductsByCategory(match.id, 1, 100);
        } else {
          result = { documents: [] };
        }
      } else {
        // Get all products
        result = await dbService.getAllProductsNotDisabled(1, 100);
      }
      
      const products = result?.documents || [];
      
      // If search query provided, filter products by name
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        return products.filter(
          (product: any) =>
            product.name.toLowerCase().includes(searchLower) ||
            (product.description && 
             product.description.toLowerCase().includes(searchLower))
        );
      }
      
      return products;
    },
    {
      cacheKey,
      cacheTTL: 5 * 60 * 1000, // 5 minutes cache
      enabled,
      params: { categoryName, search }
    }
  );
  
  return {
    products: data || [],
    loading,
    error
  };
}
