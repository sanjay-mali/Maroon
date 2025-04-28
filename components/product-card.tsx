"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { addToWishlist, removeFromWishlist } from "@/lib/appwrite"
import Image from "next/image"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"


interface ProductCardProps {
  $id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviewCount: number
  isNew?: boolean
  isBestSeller?: boolean
}

export default function ProductCard({ $id, name, price, originalPrice, images, rating, reviewCount, isNew, isBestSeller,}: ProductCardProps) {
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState(false)
  const { toast } = useToast()
  const userId = 'user-test'


  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    })
  }

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if(isInWishlist){
      const remove = await removeFromWishlist(userId, $id)
      if(remove){
        setIsInWishlist(false)
        toast({
          title: "Removed from wishlist",
          description: `${name} has been removed from your wishlist.`,
        })
      }
    }else{
      const add = await addToWishlist(userId, $id)
      if(add){
        setIsInWishlist(true)
        toast({
          title: "Added to wishlist",
          description: `${name} has been added to your wishlist.`,
        })
      }
    }
  }

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)

  const formattedOriginalPrice = originalPrice
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(originalPrice)
    : null
  
    useEffect(() => {
      //Check if the product is in the wishlist
    }, [isInWishlist]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Link href={`/products/${$id}`} scroll={false}>
        <div
          className="product-card group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-[3/4] overflow-hidden">
            <Image
            src={images && images.length > 0 ? images[0] : "/placeholder.svg"}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Quick action buttons */}
            <motion.div
              className="absolute inset-0 bg-black/5 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button size="icon" variant="secondary" className="rounded-full" onClick={handleAddToCart}>
                  <ShoppingBag className="h-4 w-4" />
                  <span className="sr-only">Add to cart</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button size="icon" variant="secondary" className="rounded-full" onClick={handleAddToWishlist}>
                  <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="sr-only">Add to wishlist</span>
                </Button>
              </motion.div>
            </motion.div>

            {/* Tags */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {isNew && <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">New</span>}
              {isBestSeller && (
                <span className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded">Best Seller</span>
              )}
              {originalPrice && (
                <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                  {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-medium text-sm sm:text-base line-clamp-1">{name}</h3>

            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs ml-1">{rating}</span>
              </div>
              <span className="text-xs text-gray-500">({reviewCount})</span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="font-semibold">{formattedPrice}</span>
              {formattedOriginalPrice && (
                <span className="text-sm text-gray-500 line-through">{formattedOriginalPrice}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
