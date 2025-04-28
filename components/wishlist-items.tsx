"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { getWishlist, removeFromWishlist } from "@/lib/appwrite"
import { Product } from "./product-form"

const userId = 'user-test'

export default function WishlistItems() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchWishlist = async () => {
      const data = await getWishlist(userId);
      setWishlistItems(data);
    };
    fetchWishlist()
  }, []);

  const removeItem = async (productId: string) => {
    await removeFromWishlist(userId, productId)
    setWishlistItems((items) => items.filter((item) => item.$id !== productId))
    toast({
      title: "Item removed",
      description: "The item has been removed from your wishlist.",
    })
  }
  
  const moveToCart = (id: string) => {
    toast({
      title: "Added to cart",
      description: "The item has been added to your cart.",
    })
    // In a real app, we would add to cart here before removing from wishlist
    removeItem(id)
  }

  return (
    <div>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {wishlistItems.map((item) => (
              <motion.div
                key={item.$id}
                className="flex gap-4 border rounded-lg p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-24 h-24 relative flex-shrink-0">
                  <Image src={item.images[0] || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded-md" />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium">
                    <Link href={`/products/${item.$id}`} className="hover:underline">
                      {item.name}
                    </Link>
                  </h3>
                  <div className="text-sm text-gray-500 mt-1">
                    {item.colors && item.colors.length > 0 && <span>Color: {item.colors[0]}</span>}
                    {item.colors && item.colors.length > 0 && item.sizes && item.sizes.length > 0 && <span className="mx-2">|</span>}
                    {item.sizes && item.sizes.length > 0 && <span>Size: {item.sizes[0]}</span>}
                  </div>
                  <div className="font-medium mt-1">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(item.price)}</div>

                  <div className="flex gap-2 mt-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="sm" className="h-8" onClick={() => moveToCart(item.$id)}>
                        <ShoppingBag className="h-4 w-4 mr-1" />
                        <span>Add to Cart</span>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.$id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span>Remove</span>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
