import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: "men",
    name: "Men",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "women",
    name: "Women",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "kids",
    name: "Kids",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "/placeholder.svg?height=300&width=300",
  },
]

export default function CategoryFilter() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.id}`}
          className="group relative overflow-hidden rounded-lg"
        >
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-xl font-bold">{category.name}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
