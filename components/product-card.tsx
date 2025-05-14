"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  categories?: string[];
  price: number;
  images?: string[];
  discount_price?: number;
  stock?: number;
  is_published?: boolean;
  is_draft?: boolean;
  is_featured?: boolean;
  sizes?: string[];
  colors?: string[];
  is_new?: boolean;
  is_disabled?: boolean;
  rating?: number;
  reviewCount?: number;
  originalPrice?: number;
  isBestSeller?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  images = [],
  discount_price,
  is_new,
  rating,
  reviewCount,
  originalPrice,
  isBestSeller,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { addToCart, toggleCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Add first size and color as default when quick adding from product card
    const defaultSize = "M";
    const defaultColor = "Default";

    addToCart({
      id,
      name,
      price,
      discount_price,
      image: images && images.length > 0 ? images[0] : "/placeholder.svg",
      color: defaultColor,
      size: defaultSize,
      quantity: 1,
    });

    // Open cart sidebar
    toggleCart(true);

    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Added to wishlist",
      description: `${name} has been added to your wishlist.`,
    });
  };

  const image = images && images.length > 0 ? images[0] : "/placeholder.svg";
  const displayPrice =
    discount_price && discount_price > 0 ? discount_price : price;
  const displayOriginalPrice =
    discount_price && discount_price > 0 ? price : originalPrice;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(displayPrice);

  const formattedOriginalPrice = displayOriginalPrice
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(displayOriginalPrice)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${id}`} scroll={false}>
        <div
          className="product-card group relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Wishlist button - top right */}
            <motion.div
              className="absolute top-2 right-2 z-10"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
            >
              <Button
                size="icon"
                variant="secondary"
                className="rounded-full h-8 w-8 bg-white/80 hover:bg-white shadow-sm"
                onClick={handleAddToWishlist}
              >
                <Heart className="h-4 w-4 text-gray-700 hover:text-red-500" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </motion.div>

            {/* Tags */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {is_new && (
                <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                  New
                </span>
              )}
              {isBestSeller && (
                <span className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded">
                  Best Seller
                </span>
              )}
              {discount_price && (
                <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                  {Math.round(((price - discount_price) / price) * 100)}% OFF
                </span>
              )}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-medium text-sm sm:text-base line-clamp-1">
              {name}
            </h3>

            <div className="flex items-center gap-2 mt-1">
              {typeof rating === "number" && (
                <div className="flex items-center">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs ml-1">{rating}</span>
                </div>
              )}
              {typeof reviewCount === "number" && (
                <span className="text-xs text-gray-500">({reviewCount})</span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="font-semibold">{formattedPrice}</span>
              {formattedOriginalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>

            {/* Add to cart button */}
            <div className="mt-3">
              <motion.div
                className="w-full"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Cart</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
