import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: "sarees",
    name: "Sarees",
    image: "/placeholder.svg?height=600&width=400",
    link: "/sarees",
  },
  {
    id: "lehengas",
    name: "Lehengas",
    image: "/placeholder.svg?height=600&width=400",
    link: "/lehengas",
  },
  {
    id: "kurtis",
    name: "Kurtis",
    image: "/placeholder.svg?height=600&width=400",
    link: "/kurtis",
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "/placeholder.svg?height=600&width=400",
    link: "/accessories",
  },
]

export default function CategorySection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={category.link} className="category-card">
          <div className="aspect-[3/4] relative overflow-hidden">
            <Image
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold">{category.name}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
