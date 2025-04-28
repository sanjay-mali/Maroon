import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getAllOrders } from '@/lib/appwrite';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getAllOrders();
      if (data) {
        setOrders(data);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.$id}>
            Order ID: {order.$id}, Status: {order.status}
            <Link href={`/admin/orders/${order.$id}`}>
              <button>See Details</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrdersPage;