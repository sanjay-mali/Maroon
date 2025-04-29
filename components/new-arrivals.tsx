import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data for new arrivals
const newArrivals = [
  {
    id: "9",
    name: "Puff Sleeve Blouse",
    price: 1299,
    originalPrice: 1999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.6,
    reviewCount: 12,
    isNew: true,
  },
  {
    id: "10",
    name: "Wide Leg Jeans",
    price: 1899,
    originalPrice: 2499,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.7,
    reviewCount: 8,
    isNew: true,
  },
  {
    id: "11",
    name: "Printed Slip Dress",
    price: 1599,
    originalPrice: 2299,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.5,
    reviewCount: 15,
    isNew: true,
  },
  {
    id: "12",
    name: "Cropped Cardigan",
    price: 999,
    originalPrice: 1499,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.4,
    reviewCount: 9,
    isNew: true,
  },
]

export default function NewArrivals() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {newArrivals.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Button asChild variant="outline" className="btn-outline">
          <Link href="/new-arrivals">View All New Arrivals</Link>
        </Button>
      </div>
    </div>
  )
}
