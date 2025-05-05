"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ChevronRight, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import dbService from "@/appwrite/database";
import { Skeleton } from "@/components/ui/skeleton";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Parse order data from JSON strings
  const parseOrderData = (orderData: any) => {
    try {
      // Create a copy of the order data to modify
      const parsedOrder = { ...orderData };

      // Parse items JSON string if it exists
      if (parsedOrder.itemsJson) {
        parsedOrder.items = JSON.parse(parsedOrder.itemsJson);
      }

      // Parse shipping address JSON string if it exists
      if (parsedOrder.shippingAddressJson) {
        parsedOrder.shippingAddress = JSON.parse(
          parsedOrder.shippingAddressJson
        );
      }

      // Parse payment details JSON string if it exists
      if (parsedOrder.paymentDetailsJson) {
        parsedOrder.paymentDetails = JSON.parse(parsedOrder.paymentDetailsJson);
      }

      // Parse amount JSON string if it exists
      if (parsedOrder.amountJson) {
        parsedOrder.amount = JSON.parse(parsedOrder.amountJson);
      }

      return parsedOrder;
    } catch (error) {
      console.error("Error parsing order data:", error);
      return orderData; // Return original data on error
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const orderData = await dbService.getOrderById(orderId);
        // Parse the JSON strings in the order data
        const parsedOrderData = parseOrderData(orderData);
        setOrder(parsedOrderData);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast({
          title: "Error",
          description: "Could not fetch order details. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, toast]);

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate estimated delivery date (5 days from order date)
  const getEstimatedDelivery = (dateString: string) => {
    const orderDate = new Date(dateString);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + 5);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return deliveryDate.toLocaleDateString(undefined, options);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center mb-8">
              <Skeleton className="h-16 w-16 rounded-full mb-4" />
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-48" />
            </div>

            <div className="space-y-4 mb-8">
              <Skeleton className="h-6 w-48" />
              <div className="flex justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 py-4">
                  <Skeleton className="h-20 w-20 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !order ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              We couldn't find any order with the provided ID. Please check your
              order history or contact customer support.
            </p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <motion.div
            className="bg-white rounded-lg shadow-sm p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center mb-8">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-1">Order Confirmed!</h1>
              <p className="text-gray-600">Thank you for your purchase</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="border-b pb-4">
                <h2 className="font-semibold mb-2">Order Information</h2>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{order.$id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Method:</span>
                  <span>Razorpay</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">
                    ₹{order.amount.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-b pb-4">
                <h2 className="font-semibold mb-2">Shipping Information</h2>
                <p className="text-sm">
                  {order.shippingAddress.fullName}
                  <br />
                  {order.shippingAddress.addressLine1}
                  <br />
                  {order.shippingAddress.addressLine2 && (
                    <>
                      {order.shippingAddress.addressLine2}
                      <br />
                    </>
                  )}
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                  <br />
                  {order.shippingAddress.phone}
                </p>

                <div className="mt-4 bg-blue-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <Truck className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Estimated Delivery
                      </p>
                      <p className="text-sm text-blue-600">
                        {getEstimatedDelivery(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {order.items &&
                    order.items.map((item: any, index: number) => (
                      <div key={index} className="flex gap-4 py-4 border-b">
                        <div className="w-20 h-20 relative rounded bg-gray-100 overflow-hidden">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="flex gap-4 text-sm text-gray-600 mt-1">
                            {item.color && <span>Color: {item.color}</span>}
                            {item.size && <span>Size: {item.size}</span>}
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </span>
                            <span className="font-medium">
                              ₹
                              {(
                                (item.discount_price || item.price) *
                                item.quantity
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>₹{order.amount.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span>
                      {order.amount.shipping === 0
                        ? "Free"
                        : `₹${order.amount.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span>₹{order.amount.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total:</span>
                    <span>₹{order.amount.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild>
                <Link href="/products">
                  Continue Shopping
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href={`/${order.userId ? "account/orders" : ""}`}>
                  <Package className="mr-1 h-4 w-4" />
                  {order.userId ? "View Orders" : "Track Order"}
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
