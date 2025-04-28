import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonCartItem() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 border-b pb-6">
      <Skeleton className="w-full sm:w-24 h-24 rounded-md flex-shrink-0" />

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div>
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-5 w-16" />
          </div>

          <div className="flex flex-col sm:items-end gap-2 mt-4 sm:mt-0">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
