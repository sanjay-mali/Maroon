"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/context/CartContext"
import { useState } from "react"
import RazorpayCheckout from "./razorpay-checkout"
import { useToast } from "./ui/use-toast"
import { useAuth } from "@/hooks/useAuth"
import authService from "@/appwrite/authService"
import { Separator } from "./ui/separator"

interface CartSummaryProps {
  isCheckoutPage?: boolean;
}

export default function CartSummary({ isCheckoutPage = false }: CartSummaryProps) {
  const { subtotal, shipping, tax, total, cart } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { authStatus } = useAuth()
  const { toast } = useToast()

  // Fetch user data for prefilling payment info if logged in
  useState(() => {
    const getUserData = async () => {
      if (!authStatus) {
        setIsLoading(false)
        return
      }
      
      try {
        const user = await authService.getCurrentUser()
        if (user) {
          setUserData({
            name: user.name,
            email: user.email,
            phone: user.$id // This should be replaced with actual phone number if available
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    getUserData()
  }, [authStatus])

  const handleApplyPromoCode = () => {
    // This is where you would implement promo code functionality
    toast({
      title: "Promo code applied",
      description: `Promo code "${promoCode}" has been applied to your order.`
    })
    setPromoCode("")
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          {shipping === 0 ? (
            <span className="text-green-600">Free</span>
          ) : (
            <span>₹{shipping.toFixed(2)}</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-b py-4 mb-4">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      {!isCheckoutPage && (
        <>
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <Input 
                placeholder="Promo code" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button 
                variant="outline" 
                onClick={handleApplyPromoCode} 
                disabled={!promoCode.trim()}
              >
                Apply
              </Button>
            </div>
          </div>

          <Button 
            className="w-full" 
            asChild 
            disabled={cart.length === 0}
          >
            <Link href={cart.length > 0 ? "/checkout" : "#"}>Proceed to Checkout</Link>
          </Button>

          <div className="text-center mt-4">
            <Button variant="link" asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </>
      )}

      {isCheckoutPage && (
        <div className="text-sm text-gray-500 mt-4">
          <p className="mb-2">
            By completing your purchase, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p>
            Please review your order details before proceeding with payment.
          </p>
        </div>
      )}
    </div>
  )
}
