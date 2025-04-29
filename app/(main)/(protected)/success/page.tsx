import Link from "next/link"
import { CheckCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import OrderSummary from "@/components/order-summary"

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12 md:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Thank You for Your Order!</h1>
          <p className="text-gray-600">Your order #ORD12345 has been placed successfully.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="border-b pb-4 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">ORD12345</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Order Date:</span>
              <span className="font-medium">April 28, 2025</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">Credit Card (****1234)</span>
            </div>
          </div>

          <h3 className="font-medium mb-3">Shipping Address</h3>
          <p className="text-sm text-gray-600 mb-4">
            John Doe
            <br />
            123 Main Street
            <br />
            Apt 4B
            <br />
            New York, NY 10001
            <br />
            United States
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Package size={16} />
            <span>Estimated delivery: May 2 - May 5, 2025</span>
          </div>

          <OrderSummary />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/profile/orders">View Order History</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
