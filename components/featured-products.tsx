import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data for featured products
const featuredProducts = [
  {
    id: "1",
    name: "Floral Print Maxi Dress",
    price: 2999,
    originalPrice: 4999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.8,
    reviewCount: 36,
  },
  {
    id: "2",
    name: "High-Waisted Skinny Jeans",
    price: 1999,
    originalPrice: 2999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.9,
    reviewCount: 42,
  },
  {
    id: "3",
    name: "Oversized Boyfriend Shirt",
    price: 1499,
    originalPrice: 2499,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.7,
    reviewCount: 28,
  },
  {
    id: "4",
    name: "Faux Leather Jacket",
    price: 3499,
    originalPrice: 4999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.9,
    reviewCount: 45,
  },
]

export default function FeaturedProducts() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Button asChild variant="outline" className="btn-outline">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    </div>
  )
}
