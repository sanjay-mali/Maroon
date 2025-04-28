import ProductCard from "@/components/product-card"

// Mock data for trending products
const trendingProducts = [
  {
    id: "5",
    name: "Oversized Sweater",
    price: 69.99,
    originalPrice: 89.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.7,
    reviewCount: 31,
  },
  {
    id: "6",
    name: "Cargo Pants",
    price: 89.99,
    originalPrice: 109.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.6,
    reviewCount: 27,
  },
  {
    id: "7",
    name: "Graphic Print T-Shirt",
    price: 39.99,
    originalPrice: 49.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.3,
    reviewCount: 22,
  },
  {
    id: "8",
    name: "Denim Jacket",
    price: 119.99,
    originalPrice: 149.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.8,
    reviewCount: 38,
  },
]

export default function TrendingProducts() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {trendingProducts.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
