"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dbService from "@/appwrite/database";
import ProductCard from "@/components/product-card";

export default function ProductsGrid() {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("category");
  const sort = searchParams.get("sort") || "featured";
  const selectedColors = (searchParams.get("color") || "")
    .split(",")
    .filter(Boolean);
  const selectedSizes = (searchParams.get("size") || "")
    .split(",")
    .filter(Boolean);
  const minPrice = Number(searchParams.get("minPrice")) || 500;
  const maxPrice = Number(searchParams.get("maxPrice")) || 10000;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering logic
  const filterProducts = (products: any[]) => {
    return products.filter((product) => {
      // Price filter
      const price = product.discount_price || product.price || 0;
      if (price < minPrice || price > maxPrice) return false;
      // Color filter (multi)
      if (
        selectedColors.length &&
        !selectedColors.some((color) =>
          (product.colors || [])
            .map((c: string) => c.toLowerCase())
            .includes(color.toLowerCase())
        )
      )
        return false;
      // Size filter (multi)
      if (
        selectedSizes.length &&
        !selectedSizes.some((size) =>
          (product.sizes || [])
            .map((s: string) => s.toLowerCase())
            .includes(size.toLowerCase())
        )
      )
        return false;
      return true;
    });
  };

  // Sorting logic
  const sortProducts = (products: any[]) => {
    switch (sort) {
      case "price-low":
        return [...products].sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
        return [...products].sort((a, b) => (b.price || 0) - (a.price || 0));
      case "newest":
        return [...products].sort((a, b) => {
          const aDate = new Date(a.$createdAt || a.createdAt || 0).getTime();
          const bDate = new Date(b.$createdAt || b.createdAt || 0).getTime();
          return bDate - aDate;
        });
      case "rating":
        return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "discount":
        return [...products].sort((a, b) => {
          const aDiscount =
            a.discount_price && a.price ? a.price - a.discount_price : 0;
          const bDiscount =
            b.discount_price && b.price ? b.price - b.discount_price : 0;
          return bDiscount - aDiscount;
        });
      default:
        return products;
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let result;
        if (categoryName) {
          // Fetch all categories and find the one with the matching name (decode URI and trim)
          const cats = await dbService.getAllCategories(1, 100);
          const decodedName = decodeURIComponent(categoryName)
            .trim()
            .toLowerCase();
          const match = cats.documents.find(
            (cat: any) => cat.name.trim().toLowerCase() === decodedName
          );
          if (match) {
            result = await dbService.getProductsByCategory(match.id, 1, 100); // fetch more for client filtering
          } else {
            result = { documents: [] };
          }
        } else {
          result = await dbService.getAllProductsNotDisabled(1, 100); // fetch more for client filtering
        }
        setProducts(result?.documents || []);
      } catch (err: any) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const filteredProducts = filterProducts(products);
  const sortedProducts = sortProducts(filteredProducts);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="py-12 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="py-12 text-center text-red-500">{error}</div>;
  }

  if (!products.length) {
    return (
      <div className="py-12 text-center text-gray-500">No products found.</div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.$id || product.id} {...product} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-end mt-8">
          <nav className="flex items-center gap-1">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-gray-200" : ""
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
