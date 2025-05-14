"use client";
import ProductCard from "@/components/product-card";
import SkeletonProductCard from "@/components/skeleton-product-card";
import { useProducts } from "@/hooks/use-products";

interface ProductListProps {
  filter?: "featured" | "new" | null;
  limit?: number;
  categoryId?: string;
}

export default function ProductList({
  filter = null,
  limit = 8,
  categoryId = null,
}: ProductListProps) {
  // Use our optimized hook instead of direct API calls
  const { products, loading, error } = useProducts({ 
    filter,
    limit,
    categoryId
  });

  if (loading)
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array(limit).fill(0).map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    );
  if (error)
    return <div className="py-12 text-center text-red-500">{error}</div>;
  if (!products.length)
    return (
      <div className="py-12 text-center text-gray-500">No products found.</div>
    );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.$id || product.id} {...product} />
      ))}
    </div>
  );
}
