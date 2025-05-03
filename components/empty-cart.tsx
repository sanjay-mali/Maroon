"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"

export default function EmptyCart() {
  return (
    <motion.div 
      className="text-center py-16 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md mx-auto">
        <div className="mb-6 flex justify-center">
          <motion.div 
            className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ShoppingBag className="h-10 w-10 text-gray-400" />
          </motion.div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">
          Looks like you haven't added anything to your cart yet. Browse our products and discover something you'll love.
        </p>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button asChild className="px-8 min-w-[200px]">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
