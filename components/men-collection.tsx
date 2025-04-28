import ProductCard from "@/components/product-card"

// Mock data for men's collection
const menProducts = [
  {
    id: "m1",
    name: "Classic Fit Oxford Shirt",
    price: 59.99,
    originalPrice: 79.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.6,
    reviewCount: 28,
  },
  {
    id: "m2",
    name: "Slim Fit Chinos",
    price: 69.99,
    originalPrice: 89.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.7,
    reviewCount: 32,
  },
  {
    id: "m3",
    name: "Casual Denim Jacket",
    price: 99.99,
    originalPrice: 129.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.8,
    reviewCount: 41,
  },
  {
    id: "m4",
    name: "Premium Cotton Polo",
    price: 49.99,
    originalPrice: 64.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.5,
    reviewCount: 24,
  },
]

export default function MenCollection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {menProducts.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
