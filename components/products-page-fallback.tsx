import React from "react";

export default function ProductsPageFallback() {
  return (
    <div className="container-custom py-8 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Skeleton */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-full bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
        {/* Products Skeleton */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-8 w-32 bg-gray-200 rounded" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg p-4 flex flex-col gap-2"
              >
                <div className="h-32 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
