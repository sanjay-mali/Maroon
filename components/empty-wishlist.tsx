import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmptyWishlist() {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        You haven't saved any items to your wishlist yet. Browse our products and click the heart icon to save items you
        love.
      </p>
      <Button asChild>
        <Link href="/products">Discover Products</Link>
      </Button>
    </div>
  )
}
