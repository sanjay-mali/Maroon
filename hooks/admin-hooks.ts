"use client";

import { useState, useEffect } from 'react';
import { useApiData } from '@/hooks/use-api-data';
import dbService from '@/appwrite/database';

interface AdminCategory {
  id: string;
  name: string;
}

interface AdminProduct {
  $id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sizes: string[];
  colors: string[];
  categories: string[];
  images: string[];
  is_published?: boolean;
  is_draft?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  is_disabled?: boolean;
  discount_price?: number;
}

export function useAdminCategories() {
  const { data, loading, error } = useApiData<any[]>(
    async () => {
      const result = await dbService.getAllCategories(1, 100);
      return result?.documents || [];
    },
    {
      cacheKey: 'adminCategories',
      cacheTTL: 5 * 60 * 1000 // 5 minutes cache for admin categories
    }
  );
  
  const formattedCategories: AdminCategory[] = (data || []).map(cat => ({
    id: cat.id || cat.$id,
    name: cat.name
  }));
  
  return { 
    categories: formattedCategories, 
    loading, 
    error 
  };
}

export function useProductById(productId: string | undefined) {
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }
    
    const fetchProduct = async () => {
      setIsLoading(true);
      
      try {
        const result = await dbService.getProductById(productId);
        setProduct(result || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  return { product, isLoading, error };
}
