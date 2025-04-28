"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function QuantitySelector() {
  const [quantity, setQuantity] = useState(1)

  const increment = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  return (
    <div className="flex items-center">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="icon"
          onClick={decrement}
          disabled={quantity <= 1}
          className="h-10 w-10 rounded-r-none"
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease quantity</span>
        </Button>
      </motion.div>
      <motion.div
        className="flex-1 h-10 px-3 text-center flex items-center justify-center border-y"
        key={quantity}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.1 }}
      >
        {quantity}
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button variant="outline" size="icon" onClick={increment} className="h-10 w-10 rounded-l-none">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase quantity</span>
        </Button>
      </motion.div>
    </div>
  )
}
