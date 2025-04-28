import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonProductCard() {
  return (
    <div className="rounded-lg overflow-hidden border bg-white">
      <div className="relative aspect-[3/4]">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}
