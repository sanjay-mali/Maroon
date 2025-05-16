'use client';

import { getOrderById, updateOrderStatus } from '@/lib/appwrite';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Order {
  $id: string;
  userId: string;
  totalAmount: number;
  status: string;
  items: any[]; // You might want to define a more specific type for items
  [key: string]: any
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      const orderData = await getOrderById(id as string);

      setOrder(orderData);
    };
    fetchOrder();
  }, [id]);
  
  useEffect(() => {
    if (order) {
      
    }
  }, [order]);

  const handleStatusChange = async (status: string) => {
    const success = await updateOrderStatus(id as string, status);
    if(success){
      toast({
        title: 'Success',
        description: 'Order status updated',
      });
      setOrder({...order, status})
    } else {
      toast({
        title: 'Error',
        description: 'There was an error updating the order status',
        variant: 'destructive'
      });
    }
  };

  return (
    <div>
      <h1>Order Details</h1>
      {order ? (
        <>
          <p>Order ID: {order.$id}</p>
          <p>User ID: {order.userId}</p>
          <p>Total Amount: {order.totalAmount}</p>
          <p>Items: {JSON.stringify(order.items)}</p>
          <Select onValueChange={handleStatusChange} defaultValue={order.status} value={order.status}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          <p>Status: {order.status}</p>
        </>
      ) : <p>Loading</p>}
    </div>
  );
}