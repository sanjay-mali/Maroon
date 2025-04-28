import Image from "next/image"

// Mock data for order items
const orderItems = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    price: 49.99,
    image: "/placeholder.svg?height=80&width=80",
    color: "Black",
    size: "M",
    quantity: 1,
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    price: 79.99,
    image: "/placeholder.svg?height=80&width=80",
    color: "Blue",
    size: "32",
    quantity: 1,
  },
  {
    id: "3",
    name: "Casual Hoodie",
    price: 59.99,
    image: "/placeholder.svg?height=80&width=80",
    color: "Gray",
    size: "L",
    quantity: 1,
  },
]

export default function OrderSummary() {
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div>
      <h3 className="font-medium mb-3">Order Items</h3>
      <div className="space-y-4 mb-6">
        {orderItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded-md" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">
                {item.color}, {item.size} × {item.quantity}
              </div>
            </div>
            <div className="font-medium">${item.price.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium text-base pt-2 border-t">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
