"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface ColorSelectorProps {
  colors: { id: string; name?: string; value?: string }[]
}

export default function ColorSelector({ colors = [] }: ColorSelectorProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0]?.id || "")

  if (!colors.length) return null

  return (
    <div className="flex gap-2">
      {colors.map((color) => (
        <motion.button
          key={color.id}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            selectedColor === color.id ? "ring-2 ring-offset-2 ring-black" : ""
          }`}
          style={{ backgroundColor: color.value || color.id }}
          onClick={() => setSelectedColor(color.id)}
          aria-label={`Select ${color.name || color.id} color`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {selectedColor === color.id && (
            <motion.span
              className={`text-xs ${color.id === "white" ? "text-black" : "text-white"}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              ✓
            </motion.span>
          )}
        </motion.button>
      ))}
    </div>
  )
}
