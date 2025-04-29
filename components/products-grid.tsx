import ProductCard from "@/components/product-card"

// Mock data for women's western wear products
const products = [
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
  {
    id: "5",
    name: "Ribbed Crop Top",
    price: 899,
    originalPrice: 1499,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.9,
    reviewCount: 58,
  },
  {
    id: "6",
    name: "Pleated Mini Skirt",
    price: 1299,
    originalPrice: 1999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.8,
    reviewCount: 47,
  },
  {
    id: "7",
    name: "Wrap Midi Dress",
    price: 2499,
    originalPrice: 3499,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.7,
    reviewCount: 39,
  },
  {
    id: "8",
    name: "Straight Leg Trousers",
    price: 1799,
    originalPrice: 2499,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.8,
    reviewCount: 42,
  },
  {
    id: "9",
    name: "Puff Sleeve Blouse",
    price: 1299,
    originalPrice: 1999,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.6,
    reviewCount: 12,
  },
  {
    id: "10",
    name: "Wide Leg Jeans",
    price: 1899,
    originalPrice: 2499,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.7,
    reviewCount: 8,
  },
  {
    id: "11",
    name: "Printed Slip Dress",
    price: 1599,
    originalPrice: 2299,
    image: "/placeholder.svg?height=600&width=400",
    rating: 4.5,
    reviewCount: 15,
  },
  {
    id: "12",
    name: "Cropped Cardigan",
    price: 999,
    originalPrice: 1499,
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
