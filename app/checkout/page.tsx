"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";
import ShippingAddressForm, { AddressFormValues } from "@/components/shipping-address-form";
import RazorpayCheckout from "@/components/razorpay-checkout";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CartSummary from "@/components/cart-summary";
import EmptyCart from "@/components/empty-cart";
import dbService from "@/appwrite/database";
import authService from "@/appwrite/authService";

export default function CheckoutPage() {
  const [step, setStep] = useState<"address" | "payment">("address");
  const [isLoading, setIsLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<AddressFormValues | null>(null);
  const { toast } = useToast();
  const { cart, total, clearCart } = useCart();
  const { authStatus } = useAuth();
  const router = useRouter();

  // Handle submission of shipping address
  const handleAddressSubmit = (values: AddressFormValues) => {
    setShippingAddress(values);
    setStep("payment");
    
    // Scroll to top when moving to payment
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentData: any) => {
    if (!shippingAddress) {
      toast({
        title: "Error",
        description: "Shipping address is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Get current user if logged in
      const user = authStatus ? await authService.getCurrentUser() : null;
      const userId = user ? user.$id : null;
      
      // Prepare items data - convert to JSON string to avoid nested array issues with Appwrite
      const itemsData = JSON.stringify(cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        discount_price: item.discount_price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        image: item.image,
      })));

      // Convert shipping address to JSON string
      const shippingAddressData = JSON.stringify({
        fullName: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      });

      // Convert payment details to JSON string
      const paymentDetailsData = JSON.stringify({
        paymentId: paymentData.razorpay_payment_id,
        orderId: paymentData.razorpay_order_id,
        signature: paymentData.razorpay_signature,
        method: "razorpay",
      });

      // Calculate amount details
      const subtotal = cart.reduce(
        (sum, item) => sum + (item.discount_price || item.price) * item.quantity,
        0
      );
      const shipping = 0;
      const tax = total * 0.18;

      // Convert amount to JSON string
      const amountData = JSON.stringify({
        subtotal,
        shipping,
        tax,
        total,
      });
      
      // Create order data with all nested objects as JSON strings
      const orderData = {
        userId: userId,
        itemsJson: itemsData,
        itemsCount: cart.length,
        shippingAddressJson: shippingAddressData,
        paymentDetailsJson: paymentDetailsData,
        amountJson: amountData,
        status: "Processing",
        createdAt: new Date().toISOString(),
      };
      
      // Save order to Appwrite
      const order = await dbService.createOrder(orderData);
      
      // Clear cart and redirect to success page
      clearCart();
      
      // Redirect to success page with order ID
      router.push(`/success?orderId=${order.$id}`);
      
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your order. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment error
  const handlePaymentError = (error: any) => {
    toast({
      title: "Payment Failed",
      description: error.message || "There was a problem processing your payment",
      variant: "destructive",
    });
    setStep("payment");
  };

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            href="/cart" 
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Cart
          </Link>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main checkout area */}
          <div className="flex-1">
            {step === "address" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ShippingAddressForm 
                  onSubmit={handleAddressSubmit}
                  defaultValues={shippingAddress || undefined}
                  isLoading={isLoading}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-6">Payment</h2>
                
                {/* Shipping address summary */}
                <div className="mb-6 p-4 border rounded-md bg-gray-50">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Shipping Address</h3>
                    <button 
                      onClick={() => setStep("address")}
                      className="text-sm text-primary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-700">{shippingAddress?.fullName}</p>
                  <p className="text-sm text-gray-700">{shippingAddress?.addressLine1}</p>
                  {shippingAddress?.addressLine2 && (
                    <p className="text-sm text-gray-700">{shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-sm text-gray-700">
                    {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postalCode}
                  </p>
                  <p className="text-sm text-gray-700">{shippingAddress?.country}</p>
                  <p className="text-sm text-gray-700 mt-2">
                    {shippingAddress?.email} | {shippingAddress?.phone}
                  </p>
                </div>
                
                {/* Payment method */}
                <div>
                  <h3 className="font-medium mb-4">Payment Method</h3>
                  
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center">
                      <input 
                        id="razorpay" 
                        name="paymentMethod" 
                        type="radio" 
                        className="h-4 w-4 text-primary border-gray-300" 
                        defaultChecked 
                      />
                      <label htmlFor="razorpay" className="ml-3 block text-sm font-medium text-gray-700">
                        Razorpay (Credit/Debit Card, UPI, Netbanking)
                      </label>
                    </div>
                    
                    <div className="mt-6">
                      <RazorpayCheckout
                        userInfo={{
                          name: shippingAddress?.fullName,
                          email: shippingAddress?.email,
                          phone: shippingAddress?.phone,
                        }}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Order summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <CartSummary isCheckoutPage />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}