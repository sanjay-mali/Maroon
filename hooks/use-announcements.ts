"use client";

import { useApiData } from "@/hooks/use-api-data";
import dbService from "@/appwrite/database";

interface Announcement {
  $id: string;
  text: string;
  link?: string;
  isActive: boolean;
}

interface UseAnnouncementsOptions {
  enabled?: boolean;
}

export function useAnnouncements(options: UseAnnouncementsOptions = {}) {
  const { enabled = true } = options;

  const { data, loading, error } = useApiData(
    async () => {
      const result = await dbService.getAnnouncements();
      const announcements = result?.documents || [];
      return announcements as Announcement[];
    },
    {
      cacheKey: "announcements",
      enabled,
      cacheTTL: 5 * 60 * 1000, // 5 minutes cache for announcements
    }
  );

  return {
    announcements: data || [],
    loading,
    error,
  };
}
