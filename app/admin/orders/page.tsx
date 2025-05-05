"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dbService from "@/appwrite/database";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, Package } from "lucide-react";
import { formatDistance } from "date-fns";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Parse JSON strings in order data to objects
  const parseOrderData = (orderData: any) => {
    try {
      // Create a copy of the order data
      const parsedOrder = { ...orderData };
      
      // Parse items JSON string if it exists
      if (parsedOrder.itemsJson) {
        parsedOrder.items = JSON.parse(parsedOrder.itemsJson);
      }
      
      // Parse shipping address JSON string if it exists
      if (parsedOrder.shippingAddressJson) {
        parsedOrder.shippingAddress = JSON.parse(parsedOrder.shippingAddressJson);
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

  // Fetch all orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        setIsLoading(true);
        const response = await dbService.getAllOrders();
        
        // Parse and sort orders by creation date (newest first)
        const sortedOrders = response.documents
          .map(parseOrderData)
          .sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [toast]);

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await dbService.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(orders.map(order => {
        if (order.$id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      }));
      
      // Update selected order if in detail view
      if (selectedOrder && selectedOrder.$id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  // View order details
  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  // Format date relative to current time
  const formatDate = (dateString: string) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };

  // Render status badge with appropriate color
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-yellow-500">Shipped</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Calculate total order value
  const calculateTotalOrders = () => {
    return orders.length;
  };

  // Calculate total revenue
  const calculateTotalRevenue = () => {
    return orders.reduce((total, order) => total + (order.amount?.total || 0), 0);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Customer Orders</h1>
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-xl font-bold">{isLoading ? "-" : calculateTotalOrders()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-xl font-bold">
              {isLoading ? "-" : `₹${calculateTotalRevenue().toFixed(2)}`}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Orders Yet</h3>
          <p className="mt-2 text-gray-500">When customers place orders, they'll appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.$id}>
                  <TableCell className="font-medium">{order.$id.slice(0, 8)}...</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    {order.shippingAddress?.fullName || "Guest"}
                  </TableCell>
                  <TableCell>{order.items?.length || 0} items</TableCell>
                  <TableCell>₹{order.amount?.total.toFixed(2) || "0.00"}</TableCell>
                  <TableCell>
                    {renderStatusBadge(order.status || "Processing")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => viewOrderDetails(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.$id}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Date Placed</p>
                  <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center gap-2">
                    <Select
                      defaultValue={selectedOrder.status || "Processing"}
                      onValueChange={(value) => handleStatusUpdate(selectedOrder.$id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-medium mb-2">Payment Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p>Razorpay</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment ID</p>
                      <p>{selectedOrder.paymentDetails?.paymentId || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="font-semibold">₹{selectedOrder.amount?.total.toFixed(2) || "0.00"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Details */}
              <div>
                <h3 className="text-lg font-medium mb-2">Shipping Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{selectedOrder.shippingAddress?.fullName}</p>
                  <p>{selectedOrder.shippingAddress?.addressLine1}</p>
                  {selectedOrder.shippingAddress?.addressLine2 && (
                    <p>{selectedOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}
                  </p>
                  <p>{selectedOrder.shippingAddress?.country}</p>
                  <p className="mt-2">
                    {selectedOrder.shippingAddress?.phone} | {selectedOrder.shippingAddress?.email}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium mb-2">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items?.map((item: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-10 h-10 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <div className="text-xs text-gray-500">
                                  {item.color && <span>Color: {item.color} | </span>}
                                  {item.size && <span>Size: {item.size}</span>}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{(item.discount_price || item.price).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            ₹{((item.discount_price || item.price) * item.quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <p>Subtotal</p>
                  <p>₹{selectedOrder.amount?.subtotal.toFixed(2) || "0.00"}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p>Shipping</p>
                  <p>{selectedOrder.amount?.shipping === 0 ? "Free" : `₹${selectedOrder.amount?.shipping.toFixed(2)}`}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p>Tax</p>
                  <p>₹{selectedOrder.amount?.tax.toFixed(2) || "0.00"}</p>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <p>Total</p>
                  <p>₹{selectedOrder.amount?.total.toFixed(2) || "0.00"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
