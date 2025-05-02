import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCategoryCard() {
  return (
    <div
      className="aspect-square flex items-center justify-center rounded-md shadow-sm border border-white/30 bg-gray-100 dark:bg-gray-800 animate-pulse"
      style={{ minWidth: 80, maxWidth: 90, minHeight: 60 }}
    >
      <Skeleton className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}
