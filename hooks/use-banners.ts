"use client";

import { useApiData } from "@/hooks/use-api-data";
import dbService from "@/appwrite/database";

interface Banner {
  $id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  link: string;
  type: "hero" | "sale";
  startDate: string;
  endDate: string;
  isActive: boolean;
  buttonText?: string;
  buttonLink?: string;
}

interface UseBannersOptions {
  type?: "hero" | "sale" | null;
  enabled?: boolean;
}

export function useBanners(options: UseBannersOptions = {}) {
  const { type = null, enabled = true } = options;

  const { data, loading, error } = useApiData(
    async (params) => {
      // Use server-side filtering when possible
      const result = await dbService.getBanners(params.type || undefined);
      const banners = result?.documents || [];
      return banners as Banner[];
    },
    {
      cacheKey: type ? `banners-${type}` : "banners",
      enabled,
      params: { type },
      cacheTTL: 5 * 60 * 1000, // 5 minutes cache for banners
    }
  );

  return {
    banners: data || [],
    loading,
    error,
  };
}
