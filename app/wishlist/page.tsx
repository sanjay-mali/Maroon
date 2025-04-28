"use client"

import { useState, useEffect } from "react";
import WishlistItems from "@/components/wishlist-items"
import EmptyWishlist from "@/components/empty-wishlist"
import Footer from "@/components/footer"
import SkeletonCartItem from "@/components/skeleton-cart-item"
import { motion } from "framer-motion"
import { getWishlist } from "@/lib/appwrite";

export default function WishlistPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistData = await getWishlist("user-test");
        setWishlist(wishlistData);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, []);


  return (
    <motion.main
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}  
    >
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Wishlist</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <SkeletonCartItem key={index} />
              ))}
          </div>
        ) : wishlist.length > 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <WishlistItems wishlistItems={wishlist} />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} >
            <EmptyWishlist />
          </motion.div>
        )}
      </div>
    </motion.main>
  )
}
