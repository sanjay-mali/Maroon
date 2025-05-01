"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, Heart, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductReviews from "@/components/product-reviews";
import SimilarProducts from "@/components/similar-products";
import ColorSelector from "@/components/color-selector";
import SizeSelector from "@/components/size-selector";
import QuantitySelector from "@/components/quantity-selector";
import ProductImageCarousel from "@/components/product-image-carousel";
import dbService from "@/appwrite/database";
import { motion } from "framer-motion";
import SkeletonProductDetail from "@/components/skeleton-product-detail";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await dbService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <SkeletonProductDetail />;
  if (error || !product)
    return (
      <div className="container-custom py-16 text-center text-red-500">
        {error || "Product not found."}
      </div>
    );

  return (
    <>
      <div className="container-custom py-8">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/products" className="hover:underline">
            Products
          </Link>{" "}
          / {product.name}
        </div>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductImageCarousel images={product.images || []} />
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= (product.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-2">
              <span className="text-2xl font-bold">
                ₹
                {product.discount_price
                  ? product.discount_price.toLocaleString()
                  : product.price?.toLocaleString()}
              </span>
              {product.discount_price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹{product.price?.toLocaleString()}
                </span>
              )}
              {product.discount_price && product.price && (
                <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                  -
                  {Math.round(
                    100 - (product.discount_price / product.price) * 100
                  )}
                  %
                </span>
              )}
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Color</h3>
                <ColorSelector
                  colors={product.colors.map((c: any) =>
                    typeof c === "string" ? { id: c } : c
                  )}
                />
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Size</h3>
                  <button className="text-sm text-gray-500 hover:underline">
                    Size Guide
                  </button>
                </div>
                <SizeSelector
                  sizes={product.sizes.map((s: any) =>
                    typeof s === "string"
                      ? { id: s, label: s.toUpperCase() }
                      : s
                  )}
                />
              </div>
            )}

            {/* Quantity */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <QuantitySelector />
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1"
              >
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-light">
                  Add to Cart
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 w-full"
                >
                  <Heart size={16} />
                  <span>Add to Wishlist</span>
                </Button>
              </motion.div>
            </div>

            {/* Product Benefits */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-primary" />
                <span>Free shipping over ₹2,000</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={16} className="text-primary" />
                <span>7-day return policy</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" />
                <span>Authentic products</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Tabs defaultValue="description" className="mb-16">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details & Care</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p>{product.description || "No description available."}</p>
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-6">
              <div className="prose max-w-none">
                <h3>Materials</h3>
                <p>{product.materials || "-"}</p>
                <h3>Care Instructions</h3>
                <ul>
                  {product.careInstructions ? (
                    product.careInstructions
                      .split("\n")
                      .map((line: string, idx: number) => (
                        <li key={idx}>{line}</li>
                      ))
                  ) : (
                    <li>-</li>
                  )}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <ProductReviews productId={product.$id || product.id} />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Similar Products */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <SimilarProducts />
        </motion.div>
      </div>
    </>
  );
}
