"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const sizes = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
  { id: "xxl", label: "XXL" },
]

export default function SizeSelector() {
  const [selectedSize, setSelectedSize] = useState("m")

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
          onClick={() => setSelectedSize(size.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {size.label}
        </motion.button>
      ))}
    </div>
  )
}
