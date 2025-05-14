import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card";
import SkeletonProductCard from "@/components/skeleton-product-card";
import { useProducts } from "@/hooks/use-products";

interface SimilarProductsProps {
  productId: string;
  categoryIds?: string[];
}

export default function SimilarProducts({
  productId,
  categoryIds = [],
}: SimilarProductsProps) {
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
    // Use our optimized hook for fetching products
  const { products, loading: productsLoading } = useProducts({
    categoryId: categoryIds.length > 0 ? categoryIds[0] : undefined, 
    limit: 8,
    enabled: !!productId
  });
  
  // Process the results to get similar products
  useEffect(() => {
    if (!productsLoading && products.length > 0) {
      // Exclude the current product and take up to 4
      setSimilar(
        products.filter(p => (p.$id || p.id) !== productId).slice(0, 4)
      );
      setLoading(false);
    } else if (!productsLoading) {
      setSimilar([]);
      setLoading(false);
    }
  }, [products, productsLoading, productId]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
      </div>
    );
  }
  if (!similar.length) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {similar.map((product) => (
        <ProductCard key={product.$id || product.id} {...product} />
      ))}
    </div>
  );
}
