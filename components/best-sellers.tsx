import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data for best sellers
const bestSellers = [
  {
    id: "5",
    name: "Bridal Lehenga Set",
    price: 24999,
    originalPrice: 34999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.9,
    reviewCount: 58,
    isBestSeller: true,
  },
  {
    id: "6",
    name: "Patola Silk Saree",
    price: 18999,
    originalPrice: 25999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.8,
    reviewCount: 47,
    isBestSeller: true,
  },
  {
    id: "7",
    name: "Designer Gown",
    price: 9999,
    originalPrice: 14999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.7,
    reviewCount: 39,
    isBestSeller: true,
  },
  {
    id: "8",
    name: "Kundan Jewelry Set",
    price: 7999,
    originalPrice: 11999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.8,
    reviewCount: 42,
    isBestSeller: true,
  },
]

export default function BestSellers() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {bestSellers.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Button asChild variant="outline" className="btn-outline">
          <Link href="/best-sellers">View All Best Sellers</Link>
        </Button>
      </div>
    </div>
  )
}
