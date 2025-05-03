"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import QuantitySelector from "@/components/quantity-selector"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/context/CartContext"

export default function CartItems() {
  const { cart, removeFromCart, updateQuantity } = useCart()

  if (cart.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {cart.map((item) => (
          <motion.div
            key={`${item.id}-${item.color}-${item.size}`}
            className="flex flex-col sm:flex-row gap-4 border-b pb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-full sm:w-24 h-24 relative flex-shrink-0">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded-md" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <div>
                  <h3 className="font-medium">
                    <Link href={`/products/${item.id}`} className="hover:underline">
                      {item.name}
                    </Link>
                  </h3>
                  <div className="text-sm text-gray-500 mt-1">
                    <span>Color: {item.color}</span>
                    <span className="mx-2">|</span>
                    <span>Size: {item.size}</span>
                  </div>
                  <div className="font-medium mt-1">
                    {item.discount_price ? (
                      <div className="flex items-center gap-2">
                        <span>₹{item.discount_price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500 line-through">₹{item.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span>₹{item.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 mt-4 sm:mt-0">
                  <div className="w-32">
                    <QuantitySelector 
                      controlledValue={item.quantity}
                      onChange={(quantity) => updateQuantity(item.id, quantity)}
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      <span>Remove</span>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
