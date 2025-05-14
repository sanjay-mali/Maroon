"use client";

import React from "react";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CartSidebar() {
  const { 
    cart, 
    isCartOpen, 
    toggleCart, 
    subtotal, 
    itemCount, 
    removeFromCart,
    updateQuantity
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
          />

          {/* Sidebar */}
          <motion.div
            id="cart-sidebar"
            className="fixed right-0 top-0 z-50 h-full w-full sm:w-96 bg-white shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  <h2 className="font-medium">Your Cart ({itemCount})</h2>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => toggleCart(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Cart Content */}
              <ScrollArea className="flex-1 p-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-medium mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Looks like you haven't added any items to your cart yet.
                    </p>
                    <Button onClick={() => toggleCart(false)} asChild>
                      <Link href="/products">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div 
                        key={`${item.id}-${item.color}-${item.size}`}
                        className="flex gap-3 pb-4 border-b"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <Image 
                            src={item.image || "/placeholder.svg"} 
                            alt={item.name} 
                            fill 
                            className="object-cover rounded-md" 
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                          <p className="text-xs text-gray-500">
                            {item.color}, {item.size} | Qty: {item.quantity}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-medium text-sm">
                              ₹{(item.discount_price || item.price) * item.quantity}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-xs text-red-600 hover:text-red-700 p-0"
                              onClick={() => removeFromCart(item.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Shipping, taxes, and discounts calculated at checkout
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full" asChild>
                      <Link href="/checkout">
                        Checkout <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/cart">View Cart</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}