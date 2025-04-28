import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CartSummary() {
  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>$189.97</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span>$15.20</span>
        </div>
      </div>

      <div className="border-t border-b py-4 mb-4">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>$205.17</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          <Input placeholder="Promo code" />
          <Button variant="outline">Apply</Button>
        </div>
      </div>

      <Button className="w-full" asChild>
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>

      <div className="mt-4 text-center">
        <Button variant="link" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
