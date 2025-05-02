import { useEffect, useState } from "react";
import ProductCard from "@/components/product-card";
import SkeletonProductCard from "@/components/skeleton-product-card";

// Mock data for featured collection
const featuredProducts = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    price: 49.99,
    originalPrice: 69.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.5,
    reviewCount: 24,
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.8,
    reviewCount: 36,
  },
  {
    id: "3",
    name: "Casual Hoodie",
    price: 59.99,
    originalPrice: 79.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.2,
    reviewCount: 18,
  },
  {
    id: "4",
    name: "Leather Jacket",
    price: 199.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.9,
    reviewCount: 42,
  },
];

export default function FeaturedCollection() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {featuredProducts.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
