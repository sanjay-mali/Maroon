import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmptyCart() {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag className="h-12 w-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Looks like you haven't added anything to your cart yet. Browse our products and find something you'll love.
      </p>
      <Button asChild>
        <Link href="/products">Start Shopping</Link>
      </Button>
    </div>
  )
}
