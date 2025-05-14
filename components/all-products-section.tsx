"use client";
import ProductCard from "@/components/product-card";
import SkeletonProductCard from "@/components/skeleton-product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useProducts } from "@/hooks/use-products";

interface AllProductsSectionProps {
  limit?: number;
}

export default function AllProductsSection({
  limit = 12,
}: AllProductsSectionProps) {
  // Use optimized hook for products data with stable cache key
  const { products, loading, error } = useProducts({ 
    limit, 
    // We're fetching all products so no filter needed
    filter: null,
    // This is a high traffic component, so we cache it longer
    enabled: true
  });

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center">All Products</h2>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array(limit)
            .fill(0)
            .map((_, i) => (
              <SkeletonProductCard key={i} />
            ))}
        </div>
      ) : error ? (
        <div className="py-12 text-center text-red-500">{error}</div>
      ) : !products.length ? (
        <div className="py-12 text-center text-gray-500">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.$id || product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}
