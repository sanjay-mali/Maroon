"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card";
import dbService from "@/appwrite/database";

interface ProductListProps {
  filter?: "featured" | "new" | null;
  limit?: number;
}

export default function ProductList({
  filter = null,
  limit = 8,
}: ProductListProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await dbService.getAllProductsNotDisabled(1, limit);
        let filtered = result && result.documents ? result.documents : [];
        if (filter === "featured") {
          filtered = filtered.filter((p: any) => p.is_featured);
        } else if (filter === "new") {
          filtered = filtered.filter((p: any) => p.is_new);
        }
        // Map $id to id for all products
        filtered = filtered.map((p: any) => ({ id: p.$id || p.id, ...p }));
        setProducts(filtered);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filter, limit]);

  if (loading)
    return <div className="py-12 text-center">Loading products...</div>;
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
