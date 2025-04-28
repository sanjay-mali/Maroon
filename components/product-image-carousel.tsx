"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

// Mock data for product images
const productImages = [
  "/placeholder.svg?height=600&width=600",
  "/placeholder.svg?height=600&width=600",
  "/placeholder.svg?height=600&width=600",
  "/placeholder.svg?height=600&width=600",
  "/placeholder.svg?height=600&width=600",
]

export default function ProductImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextSlide = () => {
    setActiveIndex((current) => (current === productImages.length - 1 ? 0 : current + 1))
  }

  const prevSlide = () => {
    setActiveIndex((current) => (current === 0 ? productImages.length - 1 : current - 1))
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg border">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-square w-full h-full"
          >
            <Image
              src={productImages[activeIndex] || "/placeholder.svg"}
              alt={`Product image ${activeIndex + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous image</span>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next image</span>
          </Button>
        </motion.div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {productImages.map((image, index) => (
          <motion.button
            key={index}
            className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md border ${
              activeIndex === index ? "ring-2 ring-black" : ""
            }`}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  )
}
