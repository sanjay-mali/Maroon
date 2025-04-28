import ProductCard from "@/components/product-card"

// Mock data for women's collection
const womenProducts = [
  {
    id: "w1",
    name: "Floral Print Dress",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.7,
    reviewCount: 36,
  },
  {
    id: "w2",
    name: "High-Waisted Jeans",
    price: 69.99,
    originalPrice: 89.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.8,
    reviewCount: 42,
  },
  {
    id: "w3",
    name: "Oversized Knit Sweater",
    price: 64.99,
    originalPrice: 84.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.6,
    reviewCount: 29,
  },
  {
    id: "w4",
    name: "Tailored Blazer",
    price: 109.99,
    originalPrice: 139.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.9,
    reviewCount: 38,
  },
]

export default function WomenCollection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {womenProducts.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
