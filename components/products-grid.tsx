import ProductCard from "@/components/product-card"

// Mock data for products
const products = [
  {
    id: "1",
    name: "Banarasi Silk Saree",
    price: 8999,
    originalPrice: 12999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.8,
    reviewCount: 36,
  },
  {
    id: "2",
    name: "Designer Lehenga Choli",
    price: 15999,
    originalPrice: 21999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.9,
    reviewCount: 42,
  },
  {
    id: "3",
    name: "Embroidered Anarkali Suit",
    price: 6999,
    originalPrice: 9999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.7,
    reviewCount: 28,
  },
  {
    id: "4",
    name: "Zari Work Kanjivaram Saree",
    price: 12999,
    originalPrice: 18999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.9,
    reviewCount: 45,
  },
  {
    id: "5",
    name: "Bridal Lehenga Set",
    price: 24999,
    originalPrice: 34999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.9,
    reviewCount: 58,
  },
  {
    id: "6",
    name: "Patola Silk Saree",
    price: 18999,
    originalPrice: 25999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.8,
    reviewCount: 47,
  },
  {
    id: "7",
    name: "Designer Gown",
    price: 9999,
    originalPrice: 14999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.7,
    reviewCount: 39,
  },
  {
    id: "8",
    name: "Kundan Jewelry Set",
    price: 7999,
    originalPrice: 11999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.8,
    reviewCount: 42,
  },
  {
    id: "9",
    name: "Organza Saree with Blouse",
    price: 5999,
    originalPrice: 7999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.6,
    reviewCount: 12,
  },
  {
    id: "10",
    name: "Embellished Sharara Set",
    price: 8999,
    originalPrice: 11999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.7,
    reviewCount: 8,
  },
  {
    id: "11",
    name: "Printed Georgette Saree",
    price: 3999,
    originalPrice: 5999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.5,
    reviewCount: 15,
  },
  {
    id: "12",
    name: "Embroidered Dupatta",
    price: 1999,
    originalPrice: 2999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.4,
    reviewCount: 9,
  },
]

export default function ProductsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
