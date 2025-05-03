"use client"

import { useState, useEffect } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface QuantitySelectorProps {
  initialValue?: number;
  min?: number;
  max?: number;
  onChange?: (quantity: number) => void;
  controlledValue?: number;
}

export default function QuantitySelector({
  initialValue = 1,
  min = 1,
  max = 99,
  onChange,
  controlledValue,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialValue)
  
  // If controlled value is provided, use it
  useEffect(() => {
    if (controlledValue !== undefined) {
      setQuantity(controlledValue)
    }
  }, [controlledValue])

  const increment = () => {
    const newQuantity = Math.min(quantity + 1, max)
    setQuantity(newQuantity)
    onChange?.(newQuantity)
  }

  const decrement = () => {
    const newQuantity = Math.max(quantity - 1, min)
    setQuantity(newQuantity)
    onChange?.(newQuantity)
  }

  return (
    <div className="flex items-center">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="icon"
          onClick={decrement}
          disabled={quantity <= min}
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
        <Button 
          variant="outline" 
          size="icon" 
          onClick={increment} 
          disabled={quantity >= max}
          className="h-10 w-10 rounded-l-none"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase quantity</span>
        </Button>
      </motion.div>
    </div>
  )
}
