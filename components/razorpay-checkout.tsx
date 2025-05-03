"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { createRazorpayOrder, initializeRazorpayCheckout, verifyRazorpayPayment } from "@/lib/payment";

interface RazorpayCheckoutProps {
  userInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  isDisabled?: boolean;
  showTotal?: boolean;
}

export default function RazorpayCheckout({ 
  userInfo, 
  onSuccess, 
  onError, 
  isDisabled = false,
  showTotal = true
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { total, cart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  // Generate a unique receipt ID for this order
  const generateReceiptId = () => {
    return `order_rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  };

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Create a Razorpay order on the server
      const orderData = await createRazorpayOrder({
        amount: total,
        currency: "INR",
        receipt: generateReceiptId(),
        notes: {
          items: cart.length.toString(),
        },
      });

      // Step 2: Initialize Razorpay checkout
      const paymentData = await initializeRazorpayCheckout({
        name: "Maroon Fashion",
        description: `Payment for ${cart.length} item${cart.length > 1 ? 's' : ''}`,
        image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tag.jpg-laCUVXrnSbLBKUx1H4JbSJuUipZowa.jpeg",
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        prefill: {
          name: userInfo?.name || "",
          email: userInfo?.email || "",
          contact: userInfo?.phone || "",
        },
        theme: {
          color: "#800000",
        },
      });

      // Step 3: Verify payment with the server
      const verificationResponse = await verifyRazorpayPayment({
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_signature: paymentData.razorpay_signature,
      });

      if (verificationResponse.success) {
        // Payment verification successful
        toast({
          title: "Payment successful",
          description: "Your payment has been processed successfully",
        });
        
        // Call the success callback if provided (for checkout page flow)
        if (onSuccess) {
          onSuccess(paymentData);
        }
      }
    } catch (error: any) {
      console.error("Payment failed:", error);
      toast({
        title: "Payment failed",
        description: error.message || "An error occurred during payment. Please try again.",
        variant: "destructive",
      });
      
      // Call the error callback if provided
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading || cart.length === 0 || isDisabled} 
      className="w-full"
      size="lg"
    >
      {isLoading ? "Processing..." : showTotal ? `Pay ₹${total.toFixed(2)}` : "Make Payment"}
    </Button>
  );
}