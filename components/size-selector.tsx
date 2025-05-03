"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface SizeSelectorProps {
  sizes: { id: string; label?: string }[];
  onSelect?: (sizeId: string) => void;
  selectedSize?: string;
}

export default function SizeSelector({ 
  sizes = [], 
  onSelect,
  selectedSize: externalSelectedSize 
}: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState(externalSelectedSize || sizes[0]?.id || "")
  
  // Sync with external selected size if provided
  useEffect(() => {
    if (externalSelectedSize !== undefined) {
      setSelectedSize(externalSelectedSize);
    }
  }, [externalSelectedSize]);

  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId);
    onSelect?.(sizeId);
  };

  if (!sizes.length) return null

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <motion.button
          key={size.id}
          className={`min-w-[3rem] h-10 px-3 rounded-md border ${
            selectedSize === size.id
              ? "bg-black text-white border-black"
              : "bg-white text-black border-gray-300 hover:border-gray-400"
          }`}
          onClick={() => handleSizeSelect(size.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {size.label || size.id}
        </motion.button>
      ))}
    </div>
  )
}
