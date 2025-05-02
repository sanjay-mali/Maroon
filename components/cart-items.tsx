"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import QuantitySelector from "@/components/quantity-selector"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { useShopItemActions, ShopItem } from "@/components/hooks/use-shop-item-actions"

// Mock data for cart items
const initialCartItems: ShopItem[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    price: 49.99,
    image: "/placeholder.svg?height=200&width=200",
    color: "Black",
    size: "M",
    quantity: 1,
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    price: 79.99,
    image: "/placeholder.svg?height=200&width=200",
    color: "Blue",
    size: "32",
    quantity: 1,
  },
  {
    id: "3",
    name: "Casual Hoodie",
    price: 59.99,
    image: "/placeholder.svg?height=200&width=200",
    color: "Gray",
    size: "L",
    quantity: 1,
  },
]

export default function CartItems() {
  const [cartItems, setCartItems] = useState<ShopItem[]>(initialCartItems)
  const { removeItem } = useShopItemActions(setCartItems, "cart")

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {cartItems.map((item) => (
          <motion.div
            key={item.id}
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
                  <div className="font-medium mt-1">${item.price.toFixed(2)}</div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 mt-4 sm:mt-0">
                  <div className="w-32">
                    <QuantitySelector />
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeItem(item.id)}
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
