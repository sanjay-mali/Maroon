import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonProductDetail() {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-16">
      {/* Product Images Skeleton */}
      <div>
        <Skeleton className="aspect-square w-full rounded-lg mb-4" />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="aspect-square w-20 flex-shrink-0 rounded-md" />
          ))}
        </div>
      </div>

      {/* Product Info Skeleton */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-3/4" />

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="mt-2">
          <Skeleton className="h-7 w-20" />
        </div>

        <div className="mt-4">
          <Skeleton className="h-4 w-16 mb-2" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-8 h-8 rounded-full" />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <Skeleton className="h-4 w-16 mb-2" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="min-w-[3rem] h-10 rounded-md" />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  )
}
