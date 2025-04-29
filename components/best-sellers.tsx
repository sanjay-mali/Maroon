import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data for best sellers
const bestSellers = [
  {
    id: "5",
    name: "Ribbed Crop Top",
    price: 899,
    originalPrice: 1499,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.9,
    reviewCount: 58,
    isBestSeller: true,
  },
  {
    id: "6",
    name: "Pleated Mini Skirt",
    price: 1299,
    originalPrice: 1999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.8,
    reviewCount: 47,
    isBestSeller: true,
  },
  {
    id: "7",
    name: "Wrap Midi Dress",
    price: 2499,
    originalPrice: 3499,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.7,
    reviewCount: 39,
    isBestSeller: true,
  },
  {
    id: "8",
    name: "Straight Leg Trousers",
    price: 1799,
    originalPrice: 2499,
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
