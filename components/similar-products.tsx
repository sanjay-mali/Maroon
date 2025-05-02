import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card";
import SkeletonProductCard from "@/components/skeleton-product-card";
import dbService from "@/appwrite/database";

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

  useEffect(() => {
    const fetchSimilar = async () => {
      setLoading(true);
      try {
        let products: any[] = [];
        if (categoryIds.length > 0) {
          // Fetch products from the first category (or all categories and merge)
          const res = await dbService.getProductsByCategory(
            categoryIds[0],
            1,
            8
          );
          products = res?.documents || [];
        } else {
          // Fallback: fetch random products
          const res = await dbService.getAllProductsNotDisabled(1, 8);
          products = res?.documents || [];
        }
        // Exclude the current product
        setSimilar(
          products.filter((p) => (p.$id || p.id) !== productId).slice(0, 4)
        );
      } catch {
        setSimilar([]);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchSimilar();
  }, [productId, categoryIds]);

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
