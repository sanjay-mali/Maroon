import ProductCard from "@/components/product-card"

// Mock data for similar products
const similarProducts = [
  {
    id: "13",
    name: "V-Neck T-Shirt",
    price: 39.99,
    originalPrice: 49.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.3,
    reviewCount: 18,
  },
  {
    id: "14",
    name: "Long Sleeve Henley",
    price: 54.99,
    originalPrice: 69.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.6,
    reviewCount: 22,
  },
  {
    id: "15",
    name: "Crew Neck Sweatshirt",
    price: 64.99,
    originalPrice: 79.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.7,
    reviewCount: 29,
  },
  {
    id: "16",
    name: "Polo Shirt",
    price: 44.99,
    originalPrice: 59.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.5,
    reviewCount: 24,
  },
]

export default function SimilarProducts() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {similarProducts.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
