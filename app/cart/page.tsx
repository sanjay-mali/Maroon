"use client"

import { useState, useEffect } from "react"
import CartItems from "@/components/cart-items"
import CartSummary from "@/components/cart-summary"
import EmptyCart from "@/components/empty-cart"
import Footer from "@/components/footer"
import SkeletonCartItem from "@/components/skeleton-cart-item"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(true)
  // For demo purposes, let's assume we have items in the cart
  const hasItems = true

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.main
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Shopping Cart</h1>

        {isLoading ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <SkeletonCartItem key={index} />
                ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-2 mb-4">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                </div>
                <div className="border-t border-b py-4 mb-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full mb-4" />
                <div className="mt-4 text-center">
                  <Skeleton className="h-4 w-40 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        ) : hasItems ? (
          <motion.div
            className="grid lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="lg:col-span-2">
              <CartItems />
            </div>
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <EmptyCart />
          </motion.div>
        )}
      </div>
    </motion.main>
  )
}
