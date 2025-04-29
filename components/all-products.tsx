import ProductCard from "@/components/product-card"

// Mock data for all products (a mix of featured, men's, and women's)
const allProducts = [
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
    id: "w2",
    name: "High-Waisted Jeans",
    price: 69.99,
    originalPrice: 89.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.8,
    reviewCount: 42,
  },
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
    id: "w3",
    name: "Oversized Knit Sweater",
    price: 64.99,
    originalPrice: 84.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.6,
    reviewCount: 29,
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
    id: "m4",
    name: "Premium Cotton Polo",
    price: 49.99,
    originalPrice: 64.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.5,
    reviewCount: 24,
  },
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
    id: "4",
    name: "Leather Jacket",
    price: 199.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=400&width=300",
    rating: 4.9,
    reviewCount: 42,
  },
]

export default function AllProducts() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {allProducts.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
